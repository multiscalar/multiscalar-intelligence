import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { BENCH_ABOUT } from "@/components/evals/about";
import { loadBench } from "@/lib/evals/benches";
import { CLOSING_IMAGE } from "@/lib/evals/images";

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
  return pageMetadata({
    title: `About ${d.title}`,
    description: `How ${d.title} works: the world, the rules and the scoring. ${d.blurb}`,
    path: `/evals/${slug}/about/`,
    image: (CLOSING_IMAGE[slug] ?? CLOSING_IMAGE["zerosum-bench"]).src,
  });
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
