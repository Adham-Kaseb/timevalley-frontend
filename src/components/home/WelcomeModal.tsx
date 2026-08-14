"use client";

import { useState } from "react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setEmail("");
      setMessage("");
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-base transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center font-black text-2xl mb-3">
            TV
          </div>
          <h3 className="text-2xl font-extrabold text-[#1A1A1A]">
            تواصل مع فريق منصة TimeValley
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            أرسل استفسارك أو طلب التوجيه وسيقوم مستشارو استوديو المشاريع بالتواصل معك.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#E6F3F5] text-[#0E6875] p-6 rounded-xl text-center space-y-2">
            <div className="text-3xl">🎉</div>
            <h4 className="text-lg font-bold">تم إرسال رسالتك بنجاح!</h4>
            <p className="text-xs">سيتواصل معك فريق الاستشارات الاستثمارية في أقرب وقت.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                الاسم الكامل
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-base focus:outline-none focus:border-[#0E6875]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-base focus:outline-none focus:border-[#0E6875]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                تفاصيل الاستفسار أو فكرة المشروع
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-base focus:outline-none focus:border-[#0E6875]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0E6875] hover:bg-[#148595] text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all text-base mt-2"
            >
              إرسال الرسالة
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
