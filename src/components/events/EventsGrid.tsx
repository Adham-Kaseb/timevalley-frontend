"use client";

import React, { useState } from "react";
import { EventItem } from "./RsvpModal";

interface EventsGridProps {
  events: EventItem[];
  activeType: string;
  onOpenRsvpModal: (event: EventItem) => void;
  rsvpedIds: { [key: string]: boolean };
}

export default function EventsGrid({
  events,
  activeType,
  onOpenRsvpModal,
  rsvpedIds,
}: EventsGridProps) {
  const filteredEvents =
    activeType === "All Events"
      ? events
      : events.filter((e) => e.type === activeType);

  if (filteredEvents.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center text-xl">
          <i className="fa-solid fa-calendar-xmark"></i>
        </div>
        <h3 className="text-lg font-bold text-gray-700">
          No events found for {activeType}
        </h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Try selecting another category or check back soon for newly scheduled sessions!
        </p>
      </div>
    );
  }

  return (
    <div key={activeType} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {filteredEvents.map((ev) => {
        const isRsvped = rsvpedIds[ev.id];

        return (
          <div
            key={ev.id}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="space-y-4">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className="bg-[#FAF0E9] border border-[#EDA296]/50 text-[#0E6875] text-xs font-black px-3 py-1 rounded-full">
                  <i className="fa-solid fa-calendar-day me-1 text-[#EDA296]"></i> {ev.date} • {ev.time}
                </span>
                <span className="bg-[#0E6875]/10 text-[#0E6875] text-xs font-extrabold px-3 py-1 rounded-full border border-[#0E6875]/20">
                  {ev.status}
                </span>
              </div>

              {/* Event Title */}
              <h3 className="text-xl font-black text-[#1C2B2D] leading-tight">
                {ev.title}
              </h3>

              {/* Location */}
              <p className="text-xs font-bold text-[#0E6875] flex items-center gap-1.5">
                <i className="fa-solid fa-location-dot text-[#EDA296]"></i>
                <span>{ev.location}</span>
              </p>

              {/* Description */}
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                {ev.desc}
              </p>
            </div>

            {/* Footer Row */}
            <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between gap-2">
              <small className="text-[11px] font-bold text-gray-500 block truncate max-w-37.5">
                <i className="fa-solid fa-users text-[#0E6875] me-1"></i> {ev.speakers}
              </small>

              <button
                onClick={() => onOpenRsvpModal(ev)}
                disabled={isRsvped}
                className={`text-xs font-extrabold px-4 py-2 rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isRsvped
                    ? "bg-emerald-100 text-emerald-700 cursor-not-allowed border border-emerald-300"
                    : "bg-[#0E6875] hover:bg-[#0B4E58] text-white hover:scale-105"
                }`}
              >
                <i className="fa-solid fa-ticket"></i>
                <span>{isRsvped ? "RSVP Confirmed ✓" : "RSVP Free"}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
