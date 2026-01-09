-- Fix hash_api_key function to handle parameter type correctly
CREATE OR REPLACE FUNCTION public.hash_api_key(api_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Explicitly cast api_key to text to ensure correct function signature matching
  RETURN encode(digest(api_key::text, 'sha256'), 'hex');
END;
$function$;