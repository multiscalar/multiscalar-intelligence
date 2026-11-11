import type { BenchData } from "./types";
import zerosumBench from "@/data/evals/zerosum-bench.json";
import treasuryBench from "@/data/evals/treasury-bench.json";
import termsBench from "@/data/evals/terms-bench.json";
import vendingBench2 from "@/data/evals/vending-bench-2.json";
import ecommerceBench from "@/data/evals/e-commerce-bench.json";
import econevals from "@/data/evals/econevals.json";
import auctionBench from "@/data/evals/auction-bench.json";
import coffeebench from "@/data/evals/coffeebench.json";

// The benchmarks in the Economic Intelligence Index, in the order the index
// section shows them. Their data comes from the index run
// (tools/export_eii_cards.py).
export const INDEX_BENCHES = [
  "terms-bench",
  "e-commerce-bench",
  "econevals",
  "auction-bench",
  "coffeebench",
  "treasury-bench",
] as const;

// Every benchmark with a leaderboard page: the index ones, plus earlier
// boards that stay reachable by URL but are not in the index.
export const BENCHES = [
  ...INDEX_BENCHES,
  "zerosum-bench",
  "vending-bench-2",
] as const;

export const MAX_BARS = 12;

const DATA: Record<string, BenchData> = Object.fromEntries(
  [
    zerosumBench,
    treasuryBench,
    termsBench,
    vendingBench2,
    ecommerceBench,
    econevals,
    auctionBench,
    coffeebench,
  ].map((d) => [
    (d as BenchData).bench,
    d as BenchData,
  ])
);

export function loadBench(slug: string): BenchData {
  const d = DATA[slug];
  if (!d) throw new Error(`unknown benchmark: ${slug}`);
  return d;
}
