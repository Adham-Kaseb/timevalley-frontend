"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, isAuthLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthLoading) {
      if (!isLoggedIn) {
        router.push("/login?redirect=/admin");
      }
    }
  }, [mounted, isAuthLoading, isLoggedIn, router]);

  if (!mounted || isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#FAF0E9] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#0E6875] text-white flex items-center justify-center text-3xl shadow-xl animate-bounce">
          ⚡
        </div>
        <div className="flex items-center gap-2 text-[#0E6875] font-black text-sm">
          <i className="fa-solid fa-spinner animate-spin"></i>
          <span>Loading Super Admin Workspace...</span>
        </div>
      </div>
    );
  }

  // Access Control Guard for Non-Admins
  const isAdminRole = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN" || user?.email === "adhamkasebssj4@gmail.com";

  if (!isAdminRole) {
    return (
      <div className="min-h-screen bg-[#FAF0E9] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-4xl mx-auto">
            <i className="fa-solid fa-shield-halved"></i>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#1C2B2D]">Super Admin Access Required</h2>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              This console is reserved exclusively for the Higher Admin (<span className="font-bold text-[#0E6875]">adhamkasebssj4@gmail.com</span>) and authorized administrators.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-left text-xs font-mono space-y-1">
            <div className="text-gray-500 font-bold">Higher Admin Credentials:</div>
            <div>Email: <span className="text-[#0E6875] font-bold">adhamkasebssj4@gmail.com</span></div>
            <div>Password: <span className="text-[#0E6875] font-bold">higher admin</span></div>
          </div>

          <button
            onClick={() => router.push("/login?redirect=/admin")}
            className="w-full bg-[#0E6875] text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-lg hover:bg-[#0B4E58] transition-all cursor-pointer"
          >
            Sign In with Higher Admin Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF0E9] flex font-sans">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 min-h-screen">
        {children}
      </main>
    </div>
  );
}
