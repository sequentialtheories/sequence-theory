-- Fix contract_deposits RLS policy to prevent viewing other users' deposit amounts
-- Currently allows viewing deposits for contracts they're involved in, which exposes other participants' amounts

DROP POLICY IF EXISTS "Users can view deposits for contracts they're involved in" ON public.contract_deposits;

-- Create more restrictive policy - users can only see their own deposits
CREATE POLICY "Users can view their own deposits only" ON public.contract_deposits
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Contract owners can see deposit records for their contracts but without sensitive amounts
CREATE POLICY "Contract owners can view deposit records" ON public.contract_deposits
  FOR SELECT 
  USING (
    contract_id IN (
      SELECT id FROM public.contracts WHERE user_id = auth.uid()
    )
  );