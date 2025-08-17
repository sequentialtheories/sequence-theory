-- PHASE 1: Critical Database Security Fixes

-- First, fix the dangerous RLS policies that allow anonymous access
-- Drop and recreate profiles policies with proper authentication checks
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create secure policies that require authentication
CREATE POLICY "Authenticated users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Fix the extremely dangerous wallet policies
DROP POLICY IF EXISTS "Users can view their own wallet" ON public.user_wallets;
DROP POLICY IF EXISTS "Users can update their own wallet" ON public.user_wallets;
DROP POLICY IF EXISTS "System can insert wallets" ON public.user_wallets;

-- Create secure wallet policies
CREATE POLICY "Authenticated users can view their own wallet" 
ON public.user_wallets 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own wallet" 
ON public.user_wallets 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Create a secure service role policy for wallet creation (only for system operations)
CREATE POLICY "Service role can insert wallets"
ON public.user_wallets
FOR INSERT
WITH CHECK (
  current_setting('role') = 'service_role' OR 
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
);

-- Fix the handle_new_user function to avoid the text ->> unknown error
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
  user_name TEXT;
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
  
  -- Call edge function to create wallet (async) with proper error handling
  BEGIN
    PERFORM net.http_post(
      url := 'https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1/create-wallet',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('request.jwt.claims')::jsonb->>'aud'
      ),
      body := jsonb_build_object('user_id', new.id)::text
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error but don't fail user creation
      RAISE WARNING 'Failed to create wallet for user %: %', new.id, SQLERRM;
  END;
  
  RETURN new;
END;
$$;
