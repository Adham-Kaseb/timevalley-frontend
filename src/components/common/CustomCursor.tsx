"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkDesktop = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      setIsDesktop(isLargeScreen && isFinePointer);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'a, button, input, select, textarea, [role="button"], .cursor-pointer, .card-white, img'
        );
        setIsHovering(!!interactive);
      }
    };

    const onMouseDown = () => setIsActive(true);
    const onMouseUp = () => setIsActive(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("resize", checkDesktop);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  useEffect(() => {
    if (!mounted || !isDesktop) return;
    let animationFrameId: number;

    const follow = () => {
      setFollowerPos((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.25,
        y: prev.y + (position.y - prev.y) * 0.25,
      }));
      animationFrameId = requestAnimationFrame(follow);
    };

    animationFrameId = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position, mounted, isDesktop]);

  if (!mounted || !isDesktop) return null;

  return (
    <>
      <div
        className={`cursor-dot ${isHovering ? "is-hovering" : ""} ${isActive ? "is-active" : ""}`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      />
      <div
        className={`cursor-follower ${isHovering ? "is-hovering" : ""} ${isActive ? "is-active" : ""}`}
        style={{
          transform: `translate3d(${followerPos.x}px, ${followerPos.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        <svg className="cursor-spinner-svg" viewBox="0 0 50 50">
          <circle
            className="cursor-spinner-bg"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="2"
          />
          <circle
            className="cursor-spinner-arc"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="3"
          />
        </svg>
      </div>
    </>
  );
}
