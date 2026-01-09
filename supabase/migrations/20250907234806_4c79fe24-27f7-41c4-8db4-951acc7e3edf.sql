-- Add turnkey provider to wallet_provenance enum
ALTER TYPE wallet_provenance ADD VALUE 'turnkey_embedded';

-- Add turnkey_sub_org_id column to user_wallets table
ALTER TABLE public.user_wallets 
ADD COLUMN turnkey_sub_org_id text;