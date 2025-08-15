DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'auth' AND table_name = 'config'
  ) THEN
    UPDATE auth.config 
    SET 
      raw_base_config = jsonb_set(
        COALESCE(raw_base_config, '{}'::jsonb),
        '{GOTRUE_OTP_EXPIRY}',
        '3600'
      )
    WHERE TRUE;

    IF NOT EXISTS (SELECT 1 FROM auth.config) THEN
      INSERT INTO auth.config (raw_base_config)
      SELECT '{
        "GOTRUE_OTP_EXPIRY": "3600"
      }'::jsonb;
    END IF;

    UPDATE auth.config 
    SET 
      raw_base_config = jsonb_set(
        raw_base_config,
        '{GOTRUE_PASSWORD_MIN_LENGTH}',
        '8'
      )
    WHERE TRUE;

    UPDATE auth.config 
    SET 
      raw_base_config = jsonb_set(
        raw_base_config,
        '{GOTRUE_PASSWORD_REQUIRED_CHARACTERS}',
        '"digits,lowercase,uppercase,symbols"'
      )
    WHERE TRUE;
  END IF;
END $$;
