import type { ComponentType } from "react";
import TreasuryBenchAbout from "./TreasuryBenchAbout";
import ZeroSumBenchAbout from "./ZeroSumBenchAbout";

// Optional extended content (methodology, scoring, sample episodes) per
// benchmark, rendered on the About tab of its page.
export const BENCH_ABOUT: Record<string, ComponentType> = {
  "treasury-bench": TreasuryBenchAbout,
  "zerosum-bench": ZeroSumBenchAbout,
};
