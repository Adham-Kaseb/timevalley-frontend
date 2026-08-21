"use client";

import React, { useState } from "react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ProcessingLayerOverlay, {
  ProcessingStep,
} from "@/components/ideation/ProcessingLayerOverlay";
import TamCalculatorSection from "@/components/ideation/TamCalculatorSection";
import SectorsTelemetrySection from "@/components/ideation/SectorsTelemetrySection";
import MoatAuditSection from "@/components/ideation/MoatAuditSection";

export default function MarketResearchPage() {
  const [showMock, setShowMock] = useState(false);

  const marketResearchSteps: ProcessingStep[] = [
    {
      id: 1,
      title: "TAM / SAM / SOM Financial Calculation Model",
      desc: "Computing bottom-up addressable market ceilings across target ICPs...",
      icon: "fa-solid fa-calculator",
    },
    {
      id: 2,
      title: "High-Growth Sectors Telemetry Radar",
      desc: "Synthesizing regional market telemetry & investment velocity...",
      icon: "fa-solid fa-chart-pie",
    },
    {
      id: 3,
      title: "Defensible Moat Audit & Risk Matrix",
      desc: "Evaluating network effects & proprietary AI lock-in metrics...",
      icon: "fa-solid fa-shield-halved",
    },
    {
      id: 4,
      title: "VC Investment Grade Audit Synthesis",
      desc: "Synthesizing defensibility score and institutional investor gates...",
      icon: "fa-solid fa-file-invoice-dollar",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF0E9] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs />

        {/* Top Processing & Logic Overlay Layer */}
        <ProcessingLayerOverlay
          showMock={showMock}
          onToggleMock={() => setShowMock(!showMock)}
          pageTitle="Market Research Telemetry & Financial Sizing Engine"
          pageSubtitle="Live financial modeling and high-growth sector telemetry algorithms are currently processing in the background. Explore the preview mock below."
          steps={marketResearchSteps}
        />
      </div>

      {/* Main Market Research Page Mock */}
      {showMock && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Market Intelligence Hero Banner */}
          <div className="bg-linear-to-r from-[#0E6875] via-[#0B4E58] to-[#08353C] rounded-3xl p-8 sm:p-10 text-white text-center space-y-3 shadow-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#EDA296] text-xs font-bold uppercase tracking-wider">
              <i className="fa-solid fa-chart-line"></i> Real-Time Market Telemetry
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Market Research & <span className="text-[#EDA296]">Competitive Intelligence</span> Matrix
            </h1>
            <p className="text-sm sm:text-base text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Synthesize regional TAM/SAM/SOM market boundaries, evaluate defensible competitive moats, and track buyer demand velocity across high-growth venture sectors.
            </p>
          </div>

          {/* Section 1: Interactive TAM / SAM / SOM Financial Calculator */}
          <TamCalculatorSection />

          {/* Section 2: High-Growth Venture Sectors Telemetry */}
          <SectorsTelemetrySection />

          {/* Section 3: Competitor Defensive Moat Audit */}
          <MoatAuditSection />
        </div>
      )}
    </div>
  );
}
