"use client";

import { useState } from "react";

export default function PortfolioCaseStudySection() {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    "All",
    "Venture Acceleration",
    "Fintech & Trade",
    "AI & DeepTech",
    "HealthTech",
  ];

  // Category Matching Helper
  const matchesTab = (categories: string[]) => {
    if (activeTab === "All") return true;
    return categories.includes(activeTab);
  };

  const showFinPay = matchesTab([
    "Venture Acceleration",
    "Fintech & Trade",
    "AI & DeepTech",
  ]);
  const showLogiTrack = matchesTab(["Venture Acceleration"]);
  const showEduSpark = matchesTab(["Venture Acceleration"]);
  const showTradeFlow = matchesTab(["Fintech & Trade"]);
  const showHealthPulse = matchesTab(["HealthTech", "Venture Acceleration"]);
  const showCyberShield = matchesTab(["AI & DeepTech"]);

  return (
    <section id="portfolio" className="py-8 md:py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <span className="text-[#0E6875] text-xs font-extrabold uppercase tracking-widest block">
            PORTFOLIO SHOWCASE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C2B2D]">
            Case Study
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-medium">
            Explore how TimeValley accelerates early-stage ventures from
            day-zero ideation to multimillion-dollar Series A scaleups.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs sm:text-sm font-extrabold px-6 py-2.5 rounded-full transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-[#0E6875] text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200/90 shadow-2xs"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dynamic Bento Grid Layout */}
        <div key={activeTab} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in slide-in-from-bottom-3 duration-300">
          
          {/* Column Left (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. FinPay AI - Promoted Venture */}
            {showFinPay && (
              <div className="bg-[#0E6875] text-white rounded-3xl p-7 sm:p-8 relative overflow-hidden shadow-2xl border border-white/10 animate-in fade-in duration-300">
                {/* Background Photo Overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src="/images/team/CEO.jpg"
                    alt="FinPay Background"
                    className="w-full h-full object-cover opacity-25"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-[#0E6875]/96 via-[#0B5A66]/92 to-[#0E6875]/95" />
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#FAF0E9] text-[#E08577] text-xs font-extrabold px-3.5 py-1 rounded-full shadow-xs uppercase tracking-wider flex items-center gap-1.5">
                      <i className="fa-solid fa-bolt text-xs"></i>
                      <span>PROMOTED VENTURE</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      FinPay AI — Cross-Border Payments
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-medium mt-2 max-w-xl">
                      DIFC Sandbox accelerated cross-border payment engine.
                      Scaled from 0 to 1.2M transactions per month.
                    </p>
                  </div>

                  {/* 3 Metrics Chips */}
                  <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center">
                    <div>
                      <div className="text-xl font-black text-white">
                        $12.4M
                      </div>
                      <div className="text-xs text-gray-300 font-semibold mt-0.5">
                        ARR Scale
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-black text-white">$4.5M</div>
                      <div className="text-xs text-gray-300 font-semibold mt-0.5">
                        Seed Funding
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-black text-[#EDA296]">
                        6.8x
                      </div>
                      <div className="text-xs text-gray-300 font-semibold mt-0.5">
                        Valuation Multiplier
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/15 text-xs font-bold text-gray-200">
                    <span className="flex items-center gap-1.5">
                      <i className="fa-solid fa-shield-halved text-[#EDA296]"></i>
                      <span>Sequoia MENA Lead</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors border border-white/20 cursor-pointer">
                        <i className="fa-solid fa-expand text-xs"></i>
                      </button>
                      <button className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors border border-white/20 cursor-pointer">
                        <i className="fa-solid fa-eye text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. LogiTrack - Fleet Automation */}
            {showLogiTrack && (
              <div className="bg-[#0E6875] text-white rounded-3xl p-7 sm:p-8 relative overflow-hidden shadow-xl border border-white/10 group min-h-56 flex flex-col justify-between animate-in fade-in duration-300">
                {/* Background Photo Overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src="/images/team/team-3.png"
                    alt="LogiTrack Fleet"
                    className="w-full h-full object-cover opacity-35 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-[#0E6875]/95 via-[#0B5A66]/85 to-transparent" />
                </div>

                <div className="relative z-10 space-y-3">
                  <div>
                    <span className="bg-[#FAF0E9] text-[#E08577] text-xs font-extrabold px-3.5 py-1 rounded-full shadow-xs inline-flex items-center gap-1.5">
                      <i className="fa-solid fa-truck-fast text-xs"></i>
                      <span>Logistics SaaS</span>
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    LogiTrack — Fleet Automation
                  </h3>
                </div>

                <div className="relative z-10 flex items-center justify-between pt-4 text-xs font-bold text-white">
                  <span className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2">
                    <i className="fa-solid fa-chart-line text-[#EDA296]"></i>
                    <span>$15.6M ARR • 120+ Fleets</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors border border-white/20 cursor-pointer">
                      <i className="fa-solid fa-expand text-xs"></i>
                    </button>
                    <button className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors border border-white/20 cursor-pointer">
                      <i className="fa-solid fa-eye text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. EduSpark Card */}
            {showEduSpark && (
              <div className="bg-[#E6F3F5] border border-[#0E6875]/20 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-sm animate-in fade-in duration-300">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-[#0E6875] flex items-center justify-center font-bold text-lg shadow-xs">
                      <i className="fa-solid fa-graduation-cap"></i>
                    </div>
                    <span className="bg-white text-[#0E6875] text-xs font-extrabold px-3 py-1 rounded-full border border-[#0E6875]/20 shadow-2xs">
                      🎓 EdTech LMS
                    </span>
                  </div>

                  <h4 className="text-xl font-extrabold text-[#1C2B2D]">
                    EduSpark — Tutor LMS Engine
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-medium">
                    120h certified video masterclasses with 15,000+ active
                    founder graduates across MENA & global hubs.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#0E6875]/15 text-xs">
                  <span className="font-extrabold text-[#0E6875] flex items-center gap-1.5">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>15,000+ Graduates</span>
                  </span>
                  <a
                    href="/diplomas"
                    className="bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5"
                  >
                    <span>View Platform</span>
                    <i className="fa-solid fa-arrow-right text-[11px]"></i>
                  </a>
                </div>
              </div>
            )}

            {/* 4. TradeFlow B2B Card */}
            {showTradeFlow && (
              <div className="bg-[#0E6875] text-white rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl border border-white/10 animate-in fade-in duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-[#71D5E4] flex items-center justify-center text-xl shrink-0">
                    <i className="fa-solid fa-bag-shopping"></i>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-white/15 text-white text-xs font-extrabold px-3 py-0.5 rounded-full border border-white/20">
                        💳 Fintech & B2B
                      </span>
                      <span className="text-xs font-bold text-gray-300">
                        $18.1M GMV
                      </span>
                    </div>
                    <h4 className="text-lg font-extrabold text-white">
                      TradeFlow B2B — Commerce Engine
                    </h4>
                    <p className="text-gray-300 text-xs font-medium">
                      Cross-border wholesale settlement rails connecting 420+
                      MENA merchants.
                    </p>
                  </div>
                </div>

                <a
                  href="#teams"
                  className="border border-white/30 hover:bg-white/10 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>Read Story</span>
                  <i className="fa-solid fa-arrow-right text-[11px]"></i>
                </a>
              </div>
            )}

          </div>

          {/* Column Right (5 Columns - Tall HealthPulse AI & CyberShield AI) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* HealthPulse AI Tall Bento Card */}
            {showHealthPulse && (
              <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-2xl border border-gray-100 relative overflow-hidden flex flex-col justify-between space-y-6 animate-in fade-in duration-300">
                
                {/* Background Photo Overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src="/images/team/team-2.png"
                    alt="HealthPulse Background"
                    className="w-full h-full object-cover opacity-15"
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-white via-white/95 to-white" />
                </div>

                <div className="relative z-10 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#E6F3F5] text-[#0E6875] text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-[#0E6875]/20 flex items-center gap-1.5">
                      <i className="fa-solid fa-heart-pulse text-xs"></i>
                      <span>HealthTech</span>
                    </span>
                    <span className="border border-[#EDA296] text-[#E08577] text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-[#FAF0E9]/50">
                      Pre-Seed to Series A
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-[#0E6875] tracking-tight">
                      HealthPulse AI — Clinical Intelligence
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-medium mt-2">
                      Reduced B2B hospital sales cycles from 9 months to 45 days
                      using TimeValley's Tutor LMS enterprise sales playbooks.
                    </p>
                  </div>

                  {/* Table Data */}
                  <div className="bg-[#FAF0E9]/60 border border-gray-200/80 rounded-2xl p-4 space-y-2.5 text-xs font-semibold">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Hospital Adoption</span>
                      <span className="font-extrabold text-gray-900">
                        45+ Systems
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">YoY ARR Velocity</span>
                      <span className="font-extrabold text-[#0E6875]">
                        340% YoY
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Seed Raised</span>
                      <span className="font-extrabold text-gray-900">
                        $3.2M
                      </span>
                    </div>
                  </div>

                  {/* Dashed Callout Box */}
                  <div className="border-2 border-dashed border-[#EDA296] rounded-2xl p-6 bg-white/95 text-center space-y-2 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF0E9] text-[#E08577] flex items-center justify-center text-xl mx-auto border border-[#EDA296]/30">
                      <i className="fa-solid fa-dna"></i>
                    </div>
                    <h4 className="text-base font-extrabold text-gray-900">
                      Clinical AI Engine
                    </h4>
                    <p className="text-xs text-gray-500 font-medium">
                      Deployed across 45 regional health hubs
                    </p>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="relative z-10 pt-2">
                  <a
                    href="/diplomas"
                    className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-sm py-4 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                    <span>Explore HealthTech Playbook</span>
                  </a>
                </div>

              </div>
            )}

            {/* CyberShield AI Bottom Card */}
            {showCyberShield && (
              <div className="bg-[#FAF0E9] border border-[#EDA296]/40 rounded-3xl p-6 sm:p-7 flex items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#EDA296]/40 text-[#E08577] flex items-center justify-center text-xl shrink-0 shadow-xs">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#FDEEE9] text-[#E08577] text-xs font-extrabold px-3 py-0.5 rounded-full border border-[#EDA296]/30">
                        AI & Security
                      </span>
                      <span className="text-xs font-bold text-gray-600">
                        $9.2M ARR
                      </span>
                    </div>
                    <h4 className="text-lg font-extrabold text-[#1C2B2D]">
                      CyberShield AI — Enterprise Defense
                    </h4>
                    <p className="text-gray-600 text-xs font-medium">
                      Zero-trust AI threat detection engine protecting 180+
                      cloud enterprises.
                    </p>
                  </div>
                </div>

                <a
                  href="#ideation"
                  className="text-xs font-extrabold text-[#1C2B2D] hover:text-[#0E6875] transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>Read Story</span>
                  <i className="fa-solid fa-arrow-right text-[11px]"></i>
                </a>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
