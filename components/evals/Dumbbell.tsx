"use client";

import { useState } from "react";
import ModelMark from "@/components/evals/ModelMark";
import { r3 } from "@/lib/evals/chart";
import { PROVIDER_ICONS } from "@/lib/evals/provider-icons";
import { PROVIDERS, logoColor, providerOf } from "@/lib/evals/providers";
import { fmt } from "@/lib/evals/score";
import type { BenchData } from "@/lib/evals/types";

// Two percentage metrics per model on one shared axis: an open ring for
// `outer` and an ink dot for `inner`, joined by the gap between them. Rows
// are ordered by `inner`.
export default function Dumbbell({
  d,
  outer,
  inner,
  gapLabel,
}: {
  d: BenchData;
  outer: string;
  inner: string;
  /** What the gap between the two dots means, for the hover readout. */
  gapLabel: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const mo = d.metrics.find((m) => m.id === outer)!;
  const mi = d.metrics.find((m) => m.id === inner)!;
  const rows = d.models
    .filter(
      (m) =>
        typeof m.scores[outer] === "number" &&
        typeof m.scores[inner] === "number",
    )
    .map((m) => {
      const p = providerOf(m);
      return {
        name: m.name,
        o: m.scores[outer],
        i: m.scores[inner],
        icon: p.icon ? PROVIDER_ICONS[p.icon] : undefined,
        mark: p.mark,
        color: logoColor(p),
        baseline: p === PROVIDERS.baseline,
      };
    })
    .sort((a, b) => b.i - a.i || a.name.localeCompare(b.name));

  const all = rows.flatMap((r) => [r.o, r.i]);
  const lo = Math.max(0, Math.floor((Math.min(...all) - 2) / 10) * 10);
  const hi = Math.min(100, Math.ceil((Math.max(...all) + 1) / 10) * 10);
  const at = (v: number) => r3(((v - lo) / (hi - lo)) * 100);
  const ticks: number[] = [];
  for (let t = lo; t <= hi; t += 10) ticks.push(t);
  const short = (label: string) => label.split(" (")[0];

  return (
    <div onMouseLeave={() => setHovered(null)}>
      <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.78rem] text-black/55">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#141311]" />
          {mi.label}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-[#141311] bg-white" />
          {mo.label}
        </span>
      </div>

      {rows.map((r) => {
        const on = hovered === r.name;
        const dim = hovered !== null && !on;
        const a = at(Math.min(r.o, r.i));
        const b = at(Math.max(r.o, r.i));
        return (
          <div
            key={r.name}
            // Touch taps fire mouseenter too; only real hover dims the rest.
            onMouseEnter={() => matchMedia("(hover: hover)").matches && setHovered(r.name)}
            // Phones: name and scores on one line, the track full width below.
            className={`grid grid-cols-[minmax(0,12rem)_minmax(0,1fr)_11.5rem] items-center gap-5 border-t border-black/[0.05] py-2 transition-opacity duration-200 max-[700px]:grid-cols-[minmax(0,1fr)_auto] max-[700px]:gap-x-3 max-[700px]:gap-y-1.5 max-[700px]:py-3 ${
              dim ? "opacity-35" : ""
            }`}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <ModelMark
                icon={r.icon}
                mark={r.mark}
                color={r.color}
                tone="light"
                size="sm"
              />
              <span
                className={`truncate text-[0.85rem] font-medium ${
                  r.baseline ? "text-black/50" : "text-black"
                }`}
              >
                {r.name}
              </span>
            </span>
            <span className="relative h-6 max-[700px]:col-span-2 max-[700px]:row-start-2">
              {ticks.map((t) => (
                <span
                  key={t}
                  className="absolute inset-y-0 w-px bg-black/[0.05]"
                  style={{ left: `${at(t)}%` }}
                />
              ))}
              <span
                className={`absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full ${
                  r.baseline ? "bg-black/10" : "bg-[#e08a5f]/60"
                }`}
                style={{ left: `${a}%`, width: `${b - a}%` }}
              />
              <span
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#141311] bg-white"
                style={{ left: `${at(r.o)}%`, opacity: r.baseline ? 0.4 : 1 }}
              />
              <span
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#141311]"
                style={{ left: `${at(r.i)}%`, opacity: r.baseline ? 0.4 : 1 }}
              />
            </span>
            <span className="whitespace-nowrap text-right text-[0.8rem] tabular-nums text-black/55 max-[700px]:col-start-2 max-[700px]:row-start-1">
              {on ? (
                <span className="font-semibold text-[#c2683e]">
                  {(r.o - r.i).toFixed(1)} pts {gapLabel}
                </span>
              ) : (
                <>
                  <span className="font-semibold text-black">{fmt(r.i, "%")}</span>
                  {" / "}
                  {fmt(r.o, "%")}
                </>
              )}
            </span>
          </div>
        );
      })}

      <div className="grid grid-cols-[minmax(0,12rem)_minmax(0,1fr)_11.5rem] gap-5 border-t border-black/[0.05] pt-2 max-[700px]:grid-cols-1">
        <span className="max-[700px]:hidden" />
        <span className="relative h-4">
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute -translate-x-1/2 text-[0.7rem] tabular-nums text-text-dim"
              style={{ left: `${at(t)}%` }}
            >
              {t}%
            </span>
          ))}
        </span>
        <span className="text-right text-[0.7rem] text-text-dim max-[700px]:hidden">
          {short(mi.label)} / {short(mo.label)}
        </span>
      </div>
    </div>
  );
}
