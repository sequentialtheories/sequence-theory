-- Add wallet provenance and integrity constraints
-- This prevents synthetic/deterministic wallet addresses

-- Create wallet provenance enum
CREATE TYPE wallet_provenance AS ENUM ('sequence_embedded', 'user_provided_verified');

-- Add provenance and created_via columns to user_wallets
ALTER TABLE user_wallets
  ADD COLUMN provenance wallet_provenance NOT NULL DEFAULT 'sequence_embedded',
  ADD COLUMN created_via TEXT NOT NULL DEFAULT 'sequence';

-- Add EVM address format validation
ALTER TABLE user_wallets
  ADD CONSTRAINT chk_wallet_format
  CHECK (wallet_address ~* '^0x[0-9a-f]{40}$');

-- Reject known synthetic patterns (placeholder addresses)
ALTER TABLE user_wallets
  ADD CONSTRAINT chk_wallet_not_synthetic
  CHECK (wallet_address !~* '^0x(00){20}$');

-- Fix function search paths for security
DROP FUNCTION IF EXISTS public.update_updated_at_column();
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
STABLE
SET search_path = public, extensions
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix other flagged functions with immutable search_path
DROP FUNCTION IF EXISTS public.handle_new_user();
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, email, name, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;