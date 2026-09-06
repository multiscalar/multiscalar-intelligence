import type { Metadata } from "next";
import SamplesViewer from "@/components/evals/SamplesViewer";
import { BENCH_SAMPLES } from "@/lib/evals/samples";
import { loadBench } from "@/lib/evals/benches";

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
  return {
    title: `${d.title} Samples | Multiscalar Intelligence`,
    description: `Complete sample episodes from ${d.title}, with full transcripts.`,
  };
}

export default async function BenchSamplesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <SamplesViewer bench={slug} samples={BENCH_SAMPLES[slug]} />;
}
