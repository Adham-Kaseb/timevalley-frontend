"use client";

import React from "react";

export default function AboutHeroSection() {
  const features = [
    {
      icon: "fa-solid fa-chart-pie",
      title: "Venture Growth & Strategy",
      desc: "Data-driven GTM scaling, TAM expansion, and unit economics optimization built for venture scale.",
    },
    {
      icon: "fa-solid fa-layer-group",
      title: "Product Acceleration & LMS",
      desc: "Applied 120h Tutor LMS curriculum covering product-market fit, cap table math, and engineering execution.",
    },
    {
      icon: "fa-solid fa-bullhorn",
      title: "Venture Branding & Pitch Architecture",
      desc: "Refining founder narrative, pitch deck storytelling, and investor readiness for Series A stage.",
    },
  ];

  return (
    <section className="mb-12 bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Text & Features */}
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E6875]/10 text-[#0E6875] text-xs font-bold uppercase tracking-wider">
            <i className="fa-solid fa-building-flag"></i> About TimeValley
          </span>

          <h1 className="text-2xl sm:text-4xl font-black text-[#1C2B2D] leading-tight">
            Accelerate Your <span className="text-[#EDA296]">Venture</span> & Scale With{" "}
            <span className="text-[#0E6875]">TimeValley</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
            TimeValley is a day-zero venture builder, business consulting agency, and LMS platform accelerating tech founders across global innovation hubs. We transform raw entrepreneurial ambition into market-leading tech companies.
          </p>

          {/* 3 Feature Items */}
          <div className="space-y-4 pt-2">
            {features.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-[#FAF0E9] border border-[#EDA296]/40 text-[#0E6875] flex items-center justify-center text-lg shrink-0">
                  <i className={item.icon}></i>
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#1C2B2D] mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Arch Frame CEO Image */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm">
            <div className="rounded-t-[140px] rounded-b-3xl border-4 border-white shadow-2xl overflow-hidden bg-gray-100 aspect-3/4 relative">
              <img
                src="/images/team/CEO.jpg"
                alt="Dr. Wael - TimeValley Founder & CEO"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6 text-white text-left space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#EDA296]">
                  Founder & Managing Partner
                </span>
                <h3 className="text-xl font-black text-white">
                  Dr. Wael
                </h3>
                <p className="text-xs text-gray-200 font-medium leading-tight">
                  Day-Zero Venture Studio • Riyadh, Dubai, Cairo & London
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
