-- ============================================================
-- INVISIBLE WALLET TRIGGER MIGRATION
-- Purpose: Automatically provision Turnkey wallet when user signs up
-- ============================================================

-- IMPORTANT: This migration creates a database webhook trigger
-- that fires when a new user is created in auth.users.
-- The webhook will call the turnkey-invisible-wallet Edge Function.

-- Step 1: Enable the pg_net extension for HTTP calls (if not already enabled)
-- Note: This may already be enabled in your Supabase project
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Step 2: Create the function that will be called by the trigger
CREATE OR REPLACE FUNCTION public.provision_invisible_wallet()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  supabase_url TEXT;
  service_role_key TEXT;
  request_id BIGINT;
BEGIN
  -- Get Supabase URL and service role key from vault secrets
  -- These should be stored in your Supabase Vault
  SELECT decrypted_secret INTO supabase_url 
  FROM vault.decrypted_secrets 
  WHERE name = 'SUPABASE_URL';
  
  SELECT decrypted_secret INTO service_role_key 
  FROM vault.decrypted_secrets 
  WHERE name = 'SUPABASE_SERVICE_ROLE_KEY';

  -- If vault secrets aren't set, use environment defaults
  IF supabase_url IS NULL THEN
    supabase_url := current_setting('app.settings.supabase_url', true);
  END IF;
  
  IF service_role_key IS NULL THEN
    service_role_key := current_setting('app.settings.service_role_key', true);
  END IF;

  -- Log the trigger execution
  RAISE LOG 'provision_invisible_wallet triggered for user: %', NEW.id;

  -- Call the Edge Function asynchronously using pg_net
  -- The Edge Function will handle the actual Turnkey wallet creation
  SELECT INTO request_id net.http_post(
    url := supabase_url || '/functions/v1/turnkey-invisible-wallet',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := jsonb_build_object(
      'user_id', NEW.id,
      'email', NEW.email,
      'trigger_source', 'auth_user_created'
    ),
    timeout_milliseconds := 30000
  );

  RAISE LOG 'provision_invisible_wallet HTTP request sent, request_id: %', request_id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't block user creation
  RAISE WARNING 'provision_invisible_wallet failed for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Step 3: Create the trigger on auth.users
-- This fires AFTER a new user is inserted
DROP TRIGGER IF EXISTS on_auth_user_created_provision_wallet ON auth.users;

CREATE TRIGGER on_auth_user_created_provision_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.provision_invisible_wallet();

-- Step 4: Grant necessary permissions
GRANT USAGE ON SCHEMA extensions TO postgres, service_role;
GRANT EXECUTE ON FUNCTION public.provision_invisible_wallet() TO postgres, service_role;

-- Step 5: Add comment for documentation
COMMENT ON FUNCTION public.provision_invisible_wallet() IS 
'Automatically provisions a Turnkey invisible wallet for new users. 
This function is triggered when a new row is inserted into auth.users. 
It calls the turnkey-invisible-wallet Edge Function asynchronously.';

COMMENT ON TRIGGER on_auth_user_created_provision_wallet ON auth.users IS
'Trigger that provisions an invisible Turnkey wallet immediately when a new user signs up.';
