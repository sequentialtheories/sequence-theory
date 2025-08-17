
-- First, let's create the user_wallets table to store Web3 wallet information
CREATE TABLE public.user_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  wallet_address TEXT NOT NULL UNIQUE,
  wallet_config JSONB NOT NULL, -- Store Sequence wallet configuration
  network TEXT NOT NULL DEFAULT 'polygon',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for wallet security
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;

-- Create policies for wallet access
CREATE POLICY "Users can view their own wallet" 
ON public.user_wallets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet" 
ON public.user_wallets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert wallets" 
ON public.user_wallets 
FOR INSERT 
WITH CHECK (true);

-- Add wallet creation timestamp trigger (with function check)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE TRIGGER update_user_wallets_updated_at
        BEFORE UPDATE ON public.user_wallets
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- Remove the early_access_signups table since we're consolidating everything
DROP TABLE IF EXISTS public.early_access_signups;

-- Update the handle_new_user function to create wallets automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'name', ''),
    new.email
  );
  
  -- Call edge function to create wallet (async)
  PERFORM net.http_post(
    url := 'https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1/create-wallet',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('request.jwt.claims')::json->>'aud' || '"}'::jsonb,
    body := json_build_object('user_id', new.id)::text
  );
  
  RETURN new;
END;
$$;
