-- Fix function search path security warnings
-- All functions must have explicit search_path set for security

-- Fix check_rate_limit function
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

-- Fix validate_api_permissions function
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