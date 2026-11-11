// The Economic Intelligence Index: its five dimensions and what each measures
// (the methodology page), and the C1-C5 capabilities (the index preview).
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

// The capability taxonomy the index preview's radar is drawn on: five
// economic capabilities, each with what it measures. `short` is the one-word
// label for the radar, tabs and score row; the full name shows on hover.
export interface Capability {
  code: string;
  name: string;
  short: string;
  info: string;
}

export const CAPABILITIES: Capability[] = [
  {
    code: "C1",
    name: "Valuation & Allocation",
    short: "Valuation",
    info: "Resource allocation, pricing, investment and financial decisions.",
  },
  {
    code: "C2",
    name: "Strategic Interaction",
    short: "Strategy",
    info: "Negotiation, auctions, competition and cooperation.",
  },
  {
    code: "C3",
    name: "Planning & Execution",
    short: "Planning",
    info: "Multi-step economic activities and long-horizon operations.",
  },
  {
    code: "C4",
    name: "Economic Security",
    short: "Security",
    info: "Counterparty exploitation resistance; payment and authorization security; contractual integrity.",
  },
  {
    code: "C5",
    name: "Economic Discovery",
    short: "Discovery",
    info: "Uncovering economically valuable information and opportunities not known in advance.",
  },
];

export const CAPABILITY_OVERALL_INFO =
  "Weighted aggregate of the five capabilities.";

// Which capabilities each benchmark exercises, by short label, primary ones
// first: the chips on its card and the "How does it feed the index?" answer.
// The index benchmarks follow the EII v1 benchmark table (Hammer-Bench is
// Auction Bench). Benchmarks outside the index keep an entry so their pages
// still find similar ones.
export const BENCH_CAPABILITIES: Record<string, string[]> = {
  "terms-bench": ["Strategy", "Valuation", "Discovery"],
  "e-commerce-bench": ["Planning", "Valuation", "Strategy", "Security", "Discovery"],
  econevals: ["Valuation", "Discovery"],
  "auction-bench": ["Valuation", "Strategy", "Security"],
  coffeebench: ["Strategy", "Planning", "Valuation", "Discovery"],
  "treasury-bench": ["Valuation", "Planning", "Security"],
  econsec: ["Security", "Strategy", "Planning"],
"zerosum-bench": ["Strategy"],
  "vending-bench-2": ["Planning", "Valuation"],
  "terms-bench-v2": ["Strategy"],
  "travel-planner": ["Planning"],
};

// The primary capabilities among those above (filled chips); the rest are
// secondary. A benchmark without an entry has no primary/secondary split.
export const BENCH_PRIMARY: Record<string, string[]> = {
  "terms-bench": ["Strategy"],
  "e-commerce-bench": ["Planning"],
  econevals: ["Valuation", "Discovery"],
  "auction-bench": ["Valuation", "Strategy"],
  coffeebench: ["Strategy", "Planning"],
  "treasury-bench": ["Valuation"],
  econsec: ["Security"],
};
