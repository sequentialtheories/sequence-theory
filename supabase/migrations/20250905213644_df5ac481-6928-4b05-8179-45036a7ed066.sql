-- SECURITY AUDIT: Check and fix profiles table RLS policies
-- Verify that RLS is enabled and policies are properly restrictive

-- Ensure RLS is enabled on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they are bulletproof
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles; 
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- Create bulletproof SELECT policy - users can ONLY see their own profile
CREATE POLICY "Users can only view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Create bulletproof INSERT policy - users can ONLY create their own profile
CREATE POLICY "Users can only create their own profile"  
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Create bulletproof UPDATE policy - users can ONLY update their own profile
CREATE POLICY "Users can only update their own profile"
ON public.profiles  
FOR UPDATE
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Explicitly deny DELETE operations for data protection
CREATE POLICY "Deny all profile deletions"
ON public.profiles
FOR DELETE
USING (false);

-- Add security comment
COMMENT ON TABLE public.profiles IS 'User profiles with strict RLS - users can only access their own data';

-- Verify no email leakage in any functions that might bypass RLS
-- This is a reminder that any functions using service role must be carefully audited