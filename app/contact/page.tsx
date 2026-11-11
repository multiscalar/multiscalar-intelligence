import Faq from "@/components/Faq";
import { CONTACT_FAQ } from "@/lib/faq";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import ContactForm from "@/components/ContactForm";
import { contactHref } from "@/lib/contact";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Multiscalar about evaluations, partnerships, research collaboration or press.",
  path: "/contact/",
});

// The common reasons people write, each preselecting its topic on the form
// (Blacksmith has its own form).
const REASONS = [
  { href: "/data/", title: "Benchmark data", body: "Request the runs, transcripts and scores behind the leaderboards." },
  { href: "/blacksmith/#get-in-touch", title: "Deploy Blacksmith", body: "A private model trained on your workflows. Tell us where you would start." },
  { href: contactHref("research"), title: "Collaborate on research", body: "Work with us on benchmarks, environments or proofs." },
  { href: contactHref("careers"), title: "Join the team", body: "Tell us what you have built and what you would build here." },
  { href: contactHref("press"), title: "Press", body: "Writing about Multiscalar or the index." },
];

export default function ContactPage() {
  return (
    <main className="max-w-[1200px] mx-auto pt-40 px-8 section-b max-[780px]:pt-32 max-[780px]:px-5">
      <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-20 max-[960px]:grid-cols-1 max-[960px]:gap-12">
        <div className="animate-fade-up">
          <div className="label text-text-dim">Contact</div>
          <h1 className="mt-4 font-sans text-[clamp(2.4rem,4.8vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-black">
            Get in touch
          </h1>
          <p className="mt-5 max-w-[440px] text-[1.075rem] leading-[1.6] text-black/65">
            Tell us what you are working on and we will reply, usually within a
            few working days.
          </p>

          <ul className="mt-10 border-t border-black/10 max-[960px]:hidden">
            {REASONS.map((r) => (
              <li key={r.title} className="border-b border-black/10">
                <a href={r.href} className="group block py-4">
                  <span className="block text-[0.98rem] font-medium text-black underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-black/40">
                    {r.title}
                  </span>
                  <span className="mt-0.5 block text-[0.9rem] leading-[1.5] text-black/55">{r.body}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[24px] border border-black/[0.07] bg-white p-10 max-[640px]:-mx-1 max-[640px]:rounded-[20px] max-[640px]:p-6">
          <ContactForm />
        </div>
      </div>

      <section id="faq" className="section-mt scroll-mt-28">
        <Faq items={CONTACT_FAQ} title="Before you write" />
      </section>
    </main>
  );
}
