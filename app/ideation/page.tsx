"use client";

import React, { useState } from "react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ProcessingLayerOverlay, {
  ProcessingStep,
} from "@/components/ideation/ProcessingLayerOverlay";
import IdeationGeneratorSection from "@/components/ideation/IdeationGeneratorSection";

export default function IdeationPage() {
  const [showMock, setShowMock] = useState(false);

  const ideationSteps: ProcessingStep[] = [
    {
      id: 1,
      title: "Venture Parameters Selection",
      desc: "Configuring target ICP personas, problem statement & sector taxonomy...",
      icon: "fa-solid fa-sliders",
    },
    {
      id: 2,
      title: "AI Synthesis Neural Engine v3.4",
      desc: "Synthesizing market pain point data and benchmarking solution viability...",
      icon: "fa-solid fa-brain",
    },
    {
      id: 3,
      title: "TAM & Unit Economics Estimation",
      desc: "Computing bottom-up market ceiling and addressable revenue streams...",
      icon: "fa-solid fa-chart-line",
    },
    {
      id: 4,
      title: "Synthesized Thesis & Pitch Score",
      desc: "Formatting claimable venture thesis card for founder canvas...",
      icon: "fa-solid fa-wand-magic-sparkles",
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
          pageTitle="Ideation Logic & AI Venture Generator Engine"
          pageSubtitle="The real-time thesis synthesis engine is actively processing market parameters in the background. Explore the preview mock below."
          steps={ideationSteps}
        />
      </div>

      {/* Main Ideation Page Mock */}
      {showMock && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Section: Venture Idea Generator & AI Validation */}
          <IdeationGeneratorSection />
        </div>
      )}
    </div>
  );
}
