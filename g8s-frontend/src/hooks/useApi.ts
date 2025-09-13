import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/lib/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<{ success: boolean; data: T; error?: string }>,
  options: UseApiOptions = {}
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { immediate = false, onSuccess, onError } = options;

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();
      
      if (response.success) {
        setState({ data: response.data, loading: false, error: null });
        onSuccess?.(response.data);
      } else {
        const errorMessage = response.error || 'An error occurred';
        setState({ data: null, loading: false, error: errorMessage });
        onError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      onError?.(errorMessage);
    }
  }, [apiCall, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    refetch: execute,
  };
}

// Hook for user authentication
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    if (!apiService.isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.getCurrentUser();
      if (response.success) {
        setUser(response.data.user);
      } else {
        apiService.clearToken();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      apiService.clearToken();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        setError('Invalid credentials');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.register(userData);
      if (response.success) {
        setUser(response.data.user);
        return { success: true, message: response.message };
      } else {
        setError('Registration failed');
        return { success: false, error: 'Registration failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiService.logout();
    setUser(null);
    setError(null);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    refetch: checkAuth,
  };
}

// Hook for user profile
export function useUserProfile() {
  return useApi(() => apiService.getUserProfile(), { immediate: true });
}

// Hook for user statistics
export function useUserStatistics() {
  return useApi(() => apiService.getUserStatistics(), { immediate: true });
}

// Hook for tokens
export function useTokens(page: number = 1, limit: number = 20, search?: string) {
  return useApi(() => apiService.getTokens(page, limit, search), { immediate: true });
}

// Hook for IDO tokens
export function useIdoTokens() {
  return useApi(() => apiService.getIdoTokens(), { immediate: true });
}

// Hook for token statistics
export function useTokenStatistics() {
  return useApi(() => apiService.getTokenStatistics(), { immediate: true });
}

// Hook for user transactions
export function useUserTransactions(page: number = 1, limit: number = 20) {
  return useApi(() => apiService.getUserTransactions(page, limit), { immediate: true });
}

// Hook for transaction statistics
export function useTransactionStatistics() {
  return useApi(() => apiService.getTransactionStatistics(), { immediate: true });
}

// Hook for analytics
export function useAnalyticsSummary(period: string = 'daily', days: number = 30) {
  return useApi(() => apiService.getAnalyticsSummary(period, days), { immediate: true });
}

// Hook for top metrics
export function useTopMetrics(period: string = 'daily') {
  return useApi(() => apiService.getTopMetrics(period), { immediate: true });
}

// Hook for IDO analytics
export function useIdoAnalytics() {
  return useApi(() => apiService.getIdoAnalytics(), { immediate: true });
}

// Hook for notifications
export function useNotifications(page: number = 1, limit: number = 20) {
  return useApi(() => apiService.getNotifications(page, limit), { immediate: true });
}

// Hook for notification statistics
export function useNotificationStatistics() {
  return useApi(() => apiService.getNotificationStatistics(), { immediate: true });
}

// Hook for admin dashboard
export function useAdminDashboard() {
  return useApi(() => apiService.getAdminDashboard(), { immediate: true });
}

// Hook for admin users
export function useAdminUsers(page: number = 1, limit: number = 20, search?: string) {
  return useApi(() => apiService.getAdminUsers(page, limit, search), { immediate: true });
}

// Hook for IDO status
export function useIdoStatus() {
  return useApi(() => apiService.getIdoStatus(), { immediate: true });
}

// Hook for system health
export function useSystemHealth() {
  return useApi(() => apiService.getSystemHealth(), { immediate: true });
}

// Hook for token balance
export function useTokenBalance(address: string) {
  return useApi(() => apiService.getTokenBalance(address), { immediate: true });
}

// Hook for token by address
export function useTokenByAddress(address: string) {
  return useApi(() => apiService.getTokenByAddress(address), { immediate: true });
}

// Hook for transaction by hash
export function useTransactionByHash(hash: string) {
  return useApi(() => apiService.getTransactionByHash(hash), { immediate: true });
}

// Custom hook for API operations with loading states
export function useApiOperation<T>(
  operation: (...args: any[]) => Promise<{ success: boolean; data: T; error?: string }>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await operation(...args);
      
      if (response.success) {
        setLoading(false);
        return { success: true, data: response.data };
      } else {
        const errorMessage = response.error || 'Operation failed';
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Operation failed';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [operation]);

  return {
    execute,
    loading,
    error,
  };
}

// Hook for wallet connection
export function useWalletConnection() {
  const { execute: connectWallet, loading: connecting, error: connectError } = useApiOperation(
    (walletData: { walletAddress: string; walletProvider: string; signature: string }) =>
      apiService.connectWallet(walletData)
  );

  const { execute: disconnectWallet, loading: disconnecting, error: disconnectError } = useApiOperation(
    () => apiService.disconnectWallet()
  );

  return {
    connectWallet,
    disconnectWallet,
    connecting,
    disconnecting,
    connectError,
    disconnectError,
  };
}

// Hook for KYC submission
export function useKYCSubmission() {
  return useApiOperation((kycData: any) => apiService.submitKYC(kycData));
}

// Hook for investment creation
export function useInvestmentCreation() {
  return useApiOperation((investmentData: {
    amount: number;
    tokenAddress: string;
    paymentToken: string;
  }) => apiService.createInvestment(investmentData));
}

// Hook for transaction confirmation
export function useTransactionConfirmation() {
  return useApiOperation((transactionId: string, transactionHash: string, receipt: any) =>
    apiService.confirmTransaction(transactionId, transactionHash, receipt)
  );
}

// Hook for admin operations
export function useAdminOperations() {
  const { execute: updateUserStatus, loading: updatingStatus, error: statusError } = useApiOperation(
    (userId: string, status: string, reason?: string) =>
      apiService.updateUserStatus(userId, status, reason)
  );

  const { execute: updateKYCStatus, loading: updatingKYC, error: kycError } = useApiOperation(
    (userId: string, status: string, reason?: string) =>
      apiService.updateKYCStatus(userId, status, reason)
  );

  const { execute: performIdoAction, loading: performingAction, error: actionError } = useApiOperation(
    (action: string, value?: any) => apiService.performIdoAction(action, value)
  );

  return {
    updateUserStatus,
    updateKYCStatus,
    performIdoAction,
    updatingStatus,
    updatingKYC,
    performingAction,
    statusError,
    kycError,
    actionError,
  };
}

// Hook for notification operations
export function useNotificationOperations() {
  const { execute: markAsRead, loading: markingRead, error: readError } = useApiOperation(
    (notificationId: string) => apiService.markNotificationAsRead(notificationId)
  );

  const { execute: markAllAsRead, loading: markingAllRead, error: allReadError } = useApiOperation(
    () => apiService.markAllNotificationsAsRead()
  );

  const { execute: updatePreferences, loading: updatingPrefs, error: prefsError } = useApiOperation(
    (preferences: any) => apiService.updateNotificationPreferences(preferences)
  );

  return {
    markAsRead,
    markAllAsRead,
    updatePreferences,
    markingRead,
    markingAllRead,
    updatingPrefs,
    readError,
    allReadError,
    prefsError,
  };
}
