import { useEffect, useRef, useState } from 'react';
import { wsService } from '@/lib/websocket';

interface WebSocketState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  connectionState: number;
}

// Hook for WebSocket connection state
export function useWebSocket() {
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    connecting: false,
    error: null,
    connectionState: WebSocket.CLOSED,
  });

  useEffect(() => {
    const handleConnected = () => {
      setState(prev => ({
        ...prev,
        connected: true,
        connecting: false,
        error: null,
        connectionState: WebSocket.OPEN,
      }));
    };

    const handleDisconnected = () => {
      setState(prev => ({
        ...prev,
        connected: false,
        connecting: false,
        connectionState: WebSocket.CLOSED,
      }));
    };

    const handleError = (error: any) => {
      setState(prev => ({
        ...prev,
        error: error.message || 'WebSocket connection error',
        connecting: false,
      }));
    };

    const handleMaxReconnectAttempts = () => {
      setState(prev => ({
        ...prev,
        error: 'Max reconnection attempts reached',
        connecting: false,
      }));
    };

    // Subscribe to WebSocket events
    wsService.on('connected', handleConnected);
    wsService.on('disconnected', handleDisconnected);
    wsService.on('error', handleError);
    wsService.on('maxReconnectAttemptsReached', handleMaxReconnectAttempts);

    // Update initial state
    setState(prev => ({
      ...prev,
      connected: wsService.isConnected(),
      connectionState: wsService.getConnectionState(),
    }));

    return () => {
      wsService.off('connected', handleConnected);
      wsService.off('disconnected', handleDisconnected);
      wsService.off('error', handleError);
      wsService.off('maxReconnectAttemptsReached', handleMaxReconnectAttempts);
    };
  }, []);

  const reconnect = () => {
    setState(prev => ({ ...prev, connecting: true, error: null }));
    wsService.reconnect();
  };

  const disconnect = () => {
    wsService.disconnect();
    setState({
      connected: false,
      connecting: false,
      error: null,
      connectionState: WebSocket.CLOSED,
    });
  };

  return {
    ...state,
    reconnect,
    disconnect,
  };
}

// Hook for real-time investment updates
export function useInvestmentUpdates() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [latestUpdate, setLatestUpdate] = useState<any>(null);

  useEffect(() => {
    const handleInvestmentUpdate = (data: any) => {
      setLatestUpdate(data);
      setUpdates(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 updates
    };

    wsService.on('investment_update', handleInvestmentUpdate);

    return () => {
      wsService.off('investment_update', handleInvestmentUpdate);
    };
  }, []);

  return {
    updates,
    latestUpdate,
  };
}

// Hook for real-time sale status updates
export function useSaleStatusUpdates() {
  const [status, setStatus] = useState<string>('unknown');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const handleSaleStatusUpdate = (data: any) => {
      setStatus(data.status);
      setLastUpdate(new Date());
    };

    wsService.on('sale_status', handleSaleStatusUpdate);

    return () => {
      wsService.off('sale_status', handleSaleStatusUpdate);
    };
  }, []);

  return {
    status,
    lastUpdate,
  };
}

// Hook for real-time price updates
export function usePriceUpdates() {
  const [priceUpdates, setPriceUpdates] = useState<Map<string, any>>(new Map());
  const [latestPrices, setLatestPrices] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    const handlePriceUpdate = (data: any) => {
      const token = data.token || 'unknown';
      const update = {
        ...data,
        timestamp: new Date(),
      };

      setPriceUpdates(prev => {
        const newMap = new Map(prev);
        newMap.set(token, update);
        return newMap;
      });

      setLatestPrices(prev => {
        const newMap = new Map(prev);
        newMap.set(token, {
          price: data.price,
          timestamp: new Date(),
        });
        return newMap;
      });
    };

    wsService.on('price_update', handlePriceUpdate);

    return () => {
      wsService.off('price_update', handlePriceUpdate);
    };
  }, []);

  return {
    priceUpdates,
    latestPrices,
    getPriceUpdate: (token: string) => priceUpdates.get(token),
    getLatestPrice: (token: string) => latestPrices.get(token),
  };
}

// Hook for real-time transaction updates
export function useTransactionUpdates() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [latestUpdate, setLatestUpdate] = useState<any>(null);

  useEffect(() => {
    const handleTransactionUpdate = (data: any) => {
      setLatestUpdate(data);
      setUpdates(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 updates
    };

    wsService.on('transaction_update', handleTransactionUpdate);

    return () => {
      wsService.off('transaction_update', handleTransactionUpdate);
    };
  }, []);

  return {
    updates,
    latestUpdate,
  };
}

