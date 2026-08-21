"use client";

import React from "react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AboutHeroSection from "@/components/about/AboutHeroSection";
import AboutCoreValuesSection from "@/components/about/AboutCoreValuesSection";
import AboutPartnersGrid from "@/components/about/AboutPartnersGrid";
import AboutTimelineSection from "@/components/about/AboutTimelineSection";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF0E9] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-8">
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs />

        {/* Section 1: Hero Agency Overview & Feature Highlights */}
        <AboutHeroSection />

        {/* Section 2: Core Values & Philosophy Manifesto */}
        <AboutCoreValuesSection />

        {/* Section 3: Ecosystem Portfolio & Partners Grid */}
        <AboutPartnersGrid />

        {/* Section 4: Evolution Timeline & Road to Success */}
        <AboutTimelineSection />
      </div>
    </div>
  );
}
