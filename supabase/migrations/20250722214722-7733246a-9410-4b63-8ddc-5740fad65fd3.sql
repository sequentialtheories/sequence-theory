-- First, let's drop the existing trigger and function to fix the issue
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a new, more robust function to handle user creation and wallet creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_name TEXT;
  wallet_result RECORD;
BEGIN
  -- Safely extract name from metadata with proper type casting
  user_name := COALESCE(
    (new.raw_user_meta_data::jsonb ->> 'name')::text,
    ''
  );
  
  -- Insert profile with proper error handling
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    new.id, 
    user_name,
    COALESCE(new.email, '')
  );
  
  -- Call edge function to create wallet synchronously
  SELECT INTO wallet_result
    net.http_post(
      url := 'https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1/create-wallet',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('request.jwt.claims', true)::jsonb->>'aud'
      ),
      body := jsonb_build_object('user_id', new.id::text)
    ) AS response;
  
  -- Log the result for debugging
  RAISE NOTICE 'Wallet creation response: %', wallet_result.response;
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail user creation
    RAISE WARNING 'Error in handle_new_user for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$function$;

-- Create the trigger to fire AFTER user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();