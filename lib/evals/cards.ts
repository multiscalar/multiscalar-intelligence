import { BENCHES, loadBench } from "./benches";
import { BENCH_DIMENSIONS, type Dimension } from "./eii";
import { PROVIDER_ICONS } from "./provider-icons";
import { PROVIDERS, logoColor, providerOf } from "./providers";
import { fmt, scoredModels } from "./score";

export interface BenchCardData {
  slug: string;
  title: string;
  question: string;
  metric: string;
  metricShort: string;
  source: string;
  label: string;
  icon:
    "swords" | "landmark" | "handshake" | "store" | "gavel" | "cart" | "chart" | "shield";
  /** Index dimensions this benchmark feeds. */
  dimensions: Dimension[];
  /** Announced but not yet run: shown with skeleton rows, linking to its
      "in development" page. */
  comingSoon?: boolean;
  rows: {
    name: string;
    value: string;
    /** 0–1 bar length, relative to the card's leader. */
    share: number;
    /** Provider mark: an SVG path, or a fallback character. */
    icon?: string;
    mark?: string;
    /** Logo colour (see logoColor). */
    color: string;
    provider: string;
  }[];
}

const TOP_N = 5;

// Category chip per benchmark (icon names resolve in BenchCard), plus a
// short name for the ranking metric; the full label is the tooltip.
export const CATEGORY: Record<
  string,
  { label: string; icon: BenchCardData["icon"]; metricShort: string }
> = {
  "zerosum-bench": {
    label: "Negotiation",
    icon: "swords",
    metricShort: "money extracted",
  },
  "treasury-bench": {
    label: "Treasury",
    icon: "landmark",
    metricShort: "value added vs baseline",
  },
  "terms-bench": {
    label: "Negotiation",
    icon: "handshake",
    metricShort: "surplus efficiency (SE+)",
  },
  "vending-bench-2": {
    label: "Operations",
    icon: "store",
    metricShort: "net worth",
  },
};

// Announced benchmarks without results yet; shown as "Coming soon" cards.
const UPCOMING: BenchCardData[] = [
  {
    slug: "auction-bench",
    title: "Auction Bench",
    question: "Can the agent bid well against other agents?",
    metric: "",
    metricShort: "",
    source: "Multiscalar",
    label: "Auctions",
    icon: "gavel",
    rows: [],
    dimensions: BENCH_DIMENSIONS["auction-bench"] ?? [],
    comingSoon: true,
  },
  {
    slug: "e-commerce-bench",
    title: "E-Commerce Bench",
    question: "Can the agent run an online store end to end?",
    metric: "",
    metricShort: "",
    source: "Multiscalar",
    label: "Commerce",
    icon: "cart",
    rows: [],
    dimensions: BENCH_DIMENSIONS["e-commerce-bench"] ?? [],
    comingSoon: true,
  },
  {
    slug: "terms-bench-v2",
    title: "TERMS-Bench v2",
    question: "Can the agent buy well from suppliers who negotiate back?",
    metric: "",
    metricShort: "",
    source: "Multiscalar",
    label: "Procurement",
    icon: "handshake",
    rows: [],
    dimensions: BENCH_DIMENSIONS["terms-bench-v2"] ?? [],
    comingSoon: true,
  },
  {
    slug: "travel-planner",
    title: "Travel Planner",
    question: "Can the agent plan and book a trip within budget?",
    metric: "",
    metricShort: "",
    source: "Multiscalar",
    label: "Operations",
    icon: "store",
    rows: [],
    dimensions: BENCH_DIMENSIONS["travel-planner"] ?? [],
    comingSoon: true,
  },
];

// Live top five per benchmark, from the same data as the leaderboards,
// followed by the announced ones. Scripted baselines are left out: this is
// a ranking of models.
export function benchCards(): BenchCardData[] {
  const cards: BenchCardData[] = BENCHES.map((slug) => {
    const bench = loadBench(slug);
    const metric = bench.metrics.find((m) => m.id === bench.defaultMetric)!;
    const rows = scoredModels(bench, metric.id)
      .filter((r) => providerOf(r.model) !== PROVIDERS.baseline)
      .slice(0, TOP_N);
    const max = Math.max(...rows.map((r) => Math.abs(r.value)), 1e-9);
    return {
      slug,
      title: bench.title,
      question: bench.question,
      metric: metric.label,
      source: bench.source.name,
      dimensions: BENCH_DIMENSIONS[slug] ?? [],
      ...(CATEGORY[slug] ?? {
        label: "Benchmark",
        icon: "chart",
        metricShort: metric.label,
      }),
      rows: rows.map((r) => {
        const provider = providerOf(r.model);
        return {
          name: r.model.name,
          value: fmt(r.value, metric.unit),
          share: Math.max(0, r.value) / max,
          icon: provider.icon ? PROVIDER_ICONS[provider.icon] : undefined,
          mark: provider.mark,
          color: logoColor(provider),
          provider: provider.label,
        };
      }),
    };
  });
  return [...cards, ...UPCOMING];
}
