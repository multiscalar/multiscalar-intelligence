"use client";

import { useState } from "react";
import ModelMark from "@/components/evals/ModelMark";
import type { ChartModel } from "@/lib/evals/examples";

export interface BenchBar extends ChartModel {
  score: number;
  /** Bar colour: the provider's series colour. */
  fill: string;
  /** The model's result in the benchmark's own units. */
  raw?: string;
}

const H = 360;
const TICKS = [0, 25, 50, 75, 100];

// An index benchmark's leaderboard as one column per model on the fixed
// 0-100 scale, best first: score on top, logo and name underneath, the
// unscaled result on hover. Dashed lines mark the benchmark's references.
export default function BenchBars({
  bars,
  rawLabel,
  refs = [],
}: {
  bars: BenchBar[];
  rawLabel?: string;
  refs?: { label: string; value: number }[];
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const top = (v: number) => `${100 - Math.max(0, Math.min(100, v))}%`;

  return (
    <div>
      <div className="relative ml-10 max-[640px]:ml-8" style={{ height: H }}>
        {TICKS.map((t) => (
          <div key={t}>
            <div
              className={`absolute inset-x-0 border-t ${t === 0 ? "border-black/25" : "border-black/[0.06]"}`}
              style={{ top: top(t) }}
            />
            <span
              className="absolute -left-10 w-7 -translate-y-1/2 text-right text-[0.7rem] tabular-nums text-text-dim max-[640px]:-left-8 max-[640px]:w-6"
              style={{ top: top(t) }}
            >
              {t}
            </span>
          </div>
        ))}

        {refs.map((r) => (
          <div
            key={r.label}
            className="pointer-events-none absolute inset-x-0 z-10 border-t border-dashed border-black/45"
            style={{ top: top(r.value) }}
          >
            <span className="absolute right-0 bottom-1 rounded bg-bg/90 px-1.5 text-[0.7rem] text-black/60">
              {r.label} · {r.value.toFixed(0)}
            </span>
          </div>
        ))}

        <div className="absolute inset-0 flex" onMouseLeave={() => setHovered(null)}>
          {bars.map((b, i) => {
            const on = hovered === b.name;
            return (
              <div
                key={b.name}
                className="relative flex flex-1 justify-center"
                onMouseEnter={() => setHovered(b.name)}
              >
                <div
                  className={`absolute bottom-0 w-[46%] max-w-[44px] rounded-t-[4px] transition-opacity duration-200 ${
                    hovered && !on ? "opacity-25" : ""
                  }`}
                  style={{ height: `${Math.max(0.6, Math.min(100, b.score))}%`, background: b.fill }}
                />
                <span
                  className={`absolute -translate-y-[calc(100%+6px)] text-[0.78rem] font-semibold tabular-nums text-black transition-opacity duration-200 max-[640px]:text-[0.62rem] ${
                    hovered && !on ? "opacity-30" : ""
                  }`}
                  style={{ top: top(b.score) }}
                >
                  {b.score.toFixed(1)}
                </span>
                {on && (
                  <span
                    className={`absolute z-30 w-max max-w-[240px] -translate-y-[calc(100%+30px)] rounded-lg bg-[#141311] px-3 py-2 text-[0.72rem] leading-[1.5] text-white shadow-lg ${
                      i < 2 ? "left-0" : i > bars.length - 3 ? "right-0" : ""
                    }`}
                    style={{ top: top(b.score) }}
                  >
                    <span className="font-semibold">
                      #{i + 1} {b.name}
                    </span>
                    <br />
                    Index score: {b.score.toFixed(1)}
                    {b.raw && (
                      <>
                        <br />
                        {rawLabel ? `${rawLabel}: ` : ""}
                        {b.raw}
                      </>
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="ml-10 mt-3 flex max-[640px]:ml-8">
        {bars.map((b) => (
          <div
            key={b.name}
            onMouseEnter={() => setHovered(b.name)}
            onMouseLeave={() => setHovered(null)}
            className={`flex flex-1 flex-col items-center gap-2 px-1 text-center transition-opacity duration-200 ${
              hovered && hovered !== b.name ? "opacity-40" : ""
            }`}
          >
            <ModelMark icon={b.icon} mark={b.mark} color={b.color} tone="light" size="md" title={b.name} />
            <span className="text-[0.72rem] font-medium leading-[1.3] text-black/75 max-[780px]:hidden">
              {b.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
