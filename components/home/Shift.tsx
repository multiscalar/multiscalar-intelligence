"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  IconCode,
  IconCoins,
  IconFileText,
  IconGauge,
  IconHandshake,
  IconPencilLine,
  IconSignature,
} from "central-icons";

// The shift the company is built on, as a scroll scene. The section is taller
// than the screen and its stage sticks while you scroll through it: the
// sentence strikes out "completing tasks" and writes "making economic
// decisions" in its place, the task chips fade and the four decisions rise in,
// then the conclusion lands. Phones, reduced motion and no-JS get the final
// state, laid out normally.

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

const TASKS: { label: string; icon: Icon }[] = [
  { label: "Build apps and infrastructure", icon: IconCode },
  { label: "Solve open maths problems", icon: IconPencilLine },
  { label: "Answer questions and draft documents", icon: IconFileText },
];
const DECISIONS: { label: string; icon: Icon }[] = [
  { label: "Price and manage risk", icon: IconGauge },
  { label: "Contract across supply chains", icon: IconSignature },
  { label: "Allocate capital over long horizons", icon: IconCoins },
  { label: "Broker and negotiate deals", icon: IconHandshake },
];

// 0 → 1 across [a, b], clamped.
const span = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));

export default function Shift() {
  const ref = useRef<HTMLElement>(null);
  // Server render and the static layout show the end of the scene.
  const [p, setP] = useState(1);
  const [scene, setScene] = useState(false);

  useEffect(() => {
    const wide = matchMedia("(min-width: 900px)");
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setScene(wide.matches && !still.matches);
    decide();
    wide.addEventListener("change", decide);
    still.addEventListener("change", decide);
    return () => {
      wide.removeEventListener("change", decide);
      still.removeEventListener("change", decide);
    };
  }, []);

  useEffect(() => {
    if (!scene) {
      setP(1);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setP(span(-r.top, 0, r.height - innerHeight));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [scene]);

  const strike = span(p, 0.08, 0.3);
  const write = span(p, 0.26, 0.5);
  const tasksOut = span(p, 0.2, 0.42);
  const conclude = span(p, 0.82, 0.95);

  return (
    <section ref={ref} className={scene ? "relative h-[260vh]" : "section-y"}>
      <div className={scene ? "sticky top-0 flex h-screen flex-col justify-center pt-16" : ""}>
        <h2 className="max-w-[1140px] font-sans text-[clamp(2rem,4.1vw,3.7rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-black">
          <span className="text-black/45">AI is moving from </span>
          <span className="relative inline-block whitespace-nowrap" style={{ opacity: 1 - 0.6 * strike }}>
            completing tasks
            <span
              aria-hidden
              className="absolute left-0 top-[55%] h-[0.07em] w-full origin-left rounded-full bg-black"
              style={{ transform: `scaleX(${strike})` }}
            />
          </span>
          <br />
          <span className="text-black/45">to </span>
          <span
            className="inline-block"
            style={{ clipPath: `inset(-0.2em ${100 - write * 100}% -0.2em 0)` }}
          >
            making <span className="text-ember-deep">economic decisions.</span>
          </span>
        </h2>

        {/* Before and after, side by side and equally weighted. "Today"
            stays fully readable; the decisions are always there, dim, and
            light up one by one as the scene plays. */}
        <div className="mt-12 grid grid-cols-2 gap-4 max-[900px]:mt-10 max-[900px]:grid-cols-1">
          <div
            className="flex flex-col rounded-[24px] border border-black/10 bg-white p-8 transition-opacity max-[768px]:p-6"
            style={{ opacity: 1 - 0.25 * tasksOut }}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-black">Today</h3>
              <span className="text-[0.85rem] text-black/55">AI completes tasks</span>
            </div>
            <ul className="mt-6 flex flex-1 flex-col divide-y divide-black/10 border-t border-black/10">
              {TASKS.map((t) => {
                const Icon = t.icon;
                return (
                  <li key={t.label} className="flex items-center gap-4 py-4 text-[1.05rem] text-black/75">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/[0.05] text-black/60">
                      <Icon aria-hidden strokeWidth={1.8} className="h-4 w-4" />
                    </span>
                    {t.label}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col rounded-[24px] bg-[#141311] p-8 text-white max-[768px]:p-6">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ember">Next</h3>
              <span className="text-[0.85rem] text-white/60">AI makes economic decisions</span>
            </div>
            <ul className="mt-6 flex flex-1 flex-col divide-y divide-white/10 border-t border-white/10">
              {DECISIONS.map((d, i) => {
                const Icon = d.icon;
                const t = span(p, 0.36 + i * 0.09, 0.5 + i * 0.09);
                return (
                  <li key={d.label} className="flex items-center gap-4 py-4">
                    <span
                      className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 text-white/70"
                    >
                      <span
                        aria-hidden
                        className="absolute inset-[-1px] rounded-full bg-ember"
                        style={{ opacity: t, transform: `scale(${0.6 + 0.4 * t})` }}
                      />
                      <span className="relative" style={{ color: t > 0.5 ? "var(--color-ember-ink)" : undefined }}>
                        <Icon aria-hidden strokeWidth={1.8} className="h-4 w-4" />
                      </span>
                    </span>
                    <span
                      className="text-[1.1rem] font-semibold leading-[1.25] tracking-[-0.015em]"
                      style={{ opacity: 0.4 + 0.6 * t }}
                    >
                      {d.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <p
          className="mt-12 max-w-[760px] text-[clamp(1.2rem,1.8vw,1.5rem)] font-semibold leading-[1.3] tracking-[-0.02em] text-black max-[900px]:mt-10"
          style={{ opacity: conclude, transform: `translateY(${(1 - conclude) * 16}px)` }}
        >
          The next competitive advantage is not who uses AI, but whose AI makes better decisions.
        </p>
      </div>
    </section>
  );
}
