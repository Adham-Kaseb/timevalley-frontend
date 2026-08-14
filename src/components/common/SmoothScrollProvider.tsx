"use client";

import { useEffect } from "react";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    let lenis: any = null;
    let rafId: number;

    const startLenis = () => {
      // @ts-ignore
      const LenisClass = window.Lenis;
      if (LenisClass && !lenis) {
        lenis = new LenisClass({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 2.0,
        });

        const raf = (time: number) => {
          lenis?.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      }
    };

    startLenis();
    const timer = setInterval(() => {
      // @ts-ignore
      if (window.Lenis && !lenis) {
        startLenis();
      }
      if (lenis) {
        clearInterval(timer);
      }
    }, 100);

    return () => {
      clearInterval(timer);
      if (lenis) lenis.destroy();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <>{children}</>;
}
