"use client";

import React from "react";

export default function AboutPartnersGrid() {
  const partners = [
    { name: "FinPay AI", sector: "Fintech Infrastructure", icon: "fa-brain" },
    { name: "HealthPulse", sector: "HealthTech & AI", icon: "fa-heart-pulse" },
    { name: "LogiTrack", sector: "Supply Chain SaaS", icon: "fa-cubes" },
    { name: "EduSpark", sector: "EdTech Platform", icon: "fa-graduation-cap" },
    { name: "CyberShield", sector: "Enterprise Security", icon: "fa-shield-halved" },
    { name: "TradeFlow", sector: "B2B Commerce", icon: "fa-[#EDA296] fa-building-columns" },
  ];

  return (
    <section className="mb-12 text-center space-y-6">
      <div className="max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-[#1C2B2D]">
          Portfolio <span className="text-[#EDA296]">Startups</span> & Ecosystem Partners
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 font-medium">
          Accelerating high-growth tech ventures across MENA & global hubs.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {partners.map((partner, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-2xl p-5 text-center space-y-2 shadow-xs hover:shadow-md hover:border-[#0E6875] transition-all cursor-default"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF0E9] text-[#0E6875] mx-auto flex items-center justify-center text-base">
              <i className={`fa-solid ${partner.icon}`}></i>
            </div>
            <h4 className="text-sm font-extrabold text-[#1C2B2D]">
              {partner.name}
            </h4>
            <small className="text-[11px] font-bold text-[#0E6875] block truncate">
              {partner.sector}
            </small>
          </div>
        ))}
      </div>
    </section>
  );
}
