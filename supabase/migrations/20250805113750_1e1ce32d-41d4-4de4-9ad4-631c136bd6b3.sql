-- Create API keys table for external access management
CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{"read_wallet": true}',
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create API access logs table for security monitoring
CREATE TABLE public.api_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  request_data JSONB,
  response_status INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_access_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for api_keys
CREATE POLICY "Users can manage their own API keys" 
ON public.api_keys 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS policies for api_access_logs  
CREATE POLICY "Users can view their own API logs" 
ON public.api_access_logs 
FOR SELECT 
USING (
  api_key_id IN (
    SELECT id FROM public.api_keys WHERE user_id = auth.uid()
  )
);

-- Admins can view all logs
CREATE POLICY "Admins can view all API logs" 
ON public.api_access_logs 
FOR SELECT 
USING (
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN has_role(auth.uid(), 'admin'::app_role)
    ELSE false
  END
);

-- Create function to generate API key
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to hash API key
CREATE OR REPLACE FUNCTION public.hash_api_key(api_key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(digest(api_key, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to validate API key
CREATE OR REPLACE FUNCTION public.validate_api_key(api_key TEXT)
RETURNS TABLE(
  key_id UUID,
  user_id UUID,
  permissions JSONB,
  is_valid BOOLEAN
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update updated_at column
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON public.api_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_hash ON public.api_keys(key_hash);
CREATE INDEX idx_api_access_logs_api_key_id ON public.api_access_logs(api_key_id);
CREATE INDEX idx_api_access_logs_created_at ON public.api_access_logs(created_at);
