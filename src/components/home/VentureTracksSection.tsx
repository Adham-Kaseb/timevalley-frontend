"use client";

import { ventureTracks } from "@/utils/mockData";

export default function VentureTracksSection() {
  return (
    <section id="tracks" className="py-16 md:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="bg-[#E6F3F5] text-[#0E6875] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            منهجية التأسيس
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
            مسارات بناء الشركات الناشئة مع TimeValley
          </h2>
          <p className="text-base sm:text-lg text-[#6B7280]">
            نرافقك من الفكرة والبحث عن الشريك المؤسس حتى إطلاق المنتج واستلام شيك الاستثمار الأول.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ventureTracks.map((track) => (
            <div
              key={track.id}
              className="glass-card p-8 flex flex-col justify-between group hover:border-[#0E6875] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center font-bold text-xl group-hover:bg-[#0E6875] group-hover:text-white transition-colors">
                    ✦
                  </div>
                  <span className="bg-[#EDA296] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {track.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 leading-snug">
                  {track.title}
                </h3>

                <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed mb-6">
                  {track.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-xs font-bold text-[#0E6875] bg-[#E6F3F5] px-2.5 py-1 rounded-md">
                  ● {track.status}
                </span>
                <a
                  href={`#${track.id}`}
                  className="text-sm font-bold text-[#0E6875] hover:text-[#148595] flex items-center gap-1 group-hover:-translate-x-1 transition-all"
                >
                  <span>التفاصيل</span>
                  <span className="rotate-180">←</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
