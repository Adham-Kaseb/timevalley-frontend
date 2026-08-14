"use client";

import React from "react";

export default function SectorsTelemetrySection() {
  const sectors = [
    {
      id: 1,
      title: "Fintech & Payments Hub",
      cagr: "+28.4% CAGR",
      tam: "$4.2 Billion",
      desc: "Cross-border wholesale settlement, SAMA/DIFC sandbox rails, and merchant risk engine.",
      icon: "fa-solid fa-coins",
      badgeColor: "bg-[#0E6875]/10 text-[#0E6875] border-[#0E6875]/30",
    },
    {
      id: 2,
      title: "Clinical HealthTech AI",
      cagr: "+34.1% CAGR",
      tam: "$2.8 Billion",
      desc: "HIPAA/SOC2 AI diagnostic models, EHR hospital integrations, and longevity data lakes.",
      icon: "fa-solid fa-dna",
      badgeColor: "bg-[#EDA296]/20 text-[#0E6875] border-[#EDA296]/40",
    },
    {
      id: 3,
      title: "Supply Chain SaaS",
      cagr: "+22.8% CAGR",
      tam: "$5.1 Billion",
      desc: "Fleet telemetry automation, customs clearance APIs, and last-mile logistics routing.",
      icon: "fa-solid fa-truck-fast",
      badgeColor: "bg-[#0E6875]/10 text-[#0E6875] border-[#0E6875]/30",
    },
    {
      id: 4,
      title: "Enterprise Cyber Security",
      cagr: "+31.5% CAGR",
      tam: "$3.9 Billion",
      desc: "Zero-trust threat prevention, sovereign cloud compliance, and AI identity verification.",
      icon: "fa-solid fa-shield-halved",
      badgeColor: "bg-[#EDA296]/20 text-[#0E6875] border-[#EDA296]/40",
    },
  ];

  const handleReport = (title: string) => {
    alert(`📊 Deep-Dive Market Intelligence Report loaded for: ${title}`);
  };

  return (
    <section className="mb-12">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDA296]/20 text-[#0E6875] text-xs font-bold uppercase tracking-wider mb-2">
            <i className="fa-solid fa-cubes"></i> Sector Performance
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#0E6875]">
            High-Growth Venture Sectors Telemetry
          </h3>
        </div>
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#0E6875] text-white text-xs font-bold self-start sm:self-auto">
          Updated Q3 2026 Telemetry
        </span>
      </div>

      {/* Grid of 4 Sector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sectors.map((sector) => (
          <div
            key={sector.id}
            className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4 hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF0E9] text-[#0E6875] flex items-center justify-center text-xl font-bold border border-gray-200">
                  <i className={sector.icon}></i>
                </div>
                <span className={`px-3 py-1 rounded-full border text-xs font-extrabold ${sector.badgeColor}`}>
                  {sector.cagr}
                </span>
              </div>

              <h4 className="text-lg font-bold text-[#1C2B2D] mb-2">
                {sector.title}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                {sector.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
              <div>
                <small className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Market TAM
                </small>
                <strong className="text-lg font-black text-[#0E6875]">
                  {sector.tam}
                </strong>
              </div>
              <button
                onClick={() => handleReport(sector.title)}
                className="px-4 py-2 rounded-full border border-[#0E6875] text-[#0E6875] hover:bg-[#0E6875] hover:text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Report</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
