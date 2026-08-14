"use client";

import { useState } from "react";
import adminService from "@/services/admin";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [autoEnrollDiploma, setAutoEnrollDiploma] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in name, email, and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await adminService.createUser({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        phone: phone.trim() || undefined,
        role,
        autoEnrollDiploma,
      });

      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRole("STUDENT");
      setAutoEnrollDiploma(true);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to create user:", err);
      setError(err.response?.data?.message || err.message || "Failed to create user account.");
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
            <i className="fa-solid fa-user-plus"></i>
            <span>Register New Student or Admin</span>
          </div>
          <h2 className="text-2xl font-black text-[#1C2B2D]">Add Account to Platform</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-red-500"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Sarah Mansour"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="sarah@example.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1">Phone Number (Optional)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 100 000 0000"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-700 mb-1">Account Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
            >
              <option value="STUDENT">STUDENT (Standard User)</option>
              <option value="ADMIN">ADMIN (Sub-Admin with Assigned Permissions)</option>
            </select>
          </div>

          <div className="p-3 bg-teal-50 border border-teal-200/60 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-extrabold text-[#0E6875]">Auto-Enroll Venture Architect Diploma</div>
              <div className="text-[11px] text-gray-600 font-medium">Grants instant 120h classroom access (5,000 LE value).</div>
            </div>
            <input
              type="checkbox"
              checked={autoEnrollDiploma}
              onChange={(e) => setAutoEnrollDiploma(e.target.checked)}
              className="w-4 h-4 accent-[#0E6875] cursor-pointer"
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
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-check"></i>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
