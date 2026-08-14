"use client";

import { useState } from "react";

export default function FounderTeamSection() {
  const [applied, setApplied] = useState<{ [key: string]: boolean }>({});

  const handleApply = (id: string, name: string) => {
    setApplied((prev) => ({ ...prev, [id]: true }));
    alert(`Application submitted to join ${name}!`);
  };

  return (
    <section id="teams" className="py-8 md:py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <span className="text-[#0E6875] text-xs font-extrabold uppercase tracking-widest block">
            CO-FOUNDER MATCHMAKING
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C2B2D]">
            Build Your Own <span className="text-[#EDA296]">Founder Team</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-medium">
            Create your startup team, recruit technical CTOs or growth leads, or apply to join active venture squads.
          </p>
        </div>

        {/* 2 Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Card 1: Project Chronos AI */}
          <div className="card-white p-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-[#E6F3F5] text-[#0E6875] text-xs font-bold px-3 py-1 rounded-full">
                  Fintech & Risk AI
                </span>
                <span className="bg-[#FDEEE9] text-[#E08577] text-xs font-bold px-3 py-1 rounded-full border border-[#EDA296]/30">
                  Recruiting Active
                </span>
              </div>

              <h3 className="text-2xl font-bold text-[#1C2B2D] mb-1">
                Project Chronos AI
              </h3>
              <div className="text-xs font-semibold text-gray-500 mb-3">
                Founder: <span className="text-gray-800 font-bold">Dr. Fatima Al-Hassan</span>
              </div>

              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                Building autonomous risk evaluation engine for cross-border credit underwriting.
              </p>

              {/* Roles */}
              <div className="mb-6">
                <div className="text-xs font-bold text-gray-700 block mb-2">
                  Open Co-Founder Roles:
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#FDEEE9] border border-[#EDA296]/50 text-[#E08577] text-xs font-bold px-3 py-1 rounded-md">
                    Technical Co-Founder / CTO
                  </span>
                  <span className="bg-[#FDEEE9] border border-[#EDA296]/50 text-[#E08577] text-xs font-bold px-3 py-1 rounded-md">
                    Growth Marketer
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-gray-700">
                25% - 40% Equity Split
              </span>

              <button
                onClick={() => handleApply("team-1", "Project Chronos AI")}
                disabled={applied["team-1"]}
                className={`text-xs font-bold px-5 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5 ${
                  applied["team-1"]
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#0E6875] hover:bg-[#0B4E58] text-white"
                }`}
              >
                <span>🤝</span>
                <span>{applied["team-1"] ? "Applied ✓" : "Apply to Join"}</span>
              </button>
            </div>
          </div>

          {/* Card 2: BioPulse Longevity */}
          <div className="card-white p-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-[#E6F3F5] text-[#0E6875] text-xs font-bold px-3 py-1 rounded-full">
                  BioTech & HealthTech
                </span>
                <span className="bg-[#FDEEE9] text-[#E08577] text-xs font-bold px-3 py-1 rounded-full border border-[#EDA296]/30">
                  Recruiting Active
                </span>
              </div>

              <h3 className="text-2xl font-bold text-[#1C2B2D] mb-1">
                BioPulse Longevity
              </h3>
              <div className="text-xs font-semibold text-gray-500 mb-3">
                Founder: <span className="text-gray-800 font-bold">Tariq Al-Mansoor</span>
              </div>

              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                Decentralized clinical trial data verification platform backed by TimeValley Studio.
              </p>

              {/* Roles */}
              <div className="mb-6">
                <div className="text-xs font-bold text-gray-700 block mb-2">
                  Open Co-Founder Roles:
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#FDEEE9] border border-[#EDA296]/50 text-[#E08577] text-xs font-bold px-3 py-1 rounded-md">
                    Full-Stack Developer
                  </span>
                  <span className="bg-[#FDEEE9] border border-[#EDA296]/50 text-[#E08577] text-xs font-bold px-3 py-1 rounded-md">
                    Regulatory Lead
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-gray-700">
                20% - 35% Equity Split
              </span>

              <button
                onClick={() => handleApply("team-2", "BioPulse Longevity")}
                disabled={applied["team-2"]}
                className={`text-xs font-bold px-5 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5 ${
                  applied["team-2"]
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#0E6875] hover:bg-[#0B4E58] text-white"
                }`}
              >
                <span>🤝</span>
                <span>{applied["team-2"] ? "Applied ✓" : "Apply to Join"}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Center CTA Button */}
        <div className="flex justify-center">
          <button
            onClick={() => alert("Redirecting to Founder Team Creation Wizard...")}
            className="bg-[#EDA296] hover:bg-[#E08577] text-white font-extrabold text-sm px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>+</span>
            <span>Create or Join a Founder Team</span>
          </button>
        </div>

      </div>
    </section>
  );
}
