import { IconArrowUpRight } from "central-icons";
import BenchCard, { ICONS } from "@/components/evals/BenchCard";
import ModelMark from "@/components/evals/ModelMark";
import TabBar from "@/components/evals/TabBar";
import ClosingCard from "@/components/home/ClosingCard";
import SectionHeader from "@/components/home/SectionHeader";
import { BENCH_ABOUT } from "@/components/evals/about";
import { BENCH_SAMPLES } from "@/lib/evals/samples";
import { loadBench } from "@/lib/evals/benches";
import { CLOSING_IMAGE } from "@/lib/evals/images";
import { CATEGORY, benchCards } from "@/lib/evals/cards";
import { contactHref } from "@/lib/contact";
import { benchStats } from "@/lib/evals/leaderboard";
import "../evals.css";
import BackLink from "@/components/BackLink";

// The three benchmarks closest to this one: same category first, then
// shared index dimensions, live ones before announced ones.
function similar(slug: string) {
  const cards = benchCards();
  const self = cards.find((c) => c.slug === slug)!;
  const score = (c: (typeof cards)[number]) =>
    (c.label === self.label ? 3 : 0) +
    c.dimensions.filter((d) => self.dimensions.includes(d)).length -
    (c.comingSoon ? 0.5 : 0);
  return cards
    .filter((c) => c.slug !== slug)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 3);
}

export default async function BenchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = loadBench(slug);
  const stats = benchStats(d);
  const category = CATEGORY[slug];
  const Icon = category ? ICONS[category.icon] : null;
  const sourceLabel = d.source.label || d.source.name;
  const tabs = [
    { href: `/evals/${slug}/`, label: "Leaderboard" },
    ...(BENCH_ABOUT[slug]
      ? [{ href: `/evals/${slug}/about/`, label: "About" }]
      : []),
    ...(BENCH_SAMPLES[slug]
      ? [{ href: `/evals/${slug}/samples/`, label: "Samples" }]
      : []),
  ];

  const closing = CLOSING_IMAGE[slug] ?? CLOSING_IMAGE["zerosum-bench"];

  return (
    <>
      <main className="max-w-[1200px] mx-auto pt-32 px-8 section-b max-[780px]:pt-28 max-[780px]:px-5">
        <BackLink href="/evals/#benchmarks">All benchmarks</BackLink>

        <header className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-8 max-[860px]:grid-cols-1">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {category && Icon && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.05] px-3 py-1.5 text-[0.75rem] font-medium text-black/75">
                  <Icon aria-hidden strokeWidth={1.8} className="w-3.5 h-3.5" />
                  {category.label}
                </span>
              )}
              <span className="text-[0.78rem] text-text-dim">
                by{" "}
                {d.source.url ? (
                  <a
                    href={d.source.url}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-0.5 text-black/70 underline decoration-black/20 underline-offset-2 hover:text-black"
                  >
                    {sourceLabel}
                    <IconArrowUpRight aria-hidden className="w-3 h-3" />
                  </a>
                ) : (
                  sourceLabel
                )}
              </span>
            </div>
            <h1 className="font-sans text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-black">
              {d.title}
            </h1>
            <p className="mt-4 max-w-[640px] text-[clamp(1.1rem,1.6vw,1.35rem)] leading-[1.4] text-black/55">
              {d.question}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`/evals/request-dataset/?bench=${slug}`}
              className="inline-flex items-center rounded-full bg-black px-6 py-3 text-[0.85rem] font-medium text-white transition-colors hover:bg-black/80 hover:text-white"
            >
              Request full dataset
            </a>
            {d.source.paper && (
              <a
                href={d.source.paper}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-6 py-3 text-[0.85rem] font-medium text-black transition-colors hover:bg-black/[0.04] hover:text-black"
              >
                Read the paper
                <IconArrowUpRight aria-hidden className="w-4 h-4" />
              </a>
            )}
          </div>
        </header>

        <dl className="mt-12 grid grid-cols-4 border-y border-black/10 max-[860px]:grid-cols-2">
          <Stat label="Models evaluated">{stats.models}</Stat>
          <Stat label="Leader">
            <span className="flex min-w-0 items-center gap-2.5">
              <ModelMark
                icon={stats.leader.icon}
                mark={stats.leader.mark}
                color={stats.leader.color}
                tone="light"
              />
              <span className="truncate max-[860px]:whitespace-normal max-[860px]:text-[1.05rem] max-[860px]:leading-tight">
                {stats.leader.name}
              </span>
            </span>
          </Stat>
          <Stat label="Top score">
            {stats.leader.value}
            <span className="mt-1 block text-[0.78rem] font-normal tracking-normal text-text-dim">
              {stats.metric}
            </span>
          </Stat>
          <Stat label="Updated">{stats.updated}</Stat>
        </dl>

        <div className="mt-10 grid grid-cols-[200px_minmax(0,1fr)] gap-16 max-[860px]:grid-cols-1 max-[860px]:gap-4">
          <div className="label text-text-dim pt-1">How it works</div>
          <div className="max-w-[760px]">
            <p className="text-[1rem] leading-[1.7] text-black/70">{d.blurb}</p>
            {d.footnote && (
              <p className="mt-3 text-[0.82rem] leading-[1.6] text-text-dim">
                {d.footnote}
              </p>
            )}
          </div>
        </div>

        <TabBar tabs={tabs} />

        {children}

        <section className="section-mt">
          <SectionHeader
            label="More benchmarks"
            title="Similar benchmarks"
            link={{ href: "/evals/#benchmarks", label: "All benchmarks" }}
          />
          <div className="grid grid-cols-3 gap-4 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1">
            {similar(slug).map((card) => (
              <BenchCard
                key={card.slug}
                card={card}
                tone="light"
                cta
              />
            ))}
          </div>
        </section>
      </main>

      <ClosingCard
        id="get-the-data"
        src={closing.src}
        alt={closing.alt}
        focus="50% 40%"
        label="Go deeper"
        title="Get the full dataset"
        description={`Every episode, transcript and score behind the ${d.title} leaderboard, for your own analysis, or run your model through it before release.`}
        actions={[
          {
            href: `/evals/request-dataset/?bench=${slug}`,
            label: "Request the dataset",
          },
          {
            href: contactHref("evaluation"),
            label: "Evaluate your model",
          },
        ]}
      />
    </>
  );
}

function Stat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 border-black/10 px-6 py-6 first:pl-0 [&:not(:first-child)]:border-l max-[860px]:[&:nth-child(3)]:border-l-0 max-[860px]:[&:nth-child(3)]:pl-0 max-[860px]:[&:nth-child(n+3)]:border-t">
      <dt className="label text-text-dim">{label}</dt>
      <dd className="mt-3 text-[clamp(1.2rem,2vw,1.6rem)] font-semibold tracking-[-0.02em] text-black tabular-nums">
        {children}
      </dd>
    </div>
  );
}
