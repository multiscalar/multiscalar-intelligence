import type { Metadata } from "next";
import SplitHero from "@/components/SplitHero";
import Faq from "@/components/Faq";
import SectionHeader from "@/components/home/SectionHeader";
import DataRequestForm from "@/components/data/DataRequestForm";
import { DATA_FAQ } from "@/lib/faq";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Benchmark data",
  description:
    "Complete runs, transcripts and evidence bundles behind the Economic Intelligence Index leaderboards, for your own analysis.",
  path: "/data/",
  image: "/eii/analyst.webp",
});

// What a request gets and on what terms: only what the index pages already
// commit to (lib/faq.ts).
const INCLUDED = [
  { title: "Every episode", body: "Each run of each model, under the same conditions as the public leaderboard." },
  { title: "Every message and decision", body: "Full transcripts: what the agent said, what it did and why it was scored that way." },
  { title: "Every score", body: "The results behind each leaderboard, benchmark by benchmark." },
];

const GROUNDS = [
  {
    title: "Outcomes, not opinions",
    body: "No model judges another. Every benchmark scores what the model's decisions caused, such as money made or the terms of a deal.",
  },
  {
    title: "The same conditions for everyone",
    body: "Every model plays the same episodes with the same settings, several times, and its runs are averaged.",
  },
  {
    title: "Fixed releases",
    body: "Each release fixes the benchmarks, reference points and weights, so results within one stay comparable.",
  },
];

export default function DataPage() {
  return (
    <main>
      <SplitHero
        src="/eii/analyst.webp"
        alt="A white retro robot reading ticker tape beside an analyst at a desk"
        focus="50% 45%"
        title="The data behind the leaderboards"
        description="Complete runs, transcripts and evidence bundles for the benchmarks you choose, for your own analysis."
        actions={[
          { href: "#start", label: "Request the data" },
          { href: "/evals/", label: "See the index" },
        ]}
      />

      <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
        <section className="section-y">
          <SectionHeader
            title="What you get"
            description="Available under an agreement that the data is not redistributed or used to train models."
          />
          <ol className="grid grid-cols-3 border-t border-black/15 max-[900px]:grid-cols-1">
            {INCLUDED.map((x, i) => (
              <li
                key={x.title}
                className={`py-8 pr-10 max-[900px]:pr-0 ${
                  i > 0 ? "border-l border-black/15 pl-10 max-[900px]:border-l-0 max-[900px]:border-t max-[900px]:pl-0" : ""
                }`}
              >
                <h3 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-black">{x.title}</h3>
                <p className="mt-3 text-[1rem] leading-[1.65] text-black/65">{x.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="section-b">
          <SectionHeader title="Why the numbers hold up" link={{ href: "/evals/#methodology", label: "Read the methodology" }} />
          <dl className="grid grid-cols-3 gap-x-12 border-t border-black/15 max-[900px]:grid-cols-1">
            {GROUNDS.map((g) => (
              <div key={g.title} className="border-b border-black/15 py-7">
                <dt className="text-[1.05rem] font-semibold tracking-[-0.01em] text-black">{g.title}</dt>
                <dd className="mt-2 text-[0.98rem] leading-[1.65] text-black/65">{g.body}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section id="start" className="px-3 pb-3 scroll-mt-24 max-[768px]:px-2 max-[768px]:pb-2">
        <div className="rounded-[28px] bg-ember text-ember-ink max-[768px]:rounded-[20px]">
          <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-16 px-8 py-20 max-[960px]:grid-cols-1 max-[960px]:gap-10 max-[768px]:px-6 max-[768px]:py-14">
            <div>
              <h2 className="font-sans text-[clamp(2.2rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
                Request the data
              </h2>
              <p className="mt-5 max-w-[380px] text-[1.075rem] leading-[1.6] text-ember-ink/85">
                Tell us who you are and what you are working on. We get back to you to agree the
                terms and share the data.
              </p>
            </div>
            <div className="[&_button[type=submit]]:bg-ember-ink [&_button[type=submit]]:text-white [&_button[type=submit]:hover]:bg-black [&_label]:text-ember-ink [&_label_span]:text-ember-ink/75 [&_.text-text-dim]:text-ember-ink/85">
              <DataRequestForm />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
        <section id="faq" className="section-y scroll-mt-28">
          <Faq items={DATA_FAQ} contact={{ href: "/contact/", label: "Write to us" }} />
        </section>
      </div>
    </main>
  );
}
