"use client";

import { useEffect, useState } from "react";
import Chip from "./Chip";
import TraceViewer from "./TraceViewer";
import { providerOf } from "@/lib/evals/providers";
import { short } from "@/lib/evals/names";
import type { BenchSamples } from "@/lib/evals/samples";

// Samples tab: a compact episode picker plus the excerpt of the chosen
// episode. "#<episode-id>" deep-links a specific one.
export default function SamplesViewer({
  bench,
  samples,
}: {
  bench: string;
  samples: BenchSamples;
}) {
  const [active, setActive] = useState(samples.episodes[0].id);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (samples.episodes.some((e) => e.id === hash)) setActive(hash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = (id: string) => {
    setActive(id);
    history.replaceState(null, "", "#" + id);
  };

  const episode = samples.episodes.find((e) => e.id === active)!;

  return (
    <section className="bench-section scroll-mt-28">
      <div className="bench-head">
        <div className="bench-title-block">
          <h2>Sample episodes</h2>
          <div className="bench-question">{samples.note}</div>
        </div>
      </div>

      <div className="h2h-picker mt-6">
        {samples.episodes.map((e) => {
          const on = e.id === active;
          return (
            <button
              key={e.id}
              className={`h2h-pick${on ? " active" : ""}`}
              title={e.model}
              onClick={() => select(e.id)}
            >
              <Chip
                p={providerOf({ name: e.model, provider: e.provider, scores: {} })}
              />
              <span>{e.chip ?? short(e.model)}</span>
            </button>
          );
        })}
      </div>

      {episode.traces.map((t) => (
        <div key={t.id}>
          {t.label && (
            <h3 className="font-sans text-[0.95rem] font-medium text-black tracking-[-0.01em] mt-9 mb-1">
              {t.label}
            </h3>
          )}
          <TraceViewer bench={bench} episode={t.id} />
        </div>
      ))}
    </section>
  );
}
