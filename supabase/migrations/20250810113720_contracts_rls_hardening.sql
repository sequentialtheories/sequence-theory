ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_wallets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_contracts ON public.contracts;
CREATE POLICY select_contracts
ON public.contracts FOR SELECT
USING (status IN ('pending','active') OR user_id = auth.uid());

DROP POLICY IF EXISTS insert_own_contract ON public.contracts;
CREATE POLICY insert_own_contract
ON public.contracts FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS update_own_contract ON public.contracts;
CREATE POLICY update_own_contract
ON public.contracts FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS select_own_participation ON public.contract_participants;
CREATE POLICY select_own_participation
ON public.contract_participants FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS insert_own_participation ON public.contract_participants;
CREATE POLICY insert_own_participation
ON public.contract_participants FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS update_own_participation ON public.contract_participants;
CREATE POLICY update_own_participation
ON public.contract_participants FOR UPDATE
USING (auth.uid() = user_id);
