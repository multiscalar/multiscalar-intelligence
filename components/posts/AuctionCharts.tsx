"use client";

import { useState } from "react";

// Charts for the agent-auction post, from the report's Figures 2 and 4.
// Neutrals for the seller and the lost value, one warm hue for what moved
// to the bidders; every segment and bar carries its own label.

const SPLIT = [
  { label: "Without chat", parts: [59, 30, 11] },
  { label: "With chat", parts: [27, 55, 18] },
];
const PARTS = [
  { name: "Seller's revenue", color: "#141311", ink: "text-white" },
  { name: "Bidders' profit", color: "#d9774a", ink: "text-black" },
  { name: "Lost to misallocation and fees", color: "#d6d3cc", ink: "text-black/70" },
];

function Legend({ items }: { items: { name: string; color: string }[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.78rem] text-black/60">
      {items.map((p) => (
        <span key={p.name} className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: p.color }} />
          {p.name}
        </span>
      ))}
    </div>
  );
}

export function ValueSplit() {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <figure className="my-10">
      <div className="flex flex-col gap-3">
        {SPLIT.map((row) => (
          <div key={row.label} className="grid grid-cols-[96px_1fr] items-center gap-3 max-[520px]:grid-cols-1 max-[520px]:gap-1.5">
            <span className="text-[0.82rem] text-black/70">{row.label}</span>
            <div className="flex h-9 gap-[2px]">
              {row.parts.map((v, i) => {
                const key = `${row.label}-${i}`;
                return (
                  <div
                    key={key}
                    onMouseEnter={() => setHover(key)}
                    onMouseLeave={() => setHover(null)}
                    title={`${row.label}: ${PARTS[i].name}, ${v}%`}
                    className={`flex items-center rounded-[4px] px-2 text-[0.75rem] font-medium tabular-nums transition-opacity duration-200 ${PARTS[i].ink} ${
                      hover && hover !== key ? "opacity-60" : ""
                    }`}
                    style={{ width: `${v}%`, background: PARTS[i].color }}
                  >
                    {v}%
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <Legend items={PARTS} />
      <figcaption className="mt-4 text-[0.82rem] leading-[1.6] text-black/50">
        Where the value of the best possible allocation went (£2,839 per market
        on average), over the fifteen auctions of each setting. Same markets,
        same models, same seats.
      </figcaption>
    </figure>
  );
}

const PROFIT = [
  { model: "DeepSeek", without: 241, with: 496 },
  { model: "GPT", without: 192, with: 432 },
  { model: "MiMo", without: 121, with: 222 },
  { model: "Opus", without: 184, with: 212 },
  { model: "Qwen", without: 124, with: 200 },
];
const MAX = 500;
const SERIES = [
  { name: "Without chat", color: "#a8a39a" },
  { name: "With chat", color: "#141311" },
];

export function ProfitByModel() {
  return (
    <figure className="my-10">
      <div className="relative h-[220px] border-b border-black/25">
        {[100, 200, 300, 400, 500].map((t) => (
          <div key={t} className="absolute inset-x-0 border-t border-black/[0.06]" style={{ bottom: `${(t / MAX) * 100}%` }}>
            <span className="absolute -top-2 left-0 bg-bg pr-1 text-[0.68rem] tabular-nums text-black/40">£{t}</span>
          </div>
        ))}
        <div className="absolute inset-0 left-9 flex">
          {PROFIT.map((m) => (
            <div key={m.model} className="flex flex-1 items-end justify-center gap-[2px]">
              {[m.without, m.with].map((v, i) => (
                <div
                  key={i}
                  title={`${m.model}, ${SERIES[i].name.toLowerCase()}: £${v}`}
                  className="relative w-[26%] max-w-[30px] rounded-t-[4px]"
                  style={{ height: `${(v / MAX) * 100}%`, background: SERIES[i].color }}
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[0.68rem] tabular-nums text-black/70">{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="ml-9 mt-2 flex">
        {PROFIT.map((m) => (
          <span key={m.model} className="flex-1 text-center text-[0.78rem] text-black/70">
            {m.model}
          </span>
        ))}
      </div>
      <Legend items={SERIES} />
      <figcaption className="mt-4 text-[0.82rem] leading-[1.6] text-black/50">
        Mean profit per auction in pounds, with and without chat, on the same
        markets and seats (fifteen auctions each).
      </figcaption>
    </figure>
  );
}
