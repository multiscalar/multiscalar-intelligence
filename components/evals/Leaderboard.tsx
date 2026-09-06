"use client";

import { useEffect, useState } from "react";
import BenchSection from "./BenchSection";
import Radar from "./Radar";
import { BENCHES, loadBench } from "@/lib/evals/benches";
import { radarData } from "@/lib/evals/overview";

const RADAR = radarData();

const defaultMetrics = () =>
  Object.fromEntries(
    BENCHES.map((b) => [b, loadBench(b).defaultMetric])
  ) as Record<string, string>;

function syncHash(bench: string, metric: string) {
  const d = loadBench(bench);
  const suffix = metric !== d.defaultMetric ? "/" + metric : "";
  history.replaceState(null, "", "#" + bench + suffix);
}

// One long page: the radar profile, then every benchmark as a stacked
// section. "#bench" and "#bench/metric" deep links keep working — they
// scroll to the section and select its metric.
export default function Leaderboard() {
  const [metrics, setMetrics] = useState<Record<string, string>>(
    defaultMetrics
  );

  useEffect(() => {
    const [hashBench, hashMetric] = location.hash.replace("#", "").split("/");
    if (!(BENCHES as readonly string[]).includes(hashBench)) return;
    const d = loadBench(hashBench);
    if (hashMetric && d.metrics.some((m) => m.id === hashMetric)) {
      setMetrics((prev) => ({ ...prev, [hashBench]: hashMetric }));
    }
    document.getElementById(hashBench)?.scrollIntoView();
  }, []);

  const selectMetric = (bench: string) => (id: string) => {
    setMetrics((prev) => ({ ...prev, [bench]: id }));
    syncHash(bench, id);
  };

  return (
    <>
      <section className="bench-section" id="profile">
        <div className="bench-head">
          <div className="bench-title-block">
            <h2>Model Profile</h2>
            <div className="bench-question">
              How the models compare across all four benchmarks.
            </div>
          </div>
        </div>
        <Radar data={RADAR} />
      </section>

      {BENCHES.map((b) => (
        <BenchSection
          key={b}
          d={loadBench(b)}
          metric={metrics[b]}
          onMetric={selectMetric(b)}
        />
      ))}
    </>
  );
}
