import type { ComponentType } from "react";
import GameProfile from "../GameProfile";
import HeadToHead from "../HeadToHead";
import BalanceRace from "./BalanceRace";
import ReturnOnInference from "./ReturnOnInference";
import type { BenchData } from "@/lib/evals/types";

// Deep-dive charts per benchmark, rendered on the Leaderboard tab below the
// main ranking, in order. The index benchmarks have none: their boards carry
// the index score only (TermsGap and TreasuryScatter were built for the
// earlier TERMS and Treasury boards' data, and are kept for a later chart).
export const BENCH_LEADERBOARD_EXTRAS: Record<
  string,
  ComponentType<{ d: BenchData }>[]
> = {
  "zerosum-bench": [HeadToHead, GameProfile, ReturnOnInference],
  "vending-bench-2": [BalanceRace, ReturnOnInference],
};
