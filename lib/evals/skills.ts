import type { NavIcon } from "@/lib/nav";

// The economic skills the index covers, and the benchmarks that exercise
// each one. A benchmark can serve several skills. Shown in the Index menu and
// as the filter above the benchmark list (/evals/?skill=<slug>).
export interface Skill {
  slug: string;
  label: string;
  icon: NavIcon;
  benches: string[];
}

export const SKILLS: Skill[] = [
  { slug: "negotiation", label: "Negotiation", icon: "handshake", benches: ["zerosum-bench", "terms-bench"] },
  { slug: "procurement", label: "Procurement", icon: "package", benches: ["vending-bench-2", "e-commerce-bench", "terms-bench-v2"] },
  { slug: "pricing", label: "Pricing", icon: "coins", benches: ["vending-bench-2", "e-commerce-bench"] },
  { slug: "capital-allocation", label: "Capital allocation", icon: "landmark", benches: ["treasury-bench"] },
  { slug: "operations", label: "Operations", icon: "store", benches: ["travel-planner"] },
  { slug: "auctions", label: "Auctions", icon: "gavel", benches: ["auction-bench"] },
];

export const skillHref = (slug: string) => `/evals/?skill=${slug}#benchmarks`;

// Skills with a live benchmark: the ones the index scores today.
export const INDEX_SKILLS = SKILLS.filter((s) => s.slug !== "auctions");

// One line per skill, shown under the index preview's tabs.
export const SKILL_INFO: Record<string, string> = {
  Negotiation: "Surplus captured when bargaining with counterparties that pursue their own interests.",
  Procurement: "Terms secured when buying: price, delivery and risk, against suppliers who negotiate back.",
  Pricing: "Revenue and margin from setting prices against demand and competitors.",
  "Capital allocation": "Value added managing cash, investments and obligations over a simulated year.",
  Operations: "Results from running a business end to end over long horizons.",
};
