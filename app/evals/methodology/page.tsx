import type { Metadata } from "next";
import Image from "next/image";
import Faq from "@/components/Faq";
import Principles from "@/components/Principles";
import Reveal from "@/components/Reveal";
import SandCards from "@/components/SandCards";
import MethodMatrix, { type MatrixRow } from "@/components/evals/MethodMatrix";
import ClosingCard from "@/components/home/ClosingCard";
import ScrollHighlight from "@/components/home/ScrollHighlight";
import SectionHeader from "@/components/home/SectionHeader";
import { benchCards } from "@/lib/evals/cards";
import { DIMENSIONS } from "@/lib/evals/eii";
import { SKILLS } from "@/lib/evals/skills";
import { upcomingBench } from "@/lib/evals/upcoming";
import { METHODOLOGY_FAQ } from "@/lib/faq";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "EII Methodology",
  description:
    "How the Economic Intelligence Index measures economic agency: the skills and traits it scores, how benchmarks feed it, and how scores are built.",
  path: "/evals/methodology/",
  image: "/eii/analyst.webp",
});

// Methodology, from the internal EII spec.

// Which benchmarks measure each skill, per the EII table. Capability is the
// result itself; Efficiency (that result per unit of cost) and Reliability
// (its variance across runs) come from the same benchmarks; Robustness from
// harder variants of them (shocks, hostile counterparties); Security from
// EconSec, across every skill. Negotiation has no robustness variant yet.
const SKILL_BENCHES: Record<string, { capability: string[]; robustness: string[] }> = {
  negotiation: { capability: ["zerosum-bench", "terms-bench"], robustness: [] },
  procurement: {
    capability: ["vending-bench-2", "e-commerce-bench", "terms-bench-v2"],
    robustness: ["vending-bench-2", "e-commerce-bench", "terms-bench-v2"],
  },
  pricing: {
    capability: ["vending-bench-2", "e-commerce-bench"],
    robustness: ["vending-bench-2", "e-commerce-bench"],
  },
  "capital-allocation": { capability: ["treasury-bench"], robustness: ["treasury-bench"] },
  operations: { capability: ["travel-planner"], robustness: ["travel-planner"] },
  auctions: { capability: ["auction-bench"], robustness: ["auction-bench"] },
};

const PRINCIPLES = [
  {
    title: "A composite of benchmarks",
    body: "The index combines economic benchmarks of different kinds, public and private, built by us and by others, so no single test decides a score.",
  },
  {
    title: "Real objectives, measurable consequences",
    body: "Every benchmark gives the agent a meaningful goal and tools to pursue it, then scores what its decisions actually caused.",
  },
  {
    title: "Outcomes over opinions",
    body: "Wherever possible we score realized economic outcomes, such as money made or a deal's terms, rather than asking another model to judge.",
  },
];


const STEPS = [
  {
    title: "Episodes",
    picture: "episodes" as const,
    body: "Each model plays every scenario many times, with the same tools, information, budget and constraints as every other model.",
  },
  {
    title: "Outcomes",
    picture: "outcomes" as const,
    body: "We record what its decisions caused: money made or lost, deals closed and their terms, cash that lasts the year.",
  },
  {
    title: "Normalized results",
    picture: "normalized" as const,
    body: "Each result is placed against fixed reference points, so scores compare across benchmarks and over time, with no ceiling to saturate.",
  },
  {
    title: "Skills, traits, index",
    picture: "index" as const,
    body: "Results roll up into skill and trait scores, then into the overall index, with published weights and the uncertainty across runs.",
  },
];

// Questions about the method, answered from this page and the EII spec.


const STANDARDS = [
  ["Economic consequence", "Decisions affect money, assets, liabilities, utility or contractual position."],
  ["Agency", "The model acts through tools, rather than answering questions."],
  ["Uncertainty", "Relevant information is incomplete or has to be discovered."],
  ["Strategic interaction", "Where it matters, other actors pursue their own incentives."],
  ["Objective scoring", "Outcomes are machine-checkable wherever possible."],
  ["Reproducibility", "Environment dynamics are deterministic or carefully seeded."],
  ["Repeated evaluation", "Behaviour is measured across many episodes and reported with uncertainty."],
  ["Standardized harness", "Every model gets comparable tools, information, budgets and constraints."],
  ["Resistance to gaming", "The official score includes private, held-out scenarios."],
  ["Versioning", "Any change to benchmarks, weights or normalization creates a new index version."],
];

