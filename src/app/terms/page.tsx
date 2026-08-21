"use client";

import Link from "next/link";

export default function TermsOfServicePage() {
  const lastUpdated = "August 16, 2026";

  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms", icon: "fa-file-signature" },
    { id: "services", title: "2. Venture Cohort & Services", icon: "fa-graduation-cap" },
    { id: "ip", title: "3. Intellectual Property Rights", icon: "fa-copyright" },
    { id: "accounts", title: "4. User Accounts & Security", icon: "fa-user-shield" },
    { id: "payments", title: "5. Fees, Payments & Refunds", icon: "fa-credit-card" },
    { id: "disclaimer", title: "6. Limitation of Liability", icon: "fa-triangle-exclamation" },
    { id: "termination", title: "7. Termination of Service", icon: "fa-ban" },
    { id: "governing", title: "8. Governing Law & Contact", icon: "fa-gavel" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-[#0E6875] selection:text-white">
      {/* Header Banner */}
      <section className="relative pt-24 pb-16 bg-linear-to-b from-[#FAF0E9] via-[#FAF0E9]/60 to-white overflow-hidden border-b border-gray-100">
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#0E6875]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F3F5] text-[#0E6875] text-xs font-extrabold border border-[#0E6875]/20 shadow-2xs mb-6">
            <i className="fa-solid fa-scale-balanced" />
            <span>TimeValley Legal Documentation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#1C2B2D] tracking-tight leading-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            Please read these terms carefully before enrolling in our 120-Hour Venture Building Cohort, accessing our LMS, or using TimeValley consulting services.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-500 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-200 shadow-2xs">
            <i className="fa-solid fa-clock text-[#0E6875]" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Sticky Quick Index Navigation Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-[#FAF0E9]/50 border border-gray-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-extrabold text-[#1C2B2D] uppercase tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-list-ul text-[#0E6875]" />
                <span>Document Outline</span>
              </h3>
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:text-[#0E6875] hover:bg-[#E6F3F5] transition-all"
                  >
                    <i className={`fa-solid ${sec.icon} text-gray-400 text-xs w-4`} />
                    <span className="truncate">{sec.title}</span>
                  </a>
                ))}
              </nav>

              <div className="pt-3 border-t border-gray-200/60 text-center">
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0E6875] hover:underline"
                >
                  <span>View Privacy Policy</span>
                  <i className="fa-solid fa-arrow-right text-[10px]" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Terms Content Body */}
          <div className="lg:col-span-8 space-y-12 text-sm text-gray-700 leading-relaxed">

            {/* Section 1 */}
            <section id="acceptance" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center font-bold text-lg border border-[#0E6875]/20">
                  <i className="fa-solid fa-file-signature" />
                </div>
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">1. Acceptance of Terms</h2>
              </div>
              <p>
                By creating an account, accessing the TimeValley website, participating in the 120-Hour Venture Building Cohort, or using any associated LMS materials, video streams, or consulting services, you agree to be bound by these Terms of Service.
              </p>
              <p>
                If you do not agree to these terms in full, you must not access or use our services. TimeValley reserves the right to amend these terms at any time by updating this document.
              </p>
            </section>

            {/* Section 2 */}
            <section id="services" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center font-bold text-lg border border-[#0E6875]/20">
                  <i className="fa-solid fa-graduation-cap" />
                </div>
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">2. Venture Cohort & Services</h2>
              </div>
              <p>
                TimeValley operates as a day-zero venture builder and business consulting agency. Our LMS platform delivers structured curriculum modules, video streams, digital resource toolkits, and student assessments.
              </p>
              <ul className="list-disc pl-5 space-y-2 font-medium">
                <li>Participation in the Venture Architect Diploma requires active enrollment.</li>
                <li>Digital Certificates are issued upon successful completion of required module quizzes and assignments.</li>
                <li>Course materials may be updated periodically to maintain startup ecosystem standards.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="ip" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center font-bold text-lg border border-[#0E6875]/20">
                  <i className="fa-solid fa-copyright" />
                </div>
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">3. Intellectual Property Rights</h2>
              </div>
              <p>
                All curriculum materials, video streams (served via Bunny Stream CDN), frameworks, venture building toolkits, graphics, logos, and code hosted on TimeValley are the exclusive intellectual property of TimeValley Consulting.
              </p>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-semibold space-y-1">
                <p className="font-extrabold flex items-center gap-1.5">
                  <i className="fa-solid fa-shield-cat" />
                  <span>Strict Content Protection:</span>
                </p>
                <p>
                  Screen recording, downloading, selling, or distributing protected video streams or curriculum materials without explicit written consent is strictly prohibited and subject to legal action.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="accounts" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center font-bold text-lg border border-[#0E6875]/20">
                  <i className="fa-solid fa-user-shield" />
                </div>
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">4. User Accounts & Security</h2>
              </div>
              <p>
                When registering an account, you must provide accurate, complete, and current information (including valid full name, email address, and phone number).
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials (including passwords hashed via Bcrypt and active JWT tokens). You accept full responsibility for all activities that occur under your account.
              </p>
            </section>

            {/* Section 5 */}
            <section id="payments" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center font-bold text-lg border border-[#0E6875]/20">
                  <i className="fa-solid fa-credit-card" />
                </div>
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">5. Fees, Payments & Refunds</h2>
              </div>
              <p>
                Enrollment in the 120-Hour Venture Building Diploma incurs a standard fee of <strong>5,000 LE</strong> (or applicable promotional price via verified discount coupons).
              </p>
              <ul className="list-disc pl-5 space-y-2 font-medium">
                <li>Payments are processed securely via authorized payment gateways.</li>
                <li>Coupon codes are valid for single redemption per eligible account unless specified otherwise.</li>
                <li>Refund requests are evaluated within 7 business days of initial enrollment prior to module access key activation.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="disclaimer" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center font-bold text-lg border border-[#0E6875]/20">
                  <i className="fa-solid fa-triangle-exclamation" />
                </div>
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">6. Limitation of Liability</h2>
              </div>
              <p>
                TimeValley provides business advisory services and venture building frameworks for educational and acceleration purposes. While we match founders with recruiting co-founders and pre-seed capital opportunities, TimeValley does not guarantee equity financing, venture valuation metrics, or commercial outcome.
              </p>
            </section>

            {/* Section 7 */}
            <section id="termination" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center font-bold text-lg border border-[#0E6875]/20">
                  <i className="fa-solid fa-ban" />
                </div>
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">7. Termination of Service</h2>
              </div>
              <p>
                TimeValley reserves the right to suspend or terminate account access immediately, without prior notice, if a user breaches any provision of these Terms of Service or engages in unauthorized content distribution.
              </p>
            </section>

            {/* Section 8 */}
            <section id="governing" className="scroll-mt-32 space-y-4 border-t border-gray-100 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center font-bold text-lg border border-[#0E6875]/20">
                  <i className="fa-solid fa-gavel" />
                </div>
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">8. Governing Law & Contact</h2>
              </div>
              <p>
                These Terms shall be governed by and construed in accordance with international digital business and educational standards.
              </p>
              <div className="p-5 bg-[#FAF0E9]/70 border border-gray-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-[#1C2B2D] text-sm">Have Questions Regarding Our Terms?</h4>
                  <p className="text-xs text-gray-500 font-medium">Reach out to our legal and support team.</p>
                </div>
                <a
                  href="mailto:support@timevalley.com"
                  className="px-5 py-2.5 bg-[#0E6875] hover:bg-[#0C4E58] text-white text-xs font-extrabold rounded-2xl transition-all shadow-md shadow-[#0E6875]/20"
                >
                  Contact Support
                </a>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
