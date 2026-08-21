/**
 * Lightweight Zero-Dependency Real-Time Socket.io Protocol Client
 * Connects directly using Native Browser WebSockets without requiring external npm packages.
 */

type EventCallback = (data: any) => void;

class RealtimeSocketClient {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private joinedRooms: Set<string> = new Set();
  private isConnected: boolean = false;
  private reconnectTimer: any = null;
  private currentUserId: string | null = null;
  private isAdmin: boolean = false;

  public connect() {
    if (typeof window === "undefined") return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      // Convert http(s) to ws(s)
      let wsUrl = rawApiUrl.replace(/^http/, "ws").replace(/\/api\/?$/, "");
      wsUrl += "/socket.io/?EIO=4&transport=websocket";

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("⚡ [Realtime WS] Connected to TimeValley Socket server via Native WebSocket");
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onerror = (err) => {
        console.warn("⚠️ [Realtime WS] Connection notice:", err);
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        console.log("🔌 [Realtime WS] Socket disconnected, scheduling reconnect...");
        this.scheduleReconnect();
      };
    } catch (e) {
      console.warn("⚠️ [Realtime WS] Connection error:", e);
      this.scheduleReconnect();
    }
  }

  private handleMessage(data: string) {
    if (!data || typeof data !== "string") return;

    // Engine.IO Handshake packet starting with '0'
    if (data.startsWith("0")) {
      // Send Socket.io connect packet '40'
      this.sendRaw("40");
      this.isConnected = true;

      // Re-join active rooms
      if (this.currentUserId) {
        this.joinUserRoom(this.currentUserId);
      }
      if (this.isAdmin) {
        this.joinAdminRoom();
      }
      return;
    }

    // Engine.IO Ping packet '3' -> Respond with Pong '2'
    if (data === "2" || data.startsWith("3")) {
      this.sendRaw("2");
      return;
    }

    // Socket.io Event packet starting with '42'
    if (data.startsWith("42")) {
      try {
        const payloadJson = data.substring(2);
        const parsed = JSON.parse(payloadJson);
        if (Array.isArray(parsed) && parsed.length >= 2) {
          const [eventName, eventData] = parsed;
          this.emitToListeners(eventName, eventData);
        }
      } catch (e) {
        console.warn("⚠️ [Realtime WS] Failed to parse socket message payload:", e);
      }
    }
  }

  private sendRaw(msg: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(msg);
    }
  }

  public joinUserRoom(userId: string) {
    this.currentUserId = userId;
    const room = `user_${userId}`;
    this.joinedRooms.add(room);

    if (this.isConnected) {
      this.sendRaw(`42["join_user_room",{"userId":"${userId}"}]`);
      console.log(`📡 [Realtime WS] Joined room: ${room}`);
    } else {
      this.connect();
    }
  }

  public joinAdminRoom() {
    this.isAdmin = true;
    this.joinedRooms.add("admin_room");

    if (this.isConnected) {
      this.sendRaw(`42["join_admin_room",{}]`);
      console.log("📡 [Realtime WS] Joined room: admin_room");
    } else {
      this.connect();
    }
  }

  public on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  public off(event: string, callback: EventCallback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback);
    }
  }

  private emitToListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      });
    }
  }

  public disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.joinedRooms.clear();
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 4000);
  }
}

export const realtimeSocket = new RealtimeSocketClient();

export const getSocket = () => realtimeSocket;
export const joinUserRoom = (userId: string) => realtimeSocket.joinUserRoom(userId);
export const joinAdminRoom = () => realtimeSocket.joinAdminRoom();
export const disconnectSocket = () => realtimeSocket.disconnect();
