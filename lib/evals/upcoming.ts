// Benchmarks in development: no results yet, so each has a short page of its
// own (/evals/<slug>/) instead of a leaderboard. DRAFT copy, written from the
// EII spec and the methodology page; review before launch.

export interface UpcomingBench {
  slug: string;
  title: string;
  question: string;
  /** Category chip, as on the live benchmarks. */
  label: string;
  icon: "gavel" | "cart" | "shield" | "handshake" | "store";
  /** Skills it exercises ("All skills" for the cross-cutting ones). */
  skills: string[];
  /** Index traits it feeds. */
  traits: string[];
  blurb: string;
  /** What the score captures, as title and line. */
  scores: [string, string][];
}

export const UPCOMING_BENCHES: UpcomingBench[] = [
  {
    slug: "terms-bench-v2",
    title: "TERMS-Bench v2",
    question: "Can the agent buy well from suppliers who negotiate back?",
    label: "Procurement",
    icon: "handshake",
    skills: ["Procurement"],
    traits: ["Capability", "Efficiency", "Reliability", "Robustness"],
    blurb:
      "The next version of TERMS-Bench, built for procurement: agents buy goods and services from supplier agents, negotiating price, delivery and risk. Harder variants add unreliable suppliers and supply shocks.",
    scores: [
      ["Terms secured", "Price, delivery and risk won, against what a fair deal looks like."],
      ["Cost per result", "Inference spent for each unit of value secured."],
      ["Under supply shocks", "Whether terms hold when suppliers fail or prices jump."],
    ],
  },
  {
    slug: "travel-planner",
    title: "Travel Planner",
    question: "Can the agent plan and book a trip within budget?",
    label: "Operations",
    icon: "store",
    skills: ["Operations"],
    traits: ["Capability", "Efficiency", "Reliability", "Robustness"],
    blurb:
      "Agents plan and book multi-leg trips for a client, balancing flights, hotels and schedules against a fixed budget and changing availability. Harder variants add cancellations, price spikes and conflicting requests.",
    scores: [
      ["Plan quality", "Every constraint met, at the lowest cost to the client."],
      ["Cost per result", "Inference spent for each plan delivered."],
      ["Under disruption", "Whether the plan survives cancellations and price spikes."],
    ],
  },
  {
    slug: "econsec",
    title: "EconSec",
    question: "Does the agent stay within its mandate and avoid harming others?",
    label: "Security",
    icon: "shield",
    skills: ["All skills"],
    traits: ["Security"],
    blurb:
      "Security scenarios that run alongside every skill, where the profitable move is also a harmful one: colluding with competitors, deceiving a counterparty, manipulating a market or leaking the principal's information. The score is how reliably the agent declines, and how little it gives away under pressure.",
    scores: [
      ["Mandate kept", "Whether the agent stays inside the limits its principal set."],
      ["Harm avoided", "How often it declines collusion, deception and manipulation."],
      ["Information kept", "What it reveals about its principal when pushed."],
    ],
  },
];

export const upcomingBench = (slug: string) =>
  UPCOMING_BENCHES.find((b) => b.slug === slug);
