"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface MenuPosition {
  x: number;
  y: number;
}

interface NavItem {
  name: string;
  path: string;
  icon: string;
  badge?: string;
  category: "core" | "tools" | "admin";
  isAdminOnly?: boolean;
}

export default function CustomContextMenu() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin =
    mounted &&
    (user?.role === "SUPER_ADMIN" ||
      user?.role === "ADMIN" ||
      user?.email === "adhamkasebssj4@gmail.com");

  const openMenuAt = (clientX: number, clientY: number) => {
    // Menu dimensions for screen boundary calculation
    const menuWidth = 320;
    const menuHeight = 510;
    const safeX = Math.min(clientX, window.innerWidth - menuWidth - 16);
    const safeY = Math.min(clientY, window.innerHeight - menuHeight - 16);

    setPosition({ x: Math.max(16, safeX), y: Math.max(16, safeY) });
    setSearchQuery("");
    setIsOpen(true);
  };

  useEffect(() => {
    if (!mounted) return;

    // 1. Instant Right-Click Context Menu Trigger
    const handleContextMenu = (e: MouseEvent) => {
      // If right clicking inside open context menu itself, keep default
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      openMenuAt(e.clientX, e.clientY);
    };

    // 2. Secondary Mousedown capture for fast right-click trigger
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) {
        if (menuRef.current && menuRef.current.contains(e.target as Node)) {
          return;
        }
        e.preventDefault();
        openMenuAt(e.clientX, e.clientY);
      }
    };

    // 3. Close menu when clicking outside or pressing Escape
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mounted]);

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const handleScrollToTop = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopyUrl = () => {
    setIsOpen(false);
    navigator.clipboard.writeText(window.location.href);
    alert("📋 Page URL copied to clipboard!");
  };

  const handleReload = () => {
    setIsOpen(false);
    window.location.reload();
  };

  const allNavItems: NavItem[] = [
    { name: "Home Overview", path: "/", icon: "fa-solid fa-house", category: "core" },
    { name: "Student Workspace", path: "/workspace", icon: "fa-solid fa-user-gear", badge: "Dashboard", category: "core" },
    { name: "Venture Architect Diplomas", path: "/diplomas", icon: "fa-solid fa-graduation-cap", badge: "120h LMS", category: "tools" },
    { name: "AI Ideation Generator", path: "/ideation", icon: "fa-solid fa-lightbulb", badge: "AI v3.4", category: "tools" },
    { name: "Market Research Telemetry", path: "/market-research", icon: "fa-solid fa-chart-line", badge: "TAM/SAM", category: "tools" },
    { name: "Build Founder Team", path: "/teams", icon: "fa-solid fa-users", badge: "Recruiting", category: "tools" },
    { name: "Pitch Events & Masterclasses", path: "/events", icon: "fa-solid fa-calendar-days", badge: "Live", category: "tools" },
    { name: "Content Library & Playbooks", path: "/content-library", icon: "fa-solid fa-book-open", badge: "Downloads", category: "tools" },
    { name: "Day Zero Founder Journey", path: "/founder", icon: "fa-solid fa-compass", badge: "Methodology", category: "tools" },
    ...(isAdmin
      ? [{ name: "Super Admin Console", path: "/admin", icon: "fa-solid fa-[#EDA296] fa-shield-halved", badge: "SuperAdmin", category: "admin" as const, isAdminOnly: true }]
      : []),
  ];

  const filteredItems = allNavItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <div
      ref={menuRef}
      className={`fixed z-99999 w-80 sm:w-84 bg-slate-950/92 backdrop-blur-2xl border border-teal-500/35 rounded-3xl p-3.5 shadow-[0_35px_90px_-15px_rgba(0,0,0,0.95)] text-white space-y-3 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform origin-top-left ${
        isOpen
          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
          : "opacity-0 scale-90 -translate-y-3 pointer-events-none"
      }`}
      style={{ left: position.x, top: position.y }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Glow Ambient Accent */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#0E6875]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#EDA296]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="px-2 py-1 flex items-center justify-between border-b border-white/10 pb-2.5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-linear-to-br from-[#0E6875] to-[#148393] text-teal-200 flex items-center justify-center text-sm font-black shadow-md border border-teal-400/30">
            <i className="fa-solid fa-bolt text-teal-200 animate-pulse"></i>
          </div>
          <div>
            <div className="text-xs font-black text-white tracking-wide flex items-center gap-1.5">
              <span>TimeValley Navigator</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
            </div>
            <div className="text-[9px] text-teal-200/70 font-mono font-bold">Instant Right-Click Command</div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer shadow-xs active:scale-95"
          title="Close Navigator (ESC)"
        >
          ✕
        </button>
      </div>

      {/* Instant Search Bar */}
      <div className="relative z-10">
        <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-xs text-teal-200/50"></i>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search page or tool..."
          className="w-full bg-white/5 border border-white/12 rounded-2xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-teal-100/30 focus:outline-none focus:ring-2 focus:ring-[#0E6875] focus:border-teal-400/50 transition-all font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-2 text-xs text-teal-200/50 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Navigation Pages List (Lenis Prevented + Custom Scrollbar) */}
      <div
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="max-h-64 overflow-y-auto space-y-1.5 pr-1.5 text-left relative z-10 menu-scrollbar touch-pan-y"
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-extrabold transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? "bg-linear-to-r from-[#0E6875] via-[#117A89] to-[#148393] text-white shadow-lg border border-teal-300/40 scale-[1.01]"
                    : "hover:bg-white/10 border border-transparent text-gray-200 hover:text-white hover:translate-x-1"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-xs transition-transform group-hover:scale-110 ${
                      isActive
                        ? "bg-white/20 text-teal-100"
                        : "bg-white/10 text-teal-300 group-hover:bg-[#0E6875] group-hover:text-white"
                    }`}
                  >
                    <i className={item.icon} />
                  </div>
                  <span className="truncate">{item.name}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {item.badge && (
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isActive
                          ? "bg-white/20 text-teal-100 border border-white/30"
                          : "bg-teal-900/50 text-teal-300 border border-teal-500/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <span className="w-2 h-2 rounded-full bg-teal-300 animate-pulse shadow-sm" />}
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center py-6 text-xs text-teal-200/50 font-bold">
            No matching page found.
          </div>
        )}
      </div>

      {/* Quick Actions Footer */}
      <div className="border-t border-white/10 pt-2.5 grid grid-cols-3 gap-1.5 relative z-10">
        <button
          onClick={handleScrollToTop}
          className="bg-white/5 hover:bg-white/15 active:scale-95 text-white text-[10px] font-extrabold py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border border-white/10 shadow-xs group"
          title="Scroll to Top"
        >
          <i className="fa-solid fa-arrow-up text-xs text-teal-300 group-hover:-translate-y-0.5 transition-transform"></i>
          <span>Scroll Top</span>
        </button>

        <button
          onClick={handleCopyUrl}
          className="bg-white/5 hover:bg-white/15 active:scale-95 text-white text-[10px] font-extrabold py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border border-white/10 shadow-xs group"
          title="Copy Page URL"
        >
          <i className="fa-solid fa-link text-xs text-teal-300 group-hover:rotate-45 transition-transform"></i>
          <span>Copy URL</span>
        </button>

        <button
          onClick={handleReload}
          className="bg-white/5 hover:bg-white/15 active:scale-95 text-white text-[10px] font-extrabold py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border border-white/10 shadow-xs group"
          title="Reload Page"
        >
          <i className="fa-solid fa-rotate-right text-xs text-teal-300 group-hover:rotate-180 transition-transform duration-300"></i>
          <span>Reload</span>
        </button>
      </div>
    </div>
  );
}
