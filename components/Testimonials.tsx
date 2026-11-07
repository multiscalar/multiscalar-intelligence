"use client";

import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/lib/testimonials";

// Placeholder marks, matching the partner marquee, until real logos arrive.
const SHAPES = [
  <circle key="c" cx="12" cy="12" r="9" />,
  <rect key="r" x="3" y="3" width="18" height="18" rx="4" />,
  <path key="t" d="M12 3 21 20H3Z" />,
  <path key="d" d="M12 2 22 12 12 22 2 12Z" />,
];

// Round profile picture, or the person's initials until a photo is added.
function Avatar({ t }: { t: Testimonial }) {
  if (t.avatar) {
    return (
      // Plain img: a small square headshot that needs no optimisation.
      <img
        src={t.avatar}
        alt=""
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }
  const initials = t.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      aria-hidden
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#ece6dc] text-[0.72rem] font-semibold text-[#5c5348]"
    >
      {initials}
    </span>
  );
}

// Customer quotes, centred on the page: one quote in large type, and the
// customers' logos below it as the switcher (the current one dark, the rest
// grey like the marquee). The divider between them fills like a progress bar
// and moves on to the next quote when full; it pauses while hovered or off
// screen, and stays still for reduced motion.
export default function Testimonials({ items }: { items: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [still, setStill] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const rotating = items.length > 1 && !still;

  return (
    <div
      ref={root}
      className="mx-auto max-w-[860px] text-center"
      // Mouse only: a tap on a phone would otherwise leave it paused.
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div>
        {/* Every quote sits in the same grid cell, so the block is as tall as
            the longest one and the logo row never jumps; only the active one
            is visible. */}
        <div className="grid">
          {items.map((item, i) => (
            <figure
              key={i}
              aria-hidden={i !== active}
              className={`col-start-1 row-start-1 transition-[opacity,translate,filter] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                i === active
                  ? "translate-y-0 opacity-100 blur-0 duration-[1100ms] delay-300"
                  : "pointer-events-none translate-y-3 opacity-0 blur-[3px] duration-[900ms]"
              }`}
            >
              <blockquote className="font-sans text-[clamp(1.4rem,2.2vw,1.95rem)] font-medium leading-[1.3] tracking-[-0.02em] text-black/90">
                <span aria-hidden className="text-black/25">“</span>
                {item.quote}
                <span aria-hidden className="text-black/25">”</span>
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-center gap-3 text-left">
                <Avatar t={item} />
                <span className="text-[0.88rem] leading-[1.4]">
                  <span className="block font-semibold text-black">{item.name}</span>
                  <span className="block text-text-dim">
                    {item.role}, {item.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Divider, doubling as the timer for the next quote. */}
        <div className="relative mt-12 h-px bg-black/10">
          {rotating && (
            <span
              key={active}
              aria-hidden
              className="absolute inset-0 origin-left animate-progress bg-black/70"
              style={{ animationPlayState: hovered || !inView ? "paused" : "running" }}
              onAnimationEnd={() => setActive((a) => (a + 1) % items.length)}
            />
          )}
        </div>

        <div
          role="tablist"
          aria-label="Customer quotes"
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5 pt-8 max-[640px]:flex-nowrap max-[640px]:justify-between max-[640px]:gap-x-4"
        >
          {items.map((item, i) => {
            const on = i === active;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className={`inline-flex cursor-pointer items-center gap-2.5 transition-colors max-[640px]:gap-1.5 duration-500 ease-out ${
                  on ? "text-black" : "text-[#b4b4b4] hover:text-black/60"
                }`}
              >
                {item.logo ? (
                  // Plain img: logos are small SVGs that need no optimisation.
                  <img
                    src={item.logo}
                    alt={item.company}
                    className={`h-7 w-auto brightness-0 max-[640px]:h-6 transition-opacity duration-500 ease-out ${
                      on ? "opacity-90" : "opacity-30"
                    }`}
                  />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 fill-current max-[640px]:h-5 max-[640px]:w-5" aria-hidden>
                      {SHAPES[i % SHAPES.length]}
                    </svg>
                    <span className="whitespace-nowrap text-[1.15rem] font-semibold tracking-[-0.01em] max-[640px]:text-[0.95rem]">
                      {item.company}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
