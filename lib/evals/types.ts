export interface Metric {
  id: string;
  label: string;
  unit?: string;
  higherIsBetter?: boolean;
  kind?: string; // "matrix" for the head-to-head view
}

export interface BenchSource {
  name: string;
  label?: string;
  url?: string;
  /** Link to the paper behind the benchmark, shown as a header button. */
  paper?: string;
  snapshot: string;
  linkText?: string;
  run?: string;
  /** Scored by our Economic Intelligence Index run, on its 0-100 scale. */
  index?: boolean;
}

export interface BenchModel {
  name: string;
  provider?: string;
  model_id?: string;
  scores: Record<string, number>;
  stderr?: number;
  // Only present on an exploitability-style bench (none of the current four).
  deltaSurplus?: Record<string, number>;
  [key: string]: unknown;
}

export interface BenchData {
  bench: string;
  title: string;
  question: string;
  blurb: string;
  footnote?: string;
  defaultMetric: string;
  metrics: Metric[];
  models: BenchModel[];
  matrix?: Record<string, number>;
  games?: Record<string, { feasibleSurplus: number }>;
  source: BenchSource;
  /** Index benchmarks: page copy from tools/export_eii_cards.py. */
  notes?: { measures: string; scoring: string; original: string };
  /** What each model's `raw` string (its unscaled result) is. */
  rawLabel?: string;
  /** Reference lines on the bar chart, on the 0-100 scale. */
  refs?: { label: string; value: number }[];
  /** The index capabilities it feeds, the one it counts most toward first. */
  feeds?: string[];
}
