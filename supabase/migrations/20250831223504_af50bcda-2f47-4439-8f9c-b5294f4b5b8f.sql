-- Security fixes for database functions and settings

-- 1. Fix function search_path issues by making all functions have explicit search_path
-- Update existing functions to have proper search_path settings

-- Update generate_api_key function with cryptographically stronger generation and search_path
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

-- Update validate_api_key function with proper search_path
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

-- Update hash_api_key function with proper search_path
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

-- Add explicit RLS policy for API keys table to prevent unauthorized access
DROP POLICY IF EXISTS "API keys owner access only" ON public.api_keys;
CREATE POLICY "API keys owner access only" 
ON public.api_keys 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create a more restrictive policy for API key validation
CREATE OR REPLACE FUNCTION public.can_access_api_keys()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT auth.uid() IS NOT NULL;
$function$;

-- Update other functions to have proper search_path
CREATE OR REPLACE FUNCTION public.check_rate_limit(p_identifier text, p_limit integer DEFAULT 100, p_window_minutes integer DEFAULT 60)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- Add audit logging for API key creation/modification
CREATE OR REPLACE FUNCTION public.log_api_key_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Log API key creation/updates for security monitoring
  INSERT INTO api_access_logs (
    api_key_id,
    endpoint,
    request_data,
    response_status,
    ip_address
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'API_KEY_CREATED'
      WHEN TG_OP = 'UPDATE' THEN 'API_KEY_UPDATED'
      WHEN TG_OP = 'DELETE' THEN 'API_KEY_DELETED'
    END,
    jsonb_build_object(
      'operation', TG_OP,
      'permissions', COALESCE(NEW.permissions, OLD.permissions),
      'is_active', COALESCE(NEW.is_active, OLD.is_active)
    ),
    200,
    '127.0.0.1'::inet
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create trigger for API key changes
DROP TRIGGER IF EXISTS api_key_audit_trigger ON public.api_keys;
CREATE TRIGGER api_key_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.api_keys
  FOR EACH ROW EXECUTE FUNCTION public.log_api_key_changes();