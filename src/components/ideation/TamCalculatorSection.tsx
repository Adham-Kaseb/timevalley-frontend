"use client";

import React, { useState } from "react";

export default function TamCalculatorSection() {
  const [customers, setCustomers] = useState(50000);
  const [acv, setAcv] = useState(12000);
  const [sharePct, setSharePct] = useState(15);

  // Financial calculations
  const tam = customers * acv;
  const sam = tam * 0.3;
  const som = sam * (sharePct / 100);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(2)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
  };

  return (
    <section className="mb-12 bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E6875]/10 text-[#0E6875] text-xs font-bold uppercase tracking-wider mb-2">
            <i className="fa-solid fa-calculator"></i> Real-Time Financial Modeling
          </span>
          <h3 className="text-xl sm:text-3xl font-black text-[#0E6875]">
            Interactive TAM / SAM / SOM Market Calculator
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Adjust target customer parameters to calculate bottom-up addressable market sizing for pre-seed pitch decks.
          </p>
        </div>
        <div className="shrink-0">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EDA296]/20 text-[#0E6875] border border-[#EDA296]/40 text-xs sm:text-sm font-extrabold">
            <i className="fa-solid fa-bolt text-[#EDA296]"></i> Venture Engine v3.4
          </span>
        </div>
      </div>

      {/* Grid: Sliders Left, Output Cards Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Input Sliders Column */}
        <div className="lg:col-span-5 space-y-6 bg-gray-50/80 p-6 rounded-2xl border border-gray-200/80">
          {/* Slider 1: Customer Count */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="flex items-center gap-2 text-[#1C2B2D]">
                <i className="fa-solid fa-users text-[#0E6875]"></i> Target ICP Customers (N)
              </span>
              <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[#0E6875] font-mono font-bold">
                {customers.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="500000"
              step="1000"
              value={customers}
              onChange={(e) => setCustomers(Number(e.target.value))}
              className="w-full accent-[#0E6875] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>1,000</span>
              <span>500,000</span>
            </div>
          </div>

          {/* Slider 2: ACV */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="flex items-center gap-2 text-[#1C2B2D]">
                <i className="fa-solid fa-sack-dollar text-[#EDA296]"></i> Annual ACV ($)
              </span>
              <span className="px-3 py-1 bg-[#EDA296]/20 border border-[#EDA296]/40 rounded-lg text-[#0E6875] font-mono font-bold">
                ${acv.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="100000"
              step="500"
              value={acv}
              onChange={(e) => setAcv(Number(e.target.value))}
              className="w-full accent-[#EDA296] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>$500</span>
              <span>$100,000</span>
            </div>
          </div>

          {/* Slider 3: Share % */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="flex items-center gap-2 text-[#1C2B2D]">
                <i className="fa-solid fa-chart-pie text-[#0E6875]"></i> Obtainable Share % (SOM)
              </span>
              <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[#0E6875] font-mono font-bold">
                {sharePct}%
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={sharePct}
              onChange={(e) => setSharePct(Number(e.target.value))}
              className="w-full accent-[#0E6875] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>1%</span>
              <span>50%</span>
            </div>
          </div>
        </div>

        {/* Output KPI Cards Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* TAM Card */}
            <div className="bg-[#0E6875]/5 border border-[#0E6875]/20 rounded-2xl p-5 text-center space-y-2 hover:shadow-md transition-shadow">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                TAM (Total Market)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#0E6875]">
                {formatCurrency(tam)}
              </div>
              <small className="text-[11px] font-semibold text-gray-500 block">
                100% Industry Ceiling
              </small>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-[#0E6875] h-full w-full rounded-full"></div>
              </div>
            </div>

            {/* SAM Card */}
            <div className="bg-[#0E6875]/10 border border-[#0E6875]/30 rounded-2xl p-5 text-center space-y-2 hover:shadow-md transition-shadow">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                SAM (Serviceable)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#0E6875]">
                {formatCurrency(sam)}
              </div>
              <small className="text-[11px] font-semibold text-gray-500 block">
                30% Geo-Targeted
              </small>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-[#0E6875] h-full w-[30%] rounded-full"></div>
              </div>
            </div>

            {/* SOM Card */}
            <div className="bg-[#EDA296]/20 border border-[#EDA296]/50 rounded-2xl p-5 text-center space-y-2 hover:shadow-md transition-shadow">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E6875]">
                SOM (Obtainable)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#0E6875]">
                {formatCurrency(som)}
              </div>
              <small className="text-[11px] font-semibold text-gray-700 block">
                {sharePct}% Year-3 Target
              </small>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-[#EDA296] h-full rounded-full transition-all duration-300"
                  style={{ width: `${sharePct}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Pro-Tip Box */}
          <div className="p-4 bg-[#FAF0E9] border border-[#EDA296]/30 rounded-2xl text-center">
            <p className="text-xs sm:text-sm font-semibold text-[#1C2B2D] flex items-center justify-center gap-2">
              <i className="fa-solid fa-lightbulb text-[#EDA296]"></i>
              <span>
                <strong>Pro-Tip:</strong> VCs look for SOM of $10M-$50M with TAM &gt; $500M for venture-scale investments.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
