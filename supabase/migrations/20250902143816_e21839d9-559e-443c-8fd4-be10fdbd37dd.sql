-- Fix contracts table RLS policy - remove overly permissive policy
-- The current 'select_contracts' policy allows any authenticated user to view 
-- pending/active contracts, exposing sensitive financial information

-- Drop the overly permissive policy that allows viewing all pending/active contracts
DROP POLICY IF EXISTS "select_contracts" ON public.contracts;

-- Keep the restrictive policy that only allows owners and participants to view contracts
-- This policy already exists: "Users can view contracts they own or participate in"
-- Using Expression: ((user_id = auth.uid()) OR is_contract_participant(id))

-- No additional policies needed - the existing restrictive policy is sufficient