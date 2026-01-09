-- Create contracts table for Vault Club investment contracts
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  contract_type TEXT NOT NULL DEFAULT 'vault_club',
  name TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(20,8) NOT NULL,
  current_amount DECIMAL(20,8) NOT NULL DEFAULT 0,
  minimum_contribution DECIMAL(20,8) NOT NULL DEFAULT 100,
  maximum_participants INTEGER NOT NULL DEFAULT 10,
  current_participants INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contract participants table
CREATE TABLE public.contract_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  contribution_amount DECIMAL(20,8) NOT NULL,
  wallet_address TEXT,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(contract_id, user_id)
);

-- Create contract deposits table for tracking individual deposits
CREATE TABLE public.contract_deposits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.contract_participants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  transaction_hash TEXT,
  wallet_address TEXT,
  deposit_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_deposits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for contracts
CREATE POLICY "Users can view contracts they created or participate in" 
ON public.contracts 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  id IN (
    SELECT contract_id FROM public.contract_participants 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own contracts" 
ON public.contracts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Contract creators can update their contracts" 
ON public.contracts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for contract participants
CREATE POLICY "Users can view participants of contracts they're involved in" 
ON public.contract_participants 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  contract_id IN (
    SELECT id FROM public.contracts WHERE user_id = auth.uid()
  ) OR
  contract_id IN (
    SELECT contract_id FROM public.contract_participants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can join contracts as participants" 
ON public.contract_participants 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation" 
ON public.contract_participants 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for contract deposits
CREATE POLICY "Users can view deposits for contracts they're involved in" 
ON public.contract_deposits 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  contract_id IN (
    SELECT id FROM public.contracts WHERE user_id = auth.uid()
  ) OR
  contract_id IN (
    SELECT contract_id FROM public.contract_participants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own deposits" 
ON public.contract_deposits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deposits" 
ON public.contract_deposits 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_contracts_user_id ON public.contracts(user_id);
CREATE INDEX idx_contracts_status ON public.contracts(status);
CREATE INDEX idx_contract_participants_contract_id ON public.contract_participants(contract_id);
CREATE INDEX idx_contract_participants_user_id ON public.contract_participants(user_id);
CREATE INDEX idx_contract_deposits_contract_id ON public.contract_deposits(contract_id);
CREATE INDEX idx_contract_deposits_user_id ON public.contract_deposits(user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_contracts_updated_at
BEFORE UPDATE ON public.contracts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contract_participants_updated_at
BEFORE UPDATE ON public.contract_participants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contract_deposits_updated_at
BEFORE UPDATE ON public.contract_deposits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create functions for contract management
CREATE OR REPLACE FUNCTION public.get_user_contracts()
RETURNS TABLE(
  contract_id uuid,
  contract_name text,
  contract_type text,
  target_amount decimal,
  current_amount decimal,
  status text,
  is_creator boolean,
  is_participant boolean,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    c.id as contract_id,
    c.name as contract_name,
    c.contract_type,
    c.target_amount,
    c.current_amount,
    c.status,
    (c.user_id = auth.uid()) as is_creator,
    (cp.user_id IS NOT NULL) as is_participant,
    c.created_at
  FROM public.contracts c
  LEFT JOIN public.contract_participants cp ON c.id = cp.contract_id AND cp.user_id = auth.uid()
  WHERE c.user_id = auth.uid() OR cp.user_id = auth.uid()
  ORDER BY c.created_at DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.join_contract(
  p_contract_id uuid,
  p_contribution_amount decimal,
  p_wallet_address text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_max_participants integer;
  v_current_participants integer;
  v_minimum_contribution decimal;
  v_contract_status text;
BEGIN
  -- Get contract details
  SELECT maximum_participants, current_participants, minimum_contribution, status
  INTO v_max_participants, v_current_participants, v_minimum_contribution, v_contract_status
  FROM public.contracts
  WHERE id = p_contract_id;

  -- Check if contract exists and is active
  IF v_contract_status IS NULL THEN
    RAISE EXCEPTION 'Contract not found';
  END IF;

  IF v_contract_status != 'pending' AND v_contract_status != 'active' THEN
    RAISE EXCEPTION 'Contract is not accepting new participants';
  END IF;

  -- Check if user is already a participant
  IF EXISTS (
    SELECT 1 FROM public.contract_participants 
    WHERE contract_id = p_contract_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'User is already a participant in this contract';
  END IF;

  -- Check if contract is full
  IF v_current_participants >= v_max_participants THEN
    RAISE EXCEPTION 'Contract is full';
  END IF;

  -- Check minimum contribution
  IF p_contribution_amount < v_minimum_contribution THEN
    RAISE EXCEPTION 'Contribution amount is below minimum required';
  END IF;

  -- Add participant
  INSERT INTO public.contract_participants (
    contract_id,
    user_id,
    contribution_amount,
    wallet_address
  ) VALUES (
    p_contract_id,
    auth.uid(),
    p_contribution_amount,
    p_wallet_address
  );

  -- Update contract current amounts and participant count
  UPDATE public.contracts
  SET 
    current_amount = current_amount + p_contribution_amount,
    current_participants = current_participants + 1,
    updated_at = now()
  WHERE id = p_contract_id;

  RETURN true;
END;
$function$;