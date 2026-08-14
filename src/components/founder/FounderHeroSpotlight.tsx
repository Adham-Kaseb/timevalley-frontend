"use client";

import React from "react";

interface FounderHeroSpotlightProps {
  onOpenBookingModal: () => void;
}

export default function FounderHeroSpotlight({
  onOpenBookingModal,
}: FounderHeroSpotlightProps) {
  const handleLinkedIn = () => {
    alert("Connecting with Dr. Wael on LinkedIn...");
  };

  return (
    <section className="mb-12 bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0E6875]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Text Profile & Stats */}
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E6875]/10 text-[#0E6875] text-xs font-bold uppercase tracking-wider">
            <i className="fa-solid fa-crown text-[#0E6875]"></i> Founder & Managing Partner
          </span>

          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#0E6875] leading-tight">
              Dr. Wael
            </h1>
            <p className="text-base sm:text-xl font-bold text-[#1C2B2D] mt-1">
              Founder & CEO • TimeValley Consulting & Capital
            </p>
          </div>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
            Pioneering the next era of high-growth MENA & global venture creation. Over 15+ years, Dr. Wael has architected tech accelerators, funded 250+ portfolio startups, and established TimeValley Platform as the region&apos;s premier venture building ecosystem.
          </p>

          {/* 3 Stat Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#FAF0E9] border border-[#EDA296]/40 p-4 rounded-2xl text-center space-y-1">
              <h4 className="text-2xl font-black text-[#0E6875]">250+</h4>
              <small className="text-xs font-bold text-gray-600 block">
                Ventures Scaled
              </small>
            </div>

            <div className="bg-[#FAF0E9] border border-[#EDA296]/40 p-4 rounded-2xl text-center space-y-1">
              <h4 className="text-2xl font-black text-[#EDA296]">
                $52M+
              </h4>
              <small className="text-xs font-bold text-gray-600 block">
                Capital Deployed
              </small>
            </div>

            <div className="bg-[#FAF0E9] border border-[#EDA296]/40 p-4 rounded-2xl text-center space-y-1">
              <h4 className="text-2xl font-black text-[#0E6875]">94%</h4>
              <small className="text-xs font-bold text-gray-600 block">
                VC Series A Gate
              </small>
            </div>
          </div>

          {/* Actions Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={onOpenBookingModal}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-calendar-check"></i>
              <span>Book Founder Office Hours</span>
            </button>

            <button
              onClick={handleLinkedIn}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-gray-300 hover:border-[#0E6875] text-gray-700 hover:text-[#0E6875] font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
            >
              <i className="fa-brands fa-linkedin text-lg text-[#0A66C2]"></i>
              <span>Connect LinkedIn</span>
            </button>
          </div>
        </div>

        {/* Right Column: Arch Frame Portrait */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm">
            <div className="rounded-t-[140px] rounded-b-3xl border-4 border-white shadow-2xl overflow-hidden bg-gray-100 aspect-3/4">
              <img
                src="/images/team/CEO.jpg"
                alt="Dr. Wael Founder & Managing Partner"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
