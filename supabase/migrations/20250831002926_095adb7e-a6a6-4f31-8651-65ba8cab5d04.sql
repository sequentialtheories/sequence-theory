-- Fix rate limiter function with proper variable scoping
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
    AND api_rate_limits.window_start >= (now() - (p_window_minutes || ' minutes')::interval);
    
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