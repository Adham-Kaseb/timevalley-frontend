"use client";

import Link from "next/link";

export default function JourneySection() {
  const steps = [
    {
      num: "01",
      phase: "Phase 01",
      title: "Thesis & Co-Founder Match",
      desc: "Form high-performing co-founder duos, validate deep tech opportunities, and shape disruptive venture theses.",
      cta: "Build Your Team →",
      href: "#teams",
    },
    {
      num: "02",
      phase: "Phase 02",
      title: "MVP & Customer Validation",
      desc: "Build functional prototypes, execute initial pilot contracts, and iterate with real customer feedback loops.",
      cta: "Ideation Matrix →",
      href: "#ideation",
    },
    {
      num: "03",
      phase: "Phase 03",
      title: "Pre-Seed Capital & Scale",
      desc: "Secure $250K+ initial equity check from TimeValley Capital with direct access to Series A syndicates.",
      cta: "Explore Diploma →",
      href: "/diplomas",
    },
  ];

  return (
    <section className="py-8 md:py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <span className="text-[#0E6875] text-xs font-extrabold uppercase tracking-widest block">
            OUR METHODOLOGY
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C2B2D]">
            The 3-Phase <span className="text-[#EDA296]">Day Zero</span> Journey
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-medium">
            Designed alongside tier-1 venture partners to guide founders from initial thesis to market scale.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="card-white p-8 flex flex-col justify-between hover:-translate-y-1 transition-all h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center font-extrabold text-sm text-gray-700">
                    {step.num}
                  </div>
                  <span className="bg-[#FDEEE9] text-[#E08577] border border-[#EDA296]/40 text-xs font-bold px-3 py-1 rounded-full">
                    {step.phase}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#1C2B2D] mb-3">
                  {step.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-center">
                <Link
                  href={step.href}
                  className="text-xs font-extrabold text-gray-800 hover:text-[#0E6875] transition-colors border border-gray-200 hover:border-[#0E6875] px-4 py-2 rounded-lg bg-gray-50 hover:bg-[#E6F3F5]"
                >
                  {step.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
