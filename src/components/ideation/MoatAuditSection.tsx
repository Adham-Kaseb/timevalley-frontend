"use client";

import React, { useState } from "react";

export default function MoatAuditSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const moatItems = [
    {
      id: 1,
      title: "Network Effects",
      sub: "Viral Growth Loop",
      score: "8.5 / 10",
      icon: "fa-solid fa-diagram-project",
      badgeClass: "bg-[#EDA296] text-[#0E6875]",
    },
    {
      id: 2,
      title: "Switching Costs",
      sub: "High Lock-in",
      score: "9.0 / 10",
      icon: "fa-solid fa-lock",
      badgeClass: "bg-[#71D5E4]/30 text-[#71D5E4] border border-[#71D5E4]/40",
    },
    {
      id: 3,
      title: "Scale Economies",
      sub: "Unit Margins",
      score: "7.8 / 10",
      icon: "fa-solid fa-chart-line",
      badgeClass: "bg-[#EDA296] text-[#0E6875]",
    },
    {
      id: 4,
      title: "Proprietary IP",
      sub: "AI Data Moat",
      score: "9.4 / 10",
      icon: "fa-solid fa-key",
      badgeClass: "bg-[#71D5E4]/30 text-[#71D5E4] border border-[#71D5E4]/40",
    },
  ];

  return (
    <section className="mb-12">
      <div className="bg-linear-to-br from-[#0E6875] via-[#0B4E58] to-[#07363D] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Background Decorative Blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EDA296]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Info & 2x2 Scorecard Grid */}
          <div className="lg:col-span-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDA296] text-[#0E6875] text-xs font-bold uppercase tracking-wider">
              <i className="fa-solid fa-shield-heart"></i> Competitive Strategy
            </span>

            <div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Competitor Defensive Moat Audit
              </h3>
              <p className="text-sm sm:text-base text-gray-200 mt-2 max-w-2xl leading-relaxed">
                Evaluate your startup&apos;s defensibility across the 4 primary venture moats: Network Effects, High Switching Costs, Scale Economies, and Proprietary IP.
              </p>
            </div>

            {/* 2x2 Scorecards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {moatItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl p-4 space-y-2 hover:bg-white/15 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-sm">
                      <i className={item.icon}></i>
                    </div>
                    <span className="font-bold text-white text-sm">
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-gray-300">{item.sub}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${item.badgeClass}`}>
                      {item.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Trigger Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3.5 rounded-full bg-[#EDA296] hover:bg-[#E08577] text-[#0E6875] font-black text-sm sm:text-base shadow-lg shadow-[#EDA296]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              <span>Run Interactive Moat Audit</span>
            </button>
          </div>

          {/* Right Column: Radar Score Preview Widget */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-3xl p-8 text-center space-y-4 max-w-xs w-full shadow-2xl">
              <div className="w-24 h-24 rounded-full bg-[#EDA296]/20 border-2 border-[#EDA296] mx-auto flex items-center justify-center text-4xl text-[#EDA296] shadow-lg shadow-[#EDA296]/20 animate-pulse">
                <i className="fa-solid fa-chess-knight"></i>
              </div>

              <div>
                <div className="text-4xl font-black text-white font-mono">
                  9.4
                </div>
                <h4 className="text-sm font-bold text-gray-200 mt-1">
                  Moat Defensibility Score
                </h4>
              </div>

              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EDA296] text-[#0E6875] text-xs font-black">
                <i className="fa-solid fa-circle-check"></i> Grade A+ VC Approved
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-[#0E6875] flex items-center gap-2">
                <i className="fa-solid fa-shield-halved"></i> Competitive Moat Report
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#FAF0E9] rounded-2xl border border-[#EDA296]/40">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1C2B2D] text-sm">Overall Defensibility Rating</span>
                  <span className="px-3 py-1 bg-[#0E6875] text-white rounded-full text-xs font-black">GRADE A+</span>
                </div>
              </div>

              <div className="space-y-2 text-xs font-semibold text-gray-700">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>Viral Growth Loop Network Effects:</span>
                  <strong className="text-[#0E6875]">8.5 / 10</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>Enterprise Switching Costs Lock-in:</span>
                  <strong className="text-[#0E6875]">9.0 / 10</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>Scale Economies Unit Margins:</span>
                  <strong className="text-[#0E6875]">7.8 / 10</strong>
                </div>
                <div className="flex justify-between py-2">
                  <span>Proprietary AI Data Moat:</span>
                  <strong className="text-[#0E6875]">9.4 / 10</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-sm"
            >
              Close Moat Report
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
