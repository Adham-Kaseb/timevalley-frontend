"use client";

import React, { useState } from "react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ContentLibraryHeroSection from "@/components/library/ContentLibraryHeroSection";
import ResourcesGrid from "@/components/library/ResourcesGrid";
import DownloadResourceModal, {
  ResourceItem,
} from "@/components/library/DownloadResourceModal";

export default function ContentLibraryPage() {
  const [activeCategory, setActiveCategory] = useState("All Resources");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resources: ResourceItem[] = [
    {
      id: "res-1",
      title: "The Day Zero Founder Playbook 2026",
      category: "Venture Strategy",
      format: "PDF Guide (48 Pages)",
      downloads: "3,820",
      desc: "Step-by-step blueprint for co-founder matchmaking, thesis validation, and initial GTM sprint execution.",
    },
    {
      id: "res-2",
      title: "TimeValley Pre-Seed Standard Term Sheet",
      category: "Legal & Equity",
      format: "DOCX / PDF Template",
      downloads: "5,110",
      desc: "Clean, founder-friendly SAFE & equity investment agreement template used across our global cohorts.",
    },
    {
      id: "res-3",
      title: "The 10-Slide Investor Deck Master Template",
      category: "Pitch & Fundraising",
      format: "Figma / Keynote Template",
      downloads: "6,490",
      desc: "Battle-tested pitch deck layout designed to communicate market size, unit economics, and technical moat.",
    },
    {
      id: "res-4",
      title: "SaaS Unit Economics & Financial Cash Model",
      category: "Financial Modeling",
      format: "Excel / Google Sheets",
      downloads: "4,230",
      desc: "Interactive 3-year financial model with automated LTV/CAC calculations, burn runway, and hiring schedules.",
    },
    {
      id: "res-5",
      title: "Co-Founder Equity Split & Vesting Calculator",
      category: "Legal & Equity",
      format: "Web Tool / Calculator",
      downloads: "2,940",
      desc: "Algorithmic framework to calculate fair co-founder equity splits based on domain expertise and risk commitment.",
    },
    {
      id: "res-6",
      title: "GTM Growth Experiment & Lead Generation Matrix",
      category: "Growth & Sales",
      format: "Notion Dashboard",
      downloads: "3,150",
      desc: "Framework for running 14-day growth experiments, outbound B2B cadence tracking, and customer interviews.",
    },
  ];

  const handleOpenDownload = (resource: ResourceItem) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF0E9] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-8">
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs />

        {/* Hero Section & Category Filters */}
        <ContentLibraryHeroSection
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Resources Grid */}
        <ResourcesGrid
          resources={resources}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          onOpenDownloadModal={handleOpenDownload}
        />
      </div>

      {/* Resource Access / Download Modal */}
      <DownloadResourceModal
        isOpen={isModalOpen}
        resource={selectedResource}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
