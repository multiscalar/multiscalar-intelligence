import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // The ZeroSum-Bench slug was "economic-arena" until 2026-09-11; keep old links alive.
  async redirects() {
    return [
      // Research pages merged or renamed on 2026-10-07.
      ...[
        ["economic-world-simulations", "economic-worlds"],
        ["rl-environments", "economic-worlds"],
        ["autonomous-systems-deployment", "autonomous-systems-infrastructure"],
      ].map(([from, to]) => ({
        source: `/research/${from}`,
        destination: `/research/${to}/`,
        permanent: true,
      })),
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
