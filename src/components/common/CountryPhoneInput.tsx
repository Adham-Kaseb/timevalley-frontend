"use client";

import React, { useState, useRef, useEffect } from "react";

export interface CountryOption {
  code: string;
  country: string;
  flag: string;
  label: string;
  name: string;
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "+20", country: "EG", flag: "🇪🇬", label: "+20", name: "Egypt" },
  { code: "+971", country: "UAE", flag: "🇦🇪", label: "+971", name: "United Arab Emirates" },
  { code: "+966", country: "KSA", flag: "🇸🇦", label: "+966", name: "Saudi Arabia" },
  { code: "+965", country: "KW", flag: "🇰🇼", label: "+965", name: "Kuwait" },
  { code: "+974", country: "QA", flag: "🇶🇦", label: "+974", name: "Qatar" },
  { code: "+218", country: "LY", flag: "🇱🇾", label: "+218", name: "Libya" },
  { code: "+213", country: "DZ", flag: "🇩ℤ", label: "+213", name: "Algeria" },
  { code: "+212", country: "MA", flag: "🇲🇦", label: "+212", name: "Morocco" },
  { code: "+216", country: "TN", flag: "🇹🇳", label: "+216", name: "Tunisia" },
  { code: "+973", country: "BH", flag: "🇧🇭", label: "+973", name: "Bahrain" },
  { code: "+968", country: "OM", flag: "🇴🇲", label: "+968", name: "Oman" },
  { code: "+962", country: "JO", flag: "🇯🇴", label: "+962", name: "Jordan" },
  { code: "+970", country: "PS", flag: "🇵🇸", label: "+970", name: "Palestine" },
  { code: "+964", country: "IQ", flag: "🇮🇶", label: "+964", name: "Iraq" },
  { code: "+1", country: "US", flag: "🇺🇸", label: "+1", name: "US / Canada" },
  { code: "+44", country: "UK", flag: "🇬🇧", label: "+44", name: "United Kingdom" },
  { code: "OTHER", country: "OTHER", flag: "🌐", label: "Other", name: "Other (Global Key)" },
];

interface CountryPhoneInputProps {
  countryCode: string;
  setCountryCode: (code: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  customCode?: string;
  setCustomCode?: (code: string) => void;
  error?: string;
  placeholder?: string;
}

export default function CountryPhoneInput({
  countryCode,
  setCountryCode,
  phone,
  setPhone,
  customCode = "+",
  setCustomCode,
  error,
  placeholder = "1123456789",
}: CountryPhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    COUNTRY_OPTIONS.find((c) => c.code === countryCode) || COUNTRY_OPTIONS[0];

  const isOther = countryCode === "OTHER";

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelectCountry = (opt: CountryOption) => {
    setCountryCode(opt.code);
    setIsOpen(false);
  };

  return (
    <div className="space-y-1">
      <div className="flex gap-2 relative" ref={dropdownRef}>
        {/* Country Code Custom Selector Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1.5 px-3 py-2.5 bg-[#FAF0E9]/60 hover:bg-[#FAF0E9] border rounded-2xl text-xs font-extrabold text-[#1C2B2D] transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#0E6875] ${
              isOpen ? "border-[#0E6875] ring-2 ring-[#0E6875]/20" : "border-gray-200"
            }`}
          >
            <span className="text-sm leading-none">{selectedOption.flag}</span>
            <span className="font-mono tracking-tight font-extrabold">
              {isOther ? "Other" : selectedOption.code}
            </span>
            <i
              className={`fa-solid fa-chevron-down text-[10px] text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-[#0E6875]" : ""
              }`}
            />
          </button>

          {/* Styled Floating Dropdown Menu (With Smooth Wheel Isolation & Custom Thin Scrollbar) */}
          {isOpen && (
            <div
              className="absolute left-0 top-full mt-2 w-64 max-h-56 bg-white/98 backdrop-blur-xl rounded-2xl shadow-[0_15px_40px_rgba(14,104,117,0.22)] border border-gray-100 p-1.5 z-50 overflow-y-auto overscroll-contain touch-pan-y"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(14, 104, 117, 0.35) transparent",
              }}
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="px-2 py-1 mb-1 text-[10px] font-black uppercase tracking-wider text-[#0E6875]/70 border-b border-gray-100">
                Select Country Code
              </div>
              <div className="space-y-0.5">
                {COUNTRY_OPTIONS.map((opt) => {
                  const isSelected = countryCode === opt.code;
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => handleSelectCountry(opt)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer text-left ${
                        isSelected
                          ? "bg-[#E6F3F5] text-[#0E6875] font-black shadow-xs"
                          : "text-gray-700 font-bold hover:bg-[#FAF0E9]/70 hover:text-[#0C4E58]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none">{opt.flag}</span>
                        <span className="font-extrabold">
                          {opt.code !== "OTHER" ? opt.code : "Other Code"}
                        </span>
                        <span className="text-[11px] font-medium text-gray-400">
                          ({opt.country})
                        </span>
                      </div>
                      {isSelected && (
                        <i className="fa-solid fa-check text-xs text-[#0E6875]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* If 'OTHER' is selected: Render custom global country key input first */}
        {isOther && setCustomCode && (
          <div className="relative w-24">
            <span className="absolute left-2.5 top-2.5 text-xs font-mono font-bold text-gray-400">
              Key:
            </span>
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="+44"
              className="w-full pl-9 pr-2 py-2.5 bg-[#FAF0E9]/50 border border-gray-200 rounded-2xl text-xs font-extrabold font-mono text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
            />
          </div>
        )}

        {/* Main Phone Number Input */}
        <div className="relative flex-1">
          <i className="fa-solid fa-phone absolute left-3.5 top-3.5 text-gray-400 text-sm" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={isOther ? "+44 7911 123456" : placeholder}
            className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF0E9]/50 border rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875] ${
              error ? "border-red-400 bg-red-50/50" : "border-gray-200"
            }`}
          />
        </div>
      </div>

      {error && (
        <p className="text-[11px] font-extrabold text-red-500 flex items-center gap-1 mt-0.5">
          <i className="fa-solid fa-circle-exclamation" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
