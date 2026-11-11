import ChartCard from "../ChartCard";
import RoiChart from "../RoiChart";
import { chartModel, exampleCost } from "@/lib/evals/examples";
import { scoredModels } from "@/lib/evals/score";
import type { BenchData } from "@/lib/evals/types";

// Result against what it cost in inference to produce it.
export default function ReturnOnInference({ d }: { d: BenchData }) {
  const metric = d.metrics.find((m) => m.id === d.defaultMetric)!;
  const points = scoredModels(d, metric.id).map((r) => ({
    ...chartModel(r.model),
    score: r.value,
    cost: exampleCost(d.bench, r.model),
  }));
  return (
    <ChartCard
      id="return-on-inference"
      label="Return on inference"
      title="What each result costs"
      description="Score against inference spend per run. Models on the dashed frontier get the best result for their price; everything below it pays more for less."
      example
    >
      <RoiChart points={points} unit={metric.unit} metric={metric.label.split(" (")[0]} />
    </ChartCard>
  );
}
