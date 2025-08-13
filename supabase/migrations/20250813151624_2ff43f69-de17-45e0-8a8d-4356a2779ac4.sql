-- Fix RLS infinite recursion by creating security definer functions

-- Create function to get current user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = auth.uid()
  ORDER BY CASE WHEN role = 'admin' THEN 1 ELSE 2 END
  LIMIT 1
$$;

-- Create function to check if user is owner of contract
CREATE OR REPLACE FUNCTION public.is_contract_owner(contract_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.contracts
    WHERE id = contract_id AND user_id = auth.uid()
  )
$$;

-- Create function to check if user is participant in contract
CREATE OR REPLACE FUNCTION public.is_contract_participant(contract_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.contract_participants
    WHERE contract_id = contract_id AND user_id = auth.uid()
  )
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view contracts they created or participate in" ON public.contracts;
DROP POLICY IF EXISTS "Users can update their own contracts" ON public.contracts;
DROP POLICY IF EXISTS "Users can view their own participations" ON public.contract_participants;
DROP POLICY IF EXISTS "Users can create participations for themselves" ON public.contract_participants;

-- Create new secure policies using security definer functions
CREATE POLICY "Users can view contracts they own or participate in" 
ON public.contracts 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  public.is_contract_participant(id)
);

CREATE POLICY "Users can update their own contracts" 
ON public.contracts 
FOR UPDATE 
USING (public.is_contract_owner(id));

CREATE POLICY "Users can insert their own contracts" 
ON public.contracts 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view participations in their contracts" 
ON public.contract_participants 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  public.is_contract_owner(contract_id)
);

CREATE POLICY "Users can create participations for themselves" 
ON public.contract_participants 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Add security validation trigger for contracts
CREATE OR REPLACE FUNCTION public.validate_contract_security()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate target amount is positive
  IF NEW.target_amount <= 0 THEN
    RAISE EXCEPTION 'Target amount must be positive';
  END IF;
  
  -- Validate maximum participants is reasonable
  IF NEW.maximum_participants < 1 OR NEW.maximum_participants > 10000 THEN
    RAISE EXCEPTION 'Maximum participants must be between 1 and 10000';
  END IF;
  
  -- Validate minimum contribution is not negative
  IF NEW.minimum_contribution < 0 THEN
    RAISE EXCEPTION 'Minimum contribution cannot be negative';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_contract_security_trigger
  BEFORE INSERT OR UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.validate_contract_security();