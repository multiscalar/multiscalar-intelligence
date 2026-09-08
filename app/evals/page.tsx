import type { Metadata } from "next";
import Chip from "@/components/evals/Chip";
import HashRedirect from "@/components/evals/HashRedirect";
import { BENCHES, loadBench } from "@/lib/evals/benches";
import { benchField, overviewStats } from "@/lib/evals/overview";
import { fmt } from "@/lib/evals/score";
import type { BenchFieldData } from "@/lib/evals/overview";
import "./evals.css";

// Every evaluated model as a dot on the benchmark's default metric,
// worst to best left to right; hover a dot for the model and score.
function FieldStrip({ field }: { field: BenchFieldData }) {
  return (
    <span className="relative inline-block h-[12px] w-[170px] align-middle">
      {field.dots.map((dot) => (
        <span
          key={dot.name}
          title={`${dot.name}: ${fmt(dot.value, field.unit)}`}
          className="absolute top-1/2 size-[7px] rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${(4 + dot.pos * 92).toFixed(2)}%`,
            background: dot.color,
            opacity: 0.8,
          }}
        />
      ))}
    </span>
  );
}

export const metadata: Metadata = {
  title: "Evals | Multiscalar Intelligence",
  description:
    "Economic agent leaderboards: negotiation competence, long-horizon business coherence, and exploitability under an optimizing adversary.",
};

export default function EvalsPage() {
  const stats = overviewStats();
  return (
    <main className="max-w-[1000px] mx-auto pt-32 px-8 pb-24 max-[780px]:pt-28 max-[780px]:px-5 max-[780px]:pb-16">
      <HashRedirect />
      <section>
        <div className="font-mono text-[0.75rem] uppercase tracking-[0.2em] text-text-dim mb-6">
          Economic Agent Evaluation
        </div>
        <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-normal tracking-[-0.02em] leading-[1.15] mb-[1.2rem]">
          Economic Agent Leaderboards
        </h1>
        <p className="max-w-[620px] text-text-secondary mb-10">
          Can an agent negotiate? Can it run a business? And how much money does
          it lose when the other side plays dirty? We curate the benchmarks that
          answer these questions, and build the ones that don&apos;t exist yet.
        </p>
        <div className="flex flex-wrap gap-x-14 gap-y-4 mb-14">
          {[
            ["Benchmarks", String(stats.benches)],
            ["Models", String(stats.models)],
            ["Last measured", stats.snapshot],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-text-dim mb-1">
                {label}
              </div>
              <div className="font-sans text-[1.15rem] font-medium text-black tracking-[-0.01em]">
                {value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Model Profile radar is parked until the same model roster has
          results across all benchmarks again; components/evals/Radar.tsx
          and lib/evals/overview.ts radarData() remain ready to remount. */}

      <section className="bench-section" id="benchmarks">
        <div className="bench-head">
          <div className="bench-title-block">
            <h2>Benchmarks</h2>
            <div className="bench-question">
              Full leaderboards, one page per benchmark.
            </div>
          </div>
        </div>
        <ul className="list-none mt-6 border-t border-border">
          {BENCHES.map((slug) => {
            const d = loadBench(slug);
            const field = benchField(slug);
            return (
              <li key={slug} className="border-b border-border">
                <a
                  href={`/evals/${slug}/`}
                  className="group grid grid-cols-[1fr_auto_1.4rem] items-baseline gap-x-6 gap-y-[0.45rem] py-[1.15rem] px-[0.2rem] text-text transition-[background,padding-left] duration-[0.25s] hover:bg-bg-elevated hover:pl-[0.8rem] max-[780px]:grid-cols-[1fr_1.4rem]"
                >
                  <span className="flex items-baseline gap-3 min-w-0">
                    <span className="font-sans text-[1rem] font-medium text-black whitespace-nowrap">
                      {d.title}
                    </span>
                    <span className="font-mono text-[0.66rem] text-text-dim tracking-[0.08em] whitespace-nowrap">
                      {field.dots.length} models · {d.source.snapshot}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 justify-self-end max-[780px]:hidden">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-text-dim">
                      leads
                    </span>
                    <Chip p={field.leader.provider} />
                    <span className="font-sans text-[0.82rem] text-text whitespace-nowrap">
                      {field.leader.name}
                      <span className="text-text-dim">
                        {" "}
                        {fmt(field.leader.value, field.unit)}
                      </span>
                    </span>
                  </span>
                  <span className="row-span-2 self-center justify-self-end font-mono text-[0.82rem] text-text-dim tracking-[0.03em] transition-[letter-spacing] duration-300 group-hover:tracking-[0.07em] group-hover:text-text">
                    →
                  </span>
                  <span className="font-sans text-[0.88rem] text-text-secondary">
                    {d.question}
                  </span>
                  <span className="justify-self-end self-center max-[780px]:hidden">
                    <FieldStrip field={field} />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
