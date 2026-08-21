"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import {
  notificationStorage,
  AppNotification,
} from "@/services/notificationStorage";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeCategory, setActiveCategory] = useState<
    "ALL" | "ANNOUNCEMENT" | "DIPLOMA" | "SYSTEM" | "COMMUNITY"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    loadNotifications();

    const handleUpdate = () => {
      loadNotifications();
    };

    window.addEventListener("notifications_updated", handleUpdate);
    return () => window.removeEventListener("notifications_updated", handleUpdate);
  }, []);

  const loadNotifications = () => {
    setNotifications(notificationStorage.getNotifications());
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    notificationStorage.deleteNotification(id);
    showToast("Notification deleted.");
  };

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    notificationStorage.markAsRead(id);
  };

  const handleMarkAllRead = () => {
    notificationStorage.markAllAsRead();
    showToast("All notifications marked as read.");
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all notifications?")) {
      notificationStorage.clearAll();
      showToast("All notifications cleared.");
    }
  };

  const handleNotificationClick = (item: AppNotification) => {
    notificationStorage.markAsRead(item.id);
    if (item.url) {
      router.push(item.url);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const filteredNotifications = notifications.filter((item) => {
    const matchesCategory =
      activeCategory === "ALL" || item.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      item.body.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#FAF0E9]/40 text-[#1C2B2D] pb-20 selection:bg-[#0E6875] selection:text-white">
      {/* Top Hero Banner */}
      <div className="bg-linear-to-r from-[#0C4E58] via-[#0E6875] to-[#148393] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-lg">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md text-white flex items-center justify-center text-3xl shadow-xl border border-white/20">
                <i className="fa-solid fa-bell animate-swing"></i>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-teal-400/20 text-teal-200 px-3 py-0.5 rounded-full border border-teal-300/30">
                    Real-time Telemetry
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-black bg-amber-400 text-gray-950 px-2.5 py-0.5 rounded-full shadow-xs">
                      {unreadCount} Unread
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
                  Notification Center
                </h1>
                <p className="text-teal-100/90 text-xs sm:text-sm font-medium mt-0.5">
                  Platform announcements, diploma releases, telemetry alerts, and venture updates.
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={handleMarkAllRead}
                    className="bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
                  >
                    <i className="fa-solid fa-check-double text-xs"></i>
                    <span>Mark all as read</span>
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="bg-red-500/20 hover:bg-red-500/30 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl border border-red-400/30 transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
                  >
                    <i className="fa-solid fa-trash-can text-xs"></i>
                    <span>Clear all</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Breadcrumbs */}
        <div className="flex justify-start">
          <Breadcrumbs />
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-black flex items-center gap-2 shadow-sm animate-fadeIn">
            <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Filter Toolbar & Search */}
        <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {[
              { id: "ALL", label: "All Alerts", icon: "fa-layer-group" },
              { id: "DIPLOMA", label: "Diplomas", icon: "fa-graduation-cap" },
              { id: "ANNOUNCEMENT", label: "Announcements", icon: "fa-bullhorn" },
              { id: "COMMUNITY", label: "Matchmaking", icon: "fa-user-group" },
              { id: "SYSTEM", label: "System", icon: "fa-bolt" },
            ].map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#0E6875] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <i className={`fa-solid ${tab.icon} text-xs`}></i>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-gray-400 text-xs"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications..."
              className="w-full bg-[#FAF0E9]/50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
            />
          </div>
        </div>

        {/* Notifications List Grid */}
        {filteredNotifications.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#0E6875] flex items-center justify-center text-3xl mx-auto border border-[#0E6875]/20 shadow-xs">
              <i className="fa-solid fa-bell-slash"></i>
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-black text-gray-900">
                No Notifications Found
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                {notifications.length === 0
                  ? "You have cleared all alerts. New system and diploma updates will appear here in real time."
                  : "No notifications match your current filter or search criteria."}
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/diplomas"
                className="bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <i className="fa-solid fa-graduation-cap"></i>
                <span>Explore Diplomas</span>
              </Link>
              <Link
                href="/workspace"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2"
              >
                <i className="fa-solid fa-laptop-code"></i>
                <span>Go to Workspace</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group shadow-sm hover:shadow-md ${
                  item.isRead
                    ? "bg-white border-gray-200/80 hover:border-[#0E6875]/40"
                    : "bg-[#FAF0E9]/60 border-[#EDA296]/60 hover:border-[#0E6875]"
                }`}
              >
                {/* Left Content */}
                <div className="flex items-start gap-4 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-xs border transition-transform duration-300 group-hover:scale-105 ${
                      item.category === "DIPLOMA"
                        ? "bg-teal-50 text-[#0E6875] border-teal-200"
                        : item.category === "COMMUNITY"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : item.category === "SYSTEM"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        item.icon || "fa-bell"
                      }`}
                    ></i>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          item.category === "DIPLOMA"
                            ? "bg-teal-50 text-[#0E6875] border-[#0E6875]/30"
                            : item.category === "COMMUNITY"
                            ? "bg-purple-50 text-purple-700 border-purple-300"
                            : "bg-amber-50 text-amber-800 border-amber-300"
                        }`}
                      >
                        {item.badge || item.category}
                      </span>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#0E6875] animate-ping" />
                      )}
                      <span className="text-[11px] font-bold text-gray-400">
                        {item.date}
                      </span>
                    </div>

                    <h3
                      className={`font-black text-sm text-gray-900 group-hover:text-[#0E6875] transition-colors truncate ${
                        !item.isRead ? "font-black" : "font-bold"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-2">
                      {item.body}
                    </p>
                  </div>
                </div>

                {/* Right Interactive Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto pt-2 sm:pt-0">
                  {item.url && (
                    <span className="text-xs font-extrabold text-[#0E6875] bg-[#E6F3F5] hover:bg-[#0E6875] hover:text-white px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-[#0E6875]/20">
                      <span>Open Link</span>
                      <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                    </span>
                  )}

                  {!item.isRead && (
                    <button
                      onClick={(e) => handleMarkAsRead(item.id, e)}
                      className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-all cursor-pointer"
                      title="Mark as read"
                    >
                      <i className="fa-solid fa-check text-xs"></i>
                    </button>
                  )}

                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-all cursor-pointer border border-red-200"
                    title="Delete notification"
                  >
                    <i className="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
