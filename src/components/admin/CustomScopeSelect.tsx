"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export interface ScopeOption {
  value: "ALL" | "STUDENTS" | "ADMINS";
  label: string;
  desc: string;
  icon: string;
}

export const SCOPE_OPTIONS: ScopeOption[] = [
  {
    value: "ALL",
    label: "All Registered PWA Devices",
    desc: "Broadcast to all mobile & desktop subscriber devices",
    icon: "fa-solid fa-mobile-screen-button",
  },
  {
    value: "STUDENTS",
    label: "Diploma Students Only",
    desc: "Target enrolled Venture Architect founders",
    icon: "fa-solid fa-graduation-cap",
  },
  {
    value: "ADMINS",
    label: "Sub-Admins & Admins Only",
    desc: "Send internal management & platform alerts",
    icon: "fa-solid fa-user-shield",
  },
];

interface CustomScopeSelectProps {
  value: "ALL" | "STUDENTS" | "ADMINS";
  onChange: (val: "ALL" | "STUDENTS" | "ADMINS") => void;
  className?: string;
}

export default function CustomScopeSelect({
  value,
  onChange,
  className = "",
}: CustomScopeSelectProps) {
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
      const popUpward = spaceBelow < 220 && rect.top > 220;

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

  const selectedOption = SCOPE_OPTIONS.find((opt) => opt.value === value) || SCOPE_OPTIONS[0];

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggleOpen}
        className="w-full bg-gray-50 border border-gray-200 hover:border-[#0E6875]/40 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
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

      {/* Floating Menu Portal */}
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
            className={`z-99999 bg-white rounded-2xl shadow-2xl border border-gray-100 py-1.5 max-h-60 overflow-y-auto menu-scrollbar ${
              coords.popUpward
                ? "animate-in fade-in slide-in-from-bottom-2 duration-150"
                : "animate-in fade-in slide-in-from-top-2 duration-150"
            }`}
          >
            {SCOPE_OPTIONS.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-xs flex items-start justify-between transition-colors text-left cursor-pointer ${
                    isSelected
                      ? "bg-[#FAF0E9] text-[#0E6875] font-extrabold"
                      : "text-gray-700 hover:bg-[#E6F3F5] hover:text-[#0E6875]"
                  }`}
                >
                  <div className="flex items-start gap-3 truncate">
                    <i className={`${option.icon} text-[#0E6875] text-sm mt-0.5 w-4 shrink-0`}></i>
                    <div className="truncate">
                      <div className="font-extrabold text-gray-900 truncate">{option.label}</div>
                      <div className="text-[10px] text-gray-500 font-medium truncate mt-0.5">
                        {option.desc}
                      </div>
                    </div>
                  </div>
                  {isSelected && <i className="fa-solid fa-check text-[#0E6875] text-xs shrink-0 ml-2 mt-0.5"></i>}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}
