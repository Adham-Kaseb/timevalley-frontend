"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import InstallPWAButton from "@/components/common/InstallPWAButton";
import NotificationCenterModal from "@/components/common/NotificationCenterModal";


export default function Navbar() {
  const { openEnrollModal, isLoggedIn, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 250);
  };

  const isHome = pathname === "/";
  const isDiploma = pathname.startsWith("/diplomas");
  const isIdeation = pathname.startsWith("/ideation");
  const isMarketResearch = pathname.startsWith("/market-research");
  const isTeams = pathname.startsWith("/teams");
  const isAbout = pathname.startsWith("/about");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          {/* Responsive Brand Image Logo */}
          <img
            src="/images/logos/logo-3.png"
            alt="TimeValley Logo"
            className="h-8 sm:h-10 lg:h-12 w-auto object-contain origin-left transition-transform"
          />
        </Link>

        {/* Streamlined Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-gray-600">
          
          {/* Home Link */}
          <Link
            href="/"
            className={`relative py-1 transition-colors ${
              isHome
                ? "text-[#0E6875] font-extrabold"
                : "hover:text-[#0E6875]"
            }`}
          >
            Home
            {isHome && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0E6875] rounded-full"></span>
            )}
          </Link>

          {/* Diploma Link */}
          <Link
            href="/diplomas"
            className={`relative py-1 transition-colors ${
              isDiploma
                ? "text-[#0E6875] font-extrabold"
                : "hover:text-[#0E6875]"
            }`}
          >
            Diploma
            {isDiploma && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0E6875] rounded-full"></span>
            )}
          </Link>

          {/* Ideation */}
          <Link
            href="/ideation"
            className={`relative py-1 transition-colors ${
              isIdeation
                ? "text-[#0E6875] font-extrabold"
                : "hover:text-[#0E6875]"
            }`}
          >
            Ideation
            {isIdeation && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0E6875] rounded-full"></span>
            )}
          </Link>

          {/* Market Research */}
          <Link
            href="/market-research"
            className={`relative py-1 transition-colors ${
              isMarketResearch
                ? "text-[#0E6875] font-extrabold"
                : "hover:text-[#0E6875]"
            }`}
          >
            Market Research
            {isMarketResearch && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0E6875] rounded-full"></span>
            )}
          </Link>

          {/* Build Team */}
          <Link
            href="/teams"
            className={`relative py-1 transition-colors ${
              isTeams
                ? "text-[#0E6875] font-extrabold"
                : "hover:text-[#0E6875]"
            }`}
          >
            Build Team
            {isTeams && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0E6875] rounded-full"></span>
            )}
          </Link>

          {/* Ecosystem Dropdown */}
          <div
            className="relative py-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hover:text-[#0E6875] transition-colors py-1 flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <span>Ecosystem</span>
              <i className="fa-solid fa-chevron-down text-[10px]"></i>
            </button>

            {dropdownOpen && (
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="absolute top-full left-0 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 mt-0 animate-in fade-in slide-in-from-top-2 duration-150 z-50"
              >
                <Link
                  href="/founder"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#FAF0E9] hover:text-[#0E6875]"
                >
                  <i className="fa-solid fa-user-tie text-[#0E6875] w-4"></i>{" "}
                  Founder: Dr. Wael
                </Link>
                <Link
                  href="/consultations"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#FAF0E9] hover:text-[#0E6875]"
                >
                  <i className="fa-solid fa-user-doctor text-[#0E6875] w-4"></i>{" "}
                  Consultations
                </Link>
                <Link
                  href="/events"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#FAF0E9] hover:text-[#0E6875]"
                >
                  <i className="fa-solid fa-calendar-days text-[#0E6875] w-4"></i>{" "}
                  Pitch & Events
                </Link>
                <Link
                  href="/content-library"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#FAF0E9] hover:text-[#0E6875]"
                >
                  <i className="fa-solid fa-book-bookmark text-[#0E6875] w-4"></i>{" "}
                  Content Library
                </Link>
                <Link
                  href="/our-certificates"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#FAF0E9] hover:text-[#0E6875]"
                >
                  <i className="fa-solid fa-award text-[#0E6875] w-4"></i>{" "}
                  Our Certificates
                </Link>
              </div>
            )}
          </div>

          {/* About Us */}
          <Link
            href="/about"
            className={`relative py-1 transition-colors ${
              isAbout
                ? "text-[#0E6875] font-extrabold"
                : "hover:text-[#0E6875]"
            }`}
          >
            About Us
            {isAbout && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0E6875] rounded-full"></span>
            )}
          </Link>
        </nav>

        {/* Right Actions & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* PWA Install Button */}
          <InstallPWAButton />

          {(mounted && isLoggedIn) ? (
            <div className="relative group">
              <Link
                href="/workspace"
                className="bg-[#0E6875] hover:bg-[#0B4E58] text-white text-xs font-extrabold px-3.5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                title={`Logged in as ${user?.name}`}
              >
                <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold uppercase overflow-hidden shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name ? user.name.substring(0, 2) : "ME"
                  )}
                </div>
                <span className="hidden sm:inline">My Workspace</span>
                <i className="fa-solid fa-chevron-down text-[10px] opacity-70 group-hover:rotate-180 transition-transform"></i>
              </Link>

              {/* User Dropdown Menu */}
              <div className="absolute right-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 text-xs font-semibold text-gray-700 space-y-1">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="font-extrabold text-gray-900 truncate">{user?.name || "Student User"}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                  </div>

                  <Link
                    href="/workspace"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#E6F3F5] hover:text-[#0E6875] transition-colors"
                  >
                    <i className="fa-solid fa-chart-line text-[#0E6875]"></i>
                    <span>Dashboard & Progress</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setShowNotifModal(true)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#E6F3F5] hover:text-[#0E6875] transition-colors text-left font-semibold cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <i className="fa-solid fa-bell text-[#0E6875]"></i>
                      <span>Notification Center</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-[#0E6875]"></span>
                  </button>

                  {(user?.role === "SUPER_ADMIN" || user?.role === "ADMIN" || user?.email === "adhamkasebssj4@gmail.com") && (
                    <>
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-900 font-extrabold hover:bg-amber-100 transition-colors border border-amber-200/60"
                      >
                        <i className="fa-solid fa-shield-halved text-amber-600"></i>
                        <span>⚡ Super Admin Console</span>
                      </Link>
                      <Link
                        href="/admin/notifications"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#FAF0E9] text-[#0E6875] font-extrabold hover:bg-[#E6F3F5] transition-colors border border-[#0E6875]/20"
                      >
                        <i className="fa-solid fa-satellite-dish text-[#0E6875]"></i>
                        <span>📢 PWA Push Broadcast</span>
                      </Link>
                    </>
                  )}



                  <div className="border-t border-gray-100 pt-1 mt-1">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer font-bold"
                    >
                      <i className="fa-solid fa-right-from-bracket"></i>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => openEnrollModal("check")}
              className="group bg-[#0E6875] hover:bg-[#0B4E58] text-white text-xs font-extrabold px-3 sm:px-5 py-2.5 rounded-xl shadow-md hover:shadow-xl active:scale-95 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 cursor-pointer"
              title="Enroll Now"
            >
              <i className="fa-solid fa-graduation-cap text-sm sm:text-xs group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-300"></i>
              <span className="hidden sm:inline">Enroll Now</span>
            </button>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-700 text-lg hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shadow-xs"
            aria-label="Toggle Mobile Menu"
          >
            <i
              className={`fa-solid ${
                mobileOpen ? "fa-xmark text-xl text-[#0E6875] rotate-90" : "fa-bars"
              } transition-transform duration-300`}
            ></i>
          </button>
        </div>
      </div>

      {/* Smooth Animated Mobile Drawer */}
      <div
        className={`lg:hidden bg-white border-b border-gray-200 px-6 transition-all duration-300 ease-in-out overflow-hidden shadow-xl ${
          mobileOpen
            ? "max-h-[85vh] py-5 opacity-100"
            : "max-h-0 py-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-3.5 font-semibold text-gray-700 text-sm">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className={`py-1 transition-all flex items-center justify-between ${
              isHome ? "text-[#0E6875] font-extrabold" : "hover:text-[#0E6875]"
            }`}
          >
            <span>Home</span>
            <i className="fa-solid fa-chevron-right text-xs text-gray-300"></i>
          </Link>

          <Link
            href="/diplomas"
            onClick={() => setMobileOpen(false)}
            className={`py-1 transition-all flex items-center justify-between ${
              isDiploma ? "text-[#0E6875] font-extrabold" : "hover:text-[#0E6875]"
            }`}
          >
            <span>Diploma</span>
            <i className="fa-solid fa-chevron-right text-xs text-gray-300"></i>
          </Link>

          <Link
            href="/ideation"
            onClick={() => setMobileOpen(false)}
            className={`py-1 transition-all flex items-center justify-between ${
              isIdeation ? "text-[#0E6875] font-extrabold" : "hover:text-[#0E6875]"
            }`}
          >
            <span>Ideation</span>
            <i className="fa-solid fa-chevron-right text-xs text-gray-300"></i>
          </Link>

          <Link
            href="/market-research"
            onClick={() => setMobileOpen(false)}
            className={`py-1 transition-all flex items-center justify-between ${
              isMarketResearch ? "text-[#0E6875] font-extrabold" : "hover:text-[#0E6875]"
            }`}
          >
            <span>Market Research</span>
            <i className="fa-solid fa-chevron-right text-xs text-gray-300"></i>
          </Link>

          <Link
            href="/teams"
            onClick={() => setMobileOpen(false)}
            className={`py-1 transition-all flex items-center justify-between ${
              isTeams ? "text-[#0E6875] font-extrabold" : "hover:text-[#0E6875]"
            }`}
          >
            <span>Build Team</span>
            <i className="fa-solid fa-chevron-right text-xs text-gray-300"></i>
          </Link>

          <Link
            href="/consultations"
            onClick={() => setMobileOpen(false)}
            className="py-1 transition-all flex items-center justify-between hover:text-[#0E6875]"
          >
            <span>Consultations</span>
            <i className="fa-solid fa-chevron-right text-xs text-gray-300"></i>
          </Link>

          <Link
            href="/about"
            onClick={() => setMobileOpen(false)}
            className={`py-1 transition-all flex items-center justify-between ${
              isAbout ? "text-[#0E6875] font-extrabold" : "hover:text-[#0E6875]"
            }`}
          >
            <span>About Us</span>
            <i className="fa-solid fa-chevron-right text-xs text-gray-300"></i>
          </Link>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Install TimeValley App</span>
            <InstallPWAButton />
          </div>
        </div>
      </div>

      {/* PWA Notification Center Modal */}
      <NotificationCenterModal
        isOpen={showNotifModal}
        onClose={() => setShowNotifModal(false)}
      />
    </header>
  );
}
