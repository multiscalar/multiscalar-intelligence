import { HIDE } from "@/lib/launch";
import { INDEX_BENCHES, loadBench } from "@/lib/evals/benches";
import { CATEGORY } from "@/lib/evals/cards";
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

// Category icon per benchmark (lib/evals/cards.ts), as a nav icon name.
const BENCH_ICON: Record<string, NavIcon> = {
  handshake: "handshake",
  cart: "package",
  chart: "chart",
  gavel: "gavel",
  store: "store",
  landmark: "landmark",
  swords: "swords",
};

// The Index menu: the index itself on the left, each of its benchmarks by
// name on the right, so any leaderboard is one click from every page.
function indexMenu(): NavMenu {
  return {
    label: "Index",
    paths: ["/evals"],
    primaryLabel: "Economic Intelligence Index",
    primary: [
      {
        href: "/evals/",
        title: "Leaderboard",
        description: "Where every model stands, overall and on five capabilities.",
      },
      {
        href: "/evals/#methodology",
        title: "Methodology",
        description: "How runs on six benchmarks become one comparable score.",
      },
      {
        href: "/data/",
        title: "Benchmark data",
        description: "The runs, transcripts and scores behind every leaderboard.",
      },
    ],
    secondaryLabel: "Benchmarks",
    secondary: INDEX_BENCHES.map((slug) => ({
      href: `/evals/${slug}/`,
      title: loadBench(slug).title,
      icon: BENCH_ICON[CATEGORY[slug]?.icon] ?? "chart",
    })),
  };
}

// Four top-level pages. Contact sits in the footer and the phone menu; the
// header's button is "Get in touch" (components/Nav.tsx).
export function navItems(): NavItem[] {
  return [
    indexMenu(),
    { label: "Blacksmith", href: "/blacksmith/", paths: ["/blacksmith"] },
    { label: "Open Science", href: "/open-science/", paths: ["/open-science", "/results"] },
    { label: "Work with us", href: "/work-with-us/", paths: ["/work-with-us"] },
  ];
}
