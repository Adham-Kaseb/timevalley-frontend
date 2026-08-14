"use client";

import React from "react";

export default function FounderMethodologySection() {
  const pillars = [
    {
      id: "01",
      title: "01. Thesis Engineering",
      desc: "Rigorous validation of market size, unit economics, and total addressable market (TAM) before writing line one of code.",
      icon: "fa-solid fa-lightbulb",
    },
    {
      id: "02",
      title: "02. Co-Founder Matching",
      desc: "Pairing visionary domain experts with elite technical co-founders using algorithmic skill compatibility matrices.",
      icon: "fa-solid fa-handshake",
    },
    {
      id: "03",
      title: "03. Direct Capital Gate",
      desc: "Guaranteed pre-seed funding check from TimeValley Capital for top-graduating venture teams passing Demo Day gates.",
      icon: "fa-solid fa-chart-line",
    },
  ];

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E6875]/10 text-[#0E6875] text-xs font-bold uppercase tracking-wider">
          Pillars of Execution
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-[#1C2B2D]">
          Dr. Wael&apos;s <span className="text-[#0E6875]">Venture Building Methodology</span>
        </h2>
        <p className="text-sm sm:text-base text-gray-600 font-medium">
          A disciplined framework engineered to take tech founders from Day-Zero idea synthesis to institutional Series A investment.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar) => (
          <div
            key={pillar.id}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF0E9] border border-[#EDA296]/40 text-[#0E6875] flex items-center justify-center text-xl font-bold mb-4">
                <i className={pillar.icon}></i>
              </div>
              <h3 className="text-lg font-black text-[#1C2B2D] mb-2">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                {pillar.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#0E6875]">
              <span>Stage Protocol</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
