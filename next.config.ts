import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // The ZeroSum-Bench slug was "economic-arena" until 2026-09-11; keep old links alive.
  async redirects() {
    return [
      // Pages removed in the 2026-11-11 cleanup: About, News (placeholder
      // articles), the research capability pages and Careers.
      { source: "/about", destination: "/", permanent: true },
      { source: "/news", destination: "/open-science/", permanent: true },
      { source: "/news/:slug*", destination: "/open-science/", permanent: true },
      { source: "/research/:slug*", destination: "/#what-we-do", permanent: true },
      { source: "/open-science/satellite-compression", destination: "/open-science/", permanent: true },
      { source: "/open-science/papers", destination: "/open-science/", permanent: true },
      { source: "/careers", destination: "/work-with-us/", permanent: true },
      // The dataset request form became part of /evaluate/ on 2026-11-11;
      // ?bench= carries over (Next keeps the query string).
      {
        source: "/evals/request-dataset",
        destination: "/data/",
        permanent: true,
      },
      // The evaluation page was withdrawn on 2026-11-11; its data request
      // lives on /data/.
      { source: "/evaluate", destination: "/data/", permanent: true },
      // The methodology page became a section of /evals/ on 2026-11-11.
      {
        source: "/evals/methodology",
        destination: "/evals/#methodology",
        permanent: true,
      },
      {
        source: "/evals/economic-arena",
        destination: "/evals/zerosum-bench/",
        permanent: true,
      },
      {
        source: "/evals/economic-arena/:path*",
        destination: "/evals/zerosum-bench/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
