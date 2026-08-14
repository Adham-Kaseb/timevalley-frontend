"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function NotFound() {
  const router = useRouter();
  const { user, isLoggedIn, openEnrollModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase().trim();
    if (query.includes("diploma") || query.includes("course") || query.includes("lesson")) {
      router.push("/diplomas");
    } else if (query.includes("idea") || query.includes("thesis") || query.includes("ai")) {
      router.push("/ideation");
    } else if (query.includes("market") || query.includes("tam") || query.includes("research")) {
      router.push("/market-research");
    } else if (query.includes("team") || query.includes("founder") || query.includes("hire")) {
      router.push("/build-team");
    } else if (query.includes("admin") || query.includes("dashboard")) {
      router.push("/admin");
    } else {
      router.push(`/diplomas?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const navigationShortcuts = [
    {
      title: "Studio Home",
      desc: "Return to main TimeValley landing page",
      href: "/",
      icon: "fa-house",
      badge: "MAIN",
      color: "bg-teal-50 text-[#0E6875] border-teal-200",
    },
    {
      title: "120h Founder Diploma",
      desc: "8 modules covering Day-Zero to Series A",
      href: "/diplomas",
      icon: "fa-graduation-cap",
      badge: "CURRICULUM",
      color: "bg-[#0E6875] text-white border-[#0E6875]",
    },
    {
      title: "Ideation & AI Thesis",
      desc: "Validate B2B/B2C SaaS theses with AI tools",
      href: "/ideation",
      icon: "fa-[#EDA296] fa-lightbulb",
      badge: "STUDIO",
      color: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      title: "Market Research",
      desc: "Compute TAM/SAM/SOM & ICP target customer math",
      href: "/market-research",
      icon: "fa-chart-pie",
      badge: "ANALYTICS",
      color: "bg-blue-50 text-blue-800 border-blue-200",
    },
    {
      title: "Build Your Team",
      desc: "Find tech co-founders and advisory mentors",
      href: "/build-team",
      icon: "fa-user-group",
      badge: "MATCHMAKING",
      color: "bg-purple-50 text-purple-800 border-purple-200",
    },
    {
      title: "Student Workspace",
      desc: "Access your active diploma video lessons",
      href: "/workspace",
      icon: "fa-laptop-code",
      badge: "STUDENT",
      color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF0E9] text-[#1C2B2D] flex flex-col justify-between py-12 px-4 sm:px-8 relative overflow-hidden selection:bg-[#0E6875] selection:text-white">
      
      {/* Background Decorative Radial Flares */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0E6875]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#EDA296]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto w-full my-auto space-y-10 text-center relative z-10 animate-fadeIn">
        
        {/* Animated 404 Badge & Visual Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 bg-white px-5 py-2 rounded-full shadow-md border border-gray-200/80 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-widest text-[#0E6875]">
              404 | Page Not Found
            </span>
          </div>

          {/* Big Stylized 404 Header */}
          <div className="relative inline-block">
            <h1 className="text-7xl sm:text-9xl font-black text-[#1C2B2D] tracking-tighter leading-none select-none">
              4<span className="text-[#0E6875] drop-shadow-sm">0</span>4
            </h1>
            <div className="absolute -top-3 -right-6 sm:-right-8 bg-[#EDA296] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md transform rotate-12">
              Lost in Space?
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#1C2B2D] tracking-tight max-w-2xl mx-auto">
            The page you are looking for does not exist or has moved.
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-lg mx-auto leading-relaxed">
            Don't worry! Your venture journey isn't off track. Use our quick page search or select a destination below to continue.
          </p>
        </div>

        {/* Interactive Page Search Bar */}
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-4 text-gray-400 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for diploma modules, ideation tools, or research..."
              className="w-full bg-white border border-gray-200/90 rounded-2xl pl-11 pr-32 py-3.5 text-xs sm:text-sm font-semibold text-[#1C2B2D] placeholder-gray-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0E6875] transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-[#0E6875] hover:bg-[#0B4E58] text-white px-5 rounded-xl text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Search</span>
              <i className="fa-solid fa-arrow-right text-[10px]" />
            </button>
          </form>
        </div>

        {/* Quick Navigation Grid */}
        <div className="space-y-4">
          <div className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">
            Popular Destinations
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {navigationShortcuts.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white p-5 rounded-2xl border border-gray-200/80 hover:border-[#0E6875]/40 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shadow-xs border ${item.color}`}>
                    <i className={`fa-solid ${item.icon}`} />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <div className="font-extrabold text-sm text-[#1C2B2D] group-hover:text-[#0E6875] transition-colors flex items-center gap-1.5">
                    <span>{item.title}</span>
                    <i className="fa-solid fa-arrow-right text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-0.5 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Super Admin Quick Shortcut if Admin */}
        {isSuperAdmin && (
          <div className="p-4 bg-[#0E6875]/10 border border-[#0E6875]/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0E6875] text-white flex items-center justify-center font-bold text-sm">
                ⚡
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#0E6875]">Super Admin Account Detected</div>
                <div className="text-[11px] text-gray-600 font-medium">Jump straight to your control center to manage modules & permissions.</div>
              </div>
            </div>
            <Link
              href="/admin"
              className="bg-[#0E6875] hover:bg-[#0B4E58] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
            >
              Open Admin Console (/admin)
            </Link>
          </div>
        )}

        {/* Advisory Support Card */}
        <div className="pt-6 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-600">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-question text-[#0E6875] text-sm" />
            <span>Need help finding a specific advisory resource or diploma content?</span>
          </div>

          <button
            onClick={() => openEnrollModal()}
            className="text-[#0E6875] font-extrabold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Talk to Advisory Support</span>
            <i className="fa-solid fa-headset" />
          </button>
        </div>

      </div>

      {/* Footer copyright */}
      <footer className="text-center text-xs text-gray-400 font-medium pt-8">
        © 2026 TimeValley Consulting. All rights reserved.
      </footer>
    </div>
  );
}
