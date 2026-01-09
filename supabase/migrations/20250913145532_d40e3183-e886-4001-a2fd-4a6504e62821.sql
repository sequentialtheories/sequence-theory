-- Remove all fake wallet data and clean up schema
DELETE FROM user_wallets WHERE provider IN ('turnkey', 'sequence_waas', 'sequence');

-- Remove turnkey_sub_org_id column
ALTER TABLE user_wallets DROP COLUMN IF EXISTS turnkey_sub_org_id;

-- Clean up wallet_provenance enum by removing turnkey_embedded
-- First create new enum without turnkey_embedded
CREATE TYPE wallet_provenance_new AS ENUM ('sequence_embedded', 'external_import', 'self_custody');

-- Update the column to use new enum
ALTER TABLE user_wallets ALTER COLUMN provenance TYPE wallet_provenance_new USING provenance::text::wallet_provenance_new;

-- Drop old enum and rename new one
DROP TYPE wallet_provenance;
ALTER TYPE wallet_provenance_new RENAME TO wallet_provenance;