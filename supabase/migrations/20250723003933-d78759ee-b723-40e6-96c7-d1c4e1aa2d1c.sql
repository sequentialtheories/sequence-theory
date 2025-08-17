-- Remove the automatic wallet creation trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Modify the handle_new_user function to NOT create wallets automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_name TEXT;
BEGIN
  -- Safely extract name from metadata with proper type casting
  user_name := COALESCE(
    (new.raw_user_meta_data::jsonb ->> 'name')::text,
    ''
  );
  
  -- Insert profile only - NO wallet creation
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id, 
    user_name,
    COALESCE(new.email, '')
  );
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail user creation
    RAISE WARNING 'Error in handle_new_user for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$function$;

-- Re-create the trigger but only for profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
