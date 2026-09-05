import type { BenchData } from "./types";
import economicArena from "@/data/evals/economic-arena.json";
import treasuryBench from "@/data/evals/treasury-bench.json";
import termsBench from "@/data/evals/terms-bench.json";
import vendingBench2 from "@/data/evals/vending-bench-2.json";

export const BENCHES = [
  "economic-arena",
  "treasury-bench",
  "terms-bench",
  "vending-bench-2",
] as const;

export const MAX_BARS = 12;

const DATA: Record<string, BenchData> = Object.fromEntries(
  [economicArena, treasuryBench, termsBench, vendingBench2].map((d) => [
    (d as BenchData).bench,
    d as BenchData,
  ])
);

export function loadBench(slug: string): BenchData {
  const d = DATA[slug];
  if (!d) throw new Error(`unknown benchmark: ${slug}`);
  return d;
}
