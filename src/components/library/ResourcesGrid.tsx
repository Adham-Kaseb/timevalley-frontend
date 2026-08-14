"use client";

import React from "react";
import { ResourceItem } from "./DownloadResourceModal";

interface ResourcesGridProps {
  resources: ResourceItem[];
  activeCategory: string;
  searchQuery: string;
  onOpenDownloadModal: (resource: ResourceItem) => void;
}

export default function ResourcesGrid({
  resources,
  activeCategory,
  searchQuery,
  onOpenDownloadModal,
}: ResourcesGridProps) {
  const filteredResources = resources.filter((res) => {
    const matchesCategory =
      activeCategory === "All Resources" || res.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (filteredResources.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center text-xl">
          <i className="fa-solid fa-book-open"></i>
        </div>
        <h3 className="text-lg font-bold text-gray-700">
          No resources found matching your search
        </h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Try adjusting your search query or selecting a different resource category!
        </p>
      </div>
    );
  }

  return (
    <div key={`${activeCategory}-${searchQuery}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {filteredResources.map((res) => (
        <div
          key={res.id}
          className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex items-center justify-between gap-2">
              <span className="bg-[#E6F3F5] text-[#0E6875] text-xs font-extrabold px-3 py-1 rounded-full border border-[#0E6875]/20">
                {res.category}
              </span>
              <span className="bg-[#FDEEE9] text-[#E08577] text-xs font-extrabold px-3 py-1 rounded-full border border-[#EDA296]/30">
                {res.format}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-black text-[#1C2B2D] leading-tight">
              {res.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
              {res.desc}
            </p>
          </div>

          {/* Footer Row */}
          <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between gap-2">
            <small className="text-xs font-bold text-gray-500">
              <i className="fa-solid fa-download text-[#0E6875] me-1"></i>{" "}
              {res.downloads} downloads
            </small>

            <button
              onClick={() => onOpenDownloadModal(res)}
              className="px-5 py-2.5 rounded-xl border border-[#0E6875] text-[#0E6875] hover:bg-[#0E6875] hover:text-white font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-105"
            >
              <i className="fa-solid fa-file-arrow-down"></i>
              <span>Access Guide</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
