"use client";

import React, { useState, useEffect } from "react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ContentLibraryHeroSection from "@/components/library/ContentLibraryHeroSection";
import ResourcesGrid from "@/components/library/ResourcesGrid";
import DownloadResourceModal, {
  ResourceItem,
} from "@/components/library/DownloadResourceModal";
import resourcesService from "@/services/resources";

export default function ContentLibraryPage() {
  const [activeCategory, setActiveCategory] = useState("All Resources");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resources, setResources] = useState<ResourceItem[]>([]);

  useEffect(() => {
    fetchResources();
  }, [activeCategory, searchQuery]);

  const fetchResources = async () => {
    try {
      const data = await resourcesService.getResources(activeCategory, searchQuery);
      if (data && data.length > 0) {
        const formatted: ResourceItem[] = data.map((r) => ({
          id: r.id,
          title: r.title,
          category: r.category,
          format: r.format,
          downloads: r.downloadsCount ? r.downloadsCount.toLocaleString() : "1,250",
          desc: r.desc,
        }));
        setResources(formatted);
      } else {
        setResources([
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
        ]);
      }
    } catch (err) {
      console.warn("Using default resources fallback", err);
    }
  };

  const handleOpenDownload = (resource: ResourceItem) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
    resourcesService.downloadResource(resource.id).catch(() => {});
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
