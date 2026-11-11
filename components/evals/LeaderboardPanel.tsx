"use client";

import { useEffect, useRef, useState } from "react";
import ModelMark from "@/components/evals/ModelMark";
import { r3 } from "@/lib/evals/chart";
import { useIndicator } from "@/components/useIndicator";
import type { LbData } from "@/lib/evals/leaderboard";

const ROW_H = 48;
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";
const LOSS = "#e08a5f";

// The benchmark's main chart: every ranked metric behind one set of pills.
// Rows are placed by rank, so switching metric re-ranks them in place; bars
// share one zero line, with losses drawn in warm orange to its left. The
// card beside the chart details whichever model is hovered (the leader by
// default).
export default function LeaderboardPanel({ data }: { data: LbData }) {
  const ref = useRef<HTMLDivElement>(null);
  const pills = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [metricId, setMetricId] = useState(
    data.metrics.some((m) => m.id === data.defaultMetric)
      ? data.defaultMetric
      : data.metrics[0].id,
  );
  const [hovered, setHovered] = useState<string | null>(null);
  const pill = useIndicator(pills, metricId);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShown(true),
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const metric = data.metrics.find((m) => m.id === metricId)!;
  const rows = metric.rows;
  const rankOf = new Map(rows.map((r, i) => [r.name, i]));
  const rowOf = new Map(rows.map((r) => [r.name, r]));
  const modelOf = new Map(data.models.map((m) => [m.name, m]));

  // One scale per metric: positives right of zero, negatives left of it.
  // Zero sits proportionally, clamped so neither side shrinks to slivers.
  const maxPos =
    Math.max(...rows.map((r) => r.value + (r.stderr ?? 0)), 0) || 1;
  const maxNeg = Math.max(...rows.map((r) => -r.value), 0) || 1;
  const signed = rows.some((r) => r.value < 0);
  const proportional = (maxNeg / (maxNeg + maxPos)) * 100;
  const zero = signed ? Math.min(Math.max(proportional, 25), 70) : 0;
  const at = (v: number) =>
    r3(v >= 0 ? zero + (v / maxPos) * (100 - zero) : zero - (-v / maxNeg) * zero);

  const leader =
    rows.find((r) => !modelOf.get(r.name)?.baseline)?.name ?? rows[0].name;
  const activeName = hovered && rowOf.has(hovered) ? hovered : leader;
  const active = modelOf.get(activeName)!;
  const activeRank = rankOf.get(activeName)!;

  return (
    <div ref={ref}>
      <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
        <div>
          <div className="label text-white/50 mb-3">
            Leaderboard
          </div>
          <h2
            key={metric.id}
            className="font-sans text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold leading-[1.1] tracking-[-0.03em] animate-fade-up"
          >
            {metric.short}
          </h2>
          <p className="mt-2 text-[0.85rem] text-white/50">
            {metric.higherIsBetter ? "Higher is better" : "Lower is better"} ·{" "}
            {metric.label}
          </p>
        </div>
        {data.metrics.length > 1 && (
          <div
            ref={pills}
            role="tablist"
            aria-label="Metric"
            className="relative inline-flex flex-wrap gap-1 rounded-full bg-white/[0.06] p-1"
          >
            <span aria-hidden className="rounded-full bg-white" style={pill} />
            {data.metrics.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                data-indicator={m.id}
                aria-selected={m.id === metricId}
                onClick={() => setMetricId(m.id)}
                className={`relative rounded-full px-4 py-[0.45rem] text-[0.8rem] font-medium cursor-pointer transition-colors duration-300 ${
                  m.id === metricId
                    ? "text-black"
                    : "text-white/65 hover:text-white"
                }`}
              >
                {m.short}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_280px] gap-10 items-start max-[1000px]:grid-cols-1">
        <ol
          className="relative"
          style={{ height: rows.length * ROW_H }}
          onMouseLeave={() => setHovered(null)}
          aria-label={`Models ranked by ${metric.label}`}
        >
          {data.models.map((m) => {
            const row = rowOf.get(m.name);
            const rank = rankOf.get(m.name);
            const visible = row !== undefined && rank !== undefined;
            const isActive = m.name === activeName;
            const v = row?.value ?? 0;
            const left = Math.min(at(v), zero);
            const width = Math.max(Math.abs(at(v) - zero), 0.4);
            const loss = v < 0;
            const fill = m.baseline
              ? "repeating-linear-gradient(135deg, rgba(242,235,221,0.45) 0 2px, transparent 2px 6px)"
              : loss
                ? LOSS
                : "#f2ebdd";
            return (
              <li
                key={m.name}
                aria-hidden={!visible || undefined}
                onMouseEnter={() => visible && setHovered(m.name)}
                onClick={() => visible && setHovered(m.name)}
                className={`absolute inset-x-0 grid grid-cols-[1.5rem_minmax(0,12rem)_minmax(0,1fr)_5.5rem] items-center gap-4 rounded-xl transition-[transform,opacity] duration-[650ms] ${EASE} max-[600px]:grid-cols-[1.1rem_minmax(0,8.5rem)_minmax(0,1fr)_4.6rem] max-[600px]:gap-2.5 ${
                  visible ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                style={{
                  height: ROW_H,
                  transform: `translateY(${(visible ? rank : rows.length) * ROW_H}px)`,
                }}
              >
                <span className="text-[0.75rem] tabular-nums text-white/50">
                  {visible ? rank + 1 : ""}
                </span>
                <span className="flex min-w-0 items-center gap-3">
                  <ModelMark
                    icon={m.icon}
                    mark={m.mark}
                    color={m.color}
                    title={m.provider}
                  />
                  <span
                    className={`truncate text-[0.9rem] font-medium transition-colors duration-300 ${
                      isActive ? "text-white" : m.baseline ? "text-white/45" : "text-white/75"
                    }`}
                  >
                    {m.name}
                  </span>
                </span>
                <span className="relative h-2 rounded-full bg-white/[0.05]">
                  {signed && (
                    <span
                      className="absolute -top-1.5 -bottom-1.5 w-px bg-white/25"
                      style={{ left: `${zero}%` }}
                    />
                  )}
                  {/* Diverging bars stay square where they meet the zero line
                      and round only at their outer end. */}
                  <span
                    className={`absolute inset-y-0 transition-[left,width,opacity] duration-[900ms] ${EASE} ${
                      !signed ? "rounded-full" : loss ? "rounded-l-full" : "rounded-r-full"
                    }`}
                    style={{
                      left: `${shown ? left : zero}%`,
                      width: `${shown ? width : 0}%`,
                      background: fill,
                      opacity: isActive || m.baseline ? 1 : 0.45,
                    }}
                  />
                  {row?.stderr !== undefined && shown && (
                    <span
                      aria-hidden
                      className="absolute top-1/2 h-3 -translate-y-1/2 border-x border-white/70"
                      style={{
                        left: `${at(v - row.stderr)}%`,
                        width: `${at(v + row.stderr) - at(v - row.stderr)}%`,
                      }}
                    >
                      <span className="absolute inset-x-0 top-1/2 h-px bg-white/70" />
                    </span>
                  )}
                </span>
                <span
                  className={`text-right text-[0.88rem] font-semibold tabular-nums transition-colors duration-300 ${
                    isActive ? "text-white" : loss ? "text-[#e08a5f]/80" : "text-white/70"
                  }`}
                >
                  {row?.display}
                </span>
              </li>
            );
          })}
        </ol>

        <aside className="sticky top-28 rounded-[20px] border border-white/[0.08] card-dark p-6">
          <div className="flex items-center gap-3">
            <ModelMark
              icon={active.icon}
              mark={active.mark}
              color={active.color}
              size="lg"
              title={active.provider}
            />
            <div className="min-w-0">
              <div className="truncate text-[1.05rem] font-semibold">
                {active.name}
              </div>
              <div className="text-[0.78rem] text-white/50">
                {active.baseline ? "Scripted baseline" : active.provider}
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-[2.4rem] font-semibold leading-none tracking-[-0.03em] tabular-nums">
              #{activeRank + 1}
            </span>
            <span className="text-[0.82rem] text-white/50">
              of {rows.length}
            </span>
          </div>
          <dl className="mt-6 border-t border-white/10">
            {active.details.map((d) => (
              <div
                key={d.label}
                className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] py-2.5 text-[0.82rem]"
              >
                <dt className="text-white/55">{d.label}</dt>
                <dd className="font-semibold tabular-nums">{d.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

    </div>
  );
}
