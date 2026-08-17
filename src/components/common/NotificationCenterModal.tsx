"use client";

import { useEffect, useState } from "react";
import notificationService from "@/services/notification";

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenterModal({ isOpen, onClose }: NotificationCenterModalProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [inboxItems, setInboxItems] = useState<Array<{ id: string; title: string; body: string; date: string; url: string }>>([
    {
      id: "1",
      title: "🚀 Welcome to TimeValley PWA",
      body: "Instant push notifications are now active for your device.",
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
      checkSubscriptionStatus();
    }
  }, [isOpen]);

  const checkSubscriptionStatus = async () => {
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
        setStatusMsg({ type: "success", text: "Push notifications successfully enabled!" });
      } else {
        setStatusMsg({ type: "error", text: res.message });
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
        });
        setStatusMsg({ type: "success", text: "Test notification dispatched to your phone!" });
      } catch (err) {
        new Notification("⚡ TimeValley Test Alert", {
          body: "Your device is ready to receive instant PWA updates!",
          icon: "/icons/icon-192x192.png",
        });
      }
    } else {
      setStatusMsg({ type: "error", text: "Please enable notification permission first." });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 relative animate-modal-pop space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close Notification Center"
        >
          <i className="fa-solid fa-xmark text-sm"></i>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF0E9] text-[#0E6875] flex items-center justify-center text-2xl shadow-inner shrink-0">
            <i className="fa-solid fa-bell-ring"></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Notification Center</h2>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">
              Manage PWA device notifications and platform updates.
            </p>
          </div>
        </div>

        {/* Status Message Banner */}
        {statusMsg && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-150 ${
              statusMsg.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <i
              className={`fa-solid ${
                statusMsg.type === "success" ? "fa-circle-check text-emerald-600" : "fa-circle-exclamation text-red-600"
              }`}
            ></i>
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Device Push Subscription Control Box */}
        <div className="bg-[#FAF0E9]/60 border border-[#0E6875]/20 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${
                isSubscribed ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"
              }`}
            >
              <i className={`fa-solid ${isSubscribed ? "fa-bell text-emerald-600" : "fa-bell-slash"}`}></i>
            </div>
            <div>
              <div className="font-extrabold text-xs text-gray-900">
                {isSubscribed ? "PWA Push Notifications Active" : "Push Notifications Disabled"}
              </div>
              <div className="text-[11px] text-gray-500 font-medium">
                {isSubscribed ? "Your device will receive instant alerts." : "Enable to get real-time startup alerts."}
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleSubscription}
            disabled={loading}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-2xs shrink-0 ${
              isSubscribed
                ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                : "bg-[#0E6875] hover:bg-[#0B4E58] text-white shadow-md"
            }`}
          >
            {loading ? "Updating..." : isSubscribed ? "Disable" : "Enable Now"}
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <span className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-[#0E6875] fa-inbox"></i>
            <span>Recent Announcements</span>
          </span>

          {isSubscribed && (
            <button
              onClick={handleSendTestNotification}
              className="text-[11px] font-bold text-[#0E6875] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <i className="fa-solid fa-[#0E6875] fa-paper-plane"></i>
              <span>Test Push Alert</span>
            </button>
          )}
        </div>

        {/* Notification Feed List */}
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 menu-scrollbar" data-lenis-prevent>
          {inboxItems.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl border border-gray-100 hover:border-[#0E6875]/30 bg-white hover:bg-[#FAF0E9]/30 transition-all space-y-1 group"
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
        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs py-3 rounded-2xl shadow-md transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
