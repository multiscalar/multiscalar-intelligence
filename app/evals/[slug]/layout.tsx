import TabBar from "@/components/evals/TabBar";
import { BENCH_ABOUT } from "@/components/evals/about";
import { BENCH_SAMPLES } from "@/lib/evals/samples";
import { loadBench } from "@/lib/evals/benches";
import "../evals.css";

export default async function BenchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = loadBench(slug);
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

  return (
    <main className="max-w-[1000px] mx-auto pt-32 px-8 pb-24 max-[780px]:pt-28 max-[780px]:px-5 max-[780px]:pb-16">
      <a
        href="/evals/"
        className="font-mono text-[0.72rem] text-text-dim tracking-[0.08em] hover:text-text"
      >
        ← All benchmarks
      </a>
      <div className="flex items-start justify-between gap-4 flex-wrap mt-5 mb-2">
        <h1 className="text-[clamp(1.9rem,4.5vw,2.8rem)] font-normal tracking-[-0.02em] leading-[1.15]">
          {d.title}
        </h1>
        <div className="flex items-center gap-3 shrink-0 mt-2">
          {d.source.paper && (
            <a
              href={d.source.paper}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 border border-[#1a1a1a] text-text font-mono text-[0.78rem] tracking-[0.03em] px-5 py-[0.6rem] rounded-lg transition-colors hover:bg-bg-elevated"
            >
              Read the paper
              <span aria-hidden="true">↗</span>
            </a>
          )}
          <a
            href={`/evals/request-dataset/?bench=${slug}`}
            className="inline-flex items-center gap-2 bg-[#1a1a1a] text-[#fafafa] font-mono text-[0.78rem] tracking-[0.03em] px-5 py-[0.65rem] rounded-lg transition-colors hover:bg-black"
          >
            Request full dataset
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      <p className="text-[1.02rem] text-text-secondary mb-1">{d.question}</p>
      <span className="bench-source">
        by{" "}
        {d.source.url ? (
          <a href={d.source.url} target="_blank" rel="noopener">
            {sourceLabel}
          </a>
        ) : (
          sourceLabel
        )}
      </span>
      <div className="max-w-[640px] mt-7 mb-8">
        <p className="text-[0.92rem] leading-[1.7] text-text-secondary">
          {d.blurb}
        </p>
        {d.footnote && (
          <p className="text-[0.8rem] leading-[1.6] text-text-dim mt-3">
            {d.footnote}
          </p>
        )}
      </div>

      <TabBar tabs={tabs} />

      {children}
    </main>
  );
}
