// The Economic Intelligence Index: its five dimensions, what each measures,
// and which benchmarks feed which dimensions.
export const DIMENSIONS = [
  "Capability",
  "Efficiency",
  "Reliability",
  "Robustness",
  "Security",
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

export const DIMENSION_INFO: Record<Dimension | "Overall", string> = {
  Overall: "Weighted aggregate of the five dimensions.",
  Capability:
    "Quality of outcomes: surplus captured, returns achieved and value created.",
  Efficiency: "Outcome per unit of resource: steps, tokens and inference cost.",
  Reliability:
    "Consistency of performance across runs, seeds and long horizons.",
  Robustness:
    "Performance against adversarial counterparties and under shifting market conditions.",
  Security:
    "Resistance to manipulation, information leakage and actions against the principal's interest.",
};

export const BENCH_DIMENSIONS: Record<string, Dimension[]> = {
  "zerosum-bench": ["Capability", "Robustness"],
  "treasury-bench": ["Reliability", "Efficiency"],
  "terms-bench": ["Capability", "Efficiency"],
  "vending-bench-2": ["Reliability", "Capability"],
  "auction-bench": ["Capability", "Robustness"],
  "e-commerce-bench": ["Reliability", "Security"],
  "terms-bench-v2": ["Capability", "Robustness"],
  "travel-planner": ["Capability", "Reliability"],
};
