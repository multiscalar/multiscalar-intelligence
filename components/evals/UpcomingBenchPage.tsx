import Faq from "@/components/Faq";
import { upcomingFaq } from "@/lib/faq";
import BackLink from "@/components/BackLink";
import Reveal from "@/components/Reveal";
import BenchCard, { ICONS } from "@/components/evals/BenchCard";
import ClosingCard from "@/components/home/ClosingCard";
import SectionHeader from "@/components/home/SectionHeader";
import { allBenchCards } from "@/lib/evals/cards";
import { BENCH_CAPABILITIES } from "@/lib/evals/eii";
import type { UpcomingBench } from "@/lib/evals/upcoming";

// Page for a benchmark still in development: the same header, stats row and
// "How it works" as a live benchmark, then what it will score, in place of a
// leaderboard.
export default function UpcomingBenchPage({ b }: { b: UpcomingBench }) {
  const Icon = ICONS[b.icon];
  const cards = allBenchCards().filter((c) => c.slug !== b.slug);
  // Live benchmarks sharing a capability first, then the rest.
  const caps = BENCH_CAPABILITIES[b.slug] ?? [];
  const shared = (c: (typeof cards)[number]) =>
    c.dimensions.filter((d) => caps.includes(d)).length - (c.comingSoon ? 0.5 : 0);
  const similar = [...cards].sort((x, y) => shared(y) - shared(x)).slice(0, 3);

  return (
    <>
      <main className="max-w-[1200px] mx-auto pt-32 px-8 section-b max-[780px]:pt-28 max-[780px]:px-5">
        <BackLink href="/evals/#benchmarks">All benchmarks</BackLink>

        <header className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-8 max-[860px]:grid-cols-1">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.05] px-3 py-1.5 text-[0.75rem] font-medium text-black/75">
                <Icon aria-hidden strokeWidth={1.8} className="h-3.5 w-3.5" />
                {b.label}
              </span>
              <span className="text-[0.78rem] text-text-dim">by Multiscalar</span>
            </div>
            <h1 className="font-sans text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-black">
              {b.title}
            </h1>
            <p className="mt-4 max-w-[640px] text-[clamp(1.1rem,1.6vw,1.35rem)] leading-[1.4] text-black/55">
              {b.question}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/contact/"
              className="inline-flex items-center rounded-full bg-ember-ink px-6 py-3 text-[0.85rem] font-medium text-ember transition-colors hover:bg-black hover:text-ember"
            >
              Get notified
            </a>
            <a
              href="/evals/#methodology"
              className="inline-flex items-center rounded-full border border-black/15 px-6 py-3 text-[0.85rem] font-medium text-black transition-colors hover:bg-black/[0.04] hover:text-black"
            >
              Read the methodology
            </a>
          </div>
        </header>

        <dl className="mt-12 grid grid-cols-4 border-y border-black/10 max-[860px]:grid-cols-2">
          <Stat label="Status">In development</Stat>
          <Stat label="Skills">{b.skills.join(", ")}</Stat>
          <Stat label="Feeds">{b.traits.join(", ")}</Stat>
          <Stat label="Results">Coming soon</Stat>
        </dl>

        <div className="mt-10 grid grid-cols-[200px_minmax(0,1fr)] gap-16 max-[860px]:grid-cols-1 max-[860px]:gap-4">
          <div className="label text-text-dim pt-1">How it works</div>
          <p className="max-w-[760px] text-[1rem] leading-[1.7] text-black/70">{b.blurb}</p>
        </div>

        <section className="section-mt">
          <SectionHeader label="Scoring" title="What it will measure" />
          <Reveal className="grid grid-cols-3 border-t border-black/10 max-[860px]:grid-cols-1">
            {b.scores.map(([name, text]) => (
              <div
                key={name}
                className="border-b border-black/10 py-6 pr-8 max-[860px]:pr-0 min-[861px]:[&:not(:first-child)]:border-l min-[861px]:[&:not(:first-child)]:pl-8"
              >
                <h3 className="font-sans text-[1.15rem] font-semibold tracking-[-0.015em] text-black">{name}</h3>
                <p className="mt-2 text-[0.95rem] leading-[1.6] text-black/55">{text}</p>
              </div>
            ))}
          </Reveal>
        </section>

        <section className="section-mt">
          <SectionHeader
            label="More benchmarks"
            title="Similar benchmarks"
            link={{ href: "/evals/#benchmarks", label: "All benchmarks" }}
          />
          <div className="grid grid-cols-3 gap-4 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1">
            {similar.map((card) => (
              <BenchCard key={card.slug} card={card} tone="light" cta />
            ))}
          </div>
        </section>

        <section id="faq" className="section-mt scroll-mt-28">
          <Faq items={upcomingFaq(b)} contact={{ href: "/contact/", label: "Write to us" }} />
        </section>
      </main>

      <ClosingCard
        id="notify"
        src="/eii/observation.webp"
        alt="A white retro robot working at a desk beside a woman reading a clipboard"
        focus="50% 45%"
        title={`${b.title} is coming to the index`}
        description="Its results will be published with the next version of the Economic Intelligence Index."
        actions={[
          { href: "/contact/", label: "Get notified" },
          { href: "/evals/", label: "Explore the index" },
        ]}
      />
    </>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 border-black/10 px-6 py-6 first:pl-0 [&:not(:first-child)]:border-l max-[860px]:[&:nth-child(3)]:border-l-0 max-[860px]:[&:nth-child(3)]:pl-0 max-[860px]:[&:nth-child(n+3)]:border-t">
      <dt className="label text-text-dim">{label}</dt>
      <dd className="mt-3 text-[clamp(1.05rem,1.6vw,1.35rem)] font-semibold leading-[1.3] tracking-[-0.02em] text-black">
        {children}
      </dd>
    </div>
  );
}
