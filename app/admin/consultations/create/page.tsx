"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import consultationsService, {
  CreateConsultationPayload,
} from "@/services/consultations";

export default function CreateConsultationPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Venture Strategy");
  const [duration, setDuration] = useState("60 Mins");
  const [price, setPrice] = useState<number>(250);
  const [currency, setCurrency] = useState("USD");
  const [consultantName, setConsultantName] = useState("Dr. Wael");
  const [consultantTitle, setConsultantTitle] = useState("Founder & Managing Partner");
  const [consultantAvatar, setConsultantAvatar] = useState("/images/team/CEO.jpg");
  const [bookingUrl, setBookingUrl] = useState("https://calendly.com");
  const [tagsInput, setTagsInput] = useState("Strategy, Venture Builder, Seed Gate");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const tagsArray = tagsInput
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const handleSave = async (publishedState: boolean) => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in both the Card Title and Description.");
      return;
    }

    setSubmitting(true);
    const payload: CreateConsultationPayload = {
      title,
      category,
      duration,
      price: Number(price),
      currency,
      consultantName,
      consultantTitle,
      consultantAvatar,
      bookingUrl,
      tags: tagsArray,
      description,
      isPublished: publishedState,
    };

    try {
      await consultationsService.createConsultation(payload);
      router.push("/admin/consultations");
    } catch (err) {
      console.error("Failed to create consultation card", err);
      alert("Failed to create consultation card. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Header with Back Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <Link
            href="/admin/consultations"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0E6875] hover:underline mb-2"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back to Consultations List</span>
          </Link>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Create Consultation Card
          </h1>
          <p className="text-sm text-gray-500 font-semibold mt-1">
            Build a new executive consultation offering for Dr. Wael with real-time live preview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/consultations"
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={() => handleSave(false)}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Publishing..." : "Publish Consultation Card"}
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-[#0E6875] border-b border-gray-100 pb-3 flex items-center gap-2">
            <i className="fa-solid fa-sliders"></i>
            <span>Card Configuration</span>
          </h2>

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                Card Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 1-on-1 Venture Strategy & Thesis Alignment"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
                >
                  <option value="Venture Strategy">Venture Strategy</option>
                  <option value="Pitch Review">Pitch Review</option>
                  <option value="Venture Building">Venture Building</option>
                  <option value="Growth & Funding">Growth & Funding</option>
                  <option value="Legal & Cap Table">Legal & Cap Table</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                  Session Duration
                </label>
                <input
                  type="text"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 45 Mins, 60 Mins"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                Price Amount ($)
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                Currency Code
              </label>
              <input
                type="text"
                required
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="USD"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
              />
            </div>
          </div>

          {/* Section 3: Consultant Details */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                  Consultant Name
                </label>
                <input
                  type="text"
                  required
                  value={consultantName}
                  onChange={(e) => setConsultantName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                  Consultant Title
                </label>
                <input
                  type="text"
                  required
                  value={consultantTitle}
                  onChange={(e) => setConsultantTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                Consultant Avatar URL
              </label>
              <input
                type="text"
                value={consultantAvatar}
                onChange={(e) => setConsultantAvatar(e.target.value)}
                placeholder="/images/team/CEO.jpg"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
              />
            </div>
          </div>

          {/* Section 4: Booking & Tags */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                Booking Calendar Link (Optional)
              </label>
              <input
                type="url"
                value={bookingUrl}
                onChange={(e) => setBookingUrl(e.target.value)}
                placeholder="https://calendly.com/dr-wael/strategy"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Strategy, Valuation, VC Pitch"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
              />
            </div>
          </div>

          {/* Section 5: Description */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-black text-gray-700 uppercase mb-1">
              Detailed Description *
            </label>
            <textarea
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed breakdown of what is covered in this consultation session..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-[#0E6875] resize-none"
            ></textarea>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 text-[#0E6875] rounded-md focus:ring-[#0E6875]"
            />
            <label htmlFor="isPublished" className="text-xs font-bold text-gray-800">
              Publish Card Immediately to Public /consultations Page
            </label>
          </div>
        </div>

        {/* Right Column: Live Card Preview */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-gray-500 flex items-center gap-1.5">
              <i className="fa-solid fa-eye text-[#0E6875]"></i>
              <span>Live Card Preview</span>
            </span>
            <span className="text-[10px] font-bold bg-[#0E6875]/10 text-[#0E6875] px-2.5 py-0.5 rounded-full">
              Real-Time Rendering
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-4">
              {/* Category & Price Bar */}
              <div className="flex items-center justify-between gap-3">
                <span className="bg-[#FAF0E9] border border-[#EDA296]/40 text-[#0E6875] text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                  {category || "Category"}
                </span>

                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <i className="fa-solid fa-clock text-[#0E6875]"></i>
                    <span>{duration || "Duration"}</span>
                  </span>
                  <span className="bg-[#0E6875] text-white text-xs font-black px-3.5 py-1 rounded-full shadow-2xs">
                    {price > 0 ? `${currency} $${price}` : "Free / Included"}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-black text-gray-900 leading-snug">
                {title || "Consultation Card Title"}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                {description || "Detailed description will appear here as you type in the configuration panel..."}
              </p>

              {/* Tags */}
              {tagsArray.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {tagsArray.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2.5 py-0.5 rounded-lg"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Consultant Info */}
            <div className="pt-5 border-t border-gray-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={consultantAvatar || "/images/team/CEO.jpg"}
                  alt={consultantName}
                  className="w-10 h-10 rounded-full object-cover border border-[#0E6875]/30 shadow-xs"
                />
                <div>
                  <p className="text-xs font-extrabold text-gray-900 leading-tight">
                    {consultantName || "Dr. Wael"}
                  </p>
                  <p className="text-[11px] font-semibold text-gray-500">
                    {consultantTitle || "Founder & Managing Partner"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="bg-[#0E6875] text-white text-xs font-extrabold px-5 py-2.5 rounded-2xl shadow-md flex items-center gap-2"
              >
                <i className="fa-solid fa-calendar-check"></i>
                <span>Book Session</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
