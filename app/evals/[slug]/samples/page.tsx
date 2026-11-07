import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import SamplesViewer from "@/components/evals/SamplesViewer";
import { BENCH_SAMPLES } from "@/lib/evals/samples";
import { loadBench } from "@/lib/evals/benches";
import { CLOSING_IMAGE } from "@/lib/evals/images";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(BENCH_SAMPLES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = loadBench(slug);
  return pageMetadata({
    title: `${d.title} Samples`,
    description: `Complete sample episodes from ${d.title}, with full transcripts: every message, decision and score in the run. ${d.question}`,
    path: `/evals/${slug}/samples/`,
    image: (CLOSING_IMAGE[slug] ?? CLOSING_IMAGE["zerosum-bench"]).src,
  });
}

export default async function BenchSamplesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <SamplesViewer bench={slug} samples={BENCH_SAMPLES[slug]} />;
}
