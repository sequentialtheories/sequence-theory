-- Fix forum table RLS policies to be more restrictive
-- Currently forum_posts and forum_replies allow anyone to read (true policy)

-- Update forum_posts RLS policy to require authentication
DROP POLICY IF EXISTS "read_posts" ON public.forum_posts;
CREATE POLICY "read_posts" ON public.forum_posts
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Update forum_replies RLS policy to require authentication  
DROP POLICY IF EXISTS "read_replies" ON public.forum_replies;
CREATE POLICY "read_replies" ON public.forum_replies
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Fix function search_path issues by updating existing functions
-- Update generate_api_key function
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := 'st_';
  random_bytes bytea;
  i INTEGER;
BEGIN
  -- Use cryptographically secure random generation with more entropy
  random_bytes := gen_random_bytes(32);
  
  FOR i IN 0..31 LOOP
    result := result || substr(chars, (get_byte(random_bytes, i) % length(chars)) + 1, 1);
  END LOOP;
  
  RETURN result;
END;
$function$;

-- Update hash_api_key function
CREATE OR REPLACE FUNCTION public.hash_api_key(api_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Use extensions schema explicitly for digest function
  RETURN encode(extensions.digest(api_key::text, 'sha256'::text), 'hex');
END;
$function$;

-- Update validate_api_key function
CREATE OR REPLACE FUNCTION public.validate_api_key(input_api_key text)
RETURNS TABLE(key_id uuid, user_id uuid, permissions jsonb, is_valid boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  computed_key_hash TEXT;
BEGIN
  computed_key_hash := public.hash_api_key(input_api_key);
  
  RETURN QUERY
  SELECT 
    ak.id,
    ak.user_id,
    ak.permissions,
    (ak.is_active AND (ak.expires_at IS NULL OR ak.expires_at > now())) as is_valid
  FROM public.api_keys ak
  WHERE ak.key_hash = computed_key_hash;
END;
$function$;

-- Add enhanced rate limiting function for public API endpoints
CREATE OR REPLACE FUNCTION public.check_enhanced_rate_limit(
  p_identifier text, 
  p_limit integer DEFAULT 10, 
  p_window_minutes integer DEFAULT 60,
  p_burst_limit integer DEFAULT 3,
  p_burst_window_minutes integer DEFAULT 1
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    current_count integer;
    burst_count integer;
    window_start timestamp with time zone;
    burst_window_start timestamp with time zone;
BEGIN
    -- Get current window start times
    window_start := now() - (p_window_minutes || ' minutes')::interval;
    burst_window_start := now() - (p_burst_window_minutes || ' minutes')::interval;
    
    -- Clean up old entries (older than 24 hours)
    DELETE FROM api_rate_limits 
    WHERE window_start < (now() - '24 hours'::interval);
    
    -- Check burst limit (short window, lower limit)
    SELECT COALESCE(SUM(request_count), 0) INTO burst_count
    FROM api_rate_limits 
    WHERE identifier = p_identifier 
    AND api_rate_limits.window_start >= burst_window_start;
    
    IF burst_count >= p_burst_limit THEN
        RETURN false;
    END IF;
    
    -- Check main rate limit (longer window, higher limit)
    SELECT COALESCE(SUM(request_count), 0) INTO current_count
    FROM api_rate_limits 
    WHERE identifier = p_identifier 
    AND api_rate_limits.window_start >= window_start;
    
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
$function$;