"use client";

import { useState, useRef, useEffect } from "react";

export default function CustomerFeedbackSection() {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isEgyptianDialect, setIsEgyptianDialect] = useState<Record<number, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);
  const startXRef = useRef<number>(0);

  const testimonials = [
    {
      id: 1,
      name: "Jhon Michel",
      nameEg: "جون ميشيل",
      role: "CEO, Venture Systems Inc.",
      roleEg: "الرئيس التنفيذي، شركة فينتشر للحلول الذكية",
      quoteEn:
        '"Building our smart systems startup was a major challenge, but TimeValley\'s methodology and advisory team provided the exact operational blueprint and capital leverage to accelerate our growth in record time."',
      quoteEg:
        '"تأسيس شركتنا في الأنظمة الذكية كان موضوع مش سهل خالص، بس بصراحة منهجية تايم فالي والمستشارين وقفوا جنبنا ووفروا لنا خطة شغل صح ودعم استثماري كبر شغلنا وبسرعة جداً!"',
      img: "/images/team/CEO.jpg",
    },
    {
      id: 2,
      name: "Dr. Layla Hachem",
      nameEg: "د. ليلى هاشم",
      role: "Co-Founder & Clinical Director, HealthPulse AI",
      roleEg: "المؤسس المشارك والمدير الطبي، HealthPulse AI",
      quoteEn:
        '"Navigating hospital procurement cycles used to take 9+ months. With TimeValley\'s GTM accelerator playbooks, we deployed HealthPulse AI across 45 regional healthcare hubs in record time."',
      quoteEg:
        '"دورة المبيعات للمستشفيات كانت بتاخد مننا أكتر من 9 شهور! بس مع مسرعة تايم فالي، قدرنا ندوّر ونشغّل منصتنا للذكاء الاصطناعي في 45 مركز طبي في وقت قياسي بصراحة."',
      img: "/images/team/team-3.png",
    },
    {
      id: 3,
      name: "Omar Farooq",
      nameEg: "عمر فاروق",
      role: "CTO & Co-Founder, LogiTrack SaaS",
      roleEg: "الرئيس التنفيذي للتقنية والمؤسس المشارك، LogiTrack SaaS",
      quoteEn:
        '"From day-zero co-founder matchmaking to cap table governance and Series A introductions, TimeValley provided the exact strategic leverage we needed to scale successfully."',
      quoteEg:
        '"من أول يوم والربط بين الشركاء المؤسسين، لحد تنظيم جدول الملكية والربط مع مستثمري الجولة الأولى، تايم فالي إدتنا الدعم الاستراتيجي اللي كنا محتاجينه بالظبط عشان نكبر وننطلق!"',
      img: "/images/team/team-4.png",
    },
  ];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const toggleTranslation = (idx: number) => {
    setIsEgyptianDialect((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Drag / Swipe Gesture Handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startXRef.current;
    setDragOffset(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset < -50) {
      handleNext();
    } else if (dragOffset > 50) {
      handlePrev();
    }

    setDragOffset(0);
  };

  // 5-Second Autoplay Slider Timer
  useEffect(() => {
    if (isPaused || isDragging) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, isDragging, testimonials.length]);

  const current = testimonials[index];
  const isEgActive = isEgyptianDialect[index] || false;

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="py-8 md:py-12 relative select-none overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Dark Teal Banner with /images/feedback_banner.png Background */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 p-8 sm:p-12 pb-32 sm:pb-36">
          
          {/* Background Feedback Banner Image Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src="/images/feedback_banner.png"
              alt="Feedback Banner Background"
              className="w-full h-full object-cover object-center opacity-40"
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#0E6875]/95 via-[#118494]/92 to-[#0E6875]/95" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            {/* Top Left Quote Mark & Headline */}
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl text-[#EDA296] font-serif leading-none font-extrabold select-none">
                ”
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Our Customers Feedback
                </h2>
                
                {/* Carousel Controls (< >) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center font-bold text-xs transition-all border border-white/20 cursor-pointer"
                    aria-label="Previous testimonial"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center font-bold text-xs transition-all border border-white/20 cursor-pointer"
                    aria-label="Next testimonial"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Top Right Corner Icon */}
            <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center text-xs border border-white/15 shrink-0">
              <i className="fa-solid fa-quote-left"></i>
            </div>
          </div>

        </div>

        {/* Overlapping Content Row Container */}
        <div className="-mt-24 sm:-mt-28 relative z-20 px-2 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Photo Avatar Card (Overlapping Banner - Parallax Swipe Animated) */}
            <div className="md:col-span-4 flex justify-center">
              <div
                key={`photo-${index}`}
                onTouchStart={(e) => handleStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleMove(e.touches[0].clientX)}
                onTouchEnd={handleEnd}
                onMouseDown={(e) => handleStart(e.clientX)}
                onMouseMove={(e) => handleMove(e.clientX)}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                className="w-60 sm:w-68 aspect-3/4 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white relative animate-in fade-in zoom-in-95 duration-400 ease-out cursor-grab active:cursor-grabbing touch-pan-y"
                style={{
                  transform: `translateX(${dragOffset * 0.35}px)`,
                  transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <img
                  src={current.img}
                  alt={current.name}
                  className="w-full h-full object-cover transition-transform duration-500 pointer-events-none"
                />
              </div>
            </div>

            {/* Right Testimonial Quote Card (Draggable / Swipeable) */}
            <div className="md:col-span-8">
              <div
                key={`quote-${index}`}
                onTouchStart={(e) => handleStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleMove(e.touches[0].clientX)}
                onTouchEnd={handleEnd}
                onMouseDown={(e) => handleStart(e.clientX)}
                onMouseMove={(e) => handleMove(e.clientX)}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                className="bg-[#FAF0E9]/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border border-gray-200/80 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 cursor-grab active:cursor-grabbing touch-pan-y"
                style={{
                  transform: `translateX(${dragOffset}px)`,
                  transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/60 pb-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#0E6875] tracking-tight">
                      {isEgActive ? current.nameEg : current.name}
                    </h3>
                    <div className="text-xs font-bold text-gray-500 tracking-wider mt-0.5">
                      {isEgActive ? current.roleEg : current.role}
                    </div>
                  </div>

                  {/* Optional Egyptian Arabic Translation Icon Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTranslation(index);
                    }}
                    className={`w-10 h-10 rounded-2xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center border shrink-0 ${
                      isEgActive
                        ? "bg-[#0E6875] text-white border-[#0E6875] shadow-md shadow-[#0E6875]/25 scale-105"
                        : "bg-white text-[#0E6875] border-[#0E6875]/30 hover:bg-[#E6F3F5] hover:border-[#0E6875]/60"
                    }`}
                    title={isEgActive ? "Egyptian Dialect (Active) - Click to view English" : "Translate to Egyptian Arabic (العامية المصرية)"}
                    aria-label="Toggle Egyptian Arabic translation"
                  >
                    <span className="text-base select-none">🇪🇬</span>
                  </button>
                </div>

                {/* 5 Rating Stars */}
                <div className="flex items-center gap-1.5 text-[#EDA296] text-base pt-1">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>

                {/* Quote Text */}
                <p
                  className={`text-gray-800 text-sm sm:text-base leading-relaxed font-semibold min-h-24 py-1 select-none transition-all duration-300 ${
                    isEgActive ? "text-right font-medium dir-rtl" : "text-left font-semibold"
                  }`}
                  dir={isEgActive ? "rtl" : "ltr"}
                >
                  {isEgActive ? current.quoteEg : current.quoteEn}
                </p>

                {/* Bottom Row: Story Pill & Slide Dots */}
                <div className="pt-4 border-t border-gray-200/80 flex items-center justify-between">
                  <span className="bg-[#E6F3F5] border border-[#0E6875]/20 text-[#0E6875] text-xs font-black px-4 py-1.5 rounded-full shadow-xs">
                    {isEgActive ? `قصة نجاح ${index + 1} من ${testimonials.length}` : `Story ${index + 1} of ${testimonials.length}`}
                  </span>

                  <div className="flex items-center gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-2.5 rounded-full transition-all cursor-pointer ${
                          i === index ? "w-7 bg-[#EDA296]" : "w-2.5 bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`Go to story ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
