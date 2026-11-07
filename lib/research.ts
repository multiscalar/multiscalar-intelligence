import type { Picture } from "@/components/PatternArt";

// The research capabilities, in the order of the home page's "What we
// build" bento (after the index card): shared by the bento, the Research
// menu, and the /research/<slug> pages. Page copy beyond `body` is a first
// draft.

export interface Capability {
  slug: string;
  title: string;
  /** Icon name in the Nav's icon map. */
  icon: "boxes" | "flask" | "cpu" | "rocket";
  /** One or two sentences: the bento card and the hero description. */
  body: string;
  /** The page's opening statement, highlighted word by word on scroll. */
  statement: string;
  /** How we approach it: three short principles. */
  principles: { title: string; body: string }[];
  /** Where it is used, shown as sand cards (three). */
  useCases?: {
    label: string;
    title: string;
    items: { title: string; body: string; picture?: Picture }[];
  };
  /** Benchmarks that measure (or will measure) this capability. */
  benches: string[];
  image?: { src: string; alt: string; focus?: string };
  /** Hero image when the capability has no card image of its own. */
  heroImage?: { src: string; alt: string; focus?: string };
  /** Focal point for the (tall, narrow) hero panel when the card's differs. */
  heroFocus?: string;
  /** Second hero image beside the first; defaults to the card `image`. */
  heroSecondary?: { src: string; alt: string; focus?: string };
}

export const CAPABILITIES: Capability[] = [
  {
    slug: "economic-worlds",
    title: "Economic worlds",
    icon: "boxes",
    body: "Multi-agent markets where agents bargain, compete and collude, built as RL environments with rewards tied to realized outcomes, so what a model learns carries over.",
    statement:
      "Markets are where AI agents will earn or lose real money. We build simulated economies, with counterparties, prices, cash flows and incentives, and turn them into reinforcement learning environments with rewards that can't be gamed, so what a model learns inside holds up outside.",
    principles: [
      {
        title: "Multi-agent by default",
        body: "Every agent faces others with objectives of their own, so strategies are tested against adaptation, not a fixed script.",
      },
      {
        title: "Grounded in real markets",
        body: "Replayed market history, real payment rails and recorded rates keep the dynamics honest and the stakes concrete.",
      },
      {
        title: "Designed for transfer",
        body: "Rewards follow economic outcomes, and varied counterparties, regimes and horizons keep models from memorising one world.",
      },
    ],
    benches: ["zerosum-bench", "terms-bench", "treasury-bench", "auction-bench", "e-commerce-bench"],
    image: {
      src: "/home/environments.webp",
      alt: "A researcher playing Go against a robot in a sunlit 1970s lab",
      focus: "55% 50%",
    },
  },
  {
    slug: "autonomous-systems-infrastructure",
    title: "Autonomous systems infrastructure",
    icon: "rocket",
    body: "Systems that run treasury, procurement and pricing on real money, within the limits you set, and the rails agents need to deal with each other: exchange, escrow and insurance.",
    statement:
      "Autonomous organizations need two things: systems that run real functions on real money, and infrastructure that lets agents deal with each other safely. We deploy the first into treasury, procurement and pricing, and research and build the second: exchange protocols, escrow and insurance for markets where both sides are agents.",
    principles: [
      {
        title: "Clear permissions",
        body: "Every system acts within explicit limits on what it can spend, sign and change, set by the people accountable for it.",
      },
      {
        title: "Human oversight",
        body: "Decisions above a threshold go to a person, and every action is logged so it can be reviewed and reversed.",
      },
      {
        title: "Guarantees between agents",
        body: "Exchange, escrow and insurance give each side guarantees, so agents can deal with counterparties they have never met.",
      },
    ],
    useCases: {
      label: "Where it runs",
      title: "The work agents take on first",
      items: [
        {
          title: "Treasury",
          picture: "treasury",
          body: "Cash positioning, payments and liquidity, run inside the limits you set and reconciled every day.",
        },
        {
          title: "Procurement",
          picture: "procurement",
          body: "Supplier negotiations and purchase orders, with every concession logged and every commitment approved.",
        },
        {
          title: "Pricing",
          picture: "pricing",
          body: "Prices that respond to demand and competition, tested in simulation before they reach a customer.",
        },
      ],
    },
    benches: ["treasury-bench", "vending-bench-2", "e-commerce-bench"],
    image: {
      src: "/home/petrol-station.webp",
      alt: "A small roadside petrol station run by a white retro robot at golden hour, palm trees and a car at the pump",
      focus: "50% 60%",
    },
  },
  {
    slug: "specialized-models",
    title: "Specialized models",
    icon: "cpu",
    body: "Hyper-specialized models with state-of-the-art performance on economic tasks, at a fraction of the cost of general frontier models.",
    statement:
      "General models are generalists. We post-train efficient models for specific economic functions, such as negotiation, treasury and pricing, and ship them to run inside an organization's own infrastructure, where its data already lives.",
    principles: [
      {
        title: "Post-trained for one job",
        body: "Training in our environments focuses a smaller model on one economic function, where it can match or beat far larger ones.",
      },
      {
        title: "Runs where your data lives",
        body: "Models deploy on an organization's own infrastructure, keeping sensitive financial data private and under its control.",
      },
      {
        title: "Measured on the index",
        body: "Every model is scored on the same benchmarks as frontier models, so its gains are public and comparable.",
      },
    ],
    benches: ["treasury-bench", "terms-bench"],
    image: {
      src: "/home/bench.webp",
      alt: "A friendly white retro robot working alone at a white workbench in a bare room, in a beam of sunlight",
      focus: "68% 50%",
    },
  },
];

export const capabilityHref = (slug: string) => `/research/${slug}/`;
