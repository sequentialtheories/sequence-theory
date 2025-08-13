CREATE TABLE IF NOT EXISTS public.vault_epochs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  epoch_number bigint UNIQUE NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('open','closed','harvested')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vault_epoch_deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  epoch_number bigint NOT NULL REFERENCES public.vault_epochs(epoch_number),
  user_id uuid NOT NULL,
  wallet_address text NULL,
  amount numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vault_epoch_harvests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  epoch_number bigint NOT NULL REFERENCES public.vault_epochs(epoch_number),
  executed_by uuid NULL,
  yield_amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.vault_epochs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_epoch_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_epoch_harvests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS read_epochs ON public.vault_epochs;
CREATE POLICY read_epochs ON public.vault_epochs FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS write_epochs_none ON public.vault_epochs;
CREATE POLICY write_epochs_none ON public.vault_epochs FOR ALL USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS read_own_deposits ON public.vault_epoch_deposits;
CREATE POLICY read_own_deposits ON public.vault_epoch_deposits FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS write_own_deposits ON public.vault_epoch_deposits;
CREATE POLICY write_own_deposits ON public.vault_epoch_deposits FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS update_own_deposits ON public.vault_epoch_deposits;
CREATE POLICY update_own_deposits ON public.vault_epoch_deposits FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS read_harvests ON public.vault_epoch_harvests;
CREATE POLICY read_harvests ON public.vault_epoch_harvests FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS write_harvests_none ON public.vault_epoch_harvests;
CREATE POLICY write_harvests_none ON public.vault_epoch_harvests FOR ALL USING (false) WITH CHECK (false);
