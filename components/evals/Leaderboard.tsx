"use client";

import { useEffect, useState } from "react";
import { BENCHES, MAX_BARS, loadBench } from "@/lib/evals/benches";
import { providerOf, type Provider } from "@/lib/evals/providers";
import { PROVIDER_ICONS } from "@/lib/evals/provider-icons";
import type { BenchData, BenchModel, Metric } from "@/lib/evals/types";

interface Row {
  model: BenchModel;
  value: number;
}

// ----- scoring -----

// Exploitability: delta extracted surplus as % of the game's feasible surplus;
// "overall" is the unweighted mean across the four games.
function exploitScore(
  model: BenchModel,
  metric: string,
  games: NonNullable<BenchData["games"]>
): number {
  const norm = (g: string) =>
    (model.deltaSurplus![g] / games[g].feasibleSurplus) * 100;
  if (metric === "overall") {
    const keys = Object.keys(games);
    return keys.reduce((s, g) => s + norm(g), 0) / keys.length;
  }
  return norm(metric);
}

function scoredModels(d: BenchData, metric: string): Row[] {
  const higherIsBetter =
    d.metrics.find((m) => m.id === metric)!.higherIsBetter !== false;
  const rows = d.models.map((m) => ({
    model: m,
    value:
      d.bench === "exploitability"
        ? exploitScore(m, metric, d.games!)
        : m.scores[metric],
  }));
  // Explicit tiebreak by name: two models with equal scores must not swap places
  // between renders or regenerations.
  rows.sort((a, b) => {
    const diff = higherIsBetter ? b.value - a.value : a.value - b.value;
    return diff !== 0 ? diff : a.model.name.localeCompare(b.model.name);
  });
  return rows;
}

// ----- formatting -----

function fmt(value: number, unit?: string): string {
  if (typeof value !== "number" || !isFinite(value)) return "n/a";
  if (unit === "$") {
    const abs = Math.abs(Math.round(value)).toLocaleString("en-US");
    return (value < 0 ? "−$" : "$") + abs;
  }
  return value.toFixed(value >= 100 ? 0 : 1) + "%";
}

function Chip({ p }: { p: Provider }) {
  const path = p.icon ? PROVIDER_ICONS[p.icon] : undefined;
  return (
    <span className="bar-chip" title={p.label} aria-label={p.label}>
      {path ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={path} fill={p.color} />
        </svg>
      ) : (
        <span className="chip-mark" style={{ color: p.color }}>
          {p.mark || "•"}
        </span>
      )}
    </span>
  );
}

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
    // Skip views that are not per-model scores (e.g. the head-to-head matrix).
    d.metrics
      .filter((m) => typeof row.model.scores[m.id] === "number")
      .forEach((m) => {
        lines.push(
          <span key={m.id} className="tip-row">
            {m.label}: {fmt(row.model.scores[m.id], m.unit)}
          </span>
        );
      });
  }
  return (
    <div className="chart-tip">
      {lines.map((l, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {l}
        </span>
      ))}
    </div>
  );
}

// ----- bar chart -----

interface Scale {
  signed: boolean;
  maxPos: number;
  maxNeg: number;
  maxVal: number;
}

