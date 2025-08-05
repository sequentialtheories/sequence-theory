CREATE TABLE IF NOT EXISTS vault_subclubs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    members JSONB NOT NULL,
    lock_duration INTEGER NOT NULL,
    rigor_level INTEGER NOT NULL,
    status TEXT DEFAULT 'pending_deployment',
    contract_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vault_deposits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(18,6) NOT NULL,
    token_address TEXT DEFAULT 'USDC',
    transaction_hash TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vault_allocations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    asset_type TEXT NOT NULL,
    amount DECIMAL(18,6) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vault_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL,
    amount DECIMAL(18,6) NOT NULL,
    token_address TEXT,
    transaction_hash TEXT,
    status TEXT DEFAULT 'pending',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vault_emergency_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vault_subclubs_user_id ON vault_subclubs(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_deposits_user_id ON vault_deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_allocations_user_id ON vault_allocations(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_transactions_user_id ON vault_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_emergency_actions_user_id ON vault_emergency_actions(user_id);

ALTER TABLE vault_subclubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_emergency_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own vault subclubs" ON vault_subclubs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vault subclubs" ON vault_subclubs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own vault deposits" ON vault_deposits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vault deposits" ON vault_deposits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own vault allocations" ON vault_allocations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own vault transactions" ON vault_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own emergency actions" ON vault_emergency_actions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own emergency actions" ON vault_emergency_actions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
