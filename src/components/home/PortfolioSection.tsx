"use client";

import { portfolioStartups } from "@/utils/mockData";

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-16 md:py-24 bg-white/60 border-y border-gray-200/80 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="bg-[#EDA296]/20 text-[#1A1A1A] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full">
            المحفظة الاستثمارية
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
            شركات ناشئة تخرجت وتوسعت عبر TimeValley
          </h2>
          <p className="text-base sm:text-lg text-[#6B7280]">
            نماذج لشركات تقنية واعدة جمعت جولات استثمارية نجحت في اختراق الأسواق الإقليمية والدولية.
          </p>
        </div>

        {/* Startups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolioStartups.map((startup, index) => (
            <div
              key={index}
              className="glass-card-glow p-7 flex flex-col justify-between hover:-translate-y-1 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0E6875] text-white flex items-center justify-center font-bold text-lg">
                      {startup.name.charAt(0)}
                    </div>
                    <h3 className="text-lg font-bold text-[#1A1A1A]">
                      {startup.name}
                    </h3>
                  </div>
                  <span className="bg-[#0E6875] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {startup.raised}
                  </span>
                </div>

                <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
                  {startup.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#0E6875]">
                  {startup.category}
                </span>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                  {startup.valuation}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
