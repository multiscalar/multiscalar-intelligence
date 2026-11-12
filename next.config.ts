import type { NextConfig } from "next";

// The site is a single landing page since 2026-11-12. Every section of the
// previous site sends visitors home instead of to a 404.
const OLD_SECTIONS = [
  "evals",
  "open-science",
  "blacksmith",
  "work-with-us",
  "contact",
  "data",
  "privacy",
  "terms",
  "unlock",
  "results",
  "about",
  "news",
  "research",
  "careers",
  "evaluate",
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return OLD_SECTIONS.map((section) => ({
      source: `/${section}/:path*`,
      destination: "/",
      permanent: true,
    }));
  },
};

export default nextConfig;
