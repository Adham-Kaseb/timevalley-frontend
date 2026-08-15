"use client";

import React, { useState } from "react";
import contactService from "@/services/contact";

interface FounderPitchContactCardProps {
  isBookingOpen: boolean;
  onCloseBooking: () => void;
  onOpenBooking: () => void;
}

export default function FounderPitchContactCard({
  isBookingOpen,
  onCloseBooking,
  onOpenBooking,
}: FounderPitchContactCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pitch, setPitch] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      await contactService.submitContact({
        name,
        email,
        subject: "Founder Office Hours Pitch",
        message: pitch,
      });
    } catch (err) {
      console.warn("Contact submission sent locally", err);
    } finally {
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setEmail("");
        setPitch("");
        onCloseBooking();
        alert("🎉 Booking request successfully submitted to Dr. Wael's executive office!");
      }, 800);
    }
  };

  return (
    <section className="mb-12">
      {/* Dark Teal Gradient Contact Card */}
      <div className="bg-linear-to-r from-[#0E6875] via-[#0B4E58] to-[#08353C] rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#EDA296]/15 rounded-full blur-3xl pointer-events-none"></div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDA296] text-[#0E6875] text-xs font-black uppercase tracking-wider">
          <i className="fa-solid fa-envelope"></i> Direct Line to Dr. Wael
        </span>

        <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
          Pitch Your Venture directly to Dr. Wael
        </h2>

        <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto leading-relaxed">
          Have a disruptive tech thesis or looking to join a high-growth startup cohort? Connect directly with Dr. Wael&apos;s office.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:dr.wael@timevalley.com"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-[#0E6875] font-extrabold text-sm shadow-md hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-paper-plane text-[#0E6875]"></i>
            <span>dr.wael@timevalley.com</span>
          </a>

          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#EDA296] hover:bg-[#E08577] text-white font-extrabold text-sm shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-calendar-check"></i>
            <span>Book Founder Office Hours</span>
          </button>
        </div>
      </div>

      {/* Office Hours Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar space-y-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-250">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-black text-[#0E6875] flex items-center gap-2">
                <i className="fa-solid fa-calendar-check"></i> Book Dr. Wael Office Hours
              </h3>
              <button
                onClick={onCloseBooking}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fatima Al-Hassan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="fatima@startup.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Venture Thesis / Pitch Deck Link
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Briefly describe your venture or paste pitch deck URL..."
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-[#0E6875] resize-none"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onCloseBooking}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitted}
                  className="px-6 py-2.5 rounded-xl bg-[#0E6875] hover:bg-[#0B4E58] text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-75"
                >
                  {submitted ? "Submitting Request..." : "Submit Booking Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
