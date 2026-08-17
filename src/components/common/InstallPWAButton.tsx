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
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200/80 ${className}`}>
        <i className="fa-solid fa-circle-check text-emerald-600 text-xs"></i>
        <span>App Installed</span>
      </span>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`group border border-[#0E6875]/20 bg-[#0E6875]/10 hover:bg-[#0E6875] text-[#0E6875] hover:text-white text-xs font-extrabold px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${className}`}
        title="Install TimeValley App"
      >
        <i className="fa-solid fa-download text-xs group-hover:translate-y-0.5 transition-transform"></i>
        <span className="inline">Install App</span>
      </button>

      {/* Sleek Modal Guide for Browser / Devices where beforeinstallprompt hasn't triggered */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 relative animate-modal-pop text-center space-y-4">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="w-14 h-14 bg-[#FAF0E9] text-[#0E6875] rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
              <i className="fa-solid fa-mobile-screen-button"></i>
            </div>

            <div>
              <h3 className="font-extrabold text-gray-900 text-base">Install TimeValley App</h3>
              <p className="text-xs text-gray-500 mt-1">
                Install TimeValley on your device for fast offline access and app notifications.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-3.5 text-left text-xs space-y-2 text-gray-700 font-medium">
              <div className="flex items-start gap-2.5">
                <i className="fa-solid fa-desktop text-[#0E6875] mt-0.5"></i>
                <span>
                  <strong>Desktop (Chrome/Edge):</strong> Click the <strong>Install (+)</strong> icon in your browser URL address bar.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <i className="fa-solid fa-mobile-button text-[#0E6875] mt-0.5"></i>
                <span>
                  <strong>iOS Safari:</strong> Tap <strong>Share <i className="fa-solid fa-arrow-up-from-bracket"></i></strong> then <strong>Add to Home Screen (+)</strong>.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <i className="fa-brands fa-android text-[#0E6875] mt-0.5"></i>
                <span>
                  <strong>Android Chrome:</strong> Tap menu <strong>⋮</strong> then select <strong>Add to Home screen</strong>.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white text-xs font-extrabold py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
