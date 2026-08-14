"use client";

import React from "react";

interface EventsHeroSectionProps {
  activeType: string;
  onSelectType: (type: string) => void;
}

export default function EventsHeroSection({
  activeType,
  onSelectType,
}: EventsHeroSectionProps) {
  const eventTypes = [
    "All Events",
    "Pitch Event",
    "Workshop",
    "Masterclass",
    "Legal Clinic",
    "Summit",
    "Networking",
  ];

  return (
    <section className="mb-10 text-center space-y-6">
      {/* Header Banner */}
      <div className="max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E6875]/10 text-[#0E6875] text-xs font-bold uppercase tracking-wider">
          <i className="fa-solid fa-calendar-days"></i> Ecosystem Gatherings
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#1C2B2D] leading-tight">
          Pitch Demo Days & <span className="text-[#0E6875]">Workshops</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto font-medium">
          Join global pitch sessions, investor office hours, and technical deep-dive masterclasses hosted across global TimeValley hubs.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
        {eventTypes.map((type) => (
          <button
            key={type}
            onClick={() => onSelectType(type)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer border ${
              activeType === type
                ? "bg-[#0E6875] text-white border-[#0E6875] shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#0E6875] hover:text-[#0E6875]"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </section>
  );
}
