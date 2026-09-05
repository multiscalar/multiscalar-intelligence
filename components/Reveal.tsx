"use client";

import { useEffect, useRef, useState } from "react";

// Scroll-triggered reveal (port of the IntersectionObserver logic in script.js
// and the .animate/.visible + .divider transitions in style.css).
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const transition =
    variant === "divider"
      ? `origin-left transition-transform duration-800 ease-out ${
          visible ? "scale-x-100" : "scale-x-0"
        }`
      : `transition-[opacity,transform] duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`;

  return (
    <div
      ref={ref}
      id={id}
      className={`${className} ${transition}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
