import { io, Socket } from 'socket.io-client';
import { getStoredAuthToken } from './pharmacyOrderApi';

export interface OrderStatusUpdatePayload {
  orderId: string;
  patientId: string;
  pharmacyId?: string | null;
  status: string;
  previousStatus: string;
  updatedAt: string;
  message: string;
}

const SOCKET_SERVER_URL = 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private listeners: Set<(payload: OrderStatusUpdatePayload) => void> = new Set();
  private connectionListeners: Set<(connected: boolean) => void> = new Set();

  /**
   * Connect to Socket.IO server with JWT authentication
   */
  public connect(token?: string): Socket | null {
    const authToken = token || getStoredAuthToken();
    if (!authToken) {
      return null;
    }

    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(SOCKET_SERVER_URL, {
      auth: { token: authToken },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.notifyConnectionState(true);
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.notifyConnectionState(false);
    });

    this.socket.on('connect_error', () => {
      this.isConnected = false;
      this.notifyConnectionState(false);
    });

    // Listen for order status update events
    this.socket.on('pharmacy:order-status-updated', (payload: OrderStatusUpdatePayload) => {
      this.listeners.forEach((callback) => {
        try {
          callback(payload);
        } catch (err) {
          console.error('Error handling socket order event:', err);
        }
      });
    });

    return this.socket;
  }

  /**
   * Subscribe to order updates
   */
  public subscribeToOrderUpdates(callback: (payload: OrderStatusUpdatePayload) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Subscribe to connection state changes
   */
  public onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionListeners.add(callback);
    callback(this.isConnected);
    return () => {
      this.connectionListeners.delete(callback);
    };
  }

  private notifyConnectionState(connected: boolean) {
    this.connectionListeners.forEach((cb) => {
      try {
        cb(connected);
      } catch (err) {
        console.error('Error in connection listener:', err);
      }
    });
  }

  public getConnected(): boolean {
    return this.isConnected;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.notifyConnectionState(false);
    }
  }
}

export const socketService = new SocketService();
