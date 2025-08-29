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

-- Fix contract_participants RLS recursion issue
DROP POLICY IF EXISTS "Users can view participants of contracts they're involved in" ON public.contract_participants;
DROP POLICY IF EXISTS "Users can view participations in their contracts" ON public.contract_participants;

-- Create helper function to check contract ownership without recursion
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

-- Fix is_contract_participant function to avoid parameter/column name conflict
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

-- Create secure policy for contract_participants
CREATE POLICY "Users can view own participations or contracts they own" 
ON public.contract_participants 
FOR SELECT 
USING (auth.uid() = user_id OR check_contract_owner(contract_id));

-- Add API rate limiting table for persistent rate limits
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid NOT NULL,
  ip_address inet,
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on api_rate_limits
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can manage rate limits
CREATE POLICY "Service role only" ON public.api_rate_limits FOR ALL USING (false);

-- Create index for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_key_ip ON public.api_rate_limits(api_key_id, ip_address);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_window ON public.api_rate_limits(window_start);

-- Function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_api_key_id uuid,
  p_ip_address inet,
  p_limit integer DEFAULT 100,
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_window timestamp with time zone;
  current_count integer;
BEGIN
  current_window := date_trunc('hour', now()) + 
    ((extract(minute from now())::integer / p_window_minutes) * p_window_minutes || ' minutes')::interval;
  
  -- Get current count for this window
  SELECT request_count INTO current_count
  FROM api_rate_limits
  WHERE api_key_id = p_api_key_id 
    AND ip_address = p_ip_address 
    AND window_start = current_window;
  
  -- If no record exists, create one
  IF current_count IS NULL THEN
    INSERT INTO api_rate_limits (api_key_id, ip_address, window_start, request_count)
    VALUES (p_api_key_id, p_ip_address, current_window, 1);
    RETURN true;
  END IF;
  
  -- Check if limit exceeded
  IF current_count >= p_limit THEN
    RETURN false;
  END IF;
  
  -- Increment counter
  UPDATE api_rate_limits 
  SET request_count = request_count + 1, updated_at = now()
  WHERE api_key_id = p_api_key_id 
    AND ip_address = p_ip_address 
    AND window_start = current_window;
  
  RETURN true;
END;
$$;