"use client";

import { useEffect, useState } from "react";
import Chip from "./Chip";
import TraceViewer from "./TraceViewer";
import { providerOf } from "@/lib/evals/providers";
import type { BenchSamples } from "@/lib/evals/samples";

// Samples tab: episode picker plus the full trace of the chosen episode.
// "#<episode-id>" deep-links a specific episode.
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

  return (
    <section className="bench-section scroll-mt-28">
      <div className="bench-head">
        <div className="bench-title-block">
          <h2>Sample episodes</h2>
          <div className="bench-question">
            Four episodes, shown as short excerpts of the full transcripts.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-6 max-[780px]:grid-cols-1">
        {samples.episodes.map((s) => {
          const on = s.id === active;
          return (
            <button
              key={s.id}
              onClick={() => select(s.id)}
              aria-pressed={on}
              className={`text-left p-5 rounded-lg border cursor-pointer transition-[border-color,box-shadow] duration-150 ${
                on
                  ? "border-[#1a1a1a] bg-bg-elevated shadow-[0_0_0_2.5px_rgba(26,26,26,0.07)]"
                  : "border-border bg-bg-elevated hover:border-[#b0b0b0]"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Chip
                  p={providerOf({ name: s.model, provider: s.provider, scores: {} })}
                />
                <span className="font-sans text-[0.9rem] font-medium text-black">
                  {s.model}
                </span>
                <span className="font-mono text-[0.72rem] text-text-secondary ml-auto">
                  {s.closing}
                </span>
                <span className="font-mono text-[0.68rem] text-text-dim">
                  {s.onTime} on time
                </span>
              </div>
              <p className="text-[0.8rem] leading-[1.55] text-text-secondary mb-0">
                {s.story}
              </p>
            </button>
          );
        })}
      </div>

      <p className="text-[0.78rem] leading-[1.6] text-text-dim mt-4 max-w-[680px]">
        {samples.note} Full evidence bundles and a live byte-for-byte replay
        are available on request:{" "}
        <a href="mailto:hello@multiscalar.ai">hello@multiscalar.ai</a>.
      </p>

      <TraceViewer
        key={active}
        bench={bench}
        episode={active}
        totalTurns={
          samples.episodes.find((e) => e.id === active)!.totalTurns
        }
      />
    </section>
  );
}
