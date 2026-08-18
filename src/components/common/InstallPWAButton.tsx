"use client";

import { useEffect, useState } from "react";

export default function InstallPWAButton({ className = "" }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  if (isStandalone) {
    return null;
  }

  return (
    <>
      {/* Sleek App Install Trigger Button */}
      <button
        onClick={handleInstallClick}
        className={`group relative inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[#0E6875]/25 bg-[#0E6875]/10 hover:bg-[#0E6875] text-[#0E6875] hover:text-white transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md active:scale-95 shrink-0 ${className}`}
        title="Install TimeValley Web App"
        aria-label="Install TimeValley Web App"
      >
        <i className="fa-solid fa-download text-xs group-hover:translate-y-0.5 transition-transform duration-200"></i>
      </button>

      {/* Ultra-Premium Glassmorphism PWA Installation Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-[#051c20]/75 backdrop-blur-md animate-in fade-in duration-200">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#0E6875]/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-[#EDA296]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 shadow-[0_25px_80px_-15px_rgba(14,104,117,0.4)] border border-teal-500/20 text-left space-y-5 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center text-xs transition-all cursor-pointer hover:rotate-90 duration-300 shadow-2xs"
              aria-label="Close modal"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* Header Emblem & Pill */}
            <div className="text-center space-y-3 pt-1">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-[#0E6875]/15 animate-ping opacity-30" />
                <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-[#0C4E58] via-[#0E6875] to-[#148393] text-white flex items-center justify-center text-2xl shadow-lg shadow-[#0E6875]/30 relative z-10">
                  <i className="fa-solid fa-mobile-screen-button text-teal-200 animate-bounce duration-1000"></i>
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF0E9] border border-[#EDA296]/50 text-[#0E6875] text-[10px] font-black uppercase tracking-wider shadow-2xs">
                  <i className="fa-solid fa-bolt text-[#EDA296]"></i> Web App Experience
                </span>
                <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight mt-1.5">
                  Install TimeValley App
                </h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1 max-w-xs mx-auto">
                  Add TimeValley to your home screen for instant full-screen access, fast loading, and offline notifications.
                </p>
              </div>
            </div>

            {/* Device-Specific Instruction Cards */}
            <div className="space-y-2.5 pt-1">
              {/* Desktop Instruction */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-teal-50/60 border border-teal-100/80 hover:bg-teal-50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-[#0E6875] text-white flex items-center justify-center shrink-0 shadow-xs text-sm">
                  <i className="fa-solid fa-desktop"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <span>Desktop (Chrome / Edge / Brave)</span>
                  </div>
                  <p className="text-[11px] text-gray-600 font-medium leading-tight mt-0.5">
                    Click the <strong className="text-[#0E6875]">Install (+)</strong> icon inside your browser URL address bar.
                  </p>
                </div>
              </div>

              {/* iOS Safari Instruction */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/60 border border-amber-100/80 hover:bg-amber-50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs text-sm">
                  <i className="fa-solid fa-mobile-button"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <span>iOS Safari (iPhone / iPad)</span>
                  </div>
                  <p className="text-[11px] text-gray-600 font-medium leading-tight mt-0.5">
                    Tap <strong className="text-amber-800">Share <i className="fa-solid fa-arrow-up-from-bracket"></i></strong>, then select <strong className="text-amber-800">Add to Home Screen (+)</strong>.
                  </p>
                </div>
              </div>

              {/* Android Instruction */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100/80 hover:bg-emerald-50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs text-sm">
                  <i className="fa-brands fa-android"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <span>Android (Chrome / Samsung)</span>
                  </div>
                  <p className="text-[11px] text-gray-600 font-medium leading-tight mt-0.5">
                    Tap menu <strong className="text-emerald-800">⋮</strong>, then select <strong className="text-emerald-800">Add to Home screen</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full bg-linear-to-r from-[#0E6875] via-[#107988] to-[#0E6875] hover:from-[#0B4E58] hover:to-[#0B4E58] text-white text-xs font-black py-3 px-5 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Got It!</span>
                <i className="fa-solid fa-circle-check text-sm text-teal-200"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

