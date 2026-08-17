"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import adminService, { AdminUser } from "@/services/admin";
import apiClient from "@/lib/axios";
import StudentManageDrawer from "@/components/admin/StudentManageDrawer";
import { useAuth } from "@/context/AuthContext";

export default function UsersManagementDashboard() {
  const { isLoggedIn, isAuthLoading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ENROLLED" | "UNENROLLED" | "ADMIN">("ALL");

  // Drawers
  const [selectedStudent, setSelectedStudent] = useState<AdminUser | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && isLoggedIn) {
      fetchInitialData();
    } else if (!isAuthLoading && !isLoggedIn) {
      setLoading(false);
    }
  }, [isAuthLoading, isLoggedIn]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [usersData, curriculumRes] = await Promise.all([
        adminService.listUsers().catch((err) => {
          if (err?.response?.status === 401) return [];
          throw err;
        }),
        apiClient.get("/courses/diploma").catch(() => ({ data: { modules: [] } })),
      ]);

      // Filter out SUPER_ADMIN
      const filteredUsers = (usersData || []).filter(
        (u) => u.role !== "SUPER_ADMIN" && u.email !== "adhamkasebssj4@gmail.com"
      );
      setUsers(filteredUsers);

      if (curriculumRes?.data?.modules) {
        setModules(curriculumRes.data.modules);
      }
    } catch (err) {
      console.error("Failed to load users management data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered Users computation
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));

    const isEnrolled = u.enrollments?.some((e) => e.status === "ACTIVE");

    if (!matchesSearch) return false;

    if (roleFilter === "ENROLLED") return isEnrolled;
    if (roleFilter === "UNENROLLED") return !isEnrolled;
    if (roleFilter === "ADMIN") return u.role === "ADMIN";

    return true;
  });

  const totalStudents = users.length;
  const enrolledCount = users.filter((u) => u.enrollments?.some((e) => e.status === "ACTIVE")).length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;

  const handleOpenDrawer = (student: AdminUser) => {
    setSelectedStudent(student);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-200/80">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#E6F3F5] text-[#0E6875] text-xs font-black px-3.5 py-1 rounded-full border border-[#0E6875]/20 mb-2">
            <i className="fa-solid fa-users-gear"></i>
            <span>User & Student Access Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C2B2D] tracking-tight">
            Registered Users & Diploma Access
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Manage student registrations, toggle diploma access, unlock modules, and dispatch custom assignments.
          </p>
        </div>

        <Link
          href="/admin/users/create"
          className="bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs px-5 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 shrink-0 cursor-pointer"
        >
          <i className="fa-solid fa-user-plus text-sm"></i>
          <span>Add New Student / User</span>
        </Link>
      </div>

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100/80 text-[#0E6875] flex items-center justify-center text-xl font-black">
            <i className="fa-solid fa-users"></i>
          </div>
          <div>
            <div className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Total Registered Accounts</div>
            <div className="text-3xl font-black text-[#1C2B2D]">{totalStudents}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center text-xl font-black">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <div>
            <div className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Active Diploma Students</div>
            <div className="text-3xl font-black text-[#1C2B2D]">{enrolledCount}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center text-xl font-black">
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <div>
            <div className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Sub-Admin Accounts</div>
            <div className="text-3xl font-black text-[#1C2B2D]">{adminCount}</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl border border-gray-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Field */}
          <div className="relative w-full sm:w-80">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-gray-400"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => setRoleFilter("ALL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                roleFilter === "ALL" ? "bg-[#0E6875] text-white shadow-md" : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Users ({users.length})
            </button>

            <button
              onClick={() => setRoleFilter("ENROLLED")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                roleFilter === "ENROLLED" ? "bg-[#0E6875] text-white shadow-md" : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Enrolled ({enrolledCount})
            </button>

            <button
              onClick={() => setRoleFilter("UNENROLLED")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                roleFilter === "UNENROLLED" ? "bg-[#0E6875] text-white shadow-md" : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Unenrolled ({users.length - enrolledCount})
            </button>

            <button
              onClick={() => setRoleFilter("ADMIN")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                roleFilter === "ADMIN" ? "bg-[#0E6875] text-white shadow-md" : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Sub-Admins ({adminCount})
            </button>
          </div>
        </div>

        {/* Users Cards Grid */}
        {loading ? (
          <div className="text-center py-12 text-xs text-gray-500 font-bold flex items-center justify-center gap-2">
            <i className="fa-solid fa-spinner animate-spin text-base text-[#0E6875]"></i>
            <span>Loading user directory...</span>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {filteredUsers.map((u) => {
              const isEnrolled = u.enrollments?.some((e) => e.status === "ACTIVE");

              return (
                <div
                  key={u.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200/90 hover:border-[#0E6875]/40 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#EDA296]/30 text-[#0E6875] font-black flex items-center justify-center text-sm shadow-sm border border-[#EDA296]/40">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-sm text-[#1C2B2D]">{u.name}</div>
                          <div className="text-[11px] font-mono text-gray-500">{u.email}</div>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          u.role === "ADMIN"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-teal-50 text-teal-800"
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                      <span className="text-gray-500 font-medium">Diploma Access:</span>
                      <span
                        className={`font-black text-[11px] px-2.5 py-0.5 rounded-full ${
                          isEnrolled
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {isEnrolled ? "ACTIVE ENROLLED" : "UNENROLLED"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenDrawer(u)}
                    className="w-full bg-gray-50 hover:bg-[#0E6875] text-gray-700 hover:text-white font-extrabold text-xs py-2.5 rounded-xl border border-gray-200 hover:border-[#0E6875] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <i className="fa-solid fa-sliders text-xs"></i>
                    <span>Manage Access & Content</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500 text-xs font-bold space-y-2">
            <i className="fa-solid fa-user-slash text-2xl text-gray-400"></i>
            <div>No matching registered users found.</div>
          </div>
        )}
      </div>

      {/* Student Manage Drawer */}
      <StudentManageDrawer
        isOpen={isDrawerOpen}
        student={selectedStudent}
        allModules={modules}
        onClose={() => setIsDrawerOpen(false)}
        onRefresh={fetchInitialData}
      />
    </div>
  );
}
