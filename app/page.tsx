import type { Metadata } from "next";
import Hero from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";
import Reveal from "@/components/Reveal";
import TrainingLoop from "@/components/blacksmith/TrainingLoop";
import Audiences from "@/components/home/Audiences";
import Barriers from "@/components/home/Barriers";
import IndexSnapshot from "@/components/home/IndexSnapshot";
import LatestPosts from "@/components/home/LatestPosts";
import SecuritySection from "@/components/home/SecuritySection";
import Shift from "@/components/home/Shift";
import { listPosts } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `${SITE_NAME} | Self-improving AI that runs businesses`,
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

// The deck's story, in order: what we are (hero), the shift to economic
// decisions, what stands in the way, how we get past it (the training loop),
// why security is the bottleneck, where models stand today, the latest
// research, then where each kind of visitor should start.
export default function Home() {
  const latest = listPosts()[0];
  return (
    <>
      <Hero
        src="/hero.webp"
        alt="A sunlit office with a long row of desks, retro computers and plants, two people working by tall windows"
        news={{ href: `/open-science/${latest.slug}/`, label: latest.title }}
        title="Self-improving AI that runs businesses"
        description="The applied AI lab for economic intelligence. We turn how organizations operate into environments where AI trains itself."
        actions={[
          { href: "/blacksmith/", label: "Meet Blacksmith" },
          { href: "/evals/", label: "Explore the index" },
        ]}
      />

      <LogoMarquee logos={LOGOS} />

      <main>
        <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
          <Shift />
          <Barriers />
        </div>

        <section id="how" aria-labelledby="how-title" className="p-3 pt-0 scroll-mt-24 max-[768px]:p-2 max-[768px]:pt-0">
          <div className="rounded-[28px] panel-dark panel-light max-[768px]:rounded-[20px]">
            <div className="mx-auto max-w-[1200px] px-8 py-20 max-[768px]:px-6 max-[768px]:py-14">
              <Reveal className="mb-12 flex items-end justify-between gap-8 max-[768px]:mb-8 max-[768px]:flex-col max-[768px]:items-start">
                <div>
                  <h2
                    id="how-title"
                    className="max-w-[720px] font-sans text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-white"
                  >
                    We turn how a business runs into environments where AI trains itself
                  </h2>
                  <p className="mt-5 max-w-[560px] text-[1.075rem] leading-[1.6] text-white/65">
                    Business data goes in. Specialized agents come out, and keep getting better.
                  </p>
                </div>
                <a
                  href="/blacksmith/"
                  className="inline-flex shrink-0 items-center rounded-full bg-white px-6 py-3 text-[0.85rem] font-medium text-black transition-colors hover:bg-white/85 hover:text-black"
                >
                  Meet Blacksmith
                </a>
              </Reveal>
              <TrainingLoop tone="dark" />
            </div>
          </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
          <SecuritySection />
        </div>

        <IndexSnapshot />

        <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
          <LatestPosts />
        </div>

        <Audiences />
      </main>
    </>
  );
}
