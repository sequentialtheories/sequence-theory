-- Create security definer function to check wallet ownership
-- This prevents any potential RLS recursion issues and provides bulletproof access control
CREATE OR REPLACE FUNCTION public.is_wallet_owner(wallet_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL AND auth.uid() = wallet_user_id;
$$;

-- Drop existing RLS policies to recreate them with stronger security
DROP POLICY IF EXISTS "Users can insert own wallet" ON public.user_wallets;
DROP POLICY IF EXISTS "Users can update own wallet" ON public.user_wallets; 
DROP POLICY IF EXISTS "Users can view own wallet" ON public.user_wallets;

-- Create bulletproof RLS policies using security definer function
CREATE POLICY "Wallet owners can view their wallet data"
ON public.user_wallets
FOR SELECT
USING (public.is_wallet_owner(user_id));

CREATE POLICY "Wallet owners can insert their wallet data"
ON public.user_wallets
FOR INSERT
WITH CHECK (
  public.is_wallet_owner(user_id) 
  AND user_id IS NOT NULL
  AND wallet_address IS NOT NULL
  AND length(wallet_address) >= 10 -- Basic validation for wallet address format
);

CREATE POLICY "Wallet owners can update their wallet data"
ON public.user_wallets
FOR UPDATE
USING (public.is_wallet_owner(user_id))
WITH CHECK (
  public.is_wallet_owner(user_id)
  AND user_id IS NOT NULL
  AND wallet_address IS NOT NULL
);

-- Add DELETE policy to complete access control
CREATE POLICY "Wallet owners can delete their wallet data"
ON public.user_wallets
FOR DELETE
USING (public.is_wallet_owner(user_id));

-- Add additional security constraint to ensure user_id references valid auth users
ALTER TABLE public.user_wallets 
ADD CONSTRAINT fk_user_wallets_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better performance on user_id lookups (security benefit)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_wallets_user_id 
ON public.user_wallets(user_id);

-- Add constraint to ensure wallet addresses have minimum security requirements
ALTER TABLE public.user_wallets 
ADD CONSTRAINT chk_wallet_address_format 
CHECK (length(wallet_address) >= 10 AND wallet_address ~ '^0x[a-fA-F0-9]+$');