import type { Metadata } from "next";
import { BENCH_ABOUT } from "@/components/evals/about";
import { loadBench } from "@/lib/evals/benches";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(BENCH_ABOUT).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = loadBench(slug);
  return {
    title: `About ${d.title} | Multiscalar Intelligence`,
    description: `How ${d.title} works: the world, the rules, and the scoring.`,
  };
}

export default async function BenchAboutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const About = BENCH_ABOUT[slug];
  return <About />;
}
