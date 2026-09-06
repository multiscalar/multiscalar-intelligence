import type { Metadata } from "next";
import DatasetRequestForm from "@/components/evals/DatasetRequestForm";
import "../evals.css";

export const metadata: Metadata = {
  title: "Request full dataset | Multiscalar Intelligence",
  description:
    "Request full access to Multiscalar's benchmark datasets: complete runs, transcripts, and evidence bundles.",
};

export default function RequestDatasetPage() {
  return (
    <main className="max-w-[640px] mx-auto pt-32 px-8 pb-24 max-[780px]:pt-28 max-[780px]:px-5 max-[780px]:pb-16">
      <a
        href="/evals/"
        className="font-mono text-[0.72rem] text-text-dim tracking-[0.08em] hover:text-text"
      >
        ← All benchmarks
      </a>
      <h1 className="text-[clamp(1.9rem,4.5vw,2.6rem)] font-normal tracking-[-0.02em] leading-[1.15] mt-5 mb-3">
        Request full dataset
      </h1>
      <p className="text-[0.95rem] leading-[1.7] text-text-secondary mb-10 max-w-[540px]">
        Complete runs, transcripts, and evidence bundles are available under
        an agreement that they are not redistributed or used for training.
        Tell us who you are and what you are working on, and we will get back
        to you.
      </p>
      <DatasetRequestForm />
    </main>
  );
}
