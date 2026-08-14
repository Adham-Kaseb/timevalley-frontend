"use client";

import React, { useState } from "react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ProcessingLayerOverlay, {
  ProcessingStep,
} from "@/components/ideation/ProcessingLayerOverlay";
import TeamBuilderHeroSection from "@/components/teams/TeamBuilderHeroSection";
import TeamCardsGrid, { TeamItem } from "@/components/teams/TeamCardsGrid";
import CreateTeamModal from "@/components/teams/CreateTeamModal";

export default function BuildTeamPage() {
  const [showMock, setShowMock] = useState(false);
  const [activeSector, setActiveSector] = useState("All Sectors");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [teams, setTeams] = useState<TeamItem[]>([
    {
      id: "team-1",
      name: "Project Chronos AI",
      sector: "Fintech & Risk AI",
      founder: "Dr. Sarah Jenkins",
      desc: "Building autonomous risk evaluation engine for cross-border credit underwriting.",
      openRoles: ["Technical Co-Founder / CTO", "Growth Marketer"],
      equity: "25% - 40% Equity Split",
    },
    {
      id: "team-2",
      name: "BioPulse Longevity",
      sector: "BioTech & HealthTech",
      founder: "Marcus Vance",
      desc: "Decentralized clinical trial data verification platform backed by TimeValley Studio.",
      openRoles: ["Full-Stack Developer", "Regulatory Lead"],
      equity: "20% - 35% Equity Split",
    },
    {
      id: "team-3",
      name: "OmniChain Logistics",
      sector: "Supply Chain & Logistics",
      founder: "Omar Al-Farisi",
      desc: "Cross-border trade finance platform reducing settlement clearance latency.",
      openRoles: ["Smart Contract Engineer", "Supply Chain Lead"],
      equity: "15% - 30% Equity Split",
    },
    {
      id: "team-4",
      name: "AetherAI Engine",
      sector: "Enterprise AI",
      founder: "Fatima Al-Hassan",
      desc: "Multi-agent autonomous framework for venture capital due diligence automated workflows.",
      openRoles: ["Machine Learning Scientist", "Enterprise Sales Lead"],
      equity: "25% - 45% Equity Split",
    },
  ]);

  const teamSteps: ProcessingStep[] = [
    {
      id: 1,
      title: "Co-Founder Matchmaking & Skill Taxonomy",
      desc: "Matching domain experts with technical CTO co-founders...",
      icon: "fa-solid fa-users",
    },
    {
      id: 2,
      title: "Cap Table & Equity Split Modeling",
      desc: "Calculating fair 20%-40% equity split ranges for day-zero venture teams...",
      icon: "fa-solid fa-chart-pie",
    },
    {
      id: 3,
      title: "Founder Credential Verification",
      desc: "Verifying track record, technical portfolio & mentor ratings...",
      icon: "fa-solid fa-[#EDA296] fa-badge-check",
    },
    {
      id: 4,
      title: "Active Team Recruitment Pipeline",
      desc: "Syncing applications with TimeValley venture builder dashboard...",
      icon: "fa-solid fa-paper-plane",
    },
  ];

  const handleAddTeam = (newTeam: TeamItem) => {
    setTeams((prev) => [newTeam, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#FAF0E9] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs />

        {/* Top Processing & Logic Overlay Layer */}
        <ProcessingLayerOverlay
          showMock={showMock}
          onToggleMock={() => setShowMock(!showMock)}
          pageTitle="Build Your Own Founder Team Engine"
          pageSubtitle="Algorithmic co-founder matchmaking, skill-compatibility matrices, and equity split calculators are actively processing in the background. Explore the preview mock below."
          steps={teamSteps}
        />
      </div>

      {/* Main Build Team Page Mock */}
      {showMock && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Section 1: Hero & Sector Filter */}
          <TeamBuilderHeroSection
            activeSector={activeSector}
            onSelectSector={setActiveSector}
            onOpenCreateModal={() => setIsModalOpen(true)}
          />

          {/* Section 2: Recruiting Startup Cards Grid */}
          <TeamCardsGrid teams={teams} activeSector={activeSector} />
        </div>
      )}

      {/* Modal Wizard to Create a Team */}
      <CreateTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTeam={handleAddTeam}
      />
    </div>
  );
}
