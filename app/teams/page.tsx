"use client";

import React, { useState, useEffect } from "react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ProcessingLayerOverlay, {
  ProcessingStep,
} from "@/components/ideation/ProcessingLayerOverlay";
import TeamBuilderHeroSection from "@/components/teams/TeamBuilderHeroSection";
import TeamCardsGrid, { TeamItem } from "@/components/teams/TeamCardsGrid";
import CreateTeamModal from "@/components/teams/CreateTeamModal";
import teamsService from "@/services/teams";

export default function BuildTeamPage() {
  const [showMock, setShowMock] = useState(false);
  const [activeSector, setActiveSector] = useState("All Sectors");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [teams, setTeams] = useState<TeamItem[]>([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const data = await teamsService.getTeams();
      if (data && data.length > 0) {
        const formatted: TeamItem[] = data.map((t) => ({
          id: t.id,
          name: t.name,
          sector: t.sector,
          founder: t.founderName,
          desc: t.description,
          openRoles: Array.isArray(t.openRoles) ? t.openRoles : [t.openRoles],
          equity: t.equitySplit,
        }));
        setTeams(formatted);
      } else {
        setTeams([
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
        ]);
      }
    } catch (err) {
      console.warn("Using default teams fallback", err);
    }
  };

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

  const handleAddTeam = async (newTeam: TeamItem) => {
    setTeams((prev) => [newTeam, ...prev]);
    try {
      await teamsService.createTeam({
        name: newTeam.name,
        sector: newTeam.sector,
        founderName: newTeam.founder,
        description: newTeam.desc,
        openRoles: newTeam.openRoles,
        equitySplit: newTeam.equity,
      });
      fetchTeams();
    } catch (err) {
      console.warn("Failed to persist new team to backend", err);
    }
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
