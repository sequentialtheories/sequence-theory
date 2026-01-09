-- Enable Row Level Security on wallet_private_keys table
ALTER TABLE public.wallet_private_keys ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for wallet_private_keys table
CREATE POLICY "Users can view their own private keys" 
ON public.wallet_private_keys 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can insert their own private keys" 
ON public.wallet_private_keys 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can update their own private keys" 
ON public.wallet_private_keys 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Service role can manage private keys" 
ON public.wallet_private_keys 
FOR ALL 
USING (current_setting('role') = 'service_role');

-- Configure authentication security settings
-- Note: These would typically be set via Supabase dashboard, but documenting here for reference
-- 1. Set OTP expiry to 10 minutes (600 seconds) - done via dashboard
-- 2. Enable leaked password protection - done via dashboard  
-- 3. Set max password length to 72 characters - done via dashboard