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
        Figure 2: Summary of the value allocation. Each bar splits the value of
        the best possible allocation (£2,839 per market on average) into the
        seller&apos;s revenue, the bidders&apos; profit, and the value lost to
        misallocation and fees, over the fifteen auctions of each setting. With
        chat, almost a third of the value moved from the seller to the bidders,
        and the share lost rose from 11% to 18%.
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
        Figure 4: Mean profit per auction in pounds for each model, with and
        without chat, on the same markets and seats (fifteen auctions each).
      </figcaption>
    </figure>
  );
}

// Figure 1: the dual approach. ARIA runs the real market; the simulator
// rehearses it before each season. The recommendations arrow is the one
// accent.
const BOX = "rounded-[8px] border border-black/15 bg-white px-3 py-2.5 text-center text-[0.8rem] leading-[1.35] text-black max-[560px]:text-[0.7rem]";
function Arrow({ label, dir, accent }: { label: string; dir: "right" | "left"; accent?: boolean }) {
  const ink = accent ? "text-[#b85a2c]" : "text-black/50";
  return (
    <div className={`flex flex-col items-center justify-center px-1 text-[0.7rem] max-[560px]:text-[0.6rem] ${ink}`}>
      <span className="mb-1 whitespace-nowrap">{label}</span>
      <span className="text-[1rem] leading-none" aria-hidden>
        {dir === "right" ? "⟶" : "⟵"}
      </span>
    </div>
  );
}

