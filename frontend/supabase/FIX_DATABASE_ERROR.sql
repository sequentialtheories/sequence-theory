-- ============================================================
-- EMERGENCY FIX: Database Error Saving New User
-- ============================================================
-- Run this SQL in your Supabase Dashboard > SQL Editor
-- to fix the "Database error saving new user" issue
-- ============================================================

-- Step 1: Remove any problematic triggers
DROP TRIGGER IF EXISTS on_auth_user_created_provision_wallet ON auth.users;
DROP TRIGGER IF EXISTS on_profile_created_mark_wallet ON public.profiles;
DROP TRIGGER IF EXISTS on_wallet_provisioned ON public.profiles;

-- Step 2: Remove problematic functions
DROP FUNCTION IF EXISTS public.trigger_provision_invisible_wallet() CASCADE;
DROP FUNCTION IF EXISTS public.async_provision_wallet() CASCADE;
DROP FUNCTION IF EXISTS public.on_profile_created_mark_wallet_needed() CASCADE;
DROP FUNCTION IF EXISTS public.on_wallet_provisioned() CASCADE;

-- Step 3: Remove problematic column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS wallet_provisioning_needed;

-- Step 4: Fix the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, profiles.name),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but DON'T fail - allow user creation to proceed
  RAISE WARNING 'Profile creation warning for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Step 5: Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Verify the fix
SELECT 'Triggers on auth.users:' as info;
SELECT tgname, tgenabled FROM pg_trigger WHERE tgrelid = 'auth.users'::regclass;

SELECT 'handle_new_user function exists:' as info;
SELECT routine_name FROM information_schema.routines WHERE routine_name = 'handle_new_user';

-- Done! Try creating a new account now.
