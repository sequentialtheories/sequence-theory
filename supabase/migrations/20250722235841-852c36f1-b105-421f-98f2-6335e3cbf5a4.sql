-- Drop the existing trigger and function to fix the automatic wallet creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a simplified function that creates wallets directly without HTTP calls
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_name TEXT;
  wallet_address TEXT;
  wallet_config JSONB;
BEGIN
  -- Safely extract name from metadata with proper type casting
  user_name := COALESCE(
    (new.raw_user_meta_data::jsonb ->> 'name')::text,
    ''
  );
  
  -- Insert profile with proper error handling
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id, 
    user_name,
    COALESCE(new.email, '')
  );
  
  -- Generate a deterministic wallet address based on user_id for now
  -- This will be replaced by actual Sequence API call in the edge function
  wallet_address := 'pending_' || new.id::text;
  wallet_config := jsonb_build_object(
    'status', 'pending',
    'created_at', extract(epoch from now())
  );
  
  -- Insert placeholder wallet that will be updated by the edge function
  INSERT INTO public.user_wallets (user_id, wallet_address, wallet_config, network)
  VALUES (
    new.id,
    wallet_address,
    wallet_config,
    'polygon'
  );
  
  -- Trigger wallet creation asynchronously via edge function
  PERFORM pg_notify('create_wallet', new.id::text);
  
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
