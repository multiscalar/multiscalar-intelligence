import type { Metadata } from "next";
import Faq from "@/components/Faq";
import { benchFaq } from "@/lib/faq";
import { pageMetadata } from "@/lib/site";
import LeaderboardPanel from "@/components/evals/LeaderboardPanel";
import BenchBars from "@/components/evals/BenchBars";
import ChartCard from "@/components/evals/ChartCard";
import { chartModel } from "@/lib/evals/examples";
import { providerOf } from "@/lib/evals/providers";
import { BENCH_LEADERBOARD_EXTRAS } from "@/components/evals/extras";
import { BENCHES, loadBench } from "@/lib/evals/benches";
import { CLOSING_IMAGE } from "@/lib/evals/images";
import { leaderboardData } from "@/lib/evals/leaderboard";

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
  return pageMetadata({
    title: d.title,
    description: `${d.question} ${d.blurb}`,
    path: `/evals/${slug}/`,
    image: (CLOSING_IMAGE[slug] ?? CLOSING_IMAGE["zerosum-bench"]).src,
  });
}

export default async function BenchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = loadBench(slug);
  const extras = BENCH_LEADERBOARD_EXTRAS[slug] ?? [];
  return (
    <>
      {d.source.index ? (
        // Index benchmarks: one 0-100 score, drawn as columns.
        <div className="-mt-16 max-[780px]:-mt-10">
          <ChartCard
            id="leaderboard"
            label="Leaderboard"
            title="Index score"
            description="0-100, higher is better. Hover a bar to see the result in the benchmark's own terms."
          >
            <BenchBars
              bars={d.models.map((m) => ({
                ...chartModel(m),
                fill: providerOf(m).color,
                score: m.scores[d.defaultMetric],
                raw: typeof m.raw === "string" ? m.raw : undefined,
              }))}
              rawLabel={d.rawLabel}
              refs={d.refs}
            />
          </ChartCard>
        </div>
      ) : (
        <section
          id="leaderboard"
          className="scroll-mt-28 rounded-[28px] panel-dark px-10 py-12 max-[780px]:rounded-[20px] max-[780px]:px-5 max-[780px]:py-8"
        >
          <LeaderboardPanel data={leaderboardData(d)} />
        </section>
      )}

      {extras.map((Extra, i) => (
        <Extra key={i} d={d} />
      ))}

      <section id="faq" className="section-mt scroll-mt-28">
        <Faq items={benchFaq(slug, d)} contact={{ href: "/contact/", label: "Write to us" }} />
      </section>

    </>
  );
}
