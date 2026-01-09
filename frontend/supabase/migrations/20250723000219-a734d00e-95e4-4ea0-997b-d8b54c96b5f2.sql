-- Create placeholder wallets for existing users who don't have them
INSERT INTO public.user_wallets (user_id, wallet_address, wallet_config, network)
SELECT 
    p.user_id,
    'pending_' || p.user_id::text,
    jsonb_build_object(
        'status', 'pending',
        'created_at', extract(epoch from now())
    ),
    'polygon'
FROM profiles p
LEFT JOIN user_wallets uw ON p.user_id = uw.user_id
WHERE uw.user_id IS NULL;