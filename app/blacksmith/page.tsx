import type { Metadata } from "next";
import Image from "next/image";
import { IconLimit, IconShieldCheck, IconVault } from "central-icons";
import Reveal from "@/components/Reveal";
import WaitlistForm from "@/components/WaitlistForm";
import ProductShowcase from "@/components/blacksmith/ProductShowcase";
import ScrollHighlight from "@/components/home/ScrollHighlight";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Blacksmith",
  description:
    "Blacksmith turns a company's data into training environments, trains agents on them, and runs them in production, with spend limits and sign-off on every action.",
  path: "/blacksmith/",
  image: "/blacksmith/poster.jpg",
});

// Why the agents keep getting better (the deck's moat slide, without its
// illustrative chart).
const COMPOUNDS = [
  {
    title: "Scales with the frontier",
    body: "We train on top of the best open models, so every new release raises the starting point instead of replacing what was built.",
  },
  {
    title: "Compounds with every deployment",
    body: "Every decision, failure and outcome in production becomes new environments and graders for the next cycle.",
  },
  {
    title: "Measured against a public standard",
    body: "Our benchmarks define how economic intelligence and security are measured, and tell us what to build next.",
    link: { href: "/evals/", label: "See the index" },
  },
];

const SAFEGUARDS = [
  {
    icon: IconVault,
    title: "Your data stays with you",
    body: "Training and deployment happen on your premises or private cloud. Nothing goes to an external AI lab.",
  },
  {
    icon: IconShieldCheck,
    title: "You own the model",
    body: "The trained weights belong to you, and we never reuse your data for other clients.",
  },
  {
    icon: IconLimit,
    title: "Limits it can't override",
    body: "Spend caps, walk-away prices and approval thresholds sit in code outside the model. Every action is logged.",
  },
];

const FORM_ON_EMBER =
  "[&_button[type=submit]]:bg-ember-ink [&_button[type=submit]]:text-white [&_button[type=submit]:hover]:bg-black [&_label]:text-ember-ink [&_label_span]:text-ember-ink/75 [&_.text-text-dim]:text-ember-ink/85";