export default function MethodologyPage() {
  const cards = new Map(benchCards().map((c) => [c.slug, c]));
  const traits = [...DIMENSIONS];
  const bench = (slug: string) => ({
    title: cards.get(slug)?.title ?? upcomingBench(slug)?.title ?? slug,
    href: `/evals/${slug}/`,
  });
  const rows: MatrixRow[] = SKILLS.map((s) => {
    const m = SKILL_BENCHES[s.slug] ?? { capability: [], robustness: [] };
    const byTrait: Record<string, string[]> = {
      Capability: m.capability,
      Efficiency: m.capability,
      Reliability: m.capability,
      Robustness: m.robustness,
      Security: ["econsec"],
    };
    return { label: s.label, cells: traits.map((t) => (byTrait[t] ?? []).map(bench)) };
  });

  return (
    <>
      {/* Split header: the photo on the left, the title and definition on
          the right; on phones the text comes first. */}
      <header className="max-w-[1200px] mx-auto grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-16 px-8 pt-36 max-[900px]:grid-cols-1 max-[900px]:gap-10 max-[900px]:pt-28 max-[768px]:px-6">
        <Reveal>
          <div className="label text-text-dim">Economic Intelligence Index</div>
          <h1 className="mt-5 font-sans text-[clamp(3rem,6.4vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-black">
            Methodology
          </h1>
          <p className="mt-7 max-w-[500px] text-pretty text-[1.15rem] leading-[1.6] text-black/60">
            The index measures the ability to autonomously pursue economic
            objectives under constraints, uncertainty, strategic counterparties
            and financial risk.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="/evals/"
              className="inline-flex items-center rounded-full bg-black px-6 py-3 text-[0.85rem] font-medium text-white transition-colors hover:bg-black/80 hover:text-white"
            >
              Explore the index
            </a>
            <a
              href="/evals/request-dataset/"
              className="inline-flex items-center rounded-full border border-black/15 px-6 py-3 text-[0.85rem] font-medium text-black transition-colors hover:bg-black/[0.04] hover:text-black max-[768px]:hidden"
            >
              Request a dataset
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="min-[901px]:order-first">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[#1a1712] max-[900px]:aspect-[3/2] max-[768px]:rounded-[20px]">
            <Image
              src="/eii/analyst.webp"
              alt="A white retro robot reading a long ticker tape beside a woman analyst"
              fill
              preload
              sizes="(max-width: 900px) 100vw, 50vw"
              className="object-cover"
              style={{ objectPosition: "45% 50%" }}
            />
          </div>
        </Reveal>
      </header>

      <main>
        <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
          <section className="section-y grid grid-cols-[200px_1fr] gap-16 max-[960px]:grid-cols-1 max-[960px]:gap-6">
            <Reveal className="label text-text-dim pt-[0.6rem]">What we measure</Reveal>
            <ScrollHighlight
              className="max-w-[860px] font-sans text-[clamp(1.4rem,2.2vw,1.95rem)] font-semibold leading-[1.28] tracking-[-0.025em]"
              text="Economic agency, not knowledge of economics. A strong agent doesn't just understand financial concepts. It makes decisions that produce good outcomes while protecting the interests, assets and constraints of the principal it represents."
            />
          </section>

          <section className="section-b">
            <SectionHeader label="Principles" title="Three rules behind every score" />
            <Principles items={PRINCIPLES} />
          </section>
        </div>

        <section className="p-3 pt-0 max-[768px]:p-2 max-[768px]:pt-0">
          <div className="rounded-[28px] panel-dark panel-light max-[768px]:rounded-[20px]">
            <div className="max-w-[1200px] mx-auto px-8 py-20 max-[768px]:px-6 max-[768px]:py-14">
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-14 max-[960px]:grid-cols-1 max-[960px]:gap-6">
                <div>
                  <div className="label text-white/50 mb-3">Skills and traits</div>
                  <h2 className="font-sans text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.035em]">
                    What a model does, and how well it does it
                  </h2>
                </div>
                <p className="self-end text-[1rem] leading-[1.65] text-white/60">
                  Skills are the jobs: negotiating, pricing, allocating capital.
                  Traits are the qualities that make an agent trustworthy at
                  them: getting good outcomes, cheaply, every time, without
                  being played or doing harm. A benchmark feeds every skill and
                  trait it can measure, so none belongs to a single category.
                </p>
              </div>
              <div className="mt-14 max-[768px]:mt-10">
                <MethodMatrix columns={traits} rows={rows} />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
          <section className="section-y">
            <SectionHeader
              label="Scoring"
              title="How a score is built"
              description="From thousands of individual decisions to one comparable number."
            />
            <SandCards items={STEPS} />
          </section>

          <section className="section-b">
            <SectionHeader
              label="Standards"
              title="What a benchmark needs to join the index"
            />
            <Reveal className="grid grid-cols-2 gap-x-14 border-t border-black/10 max-[768px]:grid-cols-1">
              {STANDARDS.map(([name, text]) => (
                <div key={name} className="grid grid-cols-[minmax(0,11rem)_minmax(0,1fr)] gap-6 border-b border-black/10 py-6 max-[480px]:grid-cols-1 max-[480px]:gap-1.5">
                  <h3 className="font-sans text-[1rem] font-semibold text-black">{name}</h3>
                  <p className="text-[0.95rem] leading-[1.6] text-black/55">{text}</p>
                </div>
              ))}
            </Reveal>
          </section>

          <section id="faq" className="section-b scroll-mt-28">
            <Faq items={METHODOLOGY_FAQ} contact={{ href: "/contact/", label: "Write to us" }} />
          </section>
        </div>

        <ClosingCard
          id="results"
          src="/eii/hero.webp"
          alt="A white retro robot shaking hands with a woman across a desk with contracts"
          focus="50% 50%"
          label="Economic Intelligence Index"
          title="See how today's models score"
          description="Rankings by skill and by trait, the cost of each result, and every benchmark behind them."
          actions={[
            { href: "/evals/", label: "Explore the index" },
            { href: "/evals/request-dataset/", label: "Request a dataset" },
          ]}
        />
      </main>
    </>
  );
}
