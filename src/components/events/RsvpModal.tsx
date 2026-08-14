"use client";

import React, { useState } from "react";

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  speakers: string;
  desc: string;
  status: string;
}

interface RsvpModalProps {
  isOpen: boolean;
  event: EventItem | null;
  onClose: () => void;
  onConfirmRsvp: (eventId: string) => void;
}

export default function RsvpModal({
  isOpen,
  event,
  onClose,
  onConfirmRsvp,
}: RsvpModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Founder");
  const [confirmed, setConfirmed] = useState(false);
  const [ticketId, setTicketId] = useState("");

  if (!isOpen || !event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const generatedTicket = `TV-TICKET-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedTicket);
    setConfirmed(true);

    onConfirmRsvp(event.id);
  };

  const handleCloseAll = () => {
    setConfirmed(false);
    setName("");
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar space-y-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-250">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="text-xl font-black text-[#0E6875] flex items-center gap-2">
            <i className="fa-solid fa-ticket"></i> RSVP Free Ticket
          </h3>
          <button
            onClick={handleCloseAll}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Event Preview Banner */}
        <div className="p-4 bg-[#FAF0E9] rounded-2xl border border-[#EDA296]/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="bg-[#EDA296] text-[#0E6875] text-[11px] font-black px-3 py-1 rounded-full uppercase">
              {event.type}
            </span>
            <span className="text-xs font-bold text-[#0E6875]">
              <i className="fa-solid fa-calendar-day me-1"></i> {event.date} • {event.time}
            </span>
          </div>
          <h4 className="text-base font-black text-[#1C2B2D]">
            {event.title}
          </h4>
          <small className="text-xs text-gray-600 block">
            <i className="fa-solid fa-location-dot text-[#0E6875] me-1"></i> {event.location}
          </small>
        </div>

        {confirmed ? (
          <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center text-3xl">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div>
              <h4 className="text-xl font-black text-emerald-700">
                RSVP Ticket Confirmed!
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Your free pass has been issued and emailed to <strong>{email}</strong>.
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl font-mono text-xs font-bold text-[#0E6875] border border-dashed border-[#0E6875]/30">
              Ticket Pass ID: {ticketId}
            </div>
            <button
              onClick={handleCloseAll}
              className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold py-3 rounded-xl shadow transition-all cursor-pointer text-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
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
                Ecosystem Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#0E6875] cursor-pointer"
              >
                <option value="Founder">Founder / Entrepreneur</option>
                <option value="Investor">Venture Investor / Angel</option>
                <option value="Developer">Technical CTO / Engineer</option>
                <option value="Mentor">Mentor / Accelerator Partner</option>
              </select>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCloseAll}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0E6875] hover:bg-[#0B4E58] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Confirm Free RSVP
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
