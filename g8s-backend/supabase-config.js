// Supabase Configuration for G8S LPG Backend
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'your-service-key';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Database tables configuration
const TABLES = {
  USERS: 'users',
  TRANSACTIONS: 'transactions',
  TOKENS: 'tokens',
  ANALYTICS: 'analytics',
  NOTIFICATIONS: 'notifications',
  IDO_SETTINGS: 'ido_settings'
};

// Supabase service functions
class SupabaseService {
  constructor() {
    // --- ADD THESE LINES AT THE VERY TOP ---
    console.log("🔎 [Supabase Config]");
    console.log("SUPABASE_URL:", process.env.SUPABASE_URL || "❌ Missing");
    console.log("SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY ? "✅ Loaded" : "❌ Missing");

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error("❌ Supabase initialization failed: Missing SUPABASE_URL or SUPABASE_ANON_KEY.");
      this.client = null;
      this.admin = null;
      return;
    }
    // --- END ADD ---

    // Original constructor code
    this.client = supabase;
    this.admin = supabaseAdmin;
    this.tables = TABLES;
  }

  // User operations
  async createUser(userData) {
    const { data, error } = await this.client
      .from(this.tables.USERS)
      .insert([userData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  async getUserByWallet(walletAddress) {
    const { data, error } = await this.client
      .from(this.tables.USERS)
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateUser(id, updates) {
    const { data, error } = await this.client
      .from(this.tables.USERS)
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  // Transaction operations
  async createTransaction(transactionData) {
    const { data, error } = await this.client
      .from(this.tables.TRANSACTIONS)
      .insert([transactionData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  async getTransactionsByUser(userId, limit = 50) {
    const { data, error } = await this.client
      .from(this.tables.TRANSACTIONS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  async getAllTransactions(limit = 100) {
    const { data, error } = await this.client
      .from(this.tables.TRANSACTIONS)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  // Token operations
  async getTokenInfo(tokenAddress) {
    const { data, error } = await this.client
      .from(this.tables.TOKENS)
      .select('*')
      .eq('address', tokenAddress)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateTokenInfo(tokenAddress, updates) {
    const { data, error } = await this.client
      .from(this.tables.TOKENS)
      .upsert({ address: tokenAddress, ...updates })
      .select();
    
    if (error) throw error;
    return data[0];
  }

  // Analytics operations
  async getAnalytics() {
    const { data, error } = await this.client
      .from(this.tables.ANALYTICS)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateAnalytics(analyticsData) {
    const { data, error } = await this.client
      .from(this.tables.ANALYTICS)
      .upsert(analyticsData)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  // Notification operations
  async createNotification(notificationData) {
    const { data, error } = await this.client
      .from(this.tables.NOTIFICATIONS)
      .insert([notificationData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  async getUserNotifications(userId, limit = 20) {
    const { data, error } = await this.client
      .from(this.tables.NOTIFICATIONS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  // IDO Settings operations
  async getIDOSettings() {
    const { data, error } = await this.client
      .from(this.tables.IDO_SETTINGS)
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateIDOSettings(settings) {
    const { data, error } = await this.client
      .from(this.tables.IDO_SETTINGS)
      .upsert(settings)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  // Admin operations
  async getAdminStats() {
    const [usersResult, transactionsResult, analyticsResult] = await Promise.all([
      this.client.from(this.tables.USERS).select('id', { count: 'exact' }),
      this.client.from(this.tables.TRANSACTIONS).select('id', { count: 'exact' }),
      this.getAnalytics()
    ]);

    return {
      totalUsers: usersResult.count || 0,
      totalTransactions: transactionsResult.count || 0,
      analytics: analyticsResult
    };
  }

  async getRecentActivity(limit = 10) {
    const { data, error } = await this.client
      .from(this.tables.TRANSACTIONS)
      .select(`
        *,
        users!inner(wallet_address, email)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
}

module.exports = {
  supabase,
  supabaseAdmin,
  SupabaseService,
  TABLES
};
