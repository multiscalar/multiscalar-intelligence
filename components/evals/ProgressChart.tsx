"use client";

import { useEffect, useRef, useState } from "react";
import ModelMark from "@/components/evals/ModelMark";
import { niceTicks, r3 } from "@/lib/evals/chart";

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
// Rough label metrics for collision checks (0.75rem Montserrat).
const CHAR_W = 6.8;
const LABEL_H = 16;

type Box = { l: number; r: number; t: number; b: number };
const overlaps = (a: Box, b: Box) =>
  a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;

// Index score against model release date. The frontier steps up through
// every model that set a new record; a least-squares line through those
// record-setters gives the trend, extended as a projection.
//
// Only record-setters get a logo and a name: each name sits above and to the
// left of its step, a region the (rising) frontier never enters. Every other
// model is a small dot, named on hover.
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

  // Place frontier names, newest first: above-left of the point, or
  // above-right when there is no room on the left; skip any that would
  // collide with a placed name or another record's logo.
  const toPx = (p: ProgressPoint) => ({
    x: (px(p.date) / 100) * width,
    y: (py(p.score) / 100) * H,
  });
  const obstacles: Box[] = frontier.map((p) => {
    const { x, y } = toPx(p);
    return { l: x - 12, r: x + 12, t: y - 12, b: y + 12 };
  });
  const labels = new Map<string, "left" | "right">();
  for (const p of [...frontier].reverse()) {
    const { x, y } = toPx(p);
    const w = p.name.length * CHAR_W;
    const t = y - 14 - LABEL_H;
    const left: Box = { l: x - 6 - w, r: x - 6, t, b: t + LABEL_H };
    const right: Box = { l: x + 6, r: x + 6 + w, t, b: t + LABEL_H };
    const own = (o: Box) => Math.abs((o.l + o.r) / 2 - x) < 1 && Math.abs((o.t + o.b) / 2 - y) < 1;
    const free = (b: Box) =>
      b.l >= 0 && b.r <= width && b.t >= 0 && !obstacles.some((o) => !own(o) && overlaps(o, b));
    const side = free(left) ? "left" : free(right) ? "right" : null;
    if (!side) continue;
    labels.set(p.name, side);
    obstacles.push(side === "left" ? left : right);
  }

  const gain = record.score - frontier[0].score;
  const months = Math.round((record.date - frontier[0].date) / MONTH);
  const projected = trend(t1);

  return (
    <div>
      <div className="mb-12 grid grid-cols-3 border-y border-black/10 max-[700px]:grid-cols-1">
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

        {/* Other models: plain dots, behind the records */}
        {points
          .filter((p) => !onFrontier.has(p.name))
          .map((p) => {
            const on = hovered === p.name;
            return (
              <div
                key={p.name}
                onMouseEnter={() => setHovered(p.name)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 ${on ? "z-30" : ""}`}
                style={{ left: `${px(p.date)}%`, top: `${py(p.score)}%` }}
              >
                <span
                  className={`block h-[7px] w-[7px] rounded-full transition-colors duration-200 ${
                    on ? "bg-black" : "bg-black/20"
                  }`}
                />
                {on && <Tooltip p={p} />}
              </div>
            );
          })}

        {/* Record-setters: logo, and a name where it fits */}
        {frontier.map((p) => {
          const on = hovered === p.name;
          const side = labels.get(p.name);
          return (
            <div
              key={p.name}
              onMouseEnter={() => setHovered(p.name)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 ${on ? "z-30" : "z-10"}`}
              style={{ left: `${px(p.date)}%`, top: `${py(p.score)}%` }}
            >
              <span className={`block transition-transform duration-200 ${on ? "scale-125" : ""}`}>
                <ModelMark icon={p.icon} mark={p.mark} color={p.color} tone="light" size="sm" title={p.name} />
              </span>
              {on ? (
                <Tooltip p={p} />
              ) : (
                side && (
                  <span
                    className={`pointer-events-none absolute bottom-[calc(100%+4px)] whitespace-nowrap text-[0.75rem] font-medium text-black/75 max-[780px]:hidden ${
                      side === "left" ? "right-[calc(50%+6px)]" : "left-[calc(50%+6px)]"
                    }`}
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
        <span className="inline-flex items-center gap-2">
          <span className="h-[7px] w-[7px] rounded-full bg-black/20" /> Other models
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
    <div className="min-w-0 border-black/10 px-6 py-6 first:pl-0 [&:not(:first-child)]:border-l max-[700px]:border-l-0 max-[700px]:px-0 max-[700px]:[&:not(:first-child)]:border-t">
      <div className="label text-text-dim">{label}</div>
      <div className="mt-3 flex items-baseline text-[clamp(1.4rem,2.4vw,2rem)] font-semibold tracking-[-0.03em] text-black tabular-nums">
        {children}
      </div>
    </div>
  );
}
