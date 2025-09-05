-- SECURITY FIX: Remove potentially vulnerable view
-- The user_wallets_minimal view cannot implement proper RLS without user_id
-- This creates a security vulnerability where wallet data is publicly accessible

-- Drop the vulnerable view
DROP VIEW IF EXISTS user_wallets_minimal;

-- Remove the comment since view is dropped  
-- The external API already sanitizes responses appropriately by removing user_id
-- No separate view is needed - the base table with RLS provides proper security

-- Verify that base table has proper RLS enabled and policies
-- (This is a comment for documentation - policies already exist)
-- user_wallets table has:
-- - "Wallet owners can view their wallet data" (SELECT using is_wallet_owner(user_id))  
-- - "Wallet owners can insert their wallet data" (INSERT with security checks)
-- - "Wallet owners can update their wallet data" (UPDATE using is_wallet_owner(user_id))
-- - "Wallet owners can delete their wallet data" (DELETE using is_wallet_owner(user_id))