-- Fix the search path security issue
CREATE OR REPLACE FUNCTION public.hash_api_key(api_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'extensions', 'public'
AS $function$
BEGIN
  -- Direct call to digest function (available in extensions schema)
  RETURN encode(digest(api_key::text, 'sha256'::text), 'hex');
END;
$function$;