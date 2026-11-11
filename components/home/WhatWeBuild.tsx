import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/home/SectionHeader";

// What Multiscalar does, in the order the work runs: measure models, train
// them, deploy them. The numbers mark that sequence. The index card has no
// photo, so the row doesn't read as three images.
const STEPS = [
  {
    title: "Measure",
    name: "Economic Intelligence Index",
    body: "One score for how well a model makes economic decisions, from six benchmarks where it negotiates, bids, prices and manages cash.",
    href: "/evals/",
    cta: "See the index",
    image: undefined,
  },
  {
    title: "Train",
    name: "Economic environments",
    body: "Simulated markets with counterparties, prices and cash flows. We train models in them with reinforcement learning, rewarded on the economic outcome.",
    href: "/open-science/",
    cta: "Read our research",
    image: {
      src: "/home/environments.webp",
      alt: "A researcher playing a game of Go against a white retro robot in a sunlit lab",
      focus: "55% 50%",
    },
  },
  {
    title: "Deploy",
    name: "Blacksmith",
    body: "A private model trained on how your business runs, and one place where your team hands it work and approves what it does.",
    href: "/blacksmith/",
    cta: "Join the waitlist",
    image: {
      src: "/home/deployment.webp",
      alt: "A sunlit hall where rows of small white robots wait beside parcels while two people check a clipboard",
      focus: "60% 50%",
    },
  },
];

export default function WhatWeBuild() {
  return (
    <section id="what-we-do" className="section-y scroll-mt-24">
      <SectionHeader
        label="What we do"
        title="Measure, train, deploy"
        description="We test how models behave with money at stake, train them where they fall short, and put the trained models to work inside businesses."
      />
      <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-1">
        {STEPS.map((item, i) => (
          <Reveal key={item.name} delay={i * 0.06}>
            <a
              href={item.href}
              className={`group relative block h-[500px] overflow-hidden rounded-[20px] max-[900px]:h-[400px] ${
                item.image ? "bg-[#1a1712]" : "bg-[#ece6dc]"
              }`}
            >
              {item.image ? (
                <>
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                    style={{ objectPosition: item.image.focus }}
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_15%,rgba(0,0,0,0.88)_100%)]"
                  />
                </>
              ) : (
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(circle,rgba(60,45,25,0.28)_1.2px,transparent_1.6px)] bg-[length:22px_22px] [mask-image:linear-gradient(to_bottom,black_0%,black_35%,transparent_75%)]"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 p-7 max-[768px]:p-6">
                <div className={`label mb-2 ${item.image ? "text-white/70" : "text-[#8a7d6a]"}`}>
                  {String(i + 1).padStart(2, "0")} {item.title}
                </div>
                <h3
                  className={`font-sans text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.025em] ${
                    item.image ? "text-white" : "text-black"
                  }`}
                >
                  {item.name}
                </h3>
                <p className={`mt-3 text-[0.98rem] leading-[1.6] ${item.image ? "text-white/80" : "text-[#5c5348]"}`}>
                  {item.body}
                </p>
                <span
                  className={`mt-5 inline-block text-[0.85rem] font-medium underline underline-offset-[4px] ${
                    item.image ? "text-white decoration-white/40" : "text-black decoration-black/30"
                  }`}
                >
                  {item.cta}
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
