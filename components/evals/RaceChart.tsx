"use client";

import { useEffect, useId, useRef, useState } from "react";
import ModelMark from "@/components/evals/ModelMark";
import { useIndicator } from "@/components/useIndicator";
import { fmtTick, niceTicks, r3 } from "@/lib/evals/chart";
import type { BenchSeries } from "@/lib/evals/examples";
import { fmt } from "@/lib/evals/score";

const W = 1000;
const H = 420;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const HIGHLIGHT = 3;

// Every model's balance across the simulated year, one line each. The top
// finishers are drawn in their brand colour, the rest in grey; hover the
// chart to scrub through the year, or a model chip to follow one line.
export default function RaceChart({ data }: { data: BenchSeries }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [day, setDay] = useState<number | null>(null);
  // A hovered chip previews a line; a clicked one locks it (click again to
  // release), so its numbers stay in the scrubber while you explore.
  const [preview, setPreview] = useState<string | null>(null);
  const [locked, setLocked] = useState<string | null>(null);
  const focus = preview ?? locked;
  const clip = `race${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [zoom, setZoom] = useState<"pack" | "full">("pack");
  const pills = useRef<HTMLDivElement>(null);
  const pill = useIndicator(pills, zoom);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShown(true),
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const finals = [...data.series].sort(
    (a, b) => b.points[data.days] - a.points[data.days],
  );
  const top = new Set(
    finals.filter((s) => !s.baseline).slice(0, HIGHLIGHT).map((s) => s.name),
  );
  // The pack: models that never lost more than half the starting balance.
  // When a few collapses would flatten everyone else into one line, the
  // default view fits the pack and lets the collapses fall off the bottom.
  const all = data.series.flatMap((s) => s.points);
  const pack = data.series.filter(
    (s) => Math.min(...s.points) > data.start * 0.5,
  );
  const packPts = pack.flatMap((s) => s.points);
  const fullSpan = Math.max(...all) - Math.min(...all, 0);
  const packSpan = packPts.length
    ? Math.max(...packPts) - Math.min(...packPts)
    : fullSpan;
  const canZoom = pack.length >= 3 && pack.length < data.series.length && packSpan * 3 < fullSpan;
  const zoomed = canZoom && zoom === "pack";
  const lo = zoomed ? Math.min(...packPts) : Math.min(...all, 0);
  const hi = zoomed ? Math.max(...packPts) : Math.max(...all);
  const ticks = niceTicks(lo, hi, 5);
  const y0 = ticks[0];
  const y1 = ticks[ticks.length - 1];
  const below = zoomed
    ? data.series.filter((s) => Math.min(...s.points) < y0).length
    : 0;
  const x = (t: number) => r3((t / data.days) * W);
  const y = (v: number) => r3(H - ((v - y0) / (y1 - y0)) * H);
  const path = (pts: number[]) =>
    pts.map((v, t) => `${t ? "L" : "M"}${x(t).toFixed(1)},${y(v).toFixed(1)}`).join("");

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const t = Math.round(((e.clientX - r.left) / r.width) * data.days);
    setDay(Math.min(data.days, Math.max(0, t)));
  };

  const lineColor = (s: (typeof data.series)[number]) =>
    focus ? (s.name === focus ? s.color : "rgba(20,19,17,0.08)")
    : top.has(s.name) ? s.color : "rgba(20,19,17,0.16)";
  // Draw grey lines first so the coloured ones sit on top.
  const order = [...data.series].sort(
    (a, b) =>
      Number(a.name === focus || (!focus && top.has(a.name))) -
      Number(b.name === focus || (!focus && top.has(b.name))),
  );

  // End-of-line labels for the leaders, nudged apart so they never overlap.
  const LABEL_GAP = 22;
  const labels = finals
    .filter((s) => top.has(s.name))
    .map((s) => ({ s, at: y(s.points[data.days]) }))
    .sort((a, b) => a.at - b.at);
  for (let i = 1; i < labels.length; i++) {
    labels[i].at = Math.max(labels[i].at, labels[i - 1].at + LABEL_GAP);
  }

  const at = day ?? data.days;
  const ranked = [...data.series].sort((a, b) => b.points[at] - a.points[at]);
  const date = new Date(Date.UTC(2025, 0, 1) + at * 86400000);

  return (
    <div ref={ref}>
      {canZoom && (
        <div className="mb-8 flex justify-end">
          <div
            ref={pills}
            role="tablist"
            aria-label="Vertical range"
            className="relative inline-flex gap-1 rounded-full bg-black/[0.05] p-1"
          >
            <span
              aria-hidden
              className="rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
              style={pill}
            />
            {(
              [
                ["pack", "Top of the field"],
                ["full", "Full range"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                role="tab"
                data-indicator={k}
                aria-selected={zoom === k}
                onClick={() => setZoom(k)}
                className={`relative rounded-full px-4 py-[0.45rem] text-[0.8rem] font-medium cursor-pointer transition-colors duration-300 ${
                  zoom === k ? "text-black" : "text-black/55 hover:text-black"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="relative ml-14 mr-36 max-[780px]:ml-11 max-[780px]:mr-2" style={{ height: H }}>
        {ticks.map((t) => (
          <div key={t}>
            <div
              className={`absolute inset-x-0 border-t ${t === 0 ? "border-black/25" : "border-black/[0.06]"}`}
              style={{ top: `${(y(t) / H) * 100}%` }}
            />
            <span
              className="absolute -left-14 w-12 -translate-y-1/2 text-right text-[0.7rem] tabular-nums text-text-dim max-[780px]:-left-11 max-[780px]:w-9"
              style={{ top: `${(y(t) / H) * 100}%` }}
            >
              {fmtTick(t, data.unit)}
            </span>
          </div>
        ))}
        {below > 0 && (
          <button
            type="button"
            onClick={() => setZoom("full")}
            className="absolute bottom-2 left-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[0.72rem] font-medium text-black shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:text-black/65"
          >
            ↓ {below} {below === 1 ? "model falls" : "models fall"} below {fmtTick(y0, data.unit)}
          </button>
        )}
        {MONTHS.map((m, i) => (
          <span
            key={m}
            className="absolute top-[calc(100%+10px)] -translate-x-1/2 text-[0.7rem] text-text-dim"
            style={{ left: `${((i * 365) / 12 / data.days) * 100}%` }}
          >
            {m}
          </span>
        ))}

        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-label={`Balance over the simulated year for ${data.series.length} models`}
        >
          <defs>
            <clipPath id={clip}>
              <rect
                x={0}
                y={-4}
                width={W}
                height={H + 8}
                style={{
                  transform: shown ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "0 0",
                  transition: "transform 2.2s cubic-bezier(0.22,1,0.36,1)",
                }}
              />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clip})`}>
          {order.map((s) => {
            const emphasised = s.name === focus || (!focus && top.has(s.name));
            return (
              <path
                key={s.name}
                d={path(s.points)}
                fill="none"
                stroke={lineColor(s)}
                strokeWidth={emphasised ? 2.25 : 1.25}
                strokeDasharray={s.baseline ? "4 4" : undefined}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                style={{ transition: "stroke 0.3s" }}
              />
            );
          })}
          </g>
        </svg>

        {/* End-of-line labels: the leaders, or just the focused model. */}
        {(focus
          ? data.series
              .filter((s) => s.name === focus)
              .map((s) => ({ s, at: y(Math.max(y0, s.points[data.days])) }))
          : labels
        ).map(({ s, at: top }) => (
            <span
              key={s.name}
              className={`absolute left-[calc(100%+10px)] flex -translate-y-1/2 items-center gap-1.5 whitespace-nowrap text-[0.75rem] font-medium text-black transition-opacity duration-700 max-[780px]:hidden ${
                shown ? "opacity-100 delay-[1800ms]" : "opacity-0"
              }`}
              style={{ top: `${r3((top / H) * 100)}%` }}
            >
              <ModelMark icon={s.icon} mark={s.mark} color={s.color} tone="light" size="sm" />
              {s.name}
            </span>
          ))}

        {/* Scrubber */}
        <div
          className="absolute inset-0 cursor-crosshair"
          onMouseMove={onMove}
          onMouseLeave={() => setDay(null)}
        >
          {day !== null && (
            <>
              <div
                className="pointer-events-none absolute inset-y-0 w-px bg-black/30"
                style={{ left: `${(x(day) / W) * 100}%` }}
              />
              <div
                className={`pointer-events-none absolute top-2 z-10 w-56 rounded-xl bg-[#141311] p-3 text-white shadow-lg ${
                  day > data.days * 0.6 ? "-translate-x-[calc(100%+12px)]" : "translate-x-3"
                }`}
                style={{ left: `${(x(day) / W) * 100}%` }}
              >
                <div className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-white/50">
                  Day {day} · {date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}
                </div>
                {(focus ? ranked.filter((s) => s.name === focus) : ranked.slice(0, 5)).map((s) => (
                  <div key={s.name} className="flex items-center justify-between gap-3 py-0.5 text-[0.75rem]">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <ModelMark icon={s.icon} mark={s.mark} color={s.color} size="sm" />
                      <span className="truncate">{s.name}</span>
                    </span>
                    <span className="font-semibold tabular-nums">{fmt(s.points[day], data.unit)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-1.5">
        {finals.map((s) => (
          <button
            key={s.name}
            type="button"
            aria-pressed={locked === s.name}
            onClick={() => {
              const lock = locked === s.name ? null : s.name;
              setLocked(lock);
              // A locked line that drops out of the zoomed view: show it all.
              if (lock && zoomed && Math.min(...s.points) < y0) setZoom("full");
            }}
            onMouseEnter={() => setPreview(s.name)}
            onMouseLeave={() => setPreview(null)}
            onFocus={() => setPreview(s.name)}
            onBlur={() => setPreview(null)}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border py-1 pl-1 pr-3 text-[0.75rem] font-medium transition-colors ${
              locked === s.name
                ? "border-black bg-black text-white"
                : focus === s.name
                  ? "border-black/40 bg-black/[0.04] text-black"
                  : "border-black/10 text-black/70 hover:border-black/30"
            }`}
          >
            <ModelMark icon={s.icon} mark={s.mark} color={s.color} tone="light" size="sm" />
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
