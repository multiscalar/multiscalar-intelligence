import type { Metadata } from "next";
import BarRows from "@/components/evals/BarRows";
import Matrix from "@/components/evals/Matrix";
import { BENCHES, loadBench } from "@/lib/evals/benches";
import { providerOf, PROVIDERS } from "@/lib/evals/providers";
import "../evals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return BENCHES.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = loadBench(slug);
  return {
    title: `${d.title} | Multiscalar Intelligence`,
    description: d.question,
  };
}

export default async function BenchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = loadBench(slug);
  const sourceLabel = d.source.label || d.source.name;
  const models = d.models.filter(
    (m) => providerOf(m) !== PROVIDERS.baseline
  ).length;
  const stats: [string, string][] = [
    ["Models", String(models)],
    ["Last measured", d.source.snapshot],
  ];

  return (
    <main className="max-w-[1000px] mx-auto pt-32 px-8 pb-24 max-[780px]:pt-28 max-[780px]:px-5 max-[780px]:pb-16">
      <a
        href="/evals/"
        className="font-mono text-[0.72rem] text-text-dim tracking-[0.08em] hover:text-text"
      >
        ← All benchmarks
      </a>
      <h1 className="text-[clamp(1.9rem,4.5vw,2.8rem)] font-normal tracking-[-0.02em] leading-[1.15] mt-5 mb-2">
        {d.title}
      </h1>
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
      <div className="flex flex-wrap gap-x-14 gap-y-4 mt-8 mb-8">
        {stats.map(([label, value]) => (
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
      <div className="max-w-[640px] mb-6">
        <p className="text-[0.92rem] leading-[1.7] text-text-secondary">
          {d.blurb}
        </p>
        {d.footnote && (
          <p className="text-[0.8rem] leading-[1.6] text-text-dim mt-3">
            {d.footnote}
          </p>
        )}
      </div>

      {d.metrics.map((metric) => (
        <section
          key={metric.id}
          id={metric.id}
          className="bench-section scroll-mt-28"
        >
          <div className="bench-head">
            <div className="bench-title-block">
              <h2>{metric.label}</h2>
            </div>
          </div>
          {metric.kind === "matrix" ? (
            <Matrix d={d} />
          ) : (
            <>
              <p className="metric-note">
                {metric.higherIsBetter === false
                  ? "↓ lower is better"
                  : "↑ higher is better"}
              </p>
              <BarRows d={d} metric={metric.id} />
            </>
          )}
        </section>
      ))}

      <div className="bench-stamp mt-10 !text-left">
        results as of {d.source.snapshot}
        {d.source.url && (
          <>
            {" · "}
            <a href={d.source.url} target="_blank" rel="noopener">
              {d.source.linkText || "full results at source"} ↗
            </a>
          </>
        )}
      </div>
    </main>
  );
}
