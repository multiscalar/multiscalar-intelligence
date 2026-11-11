import type { Metadata } from "next";
import Hero from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";
import Reveal from "@/components/Reveal";
import ClosingCard from "@/components/home/ClosingCard";
import LatestPosts from "@/components/home/LatestPosts";
import ScrollHighlight from "@/components/home/ScrollHighlight";
import Team from "@/components/home/Team";
import WhatWeBuild from "@/components/home/WhatWeBuild";
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

// Who we are (hero), the field we work in (statement), what we do (three
// steps), the people, then the latest research.
export default function Home() {
  return (
    <>
      <Hero
        src="/hero.webp"
        alt="A sunlit office with a long row of desks, retro computers and plants, two people working by tall windows"
        eyebrow="Applied AI lab, London"
        title="AI that businesses can trust with economic decisions"
        description="Multiscalar researches how AI models negotiate, price and allocate money. We measure how well they do it, train them to do it better, and deploy the trained models inside businesses."
        actions={[
          { href: "/evals/", label: "Explore the index" },
          { href: "/blacksmith/", label: "Meet Blacksmith" },
        ]}
      />

      <LogoMarquee logos={LOGOS} />

      <main>
        <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
          <section className="pt-16 max-[768px]:pt-10 grid grid-cols-[200px_1fr] gap-16 max-[960px]:grid-cols-1 max-[960px]:gap-6">
            <Reveal className="label text-text-dim pt-[0.6rem]">Our field</Reveal>
            <ScrollHighlight
              className="max-w-[860px] font-sans text-[clamp(1.4rem,2.2vw,1.95rem)] font-semibold leading-[1.28] tracking-[-0.025em]"
              text="We work on economic intelligence: an AI agent's ability to make good decisions about money and resources when the other side wants something different. Agents already negotiate contracts, set prices and move cash. Our research asks how well they do it, and how to make them better."
            />
          </section>

          <WhatWeBuild />
          <Team />
          <LatestPosts />
        </div>

        <ClosingCard
          id="contact"
          label="Contact"
          title="Working on AI that handles money?"
          description="Talk to us about evaluating a model, deploying one in your business, or a research collaboration."
          actions={[
            { href: "/contact/", label: "Get in touch" },
            { href: "/work-with-us/", label: "Work with us" },
          ]}
        />
      </main>
    </>
  );
}
