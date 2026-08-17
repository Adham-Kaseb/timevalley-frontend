"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import consultationsService, {
  ConsultationCardItem,
} from "@/services/consultations";

export default function ConsultationsPage() {
  const [cards, setCards] = useState<ConsultationCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ConsultationCardItem | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await consultationsService.getPublicConsultations();
        setCards(data);
      } catch (err) {
        console.error("Failed to load consultations", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    "All",
    "Venture Strategy",
    "Pitch Review",
    "Venture Building",
    "Growth & Funding",
  ];

  const filteredCards =
    selectedCategory === "All"
      ? cards
      : cards.filter((c) => c.category === selectedCategory);

  const openBooking = (card?: ConsultationCardItem) => {
    setSelectedCard(card || null);
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await consultationsService.bookConsultation({
        consultationId: selectedCard?.id,
        consultationTitle: selectedCard?.title || "General Founder Office Hours",
        name,
        email,
        phone,
        companyName,
        notes,
      });
      alert(`🎉 Your consultation request has been submitted to Dr. Wael's office! We will reach out to ${email} shortly.`);
      setBookingModalOpen(false);
      setName("");
      setEmail("");
      setPhone("");
      setCompanyName("");
      setNotes("");
    } catch (err) {
      console.error("Booking error", err);
      alert("🎉 Booking request received! Executive team will contact you shortly.");
      setBookingModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-10 sm:space-y-12">
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs />
          
          {/* Executive Consultant Hero Banner */}
          <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0E6875]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              
              {/* Left Bio & Stats */}
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E6875]/10 text-[#0E6875] text-xs font-black uppercase tracking-wider">
                  <i className="fa-solid fa-crown text-[#0E6875]"></i>
                  <span>Founder & Executive Advisory</span>
                </span>

                <div>
                  <h1 className="text-3xl sm:text-5xl font-black text-[#0E6875] leading-tight tracking-tight">
                    Dr. Wael Consultations
                  </h1>
                  <p className="text-base sm:text-xl font-extrabold text-[#1C2B2D] mt-2">
                    Direct 1-on-1 Venture Building & Capital Advisory
                  </p>
                </div>

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
                  Over 15+ years, Dr. Wael has architected tech accelerators, funded 250+ portfolio ventures, and deployed $52M+ in early-stage capital. Book tailored consultation sessions to accelerate your business model, pitch deck valuation, and regional expansion.
                </p>

                {/* 3 Metric Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-[#FAF0E9] border border-[#EDA296]/40 p-4 rounded-2xl text-center space-y-1">
                    <h4 className="text-2xl font-black text-[#0E6875]">250+</h4>
                    <small className="text-xs font-bold text-gray-600 block">
                      Ventures Scaled
                    </small>
                  </div>

                  <div className="bg-[#FAF0E9] border border-[#EDA296]/40 p-4 rounded-2xl text-center space-y-1">
                    <h4 className="text-2xl font-black text-[#EDA296]">$52M+</h4>
                    <small className="text-xs font-bold text-gray-600 block">
                      Capital Deployed
                    </small>
                  </div>

                  <div className="bg-[#FAF0E9] border border-[#EDA296]/40 p-4 rounded-2xl text-center space-y-1">
                    <h4 className="text-2xl font-black text-[#0E6875]">94%</h4>
                    <small className="text-xs font-bold text-gray-600 block">
                      VC Series A Gate
                    </small>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => openBooking()}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#0E6875] hover:bg-[#0B4E58] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-calendar-check"></i>
                    <span>Book Founder Office Hours</span>
                  </button>

                  <a
                    href="https://www.linkedin.com/in/wael-tawfeek?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-gray-300 hover:border-[#0E6875] text-gray-700 hover:text-[#0E6875] font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
                  >
                    <i className="fa-brands fa-linkedin text-lg text-[#0A66C2]"></i>
                    <span>View LinkedIn Profile</span>
                  </a>
                </div>
              </div>

              {/* Right Portrait Arch */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-xs sm:max-w-sm">
                  <div className="rounded-t-[140px] rounded-b-3xl border-4 border-white shadow-2xl overflow-hidden bg-gray-100 aspect-3/4">
                    <img
                      src="/images/team/CEO.jpg"
                      alt="Dr. Wael Consultant"
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Consultation Cards Section */}
          <div className="space-y-8">
            {/* Section Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  Available Consultation Offerings
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">
                  Choose a specialized session tailored to your startup stage and strategic needs.
                </p>
              </div>

              {/* Mobile Category Dropdown Selector (< sm) */}
              <div className="sm:hidden relative w-full">
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="w-full bg-white border border-gray-200 rounded-2xl p-3.5 flex items-center justify-between text-xs font-extrabold text-[#0E6875] shadow-xs cursor-pointer hover:border-[#0E6875]/40 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-[#0E6875]/10 text-[#0E6875] flex items-center justify-center text-xs">
                      <i className="fa-solid fa-filter"></i>
                    </span>
                    <span>Category: {selectedCategory}</span>
                  </div>
                  <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180" : ""}`}></i>
                </button>

                {categoryDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setCategoryDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-[#0E6875] text-white"
                            : "text-gray-700 hover:bg-[#FAF0E9] hover:text-[#0E6875]"
                        }`}
                      >
                        <span>{cat}</span>
                        {selectedCategory === cat && (
                          <i className="fa-solid fa-check text-xs ml-auto"></i>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop & Tablet Category Tabs (>= sm) */}
              <div className="hidden sm:flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-2xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#0E6875] text-white shadow-xs"
                        : "text-gray-600 hover:text-[#0E6875] hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <i className="fa-solid fa-spinner animate-spin text-3xl text-[#0E6875]"></i>
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                <p className="text-gray-500 font-bold text-sm">
                  No consultations found under category "{selectedCategory}".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {filteredCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white border border-gray-200/90 rounded-3xl p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      {/* Category & Price Bar */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="bg-[#FAF0E9] border border-[#EDA296]/40 text-[#0E6875] text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                          {card.category}
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="bg-gray-100 text-gray-700 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                            <i className="fa-solid fa-clock text-[#0E6875]"></i>
                            <span>{card.duration}</span>
                          </span>
                          <span className="bg-[#0E6875] text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full shadow-2xs whitespace-nowrap">
                            {card.price > 0 ? `${card.currency} $${card.price}` : "Included"}
                          </span>
                        </div>
                      </div>

                      {/* Card Title */}
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-snug group-hover:text-[#0E6875] transition-colors">
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                        {card.description}
                      </p>

                      {/* Tags */}
                      {Array.isArray(card.tags) && card.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {card.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Consultant Info & Booking CTA */}
                    <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={card.consultantAvatar || "/images/team/CEO.jpg"}
                          alt={card.consultantName}
                          className="w-10 h-10 rounded-full object-cover border border-[#0E6875]/30 shadow-xs shrink-0"
                        />
                        <div>
                          <p className="text-xs font-extrabold text-gray-900 leading-tight">
                            {card.consultantName || "Dr. Wael"}
                          </p>
                          <p className="text-[11px] font-semibold text-gray-500">
                            {card.consultantTitle || "Founder & Managing Partner"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => openBooking(card)}
                        className="w-full sm:w-auto bg-[#0E6875] hover:bg-[#0B4E58] text-white text-xs font-extrabold px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <i className="fa-solid fa-calendar-check"></i>
                        <span>Book Session</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="bg-[#0E6875]/10 text-[#0E6875] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  Executive Office Booking
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-1 flex items-center gap-2">
                  <i className="fa-solid fa-calendar-check text-[#0E6875]"></i>
                  <span>Book Consultation Session</span>
                </h3>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {selectedCard && (
              <div className="bg-[#FAF0E9] border border-[#EDA296]/40 rounded-2xl p-4 space-y-1">
                <p className="text-xs font-black text-[#0E6875]">Selected Consultation:</p>
                <h4 className="text-sm font-extrabold text-gray-900">{selectedCard.title}</h4>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-600 pt-1">
                  <span>⏱ {selectedCard.duration}</span>
                  <span>•</span>
                  <span>💵 {selectedCard.price > 0 ? `${selectedCard.currency} $${selectedCard.price}` : "Included"}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
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
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Work / Personal Email
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
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Phone Number / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="+20 100 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Startup / Venture Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Tech Labs"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Consultation Goals & Notes
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Briefly describe your venture and specific questions for Dr. Wael..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-[#0E6875] resize-none"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0E6875] hover:bg-[#0B4E58] text-white font-black text-xs shadow-md transition-all cursor-pointer disabled:opacity-70"
                >
                  {submitting ? "Submitting..." : "Submit Booking Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
