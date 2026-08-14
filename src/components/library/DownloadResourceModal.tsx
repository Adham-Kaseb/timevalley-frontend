"use client";

import React, { useState } from "react";

export interface ResourceItem {
  id: string;
  title: string;
  category: string;
  format: string;
  downloads: string;
  desc: string;
}

interface DownloadResourceModalProps {
  isOpen: boolean;
  resource: ResourceItem | null;
  onClose: () => void;
}

export default function DownloadResourceModal({
  isOpen,
  resource,
  onClose,
}: DownloadResourceModalProps) {
  const [email, setEmail] = useState("");
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen || !resource) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setDownloaded(true);
    setTimeout(() => {
      // Simulate file download
      alert(`📥 Download initiated for: ${resource.title}\nFormat: ${resource.format}`);
    }, 400);
  };

  const handleCloseAll = () => {
    setDownloaded(false);
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar space-y-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-250">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="text-xl font-black text-[#0E6875] flex items-center gap-2">
            <i className="fa-solid fa-file-arrow-down"></i> Download Resource
          </h3>
          <button
            onClick={handleCloseAll}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Resource Preview Banner */}
        <div className="p-4 bg-[#FAF0E9] rounded-2xl border border-[#EDA296]/40 space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="bg-[#0E6875] text-white text-[11px] font-black px-3 py-1 rounded-full">
              {resource.category}
            </span>
            <span className="bg-[#EDA296]/20 text-[#0E6875] border border-[#EDA296]/40 text-xs font-bold px-3 py-1 rounded-full">
              {resource.format}
            </span>
          </div>
          <h4 className="text-base font-black text-[#1C2B2D]">
            {resource.title}
          </h4>
          <p className="text-xs text-gray-600 font-medium">
            {resource.desc}
          </p>
        </div>

        {downloaded ? (
          <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center text-3xl">
              <i className="fa-solid fa-[#0E6875] fa-circle-check"></i>
            </div>
            <div>
              <h4 className="text-xl font-black text-emerald-700">
                Resource Unlocked!
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                A download copy and Notion/PDF link have been sent to <strong>{email}</strong>.
              </p>
            </div>
            <button
              onClick={handleCloseAll}
              className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold py-3 rounded-xl shadow transition-all cursor-pointer text-sm"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Enter Email to Download Free
              </label>
              <input
                type="email"
                required
                placeholder="founder@startup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
              />
              <small className="text-[11px] text-gray-400 mt-1 block">
                No spam. Direct access link will be delivered immediately.
              </small>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCloseAll}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0E6875] hover:bg-[#0B4E58] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <i className="fa-solid fa-download"></i>
                <span>Get Instant Access</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
