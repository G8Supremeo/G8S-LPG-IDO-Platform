-- G8S LPG Supabase Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    email VARCHAR(255),
    username VARCHAR(100),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    kyc_status VARCHAR(20) DEFAULT 'pending',
    kyc_documents JSONB,
    referral_code VARCHAR(20) UNIQUE,
    referred_by VARCHAR(20),
    total_invested DECIMAL(20,8) DEFAULT 0,
    total_tokens DECIMAL(20,8) DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_hash VARCHAR(66) UNIQUE NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    token_address VARCHAR(42),
    token_symbol VARCHAR(10),
    amount DECIMAL(20,8) NOT NULL,
    amount_usd DECIMAL(20,2),
    price_per_token DECIMAL(20,8),
    gas_used BIGINT,
    gas_price DECIMAL(20,8),
    block_number BIGINT,
    status VARCHAR(20) DEFAULT 'pending',
    from_address VARCHAR(42),
    to_address VARCHAR(42),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tokens table
CREATE TABLE IF NOT EXISTS tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    address VARCHAR(42) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    decimals INTEGER NOT NULL,
    total_supply DECIMAL(20,8),
    current_price DECIMAL(20,8),
    market_cap DECIMAL(20,2),
    volume_24h DECIMAL(20,2),
    price_change_24h DECIMAL(10,4),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL,
    total_users INTEGER DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    total_volume DECIMAL(20,2) DEFAULT 0,
    total_raised DECIMAL(20,2) DEFAULT 0,
    tokens_sold DECIMAL(20,8) DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    avg_transaction_value DECIMAL(20,2) DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_email_sent BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- IDO Settings table
CREATE TABLE IF NOT EXISTS ido_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    is_active BOOLEAN DEFAULT true,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    price_per_token DECIMAL(20,8),
    min_purchase DECIMAL(20,2),
    max_purchase DECIMAL(20,2),
    total_tokens_available DECIMAL(20,8),
    tokens_sold DECIMAL(20,8) DEFAULT 0,
    total_raised DECIMAL(20,2) DEFAULT 0,
    is_paused BOOLEAN DEFAULT false,
    pause_reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_tokens_address ON tokens(address);
CREATE INDEX IF NOT EXISTS idx_tokens_symbol ON tokens(symbol);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tokens_updated_at BEFORE UPDATE ON tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ido_settings_updated_at BEFORE UPDATE ON ido_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO tokens (address, name, symbol, decimals, total_supply, current_price, is_active) 
VALUES (
    '0xCe28Eb32bbd8c66749b227A860beFcC12e612295',
    'G8S Token',
    'G8S',
    18,
    1000000000000000000000000000,
    0.05,
    true
) ON CONFLICT (address) DO NOTHING;

INSERT INTO ido_settings (
    is_active,
    start_time,
    end_time,
    price_per_token,
    min_purchase,
    max_purchase,
    total_tokens_available,
    is_paused
) VALUES (
    true,
    NOW(),
    NOW() + INTERVAL '3 months',
    0.05,
    10.00,
    10000.00,
    300000000000000000000000000,
    false
) ON CONFLICT DO NOTHING;

-- Create views for admin dashboard
CREATE OR REPLACE VIEW admin_stats AS
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM transactions) as total_transactions,
    (SELECT COALESCE(SUM(amount_usd), 0) FROM transactions WHERE status = 'confirmed') as total_volume,
    (SELECT COALESCE(SUM(amount_usd), 0) FROM transactions WHERE transaction_type = 'purchase' AND status = 'confirmed') as total_raised,
    (SELECT COUNT(DISTINCT user_id) FROM transactions WHERE created_at >= NOW() - INTERVAL '24 hours') as active_users_24h,
    (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '24 hours') as new_users_24h;

-- Create view for recent activity
CREATE OR REPLACE VIEW recent_activity AS
SELECT 
    t.id,
    t.transaction_hash,
    t.transaction_type,
    t.amount,
    t.amount_usd,
    t.status,
    t.created_at,
    u.wallet_address,
    u.email
FROM transactions t
JOIN users u ON t.user_id = u.id
ORDER BY t.created_at DESC
LIMIT 50;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Public read access for tokens and analytics
CREATE POLICY "Public read access for tokens" ON tokens
    FOR SELECT USING (true);

CREATE POLICY "Public read access for analytics" ON analytics
    FOR SELECT USING (true);

CREATE POLICY "Public read access for ido_settings" ON ido_settings
    FOR SELECT USING (true);
