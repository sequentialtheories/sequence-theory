-- Safely add missing provider column and constraints to user_wallets table

-- 1. Add provider column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_wallets' 
    AND column_name = 'provider'
  ) THEN
    ALTER TABLE user_wallets ADD COLUMN provider text NOT NULL DEFAULT 'sequence_waas';
  END IF;
END $$;

-- 2. Add unique constraint on user_id if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'user_wallets' 
    AND constraint_name = 'user_wallets_user_id_unique'
  ) THEN
    ALTER TABLE user_wallets ADD CONSTRAINT user_wallets_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

-- 3. Add unique index on wallet address if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'user_wallets' 
    AND indexname = 'user_wallets_address_unique'
  ) THEN
    CREATE UNIQUE INDEX user_wallets_address_unique ON user_wallets (lower(wallet_address));
  END IF;
END $$;