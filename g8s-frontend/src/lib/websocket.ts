// WebSocket service for real-time updates from the G8S LPG backend
class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private isConnecting = false;
  private subscriptions: Set<string> = new Set();
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  private getWebSocketURL(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NEXT_PUBLIC_WS_URL || window.location.host;
    return `${protocol}//${host}`;
  }

  private connect(): void {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(this.getWebSocketURL());

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        
        // Resubscribe to previous subscriptions
        if (this.subscriptions.size > 0) {
          this.ws?.send(JSON.stringify({
            type: 'subscribe',
            subscriptions: Array.from(this.subscriptions)
          }));
        }

        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.emit('disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
        this.emit('error', error);
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  private handleMessage(data: any): void {
    switch (data.type) {
      case 'connection':
        console.log('WebSocket connection message:', data.message);
        break;
      
      case 'subscribed':
        console.log('Subscribed to:', data.subscriptions);
        break;
      
      case 'pong':
        // Handle ping/pong for connection health
        break;
      
      case 'investment_update':
        this.emit('investment_update', data.data);
        break;
      
      case 'sale_status':
        this.emit('sale_status', data.data);
        break;
      
      case 'price_update':
        this.emit('price_update', data.data);
        break;
      
      case 'transaction_update':
        this.emit('transaction_update', data.data);
        break;
      
      case 'system_announcement':
        this.emit('system_announcement', data.data);
        break;
      
      case 'user_notification':
        this.emit('user_notification', data.data);
        break;
      
      case 'kyc_update':
        this.emit('kyc_update', data.data);
        break;
      
      case 'wallet_update':
        this.emit('wallet_update', data.data);
        break;
      
      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  }

  // Public methods
  subscribe(subscriptions: string[]): void {
    subscriptions.forEach(sub => this.subscriptions.add(sub));
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        subscriptions: Array.from(this.subscriptions)
      }));
    }
  }

  unsubscribe(subscriptions: string[]): void {
    subscriptions.forEach(sub => this.subscriptions.delete(sub));
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'unsubscribe',
        subscriptions: Array.from(this.subscriptions)
      }));
    }
  }

  ping(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'ping' }));
    }
  }

  // Event system
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in WebSocket event listener:', error);
        }
      });
    }
  }

  // Connection management
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscriptions.clear();
    this.eventListeners.clear();
  }

  reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }

  getConnectionState(): number {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED;
  }

  isConnected(): boolean {
    return this.ws ? this.ws.readyState === WebSocket.OPEN : false;
  }
}

// Create a singleton instance
export const wsService = new WebSocketService();

// Export the class for custom instances
export default WebSocketService;
