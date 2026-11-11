import type { Metadata } from "next";
import Image from "next/image";
import Principles from "@/components/Principles";
import Reveal from "@/components/Reveal";
import WaitlistForm from "@/components/WaitlistForm";
import SectionHeader from "@/components/home/SectionHeader";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Blacksmith",
  description:
    "Blacksmith trains a private model on how your business runs and gives your team one place to hand it work, review what it proposes and approve it. Join the waitlist.",
  path: "/blacksmith/",
  image: "/blacksmith/ui.jpg",
});

// The cycle from the client deck (2026-11-09): a real sequence, so numbered.
const CYCLE = [
  { title: "Map", body: "We learn the workflow from your documents, systems and people." },
  { title: "Simulate", body: "We turn it into thousands of realistic scenarios, scored the way you score outcomes." },
  { title: "Train", body: "Reinforcement learning on an open model, inside your infrastructure." },
  { title: "Evaluate", body: "We test the model against your current process and frontier models before anything ships." },
  { title: "Deploy", body: "It runs on your premises, inside your tools, with spending limits and human sign-off." },
  { title: "Monitor", body: "We track every decision and outcome. Failures become new training scenarios for the next version." },
];

const SAFEGUARDS = [
  {
    title: "Your data stays with you",
    body: "Training and deployment happen on your premises or private cloud. Nothing goes to an external AI lab.",
  },
  {
    title: "You own the model",
    body: "The trained weights belong to you, and we never reuse your data for other clients.",
  },
  {
    title: "Limits it can't override",
    body: "Spend caps, walk-away prices and approval thresholds sit in code outside the model. Every action is logged.",
  },
];

export default function BlacksmithPage() {
  return (
    <main>
      <section className="max-w-[1200px] mx-auto px-8 pt-40 max-[768px]:px-6 max-[768px]:pt-32">
        <div className="animate-fade-up max-w-[760px]">
          <div className="label mb-4 flex items-center gap-3 text-text-dim">
            Blacksmith
            <span className="rounded-full border border-black/15 px-2.5 py-0.5 text-[0.7rem] normal-case tracking-normal text-black/60">
              In development
            </span>
          </div>
          <h1 className="font-sans text-[clamp(2.6rem,5vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-black">
            A model trained on how your business runs
          </h1>
          <p className="mt-6 max-w-[600px] text-[1.1rem] leading-[1.6] text-black/60">
            Blacksmith turns your contracts, records and past decisions into a
            private model that runs your workflows. Your team asks it to handle
            a task, reviews what it proposes and approves with one click.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#waitlist"
              className="inline-flex items-center rounded-full bg-black px-6 py-3 text-[0.85rem] font-medium text-white transition-colors hover:bg-black/80 hover:text-white"
            >
              Join the waitlist
            </a>
          </div>
        </div>

        <Reveal className="mt-16 overflow-hidden rounded-[20px] border border-black/10 bg-white max-[768px]:mt-12">
          <Image
            src="/blacksmith/ui.jpg"
            alt="Blacksmith's assistant: a buyer asks it to renew a supplier contract under $4.20 a unit, and it proposes an opening price, a walk-away point and a trade-off, ready to review and send"
            width={3328}
            height={1112}
            sizes="(max-width: 1200px) 100vw, 1136px"
            className="h-auto w-full"
            priority
          />
        </Reveal>
        <p className="mt-4 text-[0.85rem] text-text-dim">
          A buyer at a fictional manufacturer hands Blacksmith a contract renewal.
        </p>
      </section>

      <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
        <section className="section-y">
          <SectionHeader
            label="How it works"
            title="A cycle we run for you"
            description="You bring a workflow and a process owner for about two hours a week. Each turn of the cycle produces a better model, and production results start the next turn."
          />
          <Principles items={CYCLE} />
        </section>

        <section className="section-b">
          <SectionHeader label="Control" title="Private, owned and limited by you" />
          <Reveal className="grid grid-cols-3 gap-10 border-t border-black/10 pt-10 max-[900px]:grid-cols-1 max-[900px]:gap-8">
            {SAFEGUARDS.map((s) => (
              <div key={s.title}>
                <h3 className="font-sans text-[1.2rem] font-semibold tracking-[-0.02em] text-black">{s.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-[1.65] text-black/60">{s.body}</p>
              </div>
            ))}
          </Reveal>
        </section>

        <section id="waitlist" className="section-b scroll-mt-28">
          <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-10">
            <div>
              <div className="label mb-4 text-text-dim">Waitlist</div>
              <h2 className="font-sans text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-black">
                Get early access
              </h2>
              <p className="mt-5 max-w-[420px] text-[1rem] leading-[1.65] text-black/60">
                We are building Blacksmith with a small group of first
                companies. Tell us which workflow you would start with and we
                will get in touch when we can take it on.
              </p>
            </div>
            <WaitlistForm />
          </div>
        </section>
      </div>
    </main>
  );
}
