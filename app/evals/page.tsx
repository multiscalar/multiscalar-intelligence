import type { Metadata } from "next";
import HashRedirect from "@/components/evals/HashRedirect";
import Radar from "@/components/evals/Radar";
import { BENCHES, loadBench } from "@/lib/evals/benches";
import { overviewStats, radarData } from "@/lib/evals/overview";
import { providerOf, PROVIDERS } from "@/lib/evals/providers";
import "./evals.css";

export const metadata: Metadata = {
  title: "Evals | Multiscalar Intelligence",
  description:
    "Economic agent leaderboards: negotiation competence, long-horizon business coherence, and exploitability under an optimizing adversary.",
};

export default function EvalsPage() {
  const stats = overviewStats();
  const radar = radarData();
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

      <section className="bench-section" id="profile">
        <div className="bench-head">
          <div className="bench-title-block">
            <h2>Model Profile</h2>
            <div className="bench-question">
              How the models compare across all four benchmarks.
            </div>
          </div>
        </div>
        <Radar data={radar} />
      </section>

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
            const models = d.models.filter(
              (m) => providerOf(m) !== PROVIDERS.baseline
            ).length;
            return (
              <li key={slug} className="border-b border-border">
                <a
                  href={`/evals/${slug}/`}
                  className="group grid grid-cols-[180px_1fr_auto_auto] items-baseline gap-x-5 py-[0.95rem] px-[0.2rem] text-text transition-[background,padding-left] duration-[0.25s] hover:bg-bg-elevated hover:pl-[0.8rem] max-[780px]:grid-cols-[1fr_auto]"
                >
                  <span className="font-sans text-[0.95rem] font-medium text-black">
                    {d.title}
                  </span>
                  <span className="font-sans text-[0.88rem] text-text-secondary max-[780px]:hidden">
                    {d.question}
                  </span>
                  <span className="font-mono text-[0.68rem] text-text-dim tracking-[0.08em] whitespace-nowrap max-[780px]:hidden">
                    {models} models · {d.source.snapshot}
                  </span>
                  <span className="font-mono text-[0.82rem] text-text-dim tracking-[0.03em] transition-[letter-spacing] duration-300 group-hover:tracking-[0.07em] group-hover:text-text">
                    →
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
