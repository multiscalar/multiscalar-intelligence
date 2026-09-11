import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // The ZeroSum-Bench slug was "economic-arena" until 2026-09-11; keep old links alive.
  async redirects() {
    return [
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
