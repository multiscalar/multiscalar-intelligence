import type { ComponentType } from "react";
import GameProfile from "../GameProfile";
import HeadToHead from "../HeadToHead";
import BalanceRace from "./BalanceRace";
import ReturnOnInference from "./ReturnOnInference";
import TermsGap from "./TermsGap";
import TreasuryScatter from "./TreasuryScatter";
import type { BenchData } from "@/lib/evals/types";

// Deep-dive charts per benchmark, rendered on the Leaderboard tab below the
// main ranking, in order.
export const BENCH_LEADERBOARD_EXTRAS: Record<
  string,
  ComponentType<{ d: BenchData }>[]
> = {
  "zerosum-bench": [HeadToHead, GameProfile, ReturnOnInference],
  "treasury-bench": [BalanceRace, TreasuryScatter, ReturnOnInference],
  "terms-bench": [TermsGap, ReturnOnInference],
  "vending-bench-2": [BalanceRace, ReturnOnInference],
};
