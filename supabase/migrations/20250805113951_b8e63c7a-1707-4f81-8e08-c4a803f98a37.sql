-- Fix security warnings by setting search_path for all new functions

-- Update generate_api_key function with secure search_path
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := 'st_';
  i INTEGER;
BEGIN
  FOR i IN 1..32 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Update hash_api_key function with secure search_path
CREATE OR REPLACE FUNCTION public.hash_api_key(api_key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN encode(digest(api_key, 'sha256'), 'hex');
END;
$$;

-- Update validate_api_key function with secure search_path
CREATE OR REPLACE FUNCTION public.validate_api_key(api_key TEXT)
RETURNS TABLE(
  key_id UUID,
  user_id UUID,
  permissions JSONB,
  is_valid BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  key_hash TEXT;
BEGIN
  key_hash := public.hash_api_key(api_key);
  
  RETURN QUERY
  SELECT 
    ak.id,
    ak.user_id,
    ak.permissions,
    (ak.is_active AND (ak.expires_at IS NULL OR ak.expires_at > now())) as is_valid
  FROM public.api_keys ak
  WHERE ak.key_hash = key_hash;
END;
$$;