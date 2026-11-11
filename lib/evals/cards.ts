import { BENCHES, INDEX_BENCHES, loadBench } from "./benches";
import { BENCH_CAPABILITIES, BENCH_PRIMARY } from "./eii";
import { upcomingBench } from "./upcoming";
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
  /** Index capabilities this benchmark exercises (short labels). */
  dimensions: string[];
  /** The primary ones among `dimensions`; the rest are secondary. */
  primary: string[];
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
  "terms-bench": { label: "Negotiation", icon: "handshake", metricShort: "index score" },
  "e-commerce-bench": { label: "Commerce", icon: "cart", metricShort: "index score" },
  econevals: { label: "Pricing", icon: "chart", metricShort: "index score" },
  "auction-bench": { label: "Auctions", icon: "gavel", metricShort: "index score" },
  coffeebench: { label: "Supply chain", icon: "store", metricShort: "index score" },
  "treasury-bench": { label: "Treasury", icon: "landmark", metricShort: "index score" },
  "zerosum-bench": { label: "Negotiation", icon: "swords", metricShort: "money extracted" },
  "vending-bench-2": { label: "Operations", icon: "store", metricShort: "net worth" },
};

// An announced benchmark without results: a "Coming soon" card linking to its
// "in development" page.
function upcomingCard(slug: string): BenchCardData {
  const b = upcomingBench(slug)!;
  return {
    slug,
    title: b.title,
    question: b.question,
    metric: "",
    metricShort: "",
    source: "Multiscalar",
    label: b.label,
    icon: b.icon,
    rows: [],
    dimensions: BENCH_CAPABILITIES[slug] ?? [],
    primary: BENCH_PRIMARY[slug] ?? BENCH_CAPABILITIES[slug] ?? [],
    comingSoon: true,
  };
}

// In the index but not yet scored by an index run.
const INDEX_UPCOMING = ["econsec"];
// Announced, outside the index for now: only on "Similar benchmarks".
const OTHER_UPCOMING = ["terms-bench-v2", "travel-planner"];

// The index section: the index benchmarks' live top five, from the same data
// as their leaderboards, then the index's announced ones.
export function benchCards(): BenchCardData[] {
  return [...INDEX_BENCHES.map(liveCard), ...INDEX_UPCOMING.map(upcomingCard)];
}

// Every benchmark, for "Similar benchmarks" on a benchmark page: the index
// ones first, then the earlier boards and the other announced ones.
export function allBenchCards(): BenchCardData[] {
  return [
    ...BENCHES.map(liveCard),
    ...[...INDEX_UPCOMING, ...OTHER_UPCOMING].map(upcomingCard),
  ];
}

// One live benchmark's top five. Scripted baselines are left out: this is a
// ranking of models.
function liveCard(slug: string): BenchCardData {
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
    dimensions: BENCH_CAPABILITIES[slug] ?? [],
    primary: BENCH_PRIMARY[slug] ?? BENCH_CAPABILITIES[slug] ?? [],
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
}
