-- ============================================================
-- INVISIBLE WALLET AUTO-PROVISIONING TRIGGER
-- ============================================================
-- 
-- PURPOSE: Automatically provision a Turnkey wallet when a new user signs up
-- 
-- HOW TO USE:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Copy and paste this entire script
-- 3. Click "Run"
-- 
-- PREREQUISITES:
-- Before running this migration, ensure these secrets are in your Supabase Vault:
-- - TURNKEY_API_PUBLIC_KEY
-- - TURNKEY_API_PRIVATE_KEY  
-- - TURNKEY_ORGANIZATION_ID
--
-- You can add secrets at: Dashboard > Project Settings > Vault
--
-- ============================================================

-- OPTION A: Database Webhook (Recommended for Supabase Pro/Enterprise)
-- ============================================================
-- If you have pg_net extension available, use this approach.
-- This calls the Edge Function directly when a user is created.

-- First, check if pg_net is available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN
    RAISE NOTICE 'pg_net extension is available - using webhook approach';
  ELSE
    RAISE NOTICE 'pg_net extension not available - see alternative approaches below';
  END IF;
END $$;

-- Create the webhook function (requires pg_net)
CREATE OR REPLACE FUNCTION public.trigger_provision_invisible_wallet()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  supabase_url TEXT;
  service_key TEXT;
BEGIN
  -- Get the Supabase URL (adjust if needed)
  supabase_url := 'https://qldjhlnsphlixmzzrdwi.supabase.co';
  
  -- Get service role key from vault
  SELECT decrypted_secret INTO service_key 
  FROM vault.decrypted_secrets 
  WHERE name = 'SUPABASE_SERVICE_ROLE_KEY'
  LIMIT 1;

  -- If vault secret not found, log and exit gracefully
  IF service_key IS NULL THEN
    RAISE WARNING 'SUPABASE_SERVICE_ROLE_KEY not found in vault for user %', NEW.id;
    RETURN NEW;
  END IF;

  -- Call the Edge Function asynchronously
  PERFORM net.http_post(
    url := supabase_url || '/functions/v1/turnkey-invisible-wallet',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    body := jsonb_build_object(
      'user_id', NEW.id::text,
      'email', NEW.email,
      'trigger_source', 'auth_user_created'
    )
  );

  RAISE LOG 'Wallet provisioning triggered for user: %', NEW.id;
  RETURN NEW;
  
EXCEPTION WHEN OTHERS THEN
  -- Don't block user creation if wallet provisioning fails
  RAISE WARNING 'Wallet provisioning trigger failed for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created_provision_wallet ON auth.users;

CREATE TRIGGER on_auth_user_created_provision_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_provision_invisible_wallet();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.trigger_provision_invisible_wallet() TO service_role;

-- Add documentation
COMMENT ON FUNCTION public.trigger_provision_invisible_wallet() IS 
'Automatically provisions a Turnkey invisible wallet when a new user is created.
This trigger fires AFTER INSERT on auth.users and calls the turnkey-invisible-wallet Edge Function.
The wallet creation happens asynchronously and does not block the signup process.';


-- ============================================================
-- OPTION B: Profile Creation Trigger (Alternative)
-- ============================================================
-- If pg_net is not available, you can use this simpler approach
-- that marks users as needing wallet provisioning.
-- The frontend hook will then pick this up and provision the wallet.

-- This creates a flag in the profiles table that the frontend can check
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS wallet_provisioning_needed BOOLEAN DEFAULT true;

-- When a profile is created, mark it as needing wallet provisioning
CREATE OR REPLACE FUNCTION public.on_profile_created_mark_wallet_needed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only mark as needed if no eth_address exists
  IF NEW.eth_address IS NULL THEN
    NEW.wallet_provisioning_needed := true;
  ELSE
    NEW.wallet_provisioning_needed := false;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created_mark_wallet ON public.profiles;

CREATE TRIGGER on_profile_created_mark_wallet
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.on_profile_created_mark_wallet_needed();

-- When eth_address is set, clear the provisioning flag
CREATE OR REPLACE FUNCTION public.on_wallet_provisioned()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.eth_address IS NOT NULL AND (OLD.eth_address IS NULL OR OLD.eth_address != NEW.eth_address) THEN
    NEW.wallet_provisioning_needed := false;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_wallet_provisioned ON public.profiles;

CREATE TRIGGER on_wallet_provisioned
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.on_wallet_provisioned();


-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
-- Run these after applying the migration to verify everything is set up:

-- Check if trigger exists
SELECT tgname, tgenabled 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created_provision_wallet';

-- Check if function exists
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'trigger_provision_invisible_wallet';

-- Check vault secrets (names only, not values!)
SELECT name, created_at 
FROM vault.secrets 
WHERE name IN ('TURNKEY_API_PUBLIC_KEY', 'TURNKEY_API_PRIVATE_KEY', 'TURNKEY_ORGANIZATION_ID', 'SUPABASE_SERVICE_ROLE_KEY');
