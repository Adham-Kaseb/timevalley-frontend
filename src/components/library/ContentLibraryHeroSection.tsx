"use client";

import React from "react";

interface ContentLibraryHeroSectionProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ContentLibraryHeroSection({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: ContentLibraryHeroSectionProps) {
  const categories = [
    "All Resources",
    "Venture Strategy",
    "Legal & Equity",
    "Pitch & Fundraising",
    "Financial Modeling",
    "Growth & Sales",
  ];

  return (
    <section className="mb-10 text-center space-y-6">
      {/* Header Banner */}
      <div className="max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E6875]/10 text-[#0E6875] text-xs font-bold uppercase tracking-wider">
          <i className="fa-solid fa-book-bookmark"></i> Knowledge Repository
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#1C2B2D] leading-tight">
          Founder Playbooks & <span className="text-[#0E6875]">Term Sheets</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto font-medium">
          Download battle-tested startup resources, cap table calculators, and pitch deck templates created by experienced venture partners.
        </p>
      </div>

      {/* Search Bar Input */}
      <div className="max-w-md mx-auto relative">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        <input
          type="text"
          placeholder="Search playbooks, SAFEs, deck templates..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-semibold text-gray-800 placeholder-gray-400 shadow-xs focus:outline-none focus:border-[#0E6875] focus:ring-2 focus:ring-[#0E6875]/20 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer border ${
              activeCategory === cat
                ? "bg-[#0E6875] text-white border-[#0E6875] shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#0E6875] hover:text-[#0E6875]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
}
