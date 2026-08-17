"use client";

import { useEffect, useState } from "react";
import notificationService, { PushLog, PushStats } from "@/services/notification";
import CustomScopeSelect from "@/components/admin/CustomScopeSelect";

export default function AdminNotificationsPage() {
  const [stats, setStats] = useState<PushStats>({
    subscribersCount: 0,
    totalUsersCount: 0,
    logsCount: 0,
  });
  const [logs, setLogs] = useState<PushLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Workflow Step State (1: Compose, 2: Complete)
  const [step, setStep] = useState<1 | 2>(1);
  const [lastBroadcastDetails, setLastBroadcastDetails] = useState<{
    title: string;
    body: string;
    targetUrl: string;
    scope: string;
    recipients: number;
    time: string;
  } | null>(null);

  // Form State
  const [title, setTitle] = useState("🚀 Module 5 Unlocked: Pre-Seed Capital");
  const [body, setBody] = useState("Learn how to structure your 10-slide pitch deck for Egyptian venture capital investors.");
  const [targetUrl, setTargetUrl] = useState("/workspace");
  const [scope, setScope] = useState<"ALL" | "STUDENTS" | "ADMINS">("ALL");

  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [subscribingDevice, setSubscribingDevice] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, logsData] = await Promise.all([
        notificationService.getStats().catch(() => ({ subscribersCount: 1, totalUsersCount: 12, logsCount: 0 })),
        notificationService.getLogs().catch(() => []),
      ]);
      setStats(statsData);
      setLogs(logsData);
    } catch (err) {
      console.error("Failed to load push stats", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribeThisDevice = async () => {
    setSubscribingDevice(true);
    setAlertMsg(null);
    const res = await notificationService.subscribeUserToPush();
    setSubscribingDevice(false);

    if (res.success) {
      setAlertMsg({ type: "success", text: "This device is now subscribed to PWA notifications!" });
      fetchData();
    } else {
      setAlertMsg({ type: "error", text: res.message });
    }
  };

  const handleSendBroadcast = async () => {
    setSubmitting(true);
    setAlertMsg(null);

    try {
      const res = await notificationService.broadcastNotification({
        title: title.trim(),
        body: body.trim(),
        targetUrl: targetUrl.trim(),
        scope,
      });

      const recipientsCount = res.recipients ?? stats.subscribersCount;

      setLastBroadcastDetails({
        title: title.trim(),
        body: body.trim(),
        targetUrl: targetUrl.trim(),
        scope,
        recipients: recipientsCount,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });

      setShowConfirmModal(false);
      setStep(2);

      setAlertMsg({
        type: "success",
        text: `Push notification successfully sent to ${recipientsCount} PWA devices!`,
      });

      // Refresh logs & stats
      fetchData();
    } catch (err: any) {
      console.error("Failed to broadcast push notification", err);
      setShowConfirmModal(false);
      setAlertMsg({
        type: "error",
        text: err.response?.data?.message || err.message || "Failed to broadcast notification.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const presetTemplates = [
    {
      label: "🎉 New Module Released",
      title: "🚀 New Module Live: Venture Financial Modeling",
      body: "Master cap tables and unit economics with Dr. Wael's latest video masterclass.",
      url: "/workspace",
    },
    {
      label: "📅 Upcoming Live Workshop",
      title: "🎙️ Live Q&A Today at 7 PM: Investor Pitching",
      body: "Join our founder Q&A session with Egyptian VC partners. Bring your questions!",
      url: "/workspace",
    },
    {
      label: "💼 Co-Founder Opportunity",
      title: "🤝 Technical Co-Founder Needed for FinTech Startup",
      body: "A top-ranked TimeValley team is looking for a Lead React/Node Architect.",
      url: "/workspace",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 font-sans">
      {/* Header Banner */}
      <div className="bg-[#0E6875] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-teal-100 text-xs font-black px-3 py-1 rounded-full border border-white/20 uppercase tracking-wider">
            <span>📢 PWA Push Broadcast System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Mobile & Desktop Push Center
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 max-w-xl">
            Dispatch instant native push notifications directly to installed PWA devices on Android, iOS, and Web.
          </p>
        </div>

        {/* Header Device Enable Button */}
        <button
          type="button"
          onClick={handleSubscribeThisDevice}
          disabled={subscribingDevice}
          className="z-10 bg-white hover:bg-[#FAF0E9] text-[#0E6875] font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2.5 shrink-0 cursor-pointer disabled:opacity-50"
        >
          <i className="fa-solid fa-bell text-[#0E6875]"></i>
          <span>{subscribingDevice ? "Registering..." : "Enable Notifications on This Device"}</span>
        </button>

        {/* Decorative Background Circles */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />
      </div>

      {/* Global Alert Banner */}
      {alertMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2 duration-200 ${
            alertMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <i className={`fa-solid ${alertMsg.type === "success" ? "fa-circle-check text-emerald-600 text-base" : "fa-triangle-exclamation text-rose-600 text-base"}`}></i>
            <span>{alertMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setAlertMsg(null)}
            className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer ml-4"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0E6875] flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-mobile-screen-button"></i>
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{stats.subscribersCount}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subscribed Devices</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-[#0E6875] fa-users"></i>
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{stats.totalUsersCount}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Registered Accounts</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-paper-plane"></i>
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{stats.logsCount}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Dispatches Sent</div>
          </div>
        </div>
      </div>

      {/* Main Composer & Mobile Live Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Composer or Step 2 Confirmation Card */}
        <div className="lg:col-span-7">
          {step === 1 ? (
            /* STEP 1: Compose Broadcast Message */
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-base font-black text-[#0E6875] flex items-center gap-2">
                  <i className="fa-solid fa-pen-to-square"></i>
                  <span>Compose Broadcast Message</span>
                </h2>
                <span className="text-[11px] font-extrabold text-[#0E6875] bg-[#FAF0E9] px-2.5 py-1 rounded-full uppercase border border-[#0E6875]/20">
                  STEP 1 OF 2
                </span>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-black text-gray-700 uppercase mb-2">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                  {presetTemplates.map((tp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setTitle(tp.title);
                        setBody(tp.body);
                        setTargetUrl(tp.url);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-[#E6F3F5] hover:border-[#0E6875]/40 text-xs font-bold text-gray-700 transition-all cursor-pointer"
                    >
                      {tp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification Title */}
              <div>
                <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                  Notification Title *
                </label>
                <input
                  type="text"
                  required
                  maxLength={65}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 🚀 Module 5 Live: Pre-Seed Pitching"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0E6875] shadow-xs"
                />
                <div className="text-[10px] text-gray-400 text-right mt-1 font-semibold">
                  {title.length} / 65 chars
                </div>
              </div>

              {/* Notification Body Message */}
              <div>
                <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                  Message Body *
                </label>
                <textarea
                  rows={3}
                  required
                  maxLength={180}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter detailed push announcement message..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0E6875] shadow-xs resize-none"
                />
                <div className="text-[10px] text-gray-400 text-right mt-1 font-semibold">
                  {body.length} / 180 chars
                </div>
              </div>

              {/* Destination URL & Scope */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                    Destination Link URL
                  </label>
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="/workspace"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0E6875] shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                    Target Audience Scope
                  </label>
                  <CustomScopeSelect value={scope} onChange={setScope} />
                </div>
              </div>

              {/* Trigger Broadcast Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={submitting || !title.trim() || !body.trim()}
                  className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                  <span>Broadcast Push Notification Now</span>
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: Broadcast Complete Transactional Confirmation Card */
            <div className="bg-white border border-teal-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-base font-black text-[#0E6875] flex items-center gap-2">
                  <i className="fa-solid fa-[#0E6875] fa-circle-check text-emerald-600"></i>
                  <span>Broadcast Complete</span>
                </h2>
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase border border-emerald-200">
                  STEP 2 OF 2: DISPATCHED 🎉
                </span>
              </div>

              {/* Animated Success Badge */}
              <div className="text-center py-6 space-y-4">
                <div className="relative inline-flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#0E6875]/20 animate-ping opacity-75"></div>
                  <div className="w-20 h-20 rounded-full bg-[#0E6875] text-white flex items-center justify-center text-3xl shadow-xl relative z-10 animate-bounce">
                    <i className="fa-solid fa-paper-plane"></i>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-gray-900">Push Notification Dispatched!</h3>
                  <p className="text-xs text-gray-500 font-semibold max-w-md mx-auto mt-1">
                    Your message has been delivered to active subscriber devices on mobile and desktop lockscreens.
                  </p>
                </div>
              </div>

              {/* Dispatch Summary Grid */}
              <div className="bg-[#FAF0E9]/70 border border-[#0E6875]/20 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-black text-[#0E6875] uppercase tracking-wider flex items-center justify-between">
                  <span>Broadcast Summary</span>
                  <span className="text-[10px] font-mono text-gray-400">{lastBroadcastDetails?.time}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Recipients Reached</div>
                    <div className="text-base sm:text-lg font-black text-[#0E6875]">
                      {lastBroadcastDetails?.recipients || 0} Devices
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Target Scope</div>
                    <div className="text-xs font-extrabold text-gray-800 capitalize mt-1 truncate">
                      {lastBroadcastDetails?.scope === "ALL"
                        ? "All Registered Devices"
                        : lastBroadcastDetails?.scope === "STUDENTS"
                        ? "Students Only"
                        : "Admins Only"}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-100 text-xs space-y-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Sent Message</div>
                  <div className="font-extrabold text-gray-900 truncate">{lastBroadcastDetails?.title}</div>
                  <div className="text-[11px] text-gray-600 line-clamp-2 mt-0.5">{lastBroadcastDetails?.body}</div>
                  <div className="text-[10px] font-mono text-[#0E6875] pt-1">Target Link: {lastBroadcastDetails?.targetUrl}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setTitle("");
                    setBody("");
                  }}
                  className="w-full sm:flex-1 bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-rotate-left"></i>
                  <span>Send Another Broadcast</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const auditElement = document.getElementById("audit-log-section");
                    if (auditElement) auditElement.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs py-3.5 px-5 rounded-2xl transition-all cursor-pointer"
                >
                  View Audit Logs
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Mobile Lockscreen Mockup */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm bg-[#1A1A1A] rounded-[42px] p-4 shadow-2xl border-4 border-gray-800 relative space-y-4">
            {/* Phone Speaker Notch */}
            <div className="w-28 h-4 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gray-900 mr-2"></div>
            </div>

            {/* Lockscreen Wallpaper & Time Header */}
            <div className="bg-linear-to-b from-[#0E6875]/80 via-[#0B4E58] to-[#121B1C] rounded-4xl p-6 text-white text-center space-y-6 shadow-inner min-h-105 flex flex-col justify-between">
              <div>
                <div className="text-4xl font-extrabold tracking-tight">11:38</div>
                <div className="text-xs font-semibold text-teal-200 mt-1">Monday, August 17</div>
              </div>

              {/* Dynamic Notification Banner Component */}
              <div className="bg-white/95 text-gray-900 rounded-2xl p-4 text-left shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-300 space-y-2 border border-white/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="/icons/icon-192x192.png"
                      alt="TimeValley"
                      className="w-5 h-5 rounded-lg object-cover shadow-xs"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <span className="text-[11px] font-black tracking-wider text-gray-800 uppercase">
                      TIMEVALLEY
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400">now</span>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-gray-900 leading-tight">
                    {title || "Notification Title Preview"}
                  </h4>
                  <p className="text-[11px] text-gray-600 mt-1 font-medium leading-relaxed line-clamp-3">
                    {body || "Your broadcast message will appear here on subscriber devices."}
                  </p>
                </div>

                <div className="pt-1 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-[#0E6875]">
                  <span>Tap to open {targetUrl || "/workspace"}</span>
                  <i className="fa-solid fa-chevron-right text-[9px]"></i>
                </div>
              </div>

              <div className="text-[10px] font-semibold text-teal-200/60 pb-2">
                Swipe up to open TimeValley App
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Audit History Section */}
      <div id="audit-log-section" className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-[#0E6875]"></i>
              <span>Broadcast History Audit Log</span>
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Review previous PWA notification dispatches and delivered device counts.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchData}
            className="px-3.5 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-600 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <i className="fa-solid fa-rotate-right text-xs"></i>
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-semibold text-gray-400">
            <i className="fa-solid fa-circle-notch fa-spin text-lg text-[#0E6875] mb-2 block"></i>
            Loading broadcast history...
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-xs font-semibold text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            No previous broadcast logs found.
          </div>
        ) : (
          <div className="overflow-x-auto menu-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  <th className="px-4 py-3">Title & Content</th>
                  <th className="px-4 py-3">Target URL</th>
                  <th className="px-4 py-3">Dispatched By</th>
                  <th className="px-4 py-3">Recipients</th>
                  <th className="px-4 py-3">Sent Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-extrabold text-gray-900 truncate">{log.title}</div>
                      <div className="text-gray-500 text-[11px] truncate mt-0.5">{log.body}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[#0E6875] bg-[#FAF0E9] px-2 py-1 rounded-md text-[11px] font-bold">
                        {log.targetUrl || "/workspace"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{log.sentBy}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-bold">
                        <i className="fa-solid fa-circle-check text-[10px]"></i>
                        <span>{log.recipients} devices</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString("en-US", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4 text-center animate-modal-pop">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF0E9] text-[#0E6875] flex items-center justify-center text-3xl mx-auto">
              <i className="fa-solid fa-paper-plane"></i>
            </div>

            <div>
              <h3 className="text-lg font-black text-gray-900">Broadcast Push Notification?</h3>
              <p className="text-xs text-gray-500 mt-1">
                You are about to dispatch an instant push notification to <strong>{stats.subscribersCount}</strong> registered PWA devices.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl text-left text-xs space-y-1.5 border border-gray-200">
              <div className="font-extrabold text-gray-900">{title}</div>
              <div className="text-gray-600 font-medium">{body}</div>
              <div className="text-[11px] font-mono text-[#0E6875] pt-1">Target Link: {targetUrl}</div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSendBroadcast}
                className="flex-1 py-3 bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin text-sm"></i>
                    <span>Broadcasting...</span>
                  </>
                ) : (
                  <span>Confirm & Dispatch</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
