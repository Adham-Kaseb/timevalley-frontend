"use client";

import { useEffect, useState } from "react";
import notificationService from "@/services/notification";

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenterModal({ isOpen, onClose }: NotificationCenterModalProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permissionState, setPermissionState] = useState<"default" | "granted" | "denied">("default");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error" | "warning"; text: string } | null>(null);

  const [inboxItems] = useState([
    {
      id: "1",
      title: "🚀 Welcome to TimeValley PWA",
      body: "Instant push notifications are active for real-time startup telemetry.",
      date: "Just now",
      url: "/workspace",
    },
    {
      id: "2",
      title: "💡 Venture Architect Diploma Live",
      body: "Explore 8 comprehensive modules for founding tech startups in MENA.",
      date: "2 hours ago",
      url: "/diplomas",
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      checkSubscriptionAndPermission();
    }
  }, [isOpen]);

  const checkSubscriptionAndPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionState(Notification.permission as any);
    }

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        setIsSubscribed(!!sub);
      } catch (err) {
        setIsSubscribed(false);
      }
    }
  };

  const handleToggleSubscription = async () => {
    setLoading(true);
    setStatusMsg(null);

    // Refresh permission check
    if (typeof window !== "undefined" && "Notification" in window) {
      const currentPerm = Notification.permission;
      setPermissionState(currentPerm as any);

      if (currentPerm === "denied") {
        setLoading(false);
        setStatusMsg({
          type: "warning",
          text: "Notification permission is currently blocked by your browser settings.",
        });
        return;
      }
    }

    if (isSubscribed) {
      // Unsubscribe
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
        }
        setIsSubscribed(false);
        setStatusMsg({ type: "success", text: "Device unsubscribed from push notifications." });
      } catch (err: any) {
        setStatusMsg({ type: "error", text: "Failed to unsubscribe device." });
      }
    } else {
      // Subscribe
      const res = await notificationService.subscribeUserToPush();
      if (res.success) {
        setIsSubscribed(true);
        setPermissionState("granted");
        setStatusMsg({ type: "success", text: "Push notifications successfully enabled!" });
      } else {
        if (typeof window !== "undefined" && "Notification" in window) {
          setPermissionState(Notification.permission as any);
        }
        setStatusMsg({ type: "error", text: res.message });
      }
    }
    setLoading(false);
  };

  const handleRecheckPermission = async () => {
    setLoading(true);
    setStatusMsg(null);
    await checkSubscriptionAndPermission();

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        const res = await notificationService.subscribeUserToPush();
        if (res.success) {
          setIsSubscribed(true);
          setPermissionState("granted");
          setStatusMsg({ type: "success", text: "Permission granted! Push notifications enabled." });
        } else {
          setStatusMsg({ type: "error", text: res.message });
        }
      } else if (Notification.permission === "denied") {
        setStatusMsg({
          type: "warning",
          text: "Permission is still blocked. Follow the steps below to allow notifications.",
        });
      } else {
        setStatusMsg({ type: "warning", text: "Please click 'Enable Now' to request permission." });
      }
    }
    setLoading(false);
  };

  const handleSendTestNotification = async () => {
    if (!("Notification" in window)) {
      setStatusMsg({ type: "error", text: "Notifications not supported on this browser." });
      return;
    }

    if (Notification.permission === "granted") {
      try {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification("⚡ TimeValley Test Alert", {
          body: "Your device is ready to receive instant PWA updates!",
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-192x192.png",
          vibrate: [100, 50, 100],
        } as any);
        setStatusMsg({ type: "success", text: "Test notification dispatched to your device!" });
      } catch (err) {
        new Notification("⚡ TimeValley Test Alert", {
          body: "Your device is ready to receive instant PWA updates!",
          icon: "/icons/icon-192x192.png",
        } as any);
      }
    } else {
      setStatusMsg({ type: "error", text: "Please enable notification permission first." });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-[#051c20]/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#0E6875]/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-[#EDA296]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_-15px_rgba(14,104,117,0.4)] border border-teal-500/20 animate-in zoom-in-95 duration-200 space-y-5 text-left overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-all cursor-pointer hover:rotate-90 duration-300 shadow-2xs"
          aria-label="Close Notification Center"
        >
          <i className="fa-solid fa-xmark text-xs"></i>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-[#0C4E58] via-[#0E6875] to-[#148393] text-teal-200 flex items-center justify-center text-xl shadow-md shrink-0">
            <i className="fa-solid fa-bell-ring animate-bounce duration-1000"></i>
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0E9] border border-[#EDA296]/50 text-[#0E6875] text-[10px] font-black uppercase tracking-wider">
              <i className="fa-solid fa-bolt text-[#EDA296]"></i> Real-time Telemetry
            </span>
            <h2 className="text-xl font-black text-gray-900 tracking-tight mt-0.5">Notification Center</h2>
          </div>
        </div>

        {/* Status Message Banner */}
        {statusMsg && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-150 ${
              statusMsg.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : statusMsg.type === "warning"
                ? "bg-amber-50 border-amber-300 text-amber-900"
                : "bg-red-50 border-red-200 text-red-900"
            }`}
          >
            <i
              className={`fa-solid ${
                statusMsg.type === "success"
                  ? "fa-circle-check text-emerald-600"
                  : statusMsg.type === "warning"
                  ? "fa-triangle-exclamation text-amber-600"
                  : "fa-circle-exclamation text-red-600"
              }`}
            ></i>
            <span className="flex-1">{statusMsg.text}</span>
          </div>
        )}

        {/* Interactive Permission Denied Unblock Guide */}
        {permissionState === "denied" && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                <i className="fa-solid fa-[#EDA296] fa-lock"></i>
                <span>Notifications Blocked in Browser</span>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-full">
                Action Required
              </span>
            </div>

            <p className="text-xs text-amber-900/90 font-medium leading-relaxed">
              Your browser is blocking notifications for TimeValley. To enable real-time alerts:
            </p>

            <div className="bg-white/80 rounded-xl p-3 text-xs space-y-2 text-gray-700 font-medium border border-amber-200/60">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Click the <strong>Tune / Lock <i className="fa-solid fa-sliders text-amber-700"></i></strong> icon next to the URL bar in your browser.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Change <strong>Notifications</strong> permission from <strong>Block</strong> to <strong>Allow</strong>.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>Click <strong>Re-check Permission</strong> below to complete setup.</span>
              </div>
            </div>

            <button
              onClick={handleRecheckPermission}
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-rotate-right text-xs"></i>
              <span>Re-check Permission & Activate</span>
            </button>
          </div>
        )}

        {/* Device Push Subscription Control Box */}
        <div className="bg-teal-50/50 border border-teal-100/80 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0 shadow-xs ${
                isSubscribed ? "bg-emerald-600 text-white" : "bg-[#0E6875] text-white"
              }`}
            >
              <i className={`fa-solid ${isSubscribed ? "fa-bell text-white" : "fa-bell-slash"}`}></i>
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-xs text-gray-900 truncate">
                {isSubscribed ? "PWA Push Notifications Active" : "Push Notifications Disabled"}
              </div>
              <div className="text-[11px] text-gray-500 font-medium truncate">
                {isSubscribed ? "Your device receives instant alerts." : "Enable for real-time startup updates."}
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleSubscription}
            disabled={loading}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs shrink-0 ${
              isSubscribed
                ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                : "bg-[#0E6875] hover:bg-[#0B4E58] text-white shadow-md active:scale-95"
            }`}
          >
            {loading ? "Updating..." : isSubscribed ? "Disable" : "Enable Now"}
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 pt-1">
          <span className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-inbox text-[#0E6875]"></i>
            <span>Recent Announcements</span>
          </span>

          {isSubscribed && (
            <button
              onClick={handleSendTestNotification}
              className="text-[11px] font-bold text-[#0E6875] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
              <span>Test Push Alert</span>
            </button>
          )}
        </div>

        {/* Notification Feed List */}
        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 menu-scrollbar" data-lenis-prevent>
          {inboxItems.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl border border-gray-100 hover:border-[#0E6875]/30 bg-white hover:bg-teal-50/30 transition-all space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-gray-900 group-hover:text-[#0E6875] transition-colors">
                  {item.title}
                </span>
                <span className="text-[10px] font-bold text-gray-400">{item.date}</span>
              </div>
              <p className="text-[11px] text-gray-600 font-medium leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-1 text-center">
          <button
            onClick={onClose}
            className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs py-3 rounded-2xl shadow-md transition-all cursor-pointer active:scale-98"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