// Hook for system announcements
export function useSystemAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [latestAnnouncement, setLatestAnnouncement] = useState<any>(null);

  useEffect(() => {
    const handleSystemAnnouncement = (data: any) => {
      setLatestAnnouncement(data);
      setAnnouncements(prev => [data, ...prev.slice(0, 4)]); // Keep last 5 announcements
    };

    wsService.on('system_announcement', handleSystemAnnouncement);

    return () => {
      wsService.off('system_announcement', handleSystemAnnouncement);
    };
  }, []);

  return {
    announcements,
    latestAnnouncement,
  };
}

// Hook for user notifications
export function useUserNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleUserNotification = (data: any) => {
      setNotifications(prev => [data, ...prev]);
      if (!data.read) {
        setUnreadCount(prev => prev + 1);
      }
    };

    wsService.on('user_notification', handleUserNotification);

    return () => {
      wsService.off('user_notification', handleUserNotification);
    };
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}

// Hook for KYC updates
export function useKYCUpdates() {
  const [kycStatus, setKycStatus] = useState<string>('unknown');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const handleKYCUpdate = (data: any) => {
      setKycStatus(data.status);
      setLastUpdate(new Date());
    };

    wsService.on('kyc_update', handleKYCUpdate);

    return () => {
      wsService.off('kyc_update', handleKYCUpdate);
    };
  }, []);

  return {
    kycStatus,
    lastUpdate,
  };
}

// Hook for wallet updates
export function useWalletUpdates() {
  const [walletStatus, setWalletStatus] = useState<string>('unknown');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const handleWalletUpdate = (data: any) => {
      setWalletStatus(data.status);
      setLastUpdate(new Date());
    };

    wsService.on('wallet_update', handleWalletUpdate);

    return () => {
      wsService.off('wallet_update', handleWalletUpdate);
    };
  }, []);

  return {
    walletStatus,
    lastUpdate,
  };
}

// Hook for WebSocket subscriptions
export function useWebSocketSubscriptions() {
  const subscriptionsRef = useRef<Set<string>>(new Set());

  const subscribe = (subscriptions: string[]) => {
    subscriptions.forEach(sub => subscriptionsRef.current.add(sub));
    wsService.subscribe(subscriptions);
  };

  const unsubscribe = (subscriptions: string[]) => {
    subscriptions.forEach(sub => subscriptionsRef.current.delete(sub));
    wsService.unsubscribe(subscriptions);
  };

  const subscribeToAll = () => {
    const allSubscriptions = [
      'investment_updates',
      'sale_status',
      'price_updates',
      'transaction_updates',
      'system_announcements',
      'user_notifications',
      'kyc_updates',
      'wallet_updates',
    ];
    subscribe(allSubscriptions);
  };

  const unsubscribeFromAll = () => {
    const allSubscriptions = Array.from(subscriptionsRef.current);
    unsubscribe(allSubscriptions);
  };

  useEffect(() => {
    return () => {
      // Cleanup subscriptions on unmount
      unsubscribeFromAll();
    };
  }, []);

  return {
    subscribe,
    unsubscribe,
    subscribeToAll,
    unsubscribeFromAll,
    currentSubscriptions: Array.from(subscriptionsRef.current),
  };
}

// Hook for WebSocket ping/pong (connection health)
export function useWebSocketHealth() {
  const [lastPing, setLastPing] = useState<Date | null>(null);
  const [lastPong, setLastPong] = useState<Date | null>(null);
  const [isHealthy, setIsHealthy] = useState(true);

  useEffect(() => {
    const handlePong = () => {
      setLastPong(new Date());
      setIsHealthy(true);
    };

    wsService.on('pong', handlePong);

    // Ping every 30 seconds
    const pingInterval = setInterval(() => {
      if (wsService.isConnected()) {
        setLastPing(new Date());
        wsService.ping();
      }
    }, 30000);

    // Check health every 5 seconds
    const healthCheckInterval = setInterval(() => {
      if (lastPing && lastPong) {
        const timeDiff = lastPing.getTime() - lastPong.getTime();
        setIsHealthy(timeDiff < 60000); // Consider unhealthy if no pong in 60 seconds
      }
    }, 5000);

    return () => {
      wsService.off('pong', handlePong);
      clearInterval(pingInterval);
      clearInterval(healthCheckInterval);
    };
  }, [lastPing, lastPong]);

  return {
    lastPing,
    lastPong,
    isHealthy,
  };
}
