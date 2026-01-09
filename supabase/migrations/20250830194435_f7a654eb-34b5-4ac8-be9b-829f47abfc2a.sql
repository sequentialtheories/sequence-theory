-- Add email column to profiles table and add proper constraints
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- Add unique constraints for data integrity
ALTER TABLE public.user_wallets ADD CONSTRAINT unique_user_wallet UNIQUE (user_id);
ALTER TABLE public.profiles ADD CONSTRAINT unique_user_profile UNIQUE (user_id);

-- Update profiles table to ensure email is populated from auth users
CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.profiles 
  SET email = au.email
  FROM auth.users au
  WHERE profiles.user_id = au.id
  AND profiles.email IS NULL;
END;
$$;

-- Run the sync function
SELECT public.sync_user_email();