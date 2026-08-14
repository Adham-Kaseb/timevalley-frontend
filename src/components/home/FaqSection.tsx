"use client";

import { useState } from "react";
import { faqs } from "@/utils/mockData";

interface FaqSectionProps {
  onOpenContactModal?: () => void;
}

export default function FaqSection({ onOpenContactModal }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-white/60 border-t border-gray-200/80 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="bg-[#E6F3F5] text-[#0E6875] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full">
            الأسئلة الشائعة
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
            كل ما تحتاجه لمعرفته حول المنصة والدبلومة
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="glass-card overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-right p-6 flex items-center justify-between gap-4 font-bold text-lg text-[#1A1A1A] hover:text-[#0E6875] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`w-8 h-8 rounded-full bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center text-lg font-bold transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-base text-[#6B7280] leading-relaxed border-t border-gray-100 pt-4 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Advisory Box */}
        <div className="bg-[#0E6875] text-white rounded-2xl p-8 text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-right space-y-1">
            <h3 className="text-2xl font-bold">لديك استفسار خاص بشركتك الناشئة؟</h3>
            <p className="text-sm text-gray-200">
              تحدث مباشرة مع مستشاري استوديو المشاريع للحصول على توجيه مخصص.
            </p>
          </div>
          <button
            onClick={onOpenContactModal}
            className="bg-[#EDA296] hover:bg-[#DB8A7D] text-[#1A1A1A] font-extrabold px-6 py-3 rounded-xl shadow hover:shadow-lg transition-all text-base whitespace-nowrap"
          >
            احجز جلسة استشارية مجانية
          </button>
        </div>

      </div>
    </section>
  );
}
