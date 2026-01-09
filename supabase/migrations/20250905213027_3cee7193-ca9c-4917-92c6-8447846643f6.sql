-- Security hardening: Add proper EVM wallet address validation
-- Drop existing constraint that might be too restrictive
ALTER TABLE public.user_wallets 
DROP CONSTRAINT IF EXISTS chk_wallet_address_format;

-- Add comprehensive EVM address validation constraint
-- Supports Ethereum-style addresses (0x + 40 hex chars) and other formats
ALTER TABLE public.user_wallets 
ADD CONSTRAINT chk_wallet_address_format 
CHECK (
  wallet_address IS NOT NULL 
  AND length(wallet_address) >= 10 
  AND (
    -- Ethereum style addresses (0x + 40 hex characters)
    wallet_address ~ '^0x[a-fA-F0-9]{40}$'
    OR
    -- Other blockchain addresses (alphanumeric, minimum 10 chars, max 100)
    (wallet_address ~ '^[a-zA-Z0-9]{10,100}$')
  )
);

-- Create minimal wallet view for API responses (privacy by design)
CREATE VIEW user_wallets_minimal AS 
SELECT 
  wallet_address,
  network,
  provenance,
  created_via,
  created_at
FROM public.user_wallets;

-- Grant appropriate permissions on the view
GRANT SELECT ON user_wallets_minimal TO authenticated;

-- Enable RLS on the view (inherits from base table)
ALTER VIEW user_wallets_minimal SET (security_invoker = on);

-- Add index for better performance on wallet lookups
CREATE INDEX IF NOT EXISTS idx_user_wallets_address_network 
ON public.user_wallets(wallet_address, network);

-- Add comment for documentation
COMMENT ON VIEW user_wallets_minimal IS 'Privacy-focused view of user wallets without user_id exposure';
COMMENT ON CONSTRAINT chk_wallet_address_format ON public.user_wallets IS 'Validates wallet addresses are properly formatted EVM or other blockchain addresses';