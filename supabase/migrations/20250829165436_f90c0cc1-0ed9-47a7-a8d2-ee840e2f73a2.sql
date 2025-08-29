-- First, drop policies that depend on the function
DROP POLICY IF EXISTS "Users can view contracts they own or participate in" ON public.contracts;

-- Now drop the function
DROP FUNCTION IF EXISTS public.is_contract_participant(uuid);

-- Fix RLS policies for profiles table
DROP POLICY IF EXISTS "Authenticated users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view their own profile" ON public.profiles;

-- Create secure RLS policies for profiles table
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Fix RLS policies for user_wallets table
DROP POLICY IF EXISTS "Authenticated users can view their own wallet" ON public.user_wallets;
DROP POLICY IF EXISTS "Authenticated users can update their own wallet" ON public.user_wallets;
DROP POLICY IF EXISTS "Users can insert their own wallet" ON public.user_wallets;
DROP POLICY IF EXISTS "Users can update their own wallet" ON public.user_wallets;

-- Create secure RLS policies for user_wallets table
CREATE POLICY "Users can view own wallet" 
ON public.user_wallets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet" 
ON public.user_wallets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet" 
ON public.user_wallets 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create helper functions
CREATE OR REPLACE FUNCTION public.check_contract_owner(p_contract_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.contracts
    WHERE id = p_contract_id AND user_id = auth.uid()
  );
$$;

-- Recreate is_contract_participant function with correct parameter naming
CREATE OR REPLACE FUNCTION public.is_contract_participant(p_contract_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.contract_participants cp
    WHERE cp.contract_id = p_contract_id AND cp.user_id = auth.uid()
  );
$$;

-- Fix contract_participants RLS recursion issue
DROP POLICY IF EXISTS "Users can view participants of contracts they're involved in" ON public.contract_participants;
DROP POLICY IF EXISTS "Users can view participations in their contracts" ON public.contract_participants;

-- Create secure policy for contract_participants (non-recursive)
CREATE POLICY "Users can view own participations or contracts they own" 
ON public.contract_participants 
FOR SELECT 
USING (auth.uid() = user_id OR check_contract_owner(contract_id));

-- Recreate the contracts policy that was dropped
CREATE POLICY "Users can view contracts they own or participate in" 
ON public.contracts 
FOR SELECT 
USING ((user_id = auth.uid()) OR is_contract_participant(id));