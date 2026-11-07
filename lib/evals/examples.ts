import { DIMENSIONS } from "./eii";
import { INDEX_SKILLS } from "./skills";
import { PROVIDER_ICONS } from "./provider-icons";
import { PROVIDERS, logoColor, providerOf } from "./providers";
import type { BenchData, BenchModel } from "./types";

// EXAMPLE data for charts whose real inputs haven't landed yet: daily
// balances, model release dates, inference costs and index scores. Every
// generator is deterministic (seeded by model and benchmark) so builds are
// stable, and every result carries `example: true` so the UI can label it.
// To switch a chart to real data, replace the matching getter's body.

export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  }
  return ((h >>> 0) % 2147483646) + 1;
}

export interface ChartModel {
  name: string;
  provider: string;
  icon?: string;
  mark?: string;
  color: string;
  baseline: boolean;
}

export function chartModel(m: BenchModel): ChartModel {
  const p = providerOf(m);
  return {
    name: m.name,
    provider: p.label,
    icon: p.icon ? PROVIDER_ICONS[p.icon] : undefined,
    mark: p.mark,
    color: logoColor(p),
    baseline: p === PROVIDERS.baseline,
  };
}

/* ---------- Index scores (Economic Intelligence Index preview) ---------- */

export interface IndexScores {
  dims: number[];
  /** One score per INDEX_SKILLS entry. */
  skills: number[];
  overall: number;
  /** Example inference dollars per index run. */
  cost: number;
}

export function withExampleScores<T extends object>(
  roster: T[],
): (T & IndexScores)[] {
  const rand = seeded(42);
  return roster.map((m, i) => {
    const base = 0.35 + rand() * 0.45;
    const dims = DIMENSIONS.map(() =>
      Math.min(0.97, Math.max(0.15, base + (rand() - 0.5) * 0.3)),
    );
    const overall = dims.reduce((s, v) => s + v, 0) / dims.length;
    // Skills and cost use their own streams, so the dimension scores above
    // stay as they were.
    const rs = seeded(1000 + i * 7919);
    const skills = INDEX_SKILLS.map(() =>
      Math.min(0.97, Math.max(0.15, overall + (rs() - 0.5) * 0.34)),
    );
    // Stronger models tend to cost more, with plenty of spread: $0.5 to $60.
    const cost =
      Math.round(Math.exp(Math.log(0.5) + Math.min(1, overall * 0.9 + rs() * 0.45) * Math.log(120)) * 100) / 100;
    return { ...m, dims, skills, overall, cost };
  });
}

/* ---------- Balance over the simulated year ---------- */

export interface BenchSeries {
  example: boolean;
  unit: "$";
  /** Final-value metric the lines end on. */
  metric: string;
  days: number;
  start: number;
  series: (ChartModel & { points: number[] })[];
}

// Per benchmark: starting balance and the metric each line ends on.
const SERIES_SPEC: Record<string, { start: number; metric: string }> = {
  "treasury-bench": { start: 10000, metric: "closing_total" },
  "vending-bench-2": { start: 500, metric: "net_worth" },
};

function gauss(rand: () => number) {
  return (
    Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand())
  );
}

// A noisy path from `start` to `end` over `days` (a Brownian bridge with a
// gentle ease), or, for a model that ends deeply negative, a steady year
// that breaks in a cliff.
function examplePath(seed: number, start: number, end: number, days: number) {
  const rand = seeded(seed);
  const walk = [0];
  for (let t = 1; t <= days; t++) walk.push(walk[t - 1] + gauss(rand));
  const bridge = (t: number) => walk[t] - (walk[days] * t) / days;
  // Bridge noise peaks mid-year at about sqrt(days)/2 steps; scale it to
  // roughly 6% of the year's swing.
  const scale =
    (Math.max(Math.abs(end - start), Math.abs(start) * 0.4) * 0.12) /
    Math.sqrt(days);

  if (end < 0 && start > 0) {
    const cliff = 170 + Math.floor(rand() * 150);
    return walk.map((_, t) => {
      if (t < cliff) return start * (1 - 0.05 * (t / cliff)) + bridge(t) * scale * 0.5;
      const k = Math.min(1, (t - cliff) / 12);
      const drop = start * 0.95 + (end - start * 0.95) * (1 - Math.pow(1 - k, 3));
      return drop + bridge(t) * scale * 0.4;
    });
  }
  return walk.map((_, t) => {
    const x = t / days;
    const ease = x * x * (3 - 2 * x) * 0.4 + x * 0.6;
    return start + (end - start) * ease + bridge(t) * scale;
  });
}

export function benchSeries(d: BenchData): BenchSeries | null {
  const spec = SERIES_SPEC[d.bench];
  if (!spec) return null;
  const days = 365;
  return {
    example: true,
    unit: "$",
    metric: spec.metric,
    days,
    start: spec.start,
    series: d.models
      .filter((m) => typeof m.scores[spec.metric] === "number")
      .map((m) => ({
        ...chartModel(m),
        points: examplePath(
          hash(d.bench + m.name),
          spec.start,
          m.scores[spec.metric],
          days,
        ).map((v) => Math.round(v * 100) / 100),
      })),
  };
}

/* ---------- Release dates ---------- */

// Example release dates between Jan 2025 and Sep 2026: spread by score rank
// (weaker models earlier) with some jitter, so the frontier climbs steadily
// across the window the way real data does.
export function exampleReleases(
  models: { name: string; score: number }[],
): Map<string, number> {
  const from = Date.UTC(2025, 0, 1);
  const to = Date.UTC(2026, 8, 30);
  const ranked = [...models].sort((a, b) => a.score - b.score);
  return new Map(
    ranked.map((m, i) => {
      const rand = seeded(hash(`release:${m.name}`));
      const t = Math.min(
        1,
        Math.max(0, (i / Math.max(1, ranked.length - 1)) * 0.8 + rand() * 0.2),
      );
      const ms = from + (to - from) * t;
      return [m.name, Math.round(ms / 86400000) * 86400000];
    }),
  );
}

/* ---------- Inference cost per run ---------- */

// Example dollars of inference per benchmark run: log-uniform from $0.40
// to $60, scripted baselines free.
export function exampleCost(bench: string, m: BenchModel): number {
  if (providerOf(m) === PROVIDERS.baseline) return 0;
  const rand = seeded(hash(`cost:${bench}:${m.name}`));
  rand();
  return Math.round(Math.exp(Math.log(0.4) + rand() * Math.log(60 / 0.4)) * 100) / 100;
}
