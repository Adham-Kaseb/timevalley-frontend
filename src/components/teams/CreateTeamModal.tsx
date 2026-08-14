"use client";

import React, { useState } from "react";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTeam: (team: {
    id: string;
    name: string;
    sector: string;
    founder: string;
    desc: string;
    openRoles: string[];
    equity: string;
  }) => void;
}

export default function CreateTeamModal({
  isOpen,
  onClose,
  onAddTeam,
}: CreateTeamModalProps) {
  const [name, setName] = useState("");
  const [sector, setSector] = useState("Fintech & Risk AI");
  const [founder, setFounder] = useState("");
  const [desc, setDesc] = useState("");
  const [roles, setRoles] = useState("Technical Co-Founder / CTO, Growth Lead");
  const [equity, setEquity] = useState("20% - 35% Equity Split");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !founder.trim()) return;

    const newTeam = {
      id: `team-${Date.now()}`,
      name: name.trim(),
      sector,
      founder: founder.trim(),
      desc: desc.trim() || "Building high-growth venture solution backed by TimeValley Platform.",
      openRoles: roles.split(",").map((r) => r.trim()).filter(Boolean),
      equity,
    };

    onAddTeam(newTeam);
    setName("");
    setFounder("");
    setDesc("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar space-y-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-250">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="text-xl font-black text-[#0E6875] flex items-center gap-2">
            <i className="fa-solid fa-plus-circle"></i> Create a Startup Team
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Startup Team Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Project Chronos AI"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#0E6875] focus:ring-2 focus:ring-[#0E6875]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Sector Category
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#0E6875] cursor-pointer"
              >
                <option value="Fintech & Risk AI">Fintech & Risk AI</option>
                <option value="BioTech & HealthTech">BioTech & HealthTech</option>
                <option value="Enterprise AI">Enterprise AI</option>
                <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                <option value="Cyber Security">Cyber Security</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Founder Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Sarah Jenkins"
                value={founder}
                onChange={(e) => setFounder(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#0E6875] focus:ring-2 focus:ring-[#0E6875]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Project Description / Mission
            </label>
            <textarea
              rows={2}
              placeholder="Briefly describe what your venture is building..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-[#0E6875] resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Open Roles (comma separated)
              </label>
              <input
                type="text"
                placeholder="CTO, Growth Lead"
                value={roles}
                onChange={(e) => setRoles(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Equity Split Range
              </label>
              <input
                type="text"
                placeholder="20% - 35% Equity Split"
                value={equity}
                onChange={(e) => setEquity(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#0E6875]"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0E6875] hover:bg-[#0B4E58] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Launch Startup Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
