"use client";

import React from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: FadeInProps) {
  const getDirectionClass = () => {
    switch (direction) {
      case "up":
        return "translate-y-4";
      case "down":
        return "-translate-y-4";
      case "left":
        return "translate-x-4";
      case "right":
        return "-translate-x-4";
      default:
        return "";
    }
  };

  return (
    <div
      className={`transition-all duration-500 ease-out animate-in fade-in ${getDirectionClass()} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface ScaleInProps {
  children: React.ReactNode;
  className?: string;
}

export function ScaleIn({ children, className = "" }: ScaleInProps) {
  return (
    <div className={`transition-all duration-300 transform animate-in fade-in zoom-in-95 ${className}`}>
      {children}
    </div>
  );
}
