"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
  const lastUpdated = "August 16, 2026";

  const sections = [
    { id: "collect", title: "1. Information We Collect", icon: "fa-database" },
    { id: "usage", title: "2. How We Use Data", icon: "fa-sliders" },
    { id: "security", title: "3. Encryption & Storage", icon: "fa-shield-halved" },
    { id: "thirdparty", title: "4. Third-Party Integrations", icon: "fa-network-wired" },
    { id: "cookies", title: "5. Cookies & LocalStorage", icon: "fa-cookie-bite" },
    { id: "rights", title: "6. Your Data Rights", icon: "fa-user-gear" },
    { id: "contact", title: "7. Privacy Officer Contact", icon: "fa-envelope-open-text" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-[#0E6875] selection:text-white">
      {/* Header Banner */}
      <section className="relative pt-24 pb-16 bg-linear-to-b from-[#FAF0E9] via-[#FAF0E9]/60 to-white overflow-hidden border-b border-gray-100">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#0E6875]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F3F5] text-[#0E6875] text-xs font-extrabold border border-[#0E6875]/20 shadow-2xs mb-6">
            <i className="fa-solid fa-user-lock" />
            <span>Data Protection & Privacy Standard</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#1C2B2D] tracking-tight leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            TimeValley is committed to safeguarding your personal data, LMS progress records, and startup workspace details in accordance with global privacy standards.
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

          {/* Sticky Navigation Outline */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-[#FAF0E9]/50 border border-gray-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-extrabold text-[#1C2B2D] uppercase tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-list-ul text-[#0E6875]" />
                <span>Policy Outline</span>
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
                  href="/terms"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0E6875] hover:underline"
                >
                  <span>View Terms of Service</span>
                  <i className="fa-solid fa-arrow-right text-[10px]" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Privacy Content Body */}
          <div className="lg:col-span-8 space-y-12 text-sm text-gray-700 leading-relaxed">

            {/* Section 1 */}
            <section id="collect" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center font-bold text-lg border border-[#0E6875]/20">
                  <i className="fa-solid fa-database" />
                </div>
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">1. Information We Collect</h2>
              </div>
              <p>
                We collect information necessary to deliver our venture building curriculum, manage student accounts, and process transactions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold pt-2">
                <div className="p-3.5 bg-[#FAF0E9]/60 rounded-2xl border border-gray-200 space-y-1">
                  <span className="font-extrabold text-[#0E6875] block">Identity & Contact Data</span>
                  <p className="text-gray-500 font-normal">Full name, email address, phone number (with country code), and avatar image.</p>
                </div>
                <div className="p-3.5 bg-[#FAF0E9]/60 rounded-2xl border border-gray-200 space-y-1">
                  <span className="font-extrabold text-[#0E6875] block">Academic & Progress Data</span>
                  <p className="text-gray-500 font-normal">Completed lessons, quiz scores, assignment submissions, and certificate codes.</p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="usage" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center font-bold text-lg border border-[#0E6875]/20">
                  <i className="fa-solid fa-sliders" />
                </div>
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">2. How We Use Your Data</h2>
              </div>
              <p>Your data is used strictly for legitimate educational and operational purposes:</p>
              <ul className="list-disc pl-5 space-y-2 font-medium">
                <li>Authenticating student sessions and unlocking diploma curriculum modules.</li>
                <li>Transmitting real-time access grants and assignment notifications via WebSocket channels.</li>
                <li>Verifying course completion and generating digital certificates.</li>
                <li>Communicating cohort announcements and administrative updates.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="security" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center font-bold text-lg border border-[#0E6875]/20">
                  <i className="fa-solid fa-shield-halved" />
                </div>
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">3. Encryption & Storage Security</h2>
              </div>
              <p>
                Security is embedded into every layer of our platform architecture:
              </p>
              <ul className="list-disc pl-5 space-y-2 font-medium">
                <li><strong>Password Protection:</strong> Passwords are cryptographically salted and hashed using standard <strong>Bcrypt</strong> algorithms before database storage.</li>
                <li><strong>Token Authentication:</strong> Stateless <strong>JWT tokens</strong> govern secure requests between client and server.</li>
                <li><strong>Transport Security:</strong> All data in transit is encrypted using HTTPS/TLS encryption.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="thirdparty" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center font-bold text-lg border border-[#0E6875]/20">
                  <i className="fa-solid fa-network-wired" />
                </div>
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">4. Third-Party Integrations</h2>
              </div>
              <p>
                We integrate with trusted third-party providers for video distribution and global delivery:
              </p>
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <i className="fa-solid fa-circle-play text-[#0E6875]" />
                  <span><strong>Bunny Stream CDN:</strong> Protected video stream playback and DRM acceleration.</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <i className="fa-solid fa-cloud text-[#0E6875]" />
                  <span><strong>Cloudflare:</strong> Edge network protection, anti-DDoS, and SSL encryption.</span>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="cookies" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center font-bold text-lg border border-[#0E6875]/20">
                  <i className="fa-solid fa-cookie-bite" />
                </div>
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">5. Cookies & LocalStorage</h2>
              </div>
              <p>
                TimeValley uses browser <code className="text-[#0E6875] font-mono">localStorage</code> to maintain persistent student sessions (<code className="text-[#0E6875] font-mono">timevalley_token</code> and <code className="text-[#0E6875] font-mono">timevalley_user_session</code>). We do not use third-party tracking cookies or sell user data to advertising networks.
              </p>
            </section>

            {/* Section 6 */}
            <section id="rights" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center font-bold text-lg border border-[#0E6875]/20">
                  <i className="fa-solid fa-user-gear" />
                </div>
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">6. Your Data Rights</h2>
              </div>
              <p>You retain full rights regarding your personal information:</p>
              <ul className="list-disc pl-5 space-y-2 font-medium">
                <li><strong>Right to Inspect:</strong> Review stored profile data inside your workspace dashboard.</li>
                <li><strong>Right to Correct:</strong> Update contact info, avatar, or bio at any time.</li>
                <li><strong>Right to Erasure:</strong> Request permanent account deletion by contacting our privacy team.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="contact" className="scroll-mt-32 space-y-4 border-t border-gray-100 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center font-bold text-lg border border-[#0E6875]/20">
                  <i className="fa-solid fa-envelope-open-text" />
                </div>
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">7. Privacy Officer Contact</h2>
              </div>
              <div className="p-5 bg-[#FAF0E9]/70 border border-gray-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-[#1C2B2D] text-sm">Need Data Protection Support?</h4>
                  <p className="text-xs text-gray-500 font-medium">Contact our Data Protection Officer.</p>
                </div>
                <a
                  href="mailto:privacy@timevalley.com"
                  className="px-5 py-2.5 bg-[#0E6875] hover:bg-[#0C4E58] text-white text-xs font-extrabold rounded-2xl transition-all shadow-md shadow-[#0E6875]/20"
                >
                  Email Privacy Team
                </a>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
