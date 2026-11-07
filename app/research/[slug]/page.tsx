import Faq from "@/components/Faq";
import { researchFaq } from "@/lib/faq";
import type { Metadata } from "next";
import { HIDE } from "@/lib/launch";
import { pageMetadata } from "@/lib/site";
import SplitHero from "@/components/SplitHero";
import Principles from "@/components/Principles";
import Reveal from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";
import BenchCard from "@/components/evals/BenchCard";
import ClosingCard from "@/components/home/ClosingCard";
import { contactHref } from "@/lib/contact";
import ScrollHighlight from "@/components/home/ScrollHighlight";
import SectionHeader from "@/components/home/SectionHeader";
import { benchCards } from "@/lib/evals/cards";
import { CAPABILITIES, capabilityHref } from "@/lib/research";
import { TESTIMONIALS } from "@/lib/testimonials";
import SandCards from "@/components/SandCards";

export const dynamicParams = false;

export function generateStaticParams() {
  return CAPABILITIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = CAPABILITIES.find((x) => x.slug === slug)!;
  return pageMetadata({
    title: c.title,
    description: c.body,
    path: capabilityHref(slug),
    image: (c.heroImage ?? c.image)?.src,
  });
}

export default async function CapabilityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = CAPABILITIES.findIndex((x) => x.slug === slug);
  const c = CAPABILITIES[index];
  const hero = c.image ?? c.heroImage!;
  // The page ends by leading on to the next capability, like chapters.
  const nextIndex = (index + 1) % CAPABILITIES.length;
  const next = CAPABILITIES[nextIndex];
  const prev =
    CAPABILITIES[(index - 1 + CAPABILITIES.length) % CAPABILITIES.length];
  const nextImage = next.image ?? next.heroImage!;
  // With its own hero image, the card image (or an explicit one) sits beside it.
  const heroSecondary = c.heroSecondary ?? (c.heroImage ? c.image : undefined);
  // Otherwise (or when the "second" image is the same picture) the hero image
  // continues across a staggered pair of panels.
  const split = !heroSecondary || heroSecondary.src === hero.src;
  const cards = benchCards();
  const benches = c.benches
    .map((s) => cards.find((card) => card.slug === s))
    .filter((card) => card !== undefined);

  return (
    <>
      <SplitHero
        src={hero.src}
        alt={hero.alt}
        focus={c.heroFocus ?? hero.focus}
        secondary={split ? undefined : heroSecondary}
        split={split}
        eyebrow="Research"
        pager={{
          prev: {
            href: capabilityHref(prev.slug),
            label: prev.title,
          },
          next: { href: capabilityHref(next.slug), label: next.title },
          current: index + 1,
          total: CAPABILITIES.length,
        }}
        title={c.title}
        description={c.body}
        actions={[
          { href: "/evals/", label: "Explore the evals", soon: HIDE.evalsLinks },
          { href: contactHref("partnership"), label: "Work with us" },
        ]}
      />

      <main>
        <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
          <section className="section-y grid grid-cols-[200px_1fr] gap-16 max-[960px]:grid-cols-1 max-[960px]:gap-6">
            <Reveal className="label text-text-dim pt-[0.6rem]">Overview</Reveal>
            <ScrollHighlight
              className="max-w-[860px] font-sans text-[clamp(1.4rem,2.2vw,1.95rem)] font-semibold leading-[1.28] tracking-[-0.025em]"
              text={c.statement}
            />
          </section>

          <section className="section-b">
            <SectionHeader label="Approach" title="How we build it" />
            <Principles items={c.principles} />
          </section>

          {c.useCases && (
            <section className="section-b">
              <SectionHeader label={c.useCases.label} title={c.useCases.title} />
              <SandCards items={c.useCases.items} />
            </section>
          )}
        </div>


        {/* Hidden during the private preview: switch in lib/launch.ts. */}
        {!HIDE.evalsLinks && benches.length > 0 && (
          <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
            <section className="section-b">
              <SectionHeader
                label="Benchmarks"
                title="How we measure it"
                description="The benchmarks behind the Economic Intelligence Index that test this capability, with full public leaderboards."
                link={{ href: "/evals/#benchmarks", label: "All benchmarks" }}
              />
              <div className="grid grid-cols-3 gap-4 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1">
                {benches.slice(0, 3).map((card) => (
                  <BenchCard
                    key={card.slug}
                    card={card}
                    tone="light"
                    cta
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
          <section className="section-b">
            <Testimonials items={TESTIMONIALS} />
          </section>

          <section id="faq" className="section-b scroll-mt-28">
            <Faq items={researchFaq(c.title)} contact={{ href: "/contact/", label: "Write to us" }} />
          </section>
        </div>

        <ClosingCard
          id="next"
          src={nextImage.src}
          alt={nextImage.alt}
          focus="50% 45%"
          label={`Next · ${String(nextIndex + 1).padStart(2, "0")} / ${String(CAPABILITIES.length).padStart(2, "0")}`}
          title={next.title}
          description={next.body}
          actions={[
            { href: capabilityHref(next.slug), label: `Explore ${next.title.toLowerCase()}` },
            { href: contactHref("partnership"), label: "Work with us" },
          ]}
        />
      </main>
    </>
  );
}
