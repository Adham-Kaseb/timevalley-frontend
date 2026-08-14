"use client";

import React from "react";

interface TeamBuilderHeroSectionProps {
  activeSector: string;
  onSelectSector: (sector: string) => void;
  onOpenCreateModal: () => void;
}

export default function TeamBuilderHeroSection({
  activeSector,
  onSelectSector,
  onOpenCreateModal,
}: TeamBuilderHeroSectionProps) {
  const sectors = [
    "All Sectors",
    "Fintech & Risk AI",
    "BioTech & HealthTech",
    "Enterprise AI",
    "Supply Chain & Logistics",
  ];

  return (
    <section className="mb-10 text-center space-y-6">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDA296]/20 text-[#0E6875] text-xs font-bold uppercase tracking-wider">
          <i className="fa-solid fa-users"></i> Co-Founder Matchmaking
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#1C2B2D] leading-tight">
          Build Your Own <span className="text-[#EDA296]">Founder Team</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto font-medium">
          Form a new startup team, invite technical co-founders, or apply to join recruiting teams in our global venture network.
        </p>
      </div>

      {/* CTA Action Bar & Sector Filter Pills */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={onOpenCreateModal}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <i className="fa-solid fa-plus-circle"></i>
          <span>Create a Startup Team</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center justify-center gap-2 flex-wrap pt-4">
        {sectors.map((sec) => (
          <button
            key={sec}
            onClick={() => onSelectSector(sec)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer border ${
              activeSector === sec
                ? "bg-[#0E6875] text-white border-[#0E6875] shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#0E6875] hover:text-[#0E6875]"
            }`}
          >
            {sec}
          </button>
        ))}
      </div>
    </section>
  );
}
