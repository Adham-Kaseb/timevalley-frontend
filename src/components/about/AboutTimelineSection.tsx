"use client";

import React from "react";

export default function AboutTimelineSection() {
  const timelineBlocks = [
    {
      year: "2010",
      title: "Startup Story",
      desc: "Founded with the vision to bridge technical talent and venture funding across the MENA region, laying the foundation for day-zero venture architecture.",
      icon: "fa-solid fa-building",
      img: "/images/team/team-2.png",
      imageOnRight: true,
    },
    {
      year: "2015",
      title: "Our History & Growth",
      desc: "Expanded accelerator operations, launched the 120h Venture Architect Tutor LMS, and built an ecosystem of over 250 funded portfolio companies.",
      icon: "fa-solid fa-cubes",
      img: "/images/team/team-3.png",
      imageOnRight: false,
    },
    {
      year: "2020",
      title: "Global Hub Expansion",
      desc: "Established international innovation hubs in Dubai DIFC, Riyadh, Cairo, and London, connecting global cross-border capital to regional founders.",
      icon: "fa-solid fa-globe",
      img: "/images/team/team-4.png",
      imageOnRight: true,
    },
    {
      year: "2026",
      title: "AI Neural Engine & Studio",
      desc: "Deployed the AI Cohort Matcher Engine v3.4 for automated founder pairing, cap table structuring, and day-zero investment governance.",
      icon: "fa-solid fa-brain",
      img: "/images/team/team-5.png",
      imageOnRight: false,
    },
  ];

  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0E6875]/10 text-[#0E6875] text-xs font-bold uppercase tracking-wider border border-[#0E6875]/20">
          <i className="fa-solid fa-route"></i> Our Evolution
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-[#1C2B2D]">
          We <span className="text-[#EDA296]">Setup</span> The Finest{" "}
          <span className="text-[#0E6875]">Venture</span> Model For Road To Success
        </h2>
      </div>

      {/* Timeline Alternating Blocks */}
      <div className="space-y-12 max-w-5xl mx-auto">
        {timelineBlocks.map((block, idx) => {
          const TextCard = (
            <div className="relative bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center h-full">
              {/* Floating Top-Right Badge Icon */}
              <div className="absolute -top-4 -right-4 sm:right-6 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-md text-[#0E6875] flex items-center justify-center text-lg z-10">
                <i className={block.icon}></i>
              </div>

              <h3 className="text-xl font-black text-[#1C2B2D] mb-3">
                {block.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                {block.desc}
              </p>
            </div>
          );

          const ImageCard = (
            <div className="relative rounded-3xl overflow-hidden shadow-lg aspect-video md:aspect-4/3 lg:aspect-video bg-gray-100 group">
              <img
                src={block.img}
                alt={`${block.year} ${block.title}`}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
              <span className="absolute bottom-4 right-6 text-5xl sm:text-6xl font-black text-white/80 font-mono tracking-tighter drop-shadow-lg select-none">
                {block.year}
              </span>
            </div>
          );

          return (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              {block.imageOnRight ? (
                <>
                  <div className="w-full">{TextCard}</div>
                  <div className="w-full">{ImageCard}</div>
                </>
              ) : (
                <>
                  <div className="w-full order-2 md:order-1">{ImageCard}</div>
                  <div className="w-full order-1 md:order-2">{TextCard}</div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
