-- Completely recreate hash_api_key function with explicit schema reference
DROP FUNCTION IF EXISTS public.hash_api_key(text);

CREATE OR REPLACE FUNCTION public.hash_api_key(api_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Direct call to extensions.digest function
  RETURN encode(extensions.digest(api_key::text, 'sha256'::text), 'hex');
END;
$function$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.hash_api_key(text) TO anon, authenticated, service_role;