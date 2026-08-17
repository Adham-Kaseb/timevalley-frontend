"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    {
      label: "System Overview",
      href: "/admin",
      icon: "fa-solid fa-chart-line",
    },
    {
      label: "Users & Students",
      href: "/admin/users",
      icon: "fa-solid fa-users-gear",
    },
    {
      label: "Diploma Builder",
      href: "/admin/diplomas",
      icon: "fa-solid fa-graduation-cap",
    },
    {
      label: "Consultations Builder",
      href: "/admin/consultations",
      icon: "fa-solid fa-user-doctor",
    },
    {
      label: "Sub-Admin Permissions",
      href: "/admin#permissions",
      icon: "fa-solid fa-user-shield",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay (< lg) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-50 w-72 lg:w-64 bg-[#0E6875] text-white flex flex-col justify-between shrink-0 shadow-2xl transition-transform duration-300 ease-in-out h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md text-white flex items-center justify-center text-xl font-bold border border-white/20 shadow-md">
                ⚡
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-wide uppercase text-white">TIMEVALLEY</h1>
                <span className="text-[10px] font-extrabold text-teal-200 tracking-wider uppercase block -mt-1">
                  Super Admin Console
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-xl bg-white/10 text-white hover:bg-white/20 flex items-center justify-center text-sm cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Navigation Section */}
          <nav className="px-4 mt-6 space-y-1.5">
            <div className="px-3 text-[10px] font-black uppercase tracking-wider text-teal-200/70 mb-2">
              Control Center
            </div>

            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all ${
                    isActive
                      ? "bg-white text-[#0E6875] shadow-lg shadow-black/10 scale-102"
                      : "text-teal-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <i className={`${item.icon} text-sm ${isActive ? "text-[#0E6875]" : "text-teal-200"}`}></i>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Back to Platform */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/diplomas"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold py-2.5 rounded-2xl transition-all border border-white/15"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
            <span>Student View (/diplomas)</span>
          </Link>

          <button
            onClick={() => {
              if (onClose) onClose();
              logout();
            }}
            className="flex items-center justify-center gap-2 w-full bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-extrabold py-2.5 rounded-2xl transition-all border border-red-400/20 cursor-pointer"
          >
            <i className="fa-solid fa-right-from-bracket text-xs"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
