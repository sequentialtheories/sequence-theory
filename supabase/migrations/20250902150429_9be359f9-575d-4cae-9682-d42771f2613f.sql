-- Safe migration: Create new function versions first, then swap triggers

-- Create wallet provenance enum
DO $$ BEGIN
  CREATE TYPE wallet_provenance AS ENUM ('sequence_embedded', 'user_provided_verified');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add provenance and created_via columns to user_wallets
ALTER TABLE user_wallets
  ADD COLUMN IF NOT EXISTS provenance wallet_provenance NOT NULL DEFAULT 'sequence_embedded',
  ADD COLUMN IF NOT EXISTS created_via TEXT NOT NULL DEFAULT 'sequence';

-- Clean up synthetic/placeholder wallet addresses
DELETE FROM user_wallets WHERE wallet_address LIKE 'pending_%';
DELETE FROM user_wallets WHERE wallet_address = '0x0000000000000000000000000000000000000000';

-- Add EVM address format validation (only for valid EVM addresses)
ALTER TABLE user_wallets
  ADD CONSTRAINT chk_wallet_format
  CHECK (wallet_address ~* '^0x[0-9a-f]{40}$');

-- Reject known synthetic patterns
ALTER TABLE user_wallets
  ADD CONSTRAINT chk_wallet_not_synthetic
  CHECK (wallet_address !~* '^0x(00){20}$' AND wallet_address !~ '^pending_');

-- Create new version of update_updated_at_column with secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column_v2()
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

-- Create new version of handle_new_user with secure search_path
CREATE OR REPLACE FUNCTION public.handle_new_user_v2()
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

-- Update triggers to use new functions
DO $$
DECLARE
    trigger_rec RECORD;
BEGIN
    -- Find all triggers using the old update_updated_at_column function
    FOR trigger_rec IN 
        SELECT n.nspname as schema_name, c.relname as table_name, t.tgname as trigger_name
        FROM pg_trigger t
        JOIN pg_class c ON t.tgrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        JOIN pg_proc p ON t.tgfoid = p.oid
        WHERE p.proname = 'update_updated_at_column'
        AND n.nspname = 'public'
        AND NOT t.tgisinternal
    LOOP
        -- Drop old trigger and create new one with v2 function
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I.%I', 
            trigger_rec.trigger_name, trigger_rec.schema_name, trigger_rec.table_name);
        EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE ON %I.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column_v2()', 
            trigger_rec.trigger_name, trigger_rec.schema_name, trigger_rec.table_name);
    END LOOP;

    -- Find all triggers using the old handle_new_user function
    FOR trigger_rec IN 
        SELECT n.nspname as schema_name, c.relname as table_name, t.tgname as trigger_name
        FROM pg_trigger t
        JOIN pg_class c ON t.tgrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        JOIN pg_proc p ON t.tgfoid = p.oid
        WHERE p.proname = 'handle_new_user'
        AND n.nspname = 'public'
        AND NOT t.tgisinternal
    LOOP
        -- Drop old trigger and create new one with v2 function
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I.%I', 
            trigger_rec.trigger_name, trigger_rec.schema_name, trigger_rec.table_name);
        EXECUTE format('CREATE TRIGGER %I AFTER INSERT ON %I.%I FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_v2()', 
            trigger_rec.trigger_name, trigger_rec.schema_name, trigger_rec.table_name);
    END LOOP;
END $$;

-- Now safely drop the old functions
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Rename the new functions to the original names
ALTER FUNCTION public.update_updated_at_column_v2() RENAME TO update_updated_at_column;
ALTER FUNCTION public.handle_new_user_v2() RENAME TO handle_new_user;