-- Create admin roles system to replace hardcoded admin emails
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS issues)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get current user's role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = auth.uid()
  ORDER BY CASE WHEN role = 'admin' THEN 1 ELSE 2 END
  LIMIT 1
$$;

-- Create RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Remove private key from wallet_config for security
-- Create new table for secure private key storage (server-side only)
CREATE TABLE public.wallet_private_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  encrypted_private_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on wallet_private_keys - NO client access policies!
ALTER TABLE public.wallet_private_keys ENABLE ROW LEVEL SECURITY;

-- No RLS policies = no client access, only server-side edge functions can access

-- Create function to safely move existing private keys to secure storage
CREATE OR REPLACE FUNCTION public.migrate_private_keys()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  wallet_record RECORD;
  private_key_value TEXT;
BEGIN
  -- Loop through all wallets that have private keys in wallet_config
  FOR wallet_record IN 
    SELECT user_id, wallet_config 
    FROM public.user_wallets 
    WHERE wallet_config ? 'private_key'
  LOOP
    -- Extract private key
    private_key_value := wallet_record.wallet_config->>'private_key';
    
    -- Insert into secure storage (encrypted storage should be handled by edge function)
    INSERT INTO public.wallet_private_keys (user_id, encrypted_private_key)
    VALUES (wallet_record.user_id, private_key_value)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Remove private key from wallet_config
    UPDATE public.user_wallets 
    SET wallet_config = wallet_config - 'private_key'
    WHERE user_id = wallet_record.user_id;
  END LOOP;
END;
$$;

-- Execute the migration
SELECT public.migrate_private_keys();

-- Insert admin role for the hardcoded admin email
-- First, find the user ID for the admin email
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Find user ID for admin email from profiles table
  SELECT user_id INTO admin_user_id
  FROM public.profiles
  WHERE email = 'deathrider1215@gmail.com'
  LIMIT 1;
  
  -- Insert admin role if user exists
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;