"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import contactService from "@/services/contact";
import CustomTopicSelect from "./CustomTopicSelect";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

export default function ContactModal({ isOpen, onClose, defaultSubject = "Venture Advisory Inquiry" }: ContactModalProps) {
  const { user } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [otherTopic, setOtherTopic] = useState("");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill fields if user is logged in
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setError("");
    setMessage("");
    setOtherTopic("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Card */}
      <div className="bg-[#FAF0E9] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-white/60 relative animate-modal-pop">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-200/80 hover:bg-gray-300 text-gray-700 flex items-center justify-center text-sm font-bold transition-all cursor-pointer z-20"
          aria-label="Close Contact Modal"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#0E6875] text-white flex items-center justify-center text-2xl mx-auto shadow-lg shadow-[#0E6875]/20">
                <i className="fa-solid fa-comments"></i>
              </div>
              <h2 className="text-2xl font-black text-[#1C2B2D]">Let's Chat With Us</h2>
              <p className="text-xs text-gray-600 max-w-sm mx-auto font-medium leading-relaxed">
                Have questions about our Venture Architect Diploma, Advisory services, or Investment? Send us a direct message!
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-extrabold flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation text-red-500"></i>
                <span>{error}</span>
              </div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Sarah Ahmed"
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+20 100 000 0000"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">Inquiry Topic</label>
                <CustomTopicSelect
                  value={subject}
                  onChange={setSubject}
                  otherValue={otherTopic}
                  onOtherChange={setOtherTopic}
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">Message *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={3}
                  placeholder="How can our team help your venture today?"
                  className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin"></i>
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i>
                    <span>Send Message to Advisory Team</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success View */
          <div className="text-center py-6 space-y-5 animate-modal-pop">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mx-auto shadow-inner">
              <i className="fa-solid fa-circle-check"></i>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#1C2B2D]">Message Received!</h3>
              <p className="text-xs text-gray-600 font-medium max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="font-extrabold text-[#0E6875]">{name}</span>. Your message has been sent directly to our advisory team. We will review your inquiry and reach out to you shortly.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-gray-200 text-xs text-gray-600 text-left space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Direct Contact:</span>
                <span className="font-bold text-[#0E6875]">adhamkasebssj4@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold text-emerald-600">Dispatched & Logged</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full bg-[#0E6875] text-white font-extrabold text-xs py-3 rounded-2xl shadow-md hover:bg-[#0B4E58] transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
