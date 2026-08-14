"use client";

import React, { useState } from "react";

export interface TeamItem {
  id: string;
  name: string;
  sector: string;
  founder: string;
  desc: string;
  openRoles: string[];
  equity: string;
}

interface TeamCardsGridProps {
  teams: TeamItem[];
  activeSector: string;
}

export default function TeamCardsGrid({ teams, activeSector }: TeamCardsGridProps) {
  const [appliedTeams, setAppliedTeams] = useState<{ [key: string]: boolean }>({});

  const filteredTeams =
    activeSector === "All Sectors"
      ? teams
      : teams.filter((t) => t.sector === activeSector);

  const handleApply = (id: string, name: string) => {
    setAppliedTeams((prev) => ({ ...prev, [id]: true }));
    alert(`🎉 Application successfully submitted to join ${name}!`);
  };

  if (filteredTeams.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center text-xl">
          <i className="fa-solid fa-folder-open"></i>
        </div>
        <h3 className="text-lg font-bold text-gray-700">
          No active teams found for {activeSector}
        </h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Try selecting another sector or create your own startup team to start recruiting co-founders!
        </p>
      </div>
    );
  }

  return (
    <div key={activeSector} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {filteredTeams.map((team) => {
        const isApplied = appliedTeams[team.id];

        return (
          <div
            key={team.id}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="space-y-4">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className="bg-[#E6F3F5] text-[#0E6875] text-xs font-extrabold px-3 py-1 rounded-full border border-[#0E6875]/20">
                  {team.sector}
                </span>
                <span className="bg-[#FDEEE9] text-[#E08577] text-xs font-extrabold px-3 py-1 rounded-full border border-[#EDA296]/30">
                  Recruiting Active
                </span>
              </div>

              {/* Startup Title & Founder */}
              <div>
                <h3 className="text-2xl font-black text-[#1C2B2D]">
                  {team.name}
                </h3>
                <p className="text-xs font-bold text-gray-500 mt-1">
                  Founder: <span className="text-[#1C2B2D]">{team.founder}</span>
                </p>
              </div>

              {/* Pitch Description */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                {team.desc}
              </p>

              {/* Open Roles */}
              <div className="space-y-2">
                <small className="text-xs font-extrabold text-[#0E6875] uppercase tracking-wider block">
                  Open Co-Founder Roles:
                </small>
                <div className="flex flex-wrap gap-2">
                  {team.openRoles.map((role, idx) => (
                    <span
                      key={idx}
                      className="bg-[#FDEEE9] border border-[#EDA296]/50 text-[#E08577] text-xs font-extrabold px-3 py-1 rounded-lg"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Row */}
            <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between gap-4">
              <span className="text-xs sm:text-sm font-black text-gray-800">
                {team.equity}
              </span>

              <button
                onClick={() => handleApply(team.id, team.name)}
                disabled={isApplied}
                className={`text-xs font-extrabold px-5 py-2.5 rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer ${
                  isApplied
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#0E6875] hover:bg-[#0B4E58] text-white hover:scale-105"
                }`}
              >
                <i className="fa-solid fa-handshake"></i>
                <span>{isApplied ? "Applied ✓" : "Apply to Join"}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
