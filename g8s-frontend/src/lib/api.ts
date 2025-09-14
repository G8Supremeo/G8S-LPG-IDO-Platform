// API service for connecting to the G8S LPG backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://g8s-lpg-api.up.railway.app';
//'http://localhost:5000/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const response = await this.request<{
      success: boolean;
      data: { user: any; token: string };
      message: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request<{
      success: boolean;
      data: { user: any; token: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser() {
    return this.request<{
      success: boolean;
      data: { user: any };
    }>('/auth/me');
  }

  async verifyEmail(token: string) {
    const response = await this.request<{
      success: boolean;
      data: { user: any; token: string };
      message: string;
    }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async forgotPassword(email: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    const response = await this.request<{
      success: boolean;
      data: { user: any; token: string };
      message: string;
    }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  // User endpoints
  async getUserProfile() {
    return this.request<{
      success: boolean;
      data: { user: any };
    }>('/users/profile');
  }

  async updateUserProfile(profileData: any) {
    return this.request<{
      success: boolean;
      data: { user: any };
      message: string;
    }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async connectWallet(walletData: {
    walletAddress: string;
    walletProvider: string;
    signature: string;
  }) {
    return this.request<{
      success: boolean;
      data: { user: any };
      message: string;
    }>('/users/connect-wallet', {
      method: 'POST',
      body: JSON.stringify(walletData),
    });
  }

  async disconnectWallet() {
    return this.request<{
      success: boolean;
      data: { user: any };
      message: string;
    }>('/users/disconnect-wallet', {
      method: 'POST',
    });
  }

  async submitKYC(kycData: any) {
    return this.request<{
      success: boolean;
      data: { user: any };
      message: string;
    }>('/users/kyc', {
      method: 'POST',
      body: JSON.stringify(kycData),
    });
  }

  async getUserTransactions(page: number = 1, limit: number = 20) {
    return this.request<{
      success: boolean;
      data: { transactions: any[]; pagination: any };
    }>(`/users/transactions?page=${page}&limit=${limit}`);
  }

  async getUserStatistics() {
    return this.request<{
      success: boolean;
      data: { user: any; transactions: any; notifications: any };
    }>('/users/statistics');
  }

  // Token endpoints
  async getTokens(page: number = 1, limit: number = 20, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    
    return this.request<{
      success: boolean;
      data: { tokens: any[]; pagination: any };
    }>(`/tokens?${params}`);
  }

  async getTokenByAddress(address: string) {
    return this.request<{
      success: boolean;
      data: { token: any };
    }>(`/tokens/${address}`);
  }

  async getTokenBalance(address: string) {
    return this.request<{
      success: boolean;
      data: { balance: string; raw: string; decimals: number };
    }>(`/tokens/${address}/balance`);
  }

  async getIdoTokens() {
    return this.request<{
      success: boolean;
      data: { tokens: any[] };
    }>('/tokens/ido/list');
  }

  async getTokenStatistics() {
    return this.request<{
      success: boolean;
      data: { statistics: any };
    }>('/tokens/statistics');
  }

  // Transaction endpoints
  async createInvestment(investmentData: {
    amount: number;
    tokenAddress: string;
    paymentToken: string;
  }) {
    return this.request<{
      success: boolean;
      data: { transaction: any };
      message: string;
    }>('/transactions/invest', {
      method: 'POST',
      body: JSON.stringify(investmentData),
    });
  }

  async confirmTransaction(transactionId: string, transactionHash: string, receipt: any) {
    return this.request<{
      success: boolean;
      data: { transaction: any };
      message: string;
    }>(`/transactions/${transactionId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ transactionHash, receipt }),
    });
  }

  async getTransactionByHash(hash: string) {
    return this.request<{
      success: boolean;
      data: { transaction: any };
    }>(`/transactions/${hash}`);
  }

  async getTransactionStatistics() {
    return this.request<{
      success: boolean;
      data: { statistics: any };
    }>('/transactions/statistics');
  }

  // Analytics endpoints
  async getAnalyticsSummary(period: string = 'daily', days: number = 30) {
    return this.request<{
      success: boolean;
      data: { summary: any };
    }>(`/analytics/summary?period=${period}&days=${days}`);
  }

  async getTopMetrics(period: string = 'daily') {
    return this.request<{
      success: boolean;
      data: { metrics: any[] };
    }>(`/analytics/top-metrics?period=${period}`);
  }

  async getUserAnalytics() {
    return this.request<{
      success: boolean;
      data: { statistics: any };
    }>('/analytics/users');
  }

  async getTransactionAnalytics() {
    return this.request<{
      success: boolean;
      data: { statistics: any };
    }>('/analytics/transactions');
  }

  async getIdoAnalytics() {
    return this.request<{
      success: boolean;
      data: { idoStats: any[] };
    }>('/analytics/ido');
  }

  // Notification endpoints
  async getNotifications(page: number = 1, limit: number = 20) {
    return this.request<{
      success: boolean;
      data: { notifications: any[]; unreadCount: number; pagination: any };
    }>(`/notifications?page=${page}&limit=${limit}`);
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request<{
      success: boolean;
      data: { notification: any };
      message: string;
    }>(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request<{
      success: boolean;
      message: string;
    }>('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async getNotificationStatistics() {
    return this.request<{
      success: boolean;
      data: { statistics: any };
    }>('/notifications/statistics');
  }

  async updateNotificationPreferences(preferences: any) {
    return this.request<{
      success: boolean;
      data: { preferences: any };
      message: string;
    }>('/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences }),
    });
  }

  // Admin endpoints (if user is admin)
  async getAdminDashboard() {
    return this.request<{
      success: boolean;
      data: { dashboard: any };
    }>('/admin/dashboard');
  }

  async getAdminUsers(page: number = 1, limit: number = 20, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    
    return this.request<{
      success: boolean;
      data: { users: any[]; pagination: any };
    }>(`/admin/users?${params}`);
  }

  async updateUserStatus(userId: string, status: string, reason?: string) {
    return this.request<{
      success: boolean;
      data: { user: any };
      message: string;
    }>(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
  }

  async updateKYCStatus(userId: string, status: string, reason?: string) {
    return this.request<{
      success: boolean;
      data: { user: any };
      message: string;
    }>(`/admin/users/${userId}/kyc`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
  }

  async getIdoStatus() {
    return this.request<{
      success: boolean;
      data: { idoStatus: any };
    }>('/admin/ido/status');
  }

  async performIdoAction(action: string, value?: any) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>(`/admin/ido/${action}`, {
      method: 'POST',
      body: JSON.stringify({ value }),
    });
  }

  async getSystemHealth() {
    return this.request<{
      success: boolean;
      data: { health: any };
    }>('/admin/system/health');
  }

  // Utility methods
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.clearToken();
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/signin';
    }
  }
}

// Create a singleton instance
export const apiService = new ApiService();

// Export the class for custom instances
export default ApiService;
