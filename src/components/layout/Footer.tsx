"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#FAF0E9] text-gray-700 pt-16 pb-12 border-t border-gray-200/80 relative z-10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Desktop Brand Logo */}
            <Link href="/" className="inline-block">
              <img
                src="/images/logos/logo-3.png"
                alt="TimeValley Logo"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </Link>

            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
              Business consulting agency, day-zero venture builder, and LMS platform accelerating world-class tech startups.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-[#0E6875] flex items-center justify-center font-bold text-xs hover:bg-[#0E6875] hover:text-white hover:border-[#0E6875] transition-all shadow-2xs"
                title="Facebook"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-[#0E6875] flex items-center justify-center font-bold text-xs hover:bg-[#0E6875] hover:text-white hover:border-[#0E6875] transition-all shadow-2xs"
                title="Twitter"
              >
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-[#0E6875] flex items-center justify-center font-bold text-xs hover:bg-[#0E6875] hover:text-white hover:border-[#0E6875] transition-all shadow-2xs"
                title="LinkedIn"
              >
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-[#0E6875] flex items-center justify-center font-bold text-xs hover:bg-[#0E6875] hover:text-white hover:border-[#0E6875] transition-all shadow-2xs"
                title="Instagram"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>

          </div>

          {/* Navigation Column */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm tracking-tight">Navigation</h4>
            <ul className="space-y-2.5 text-gray-500 text-xs font-semibold">
              <li><Link href="/" className="hover:text-[#0E6875] transition-colors">Home</Link></li>
              <li><Link href="/diplomas" className="hover:text-[#0E6875] transition-colors">Diploma (120h)</Link></li>
              <li><Link href="#teams" className="hover:text-[#0E6875] transition-colors">Build Your Team</Link></li>
              <li><Link href="#community" className="hover:text-[#0E6875] transition-colors">Community</Link></li>
              <li><Link href="#about" className="hover:text-[#0E6875] transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Tutor LMS Platform Column */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm tracking-tight">Tutor LMS Platform</h4>
            <ul className="space-y-2.5 text-gray-500 text-xs font-semibold">
              <li><Link href="/diplomas" className="hover:text-[#0E6875] transition-colors">Course Overview</Link></li>
              <li><Link href="/diplomas" className="hover:text-[#0E6875] transition-colors">Lessons Workspace</Link></li>
              <li><Link href="/diplomas" className="hover:text-[#0E6875] transition-colors">Module Quizzes</Link></li>
              <li><Link href="/diplomas" className="hover:text-[#0E6875] transition-colors">Digital Certificates</Link></li>
            </ul>
          </div>

          {/* Integrations & CDN Column */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm tracking-tight">Integrations & CDN</h4>
            <ul className="space-y-2.5 text-gray-500 text-xs font-semibold">
              <li><span className="hover:text-[#0E6875] transition-colors cursor-pointer">Bunny Stream Protected Video</span></li>
              <li><span className="hover:text-[#0E6875] transition-colors cursor-pointer">Cloudflare CDN Acceleration</span></li>
              <li><span className="hover:text-[#0E6875] transition-colors cursor-pointer">WooCommerce Payments</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <div className="flex flex-wrap items-center gap-4">
            <p>© 2026 TimeValley Consulting. All rights reserved.</p>
            <span className="hidden sm:inline text-gray-300">•</span>
            <Link href="/terms" className="hover:text-[#0E6875] font-semibold transition-colors">
              Terms of Service
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/privacy" className="hover:text-[#0E6875] font-semibold transition-colors">
              Privacy Policy
            </Link>
          </div>

          <div className="flex items-center gap-2 bg-[#E6F3F5] text-[#0E6875] px-3.5 py-1.5 rounded-full font-extrabold text-xs border border-[#0E6875]/20 shadow-2xs">
            <i className="fa-solid fa-shield-halved text-xs"></i>
            <span>TimeValley Brand System Active</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
