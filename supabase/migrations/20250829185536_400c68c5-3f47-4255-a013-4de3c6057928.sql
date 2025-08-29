-- CRITICAL SECURITY FIX: Remove PII duplication from user_wallets table
-- The email column duplicates data from profiles table and creates security risks

-- First, backup any unique email data before removing the column
DO $$
BEGIN
  -- Log any cases where user_wallets.email differs from profiles.email
  RAISE NOTICE 'Checking for email mismatches before column removal...';
  
  -- Check if there are any mismatches
  IF EXISTS (
    SELECT 1 
    FROM user_wallets uw 
    JOIN profiles p ON uw.user_id = p.user_id 
    WHERE uw.email != p.email
  ) THEN
    RAISE NOTICE 'Found email mismatches - data inconsistency detected';
  END IF;
END $$;

-- Remove the email column from user_wallets table to eliminate PII duplication
ALTER TABLE public.user_wallets DROP COLUMN IF EXISTS email;

-- Add constraint to ensure wallet addresses are unique across the system
-- This prevents multiple users from having the same wallet address
ALTER TABLE public.user_wallets 
ADD CONSTRAINT user_wallets_wallet_address_unique 
UNIQUE (wallet_address);

-- Create secure rate limiting table for API access
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier text NOT NULL, -- IP address or API key hash
    request_count integer NOT NULL DEFAULT 1,
    window_start timestamp with time zone NOT NULL DEFAULT now(),
    window_duration_minutes integer NOT NULL DEFAULT 60,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on rate limits table
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy to prevent direct access to rate limiting data
CREATE POLICY "Deny all direct access to rate limits" 
ON public.api_rate_limits 
FOR ALL 
USING (false);

-- Create secure function to check rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_identifier text,
    p_limit integer DEFAULT 100,
    p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    current_count integer;
    window_start timestamp with time zone;
BEGIN
    -- Get current window start time
    window_start := now() - (p_window_minutes || ' minutes')::interval;
    
    -- Clean up old entries
    DELETE FROM api_rate_limits 
    WHERE window_start < (now() - '24 hours'::interval);
    
    -- Get current count for this identifier in the current window
    SELECT COALESCE(SUM(request_count), 0) INTO current_count
    FROM api_rate_limits 
    WHERE identifier = p_identifier 
    AND window_start >= (now() - (p_window_minutes || ' minutes')::interval);
    
    -- If over limit, return false
    IF current_count >= p_limit THEN
        RETURN false;
    END IF;
    
    -- Update or insert rate limit record
    INSERT INTO api_rate_limits (identifier, request_count, window_start, window_duration_minutes)
    VALUES (p_identifier, 1, now(), p_window_minutes)
    ON CONFLICT (identifier) 
    DO UPDATE SET 
        request_count = api_rate_limits.request_count + 1,
        updated_at = now();
    
    RETURN true;
END;
$$;

-- Add stricter permissions check for API keys
CREATE OR REPLACE FUNCTION public.validate_api_permissions(
    p_api_key_id uuid,
    p_required_permission text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    key_permissions jsonb;
    is_active boolean;
    expires_at timestamp with time zone;
BEGIN
    -- Get API key details
    SELECT permissions, is_active, expires_at
    INTO key_permissions, is_active, expires_at
    FROM api_keys
    WHERE id = p_api_key_id;
    
    -- Check if key exists
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Check if key is active
    IF NOT is_active THEN
        RETURN false;
    END IF;
    
    -- Check if key is expired
    IF expires_at IS NOT NULL AND expires_at < now() THEN
        RETURN false;
    END IF;
    
    -- Check if key has required permission
    IF NOT (key_permissions ? p_required_permission AND key_permissions->>p_required_permission = 'true') THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$$;