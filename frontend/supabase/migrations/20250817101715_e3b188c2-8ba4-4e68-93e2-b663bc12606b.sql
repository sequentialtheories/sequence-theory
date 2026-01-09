
-- 1) Add canonical wallet address to profiles (backward compatible)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS eth_address text;

-- Ensure case-insensitive uniqueness for non-null eth_address values
CREATE UNIQUE INDEX IF NOT EXISTS profiles_eth_address_unique
  ON public.profiles (LOWER(eth_address))
  WHERE eth_address IS NOT NULL;

-- 2) Minimal on-chain tx event log (client-signed only; no sensitive data)
CREATE TABLE IF NOT EXISTS public.tx_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tx_hash text NOT NULL,
  block_number bigint,
  contract_address text,
  method text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Avoid duplicates on tx hash (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS tx_events_tx_hash_unique
  ON public.tx_events (LOWER(tx_hash));

-- Enable RLS and restrict to the owner
ALTER TABLE public.tx_events ENABLE ROW LEVEL SECURITY;

-- Users can insert their own tx events
CREATE POLICY "tx_events_insert_own"
  ON public.tx_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own tx events
CREATE POLICY "tx_events_select_own"
  ON public.tx_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- No UPDATE/DELETE policies: users cannot modify or delete events
