"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export interface RealtimeAccessEvent {
  type?: "diploma" | "module" | "assignment";
  userId: string;
  courseId?: string;
  moduleId?: string;
  moduleTitle?: string;
  isUnlocked?: boolean;
  title?: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE" | string;
  hasDiplomaAccess?: boolean;
  timestamp?: number;
}

interface Props {
  event: RealtimeAccessEvent | null;
  onClose: () => void;
}

export default function RealtimeNotificationToast({ event, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [animatingIn, setAnimatingIn] = useState(false);

  useEffect(() => {
    if (event) {
      setMounted(true);
      const animTimer = setTimeout(() => {
        setAnimatingIn(true);
      }, 30);

      const closeTimer = setTimeout(() => {
        setAnimatingIn(false);
        setTimeout(() => {
          setMounted(false);
          onClose();
        }, 450);
      }, 8000);

      return () => {
        clearTimeout(animTimer);
        clearTimeout(closeTimer);
      };
    } else {
      setAnimatingIn(false);
      setMounted(false);
    }
  }, [event, onClose]);

  if (!event || !mounted) return null;

  const isModuleEvent = event.type === "module" || Boolean(event.moduleId);
  const isAssignmentEvent = event.type === "assignment";
  const isDiplomaGranted = event.status === "ACTIVE" || Boolean(event.hasDiplomaAccess);
  const isModuleUnlocked = Boolean(event.isUnlocked);

  const isSuccessState = isAssignmentEvent ? true : isModuleEvent ? isModuleUnlocked : isDiplomaGranted;

  const handleManualClose = () => {
    setAnimatingIn(false);
    setTimeout(() => {
      setMounted(false);
      onClose();
    }, 450);
  };

  // Determine Title & Description dynamically
  let toastTitle = "تم منحك صلاحية الدبلومة بنجاح! 🎉";
  let toastDesc = "تم تفعيل وصولك لدبلومة مهندس المشاريع (Venture Architect Diploma) بنجاح. يمكنك الآن تصفح جميع المحاضرات والملفات فوراً.";
  let iconEmoji = "🎓";

  if (isAssignmentEvent) {
    iconEmoji = "📋";
    toastTitle = `مهمة جديدة: ${event.title || "محتوى مخصص"}`;
    toastDesc = event.description || "تم إضافة مهمة مخصصة جديدة لك في حسابك.";
  } else if (isModuleEvent) {
    iconEmoji = isModuleUnlocked ? "🔓" : "🔒";
    if (isModuleUnlocked) {
      toastTitle = `تم فتح ${event.moduleTitle || "وحدة جديدة"}! 🎉`;
      toastDesc = `تم منحك صلاحية الوصول للوحدة (${event.moduleTitle || event.moduleId}) في الدبلومة.`;
    } else {
      toastTitle = `تحديث صلاحية ${event.moduleTitle || "الوحدة"}`;
      toastDesc = `تم إغلاق صلاحية الوصول للوحدة (${event.moduleTitle || event.moduleId}).`;
    }
  } else {
    iconEmoji = isDiplomaGranted ? "🎓" : "ℹ️";
    if (!isDiplomaGranted) {
      toastTitle = "تحديث حالة تفعيل الدبلومة";
      toastDesc = "تم تحديث حالة تفعيل الدبلومة الخاصة بك بواسطة الإدارة.";
    }
  }

  return (
    <div
      className={`fixed top-6 right-6 z-99999 max-w-md w-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${
        animatingIn
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-12 opacity-0 scale-90"
      }`}
      dir="rtl"
    >
      {/* TimeValley Ambient Soft Glow Backdrop */}
      <div
        className={`absolute -inset-1.5 bg-linear-to-r from-[#0E6875]/30 via-teal-400/25 to-[#0E6875]/30 rounded-4xl blur-2xl transition-all duration-700 pointer-events-none ${
          animatingIn ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      />

      {/* Main Glassmorphism Toast Card */}
      <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl p-5 border border-[#0E6875]/20 shadow-[0_20px_50px_rgba(14,104,117,0.20)] overflow-hidden">
        <div className="flex items-start gap-4">
          {/* Animated Emblem Icon Badge */}
          <div className="relative shrink-0">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-md border transition-transform duration-500 ${
                animatingIn ? "scale-100 rotate-0" : "scale-75 -rotate-12"
              } ${
                isSuccessState
                  ? "bg-linear-to-tr from-[#0C4E58] to-[#0E6875] text-white border-teal-300/30"
                  : "bg-linear-to-tr from-amber-600 to-amber-500 text-white border-amber-300/30"
              }`}
            >
              {iconEmoji}
            </div>
            {/* Live Ping Indicator Dot */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isSuccessState ? "bg-teal-400" : "bg-amber-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white ${
                  isSuccessState ? "bg-[#0E6875]" : "bg-amber-500"
                }`}
              />
            </span>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center justify-between gap-2">
              {/* TimeValley Pill Badge */}
              <span className="bg-[#E6F3F5] text-[#0E6875] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-[#0E6875]/20 flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E6875] animate-pulse" />
                TimeValley Realtime
              </span>

              {/* Close Button */}
              <button
                onClick={handleManualClose}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-all text-xs font-bold shadow-xs active:scale-90"
                title="إغلاق"
              >
                ✕
              </button>
            </div>

            {/* Header Title */}
            <h4 className="font-extrabold text-sm text-gray-900 mt-2 tracking-tight">
              {toastTitle}
            </h4>

            {/* Description */}
            <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1">
              {toastDesc}
            </p>

            {/* Bottom Footer Action Bar */}
            {isSuccessState && (
              <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[#0E6875] font-bold text-[11px] flex items-center gap-1">
                  <span className="text-emerald-500">✓</span> الوصول مفتوح الآن
                </span>
                <Link
                  href="/diplomas"
                  onClick={handleManualClose}
                  className="px-3.5 py-1.5 rounded-xl bg-linear-to-r from-[#0C4E58] to-[#0E6875] text-white font-bold text-xs hover:shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
                >
                  <span>تصفح المحتوى</span>
                  <span>←</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
