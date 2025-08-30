-- Step 4: Clear existing wallet data for testing
DELETE FROM user_wallets WHERE user_id = '1122b0c6-3ce2-4c41-9503-03d5ad7a3ef6';

UPDATE profiles SET eth_address = NULL WHERE user_id = '1122b0c6-3ce2-4c41-9503-03d5ad7a3ef6';