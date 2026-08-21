export interface AppNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  url: string;
  category: "ANNOUNCEMENT" | "DIPLOMA" | "SYSTEM" | "COMMUNITY";
  isRead?: boolean;
  createdAt: string;
  icon?: string;
  badge?: string;
}

const STORAGE_KEY_DELETED = "timevalley_deleted_notifications";
const STORAGE_KEY_READ = "timevalley_read_notifications";
const STORAGE_KEY_CUSTOM = "timevalley_custom_notifications";

export const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "🚀 Welcome to TimeValley Platform",
    body: "Instant push notifications and telemetry are now active. Explore our 120h Venture Architect Diploma.",
    date: "Just now",
    url: "/workspace",
    category: "SYSTEM",
    createdAt: new Date().toISOString(),
    icon: "fa-rocket",
    badge: "PLATFORM",
  },
  {
    id: "notif-2",
    title: "💡 Venture Architect & Founder Diploma Live",
    body: "8 comprehensive modules for founding tech startups from Day-Zero to Series A in MENA.",
    date: "2 hours ago",
    url: "/diplomas",
    category: "DIPLOMA",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    icon: "fa-graduation-cap",
    badge: "DIPLOMA",
  },
  {
    id: "notif-3",
    title: "🤝 Co-Founder Matchmaking Open",
    body: "Explore active recruiting teams or list your startup looking for technical and business co-founders.",
    date: "1 day ago",
    url: "/teams",
    category: "COMMUNITY",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    icon: "fa-user-group",
    badge: "MATCHMAKING",
  },
  {
    id: "notif-4",
    title: "📊 TAM / SAM / SOM Market Calculator Ready",
    body: "Test our interactive market sizing tool with ICP scoring and defensibility metrics in your workspace.",
    date: "2 days ago",
    url: "/market-research",
    category: "ANNOUNCEMENT",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    icon: "fa-chart-pie",
    badge: "TOOLS",
  },
];

export const notificationStorage = {
  getNotifications(): AppNotification[] {
    if (typeof window === "undefined") return DEFAULT_NOTIFICATIONS;

    try {
      const deletedRaw = localStorage.getItem(STORAGE_KEY_DELETED);
      const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];

      const readRaw = localStorage.getItem(STORAGE_KEY_READ);
      const readIds: string[] = readRaw ? JSON.parse(readRaw) : [];

      const customRaw = localStorage.getItem(STORAGE_KEY_CUSTOM);
      const customItems: AppNotification[] = customRaw ? JSON.parse(customRaw) : [];

      const all = [...customItems, ...DEFAULT_NOTIFICATIONS];

      return all
        .filter((item) => !deletedIds.includes(item.id))
        .map((item) => ({
          ...item,
          isRead: readIds.includes(item.id),
        }));
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  },

  deleteNotification(id: string): void {
    if (typeof window === "undefined") return;
    try {
      const deletedRaw = localStorage.getItem(STORAGE_KEY_DELETED);
      const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(deletedIds));
      }
      window.dispatchEvent(new Event("notifications_updated"));
    } catch {}
  },

  markAsRead(id: string): void {
    if (typeof window === "undefined") return;
    try {
      const readRaw = localStorage.getItem(STORAGE_KEY_READ);
      const readIds: string[] = readRaw ? JSON.parse(readRaw) : [];
      if (!readIds.includes(id)) {
        readIds.push(id);
        localStorage.setItem(STORAGE_KEY_READ, JSON.stringify(readIds));
      }
      window.dispatchEvent(new Event("notifications_updated"));
    } catch {}
  },

  markAllAsRead(): void {
    if (typeof window === "undefined") return;
    try {
      const all = this.getNotifications();
      const readIds = all.map((n) => n.id);
      localStorage.setItem(STORAGE_KEY_READ, JSON.stringify(readIds));
      window.dispatchEvent(new Event("notifications_updated"));
    } catch {}
  },

  clearAll(): void {
    if (typeof window === "undefined") return;
    try {
      const all = this.getNotifications();
      const deletedRaw = localStorage.getItem(STORAGE_KEY_DELETED);
      const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
      all.forEach((n) => {
        if (!deletedIds.includes(n.id)) deletedIds.push(n.id);
      });
      localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(deletedIds));
      window.dispatchEvent(new Event("notifications_updated"));
    } catch {}
  },
};
