CREATE TABLE IF NOT EXISTS public.vault_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'harvest', 'yield_routing')),
  amount DECIMAL(20, 8) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  transaction_hash TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.vault_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
ON public.vault_transactions
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
ON public.vault_transactions
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all transactions"
ON public.vault_transactions
FOR ALL 
USING (auth.role() = 'service_role');

CREATE TRIGGER update_vault_transactions_updated_at
BEFORE UPDATE ON public.vault_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_vault_transactions_user_id ON public.vault_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_transactions_type ON public.vault_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_vault_transactions_status ON public.vault_transactions(status);
CREATE INDEX IF NOT EXISTS idx_vault_transactions_created_at ON public.vault_transactions(created_at);
