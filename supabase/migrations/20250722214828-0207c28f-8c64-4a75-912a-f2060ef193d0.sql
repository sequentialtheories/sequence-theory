-- Update the trigger function to use proper authentication and handle errors better
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_name TEXT;
  wallet_result RECORD;
  service_role_key TEXT;
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
  
  -- Get the service role key from environment (this needs to be set in Supabase)
  service_role_key := current_setting('app.service_role_key', true);
  
  -- If service role key is not available, use anon key as fallback
  IF service_role_key IS NULL OR service_role_key = '' THEN
    service_role_key := current_setting('app.anon_key', true);
  END IF;
  
  -- Call edge function to create wallet with proper authentication
  SELECT INTO wallet_result
    net.http_post(
      url := 'https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1/create-wallet',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || COALESCE(service_role_key, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsZGpobG5zcGhsaXhtenpyZHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMTQyNjgsImV4cCI6MjA2ODU5MDI2OH0.mIYpRjdBedu6VQl4wBUIbNM1WwOAN_vHdKNhF5l4g9o')
      ),
      body := jsonb_build_object('user_id', new.id::text)::text
    ) AS response;
  
  -- Log the result for debugging
  RAISE NOTICE 'Wallet creation response status: %, body: %', 
    (wallet_result.response->>'status')::int, 
    wallet_result.response->>'body';
  
  -- Check if wallet creation was successful
  IF (wallet_result.response->>'status')::int >= 400 THEN
    RAISE WARNING 'Wallet creation failed for user %: %', 
      new.id, 
      wallet_result.response->>'body';
  END IF;
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail user creation
    RAISE WARNING 'Error in handle_new_user for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$function$;
