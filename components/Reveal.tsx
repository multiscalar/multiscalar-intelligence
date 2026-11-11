"use client";

import { useEffect, useRef, useState } from "react";

// Scroll-triggered reveal. Content is visible by default: the server renders
// it shown, and only an element that starts below the fold is hidden (after
// hydration, while still off screen) and then rises in as it scrolls into
// view. Without JavaScript, for crawlers and screenshots, for anything already
// on screen, and with reduced motion, nothing is ever hidden.
type Phase = "static" | "hidden" | "shown";

export default function Reveal({
  children,
  className = "",
  variant = "default",
  delay = 0,
  id,
}: {
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "divider";
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setPhase("hidden");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase("shown");
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hidden = phase === "hidden";
  const transition =
    phase === "static"
      ? ""
      : variant === "divider"
        ? `origin-left transition-transform duration-800 ease-out ${hidden ? "scale-x-0" : "scale-x-100"}`
        : `transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hidden ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
          }`;

  return (
    <div
      ref={ref}
      id={id}
      className={`${className} ${transition}`}
      style={delay && phase !== "static" ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
