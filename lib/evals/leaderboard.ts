import { PROVIDER_ICONS } from "./provider-icons";
import { PROVIDERS, logoColor, providerOf } from "./providers";
import { fmt, scoredModels } from "./score";
import type { BenchData, BenchModel } from "./types";

// Plain, serialisable data for the benchmark page's leaderboard panel and
// header: every ranked metric with its rows, plus a detail sheet per model.

export interface LbModel {
  name: string;
  provider: string;
  /** Provider mark: an SVG path, or a fallback character. */
  icon?: string;
  mark?: string;
  /** Brand colour for the logo. */
  color: string;
  /** Scripted reference policy rather than a language model. */
  baseline: boolean;
  /** Label/value pairs for the detail card. */
  details: { label: string; value: string }[];
}

export interface LbRow {
  name: string;
  value: number;
  display: string;
  /** Standard error, drawn as a whisker when the benchmark reports one. */
  stderr?: number;
}

export interface LbMetric {
  id: string;
  label: string;
  short: string;
  unit?: string;
  higherIsBetter: boolean;
  rows: LbRow[];
}

export interface LbData {
  models: LbModel[];
  metrics: LbMetric[];
  /** The benchmark's headline metric, shown first. */
  defaultMetric: string;
}

// Short names for the metric pills; the full label is the panel caption.
const SHORT: Record<string, string> = {
  extracted_of_realised: "Money extracted",
  closing_total: "Closing treasury",
  value_add: "Value added vs baseline",
  se_plus: "Surplus efficiency (SE+)",
  agr_plus: "Agreement rate (AGR+)",
  net_worth: "Net worth",
  index_score: "Index score",
};

const pct = (v: unknown) =>
  typeof v === "number" ? `${v.toFixed(1)}%` : undefined;
const usd = (v: unknown) => (typeof v === "number" ? fmt(v, "$") : undefined);

// Benchmark-specific numbers worth showing beside the ranked metrics.
function extraDetails(d: BenchData, m: BenchModel) {
  const s = m.scores;
  const out: [string, string | undefined][] = [];
  if (d.bench === "zerosum-bench") {
    out.push(
      ["Deal efficiency", pct(s.efficiency)],
      ["No-deal rate", pct(s.no_deal_rate)],
      ["Dominated moves", pct(s.dominated_rate)],
      [
        "Episodes",
        typeof m.episodes === "number"
          ? m.episodes.toLocaleString("en-US")
          : undefined,
      ],
    );
  }
  if (d.bench === "treasury-bench") {
    out.push(["Lost to penalties", usd(s.penalty_loss)]);
  }
  if (typeof m.stderr === "number") {
    out.push(["Standard error", `± ${usd(m.stderr)}`]);
  }
  if (typeof m.runs === "number") out.push(["Seeded runs", String(m.runs)]);
  return out.filter((e): e is [string, string] => e[1] !== undefined);
}

export function leaderboardData(d: BenchData): LbData {
  const barMetrics = d.metrics.filter((m) => m.kind !== "matrix");
  const metrics: LbMetric[] = barMetrics.map((metric) => ({
    id: metric.id,
    label: metric.label,
    short: SHORT[metric.id] ?? metric.label,
    unit: metric.unit,
    higherIsBetter: metric.higherIsBetter !== false,
    rows: scoredModels(d, metric.id).map((r) => ({
      name: r.model.name,
      value: r.value,
      display: fmt(r.value, metric.unit),
      stderr: typeof r.model.stderr === "number" ? r.model.stderr : undefined,
    })),
  }));

  const models: LbModel[] = d.models.map((m) => {
    const p = providerOf(m);
    return {
      name: m.name,
      provider: p.label,
      icon: p.icon ? PROVIDER_ICONS[p.icon] : undefined,
      mark: p.mark,
      color: logoColor(p),
      baseline: p === PROVIDERS.baseline,
      details: [
        ...barMetrics
          .filter((metric) => typeof m.scores[metric.id] === "number")
          .map((metric) => ({
            label: SHORT[metric.id] ?? metric.label,
            value: fmt(m.scores[metric.id], metric.unit),
          })),
        ...extraDetails(d, m).map(([label, value]) => ({ label, value })),
      ],
    };
  });

  return { models, metrics, defaultMetric: d.defaultMetric };
}

export interface BenchStats {
  models: number;
  leader: {
    name: string;
    icon?: string;
    mark?: string;
    color: string;
    value: string;
  };
  metric: string;
  updated: string;
}

// Header stat row: field size, the leader on the default metric (baselines
// excluded), and when the results were taken.
export function benchStats(d: BenchData): BenchStats {
  const real = d.models.filter((m) => providerOf(m) !== PROVIDERS.baseline);
  const metric = d.metrics.find((m) => m.id === d.defaultMetric)!;
  const top = scoredModels(d, metric.id).find(
    (r) => providerOf(r.model) !== PROVIDERS.baseline,
  )!;
  const p = providerOf(top.model);
  const updated = new Date(`${d.source.snapshot}T00:00:00Z`).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" },
  );
  return {
    models: real.length,
    leader: {
      name: top.model.name,
      icon: p.icon ? PROVIDER_ICONS[p.icon] : undefined,
      mark: p.mark,
      color: logoColor(p),
      value: fmt(top.value, metric.unit),
    },
    metric: SHORT[metric.id] ?? metric.label,
    updated,
  };
}
