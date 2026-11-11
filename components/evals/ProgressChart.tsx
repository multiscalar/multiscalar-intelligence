"use client";

import { useEffect, useRef, useState } from "react";
import ModelMark from "@/components/evals/ModelMark";
import { niceTicks, r3 } from "@/lib/evals/chart";
import { labelStyle, placeLabels, segmentBox, type Box } from "@/lib/evals/labels";

export interface ProgressPoint {
  name: string;
  icon?: string;
  mark?: string;
  color: string;
  /** Release date, ms since epoch (UTC). */
  date: number;
  /** Index score: relative to a fixed reference, with no ceiling. */
  score: number;
}

const H = 440;
const DAY = 86400000;
const MONTH = 30.44 * DAY;
const PROJECT_MONTHS = 6;
// Logo radius, px.
const R = 14;

// Index score against model release date. The frontier steps up through
// every model that set a new record; a least-squares line through those
// record-setters gives the trend, extended as a projection.
//
// Every model gets its logo and, where it fits, its name; hover names any
// that found no room.
export default function ProgressChart({ points }: { points: ProgressPoint[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const plot = useRef<HTMLDivElement>(null);
  // Plot width in px, for placing labels without collisions. A fixed first
  // value keeps server and client renders identical.
  const [width, setWidth] = useState(1000);
  useEffect(() => {
    const el = plot.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const byDate = [...points].sort((a, b) => a.date - b.date || b.score - a.score);
  const frontier: ProgressPoint[] = [];
  for (const p of byDate) {
    if (!frontier.length || p.score > frontier[frontier.length - 1].score) {
      frontier.push(p);
    }
  }
  const onFrontier = new Set(frontier.map((p) => p.name));
  const record = frontier[frontier.length - 1];

  // Trend through the frontier, in points per month.
  const xs = frontier.map((p) => p.date / MONTH);
  const ys = frontier.map((p) => p.score);
  const mx = xs.reduce((s, v) => s + v, 0) / xs.length;
  const my = ys.reduce((s, v) => s + v, 0) / ys.length;
  const slope =
    xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) /
      xs.reduce((s, x) => s + (x - mx) ** 2, 0) || 0;
  // The index has no ceiling, so neither the trend nor the axis stops at 100.
  const trend = (ms: number) => my + slope * (ms / MONTH - mx);

  const t0 = byDate[0].date - MONTH;
  const lastDate = byDate[byDate.length - 1].date;
  const t1 = lastDate + PROJECT_MONTHS * MONTH;
  const yTicks = niceTicks(
    Math.min(...points.map((p) => p.score)) - 5,
    Math.max(trend(t1), ...points.map((p) => p.score)) + 3,
    5,
  );
  const y0 = yTicks[0];
  const y1 = yTicks[yTicks.length - 1];
  const px = (ms: number) => r3(((ms - t0) / (t1 - t0)) * 100);
  const py = (v: number) => r3((1 - (v - y0) / (y1 - y0)) * 100);

  // Quarter ticks.
  const quarters: number[] = [];
  const start = new Date(t0);
  let q = Date.UTC(start.getUTCFullYear(), Math.floor(start.getUTCMonth() / 3) * 3 + 3, 1);
  for (; q < t1; ) {
    quarters.push(q);
    const d = new Date(q);
    q = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 3, 1);
  }
  const qLabel = (ms: number) => {
    const d = new Date(ms);
    return `Q${Math.floor(d.getUTCMonth() / 3) + 1} ’${String(d.getUTCFullYear()).slice(2)}`;
  };

  const stepPath =
    frontier
      .map((p, i) =>
        i === 0
          ? `M${px(p.date)},${py(p.score)}`
          : `L${px(p.date)},${py(frontier[i - 1].score)} L${px(p.date)},${py(p.score)}`,
      )
      .join(" ") + ` L${px(lastDate)},${py(record.score)}`;
  const areaPath = `${stepPath} L${px(lastDate)},100 L${px(frontier[0].date)},100 Z`;

  // Name every model where the label clears every logo, the frontier line
  // and the names already placed: record-setters first, newest first, so
  // they keep the spots above-left of their steps.
  const toPx = (p: ProgressPoint) => ({
    x: (px(p.date) / 100) * width,
    y: (py(p.score) / 100) * H,
  });
  const lines: Box[] = [];
  frontier.forEach((p, i) => {
    if (!i) return;
    const a = toPx(frontier[i - 1]);
    const b = toPx(p);
    lines.push(segmentBox(a.x, a.y, b.x, a.y), segmentBox(b.x, a.y, b.x, b.y));
  });
  const labels = placeLabels(
    [...frontier.slice().reverse(), ...byDate.filter((p) => !onFrontier.has(p.name))].map(
      (p) => ({ id: p.name, ...toPx(p), text: p.name }),
    ),
    {
      width,
      height: H,
      radius: R,
      marks: points.map((p) => ({ ...toPx(p), r: R })),
      obstacles: lines,
      sides: ["top-left", "top-right", "left", "right", "bottom-right", "bottom-left", "top", "bottom"],
    },
  );

  const gain = record.score - frontier[0].score;
  const months = Math.round((record.date - frontier[0].date) / MONTH);
  const projected = trend(t1);

  return (
    <div>
      <div className="mb-12 grid grid-cols-3 border-y border-black/10 max-[700px]:mb-8 max-[700px]:grid-cols-2">
        <Stat label="Current record">
          <span className="inline-flex items-center gap-3">
            <ModelMark icon={record.icon} mark={record.mark} color={record.color} tone="light" size="md" />
            {record.score.toFixed(0)}
            <span className="truncate text-[0.95rem] font-medium tracking-normal text-black/55">
              {record.name}
            </span>
          </span>
        </Stat>
        <Stat label="Frontier trend">
          {slope >= 0 ? "+" : "−"}
          {Math.abs(slope).toFixed(1)}
          <Unit>pts / month</Unit>
        </Stat>
        <Stat label={`Gain in ${months} months`}>
          +{gain.toFixed(0)}
          <Unit>pts</Unit>
        </Stat>
      </div>

      <div
        ref={plot}
        className="relative ml-10 mr-2 max-[780px]:ml-8"
        style={{ height: H }}
        onMouseLeave={() => setHovered(null)}
      >
        {yTicks.map((t) => (
          <div key={`y${t}`}>
            <div
              className={`absolute inset-x-0 border-t ${t === y0 ? "border-black/15" : "border-black/[0.06]"}`}
              style={{ top: `${py(t)}%` }}
            />
            <span
              className="absolute -left-10 w-7 -translate-y-1/2 text-right text-[0.7rem] tabular-nums text-text-dim max-[780px]:-left-8 max-[780px]:w-6"
              style={{ top: `${py(t)}%` }}
            >
              {t}
            </span>
          </div>
        ))}
        {quarters.map((t) => (
          <span
            key={t}
            className="absolute top-[calc(100%+10px)] -translate-x-1/2 whitespace-nowrap text-[0.7rem] text-text-dim"
            style={{ left: `${px(t)}%` }}
          >
            {qLabel(t)}
          </span>
        ))}

        {/* Where the data ends and the projection begins */}
        <div
          className="absolute inset-y-0 border-l border-dashed border-black/20"
          style={{ left: `${px(lastDate)}%` }}
        >
          <span className="absolute left-2.5 top-0 whitespace-nowrap text-[0.7rem] font-medium text-black/45">
            Projection →
          </span>
        </div>

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          <path d={areaPath} fill="rgba(20,19,17,0.035)" />
          <line
            x1={px(frontier[0].date)}
            y1={py(trend(frontier[0].date))}
            x2={px(t1)}
            y2={py(projected)}
            stroke="rgba(20,19,17,0.35)"
            strokeWidth={1.5}
            strokeDasharray="4 5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={stepPath}
            fill="none"
            stroke="#141311"
            strokeWidth={2}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Every model: logo, and a name where it fits */}
        {points.map((p) => {
          const on = hovered === p.name;
          const side = labels.get(p.name);
          return (
            <div
              key={p.name}
              onMouseEnter={() => setHovered(p.name)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
                hovered && !on ? "opacity-30" : ""
              } ${on ? "z-30" : onFrontier.has(p.name) ? "z-20" : "z-10"}`}
              style={{ left: `${px(p.date)}%`, top: `${py(p.score)}%` }}
            >
              <span className={`block transition-transform duration-200 ${on ? "scale-125" : ""}`}>
                <ModelMark icon={p.icon} mark={p.mark} color={p.color} tone="light" size="md" title={p.name} />
              </span>
              {on ? (
                <Tooltip p={p} />
              ) : (
                side && (
                  <span
                    className="pointer-events-none absolute whitespace-nowrap text-[0.75rem] font-medium leading-4 text-black/75 max-[780px]:hidden"
                    style={labelStyle(side, R)}
                  >
                    {p.name}
                  </span>
                )
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 pl-10 text-[0.75rem] text-text-dim max-[780px]:pl-8">
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-5 bg-[#141311]" /> Frontier: best model released so far
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-5 border-t-[1.5px] border-dashed border-black/40" /> Trend
        </span>
      </div>
    </div>
  );
}

function Tooltip({ p }: { p: ProgressPoint }) {
  return (
    <span className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#141311] px-3 py-2 text-[0.72rem] leading-[1.5] text-white shadow-lg">
      <span className="font-semibold">{p.name}</span>
      <br />
      Released{" "}
      {new Date(p.date).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })}
    </span>
  );
}

function Unit({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-1.5 text-[0.95rem] font-medium tracking-normal text-black/55">
      {children}
    </span>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 border-black/10 px-6 py-6 first:pl-0 [&:not(:first-child)]:border-l max-[700px]:py-5 max-[700px]:first:col-span-2 max-[700px]:first:border-b max-[700px]:[&:nth-child(2)]:border-l-0 max-[700px]:[&:nth-child(2)]:pl-0 max-[700px]:[&:nth-child(3)]:pl-5 max-[700px]:[&:nth-child(3)]:pr-0">
      <div className="label text-text-dim">{label}</div>
      <div className="mt-3 flex items-baseline text-[clamp(1.4rem,2.4vw,2rem)] font-semibold tracking-[-0.03em] text-black tabular-nums">
        {children}
      </div>
    </div>
  );
}
