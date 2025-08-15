-- Security hardening measures

-- 1. Add constraints to ensure data integrity
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'api_keys_name_not_empty' 
      AND conrelid = 'public.api_keys'::regclass
  ) THEN
    ALTER TABLE public.api_keys 
    ADD CONSTRAINT api_keys_name_not_empty 
    CHECK (length(trim(name)) > 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'api_keys_key_prefix_format' 
      AND conrelid = 'public.api_keys'::regclass
  ) THEN
    ALTER TABLE public.api_keys 
    ADD CONSTRAINT api_keys_key_prefix_format 
    CHECK (key_prefix ~ '^st_[A-Za-z0-9]{4,}$');
  END IF;
END $$;

-- 2. Add validation for contracts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'contracts_name_not_empty' 
      AND conrelid = 'public.contracts'::regclass
  ) THEN
    ALTER TABLE public.contracts 
    ADD CONSTRAINT contracts_name_not_empty 
    CHECK (length(trim(name)) > 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'contracts_positive_amounts' 
      AND conrelid = 'public.contracts'::regclass
  ) THEN
    ALTER TABLE public.contracts 
    ADD CONSTRAINT contracts_positive_amounts 
    CHECK (target_amount > 0 AND current_amount >= 0 AND minimum_contribution > 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'contracts_participant_limits' 
      AND conrelid = 'public.contracts'::regclass
  ) THEN
    ALTER TABLE public.contracts 
    ADD CONSTRAINT contracts_participant_limits 
    CHECK (maximum_participants > 0 AND current_participants >= 0 AND current_participants <= maximum_participants);
  END IF;
END $$;

-- 3. Add validation for contract participants
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'participants_positive_contribution' 
      AND conrelid = 'public.contract_participants'::regclass
  ) THEN
    ALTER TABLE public.contract_participants 
    ADD CONSTRAINT participants_positive_contribution 
    CHECK (contribution_amount > 0);
  END IF;
END $$;

-- 4. Add validation for contract deposits
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'deposits_positive_amount' 
      AND conrelid = 'public.contract_deposits'::regclass
  ) THEN
    ALTER TABLE public.contract_deposits 
    ADD CONSTRAINT deposits_positive_amount 
    CHECK (amount > 0);
  END IF;
END $$;

-- 5. Add constraints to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_email_format' 
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_name_not_empty' 
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_name_not_empty 
    CHECK (length(trim(name)) > 0);
  END IF;
END $$;

-- 6. Add flexible wallet address validation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'wallet_address_not_empty' 
      AND conrelid = 'public.user_wallets'::regclass
  ) THEN
    ALTER TABLE public.user_wallets 
    ADD CONSTRAINT wallet_address_not_empty 
    CHECK (length(trim(wallet_address)) > 0);
  END IF;
END $$;

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
