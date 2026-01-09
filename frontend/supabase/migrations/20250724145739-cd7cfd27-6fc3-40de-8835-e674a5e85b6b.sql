-- Create edge function for Sequence wallet creation
CREATE OR REPLACE FUNCTION public.create_sequence_wallet(
  user_email TEXT,
  user_id UUID
) RETURNS TABLE(
  wallet_address TEXT,
  success BOOLEAN,
  error_message TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  function_result JSONB;
  wallet_addr TEXT;
  error_msg TEXT;
BEGIN
  -- Call the edge function to create wallet
  SELECT INTO function_result
    net.http_post(
      url := 'https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1/create-sequence-wallet',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'email', user_email,
        'userId', user_id::text
      )
    );
  
  -- Parse the response
  IF function_result->>'status_code'::text = '200' THEN
    wallet_addr := function_result->'body'->>'walletAddress';
    RETURN QUERY SELECT wallet_addr, true, ''::text;
  ELSE
    error_msg := COALESCE(function_result->'body'->>'error', 'Unknown error creating wallet');
    RETURN QUERY SELECT ''::text, false, error_msg;
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT ''::text, false, SQLERRM;
END;
$$;