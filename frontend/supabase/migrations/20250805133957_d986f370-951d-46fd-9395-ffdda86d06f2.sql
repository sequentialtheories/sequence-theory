-- Fix the hash_api_key function with explicit type casting and search path
CREATE OR REPLACE FUNCTION public.hash_api_key(api_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
  -- Explicitly cast to text and use extensions schema if needed
  RETURN encode(digest(api_key::text, 'sha256'::text), 'hex');
EXCEPTION
  WHEN undefined_function THEN
    -- Fallback to extensions schema
    RETURN encode(extensions.digest(api_key::text, 'sha256'::text), 'hex');
END;
$function$;