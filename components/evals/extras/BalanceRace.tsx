import ChartCard from "../ChartCard";
import RaceChart from "../RaceChart";
import { benchSeries } from "@/lib/evals/examples";
import type { BenchData } from "@/lib/evals/types";

const COPY: Record<string, { title: string; description: string }> = {
  "treasury-bench": {
    title: "A year of treasury, day by day",
    description:
      "Each model's closing balance across the replayed year. Steady compounding separates the leaders; a missed payment cascade shows up as a cliff.",
  },
  "vending-bench-2": {
    title: "A year of running the business",
    description:
      "Net worth across the simulated year, from the same starting cash. Hover to scrub through the year, or follow one model from the list below.",
  },
};

// The ranking as it unfolded: balance per model across the simulated year.
export default function BalanceRace({ d }: { d: BenchData }) {
  const data = benchSeries(d);
  if (!data) return null;
  const copy = COPY[d.bench] ?? {
    title: "Over the simulated year",
    description: "Each model's balance, day by day.",
  };
  return (
    <ChartCard
      id="over-time"
      label="Over time"
      title={copy.title}
      description={copy.description}
      example={data.example}
    >
      <RaceChart data={data} />
    </ChartCard>
  );
}
