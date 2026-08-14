"use client";

import { useState } from "react";
import { testimonials } from "@/utils/mockData";

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-16 md:py-24 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="bg-[#EDA296]/20 text-[#1A1A1A] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full">
            قصص النجاح
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
            ماذا يقول المؤسسون عن TimeValley؟
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="glass-card-glow p-8 sm:p-12 relative overflow-hidden">
          {/* Quote Icon */}
          <div className="text-5xl text-[#EDA296] font-serif leading-none mb-6 select-none">
            “
          </div>

          <p className="text-lg sm:text-2xl text-[#1A1A1A] font-medium leading-relaxed mb-8 min-h-30">
            {current.quote}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#0E6875] text-white flex items-center justify-center font-bold text-2xl shadow-md">
                {current.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#1A1A1A]">
                  {current.name}
                </h4>
                <p className="text-sm font-semibold text-[#0E6875]">
                  {current.role}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <span className="bg-[#E6F3F5] text-[#0E6875] text-xs font-bold px-3 py-1 rounded-full">
                قصة {currentIndex + 1} من {testimonials.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-[#0E6875] hover:text-white flex items-center justify-center font-bold text-lg transition-colors shadow-sm"
                  aria-label="القصة السابقة"
                >
                  →
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-[#0E6875] hover:text-white flex items-center justify-center font-bold text-lg transition-colors shadow-sm"
                  aria-label="القصة التالية"
                >
                  ←
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
