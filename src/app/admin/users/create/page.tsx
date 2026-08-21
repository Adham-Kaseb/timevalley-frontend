"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import adminService from "@/services/admin";

export default function CreateUserPage() {
  const router = useRouter();

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"STUDENT" | "ADMIN">("STUDENT");
  const [enrollDiploma, setEnrollDiploma] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([
    "MANAGE_DIPLOMAS",
    "MANAGE_USERS",
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const availablePermissions = [
    { key: "MANAGE_DIPLOMAS", label: "Diploma Builder & Lessons Access", desc: "Allows adding, editing, and deleting diploma modules & lessons." },
    { key: "MANAGE_USERS", label: "User Accounts & Role Manager", desc: "Allows viewing user profiles and assigning sub-admin roles." },
    { key: "MANAGE_PAYMENTS", label: "Financial & Enrollment Audit", desc: "Allows viewing 5,000 LE course payments and manual unlocks." },
    { key: "MANAGE_CONTACT", label: "Contact Us & Advisory Inquiries", desc: "Allows reviewing student contact messages and inquiries." },
  ];

  const togglePermission = (key: string) => {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("Please fill in all required fields (Name, Email, Password).");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      // 1. Create User Account via Admin API
      const newAccount = await adminService.createUser({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        phone: phone.trim() || undefined,
        role,
        permissions: role === "ADMIN" ? permissions : [],
      });

      // 2. Grant Diploma Access if checked
      if (enrollDiploma && newAccount?.id) {
        try {
          await adminService.toggleDiplomaAccess(newAccount.id, true);
        } catch (e) {
          console.warn("Failed to auto-enroll student in diploma:", e);
        }
      }

      router.push("/admin/users");
    } catch (err: any) {
      console.error("Failed to create user account", err);
      const msg = err.response?.data?.message || err.message || "Failed to create user account.";
      setErrorMsg(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
      {/* Top Header with Back Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0E6875] hover:underline mb-2"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back to User Directory</span>
          </Link>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Add Account to Platform
          </h1>
          <p className="text-sm text-gray-500 font-semibold mt-1">
            Register a new student or sub-admin account and configure immediate diploma access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            form="create-user-form"
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Creating Account..." : "Create Account & Grant Access"}
          </button>
        </div>
      </div>

      {/* Main Form Card */}
      <form
        id="create-user-form"
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-sm shrink-0"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Account Credentials */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-[#0E6875] border-b border-gray-100 pb-2 flex items-center gap-2">
            <i className="fa-solid fa-user-plus"></i>
            <span>Account Credentials</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Mansour"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 100 000 0000"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Account Role */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h2 className="text-base font-black text-[#0E6875] border-b border-gray-100 pb-2 flex items-center gap-2">
            <i className="fa-solid fa-shield-halved"></i>
            <span>Account Role & Privileges</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setRole("STUDENT")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                role === "STUDENT"
                  ? "bg-[#E6F3F5] border-[#0E6875] text-[#0E6875]"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                name="role"
                checked={role === "STUDENT"}
                onChange={() => setRole("STUDENT")}
                className="mt-0.5 accent-[#0E6875]"
              />
              <div>
                <div className="font-black text-sm">STUDENT (Standard Member)</div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">
                  Standard platform account for founders taking the Venture Architect Diploma.
                </div>
              </div>
            </div>

            <div
              onClick={() => setRole("ADMIN")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                role === "ADMIN"
                  ? "bg-[#E6F3F5] border-[#0E6875] text-[#0E6875]"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                name="role"
                checked={role === "ADMIN"}
                onChange={() => setRole("ADMIN")}
                className="mt-0.5 accent-[#0E6875]"
              />
              <div>
                <div className="font-black text-sm">ADMIN (Sub-Admin Account)</div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">
                  Administrative account with custom assigned permissions to manage platform modules.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Sub-Admin Permissions (If Role === ADMIN) */}
        {role === "ADMIN" && (
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <label className="block text-xs font-black text-gray-700 uppercase">
              Assigned Sub-Admin Module Permissions
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availablePermissions.map((p) => {
                const isChecked = permissions.includes(p.key);
                return (
                  <div
                    key={p.key}
                    onClick={() => togglePermission(p.key)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                      isChecked
                        ? "bg-[#E6F3F5] border-[#0E6875] text-[#0E6875]"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 accent-[#0E6875] cursor-pointer"
                    />
                    <div>
                      <div className="font-extrabold">{p.label}</div>
                      <div className="text-[11px] text-gray-500 font-medium">{p.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 4: Initial Diploma Access */}
        <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
          <input
            type="checkbox"
            id="enrollDiploma"
            checked={enrollDiploma}
            onChange={(e) => setEnrollDiploma(e.target.checked)}
            className="w-5 h-5 text-[#0E6875] rounded-md focus:ring-[#0E6875] accent-[#0E6875] cursor-pointer"
          />
          <div>
            <label htmlFor="enrollDiploma" className="text-xs font-extrabold text-gray-900 cursor-pointer block">
              Grant Immediate Full Diploma Access (5,000 LE Value Unlocked)
            </label>
            <span className="text-[11px] text-gray-500 font-semibold block">
              Student will automatically have all 8 Venture Building modules and masterclass lessons unlocked upon first login.
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
