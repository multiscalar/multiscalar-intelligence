"use client";

import BarRows from "./BarRows";
import Matrix from "./Matrix";
import type { BenchData } from "@/lib/evals/types";

export default function BenchSection({
  d,
  metric,
  onMetric,
}: {
  d: BenchData;
  metric: string;
  onMetric: (id: string) => void;
}) {
  const metricDef = d.metrics.find((m) => m.id === metric)!;
  const isMatrix = metricDef.kind === "matrix";
  const sourceLabel = d.source.label || d.source.name;

  return (
    <section id={d.bench} className="bench-section scroll-mt-28">
      <div className="bench-head">
        <div className="bench-title-block">
          <h2>{d.title}</h2>
          <div className="bench-question">{d.question}</div>
          <span className="bench-source">
            by{" "}
            {d.source.url ? (
              <a href={d.source.url} target="_blank" rel="noopener">
                {sourceLabel}
              </a>
            ) : (
              sourceLabel
            )}
          </span>
        </div>
        {d.metrics.length > 1 && (
          <div className="metric-toggle" role="tablist">
            {d.metrics.map((m) => (
              <button
                key={m.id}
                role="tab"
                className={m.id === metric ? "active" : ""}
                onClick={() => onMetric(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="metric-note">
        {isMatrix
          ? ""
          : metricDef.higherIsBetter === false
            ? "↓ lower is better"
            : "↑ higher is better"}
      </p>
      {isMatrix ? <Matrix d={d} /> : <BarRows d={d} metric={metric} />}
      <div className="bench-foot">
        <p className="bench-blurb">
          {d.blurb}
          {d.footnote && <span className="bench-footnote">{d.footnote}</span>}
        </p>
        <div className="bench-stamp">
          results as of {d.source.snapshot}
          <br />
          {d.source.url && (
            <a href={d.source.url} target="_blank" rel="noopener">
              {d.source.linkText || "full results at source"} ↗
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
