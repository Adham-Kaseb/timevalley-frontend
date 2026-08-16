"use client";

import { useState } from "react";
import apiClient from "@/lib/axios";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await apiClient.post("/contact/newsletter", { email: email.trim() });
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setEmail("");
      }, 3000);
    } catch (err) {
      console.warn("Newsletter subscription error", err);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setEmail("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-6 md:py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Banner with CEO Background Image & Dark Teal Overlay */}
        <div className="relative rounded-[28px] overflow-hidden shadow-2xl border border-white/10 p-5 sm:p-10 lg:p-14 min-h-80 flex items-center">
          
          {/* Background CEO Photo Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/team/CEO.jpg"
              alt="TimeValley CEO Background"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#0E6875]/96 via-[#0E6875]/94 to-[#07363D]/96" />
          </div>

          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Title */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-snug tracking-tight">
                Subscribe and Stay in Touch for{" "}
                <span className="text-[#EDA296]">TimeValley</span> Updates &{" "}
                <span className="text-[#71D5E4]">Resources</span>
              </h2>
            </div>

            {/* Right White Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="bg-white text-gray-800 rounded-3xl p-5 sm:p-8 shadow-2xl w-full max-w-full lg:max-w-md space-y-4 sm:space-y-5 border border-gray-100">
                
                <h3 className="text-[#0E6875] font-extrabold text-base sm:text-lg tracking-tight text-center sm:text-left">
                  Don't worry. We won't spam you !
                </h3>

                <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="flex-1 min-w-0 bg-[#FAF0E9]/70 border border-gray-200 text-gray-800 text-sm rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0E6875] focus:bg-white placeholder-gray-400 font-medium transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#0E6875] hover:bg-[#0B4E58] text-white w-12 h-12 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-60"
                    aria-label="Subscribe"
                  >
                    {loading ? (
                      <i className="fa-solid fa-spinner animate-spin text-base text-white"></i>
                    ) : sent ? (
                      <i className="fa-solid fa-check text-lg text-white"></i>
                    ) : (
                      <i className="fa-solid fa-paper-plane text-base text-white"></i>
                    )}
                  </button>
                </form>

                {/* Social Buttons */}
                <div className="flex items-center gap-3 pt-1">
                  <a
                    href="https://www.facebook.com/share/1CGdSXTAKq/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-[#0E6875] text-white flex items-center justify-center font-bold text-sm hover:bg-[#0B4E58] transition-all shadow-xs"
                    title="Facebook"
                  >
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/wael-tawfeek?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-[#0E6875] text-white flex items-center justify-center font-bold text-sm hover:bg-[#0B4E58] transition-all shadow-xs"
                    title="LinkedIn"
                  >
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
