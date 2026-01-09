-- Add turnkey_invisible to wallet_provenance enum
ALTER TYPE wallet_provenance ADD VALUE IF NOT EXISTS 'turnkey_invisible';