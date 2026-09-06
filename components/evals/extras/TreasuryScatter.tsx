"use client";

import { useState } from "react";
import Chip from "../Chip";
import { PROVIDERS } from "@/lib/evals/providers";
import scatter from "@/data/evals/treasury-scatter.json";

interface Point {
  name: string;
  provider: string;
  net_worth_cents: number;
  penalties_cents: number;
  collection_cents: number;
  label: string;
}

// Log X: loss from penalties and collection, larger losses to the left.
const X_MIN = 10; // dollars, right edge
const X_MAX = 30000; // dollars, left edge
// Linear Y: closing treasury in dollars.
const Y_MIN = -16500;
const Y_MAX = 11500;

const X_GRID = [10000, 1000, 100, 10];
const Y_GRID = [10000, 5000, 0, -5000, -10000, -15000];

// Fixed precision so the server-rendered style and the client's hydration
// pass produce byte-identical values.
function xPct(lossDollars: number): string {
  const clamped = Math.min(X_MAX, Math.max(X_MIN, lossDollars));
  return (
    ((Math.log10(X_MAX) - Math.log10(clamped)) /
      (Math.log10(X_MAX) - Math.log10(X_MIN))) *
    100
  ).toFixed(3);
}

function yPct(netDollars: number): string {
  return (((Y_MAX - netDollars) / (Y_MAX - Y_MIN)) * 100).toFixed(3);
}

function fmtCents(c: number): string {
  const abs = (Math.abs(c) / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (c < 0 ? "−$" : "$") + abs;
}

function fmtAxis(v: number): string {
  const abs = Math.abs(v);
  const label = abs >= 1000 ? `$${abs / 1000}k` : `$${abs.toLocaleString("en-US")}`;
  return (v < 0 ? "−" : "") + label;
}

const LABEL_POS: Record<string, string> = {
  top: "left-1/2 -translate-x-1/2 bottom-[calc(100%+3px)]",
  bottom: "left-1/2 -translate-x-1/2 top-[calc(100%+3px)]",
  left: "right-[calc(100%+7px)] top-1/2 -translate-y-1/2",
  right: "left-[calc(100%+7px)] top-1/2 -translate-y-1/2",
  tl: "right-[calc(100%+1px)] bottom-[calc(100%-2px)]",
  tr: "left-[calc(100%+1px)] bottom-[calc(100%-2px)]",
  bl: "right-[calc(100%+1px)] top-[calc(100%-2px)]",
  br: "left-[calc(100%+1px)] top-[calc(100%-2px)]",
};

// One dot per replayed year: X is everything lost to penalties and
// collection (log scale, worse to the left), Y the closing treasury.
export default function TreasuryScatter() {
  const [tip, setTip] = useState<Point | null>(null);
  const points = scatter.points as Point[];

  return (
    <section id="discipline" className="bench-section scroll-mt-28">
      <div className="bench-head">
        <div className="bench-title-block">
          <h2>{scatter.title}</h2>
          <div className="bench-question">{scatter.note}</div>
        </div>
      </div>

      <div className="relative mt-8 mb-2 h-[420px] ml-14 mr-6 max-[780px]:ml-10 max-[780px]:h-[340px]">
        {/* horizontal gridlines + y labels */}
        {Y_GRID.map((v) => (
          <div key={v}>
            <div
              className="absolute left-0 right-0 border-t"
              style={{
                top: `${yPct(v)}%`,
                borderColor: v === 0 ? "#d9d7d2" : "#ecebe7",
              }}
            />
            <div
              className="absolute -left-14 w-12 text-right font-mono text-[0.68rem] text-text-dim -translate-y-1/2 max-[780px]:-left-10 max-[780px]:w-9 max-[780px]:text-[0.6rem]"
              style={{ top: `${yPct(v)}%` }}
            >
              {fmtAxis(v)}
            </div>
          </div>
        ))}
        {/* vertical gridlines + x labels */}
        {X_GRID.map((v) => (
          <div key={v}>
            <div
              className="absolute top-0 bottom-0 border-l border-[#ecebe7]"
              style={{ left: `${xPct(v)}%` }}
            />
            <div
              className="absolute top-[calc(100%+8px)] -translate-x-1/2 font-mono text-[0.68rem] text-text-dim max-[780px]:text-[0.6rem]"
              style={{ left: `${xPct(v)}%` }}
            >
              −${v.toLocaleString("en-US")}
            </div>
          </div>
        ))}

        {points.map((p) => {
          const loss = (p.penalties_cents + p.collection_cents) / 100;
          const x = xPct(loss);
          const y = yPct(p.net_worth_cents / 100);
          const provider = PROVIDERS[p.provider] ?? PROVIDERS.other;
          return (
            <div
              key={p.name}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div
                className="scatter-dot"
                onMouseEnter={() => setTip(p)}
                onMouseLeave={() => setTip(null)}
              >
                <Chip p={provider} />
              </div>
              <div
                className={`absolute whitespace-nowrap font-sans text-[0.74rem] font-medium text-text pointer-events-none max-[780px]:hidden ${
                  LABEL_POS[p.label] ?? LABEL_POS.top
                }`}
              >
                {p.name}
              </div>
              {tip?.name === p.name && (
                <div className="chart-tip !opacity-100 left-1/2 bottom-[calc(100%+10px)]">
                  <span className="tip-title">{p.name}</span>
                  <br />
                  <span className="tip-row">
                    Closing treasury: {fmtCents(p.net_worth_cents)}
                  </span>
                  <br />
                  <span className="tip-row">
                    Penalties: {fmtCents(p.penalties_cents)}
                  </span>
                  {p.collection_cents > 0 && (
                    <>
                      <br />
                      <span className="tip-row">
                        Collection: {fmtCents(p.collection_cents)}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="text-center font-mono text-[0.7rem] text-text-dim mt-8">
        Loss from penalties and collection (log scale)
      </div>

      <div className="bench-foot">
        <p className="bench-blurb">{scatter.footnote}</p>
        <div className="bench-stamp">{scatter.stamp}</div>
      </div>
    </section>
  );
}
