import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/home/SectionHeader";
import SoonTag from "@/components/SoonTag";
import { evalsSoon } from "@/lib/launch";
import { CAPABILITIES, capabilityHref } from "@/lib/research";

// The four things Multiscalar builds, as a staggered bento: narrow/wide on the
// first row, wide/narrow on the second. The index comes first and has no
// photo, so the grid doesn't read as four images in a row. It opens the evals
// (or, while they're closed, isn't a link and says "Coming soon"); the others
// open their capability pages.
const SPANS = ["col-span-5", "col-span-7", "col-span-7", "col-span-5"];
const INDEX_CARD = {
  title: "Economic Intelligence Index",
  body: "One score for economic decision-making, aggregated across our benchmarks. It shows where models are ready, and where they break.",
  href: "/evals/",
  image: undefined,
};
const OFFERINGS = [
  INDEX_CARD,
  ...CAPABILITIES.map((c) => ({ ...c, href: capabilityHref(c.slug) })),
].map((item, i) => ({ ...item, span: SPANS[i] }));

export default function WhatWeBuild() {
  return (
    <section id="research" className="section-y scroll-mt-24">
      <SectionHeader
        label="What we build"
        title="From simulation to deployment"
        description="We train AI in multi-agent economies, where incentives conflict and every decision has consequences. Then we deploy it where the stakes are real."
      />
      <div className="grid grid-cols-12 gap-4 max-[900px]:grid-cols-1">
        {OFFERINGS.map((item, i) => {
          const soon = evalsSoon(item.href);
          const Card = soon ? "div" : "a";
          return (
          <Reveal
            key={item.title}
            delay={(i % 2) * 0.08}
            className={`${item.span} max-[900px]:col-span-1`}
          >
            <Card
              {...(soon ? { "aria-disabled": true } : { href: item.href })}
              className={`group relative block h-[520px] overflow-hidden rounded-[20px] max-[768px]:h-[440px] max-[768px]:rounded-[20px] ${
                item.image ? "bg-[#1a1712]" : "bg-[#ece6dc]"
              }`}
            >
              {item.image ? (
                <>
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 60vw"
                    style={{ objectPosition: item.image.focus ?? "50% 50%" }}
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_35%,rgba(0,0,0,0.72)_100%)]"
                  />
                </>
              ) : (
                // A quiet "world" texture: a dot grid that fades out towards the text.
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(circle,rgba(60,45,25,0.28)_1.2px,transparent_1.6px)] bg-[length:22px_22px] [mask-image:linear-gradient(to_bottom,black_0%,black_35%,transparent_75%)] transition-[background-size] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[length:24px_24px]"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 p-8 max-[768px]:p-6">
                <div className={`label mb-2 flex items-center gap-2 ${item.image ? "text-white/70" : "text-[#8a7d6a]"}`}>
                  {String(i + 1).padStart(2, "0")}
                  {soon && <SoonTag />}
                </div>
                <h3
                  className={`font-sans text-[1.6rem] font-semibold leading-[1.15] tracking-[-0.025em] max-[768px]:text-[1.4rem] ${
                    item.image ? "text-white" : "text-black"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`mt-3 max-w-[440px] text-[0.92rem] leading-[1.6] ${
                    item.image ? "text-white/80" : "text-[#5c5348]"
                  }`}
                >
                  {item.body}
                </p>
              </div>
            </Card>
          </Reveal>
          );
        })}
      </div>
    </section>
  );
}
