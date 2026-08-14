"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="pt-6 pb-8 md:pt-8 md:pb-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid: Text Left, Arch Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-1.5 rounded-full text-xs font-bold text-gray-700 shadow-sm">
              <span>📈</span>
              <span>Business Consulting & Startup Agency</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1C2B2D] leading-[1.15] tracking-tight">
              Empowering Startups from{" "}
              <span className="text-[#EDA296]">Day Zero</span> to{" "}
              <span className="text-[#0E6875]">Global Scale</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl font-medium">
              TimeValley combines strategic business consulting, co-founder
              matchmaking, 120h Tutor LMS diplomas, and pre-seed capital
              investment for tech entrepreneurs.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/diplomas"
                className="bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>🚀</span>
                <span>Explore 120h Diploma</span>
              </Link>

              <a
                href="#teams"
                className="bg-[#EDA296] hover:bg-[#E08577] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>👥</span>
                <span>Build Your Team</span>
              </a>
            </div>
          </div>

          {/* Right Image Frame Column */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Arch Shaped Photo Frame */}
              <div className="arch-frame border-4 border-white shadow-2xl bg-gray-200 overflow-hidden aspect-4/5 relative">
                <img
                  src="/images/team/CEO.jpg"
                  alt="TimeValley Founders"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute bottom-6 -left-5 bg-white border border-gray-200 rounded-2xl p-3 shadow-xl flex items-center gap-3 animate-bounce-subtle">
                <div className="w-10 h-10 rounded-xl bg-[#EDA296]/20 text-[#0E6875] flex items-center justify-center font-bold text-lg">
                  🏆
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#0E6875]">
                    94% VC Success
                  </div>
                  <div className="text-[11px] font-semibold text-gray-500">
                    Series A follow-on rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Key Metrics Bar */}
        <div className="mt-12 bg-[#0E6875] text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-center">
            
            {/* Metric 1 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl border border-white/30 flex items-center justify-center shrink-0 bg-white/5">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.58-5.84l5.96 5.96" />
                </svg>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white leading-tight">250+</div>
                <div className="text-[11px] font-semibold text-gray-300">Startups Built & Funded</div>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl border border-white/30 flex items-center justify-center shrink-0 bg-white/5">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white leading-tight">$52M+</div>
                <div className="text-[11px] font-semibold text-gray-300">Capital Invested</div>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl border border-white/30 flex items-center justify-center shrink-0 bg-white/5">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white leading-tight">120h+</div>
                <div className="text-[11px] font-semibold text-gray-300">Diploma Coursework</div>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl border border-white/30 flex items-center justify-center shrink-0 bg-white/5">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.6 9h16.8M3.6 15h16.8" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.5 3a17 17 0 000 18M12.5 3a17 17 0 010 18" />
                </svg>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white leading-tight">14+</div>
                <div className="text-[11px] font-semibold text-gray-300">Global Ecosystem Hubs</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
