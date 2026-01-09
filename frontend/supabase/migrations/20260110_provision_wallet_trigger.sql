-- ============================================================
-- SAFE INVISIBLE WALLET TRIGGER MIGRATION
-- ============================================================
-- 
-- This migration adds wallet provisioning capability WITHOUT
-- breaking user signup if something goes wrong.
--
-- Key safety features:
-- 1. All errors are caught and logged, never thrown
-- 2. Wallet provisioning failure does NOT block user creation
-- 3. Frontend hook provides fallback if trigger doesn't fire
--
-- HOW TO USE:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Copy and paste this entire script
-- 3. Click "Run"
-- ============================================================

-- First, remove any problematic triggers that might be blocking signups
DROP TRIGGER IF EXISTS on_auth_user_created_provision_wallet ON auth.users;
DROP FUNCTION IF EXISTS public.trigger_provision_invisible_wallet();

-- Drop the wallet_provisioning_needed column and related triggers if they exist
-- (These were added in a previous migration but may cause issues)
DROP TRIGGER IF EXISTS on_profile_created_mark_wallet ON public.profiles;
DROP TRIGGER IF EXISTS on_wallet_provisioned ON public.profiles;
DROP FUNCTION IF EXISTS public.on_profile_created_mark_wallet_needed();
DROP FUNCTION IF EXISTS public.on_wallet_provisioned();

-- Remove the wallet_provisioning_needed column if it exists
ALTER TABLE public.profiles DROP COLUMN IF EXISTS wallet_provisioning_needed;

-- ============================================================
-- SAFE WALLET PROVISIONING (Async, Non-Blocking)
-- ============================================================
-- This approach uses the frontend hook (useInvisibleWallet) as the
-- primary mechanism. The hook runs after successful login and
-- provisions the wallet in the background.
--
-- Benefits:
-- - User signup NEVER fails due to wallet issues
-- - Wallet is created within seconds of first login
-- - If Turnkey is down, user can still sign up and use the app
-- ============================================================

-- Ensure the handle_new_user function is robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile with error handling
  BEGIN
    INSERT INTO public.profiles (id, user_id, email, name, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      NEW.id,
      COALESCE(NEW.email, ''),
      COALESCE(
        NEW.raw_user_meta_data->>'name', 
        NEW.raw_user_meta_data->>'full_name', 
        split_part(COALESCE(NEW.email, 'user'), '@', 1)
      ),
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger (in case it was modified)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- OPTIONAL: Database webhook for automatic wallet provisioning
-- ============================================================
-- Uncomment the section below ONLY if:
-- 1. You have pg_net extension enabled (Supabase Pro)
-- 2. You have SUPABASE_SERVICE_ROLE_KEY in your vault
-- 3. You've tested that the Edge Function works
--
-- To enable, run this separately after confirming the above:
/*
CREATE OR REPLACE FUNCTION public.async_provision_wallet()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  service_key TEXT;
BEGIN
  -- Get service role key from vault (must be set up first)
  SELECT decrypted_secret INTO service_key 
  FROM vault.decrypted_secrets 
  WHERE name = 'SUPABASE_SERVICE_ROLE_KEY'
  LIMIT 1;

  -- Only proceed if we have the key
  IF service_key IS NOT NULL THEN
    -- Fire and forget - don't wait for response
    PERFORM net.http_post(
      url := 'https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1/turnkey-invisible-wallet',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_key
      ),
      body := jsonb_build_object(
        'user_id', NEW.id::text,
        'email', COALESCE(NEW.email, ''),
        'trigger_source', 'db_trigger'
      )
    );
  END IF;

  -- Always return NEW to allow the insert to proceed
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log but never fail
  RAISE WARNING 'Wallet provisioning trigger failed for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_provision_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.async_provision_wallet();
*/

-- ============================================================
-- VERIFICATION
-- ============================================================
-- Run these to verify the setup:

-- Check triggers on auth.users
SELECT tgname, tgenabled, tgtype 
FROM pg_trigger 
WHERE tgrelid = 'auth.users'::regclass;

-- Check the handle_new_user function exists
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user' AND routine_schema = 'public';

-- Test that profiles table has correct columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public';
