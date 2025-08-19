-- Add unique constraints and indexes for production security
-- This prevents duplicate wallet entries and improves query performance

-- Add unique constraint to user_wallets table to prevent duplicate wallets per user
-- Note: This should already exist but we'll ensure it's properly indexed
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_wallets_user_id_unique 
ON user_wallets(user_id);

-- Add index for wallet address lookups
CREATE INDEX IF NOT EXISTS idx_user_wallets_wallet_address 
ON user_wallets(wallet_address);

-- Add index for email lookups in user_wallets
CREATE INDEX IF NOT EXISTS idx_user_wallets_email 
ON user_wallets(email);

-- Add unique constraint to profiles.eth_address to ensure one wallet per profile
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_eth_address_unique 
ON profiles(eth_address) 
WHERE eth_address IS NOT NULL;

-- Add index for faster profile lookups by user_id
CREATE INDEX IF NOT EXISTS idx_profiles_user_id 
ON profiles(user_id);

-- Add index for API key performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id_active 
ON api_keys(user_id, is_active) 
WHERE is_active = true;

-- Add composite index for faster API key validation
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash_active 
ON api_keys(key_hash) 
WHERE is_active = true;