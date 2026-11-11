import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SplitHero from "@/components/SplitHero";
import ClosingCard from "@/components/home/ClosingCard";
import SectionHeader from "@/components/home/SectionHeader";
import { contactHref } from "@/lib/contact";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Work with us",
  description:
    "Join Multiscalar: evaluations, economic environments and deployed models for AI that makes economic decisions.",
  path: "/work-with-us/",
  image: "/home/environments.webp",
});

// What a new person would work on: the three parts of the company.
const AREAS = [
  {
    title: "Evaluations",
    image: { src: "/eii/analyst.webp", alt: "A woman working at a desk beside a white retro robot that types on a keyboard" },
    body: "Design benchmarks where models negotiate, bid and manage cash, and run them across frontier and open models for the Economic Intelligence Index.",
  },
  {
    title: "Environments and training",
    image: { src: "/home/watchmaker.webp", alt: "A white retro robot working on a watch movement under a desk lamp" },
    body: "Build simulated markets and train open models in them with reinforcement learning, then check that what they learn holds up outside.",
  },
  {
    title: "Deployment",
    image: { src: "/home/open-office.webp", alt: "Two people meeting at a desk in a wide, empty office while a robot waits by the wall" },
    body: "Put trained models to work inside companies through Blacksmith, with the limits, sign-off and monitoring that real money needs.",
  },
];

const HOW_WE_WORK = [
  {
    title: "Small team",
    body: "You own a problem from the first experiment to what ships.",
  },
  {
    title: "Published in the open",
    body: "Our benchmarks, papers and proofs are public, including the results that went against us.",
  },
  {
    title: "Research next to customers",
    body: "The failures we see in deployments decide what we research next.",
  },
];

export default function WorkWithUsPage() {
  return (
    <>
      <SplitHero
        src="/home/environments.webp"
        alt="A researcher playing a game of Go against a white retro robot in a sunlit lab"
        focus="55% 50%"
        eyebrow="Work with us"
        title="Build AI that can be trusted with money"
        description="We are a small team of researchers and engineers in London working on AI agents that negotiate, price and allocate capital."
        actions={[{ href: contactHref("careers"), label: "Apply" }]}
      />

      <main>
        <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
          <section className="section-y">
            <SectionHeader label="What you would work on" title="Three parts of one loop" />
            <Reveal className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1 max-[900px]:gap-10">
              {AREAS.map((a) => (
                <div key={a.title}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[#1a1712]">
                    <Image
                      src={a.image.src}
                      alt={a.image.alt}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-6 font-sans text-[1.25rem] font-semibold tracking-[-0.02em] text-black">{a.title}</h3>
                  <p className="mt-2 max-w-[380px] text-[1rem] leading-[1.65] text-black/65">{a.body}</p>
                </div>
              ))}
            </Reveal>
          </section>

          <section className="section-b">
            <SectionHeader label="How we work" title="What it is like here" />
            <Reveal className="grid grid-cols-3 gap-10 border-t border-black/10 pt-10 max-[900px]:grid-cols-1 max-[900px]:gap-8">
              {HOW_WE_WORK.map((a) => (
                <div key={a.title}>
                  <h3 className="font-sans text-[1.2rem] font-semibold tracking-[-0.02em] text-black">{a.title}</h3>
                  <p className="mt-3 text-[1rem] leading-[1.65] text-black/65">{a.body}</p>
                </div>
              ))}
            </Reveal>
          </section>
        </div>

        <ClosingCard
          id="apply"
          src="/home/models.webp"
          alt="An engineer checking tape drives inside a round computer vault"
          focus="50% 50%"
          label="Apply"
          title="Tell us what you would build"
          description="We don't post fixed roles. Write to us with what you have built and what you would like to work on here."
          actions={[
            { href: contactHref("careers"), label: "Apply" },
            { href: "/open-science/", label: "Read our research" },
          ]}
        />
      </main>
    </>
  );
}
