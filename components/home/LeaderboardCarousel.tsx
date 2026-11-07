"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "central-icons";
import BenchCard from "@/components/evals/BenchCard";
import type { BenchCardData } from "@/lib/evals/cards";

// Cards are a fixed width wider than a quarter of the row, so the row
// scrolls sideways (swipe, trackpad, or the buttons) with snap points.
const GAP_PX = 16;

export default function LeaderboardCarousel({ cards }: { cards: BenchCardData[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  // Scroll stops: one per card, except that a final stop less than a third of
  // a card past the previous one is merged into it (the last stop is always
  // "scrolled to the end").
  const [position, setPosition] = useState(0);
  const [positions, setPositions] = useState(1);
  // Which half of the row the pointer is over: only that side's arrow shows.
  const [side, setSide] = useState<"left" | "right" | null>(null);

  const metrics = () => {
    const el = scroller.current!;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + GAP_PX : 1;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = max / step;
    const count =
      max > 1
        ? (ratio % 1 < 0.35 ? Math.floor(ratio) : Math.ceil(ratio)) + 1
        : 1;
    return { el, step, max, count };
  };

  const measure = useCallback(() => {
    if (!scroller.current) return;
    const { el, step, max, count } = metrics();
    setPositions(count);
    setPosition(
      el.scrollLeft >= max - 2
        ? count - 1
        : Math.min(count - 1, Math.round(el.scrollLeft / step)),
    );
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const go = (delta: number) => {
    const { el, step, max, count } = metrics();
    const target = Math.max(0, Math.min(count - 1, position + delta));
    el.scrollTo({
      left: target === count - 1 ? max : target * step,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="max-w-[1200px] mx-auto px-8 flex items-end justify-between gap-6 mb-10 max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-5 max-[768px]:px-6 max-[768px]:mb-8">
        <div>
          <div className="label text-white/50 mb-3">Economic Intelligence Index</div>
          <h2 className="max-w-[560px] font-sans text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.035em]">
            We measure how well AI handles money
          </h2>
          <p className="max-w-[560px] mt-5 text-[1rem] leading-[1.65] text-white/60">
            Models negotiate, invest and manage cash across a curated set of
            heterogeneous, adversarial economic benchmarks. We score what happens
            (money made, deals closed, cash that lasts) and weight the results
            into the Economic Intelligence Index (EII).
          </p>
        </div>
        <a
          href="/evals/"
          className="shrink-0 inline-flex items-center rounded-full border border-white/20 px-5 py-2.5 text-[0.85rem] font-medium text-white transition-colors hover:bg-white/10 hover:text-white"
        >
          Explore the index
        </a>
      </div>

      {/* Arrows sit on the row's edges; each appears while the pointer is over
          its half of the row (or it has keyboard focus). Touch screens swipe. */}
      <div
        className="relative"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setSide(e.clientX < r.left + r.width / 2 ? "left" : "right");
        }}
        onMouseLeave={() => setSide(null)}
      >
        <div
          ref={scroller}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-[max(2rem,calc((100%_-_1200px)/2_+_2rem))] scroll-px-[max(2rem,calc((100%_-_1200px)/2_+_2rem))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[768px]:px-6 max-[768px]:scroll-px-6"
          style={{ gap: GAP_PX }}
        >
          {cards.map((card) => (
            <BenchCard
              key={card.slug}
              card={card}
              className="w-[380px] shrink-0 snap-start max-[600px]:w-[85%]"
            />
          ))}
        </div>

        {positions > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous benchmarks"
              onClick={() => go(-1)}
              disabled={position === 0}
              className={`absolute left-5 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-[opacity,scale] duration-300 hover:scale-105 focus-visible:opacity-100 disabled:pointer-events-none disabled:!opacity-0 max-[768px]:hidden ${side === "left" ? "opacity-100" : "opacity-0"}`}
            >
              <IconChevronLeft aria-hidden className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next benchmarks"
              onClick={() => go(1)}
              disabled={position >= positions - 1}
              className={`absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-[opacity,scale] duration-300 hover:scale-105 focus-visible:opacity-100 disabled:pointer-events-none disabled:!opacity-0 max-[768px]:hidden ${side === "right" ? "opacity-100" : "opacity-0"}`}
            >
              <IconChevronRight aria-hidden className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
