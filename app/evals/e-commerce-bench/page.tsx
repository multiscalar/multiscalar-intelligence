import type { Metadata } from "next";
import UpcomingBenchPage from "@/components/evals/UpcomingBenchPage";
import { upcomingBench } from "@/lib/evals/upcoming";
import { pageMetadata } from "@/lib/site";

// A benchmark in development (static, so it takes precedence over the
// data-driven /evals/[slug]/ pages).
const b = upcomingBench("e-commerce-bench")!;

export const metadata: Metadata = pageMetadata({
  title: b.title,
  description: b.question,
  path: "/evals/e-commerce-bench/",
  image: "/eii/observation.webp",
});

export default function Page() {
  return <UpcomingBenchPage b={b} />;
}
