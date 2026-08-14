"use client";

import HeroSection from "@/components/home/HeroSection";
import JourneySection from "@/components/home/JourneySection";
import FounderTeamSection from "@/components/home/FounderTeamSection";
import PortfolioCaseStudySection from "@/components/home/PortfolioCaseStudySection";
import VentureBannerSection from "@/components/home/VentureBannerSection";
import CustomerFeedbackSection from "@/components/home/CustomerFeedbackSection";
import GuideAccordionSection from "@/components/home/GuideAccordionSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#FAF0E9]">
      
      {/* 1. Hero Section & Key Metrics Bar */}
      <HeroSection />

      {/* 2. The 3-Phase Day Zero Journey (Our Methodology) */}
      <JourneySection />

      {/* 3. Build Your Own Founder Team (Co-Founder Matchmaking) */}
      <FounderTeamSection />

      {/* 4. Portfolio Showcase & Bento Case Studies */}
      <PortfolioCaseStudySection />

      {/* 5. Venture Builder Model Callout Banner */}
      <VentureBannerSection />

      {/* 6. Customers Feedback / Testimonials Carousel */}
      <CustomerFeedbackSection />

      {/* 7. Skills Accordion & Advisory Frame */}
      <GuideAccordionSection />

      {/* 8. Newsletter Subscription Card */}
      <NewsletterSection />

    </div>
  );
}
