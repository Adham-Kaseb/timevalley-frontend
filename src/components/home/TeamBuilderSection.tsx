"use client";

import { useState } from "react";
import { recruitingTeams } from "@/utils/mockData";

export default function TeamBuilderSection() {
  const [appliedTeams, setAppliedTeams] = useState<{ [key: string]: boolean }>({});

  const handleApply = (teamId: string, teamName: string) => {
    setAppliedTeams((prev) => ({ ...prev, [teamId]: true }));
    alert(`تم تقديم طلب الانضمام إلى مشروع ${teamName} بنجاح! سيتم التواصل معك قريباً.`);
  };

  return (
    <section id="teams" className="py-16 md:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="bg-[#E6F3F5] text-[#0E6875] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full">
            مطابقة الشركاء المؤسسين
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
            ابنِ فريقك الخاص أو انضم إلى فرق واعدة
          </h2>
          <p className="text-base sm:text-lg text-[#6B7280]">
            استكشف المشاريع النشطة التي تبحث عن شركاء تقنيين وتسويق بنسب ملكية مجزية.
          </p>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recruitingTeams.map((team) => (
            <div
              key={team.id}
              className="glass-card-glow p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-[#E6F3F5] text-[#0E6875] text-xs font-bold px-3 py-1 rounded-full">
                    {team.sector}
                  </span>
                  <span className="bg-[#EDA296] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {team.status}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-1">
                  {team.name}
                </h3>
                <p className="text-sm font-semibold text-[#0E6875] mb-4">
                  المؤسس: {team.founder}
                </p>

                <p className="text-[#6B7280] text-base leading-relaxed mb-6">
                  {team.desc}
                </p>

                {/* Open Roles */}
                <div className="mb-6">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                    الأدوار المتاحة للشركاء المؤسسين:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {team.openRoles.map((role, idx) => (
                      <span
                        key={idx}
                        className="bg-[#FAF0E9] border border-[#EDA296]/50 text-[#1A1A1A] text-xs font-bold px-3 py-1.5 rounded-lg"
                      >
                        ⚡ {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 block">نسبة الحصة المقترحة</span>
                  <span className="text-base font-extrabold text-[#0E6875]">
                    {team.equity}
                  </span>
                </div>

                <button
                  onClick={() => handleApply(team.id, team.name)}
                  disabled={appliedTeams[team.id]}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow transition-all ${
                    appliedTeams[team.id]
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-[#0E6875] hover:bg-[#148595] text-white"
                  }`}
                >
                  {appliedTeams[team.id] ? "تم تقديم الطلب ✓" : "قدم للانضمام للشريك"}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
