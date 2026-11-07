import type { Metadata } from "next";
import Hero from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";
import Reveal from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";
import ClosingCard from "@/components/home/ClosingCard";
import Deployment from "@/components/home/Deployment";
import LatestPosts from "@/components/home/LatestPosts";
import Leaderboards from "@/components/home/Leaderboards";
import ScrollHighlight from "@/components/home/ScrollHighlight";
import WhatWeBuild from "@/components/home/WhatWeBuild";
import { HIDE } from "@/lib/launch";
import { TESTIMONIALS } from "@/lib/testimonials";
import { SITE_DESCRIPTION, SITE_NAME, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `${SITE_NAME} | Multi-Agent Intelligence at Scale`,
  description: SITE_DESCRIPTION,
  path: "/",
  fullTitle: true,
});

// Logos under the hero, in public/logos/. Heights balance wide wordmarks
// against compact marks (roughly 36px × √(3 / aspect ratio), kept to 28–44px).
const LOGOS = [
  { name: "University of Oxford", src: "/logos/oxford.svg", height: 34 },
  { name: "Stanford University", src: "/logos/stanford.svg", height: 29 },
  { name: "ARIA, Advanced Research and Invention Agency", src: "/logos/aria.png", height: 38 },
  { name: "Ethereum Foundation", src: "/logos/ethereum-foundation.svg", height: 36 },
  { name: "Microsoft", src: "/logos/microsoft.svg", height: 29 },
  { name: "IBM", src: "/logos/ibm.svg", height: 34 },
  { name: "European Space Agency", src: "/logos/esa.svg", height: 36 },
  { name: "Lyft", src: "/logos/lyft.svg", height: 40 },
];

export default function Home() {
  return (
    <>
      <Hero
        src="/hero.webp"
        alt="A sunlit office with a long row of desks, retro computers and plants, two people working by tall windows"
        eyebrow="Scaling multi-agent intelligence"
        title="We make autonomous organizations possible"
        description="Multiscalar is an applied AI lab researching and building systems that invest, negotiate, and manage resources. We develop the intelligence and infrastructure these systems need to operate under human direction."
        actions={[
          { href: "/evals/", label: "Explore the evals", soon: HIDE.evalsLinks },
          { href: "/open-science/", label: "Read our research" },
        ]}
      />

      <LogoMarquee logos={LOGOS} />

      <main>
        <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
          {/* Statement: the mission in one large line, the detail in grey. */}
          {/* Tighter than a full section gap: the logo strip above already
              separates it from the hero. */}
          <section className="pt-16 max-[768px]:pt-10 grid grid-cols-[200px_1fr] gap-16 max-[960px]:grid-cols-1 max-[960px]:gap-6">
            <Reveal className="label text-text-dim pt-[0.6rem]">About</Reveal>
            <ScrollHighlight
              className="max-w-[860px] font-sans text-[clamp(1.4rem,2.2vw,1.95rem)] font-semibold leading-[1.28] tracking-[-0.025em]"
              text="Running an organization requires decisions about money, resources, and people. We create economically accurate worlds to train AI for those decisions, from individual tasks to systems that work together. We then use the results to power some of the biggest autonomous businesses on earth."
            />
          </section>

          <WhatWeBuild />
        </div>

        {/* Hidden during the private preview, with an Open Science photo card
            in its place: switch in lib/launch.ts. */}
        {HIDE.homeIndexSection ? (
          <ClosingCard
            id="open-science"
            src="/home/reading-room.webp"
            alt="A small white retro robot standing by the tables of a quiet 1970s library reading room, people reading by tall windows"
            focus="70% 50%"
            label="Open Science"
            title="Research, published in the open"
            description="Our papers, results and proofs are public, so anyone can check the work and build on it."
            actions={[
              { href: "/open-science/papers/", label: "Read our papers" },
              { href: "/open-science/", label: "All posts" },
            ]}
          />
        ) : (
          <Leaderboards />
        )}

        <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
          {/* From the leaderboards to production, then the customers' words. */}
          <Deployment />

          <section>
            <Testimonials items={TESTIMONIALS} />
          </section>

          <LatestPosts />
        </div>

        <ClosingCard />
      </main>
    </>
  );
}
