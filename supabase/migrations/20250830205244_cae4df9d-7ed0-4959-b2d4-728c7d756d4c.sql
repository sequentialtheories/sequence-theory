-- Add the missing provider column that's required by the edge function
ALTER TABLE user_wallets ADD COLUMN provider text NOT NULL DEFAULT 'sequence_waas';