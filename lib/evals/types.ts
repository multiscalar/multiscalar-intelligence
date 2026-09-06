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
}
