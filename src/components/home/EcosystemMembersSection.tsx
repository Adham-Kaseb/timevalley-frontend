"use client";

import { ecosystemMembers } from "@/utils/mockData";

export default function EcosystemMembersSection() {
  const handleConnect = (name: string) => {
    alert(`تم إرسال طلب التواصل إلى ${name} بنجاح!`);
  };

  return (
    <section id="community" className="py-16 md:py-24 bg-white/60 border-y border-gray-200/80 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="bg-[#E6F3F5] text-[#0E6875] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full">
            شبكة المنظومة
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
            نخبة المؤسسين والموجهين في الشرق الأوسط
          </h2>
          <p className="text-base sm:text-lg text-[#6B7280]">
            تواصل مباشرة مع الخبراء والمستثمرين الاستراتيجيين الداعمين لشركتك الناشئة.
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {ecosystemMembers.map((member, index) => (
            <div
              key={index}
              className="glass-card p-6 flex flex-col items-center text-center justify-between hover:border-[#0E6875] transition-all"
            >
              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-[#E6F3F5] text-[#0E6875] text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {member.badge}
                  </span>
                  <button
                    onClick={() => handleConnect(member.name)}
                    className="w-8 h-8 rounded-full bg-[#FAF0E9] hover:bg-[#EDA296] hover:text-white text-[#0E6875] flex items-center justify-center text-xs font-bold transition-colors"
                    title={`تواصل مع ${member.name}`}
                  >
                    ✉
                  </button>
                </div>

                {/* Avatar */}
                <div className="w-20 h-20 mx-auto rounded-full bg-linear-to-tr from-[#0E6875] to-[#EDA296] p-1 shadow-md mb-4">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-black text-2xl text-[#0E6875]">
                    {member.name.charAt(0)}
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#1A1A1A] mb-1">
                  {member.name}
                </h3>
                <p className="text-xs text-[#6B7280] font-medium mb-3 min-h-9">
                  {member.role}
                </p>
              </div>

              <div className="w-full pt-3 border-t border-gray-100 flex items-center justify-center">
                <span className="text-[11px] font-semibold text-[#0E6875] bg-[#E6F3F5] px-2.5 py-1 rounded-md">
                  📍 {member.location}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
