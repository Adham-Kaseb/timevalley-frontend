"use client";

import React from "react";
import Link from "next/link";

export default function AboutCoreValuesSection() {
  return (
    <section className="mb-12">
      <div className="bg-[#0E6875] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Arch Frame Team Member Photo */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-xs">
              <div className="rounded-t-[140px] rounded-b-3xl border-2 border-[#094750] shadow-xl overflow-hidden bg-[#094750] aspect-4/5">
                <img
                  src="/images/team/team-1.png"
                  alt="TimeValley Core Values Team Member"
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Core Values Content */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-[#EDA296] text-xs font-black shadow-xs">
                <i className="fa-solid fa-shield-heart"></i> Agency Philosophy
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Our Core Values
            </h2>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
              Great companies aren&apos;t built by chance; they are built through radical transparency, winning co-founder alignment, and day-zero capital. We stand shoulder-to-shoulder with founders from ideation to scale.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/teams"
                className="px-6 py-3 rounded-xl bg-[#EDA296] hover:bg-[#E08577] text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2 hover:scale-105"
              >
                <i className="fa-solid fa-handshake"></i>
                <span>Join Ecosystem</span>
              </Link>

              <Link
                href="/diplomas"
                className="px-6 py-3 rounded-xl border border-white/40 hover:border-white text-white font-extrabold text-sm transition-all flex items-center gap-2 hover:bg-white/10"
              >
                <i className="fa-solid fa-graduation-cap"></i>
                <span>Explore LMS</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
