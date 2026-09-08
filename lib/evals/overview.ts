import { BENCHES, loadBench } from "./benches";
import { providerOf, PROVIDERS, type Provider } from "./providers";
import type { BenchModel } from "./types";

export interface OverviewStats {
  benches: number;
  models: number;
  snapshot: string;
}

// Hero stat row: benchmark count, distinct evaluated models (scripted
// baselines are not models), and the most recent results snapshot.
export function overviewStats(): OverviewStats {
  const names = new Set<string>();
  let snapshot = "";
  for (const slug of BENCHES) {
    const d = loadBench(slug);
    for (const m of d.models) {
      if (providerOf(m) === PROVIDERS.baseline) continue;
      names.add(m.name);
    }
    if (d.source.snapshot > snapshot) snapshot = d.source.snapshot;
  }
  return { benches: BENCHES.length, models: names.size, snapshot };
}

export interface FieldDot {
  name: string;
  value: number;
  /** 0 worst → 1 best on the benchmark's default metric. */
  pos: number;
  provider: Provider;
}

export interface BenchFieldData {
  dots: FieldDot[];
  unit?: string;
  leader: { name: string; value: number; provider: Provider };
}

// The index-page score strip: every evaluated model as a dot, min-max
// normalized on the benchmark's default metric, best to the right.
// Scripted baselines stay off the strip like they stay off the radar.
export function benchField(slug: string): BenchFieldData {
  const d = loadBench(slug);
  const metric = d.metrics.find((m) => m.id === d.defaultMetric)!;
  const higher = metric.higherIsBetter !== false;
  const rows = d.models
    .map((m) => ({ m, v: m.scores[d.defaultMetric] }))
    .filter(
      (r): r is { m: BenchModel; v: number } =>
        typeof r.v === "number" &&
        isFinite(r.v) &&
        providerOf(r.m) !== PROVIDERS.baseline
    );
  const vals = rows.map((r) => r.v);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const dots = rows
    .map((r) => ({
      name: r.m.name,
      value: r.v,
      pos:
        max === min
          ? 0.5
          : (higher ? r.v - min : max - r.v) / (max - min),
      provider: providerOf(r.m),
    }))
    .sort((a, b) => a.pos - b.pos);
  const lead = rows.reduce((best, r) =>
    (higher ? r.v > best.v : r.v < best.v) ? r : best
  );
  return {
    dots,
    unit: metric.unit,
    leader: {
      name: lead.m.name,
      value: lead.v,
      provider: providerOf(lead.m),
    },
  };
}

export interface RadarAxis {
  slug: string;
  title: string;
  metricLabel: string;
  unit?: string;
}

export interface RadarModel {
  name: string;
  /** Per-axis score normalized 0–100 by min–max within that benchmark;
      null where the model has no result. */
  values: (number | null)[];
  /** The raw default-metric value per axis, for tooltips. */
  raw: (number | null)[];
  model: BenchModel;
}

export interface RadarData {
  axes: RadarAxis[];
  models: RadarModel[];
}

// Radar across the benchmarks: each axis is a benchmark's default
// metric, min-max normalized across that benchmark's models (baselines
// excluded from both the axis scale and the radar). Only models missing
// at most one axis are offered, so the roster survives a benchmark being
// added or retired; sorted by mean normalized score so the default-on
// set is the strongest.
export function radarData(): RadarData {
  const axes: RadarAxis[] = [];
  const perBench: { byName: Map<string, number>; min: number; max: number }[] =
    [];

  for (const slug of BENCHES) {
    const d = loadBench(slug);
    const metric = d.metrics.find((m) => m.id === d.defaultMetric)!;
    axes.push({
      slug,
      title: d.title,
      metricLabel: metric.label,
      unit: metric.unit,
    });
    const byName = new Map<string, number>();
    for (const m of d.models) {
      if (providerOf(m) === PROVIDERS.baseline) continue;
      const v = m.scores[d.defaultMetric];
      if (typeof v === "number" && isFinite(v)) byName.set(m.name, v);
    }
    const vals = [...byName.values()];
    perBench.push({
      byName,
      min: Math.min(...vals),
      max: Math.max(...vals),
    });
  }

  const modelByName = new Map<string, BenchModel>();
  for (const slug of BENCHES) {
    for (const m of loadBench(slug).models) {
      if (!modelByName.has(m.name)) modelByName.set(m.name, m);
    }
  }

  const models: RadarModel[] = [];
  for (const [name, model] of modelByName) {
    const raw = perBench.map((b) => b.byName.get(name) ?? null);
    const present = raw.filter((v) => v !== null).length;
    if (present < axes.length - 1) continue;
    const values = raw.map((v, i) => {
      if (v === null) return null;
      const { min, max } = perBench[i];
      return max === min ? 100 : ((v - min) / (max - min)) * 100;
    });
    models.push({ name, values, raw, model });
  }

  const mean = (m: RadarModel) => {
    const vs = m.values.filter((v): v is number => v !== null);
    return vs.reduce((s, v) => s + v, 0) / vs.length;
  };
  models.sort((a, b) => mean(b) - mean(a) || a.name.localeCompare(b.name));
  return { axes, models };
}
