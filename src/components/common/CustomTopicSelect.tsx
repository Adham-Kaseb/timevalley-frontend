"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export interface TopicOption {
  value: string;
  label: string;
  icon: string;
}

export const TOPIC_OPTIONS: TopicOption[] = [
  { value: "Venture Advisory Inquiry", label: "Venture Advisory Inquiry", icon: "fa-solid fa-building" },
  { value: "Diploma Enrollment & Fee", label: "Diploma Enrollment & Fee", icon: "fa-solid fa-graduation-cap" },
  { value: "Co-Founder Matchmaking", label: "Co-Founder Matchmaking", icon: "fa-solid fa-users" },
  { value: "Pre-Seed Capital Investment", label: "Pre-Seed Capital Investment", icon: "fa-solid fa-hand-holding-dollar" },
  { value: "1-on-1 Founder Consultation", label: "1-on-1 Founder Consultation", icon: "fa-solid fa-user-tie" },
  { value: "Technical Co-Building & Prototyping", label: "Technical Co-Building & Prototyping", icon: "fa-solid fa-code" },
  { value: "Partnership & Corporate Sponsorship", label: "Partnership & Corporate Sponsorship", icon: "fa-solid fa-handshake" },
  { value: "General Inquiry", label: "General Inquiry", icon: "fa-solid fa-circle-question" },
  { value: "Other", label: "Other / Custom Request", icon: "fa-solid fa-pen-to-square" },
];

interface CustomTopicSelectProps {
  value: string;
  onChange: (value: string) => void;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
  className?: string;
}

export default function CustomTopicSelect({
  value,
  onChange,
  otherValue = "",
  onOtherChange,
  className = "",
}: CustomTopicSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, popUpward: false });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const popUpward = spaceBelow < 240 && rect.top > 240;

      setCoords({
        top: popUpward ? rect.top : rect.bottom,
        left: rect.left,
        width: rect.width,
        popUpward,
      });
    }
  };

  const handleToggleOpen = () => {
    if (!isOpen) {
      updateCoords();
    }
    setIsOpen(!isOpen);
  };

  // Recalculate coordinates on scroll or resize while open
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updateCoords();
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedOption = TOPIC_OPTIONS.find((opt) => opt.value === value) || TOPIC_OPTIONS[0];

  return (
    <div className={`relative space-y-2 ${className}`}>
      {/* Custom Trigger Button Styled with TimeValley Design Tokens */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggleOpen}
        className="w-full bg-white border border-gray-200 hover:border-[#0E6875]/40 rounded-2xl px-4 py-3 text-xs font-bold text-gray-800 flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
      >
        <div className="flex items-center gap-2.5 truncate">
          <i className={`${selectedOption.icon} text-[#0E6875] text-sm w-4 shrink-0`}></i>
          <span className="truncate">{selectedOption.label}</span>
        </div>
        <i
          className={`fa-solid fa-chevron-down text-xs text-[#0E6875] transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
        ></i>
      </button>

      {/* Portal Dropdown Menu attached to document.body (Zero Clipping in any Container) */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            ref={menuRef}
            data-lenis-prevent
            style={{
              position: "fixed",
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              ...(coords.popUpward
                ? { bottom: `${window.innerHeight - coords.top + 6}px` }
                : { top: `${coords.top + 6}px` }),
            }}
            className={`z-99999 bg-white rounded-2xl shadow-2xl border border-gray-100 py-1.5 max-h-56 overflow-y-auto menu-scrollbar ${
              coords.popUpward
                ? "animate-in fade-in slide-in-from-bottom-2 duration-150"
                : "animate-in fade-in slide-in-from-top-2 duration-150"
            }`}
          >
            {TOPIC_OPTIONS.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors text-left cursor-pointer ${
                    isSelected
                      ? "bg-[#FAF0E9] text-[#0E6875] font-extrabold"
                      : "text-gray-700 hover:bg-[#E6F3F5] hover:text-[#0E6875]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <i className={`${option.icon} text-[#0E6875] w-4 shrink-0`}></i>
                    <span className="truncate">{option.label}</span>
                  </div>
                  {isSelected && <i className="fa-solid fa-check text-[#0E6875] text-xs shrink-0 ml-2"></i>}
                </button>
              );
            })}
          </div>,
          document.body
        )}

      {/* When "Other" option is selected, reveal custom specification text input */}
      {value === "Other" && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200 pt-1">
          <label className="block text-[11px] font-extrabold text-[#0E6875] mb-1">
            Please specify your custom inquiry topic *
          </label>
          <input
            type="text"
            value={otherValue}
            onChange={(e) => onOtherChange && onOtherChange(e.target.value)}
            required={value === "Other"}
            placeholder="e.g., Venture Studio Co-Investment & Incubation"
            className="w-full bg-white border border-[#0E6875]/40 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875] shadow-xs"
          />
        </div>
      )}
    </div>
  );
}
