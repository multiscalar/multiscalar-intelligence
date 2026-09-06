import type { Metadata } from "next";
import BarRows from "@/components/evals/BarRows";
import Matrix from "@/components/evals/Matrix";
import { BENCH_LEADERBOARD_EXTRAS } from "@/components/evals/extras";
import { BENCHES, loadBench } from "@/lib/evals/benches";

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
  return (
    <>
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

      {(() => {
        const Extra = BENCH_LEADERBOARD_EXTRAS[slug];
        return Extra ? <Extra /> : null;
      })()}

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
    </>
  );
}
