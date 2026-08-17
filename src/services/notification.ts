import apiClient from '@/lib/axios';

export interface PushNotificationPayload {
  title: string;
  body: string;
  targetUrl?: string;
  scope?: 'ALL' | 'STUDENTS' | 'ADMINS';
}

export interface PushLog {
  id: string;
  title: string;
  body: string;
  targetUrl?: string;
  sentBy: string;
  recipients: number;
  status: string;
  createdAt: string;
}

export interface PushStats {
  subscribersCount: number;
  totalUsersCount: number;
  logsCount: number;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const notificationService = {
  /**
   * Request browser permission and subscribe device to PWA push notifications
   */
  async subscribeUserToPush(): Promise<{ success: boolean; message: string }> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return { success: false, message: 'Push Notifications are not supported by this browser.' };
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, message: 'Notification permission was denied.' };
    }

    try {
      // Fetch VAPID Public Key from NestJS
      const keyRes = await apiClient.get<{ publicKey: string }>('/notifications/public-key');
      const publicKey = keyRes.data.publicKey;

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        const convertedKey = urlBase64ToUint8Array(publicKey);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey,
        });
      }

      // Send subscription object to NestJS backend
      const subJson = subscription.toJSON();
      await apiClient.post('/notifications/subscribe', {
        endpoint: subJson.endpoint,
        keys: subJson.keys,
        userAgent: navigator.userAgent,
      });

      return { success: true, message: 'Device successfully subscribed to PWA Push Notifications!' };
    } catch (err: any) {
      console.error('Failed to subscribe user to push notifications:', err);
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to complete push subscription.',
      };
    }
  },

  /**
   * ADMIN: Fetch PWA subscriber & broadcast statistics
   */
  async getStats(): Promise<PushStats> {
    const res = await apiClient.get<PushStats>('/notifications/admin/stats');
    return res.data;
  },

  /**
   * ADMIN: Fetch recent broadcast logs
   */
  async getLogs(): Promise<PushLog[]> {
    const res = await apiClient.get<PushLog[]>('/notifications/admin/logs');
    return res.data;
  },

  /**
   * ADMIN: Broadcast Push Notification to target PWA devices
   */
  async broadcastNotification(payload: PushNotificationPayload) {
    const res = await apiClient.post('/notifications/admin/broadcast', payload);
    return res.data;
  },
};

export default notificationService;
