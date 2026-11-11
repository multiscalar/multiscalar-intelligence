import Faq from "@/components/Faq";
import { CONTACT_FAQ } from "@/lib/faq";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Multiscalar about evaluations, partnerships, research collaboration or press.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <main className="max-w-[1200px] mx-auto pt-40 px-8 section-b max-[780px]:pt-32 max-[780px]:px-5">
      <div className="max-w-[640px] mx-auto">
      <div className="label text-text-dim">Contact</div>
      <h1 className="mt-4 font-sans text-[clamp(2.2rem,4.5vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-black">
        Get in touch
      </h1>
      <p className="mt-5 mb-12 max-w-[560px] text-[1rem] leading-[1.65] text-black/55">
        Evaluating a model, deploying one in your business, joining the team
        or working on related research? Tell us about it and we will reply.
      </p>
      <ContactForm />
      </div>

      <section id="faq" className="section-mt scroll-mt-28">
        <Faq items={CONTACT_FAQ} title="Before you write" />
      </section>
    </main>
  );
}
