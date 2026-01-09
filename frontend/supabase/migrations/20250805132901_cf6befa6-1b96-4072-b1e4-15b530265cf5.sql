-- Fix hash_api_key function with proper type handling for pgcrypto digest
CREATE OR REPLACE FUNCTION public.hash_api_key(api_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Use the text, text version of digest which is available
  RETURN encode(digest(api_key, 'sha256'), 'hex');
END;
$function$;