-- Fix profiles table RLS policies to prevent data exposure
-- Current policies are permissive and might not be restrictive enough

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create restrictive policies that explicitly check authentication
-- and prevent any data exposure even if authentication is bypassed

-- SELECT: Only authenticated users can view their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT 
  TO authenticated
  USING (
    auth.uid() IS NOT NULL 
    AND auth.uid() = user_id
  );

-- INSERT: Only authenticated users can create their own profile
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND auth.uid() = user_id
    AND user_id IS NOT NULL
  );

-- UPDATE: Only authenticated users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IS NOT NULL 
    AND auth.uid() = user_id
  )
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND auth.uid() = user_id
    AND user_id IS NOT NULL
  );

-- Ensure no DELETE operations are allowed (no DELETE policy means DELETE is blocked)
-- Ensure no anonymous access is possible (policies specify TO authenticated)