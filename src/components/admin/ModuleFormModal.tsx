"use client";

import { useState, useEffect } from "react";
import adminService, { AdminModulePayload } from "@/services/admin";

interface ModuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  moduleToEdit?: {
    id: string;
    moduleNumber: string;
    title: string;
    badgeTitle: string;
    description: string;
  } | null;
}

export default function ModuleFormModal({ isOpen, onClose, onSuccess, moduleToEdit }: ModuleFormModalProps) {
  const [moduleNumber, setModuleNumber] = useState("");
  const [title, setTitle] = useState("");
  const [badgeTitle, setBadgeTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (moduleToEdit) {
      setModuleNumber(moduleToEdit.moduleNumber || "00");
      setTitle(moduleToEdit.title || "");
      setBadgeTitle(moduleToEdit.badgeTitle || "");
      setDescription(moduleToEdit.description || "");
    } else {
      setModuleNumber("");
      setTitle("");
      setBadgeTitle("");
      setDescription("");
    }
    setError("");
  }, [moduleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: AdminModulePayload = {
        moduleNumber: moduleNumber.trim() || "00",
        title: title.trim(),
        badgeTitle: badgeTitle.trim() || title.trim(),
        description: description.trim(),
      };

      if (moduleToEdit) {
        await adminService.updateModule(moduleToEdit.id, payload);
      } else {
        await adminService.createModule(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to save diploma module:", err);
      setError(err.response?.data?.message || err.message || "Failed to save diploma module.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative animate-modal-pop">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="text-left space-y-2 mb-6 border-b border-gray-200/80 pb-4">
          <div className="inline-flex items-center gap-2 bg-[#E6F3F5] text-[#0E6875] text-xs font-black px-3 py-1 rounded-full">
            <i className="fa-solid fa-graduation-cap"></i>
            <span>Diploma Module Builder</span>
          </div>
          <h2 className="text-2xl font-black text-[#1C2B2D]">
            {moduleToEdit ? "Edit Diploma Module" : "Create New Diploma Module"}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-red-500"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1">Module Number *</label>
              <input
                type="text"
                value={moduleNumber}
                onChange={(e) => setModuleNumber(e.target.value)}
                required
                placeholder="e.g. 08"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1">Badge Title *</label>
              <input
                type="text"
                value={badgeTitle}
                onChange={(e) => setBadgeTitle(e.target.value)}
                required
                placeholder="e.g. MODULE#8 IPO & EXIT"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-700 mb-1">Module Main Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. MODULE#8 IPO & EXIT ARCHITECTURE"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-700 mb-1">Module Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="Summary of skills and playbooks covered in this module..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs py-3.5 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>{moduleToEdit ? "Save Module" : "Create Module"}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
