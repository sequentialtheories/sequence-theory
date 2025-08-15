-- Security hardening measures (without strict wallet validation due to existing data)

-- 1. Add constraints to ensure data integrity
ALTER TABLE api_keys 
ADD CONSTRAINT api_keys_name_not_empty 
CHECK (length(trim(name)) > 0);

ALTER TABLE api_keys 
ADD CONSTRAINT api_keys_key_prefix_format 
CHECK (key_prefix ~ '^st_[A-Za-z0-9]{4,}$');

-- 2. Add validation for contracts
ALTER TABLE contracts 
ADD CONSTRAINT contracts_name_not_empty 
CHECK (length(trim(name)) > 0);

ALTER TABLE contracts 
ADD CONSTRAINT contracts_positive_amounts 
CHECK (target_amount > 0 AND current_amount >= 0 AND minimum_contribution > 0);

ALTER TABLE contracts 
ADD CONSTRAINT contracts_participant_limits 
CHECK (maximum_participants > 0 AND current_participants >= 0 AND current_participants <= maximum_participants);

-- 3. Add validation for contract participants
ALTER TABLE contract_participants 
ADD CONSTRAINT participants_positive_contribution 
CHECK (contribution_amount > 0);

-- 4. Add validation for contract deposits
ALTER TABLE contract_deposits 
ADD CONSTRAINT deposits_positive_amount 
CHECK (amount > 0);

-- 5. Add constraints to profiles table
ALTER TABLE profiles 
ADD CONSTRAINT profiles_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE profiles 
ADD CONSTRAINT profiles_name_not_empty 
CHECK (length(trim(name)) > 0);

-- 6. Add flexible wallet address validation (allows pending addresses and various formats)
ALTER TABLE user_wallets 
ADD CONSTRAINT wallet_address_not_empty 
CHECK (length(trim(wallet_address)) > 0);

-- 7. Add indexes for better performance on security-critical lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON public.api_keys (key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_active ON public.api_keys (user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_api_access_logs_timestamp ON public.api_access_logs (created_at DESC);

-- 8. Add function to log API access attempts for security monitoring
CREATE OR REPLACE FUNCTION log_api_access(
  p_api_key_id UUID,
  p_endpoint TEXT,
  p_ip_address INET,
  p_user_agent TEXT,
  p_request_data JSONB,
  p_response_status INTEGER
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO api_access_logs (
    api_key_id,
    endpoint,
    ip_address,
    user_agent,
    request_data,
    response_status
  ) VALUES (
    p_api_key_id,
    p_endpoint,
    p_ip_address,
    p_user_agent,
    p_request_data,
    p_response_status
  );
END;
$$;
