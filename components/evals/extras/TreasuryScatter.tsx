"use client";

import { useState } from "react";
import ChartCard from "../ChartCard";
import ModelMark from "../ModelMark";
import { useWidth } from "../useWidth";
import { labelStyle, placeLabels } from "@/lib/evals/labels";
import { PROVIDER_ICONS } from "@/lib/evals/provider-icons";
import { logoColor, providerOf } from "@/lib/evals/providers";
import type { BenchModel } from "@/lib/evals/types";
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

const H = 440;
const R = 10; // logo disc radius, px

// One logo per replayed year: X is everything lost to penalties and
// collection (log scale, worse to the left), Y the closing treasury. Names
// go wherever they clear every logo and each other; hover names the rest.
export default function TreasuryScatter() {
  const [tip, setTip] = useState<Point | null>(null);
  const [plot, width] = useWidth<HTMLDivElement>();
  const points = scatter.points as Point[];
  const loss = (p: Point) => (p.penalties_cents + p.collection_cents) / 100;
  const pos = (p: Point) => ({
    x: (Number(xPct(loss(p))) / 100) * width,
    y: (Number(yPct(p.net_worth_cents / 100)) / 100) * H,
  });
  const labels = placeLabels(
    // Best and worst years first: the extremes are the story.
    [...points]
      .sort((a, b) => Math.abs(b.net_worth_cents) - Math.abs(a.net_worth_cents))
      .map((p) => ({ id: p.name, ...pos(p), text: p.name })),
    {
      width,
      height: H,
      radius: R,
      marks: points.map((p) => ({ ...pos(p), r: R })),
      sides: ["right", "left", "top", "bottom", "top-right", "top-left", "bottom-right", "bottom-left"],
    },
  );

  return (
    <ChartCard
      id="discipline"
      label="Discipline"
      title={scatter.title}
      description={scatter.note}
    >

      <div
        ref={plot}
        className="relative mt-4 mb-2 ml-14 mr-6 max-[780px]:ml-10"
        style={{ height: H }}
      >
        {/* horizontal gridlines + y labels */}
        {Y_GRID.map((v) => (
          <div key={v}>
            <div
              className="absolute left-0 right-0 border-t"
              style={{
                top: `${yPct(v)}%`,
                borderColor: v === 0 ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.06)",
              }}
            />
            <div
              className="absolute -left-14 w-12 text-right text-[0.7rem] tabular-nums text-text-dim -translate-y-1/2 max-[780px]:-left-10 max-[780px]:w-9 max-[780px]:text-[0.6rem]"
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
              className="absolute top-0 bottom-0 border-l border-black/[0.06]"
              style={{ left: `${xPct(v)}%` }}
            />
            <div
              className="absolute top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap text-[0.7rem] tabular-nums text-text-dim max-[780px]:text-[0.6rem]"
              style={{ left: `${xPct(v)}%` }}
            >
              −${v.toLocaleString("en-US")}
            </div>
          </div>
        ))}

        {points.map((p) => {
          const x = xPct(loss(p));
          const y = yPct(p.net_worth_cents / 100);
          // Resolve through the aliases ("qwen" is Alibaba).
          const provider = providerOf({ name: p.name, provider: p.provider } as BenchModel);
          const side = labels.get(p.name);
          const on = tip?.name === p.name;
          return (
            <div
              key={p.name}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
                tip && !on ? "opacity-35" : ""
              } ${on ? "z-30" : "z-10"}`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div
                className={`transition-transform duration-200 ${on ? "scale-125" : ""}`}
                onMouseEnter={() => setTip(p)}
                onMouseLeave={() => setTip(null)}
              >
                <ModelMark
                  icon={provider.icon ? PROVIDER_ICONS[provider.icon] : undefined}
                  mark={provider.mark}
                  color={logoColor(provider)}
                  tone="light"
                  size="sm"
                  title={p.name}
                />
              </div>
              {side && !on && (
                <div
                  className="pointer-events-none absolute whitespace-nowrap font-sans text-[0.75rem] font-medium leading-4 text-black/75 max-[780px]:hidden"
                  style={labelStyle(side, R)}
                >
                  {p.name}
                </div>
              )}
              {on && (
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
      <div className="text-center text-[0.75rem] text-text-dim mt-10">
        Loss from penalties and collection (log scale)
      </div>

    </ChartCard>
  );
}
