"use client";

export default function TopBar() {
  return (
    <div className="bg-[#0E6875] text-white text-xs py-2 px-4 border-b border-white/10 hidden md:block relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left side: Live Announcement Badge & Dynamic Telemetry Ticker */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="bg-white/15 border border-white/25 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap shrink-0">
            <span className="text-[#EDA296]">⚡</span> ANNOUNCEMENT
          </span>
          <div className="flex items-center gap-2 font-medium text-white/90 truncate min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#EDA296] animate-pulse shrink-0 shadow-[0_0_8px_#EDA296]"></span>
            <span className="truncate">AI Cohort Matcher Engine v3.4 active (TimeValley Platform)...</span>
          </div>
        </div>

        {/* Right side: Contact Details & Social Media Links */}
        <div className="flex items-center gap-3 lg:gap-6 font-semibold text-white/90 shrink-0">
          <div className="flex items-center gap-3 lg:gap-5 whitespace-nowrap">
            <a href="tel:+201000000000" className="flex items-center gap-1.5 hover:text-[#EDA296] transition-colors whitespace-nowrap">
              <span className="text-[#EDA296]">📞</span>
              <span>+20 100 000 0000</span>
            </a>
            <a href="mailto:contact@timevalley.com" className="hidden lg:flex items-center gap-1.5 hover:text-[#EDA296] transition-colors whitespace-nowrap">
              <span className="text-[#EDA296]">✉</span>
              <span>contact@timevalley.com</span>
            </a>
          </div>

          <div className="w-px h-4 bg-white/25 hidden lg:block"></div>

          <div className="flex items-center gap-2 shrink-0">
            <a href="#" className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#EDA296] flex items-center justify-center text-white text-xs transition-all hover:-translate-y-0.5" title="LinkedIn">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="#" className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#EDA296] flex items-center justify-center text-white text-xs transition-all hover:-translate-y-0.5" title="Twitter">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="#" className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#EDA296] flex items-center justify-center text-white text-xs transition-all hover:-translate-y-0.5" title="YouTube">
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
