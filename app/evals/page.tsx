import type { Metadata } from "next";
import Leaderboard from "@/components/evals/Leaderboard";
import "./evals.css";

export const metadata: Metadata = {
  title: "Evals | Multiscalar Intelligence",
  description:
    "Economic agent leaderboards: negotiation competence, long-horizon business coherence, and exploitability under an optimizing adversary.",
};

export default function EvalsPage() {
  return (
    <main className="max-w-[1200px] mx-auto pt-32 px-8 pb-24 max-[780px]:pt-28 max-[780px]:px-5 max-[780px]:pb-16">
      <section>
        <div className="font-mono text-[0.75rem] uppercase tracking-[0.2em] text-text-dim mb-6">
          Economic Agent Evaluation
        </div>
        <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-normal tracking-[-0.02em] leading-[1.15] mb-[1.2rem]">
          Economic Agent Leaderboards
        </h1>
        <p className="max-w-[620px] text-text-secondary mb-14">
          Can an agent negotiate? Can it run a business? And how much money does
          it lose when the other side plays dirty? We curate the benchmarks that
          answer these questions, and build the ones that don&apos;t exist yet.
        </p>
      </section>

      <Leaderboard />
    </main>
  );
}
