import type { ComponentType } from "react";
import TreasuryScatter from "./TreasuryScatter";

// Optional extra chart sections per benchmark, rendered on the Leaderboard
// tab after the metric sections.
export const BENCH_LEADERBOARD_EXTRAS: Record<string, ComponentType> = {
  "treasury-bench": TreasuryScatter,
};