function BarCol({
  d,
  row,
  rank,
  scale,
  metricDef,
  isTail,
}: {
  d: BenchData;
  row: Row;
  rank: number;
  scale: Scale;
  metricDef: Metric;
  isTail?: boolean;
}) {
  const p = providerOf(row.model);
  if (!scale.signed) {
    const h = Math.max(9, (Math.abs(row.value) / scale.maxVal) * 100);
    return (
      <div className="bar-col">
        <Tip d={d} row={row} />
        {isTail && <span className="bar-rank">#{rank}</span>}
        <span className="bar-value">{fmt(row.value, metricDef.unit)}</span>
        <div className="bar" style={{ height: `${h}%`, background: p.color }}>
          <Chip p={p} />
        </div>
        <span className="bar-name">{row.model.name}</span>
      </div>
    );
  }
  // Signed columns can be arbitrarily short, so the provider chip lives in
  // an aligned row between the chart and the names instead of inside the bar.
  const posPct = (scale.maxPos / (scale.maxPos + scale.maxNeg)) * 100;
  const v = row.value;
  const hPos = v >= 0 ? Math.min(100, Math.max(4, (v / scale.maxPos) * 100)) : 0;
  const hNeg = v < 0 ? Math.min(100, Math.max(4, (-v / scale.maxNeg) * 100)) : 0;
  return (
    <div className="bar-col">
      <Tip d={d} row={row} />
      {isTail && <span className="bar-rank">#{rank}</span>}
      <div className="bar-track">
        <div className="bar-zone pos" style={{ height: `${posPct}%` }}>
          <span className="bar-value">{fmt(v, metricDef.unit)}</span>
          {v >= 0 && (
            <div
              className="bar chipless"
              style={{ height: `${hPos}%`, background: p.color }}
            />
          )}
        </div>
        <div className="bar-zone neg" style={{ height: `${100 - posPct}%` }}>
          {v < 0 && (
            <div
              className="bar chipless neg"
              style={{ height: `${hNeg}%`, background: p.color }}
            />
          )}
        </div>
      </div>
      <div className="bar-chip-row">
        <Chip p={p} />
      </div>
      <span className="bar-name">{row.model.name}</span>
    </div>
  );
}

// ----- head-to-head -----

const SHORT: Record<string, string> = {
  "Gemini 3.1 Pro": "Gemini",
  "Claude Opus 5": "Opus 5",
  "GPT-5.6 Terra": "Terra",
  "Qwen 3.6 Plus": "Qwen",
  "Kimi K2.6": "Kimi",
  "Claude Sonnet 5": "Sonnet 5",
  "GLM 5.1": "GLM",
  "DeepSeek V4 Pro": "DeepSeek",
  "GPT-OSS-120B": "GPT-OSS",
  "Grok 4.20": "Grok",
};
const short = (n: string) => SHORT[n] || n.split(" ")[0];

function advantage(d: BenchData, row: BenchModel, col: BenchModel) {
  const v = d.matrix![`${row.model_id}|${col.model_id}`];
  const w = d.matrix![`${col.model_id}|${row.model_id}`];
  if (v == null || w == null) return null;
  return { own: v, opp: w, adv: (v - w) / 2 };
}

function Matrix({ d }: { d: BenchData }) {
  const ranked = [...d.models].sort(
    (a, b) =>
      b.scores.claim_share - a.scores.claim_share ||
      a.name.localeCompare(b.name)
  );
  const [focusId, setFocusId] = useState(ranked[0].model_id);
  const focus =
    ranked.find((m) => m.model_id === focusId) ?? ranked[0];

  const rows = ranked
    .filter((m) => m.model_id !== focus.model_id)
    .map((m) => ({ m, ...advantage(d, focus, m) }))
    .filter((r): r is { m: BenchModel; own: number; opp: number; adv: number } =>
      r.adv != null
    )
    .sort((a, b) => b.adv - a.adv || a.m.name.localeCompare(b.m.name));

  const wins = rows.filter((r) => r.adv > 0.5).length;
  const losses = rows.filter((r) => r.adv < -0.5).length;
  const best = rows[0];
  const worst = rows[rows.length - 1];
  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.adv)), 4);

  const record =
    losses === 0 ? (
      <>
        Takes more surplus than <strong>all {rows.length}</strong> opponents.
      </>
    ) : wins === 0 ? (
      <>
        Takes less surplus than <strong>all {rows.length}</strong> opponents.
      </>
    ) : (
      <>
        Ahead of <strong>{wins}</strong> opponents, behind{" "}
        <strong>{losses}</strong>.
      </>
    );

  return (
    <div className="h2h">
      <div className="h2h-label">Pick a model</div>
      <div className="h2h-picker">
        {ranked.map((m) => {
          const p = providerOf(m);
          const on = m.model_id === focus.model_id;
          return (
            <button
              key={m.model_id}
              className={`h2h-pick${on ? " active" : ""}`}
              title={m.name}
              onClick={() => setFocusId(m.model_id)}
            >
              <Chip p={p} />
              <span>{short(m.name)}</span>
            </button>
          );
        })}
      </div>
      <p className="h2h-lead">
        {record} {best.adv > 0 ? "Biggest edge" : "Smallest deficit"}{" "}
        <span className={`h2h-inline ${best.adv > 0 ? "win" : "lose"}`}>
          {best.adv > 0 ? "+" : "−"}
          {Math.abs(best.adv).toFixed(1)} vs {short(best.m.name)}
        </span>
        , {worst.adv < 0 ? "biggest deficit" : "closest matchup"}{" "}
        <span className={`h2h-inline ${worst.adv < 0 ? "lose" : "win"}`}>
          {worst.adv < 0 ? "−" : "+"}
          {Math.abs(worst.adv).toFixed(1)} vs {short(worst.m.name)}
        </span>
        .
      </p>
      <div className="h2h-head">
        <span>Opponent</span>
        <span className="h2h-axis">
          <i>opponent ahead</i>
          <i>even</i>
          <i>{short(focus.name)} ahead</i>
        </span>
        <span className="h2h-adv-h">edge</span>
        <span className="h2h-raw-h">shares</span>
      </div>
      <div className="h2h-chart">
        {rows.map((r) => {
          const pct = (Math.abs(r.adv) / maxAbs) * 48;
          const win = r.adv > 0;
          const p = providerOf(r.m);
          const side = win
            ? { left: "50%", width: `${pct}%` }
            : { right: "50%", width: `${pct}%` };
          return (
            <div className="h2h-row" key={r.m.model_id}>
              <span className="h2h-name">
                <Chip p={p} />
                <span>{short(r.m.name)}</span>
              </span>
              <span className="h2h-track">
                <span className="h2h-zero"></span>
                <span
                  className={`h2h-bar ${win ? "win" : "lose"}`}
                  style={side}
                ></span>
              </span>
              <span className={`h2h-adv ${win ? "win" : "lose"}`}>
                {win ? "+" : "−"}
                {Math.abs(r.adv).toFixed(1)}
              </span>
              <span className="h2h-raw">
                {Math.round(r.own)} vs {Math.round(r.opp)}
              </span>
            </div>
          );
        })}
      </div>
      <p className="h2h-note">
        Edge is how many points of the available surplus {focus.name} takes
        above or below that opponent. Shares are the two mean percentages in
        that pairing.
      </p>
    </div>
  );
}

