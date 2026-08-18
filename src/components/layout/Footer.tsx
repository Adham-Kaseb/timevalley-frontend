"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Footer() {
  const [certCode, setCertCode] = useState("");
  const router = useRouter();

  const handleCertSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certCode.trim()) {
      router.push(`/our-certificates?serial=${encodeURIComponent(certCode.trim())}`);
    }
  };

  return (
    <footer className="bg-linear-to-b from-[#0C4E58] via-[#0E6875] to-[#0A3D45] text-white pt-16 sm:pt-20 pb-8 sm:pb-12 border-t border-white/10 relative z-10 text-xs shadow-2xl">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 pb-16 border-b border-white/15">
          {/* Column 1 & 2: Brand Info & Quick Verification Search */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block transition-transform duration-300 transform hover:scale-105">
              <img
                src="/images/logos/logo-3.png"
                alt="TimeValley Logo"
                className="h-12 sm:h-14 w-auto object-contain brightness-0 invert"
              />
            </Link>

            <p className="text-teal-100/80 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
              Business consulting agency, day-zero venture builder, and LMS platform accelerating world-class tech startups across MENA and global innovation hubs.
            </p>

            {/* Quick Certificate Verification Search Widget */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-2.5 max-w-md shadow-inner">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider">
                <i className="fa-solid fa-certificate"></i>
                <span>Quick Certificate Verification</span>
              </div>
              <form onSubmit={handleCertSearch} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter Serial Code (e.g. TV-DIP-2026-X89F2A)"
                  value={certCode}
                  onChange={(e) => setCertCode(e.target.value)}
                  className="flex-1 bg-white/15 text-white placeholder-teal-100/60 px-3.5 py-2.5 rounded-xl border border-white/20 text-xs focus:outline-none focus:border-amber-300 transition-colors font-mono"
                />
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer shrink-0 shadow-md"
                >
                  Verify
                </button>
              </form>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/share/1CGdSXTAKq/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center text-sm hover:bg-[#EDA296] hover:text-white hover:border-[#EDA296] transition-all duration-300 transform hover:scale-110 shadow-sm"
                title="Facebook"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/wael-tawfeek?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center text-sm hover:bg-[#EDA296] hover:text-white hover:border-[#EDA296] transition-all duration-300 transform hover:scale-110 shadow-sm"
                title="LinkedIn"
              >
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Column 3: Platform Navigation */}
          <div className="space-y-4">
            <h4 className="font-black text-white text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Navigation
            </h4>
            <ul className="space-y-3 text-teal-100/80 text-xs font-semibold">
              {[
                { label: "Home", href: "/" },
                { label: "Diploma (120h)", href: "/diplomas" },
                { label: "Build Your Team", href: "/#teams" },
                { label: "Community Hub", href: "/#community" },
                { label: "Consultations", href: "/consultations" },
                { label: "Our Certificates", href: "/our-certificates" },
                { label: "About TimeValley", href: "/about" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="hover:text-amber-300 transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <i className="fa-solid fa-chevron-right text-[9px] text-amber-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1"></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Tutor LMS & Venture Hub */}
          <div className="space-y-4">
            <h4 className="font-black text-white text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
              Venture Hub
            </h4>
            <ul className="space-y-3 text-teal-100/80 text-xs font-semibold">
              {[
                { label: "Course Curriculum Overview", href: "/diplomas" },
                { label: "Student Lessons Workspace", href: "/workspace" },
                { label: "Interactive Module Quizzes", href: "/diplomas?tab=lessons" },
                { label: "Digital Certificates Engine", href: "/our-certificates" },
                { label: "DIFC Ideation Accelerator", href: "/#ideation" },
                { label: "Market Research Hub", href: "/#market-research" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="hover:text-amber-300 transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <i className="fa-solid fa-chevron-right text-[9px] text-teal-300 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1"></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Enterprise Infrastructure & Trust Badges */}
          <div className="space-y-4">
            <h4 className="font-black text-white text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Enterprise Trust
            </h4>
            <div className="space-y-3 text-teal-100/80 text-xs font-semibold">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 flex items-center gap-2.5">
                <i className="fa-solid fa-[#0E6875] fa-video text-amber-300 text-sm"></i>
                <div>
                  <div className="font-bold text-white text-[11px]">Bunny Stream Protected</div>
                  <div className="text-[10px] text-teal-100/60">DRM Video Encryption 🔒</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 flex items-center gap-2.5">
                <i className="fa-solid fa-[#0E6875] fa-bolt text-teal-300 text-sm"></i>
                <div>
                  <div className="font-bold text-white text-[11px]">Cloudflare Global CDN</div>
                  <div className="text-[10px] text-teal-100/60">Edge Acceleration ⚡</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 flex items-center gap-2.5">
                <i className="fa-solid fa-[#0E6875] fa-shield-halved text-emerald-300 text-sm"></i>
                <div>
                  <div className="font-bold text-white text-[11px]">DIFC Sandbox Certified</div>
                  <div className="text-[10px] text-teal-100/60">Dubai Innovation Hub 🛡️</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-teal-100/70 font-medium">
          <div className="flex flex-wrap items-center gap-3">
            <p>© 2026 TimeValley Consulting. All rights reserved.</p>
            <span className="hidden sm:inline text-white/20">•</span>
            <Link href="/terms" className="hover:text-amber-300 transition-colors font-semibold">
              Terms of Service
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/privacy" className="hover:text-amber-300 transition-colors font-semibold">
              Privacy Policy
            </Link>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs px-4 py-2 rounded-xl border border-white/20 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <span>Back to top</span>
            <i className="fa-solid fa-arrow-up text-xs"></i>
          </button>
        </div>
      </div>
    </footer>
  );
}
