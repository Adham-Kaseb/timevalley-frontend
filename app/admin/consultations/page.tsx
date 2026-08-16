"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import consultationsService, {
  ConsultationCardItem,
} from "@/services/consultations";

export default function AdminConsultationsPage() {
  const [cards, setCards] = useState<ConsultationCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const data = await consultationsService.getAllAdmin();
      setCards(data);
    } catch (err) {
      console.error("Failed to load consultation cards", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleTogglePublish = async (card: ConsultationCardItem) => {
    try {
      await consultationsService.updateConsultation(card.id, {
        isPublished: !card.isPublished,
      });
      fetchCards();
    } catch (err) {
      console.error("Failed to toggle publish state", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this consultation card?")) return;
    try {
      await consultationsService.deleteConsultation(id);
      fetchCards();
    } catch (err) {
      console.error("Failed to delete card", err);
    }
  };

  const totalOfferings = cards.length;
  const activeOfferings = cards.filter((c) => c.isPublished).length;
  const draftOfferings = totalOfferings - activeOfferings;

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <span className="bg-[#0E6875]/10 text-[#0E6875] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            ⚡ Admin Control Center
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mt-2 tracking-tight">
            Consultations Builder
          </h1>
          <p className="text-sm text-gray-500 font-semibold mt-1">
            Create, update, and publish Dr. Wael executive consultation cards for founders.
          </p>
        </div>

        <Link
          href="/admin/consultations/create"
          className="bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-plus-circle text-base"></i>
          <span>Create Consultation Card</span>
        </Link>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-gray-400">Total Cards</span>
            <i className="fa-solid fa-calendar-days text-[#0E6875] text-xl"></i>
          </div>
          <p className="text-3xl font-black text-[#0E6875]">{totalOfferings}</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-gray-400">Active Published</span>
            <i className="fa-solid fa-circle-check text-emerald-500 text-xl"></i>
          </div>
          <p className="text-3xl font-black text-emerald-600">{activeOfferings}</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-gray-400">Draft / Hidden</span>
            <i className="fa-solid fa-eye-slash text-amber-500 text-xl"></i>
          </div>
          <p className="text-3xl font-black text-amber-600">{draftOfferings}</p>
        </div>
      </div>

      {/* Cards List Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <i className="fa-solid fa-spinner animate-spin text-3xl text-[#0E6875]"></i>
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF0E9] text-[#0E6875] flex items-center justify-center text-2xl mx-auto">
            <i className="fa-solid fa-user-doctor"></i>
          </div>
          <h3 className="text-lg font-black text-gray-800">No Consultation Cards Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Start building custom consultation offerings for Dr. Wael by clicking the button below.
          </p>
          <Link
            href="/admin/consultations/create"
            className="inline-block bg-[#0E6875] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
          >
            Create First Card
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 relative overflow-hidden"
            >
              <div className="space-y-3">
                {/* Status & Category Bar */}
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-[#FAF0E9] border border-[#EDA296]/40 text-[#0E6875] text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    {card.category}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      card.isPublished
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {card.isPublished ? "Active / Visible" : "Hidden Draft"}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-gray-900 leading-snug">
                  {card.title}
                </h3>

                <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-3">
                  {card.description}
                </p>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-700 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1.5 text-[#0E6875]">
                    <i className="fa-solid fa-clock"></i>
                    <span>{card.duration}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <i className="fa-solid fa-tag"></i>
                    <span>
                      {card.price > 0 ? `${card.currency} $${card.price}` : "Free / Included"}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <i className="fa-solid fa-user-tie text-[#0E6875]"></i>
                    <span>{card.consultantName || "Dr. Wael"}</span>
                  </span>
                </div>

                {/* Tags */}
                {Array.isArray(card.tags) && card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {card.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions Bar */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleTogglePublish(card)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                    card.isPublished
                      ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {card.isPublished ? "Hide Card" : "Publish Card"}
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/consultations/${card.id}/edit`}
                    className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-[#0E6875] text-gray-700 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer"
                    title="Edit Card"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </Link>

                  <button
                    onClick={() => handleDelete(card.id)}
                    className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer"
                    title="Delete Card"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
