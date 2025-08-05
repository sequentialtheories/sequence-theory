-- Update auth configuration for security improvements
-- Set OTP expiry to 3600 seconds (1 hour) for better security
UPDATE auth.config 
SET 
  raw_base_config = jsonb_set(
    COALESCE(raw_base_config, '{}'::jsonb),
    '{GOTRUE_OTP_EXPIRY}',
    '3600'
  )
WHERE TRUE;

-- If no config row exists, create one
INSERT INTO auth.config (raw_base_config)
SELECT '{
  "GOTRUE_OTP_EXPIRY": "3600"
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM auth.config);

-- Enable password strength requirements for better security
UPDATE auth.config 
SET 
  raw_base_config = jsonb_set(
    raw_base_config,
    '{GOTRUE_PASSWORD_MIN_LENGTH}',
    '8'
  )
WHERE TRUE;

-- Require strong password character requirements
UPDATE auth.config 
SET 
  raw_base_config = jsonb_set(
    raw_base_config,
    '{GOTRUE_PASSWORD_REQUIRED_CHARACTERS}',
    '"digits,lowercase,uppercase,symbols"'
  )
WHERE TRUE;