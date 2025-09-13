// supabase-config.js
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

// --- Supabase configuration ---
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wfzorlpmg-aovrlyuwmco.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmem9ybHBtZ2FvdnJseXV3bWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NTQ2MzQsImV4cCI6MjA3MzMzMDYzNH0.N4vBttXSlK_HKkG_h2cxmLIGV10yVt5q1C6X17TREfo';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmem9ybHBtZ2FvdnJseXV3bWNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzc1NDYzNCwiZXhwIjoyMDczMzMwNjM0fQ.k6-76ZMYRC0oAMSym8yG355HRpxWvqhtHisAU3fQ3XY';

// Create Supabase clients
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Table constants
const TABLES = {
  USERS: 'users',
  TRANSACTIONS: 'transactions',
  TOKENS: 'tokens',
  ANALYTICS: 'analytics',
  NOTIFICATIONS: 'notifications',
  IDO_SETTINGS: 'ido_settings'
};

// Supabase Service Class
class SupabaseService {
  constructor() {
    console.log("🔎 [Supabase Config]");
    console.log("SUPABASE_URL:", SUPABASE_URL);
    console.log("SUPABASE_ANON_KEY:", SUPABASE_ANON_KEY ? "✅ Loaded" : "❌ Missing");
    console.log("SUPABASE_SERVICE_KEY:", SUPABASE_SERVICE_KEY ? "✅ Loaded" : "❌ Missing");

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_KEY) {
      console.error("❌ Supabase initialization failed: Missing keys or URL.");
      this.client = null;
      this.admin = null;
      return;
    }

    this.client = supabase;
    this.admin = supabaseAdmin;
    this.tables = TABLES;
  }

  // --- Users ---
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

  // --- Transactions ---
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

  // --- Tokens ---
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

  // --- Analytics ---
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

  // --- Notifications ---
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

  // --- IDO Settings ---
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

  // --- Admin ---
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
      .select(`*, users!inner(wallet_address, email)`)
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
