"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import contactService from "@/services/contact";
import CustomTopicSelect from "@/components/common/CustomTopicSelect";

export default function GuideAccordionSection() {
  const { user } = useAuth();

  // Default Item 1 expanded
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFadingOutPhoto, setIsFadingOutPhoto] = useState(false);
  const [isBuildingForm, setIsBuildingForm] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Venture Advisory Inquiry");
  const [otherTopic, setOtherTopic] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user, isChatOpen]);

  const handleOpenChat = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFadingOutPhoto(true);
    setTimeout(() => {
      setIsChatOpen(true);
      setIsBuildingForm(true);
      setIsFadingOutPhoto(false);
      setTimeout(() => {
        setIsBuildingForm(false);
      }, 700);
    }, 300);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    if (subject === "Other" && !otherTopic.trim()) {
      setError("Please specify your custom inquiry topic.");
      return;
    }

    setIsSubmitting(true);

    const finalSubject = subject === "Other" ? `Other: ${otherTopic.trim()}` : subject.trim();

    try {
      await contactService.submitContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: finalSubject,
        message: message.trim(),
      });

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Failed to submit contact form:", err);
      const msg = err.response?.data?.message || err.message || "Failed to send message. Please try again.";
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetChat = () => {
    setIsBuildingForm(false);
    setIsFadingOutPhoto(false);
    setIsChatOpen(false);
    setIsSubmitted(false);
    setError("");
    setMessage("");
    setOtherTopic("");
  };

  const accordionItems = [
    {
      title: "1. Day-Zero Venture Architecture & Co-Founder Matching",
      content:
        "We connect technical CTOs, domain product experts, and growth leads before company formation. Algorithmic matching powered by TimeValley's AI Cohort Engine guarantees winning team equity alignment.",
    },
    {
      title: "2. Certified 120h Tutor LMS & Scalable Playbooks",
      content:
        "Applied curriculum covering product-market fit, cap table math, unit economics, GTM growth loops, and investor deck teardowns certified by TimeValley Consulting partners.",
    },
    {
      title: "3. Pre-Seed Capital Investment & Advisory",
      content:
        "Direct pre-seed check commitments up to $250K from TimeValley Capital for graduating cohort ventures, alongside direct introductions to tier-1 Series A syndicates.",
    },
    {
      title: "4. Tailored Enterprise Business Strategy & Execution",
      content:
        "We work shoulder-to-shoulder with startup founders and enterprise partners to streamline B2B sales cycles, navigate DIFC/SME regulatory sandboxes, and scale across global innovation hubs.",
    },
  ];

  return (
    <section className="py-8 md:py-12 relative" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Accordion Column */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C2B2D] leading-tight tracking-tight">
              The Right Skill to <span className="text-[#F4A395]">Guide</span>
              <br />
              Your Company <span className="text-[#0E6875]">Progress</span>
            </h2>

            <div className="space-y-4 pt-4">
              {accordionItems.map((item, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <div key={idx} className="border-b border-gray-200/90 py-4 transition-all duration-300">
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className={`w-full text-left font-extrabold text-base sm:text-lg lg:text-xl flex items-center justify-between gap-4 transition-colors py-1 cursor-pointer ${
                        isOpen ? "text-[#0E6875]" : "text-[#1C2B2D] hover:text-[#0E6875]"
                      }`}
                    >
                      <span>{item.title}</span>
                      <span
                        className={`w-7 h-7 rounded-full text-base font-black flex items-center justify-center transition-all duration-300 shrink-0 ${
                          isOpen
                            ? "bg-[#FDEEE9] text-[#EDA296] rotate-180"
                            : "bg-[#E6F3F5] text-[#0E6875] rotate-0"
                        }`}
                      >
                        {isOpen ? "—" : "+"}
                      </span>
                    </button>

                    {/* Smooth Animated Height & Opacity Expand */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100 pt-2.5 pb-1" : "grid-rows-[0fr] opacity-0 pt-0 pb-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-medium max-w-xl">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Photo Frame or Staggered Building Contact Form Card */}
          <div className="lg:col-span-5 flex justify-center relative min-h-115 items-center">
            {!isChatOpen ? (
              /* Default State: Organic Photo Blob with Floating Speech Bubble */
              <div
                className={`relative w-full max-w-md flex justify-center pt-10 transition-all duration-300 ease-in-out ${
                  isFadingOutPhoto ? "opacity-0 scale-90 blur-xs" : "opacity-100 scale-100"
                }`}
              >
                {/* Floating Speech Bubble Badge Button */}
                <div className="absolute top-2 left-2 sm:-left-4 z-30 group">
                  <button
                    type="button"
                    onClick={handleOpenChat}
                    className="relative block transform transition-all duration-300 hover:scale-105 cursor-pointer text-left focus:outline-none"
                  >
                    {/* "Click to chat" Attached Top Badge */}
                    <div className="absolute -top-4 left-24 sm:left-28 bg-[#0E6875] text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-lg border border-white/30 flex items-center gap-1.5 whitespace-nowrap z-40 tracking-wide">
                      <i className="fa-solid fa-hand-pointer text-[10px] animate-pulse"></i>
                      <span>Click to chat</span>
                    </div>

                    {/* Main "Let's Chat ..." Speech Bubble */}
                    <div className="bg-linear-to-r from-[#F4A395] to-[#E78E7F] text-[#1A1A1A] font-extrabold text-lg sm:text-xl px-6 py-3.5 rounded-[26px_26px_26px_6px] shadow-[0_15px_35px_rgba(244,163,149,0.4)] flex items-center gap-3 border border-white/50">
                      <div className="w-8 h-8 rounded-full border-2 border-[#1A1A1A] flex items-center justify-center text-lg font-bold shrink-0">
                        ☺
                      </div>
                      <span className="tracking-tight">Let's Chat ...</span>
                    </div>
                  </button>
                </div>

                {/* Dynamic Organic Blob Photo Mask Frame */}
                <div className="w-80 sm:w-96 aspect-4/5 rounded-[60%_40%_52%_48%/_45%_55%_45%_55%] hover:rounded-[45%_55%_40%_60%/_60%_40%_60%_40%] transition-all duration-700 ease-in-out overflow-hidden shadow-[0_25px_60px_rgba(244,163,149,0.3)] bg-gray-200 relative border-4 border-white ring-8 ring-white/60">
                  <img
                    src="/images/team/team-4.png"
                    alt="TimeValley Advisory Support Lead"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>

              </div>
            ) : (
              /* Active State: Form Assembles & Appears Like Something Being Built */
              <div className="w-full max-w-md bg-[#FAF0E9] rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-200/80 relative animate-in fade-in zoom-in-90 duration-500 overflow-hidden">

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-200/80 hover:bg-gray-300 text-gray-700 flex items-center justify-center text-xs font-bold transition-all cursor-pointer z-10"
                  aria-label="Close Form"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>

                {!isSubmitted ? (
                  <div>
                    {/* Header - Stagger Step 1 */}
                    <div className="flex items-center gap-3 mb-5 border-b border-gray-200/80 pb-3 animate-in fade-in slide-in-from-top-3 duration-400 delay-100">
                      <div className="w-11 h-11 rounded-2xl bg-[#0E6875] text-white flex items-center justify-center text-xl shadow-md shadow-[#0E6875]/20 shrink-0">
                        <i className="fa-solid fa-comments"></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-[#1C2B2D] leading-tight">Let's Chat With Us</h3>
                        <p className="text-xs text-gray-600 font-medium mt-0.5">Send a direct message to our advisory team</p>
                      </div>
                    </div>

                    {/* Error Banner */}
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
                        <i className="fa-solid fa-circle-exclamation text-red-500"></i>
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Form Fields Assembling Staggered Sequence */}
                    <form onSubmit={handleContactSubmit} className="space-y-3.5">
                      
                      {/* Name Field - Stagger Step 2 */}
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 delay-200">
                        <label className="block text-xs font-extrabold text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="e.g. Sarah Ahmed"
                          className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875] shadow-xs"
                        />
                      </div>

                      {/* Email & Phone - Stagger Step 3 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-400 delay-300">
                        <div>
                          <label className="block text-xs font-extrabold text-gray-700 mb-1">Email *</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@example.com"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875] shadow-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-gray-700 mb-1">Phone (Optional)</label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+20 100 000 0000"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875] shadow-xs"
                          />
                        </div>
                      </div>

                      {/* Inquiry Topic - Stagger Step 4 */}
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 delay-400">
                        <label className="block text-xs font-extrabold text-gray-700 mb-1">Inquiry Topic</label>
                        <CustomTopicSelect
                          value={subject}
                          onChange={setSubject}
                          otherValue={otherTopic}
                          onOtherChange={setOtherTopic}
                        />
                      </div>

                      {/* Message Field - Stagger Step 5 */}
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 delay-500">
                        <label className="block text-xs font-extrabold text-gray-700 mb-1">Message *</label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                          rows={3}
                          placeholder="How can our advisory team help your venture today?"
                          className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875] shadow-xs"
                        />
                      </div>

                      {/* Submit Button - Stagger Step 6 */}
                      <div className="animate-in fade-in zoom-in-95 duration-400 delay-600">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
                        >
                          {isSubmitting ? (
                            <>
                              <i className="fa-solid fa-spinner animate-spin"></i>
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-paper-plane"></i>
                              <span>Send Message to Advisory Team</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Success View */
                  <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-400">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
                      <i className="fa-solid fa-circle-check"></i>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-xl font-black text-[#1C2B2D]">Message Received!</h4>
                      <p className="text-xs text-gray-600 font-medium max-w-xs mx-auto leading-relaxed">
                        Thank you, <span className="font-extrabold text-[#0E6875]">{name}</span>. Your inquiry has been sent to <span className="font-mono text-[#0E6875] font-bold">adhamkasebssj4@gmail.com</span>. Our team will contact you shortly.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetChat}
                      className="w-full bg-[#0E6875] text-white font-extrabold text-xs py-3 rounded-xl shadow-md hover:bg-[#0B4E58] transition-all cursor-pointer mt-3"
                    >
                      Done
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
