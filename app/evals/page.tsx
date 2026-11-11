import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import BenchmarkList from "@/components/evals/BenchmarkList";
import Methodology from "@/components/evals/Methodology";

import Faq from "@/components/Faq";
import { INDEX_FAQ } from "@/lib/faq";
import ChartCard from "@/components/evals/ChartCard";
import ProgressChart from "@/components/evals/ProgressChart";
import RoiChart from "@/components/evals/RoiChart";
import HashRedirect from "@/components/evals/HashRedirect";
import IndexPreview from "@/components/evals/IndexPreview";
import ClosingCard from "@/components/home/ClosingCard";
import ScrollHighlight from "@/components/home/ScrollHighlight";
import SectionHeader from "@/components/home/SectionHeader";
import { contactHref } from "@/lib/contact";
import { benchCards } from "@/lib/evals/cards";
import { releaseDate, withIndexScores } from "@/lib/evals/index-scores";
import { modelRoster } from "@/lib/evals/overview";
import "./evals.css";

export const metadata: Metadata = pageMetadata({
  title: "Evals",
  description:
    "The Economic Intelligence Index: one score for how well AI models negotiate, plan, price, allocate capital and resist manipulation, drawn from leading third-party benchmarks and our own.",
  path: "/evals/",
  image: "/eii/observation.webp",
});

const EARLY_ACCESS = contactHref("evaluation");

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
  const benchHeader = (
    <SectionHeader
      label="Benchmarks"
      title="The benchmarks behind the index"
      description="Each one has a full public leaderboard, and feeds one or more of the index's five capabilities."
    />
  );
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
  return (
    <>
      <HashRedirect />
      <Hero
        short
        src="/eii/observation.webp"
        mobileFocus="86% 50%"
        alt="A white retro robot working at a desk while a woman with a clipboard watches it through a glass partition"
        eyebrow="Economic Intelligence Index"
        title="Measuring AI's ability to make economic decisions"
        description="A composite measure of economic decision-making in AI models: negotiation, pricing, capital allocation and adversarial robustness, evaluated across established external benchmarks and our own."
        actions={[
          { href: "/evals/request-dataset/", label: "Request a dataset" },
          { href: "#methodology", label: "Methodology" },
        ]}
      />

      <main>
        <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
          <section className="section-y grid grid-cols-[200px_1fr] gap-16 max-[960px]:grid-cols-1 max-[960px]:gap-6">
            <Reveal className="label text-text-dim pt-[0.6rem]">
              Why an index
            </Reveal>
            <ScrollHighlight
              className="max-w-[860px] font-sans text-[clamp(1.4rem,2.2vw,1.95rem)] font-semibold leading-[1.28] tracking-[-0.025em]"
              text="Models are starting to negotiate, price and allocate capital on our behalf. Before we hand them a budget, we need to know how they behave in a market. The index measures that in one comparable score, across five dimensions."
            />
          </section>
        </div>

        <section className="p-3 pt-0 max-[768px]:p-2 max-[768px]:pt-0">
          <div className="rounded-[28px] panel-dark panel-light max-[768px]:rounded-[20px]">
            <div className="max-w-[1200px] mx-auto px-8 py-20 max-[768px]:px-6 max-[768px]:py-14">
              <IndexPreview
                roster={roster}
                label="Index preview"
                title="Five capabilities of economic intelligence"
                description={
                  <>
                    Each model is scored on five capabilities, from its results
                    across the{" "}
                    <a
                      href="#benchmarks"
                      className="text-white underline decoration-white/35 underline-offset-[3px] transition-colors hover:text-white hover:decoration-white"
                    >
                      benchmark suite
                    </a>
                    . The overall index combines them.{" "}
                    <a
                      href="#methodology"
                      className="text-white underline decoration-white/35 underline-offset-[3px] transition-colors hover:text-white hover:decoration-white"
                    >
                      Read the methodology
                    </a>
                  </>
                }
              />
            </div>
          </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
          <ChartCard
            id="cost"
            label="Cost"
            title="What each point of intelligence costs"
            description="Index score against inference spend per run, on a log scale. Models on the frontier get the most intelligence for their price; everything below it pays more for less."
          >
            <RoiChart points={costs} unit="" metric="Index score" />
          </ChartCard>

          <ChartCard
            id="progress"
            label="Progress"
            title="Economic intelligence over time"
            description="Index score against each model's release date. The frontier steps up with every new record; the trend through it shows how fast the field is improving."
          >
            <ProgressChart points={progress} />
          </ChartCard>

          <section id="benchmarks" className="section-y scroll-mt-24">
            {benchHeader}
            <BenchmarkList cards={cards} />
          </section>

          <Methodology />

          <section id="faq" className="section-b scroll-mt-28">
            <Faq items={INDEX_FAQ} contact={{ href: "/contact/", label: "Write to us" }} />
          </section>
        </div>

        <ClosingCard
          id="evaluate"
          src="/eii/flower-stall.webp"
          alt="A white retro robot running a sunlit flower stall, wrapping a bouquet beside a man in a cap"
          focus="50% 50%"
          label="For AI labs and enterprises"
          title="See how your model performs as an economic agent"
          description="Run your model through the benchmarks before release, or license the data behind them."
          actions={[
            { href: EARLY_ACCESS, label: "Evaluate your model" },
            { href: "/open-science/", label: "Read our research" },
          ]}
        />
      </main>
    </>
  );
}
