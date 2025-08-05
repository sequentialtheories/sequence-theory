-- Drop and recreate the validate_api_key function to fix parameter naming
DROP FUNCTION IF EXISTS public.validate_api_key(text);

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