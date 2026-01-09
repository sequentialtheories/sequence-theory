-- Add Turnkey-specific columns to user_wallets table
ALTER TABLE user_wallets 
ADD COLUMN IF NOT EXISTS turnkey_sub_org_id TEXT,
ADD COLUMN IF NOT EXISTS turnkey_wallet_id TEXT,
ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMP WITH TIME ZONE;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_wallets_turnkey_sub_org 
ON user_wallets(turnkey_sub_org_id);

-- Add comments for documentation
COMMENT ON COLUMN user_wallets.turnkey_sub_org_id IS 'Turnkey sub-organization ID for non-custodial wallet';
COMMENT ON COLUMN user_wallets.turnkey_wallet_id IS 'Turnkey wallet ID within the sub-organization';
COMMENT ON COLUMN user_wallets.last_used_at IS 'Last transaction timestamp for activity tracking';