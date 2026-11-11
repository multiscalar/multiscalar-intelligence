import ChartCard from "../ChartCard";
import Dumbbell from "../Dumbbell";
import type { BenchData } from "@/lib/evals/types";

// TERMS-Bench reports two rates; side by side they separate models that
// close deals from models that close good ones.
export default function TermsGap({ d }: { d: BenchData }) {
  return (
    <ChartCard
      id="agreement-vs-surplus"
      label="Trade-off"
      title="Closing the deal vs. closing it well"
      description="Nearly every model reaches agreement; far fewer capture the surplus available. The orange gap is value agreed away."
    >
      <Dumbbell d={d} outer="agr_plus" inner="se_plus" gapLabel="left on the table" />
    </ChartCard>
  );
}
