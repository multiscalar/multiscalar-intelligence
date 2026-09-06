import type { ComponentType } from "react";
import TreasuryBenchAbout from "./TreasuryBenchAbout";

// Optional extended content (methodology, scoring, sample episodes) per
// benchmark, rendered after the leaderboard sections on its page.
export const BENCH_ABOUT: Record<string, ComponentType> = {
  "treasury-bench": TreasuryBenchAbout,
};
