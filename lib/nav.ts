import { INDEX_BENCHES, loadBench } from "@/lib/evals/benches";

const BENCH_ICON: Record<string, NavIcon> = {
  "terms-bench": "handshake",
  "e-commerce-bench": "package",
  econevals: "chart",
  "auction-bench": "gavel",
  coffeebench: "store",
  "treasury-bench": "landmark",
};
import { HIDE } from "@/lib/launch";
import { listPosts } from "@/lib/posts";
import type { SocialIcon, SocialLink } from "@/lib/social";

// Icon names resolve to components in components/Nav.tsx; keeping them as
// strings lets this module stay server-only data.
export type NavIcon =
  | "boxes"
  | "flask"
  | "cpu"
  | "rocket"
  | "swords"
  | "landmark"
  | "handshake"
  | "store"
  | "package"
  | "coins"
  | "gavel"
  | "chart"
  | "file"
  | "mail"
  | SocialIcon;

export interface NavLink {
  href: string;
  title: string;
  description?: string;
  icon?: NavIcon;
  /** Shown disabled with a "Soon" tag (see evalsSoon in lib/launch.ts). */
  soon?: boolean;
}

export interface NavMenu {
  label: string;
  // Routes the menu counts as current for ("/" matches exactly).
  paths: string[];
  // Left column: destination pages, each with a one-line description.
  primaryLabel: string;
  primary: NavLink[];
  // Right column: a denser list of specific items, with icons.
  secondaryLabel: string;
  secondary: NavLink[];
  // Optional row of social icons under the right column.
  socials?: SocialLink[];
}

export interface NavPlainLink {
  label: string;
  href: string;
  paths: string[];
}

export type NavItem = NavMenu | NavPlainLink;

export function isMenu(item: NavItem): item is NavMenu {
  return "primary" in item;
}

// Menus left out of the header (desktop and phone) during the private
// preview; their pages stay live and the footer still lists them. Switch in
// lib/launch.ts.
const HIDDEN_IN_HEADER = HIDE.evalsInHeader ? ["Index"] : [];

export function headerNavItems(): NavItem[] {
  return navItems().filter((item) => !HIDDEN_IN_HEADER.includes(item.label));
}

export function navItems(): NavItem[] {
  return [
    {
      label: "Index",
      paths: ["/evals"],
      primaryLabel: "Economic Intelligence Index",
      primary: [
        {
          href: "/evals/",
          title: "Economic Intelligence Index",
          description: "Five economic capabilities, measured in one score",
        },
        {
          href: "/evals/#methodology",
          title: "Methodology",
          description: "How we score models, and why",
        },
        {
          href: "/evals/request-dataset/",
          title: "Request a dataset",
          description: "Full traces and results for your own analysis",
        },
      ],
      // The benchmarks behind the index, each to its own page.
      secondaryLabel: "Benchmarks",
      secondary: INDEX_BENCHES.map((slug) => ({
        href: `/evals/${slug}/`,
        title: loadBench(slug).title,
        icon: BENCH_ICON[slug],
      })),
    },
    { label: "Blacksmith", href: "/blacksmith/", paths: ["/blacksmith"] },
    {
      label: "Open Science",
      paths: ["/open-science", "/results"],
      primaryLabel: "Open Science",
      primary: [
        {
          href: "/open-science/",
          title: "All posts",
          description: "Proofs, results and write-ups, published in the open",
        },
        {
          href: "/open-science/papers/",
          title: "Papers",
          description: "Our research papers, with PDFs, source and code",
        },
      ],
      secondaryLabel: "Latest",
      secondary: listPosts()
        .slice(0, 3)
        .map((post) => ({
          href: `/open-science/${post.slug}/`,
          title: post.title,
          icon: "file" as const,
        })),
    },
    { label: "Work with us", href: "/work-with-us/", paths: ["/work-with-us"] },
    { label: "Contact", href: "/contact/", paths: ["/contact"] },
  ];
}
