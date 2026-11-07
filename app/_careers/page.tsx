import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Principles from "@/components/Principles";
import Reveal from "@/components/Reveal";
import SplitHero from "@/components/SplitHero";
import ClosingCard from "@/components/home/ClosingCard";
import ScrollHighlight from "@/components/home/ScrollHighlight";
import SectionHeader from "@/components/home/SectionHeader";
import { ROLES, roleHref } from "@/lib/careers";

export const metadata: Metadata = pageMetadata({
  title: "Careers",
  description:
    "Join Multiscalar: frontier AI research, game theory and economic systems, on problems where the stakes are real.",
  path: "/careers/",
  image: "/home/environments.webp",
});

// Draft copy; review before launch.
const HOW_WE_WORK = [
  {
    title: "Small team, real ownership",
    body: "Everyone owns problems end to end, from the first experiment to what ships, with the autonomy that comes with it.",
  },
  {
    title: "Open by default",
    body: "We publish proofs, benchmarks and results, including the ones that did not go our way. Your work is seen and checked.",
  },
  {
    title: "Real stakes",
    body: "Our agents handle money in live businesses, so rigour matters and the results are concrete.",
  },
];

export default function CareersPage() {
  return (
    <>
      <SplitHero
        src="/home/environments.webp"
        alt="A researcher playing a game of Go against a white retro robot in a sunlit lab"
        focus="55% 50%"
        eyebrow="Careers"
        title="Help build the autonomous organizations of the future"
        description="We are a small team combining frontier AI research, game theory and experience building economic systems at scale."
        actions={[
          { href: "#roles", label: "See open roles" },
          { href: "mailto:careers@multiscalar.ai", label: "Email us" },
        ]}
      />

      <main>
        <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
          <section className="section-y grid grid-cols-[200px_1fr] gap-16 max-[960px]:grid-cols-1 max-[960px]:gap-6">
            <Reveal className="label text-text-dim pt-[0.6rem]">Why join</Reveal>
            <ScrollHighlight
              className="max-w-[860px] font-sans text-[clamp(1.4rem,2.2vw,1.95rem)] font-semibold leading-[1.28] tracking-[-0.025em]"
              text="The next economy will run on agents. We are building the intelligence, the evaluations and the systems that decide whether it works, and we are looking for people who want to do the hardest version of that work."
            />
          </section>

          <section className="section-b">
            <SectionHeader label="How we work" title="What it is like here" />
            <Principles items={HOW_WE_WORK} />
          </section>

          <section id="roles" className="section-b scroll-mt-28">
            <SectionHeader
              label="Open roles"
              title={`${ROLES.length} open positions`}
            />
            <Reveal>
              <ul className="border-t border-black/10">
                {ROLES.map((role) => (
                  <li key={role.title} className="border-b border-black/10">
                    <a
                      href={roleHref(role)}
                      className="group grid grid-cols-[1fr_180px_200px_auto] items-baseline gap-8 py-7 max-[900px]:grid-cols-1 max-[900px]:gap-1.5 max-[900px]:py-6"
                    >
                      <span className="font-sans text-[clamp(1.2rem,1.8vw,1.5rem)] font-medium leading-[1.25] tracking-[-0.02em] text-black transition-colors duration-300 group-hover:text-black/60">
                        {role.title}
                      </span>
                      <span className="label text-text-dim">{role.team}</span>
                      <span className="text-[0.88rem] text-black/55">
                        {role.location}
                      </span>
                      <span className="text-[0.85rem] font-medium text-black transition-colors duration-300 group-hover:text-black/60 max-[900px]:hidden">
                        Apply
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </section>
        </div>

        <ClosingCard
          id="open-application"
          src="/home/models.webp"
          alt="An engineer checking tape drives inside a round computer vault"
          focus="50% 50%"
          label="Open application"
          title="Don't see your role?"
          description="If you think you can help, write to us with what you would like to work on and what you have built."
          actions={[
            { href: "mailto:careers@multiscalar.ai", label: "Email careers@" },
            { href: "/about/", label: "About Multiscalar" },
          ]}
        />
      </main>
    </>
  );
}
