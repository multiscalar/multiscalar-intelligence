import type { MetadataRoute } from "next";
import { BENCH_ABOUT } from "@/components/evals/about";
import { BENCHES } from "@/lib/evals/benches";
import { BENCH_SAMPLES } from "@/lib/evals/samples";
import { listPosts } from "@/lib/posts";
import { listResultSlugs } from "@/lib/results";
import { SITE_URL } from "@/lib/site";

// Every public page. The results pages are only linked from inside posts, so
// listing them here is how search engines find them.
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_URL}${path}`;
  const pages = (paths: string[]) => paths.map((path) => ({ url: url(path) }));
  return [
    { url: url("/"), priority: 1 },
    ...pages(["/evals/", "/open-science/", "/blacksmith/", "/work-with-us/", "/contact/", "/evals/request-dataset/", "/privacy/", "/terms/"]),
    ...BENCHES.flatMap((slug) =>
      pages([
        `/evals/${slug}/`,
        ...(BENCH_ABOUT[slug] ? [`/evals/${slug}/about/`] : []),
        ...(BENCH_SAMPLES[slug] ? [`/evals/${slug}/samples/`] : []),
      ]),
    ),
    ...listPosts().map((p) => ({ url: url(`/open-science/${p.slug}/`), lastModified: p.date })),
    ...pages(listResultSlugs().map((slug) => `/results/${slug}/`)),
  ];
}
