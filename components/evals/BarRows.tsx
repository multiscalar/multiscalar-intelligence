"use client";

import Chip from "./Chip";
import { providerOf } from "@/lib/evals/providers";
import { fmt, exploitScore, scoredModels, type Row } from "@/lib/evals/score";
import type { BenchData, Metric } from "@/lib/evals/types";

function Tip({ d, row }: { d: BenchData; row: Row }) {
  const lines: React.ReactNode[] = [
    <span key="t" className="tip-title">
      {row.model.name}
    </span>,
    <span key="p" className="tip-row">
      {providerOf(row.model).label}
    </span>,
  ];
  if (d.bench === "exploitability") {
    Object.keys(d.games!).forEach((g) => {
      const label = d.metrics.find((m) => m.id === g)!.label;
      lines.push(
        <span key={g} className="tip-row">
          {label}: {fmt(exploitScore(row.model, g, d.games!), "%")}
        </span>
      );
    });
  } else if (d.bench === "vending-bench-2") {
    const se = row.model.stderr;
    lines.push(
      <span key="nw" className="tip-row">
        Net worth: {fmt(row.value, "$")}
        {se ? " ± $" + Math.round(se).toLocaleString("en-US") : ""}
      </span>
    );
  } else {
    d.metrics
      .filter((m) => typeof row.model.scores[m.id] === "number")
      .forEach((m) => {
        lines.push(
          <span key={m.id} className="tip-row">
            {m.label}: {fmt(row.model.scores[m.id], m.unit)}
          </span>
        );
      });
    const runs = row.model.runs;
    const missed = row.model.missed;
    if (typeof runs === "number") {
      lines.push(
        <span key="runs" className="tip-row">
          {runs} seeded runs
          {typeof missed === "number"
            ? ` · ${missed} missed payment${missed === 1 ? "" : "s"}`
            : ""}
        </span>
      );
    }
  }
  return (
    <div className="chart-tip lb-tip">
      {lines.map((l, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {l}
        </span>
      ))}
    </div>
  );
}

// idler-style horizontal leaderboard: one row per model, with provider chip and
// name, a track with a bar in the provider's color, the value at the right
// (± stderr where the benchmark reports one). Signed metrics share one
// zero axis inside the track, negatives extending left.
export default function BarRows({
  d,
  metric,
}: {
  d: BenchData;
  metric: string;
}) {
  const metricDef: Metric = d.metrics.find((m) => m.id === metric)!;
  const rows = scoredModels(d, metric);

  const signed = rows.some((r) => r.value < 0);
  const maxPos = Math.max(...rows.map((r) => r.value), 0) || 1;
  const maxNeg = Math.max(...rows.map((r) => -r.value), 0) || 1;
  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.value))) || 1;
  // Zero sits proportionally so a dollar reads the same left or right of it.
  const zeroPct = signed ? (maxNeg / (maxNeg + maxPos)) * 100 : 0;

  return (
    <div className="lb-rows">
      {rows.map((row) => {
        const p = providerOf(row.model);
        const v = row.value;
        const barStyle = !signed
          ? {
              left: 0,
              width: `${Math.max((Math.abs(v) / maxAbs) * 100, 0.4)}%`,
              background: p.color,
            }
          : v >= 0
            ? {
                left: `${zeroPct}%`,
                width: `${Math.max((v / (maxNeg + maxPos)) * 100, 0.3)}%`,
                background: p.color,
              }
            : {
                right: `${100 - zeroPct}%`,
                width: `${Math.max((-v / (maxNeg + maxPos)) * 100, 0.3)}%`,
                background: p.color,
              };
        const se = d.bench === "vending-bench-2" ? row.model.stderr : undefined;
        return (
          <div className="lb-row" key={row.model.name}>
            <Tip d={d} row={row} />
            <span className="lb-name">
              <Chip p={p} />
              <span>{row.model.name}</span>
            </span>
            <span className="lb-track">
              {signed && (
                <span className="lb-zero" style={{ left: `${zeroPct}%` }} />
              )}
              <span
                className={`lb-bar${signed && v < 0 ? " neg" : ""}`}
                style={barStyle}
              />
            </span>
            <span className="lb-value">
              {fmt(v, metricDef.unit)}
              {typeof se === "number" && (
                <span className="lb-se">
                  {" "}
                  ± ${Math.round(se).toLocaleString("en-US")}
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
