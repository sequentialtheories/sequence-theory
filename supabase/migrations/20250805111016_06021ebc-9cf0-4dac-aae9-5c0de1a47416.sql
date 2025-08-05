-- Phase 1: Simplify Database Schema
-- Add email column to user_wallets and remove wallet_config
ALTER TABLE public.user_wallets ADD COLUMN IF NOT EXISTS email text;

-- Create a temporary backup of existing data
CREATE TEMP TABLE wallet_backup AS 
SELECT user_id, wallet_address, network, wallet_config 
FROM public.user_wallets;

-- Update email from profiles table where possible
UPDATE public.user_wallets 
SET email = profiles.email
FROM public.profiles 
WHERE public.user_wallets.user_id = profiles.user_id;

-- Remove wallet_config column as we're moving to frontend-only
ALTER TABLE public.user_wallets DROP COLUMN IF EXISTS wallet_config;

-- Drop wallet_private_keys table since we're going frontend-only
DROP TABLE IF EXISTS public.wallet_private_keys;

-- Update the insert policy to allow email in the check
DROP POLICY IF EXISTS "Service role can insert wallets" ON public.user_wallets;
CREATE POLICY "Users can insert their own wallet" 
ON public.user_wallets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add policy for users to update their own wallets
CREATE POLICY "Users can update their own wallet" 
ON public.user_wallets 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Remove the old database functions that are no longer needed
DROP FUNCTION IF EXISTS public.create_sequence_wallet(text, uuid);
DROP FUNCTION IF EXISTS public.migrate_private_keys();