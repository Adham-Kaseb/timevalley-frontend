"use client";

import React, { useState, useEffect } from "react";

export interface ProcessingStep {
  id: number;
  title: string;
  desc: string;
  icon: string;
}

interface ProcessingLayerOverlayProps {
  showMock: boolean;
  onToggleMock: () => void;
  pageTitle?: string;
  pageSubtitle?: string;
  steps?: ProcessingStep[];
}

export default function ProcessingLayerOverlay({
  showMock,
  onToggleMock,
  pageTitle = "Ideation Logic & AI Synthesis Engine",
  pageSubtitle = "AI Venture Engine is actively processing datasets in the background. Explore the preview mock below.",
  steps,
}: ProcessingLayerOverlayProps) {
  const [activeStep, setActiveStep] = useState(1);

  const defaultSteps: ProcessingStep[] = [
    {
      id: 1,
      title: "Sector Telemetry Data Acquisition",
      desc: "Synthesizing cross-border fintech & healthtech growth datasets...",
      icon: "fa-solid fa-database",
    },
    {
      id: 2,
      title: "TAM / SAM / SOM Financial Sizing Engine",
      desc: "Computing bottom-up addressable market ceilings across target ICPs...",
      icon: "fa-solid fa-calculator",
    },
    {
      id: 3,
      title: "Defensible Moat Radar & Risk Matrix",
      desc: "Evaluating network effects & proprietary AI lock-in metrics...",
      icon: "fa-solid fa-shield-halved",
    },
    {
      id: 4,
      title: "AI Pitch Thesis & Market Synthesis Model",
      desc: "Synthesizing 94/100 viability score for pre-seed investment readiness...",
      icon: "fa-solid fa-wand-magic-sparkles",
    },
  ];

  const activeSteps = steps || defaultSteps;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev % activeSteps.length) + 1);
    }, 2500);
    return () => clearInterval(timer);
  }, [activeSteps.length]);

  if (showMock) {
    return null;
  }

  return (
    <div className="relative min-h-[65vh] flex items-center justify-center p-4 sm:p-8 bg-linear-to-b from-[#0E6875]/95 via-[#0B4E58] to-[#08353C] rounded-3xl my-4 shadow-2xl overflow-hidden text-white border border-white/10">
      {/* Background Decorative Glowing Elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#EDA296]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#0E6875]/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl w-full text-center space-y-8 py-6">
        {/* Badge Header */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold tracking-wider text-[#EDA296] uppercase">
          <i className="fa-solid fa-microchip animate-spin text-[#EDA296]"></i>
          <span>Neural Processing Engine v3.4</span>
        </div>

        {/* Main Headings */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            {pageTitle} <span className="text-[#EDA296]">Is Under Processing</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto font-medium leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        {/* Live Step Tracker Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {activeSteps.map((step) => {
            const isCurrent = activeStep === step.id;
            const isCompleted = activeStep > step.id;

            return (
              <div
                key={step.id}
                className={`p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 ${
                  isCurrent
                    ? "bg-white/20 border-[#EDA296] shadow-lg shadow-[#EDA296]/10 scale-[1.02]"
                    : isCompleted
                    ? "bg-white/10 border-white/20 opacity-90"
                    : "bg-white/5 border-white/10 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                        isCurrent
                          ? "bg-[#EDA296] text-[#0E6875]"
                          : isCompleted
                          ? "bg-white/30 text-white"
                          : "bg-white/10 text-gray-300"
                      }`}
                    >
                      <i className={step.icon}></i>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {step.title}
                      </h4>
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="px-2.5 py-0.5 rounded-md bg-[#EDA296]/20 border border-[#EDA296]/40 text-[#EDA296] text-[10px] font-bold animate-pulse">
                      In Progress
                    </span>
                  )}
                  {isCompleted && (
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      Completed ✓
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-300 mt-1 font-mono">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Button to Show Mock */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onToggleMock}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#EDA296] hover:bg-[#E08577] text-white font-black text-lg shadow-xl shadow-[#EDA296]/20 hover:shadow-[#EDA296]/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <i className="fa-solid fa-eye text-xl group-hover:scale-110 transition-transform"></i>
            <span>Show Page Mock</span>
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </button>
        </div>

        {/* Notice Caption */}
        <p className="text-xs text-gray-300 font-medium">
          💡 You can interact with the full preview mock, financial calculator, and AI venture generator.
        </p>
      </div>
    </div>
  );
}
