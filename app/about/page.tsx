import Faq from "@/components/Faq";
import { ABOUT_FAQ } from "@/lib/faq";
import type { Metadata } from "next";
import { HIDE } from "@/lib/launch";
import { pageMetadata } from "@/lib/site";
import Principles from "@/components/Principles";
import Reveal from "@/components/Reveal";
import SandCards from "@/components/SandCards";
import SplitHero from "@/components/SplitHero";
import ClosingCard from "@/components/home/ClosingCard";
import ScrollHighlight from "@/components/home/ScrollHighlight";
import SectionHeader from "@/components/home/SectionHeader";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Multiscalar is the vertical AI lab building economic intelligence for the agent economy: AI that can negotiate, price, allocate capital and manage risk in open markets.",
  path: "/about/",
  image: "/hero.webp",
});

// Draft copy, written from the company vision; review before launch.
const BELIEFS = [
  {
    title: "Measure before you trust",
    body: "No one should hand an agent a budget without evidence. The Economic Intelligence Index shows where models are ready and where they break.",
  },
  {
    title: "Train where it is hard",
    body: "Our environments target exactly the gaps the index exposes, with rewards tied to economic outcomes rather than proxies.",
  },
  {
    title: "Prove it in production",
    body: "Deployments in real businesses are the final test, and what we learn there shapes the next round of research.",
  },
];

// Who we build for, on the sand cards.
const AUDIENCES = [
  {
    title: "Enterprises and financial institutions",
    body: "Autonomous systems for treasury, procurement, pricing and operations, with clear permissions, human oversight and outcomes you can measure.",
  },
  {
    title: "AI labs",
    body: "Evaluations, environments and data that show how models behave as economic agents, and how to make them better at it.",
  },
  {
    title: "Researchers",
    body: "Open benchmarks, proofs and results in mathematics, mechanism design and economics, published where anyone can check them.",
  },
];

export default function AboutPage() {
  return (
    <>
      <SplitHero
        src="/hero.webp"
        alt="A sunlit office with a long row of desks, retro computers and plants, two people working by tall windows"
        focus="40% 50%"
        eyebrow="About"
        title="Economic intelligence for the agent economy"
        description="Multiscalar is the vertical AI lab building AI that can negotiate, price, allocate capital and manage risk reliably in open markets."
        actions={[
          { href: "/evals/", label: "Explore the evals", soon: HIDE.evalsLinks },
          { href: "/contact/", label: "Get in touch" },
        ]}
      />

      <main>
        <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
          <section className="section-y grid grid-cols-[200px_1fr] gap-16 max-[960px]:grid-cols-1 max-[960px]:gap-6">
            <Reveal className="label text-text-dim pt-[0.6rem]">Mission</Reveal>
            <ScrollHighlight
              className="max-w-[860px] font-sans text-[clamp(1.4rem,2.2vw,1.95rem)] font-semibold leading-[1.28] tracking-[-0.025em]"
              text="AI agents are starting to act for businesses: negotiating contracts, paying suppliers, pricing products and managing cash. We build the intelligence they need to do it well, and the evidence that they can be trusted with it."
            />
          </section>

          <section className="section-b">
            <SectionHeader label="What we believe" title="Evidence first" />
            <Principles items={BELIEFS} />
          </section>

          <section className="section-b">
            <SectionHeader
              label="Who we work with"
              title="Built for the people putting AI to work"
            />
            <SandCards items={AUDIENCES} />
          </section>

          <section id="faq" className="section-b scroll-mt-28">
            <Faq items={ABOUT_FAQ} contact={{ href: "/contact/", label: "Write to us" }} />
          </section>
        </div>

        <ClosingCard
          id="work-with-us"
          src="/home/shop.webp"
          alt="A small shop run by a friendly robot, with two customers at the counter"
          focus="50% 35%"
          label="Work with us"
          title="Help build the autonomous organizations of the future"
          description="Our team combines frontier AI research, game theory and experience building economic systems at scale."
          actions={[
            { href: "/contact/", label: "Get in touch" },
          ]}
        />
      </main>
    </>
  );
}
