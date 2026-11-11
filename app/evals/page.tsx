import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import BenchmarkList from "@/components/evals/BenchmarkList";
import Methodology from "@/components/evals/Methodology";
import Faq from "@/components/Faq";
import { INDEX_FAQ, fmtDate } from "@/lib/faq";
import ChartCard from "@/components/evals/ChartCard";
import CiteBlock from "@/components/evals/CiteBlock";
import { bibtexFor } from "@/lib/cite";
import ProgressChart from "@/components/evals/ProgressChart";
import RoiChart from "@/components/evals/RoiChart";
import HashRedirect from "@/components/evals/HashRedirect";
import IndexPreview from "@/components/evals/IndexPreview";
import SectionHeader from "@/components/home/SectionHeader";
import { INDEX_BENCHES } from "@/lib/evals/benches";
import { benchCards } from "@/lib/evals/cards";
import { INDEX_SNAPSHOT, releaseDate, withIndexScores } from "@/lib/evals/index-scores";
import { modelRoster } from "@/lib/evals/overview";
import { dataHref } from "@/lib/data";
import "./evals.css";

export const metadata: Metadata = pageMetadata({
  title: "Economic Intelligence Index",
  description:
    "The Economic Intelligence Index: one score for how well AI models negotiate, plan, price, allocate capital and resist manipulation, drawn from leading third-party benchmarks and our own.",
  path: "/evals/",
  image: "/eii/observation.webp",
});

export default function EvalsPage() {
  const roster = modelRoster();
  // Scores and costs from eii-prod, release dates from OpenRouter's catalog
  // (data/evals/index.json, written by tools/export_eii_cards.py).
  const indexed = withIndexScores(roster);
  const scored = indexed.map((m) => ({
    name: m.name,
    icon: m.icon,
    mark: m.mark,
    color: m.color,
    score: Math.round(m.overall * 1000) / 10,
  }));
  const cards = benchCards();
  const progress = scored.map((m) => ({ ...m, date: releaseDate(m.name) }));
  const costs = indexed.map((m) => ({
    name: m.name,
    provider: "",
    icon: m.icon,
    mark: m.mark,
    color: m.color,
    baseline: false,
    cost: m.cost,
    score: Math.round(m.overall * 1000) / 10,
  }));
  const release = fmtDate(INDEX_SNAPSHOT);
  return (
    <>
      <HashRedirect />
      <main>
        {/* A short header: the title, one line and the actions, then the
            leaderboard straight away. */}
        <header className="max-w-[1200px] mx-auto px-8 pt-32 pb-10 max-[768px]:px-6 max-[768px]:pt-28 max-[768px]:pb-8">
          <h1 className="font-sans text-[clamp(2.4rem,5.2vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-black">
            Economic Intelligence Index
          </h1>
          <div className="mt-6 flex items-end justify-between gap-10 max-[860px]:flex-col max-[860px]:items-start max-[860px]:gap-7">
            <div>
              <p className="max-w-[600px] text-pretty text-[clamp(1.05rem,1.4vw,1.2rem)] leading-[1.55] text-black/60">
                One comparable score for how well AI models make economic decisions: negotiating,
                pricing, allocating capital and resisting manipulation.
              </p>
              <p className="mt-3 text-[0.85rem] text-text-dim tabular-nums">
                Release of {release} · {indexed.length} models · {INDEX_BENCHES.length} benchmarks
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <a
                href="#scores"
                className="inline-flex items-center rounded-full bg-ember-ink px-6 py-3 text-[0.85rem] font-medium text-ember transition-colors hover:bg-black hover:text-ember"
              >
                See the scores
              </a>
              <a
                href="#methodology"
                className="inline-flex items-center rounded-full border border-black/15 px-6 py-3 text-[0.85rem] font-medium text-black transition-colors hover:bg-black/[0.04] hover:text-black"
              >
                Methodology
              </a>
            </div>
          </div>
        </header>


        <section id="scores" className="p-3 pt-0 scroll-mt-28 max-[768px]:p-2 max-[768px]:pt-0">
          <div className="rounded-[28px] panel-dark panel-light max-[768px]:rounded-[20px]">
            <div className="max-w-[1200px] mx-auto px-8 py-16 max-[768px]:px-6 max-[768px]:py-12">
              <IndexPreview
                roster={roster}
                title="Where every model stands"
                description={
                  <>
                    Each model is scored on five capabilities from its results across the{" "}
                    <a
                      href="#benchmarks"
                      className="text-white underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-white"
                    >
                      benchmark suite
                    </a>
                    . The overall index combines them.
                  </>
                }
              />
            </div>
          </div>
        </section>


        <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
          <section id="benchmarks" className="section-t scroll-mt-28">
            <SectionHeader
              title="Six benchmarks, one score"
              description="Each one has a full public leaderboard and feeds one or more of the index's five capabilities."
            />
            <BenchmarkList cards={cards} />
          </section>

          <section aria-label="The data" className="section-t">
            <div className="flex items-center justify-between gap-8 border-y border-black/15 py-8 max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-4">
              <div>
                <h2 className="text-[clamp(1.3rem,2vw,1.6rem)] font-semibold leading-[1.2] tracking-[-0.025em] text-black">
                  The data behind every leaderboard
                </h2>
                <p className="mt-2 max-w-[560px] text-[1rem] leading-[1.65] text-black/65">
                  Every episode, transcript and score, for your own analysis.
                </p>
              </div>
              <a
                href={dataHref()}
                className="shrink-0 text-[0.9rem] font-medium text-black underline decoration-black/25 underline-offset-4 transition-colors hover:decoration-black"
              >
                Request the data
              </a>
            </div>
          </section>

          <ChartCard
            id="cost"
            title="What each point of intelligence costs"
            description="Index score against inference spend per run, on a log scale. Models on the frontier get the most intelligence for their price; everything below it pays more for less."
          >
            <RoiChart points={costs} unit="" metric="Index score" />
          </ChartCard>

          <ChartCard
            id="progress"
            title="Economic intelligence over time"
            description="Index score against each model's release date. The frontier steps up with every new record; the trend through it shows how fast the field is improving."
          >
            <ProgressChart points={progress} />
          </ChartCard>

          <div className="section-t">
            <Methodology />
          </div>

          <section id="cite" className="section-b scroll-mt-28">
            <SectionHeader
              title="Cite the index"
              description={`Scores are comparable within a release. This page shows the release of ${release}.`}
            />
            <CiteBlock
              bibtex={bibtexFor({
                key: `multiscalar_eii_${INDEX_SNAPSHOT.replaceAll("-", "")}`,
                title: "Economic Intelligence Index",
                snapshot: INDEX_SNAPSHOT,
                path: "/evals/",
                note: `Release of ${release}`,
              })}
            />
          </section>

          <section id="faq" className="section-b scroll-mt-28">
            <Faq items={INDEX_FAQ} contact={{ href: "/contact/", label: "Write to us" }} />
          </section>
        </div>

      </main>
    </>
  );
}
