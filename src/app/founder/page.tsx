"use client";

import React, { useState } from "react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import FounderHeroSpotlight from "@/components/founder/FounderHeroSpotlight";
import FounderMethodologySection from "@/components/founder/FounderMethodologySection";
import FounderPitchContactCard from "@/components/founder/FounderPitchContactCard";

export default function FounderPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF0E9] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-8">
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs />

        {/* Section 1: Founder Hero Spotlight Profile */}
        <FounderHeroSpotlight
          onOpenBookingModal={() => setIsBookingOpen(true)}
        />

        {/* Section 2: Dr. Wael's Venture Building Methodology & Pillars */}
        <FounderMethodologySection />

        {/* Section 3: Pitch Your Venture Directly to Dr. Wael */}
        <FounderPitchContactCard
          isBookingOpen={isBookingOpen}
          onOpenBooking={() => setIsBookingOpen(true)}
          onCloseBooking={() => setIsBookingOpen(false)}
        />
      </div>
    </div>
  );
}
