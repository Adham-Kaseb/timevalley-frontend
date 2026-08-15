"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import adminService, { AdminUser } from "@/services/admin";
import { getSocket } from "@/services/socket";

export default function AdminOverviewPage() {
  const { user, isLoggedIn, isAuthLoading } = useAuth();
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [targetRole, setTargetRole] = useState("STUDENT");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const availablePermissions = [
    { key: "MANAGE_DIPLOMAS", label: "Diploma Builder & Lessons Access", desc: "Allows adding, editing, and deleting diploma modules & lessons." },
    { key: "MANAGE_USERS", label: "User Accounts & Role Manager", desc: "Allows viewing user profiles and assigning sub-admin roles." },
    { key: "MANAGE_PAYMENTS", label: "Financial & Enrollment Audit", desc: "Allows viewing 5,000 LE course payments and manual unlocks." },
    { key: "MANAGE_CONTACT", label: "Contact Us & Advisory Inquiries", desc: "Allows reviewing student contact messages and inquiries." },
  ];

  useEffect(() => {
    if (!isAuthLoading && isLoggedIn) {
      fetchUsers();
    } else if (!isAuthLoading && !isLoggedIn) {
      setLoadingUsers(false);
    }

    const socket = getSocket();
    socket.on("diploma_access_updated", fetchUsers);

    return () => {
      socket.off("diploma_access_updated", fetchUsers);
    };
  }, [isAuthLoading, isLoggedIn]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await adminService.listUsers();
      if (Array.isArray(data)) {
        const filtered = data.filter((u) => u.role !== "SUPER_ADMIN" && u.email !== "adhamkasebssj4@gmail.com");
        setUsersList(filtered);
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        console.warn("Unauthorized access attempt to admin user list.");
      } else {
        console.error("Failed to load users for admin:", err);
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSelectUser = (u: AdminUser) => {
    setSelectedUser(u);
    setTargetRole(u.role || "STUDENT");
    setSelectedPermissions(u.permissions || []);
    setStatusMsg("");
  };

  const togglePermission = (key: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    setIsUpdating(true);
    setStatusMsg("");

    try {
      await adminService.updateUserPermissions(selectedUser.id, targetRole, selectedPermissions);
      setStatusMsg("Role and permissions updated successfully!");
      fetchUsers();
    } catch (err: any) {
      console.error("Failed to update user permissions:", err);
      setStatusMsg("Failed to update user permissions.");
    } finally {
      setIsUpdating(false);
    }
  };

  const totalUsers = usersList.length;
  const enrolledCount = usersList.filter((u) => u.enrollments && u.enrollments.length > 0).length;
  const totalRevenue = enrolledCount * 5000;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C2B2D] tracking-tight">
            Welcome, {user?.name || "Higher Admin"} 👋
          </h1>
          <p className="text-xs text-gray-600 font-medium mt-1">
            Manage platform users, assign sub-admin module permissions, and control diploma curriculum.
          </p>
        </div>

        <Link
          href="/admin/diplomas"
          className="bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs px-5 py-3.5 rounded-2xl shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <i className="fa-solid fa-graduation-cap text-base"></i>
          <span>Open Diploma Builder (/admin/diplomas)</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0E6875] flex items-center justify-center text-2xl font-bold border border-[#0E6875]/20">
            <i className="fa-solid fa-users"></i>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500">Total Registered Users</div>
            <div className="text-2xl font-black text-[#1C2B2D]">{totalUsers}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold border border-amber-500/20">
            <i className="fa-solid fa-user-graduate"></i>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500">Enrolled Diploma Students</div>
            <div className="text-2xl font-black text-[#1C2B2D]">{enrolledCount}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold border border-emerald-500/20">
            <i className="fa-solid fa-sack-dollar"></i>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500">Total Diploma Revenue</div>
            <div className="text-2xl font-black text-emerald-600">{totalRevenue.toLocaleString()} LE</div>
          </div>
        </div>
      </div>

      {/* Sub-Admin Permission Management Panel */}
      <div id="permissions" className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-200/80 space-y-6">
        <div>
          <h2 className="text-xl font-black text-[#1C2B2D] tracking-tight">Sub-Admin Access & Permission Manager</h2>
          <p className="text-xs text-gray-600 font-medium mt-0.5">
            Select any registered account to assign Sub-Admin roles and grant specific dashboard access permissions.
          </p>
        </div>

        {loadingUsers ? (
          <div className="text-center py-8 text-xs text-gray-500 font-bold flex items-center justify-center gap-2">
            <i className="fa-solid fa-spinner animate-spin text-base text-[#0E6875]"></i>
            <span>Loading user accounts...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* User List Table */}
            <div className="lg:col-span-6 bg-gray-50 p-4 rounded-2xl border border-gray-200 max-h-96 overflow-y-auto space-y-2">
              <div className="text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Registered Accounts</div>
              {usersList.map((u) => {
                const isSelected = selectedUser?.id === u.id;
                const isSuperAdmin = u.role === "SUPER_ADMIN";
                return (
                  <div
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className={`p-3.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-[#0E6875] text-white border-[#0E6875] shadow-md"
                        : "bg-white text-gray-800 border-gray-200 hover:border-[#0E6875]/50"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="font-extrabold truncate">{u.name}</div>
                      <div className={`text-[11px] truncate ${isSelected ? "text-teal-100" : "text-gray-500"}`}>
                        {u.email}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          isSuperAdmin
                            ? "bg-amber-400 text-amber-950"
                            : u.role === "ADMIN"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Permissions Config Card */}
            <div className="lg:col-span-6 bg-gray-50 p-5 rounded-2xl border border-gray-200 flex flex-col justify-between">
              {selectedUser ? (
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-3">
                    <div className="text-xs font-bold text-gray-500">Configuring Account:</div>
                    <div className="text-base font-black text-[#0E6875]">{selectedUser.name}</div>
                    <div className="text-xs text-gray-600 font-mono">{selectedUser.email}</div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 mb-1">Account Role</label>
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                    >
                      <option value="STUDENT">STUDENT (Standard User)</option>
                      <option value="ADMIN">ADMIN (Sub-Admin with Assigned Permissions)</option>
                      <option value="SUPER_ADMIN">SUPER_ADMIN (Higher Admin - Full Access)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 mb-2">Granted Module Access Permissions</label>
                    <div className="space-y-2">
                      {availablePermissions.map((p) => {
                        const isChecked = selectedPermissions.includes(p.key);
                        return (
                          <div
                            key={p.key}
                            onClick={() => togglePermission(p.key)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                              isChecked
                                ? "bg-[#E6F3F5] border-[#0E6875] text-[#0E6875]"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
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

                  {statusMsg && (
                    <div
                      className={`p-3 rounded-xl text-xs font-bold ${
                        statusMsg.includes("successfully")
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {statusMsg}
                    </div>
                  )}

                  <button
                    onClick={handleSavePermissions}
                    disabled={isUpdating}
                    className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white text-xs font-extrabold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isUpdating ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                        <span>Saving Permissions...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-[#0E6875] fa-floppy-disk"></i>
                        <span>Save Access Permissions</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500 text-xs font-medium">
                  👈 Select an account from the left list to configure sub-admin access permissions.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
