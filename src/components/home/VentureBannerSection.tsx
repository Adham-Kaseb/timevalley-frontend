"use client";

import Link from "next/link";

export default function VentureBannerSection() {
  return (
    <section className="py-4 md:py-6 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Container with Primary Teal Background */}
        <div className="bg-[#0E6875] text-white rounded-[28px] p-8 sm:p-12 lg:p-14 shadow-2xl border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          {/* Left Column Content */}
          <div className="space-y-4 max-w-3xl">
            
            {/* Top Pill Badge */}
            <div className="bg-[#FAF0E9] text-[#8C4035] text-xs font-extrabold px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-xs border border-white/40">
              <i className="fa-solid fa-rocket text-[#E08577]"></i>
              <span>Venture Builder Model</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
              We <span className="text-[#EDA296]">Setup</span> The Finest Business Model
              <br />
              For Road To <span className="text-[#71D5E4]">Succeed and Grow</span>
            </h2>

            {/* Subtitle / Description */}
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-medium max-w-xl">
              Empowering tech entrepreneurs from day-zero ideation to pre-seed investment and multimillion-dollar scale.
            </p>
          </div>

          {/* Right Action Button / Link */}
          <div className="shrink-0 pt-2 lg:pt-0">
            <Link
              href="/diplomas"
              className="text-white hover:text-[#71D5E4] font-extrabold text-base sm:text-lg flex items-center gap-3 transition-colors group cursor-pointer"
            >
              <i className="fa-solid fa-paper-plane text-base transition-transform group-hover:translate-x-1"></i>
              <span>Get Started Now</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
