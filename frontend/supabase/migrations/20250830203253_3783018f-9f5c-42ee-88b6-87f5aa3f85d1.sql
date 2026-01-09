-- Add missing provider column to user_wallets table
ALTER TABLE user_wallets 
ADD COLUMN provider text NOT NULL DEFAULT 'sequence_waas';

-- Add unique constraints to prevent duplicate wallets
ALTER TABLE user_wallets 
ADD CONSTRAINT user_wallets_user_id_unique UNIQUE (user_id);

-- Add unique index for wallet addresses (case-insensitive)
CREATE UNIQUE INDEX user_wallets_address_unique 
ON user_wallets (lower(wallet_address));