export default function BlacksmithPage() {
  return (
    <main>
      <section className="max-w-[1200px] mx-auto px-8 pt-40 max-[768px]:px-6 max-[768px]:pt-32">
        <div className="animate-fade-up grid grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-end gap-16 max-[960px]:grid-cols-1 max-[960px]:gap-8">
          <h1 className="font-sans text-[clamp(3rem,6.4vw,5.6rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-black">
            Blacksmith.
            <br />
            <span className="text-black/50">Your data, your edge.</span>
          </h1>
          <div className="pb-2">
            <p className="max-w-[460px] text-[1.15rem] leading-[1.6] text-black/70">
              Blacksmith turns a company&rsquo;s data into training environments, trains agents on
              them, and runs them in production.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#get-in-touch"
                className="inline-flex items-center rounded-full bg-ember-ink px-6 py-3 text-[0.85rem] font-medium text-ember transition-colors hover:bg-black hover:text-ember"
              >
                Get in touch
              </a>
              <a
                href="#how"
                className="inline-flex items-center rounded-full border border-black/15 px-6 py-3 text-[0.85rem] font-medium text-black transition-colors hover:bg-black/[0.04] hover:text-black"
              >
                How it works
              </a>
            </div>
          </div>
        </div>

      </section>

      <div id="how" className="mt-20 scroll-mt-28 max-[768px]:mt-12">
        <ProductShowcase
          src="/blacksmith/demo.mp4"
          poster="/blacksmith/poster.jpg"
          width={3328}
          height={1112}
          label="Blacksmith walkthrough: connect a company's data, generate training environments from it, train a model on them, then ask it to renew a supplier contract"
        />
        <p className="mx-auto mt-8 max-w-[1200px] px-8 text-[0.82rem] text-text-dim max-[768px]:px-6">
          You bring a workflow and a process owner for about two hours a week; we run the cycle.
          Acme Industrial is a fictional company.
        </p>
      </div>

      {/* Why it compounds: the dark band of the page. */}
      <section aria-labelledby="compound-title" className="section-mt p-3 pt-0 max-[768px]:p-2 max-[768px]:pt-0">
        <div className="rounded-[28px] panel-dark panel-light max-[768px]:rounded-[20px]">
          <div className="mx-auto max-w-[1200px] px-8 py-20 max-[768px]:px-6 max-[768px]:py-14">
            <Reveal>
              <h2
                id="compound-title"
                className="max-w-[760px] font-sans text-[clamp(1.9rem,3.6vw,3.1rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-white"
              >
                <span className="text-white/55">Labs compete on general intelligence.</span>{" "}
                <span className="text-ember">We compound on economic outcomes.</span>
              </h2>
            </Reveal>
            <Reveal className="mt-14 grid grid-cols-3 gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-8 max-[768px]:mt-10">
              {COMPOUNDS.map((c, i) => (
                <div key={c.title} className="border-t border-white/15 pt-6">
                  <span className="font-mono text-[0.72rem] tabular-nums text-white/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.02em] text-white">{c.title}</h3>
                  <p className="mt-3 text-[1rem] leading-[1.65] text-white/65">{c.body}</p>
                  {c.link && (
                    <a
                      href={c.link.href}
                      className="mt-4 inline-block text-[0.9rem] font-medium text-white underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-white"
                    >
                      {c.link.label}
                    </a>
                  )}
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
        {/* Safeguards: the part buyers check first, as one split card. */}
        <section aria-labelledby="control-title" className="section-y">
          <Reveal className="mb-10 max-[768px]:mb-8">
            <h2
              id="control-title"
              className="max-w-[640px] font-sans text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-black"
            >
              Private, owned and limited by you
            </h2>
          </Reveal>
          <Reveal className="grid grid-cols-2 overflow-hidden rounded-[24px] border border-black/10 bg-white max-[900px]:grid-cols-1">
            <div className="relative min-h-[380px] max-[900px]:min-h-[240px]">
              <Image
                src="/home/models.webp"
                alt="An engineer working in a sunlit 1970s tape-drive vault"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <ul className="flex flex-col divide-y divide-black/10">
              {SAFEGUARDS.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.title} className="flex flex-1 gap-5 p-8 max-[768px]:p-6">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ember-soft text-ember-deep">
                      <Icon aria-hidden strokeWidth={1.8} className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-[1.1rem] font-semibold tracking-[-0.015em] text-black">{s.title}</h3>
                      <p className="mt-2 text-[0.98rem] leading-[1.6] text-black/65">{s.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </section>

        <section className="section-b">
          <ScrollHighlight
            className="max-w-[980px] font-sans text-[clamp(1.8rem,3.6vw,3.2rem)] font-semibold leading-[1.12] tracking-[-0.035em]"
            text="Blacksmith builds environments one business at a time. The goal is AI that builds them for any business, on its own."
          />
          <p className="mt-8 max-w-[620px] text-[1.075rem] leading-[1.6] text-black/60">
            Today, every environment where AI learns to negotiate, price or invest is built by
            hand. AI that builds its own can improve itself, and every Blacksmith deployment
            teaches it a new corner of the economy.
          </p>
        </section>
      </div>

      {/* The page's drenched band: the one thing to do here. */}
      <section id="get-in-touch" className="px-3 pb-3 scroll-mt-24 max-[768px]:px-2 max-[768px]:pb-2">
        <div className="rounded-[28px] bg-ember text-ember-ink max-[768px]:rounded-[20px]">
          <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-16 px-8 py-20 max-[900px]:grid-cols-1 max-[900px]:gap-10 max-[768px]:px-6 max-[768px]:py-14">
            <div>
              <h2 className="font-sans text-[clamp(2.2rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
                Get in touch
              </h2>
              <p className="mt-5 max-w-[420px] text-[1.075rem] leading-[1.6] text-ember-ink/85">
                We are building Blacksmith with a small group of first companies. Tell us which
                workflow you would start with and we will get back to you.
              </p>
            </div>
            <div className={FORM_ON_EMBER}>
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