export function DualApproach() {
  return (
    <figure className="my-10">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-y-4 rounded-[14px] bg-[#f1eee8] p-5 max-[560px]:p-3">
        <div className="text-center">
          <div className="text-[0.85rem] font-semibold text-black">ARIA Arena</div>
          <div className="text-[0.75rem] text-black/50">the real market</div>
        </div>
        <span />
        <div className="text-center">
          <div className="text-[0.85rem] font-semibold text-black">Multiscalar Market Simulator</div>
          <div className="text-[0.75rem] text-black/50">a high-fidelity simulation</div>
        </div>

        <div className={BOX}>Draft rules for the season</div>
        <Arrow label="rules" dir="right" />
        <div className={BOX}>Rehearse the auction with frontier agents</div>

        <div className={BOX}>Revised rules</div>
        <Arrow label="recommendations" dir="left" accent />
        <div className={`${BOX} border-[#d9774a]`}>Find problems, test fixes</div>

        <div className={BOX}>Season runs with teams&apos; agents</div>
        <Arrow label="real data" dir="right" />
        <div className={BOX}>
          Calibrate on real outcomes
          <div className="mt-1 text-[0.68rem] text-black/45">feeds the next season&apos;s rehearsal</div>
        </div>
      </div>
      <figcaption className="mt-4 text-[0.82rem] leading-[1.6] text-black/50">
        Figure 1: The dual approach. ARIA runs the real market, while the
        Multiscalar Market Simulator rehearses it before each season and is
        calibrated on its outcomes afterwards. Changes recommended by the
        simulator (highlighted) can reach the Arena before its agents do.
      </figcaption>
    </figure>
  );
}

// Figure 3: one split, held at 14m 30s and raided at 14m 48s (seed 1,
// rotation 2). Bars are lot prices on one scale; DeepSeek's lots carry the
// accent.
const LOTS = ["A", "B", "C", "D", "E", "F"];
const HELD = [
  { price: 4, leader: "MiMo" },
  { price: 5, leader: "Qwen" },
  { price: 5, leader: "DeepSeek" },
  { price: 3, leader: "Opus" },
  { price: 8, leader: "Qwen" },
  { price: 3, leader: "GPT" },
];
const RAID = [
  { price: 25, leader: "DeepSeek" },
  { price: 20, leader: "DeepSeek" },
  { price: 15, leader: "DeepSeek" },
  { price: 20, leader: "DeepSeek" },
  { price: 30, leader: "DeepSeek" },
  { price: 26, leader: "GPT" },
];
const TOP = 30;
// Seats as the simulator's viewer numbers them.
const SEAT: Record<string, string> = { Qwen: "b1", DeepSeek: "b2", Opus: "b3", GPT: "b4", MiMo: "b5" };

function LotPanel({ time, title, note, lots }: { time: string; title: string; note: string; lots: { price: number; leader: string }[] }) {
  return (
    <div className="rounded-[12px] border border-black/10 bg-white p-4">
      <div className="text-[0.85rem] font-semibold text-black">
        <span className="mr-2 font-normal tabular-nums text-black/45">{time}</span>
        {title}
      </div>
      <div className="mt-0.5 text-[0.72rem] text-black/50">{note}</div>
      <div className="mt-6 flex h-[120px] items-end gap-2 border-b border-black/20">
        {lots.map((l, i) => (
          <div key={LOTS[i]} className="relative flex min-w-0 flex-1 justify-center" style={{ height: `${(l.price / TOP) * 100}%` }}>
            <span className="absolute -top-5 text-[0.7rem] tabular-nums text-black/70">£{l.price}</span>
            <div className="h-full w-full max-w-[28px] rounded-t-[4px]" style={{ background: l.leader === "DeepSeek" ? "#d9774a" : "#a8a39a", minHeight: 3 }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {lots.map((l, i) => (
          <div key={LOTS[i]} className="min-w-0 flex-1 text-center text-[0.68rem] leading-[1.3]">
            <div className="text-black/80">{LOTS[i]}</div>
            <div className="text-black/45" title={l.leader}>{SEAT[l.leader]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const EVENTS = [
  { t: "2m 42s", who: "DeepSeek to all", text: "“I’ll honor the split even in the final seconds and expect the same.”" },
  { t: "9m 19s", who: "DeepSeek, private notes", text: "“a final-second raid on all cheap lots is strictly better in expectation”" },
  { t: "13m 57s", who: "Qwen to all", text: "“Attacking me buys you a war you can’t profit from.”" },
  { t: "14m 48s", who: "DeepSeek", text: "bids on all six lots at once and takes Lots A to E for £110 in total." },
  { t: "14m 53s", who: "GPT", text: "takes Lot F back at £26." },
  { t: "15m 46s", who: "Qwen", text: "Its counter-bids on all six lots reach the auction after the close and are refused." },
];

export function SplitRaid() {
  return (
    <figure className="my-10">
      <div className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
        <LotPanel time="14m 30s" title="The split holds" note="Seller revenue so far: £28" lots={HELD} />
        <LotPanel time="15m 00s" title="The raid" note="Seller revenue: £136 (no chat: £1,613)" lots={RAID} />
      </div>
      <ol className="mt-4 divide-y divide-black/[0.07] rounded-[12px] border border-black/10 bg-white px-4">
        {EVENTS.map((e) => (
          <li key={e.t} className="grid grid-cols-[64px_1fr] gap-3 py-2.5 text-[0.8rem] leading-[1.5]">
            <span className="tabular-nums text-black/45">{e.t}</span>
            <span className="text-black/75">
              <span className="font-medium text-black">{e.who}</span> {e.text}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.78rem] text-black/60">
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-[3px] bg-[#d9774a]" />Led by DeepSeek</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-[3px] bg-[#a8a39a]" />Led by another bidder</span>
        <span>Seats: b1 Qwen, b2 DeepSeek, b3 Opus, b4 GPT, b5 MiMo</span>
      </div>
      <figcaption className="mt-4 text-[0.82rem] leading-[1.6] text-black/50">
        Figure 3: A split agreed by all five bidders and broken in the final
        seconds (seed 1, rotation 2). Each column is a lot whose height follows
        its price, labeled with the seat that leads it. Left: at 14m 30s,
        every lot is led by the bidder the split assigned it to, at £3 to £8.
        Right: DeepSeek defected at 14m 48s, as its private notes had planned
        at 9m 19s, and won five lots for £110; GPT took the sixth back. The
        seller received £136 for lots that sold for £1,613 in the same market
        without chat. At the close, DeepSeek&apos;s profit was £1,185.5 and
        GPT&apos;s £767.7. Messages and notes are quoted verbatim.
      </figcaption>
    </figure>
  );
}

// Figure 5c: bids per auction at each fee, agents without chat. The share
// of accepted bids that raised by the £1 minimum sits inside each bar.
const FEES = [
  { fee: "£0", bids: 942, min: 84 },
  { fee: "£0.10", bids: 673, min: 77 },
  { fee: "£0.20", bids: 557, min: 64 },
];

export function BidsPerFee() {
  return (
    <figure className="my-10">
      <div className="flex flex-col gap-3">
        {FEES.map((f) => (
          <div key={f.fee} className="grid grid-cols-[64px_1fr] items-center gap-3">
            <span className="text-[0.82rem] tabular-nums text-black/70">{f.fee}</span>
            <div className="flex items-center gap-3">
              <div className="flex h-9 items-center justify-end rounded-[4px] bg-[#141311] px-2 text-[0.72rem] tabular-nums text-white/80" style={{ width: `${(f.bids / 1000) * 85}%` }}>
                {f.min}% at £1
              </div>
              <span className="text-[0.8rem] font-medium tabular-nums text-black">{f.bids}</span>
            </div>
          </div>
        ))}
      </div>
      <figcaption className="mt-4 text-[0.82rem] leading-[1.6] text-black/50">
        Figure 5: Bids per auction at each fee per bid, frontier agents in the
        auctions without chat. A fee of £0.10 cuts bids by 29%. The figure
        inside each bar is the share of accepted bids that raised the price by
        the £1 minimum.
      </figcaption>
    </figure>
  );
}
