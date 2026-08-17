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
  category: "all" | "core" | "tools" | "admin";
  isAdminOnly?: boolean;
}

export default function CustomContextMenu() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "core" | "tools" | "admin">("all");

  // Admin Security Lock State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showPasscodePrompt, setShowPasscodePrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passError, setPassError] = useState("");
  const [pendingAdminPath, setPendingAdminPath] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHigherAdmin =
    mounted &&
    (user?.role === "SUPER_ADMIN" ||
      user?.role === "ADMIN" ||
      user?.email === "adhamkasebssj4@gmail.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unlocked = sessionStorage.getItem("timevalley_admin_unlocked") === "true";
      if (unlocked || isHigherAdmin) {
        setIsAdminUnlocked(true);
      }
    }
  }, [isHigherAdmin]);

  const openMenuAt = (clientX: number, clientY: number) => {
    const menuWidth = 340;
    const menuHeight = 560;
    const safeX = Math.min(clientX, window.innerWidth - menuWidth - 16);
    const safeY = Math.min(clientY, window.innerHeight - menuHeight - 16);

    setPosition({ x: Math.max(16, safeX), y: Math.max(16, safeY) });
    setSearchQuery("");
    setSelectedCategory("all");
    setShowPasscodePrompt(false);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!mounted) return;

    const handleContextMenu = (e: MouseEvent) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      openMenuAt(e.clientX, e.clientY);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) {
        if (menuRef.current && menuRef.current.contains(e.target as Node)) {
          return;
        }
        e.preventDefault();
        openMenuAt(e.clientX, e.clientY);
      }
    };

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

  const handleCategoryClick = (cat: "all" | "core" | "tools" | "admin") => {
    if (cat === "admin" && !isAdminUnlocked) {
      setShowPasscodePrompt(true);
      setPendingAdminPath(null);
      setPassError("");
      setPasswordInput("");
      return;
    }
    setShowPasscodePrompt(false);
    setSelectedCategory(cat);
  };

  const handleNavigate = (path: string, isAdminOnly?: boolean) => {
    if (isAdminOnly && !isAdminUnlocked) {
      setShowPasscodePrompt(true);
      setPendingAdminPath(path);
      setPassError("");
      setPasswordInput("");
      return;
    }
    setIsOpen(false);
    router.push(path);
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim().toLowerCase() === "admin") {
      setIsAdminUnlocked(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("timevalley_admin_unlocked", "true");
      }
      setShowPasscodePrompt(false);
      setSelectedCategory("admin");
      if (pendingAdminPath) {
        setIsOpen(false);
        router.push(pendingAdminPath);
        setPendingAdminPath(null);
      }
    } else {
      setPassError("Incorrect password. Try again.");
    }
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

  const publicNavItems: NavItem[] = [
    // Public Ecosystem
    { name: "Home Overview", path: "/", icon: "fa-solid fa-house", category: "core", badge: "Home" },
    { name: "Executive Consultations", path: "/consultations", icon: "fa-solid fa-user-doctor", category: "core", badge: "Dr. Wael" },
    { name: "Venture Architect Diplomas", path: "/diplomas", icon: "fa-solid fa-graduation-cap", category: "core", badge: "120h LMS" },
    { name: "Pitch Events & Masterclasses", path: "/events", icon: "fa-solid fa-calendar-days", category: "core", badge: "Community" },
    { name: "Diploma Checkout", path: "/checkout/diploma", icon: "fa-solid fa-credit-card", category: "core", badge: "Enrollment" },

    // Student Portal & Tools
    { name: "Student Workspace", path: "/workspace", icon: "fa-solid fa-user-gear", category: "tools", badge: "Dashboard" },
    { name: "AI Ideation Generator", path: "/ideation", icon: "fa-solid fa-lightbulb", category: "tools", badge: "AI v3.4" },
    { name: "Market Research Telemetry", path: "/market-research", icon: "fa-solid fa-chart-line", category: "tools", badge: "TAM/SAM" },
    { name: "Build Founder Team", path: "/teams", icon: "fa-solid fa-users", category: "tools", badge: "Recruiting" },
    { name: "Content Library & Playbooks", path: "/content-library", icon: "fa-solid fa-book-open", category: "tools", badge: "Playbooks" },
    { name: "Day Zero Founder Journey", path: "/founder", icon: "fa-solid fa-compass", category: "tools", badge: "Methodology" },
  ];

  const adminNavItems: NavItem[] = [
    { name: "Super Admin Console", path: "/admin", icon: "fa-solid fa-shield-halved", category: "admin", badge: "Control Center", isAdminOnly: true },
    { name: "User Directory & Access", path: "/admin/users", icon: "fa-solid fa-users-gear", category: "admin", badge: "User Mgr", isAdminOnly: true },
    { name: "Create Student / User", path: "/admin/users/create", icon: "fa-solid fa-user-plus", category: "admin", badge: "New User", isAdminOnly: true },
    { name: "Diploma Builder", path: "/admin/diplomas", icon: "fa-solid fa-graduation-cap", category: "admin", badge: "LMS Builder", isAdminOnly: true },
    { name: "Consultations Builder", path: "/admin/consultations", icon: "fa-solid fa-stethoscope", category: "admin", badge: "Card Builder", isAdminOnly: true },
    { name: "Create Consultation Card", path: "/admin/consultations/create", icon: "fa-solid fa-plus-circle", category: "admin", badge: "New Card", isAdminOnly: true },
  ];

  const allNavItems: NavItem[] = [
    ...publicNavItems,
    ...(isAdminUnlocked ? adminNavItems : []),
  ];

  const filteredItems = allNavItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  if (!mounted) return null;

  return (
    <div
      ref={menuRef}
      className={`fixed z-99999 w-80 sm:w-88 bg-slate-950/95 backdrop-blur-2xl border border-teal-500/35 rounded-3xl p-4 shadow-[0_35px_90px_-15px_rgba(0,0,0,0.95)] text-white space-y-3.5 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform origin-top-left ${
        isOpen
          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
          : "opacity-0 scale-90 -translate-y-3 pointer-events-none"
      }`}
      style={{ left: position.x, top: position.y }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Glow Ambient Accents */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#0E6875]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#EDA296]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="px-1 flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
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

        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono font-bold bg-white/10 text-teal-200 px-2 py-0.5 rounded-md border border-white/15">
            ESC
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer shadow-xs active:scale-95"
            title="Close Navigator (ESC)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Instant Search Bar */}
      <div className="relative z-10">
        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-teal-200/50"></i>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search page or tool..."
          className="w-full bg-white/5 border border-white/12 rounded-2xl pl-9 pr-7 py-2 text-xs text-white placeholder-teal-100/30 focus:outline-none focus:ring-2 focus:ring-[#0E6875] focus:border-teal-400/50 transition-all font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-2.5 text-xs text-teal-200/50 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Pills Filter Bar */}
      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 relative z-10 text-[10px] font-black">
        <button
          onClick={() => handleCategoryClick("all")}
          className={`flex-1 py-1 rounded-lg transition-all cursor-pointer text-center uppercase tracking-wider ${
            selectedCategory === "all"
              ? "bg-[#0E6875] text-white shadow-xs"
              : "text-teal-200/70 hover:text-white hover:bg-white/5"
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleCategoryClick("core")}
          className={`flex-1 py-1 rounded-lg transition-all cursor-pointer text-center uppercase tracking-wider ${
            selectedCategory === "core"
              ? "bg-[#0E6875] text-white shadow-xs"
              : "text-teal-200/70 hover:text-white hover:bg-white/5"
          }`}
        >
          Public
        </button>
        <button
          onClick={() => handleCategoryClick("tools")}
          className={`flex-1 py-1 rounded-lg transition-all cursor-pointer text-center uppercase tracking-wider ${
            selectedCategory === "tools"
              ? "bg-[#0E6875] text-white shadow-xs"
              : "text-teal-200/70 hover:text-white hover:bg-white/5"
          }`}
        >
          Tools
        </button>
        <button
          onClick={() => handleCategoryClick("admin")}
          className={`flex-1 py-1 rounded-lg transition-all cursor-pointer text-center uppercase tracking-wider ${
            selectedCategory === "admin"
              ? "bg-amber-500 text-slate-950 shadow-xs font-extrabold"
              : isAdminUnlocked
              ? "text-amber-300 hover:bg-amber-500/20"
              : "text-amber-300/80 hover:text-amber-200 hover:bg-white/5"
          }`}
        >
          {isAdminUnlocked ? "Admin 🔓" : "Admin 🔒"}
        </button>
      </div>

      {/* Admin Passcode Challenge Form */}
      {showPasscodePrompt ? (
        <form
          onSubmit={handleVerifyPassword}
          className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-3 relative z-10 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-amber-300">
              <i className="fa-solid fa-lock"></i>
              <span>Admin Password Required</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPasscodePrompt(false)}
              className="text-[10px] text-amber-300/70 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <p className="text-[11px] text-gray-300 font-medium leading-tight">
            Enter admin password (<span className="text-amber-300 font-bold">admin</span>) to unlock Super Admin Console controls.
          </p>

          <input
            type="password"
            autoFocus
            required
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder='Type "admin"...'
            className="w-full bg-slate-900 border border-amber-400/40 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 font-mono"
          />

          {passError && (
            <div className="text-[11px] text-red-400 font-bold flex items-center gap-1">
              <i className="fa-solid fa-[#EDA296] fa-circle-exclamation"></i>
              <span>{passError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black py-2 rounded-xl transition-all shadow-md cursor-pointer"
          >
            Unlock Admin Controls
          </button>
        </form>
      ) : (
        /* Navigation Pages List (Lenis Prevented + Custom Scrollbar) */
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
                  onClick={() => handleNavigate(item.path, item.isAdminOnly)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-extrabold transition-all duration-200 cursor-pointer group ${
                    isActive
                      ? "bg-linear-to-r from-[#0E6875] via-[#117A89] to-[#148393] text-white shadow-lg border border-teal-300/40 scale-[1.01]"
                      : item.isAdminOnly
                      ? "hover:bg-amber-500/10 border border-amber-500/20 text-amber-200 hover:text-amber-100 hover:translate-x-1"
                      : "hover:bg-white/10 border border-transparent text-gray-200 hover:text-white hover:translate-x-1"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-xs transition-transform group-hover:scale-110 ${
                        isActive
                          ? "bg-white/20 text-teal-100"
                          : item.isAdminOnly
                          ? "bg-amber-400/15 text-amber-300 group-hover:bg-amber-500 group-hover:text-slate-950"
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
                            : item.isAdminOnly
                            ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
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
      )}

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