// ----- card -----

function BenchCard({
  d,
  metric,
  onMetric,
}: {
  d: BenchData;
  metric: string;
  onMetric: (id: string) => void;
}) {
  const metricDef = d.metrics.find((m) => m.id === metric)!;
  const isMatrix = metricDef.kind === "matrix";
  const rows = isMatrix ? [] : scoredModels(d, metric);

  const shown = rows.slice(0, MAX_BARS);
  const tail = rows.length > MAX_BARS ? rows[rows.length - 1] : null;
  // Signed metrics get a zero baseline: positive bars grow up from it,
  // negative bars hang below. Zone heights share one $-per-pixel scale.
  // The scale comes from the SHOWN bars only: the tail column sits beyond
  // the dashed separator, so an extreme tail clamps to the zone edge and
  // its printed value carries the magnitude, instead of crushing the rest.
  const scaleRows = shown.length ? shown : rows;
  const scale: Scale = {
    signed: rows.some((r) => r.value < 0),
    maxPos: Math.max(...scaleRows.map((r) => r.value), 0) || 1,
    maxNeg: Math.max(...scaleRows.map((r) => -r.value), 0) || 1,
    maxVal: scaleRows.length
      ? Math.max(...scaleRows.map((r) => Math.abs(r.value)))
      : 1,
  };

  const sourceLabel = d.source.label || d.source.name;

  return (
    <div className="bench-card">
      <div className="bench-head">
        <div className="bench-title-block">
          <h2>{d.title}</h2>
          <div className="bench-question">{d.question}</div>
          <span className="bench-source">
            by{" "}
            {d.source.url ? (
              <a href={d.source.url} target="_blank" rel="noopener">
                {sourceLabel}
              </a>
            ) : (
              sourceLabel
            )}
          </span>
        </div>
        {d.metrics.length > 1 && (
          <div className="metric-toggle" role="tablist">
            {d.metrics.map((m) => (
              <button
                key={m.id}
                role="tab"
                className={m.id === metric ? "active" : ""}
                onClick={() => onMetric(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="metric-note">
        {isMatrix
          ? ""
          : metricDef.higherIsBetter === false
            ? "↓ lower is better"
            : "↑ higher is better"}
      </p>
      {isMatrix ? (
        <Matrix d={d} />
      ) : (
        <div className="chart">
          {shown.map((row, i) => (
            <BarCol
              key={row.model.name}
              d={d}
              row={row}
              rank={i + 1}
              scale={scale}
              metricDef={metricDef}
            />
          ))}
          {tail && (
            <>
              <div className="tail-sep" />
              <BarCol
                d={d}
                row={tail}
                rank={rows.length}
                scale={scale}
                metricDef={metricDef}
                isTail
              />
            </>
          )}
        </div>
      )}
      <div className="bench-foot">
        <p className="bench-blurb">
          {d.blurb}
          {d.footnote && <span className="bench-footnote">{d.footnote}</span>}
        </p>
        <div className="bench-stamp">
          results as of {d.source.snapshot}
          <br />
          {d.source.url && (
            <a href={d.source.url} target="_blank" rel="noopener">
              {d.source.linkText ||
                (rows.length > MAX_BARS
                  ? `+${rows.length - MAX_BARS - 1} more at source`
                  : "full results at source")}{" "}
              ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ----- leaderboard (sidebar + card, hash-linkable) -----

function syncHash(bench: string, metric: string) {
  const d = loadBench(bench);
  const suffix = metric && metric !== d.defaultMetric ? "/" + metric : "";
  history.replaceState(null, "", "#" + bench + suffix);
}

export default function Leaderboard() {
  const [active, setActive] = useState<string>(BENCHES[0]);
  const [metric, setMetric] = useState<string>(
    loadBench(BENCHES[0]).defaultMetric
  );

  // Hash is "#bench" or "#bench/metric", so a specific view is linkable.
  // The hash is written imperatively alongside each state change (as the
  // original evals.js did), never from an effect watching the state: an
  // effect's first run sees the initial state and would strip the metric
  // from a deep link before this parser gets a second look at it.
  useEffect(() => {
    const [hashBench, hashMetric] = location.hash.replace("#", "").split("/");
    let bench: string = BENCHES[0];
    if ((BENCHES as readonly string[]).includes(hashBench)) bench = hashBench;
    const d = loadBench(bench);
    const m =
      bench === hashBench &&
      hashMetric &&
      d.metrics.some((x) => x.id === hashMetric)
        ? hashMetric
        : d.defaultMetric;
    setActive(bench);
    setMetric(m);
    syncHash(bench, m);
  }, []);

  const select = (bench: string) => {
    const m = loadBench(bench).defaultMetric;
    setActive(bench);
    setMetric(m);
    syncHash(bench, m);
  };

  const selectMetric = (id: string) => {
    setMetric(id);
    syncHash(active, id);
  };

  return (
    <section className="evals-layout">
      <aside className="bench-list" aria-label="Benchmarks">
        {BENCHES.map((b) => {
          const d = loadBench(b);
          return (
            <button
              key={b}
              className={`bench-item${b === active ? " active" : ""}`}
              onClick={() => select(b)}
            >
              <span className="dot"></span>
              <span>
                {d.title}
                <span className="bench-item-q">{d.question}</span>
              </span>
            </button>
          );
        })}
      </aside>
      <BenchCard d={loadBench(active)} metric={metric} onMetric={selectMetric} />
    </section>
  );
}
