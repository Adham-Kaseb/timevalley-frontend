"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Reset scroll to top cleanly on route navigation without CSS smooth-scroll conflict
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div key={pathname} className="page-transition-wrapper" suppressHydrationWarning>
      {children}
    </div>
  );
}
