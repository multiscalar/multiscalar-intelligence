import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import DatasetRequestForm from "@/components/evals/DatasetRequestForm";
import Faq from "@/components/Faq";
import { DATASET_FAQ } from "@/lib/faq";
import "../evals.css";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = pageMetadata({
  title: "Request full dataset",
  description:
    "Request full access to Multiscalar's benchmark datasets: complete runs, transcripts, and evidence bundles.",
  path: "/evals/request-dataset/",
  image: "/eii/observation.webp",
});

export default function RequestDatasetPage() {
  return (
    <main className="max-w-[1200px] mx-auto pt-32 px-8 section-b max-[780px]:pt-28 max-[780px]:px-5">
      <div className="max-w-[640px] mx-auto">
      <BackLink href="/evals/#benchmarks">All benchmarks</BackLink>
      <h1 className="mt-8 font-sans text-[clamp(2.2rem,4.5vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-black">
        Request full dataset
      </h1>
      <p className="mt-5 mb-12 max-w-[560px] text-[1rem] leading-[1.65] text-black/55">
        Complete runs, transcripts, and evidence bundles are available under
        an agreement that they are not redistributed or used for training.
        Tell us who you are and what you are working on, and we will get back
        to you.
      </p>
      <DatasetRequestForm />
      </div>

      <section id="faq" className="section-mt scroll-mt-28">
        <Faq items={DATASET_FAQ} contact={{ href: "/contact/", label: "Write to us" }} />
      </section>
    </main>
  );
}
