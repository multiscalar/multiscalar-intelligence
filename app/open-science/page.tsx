import type { Metadata } from "next";
import { HIDE } from "@/lib/launch";
import { pageMetadata } from "@/lib/site";
import Reveal from "@/components/Reveal";
import ClosingCard from "@/components/home/ClosingCard";
import { contactHref } from "@/lib/contact";
import PostList from "@/components/home/PostList";
import SectionHeader from "@/components/home/SectionHeader";
import { listPosts } from "@/lib/posts";

export const metadata: Metadata = pageMetadata({
  title: "Open Science",
  description:
    "Multiscalar Intelligence publishes what it finds: proofs, benchmarks, code and results in mathematics, mechanism design and economics.",
  path: "/open-science/",
  image: "/home/models.webp",
});

// Old deep links pointed at sections of the single page; keep the anchors
// alive on the matching rows.
const CARD_IDS: Record<string, string> = {
  "six-more-erdos-problems": "erdos-six",
  "satellite-compression": "compress",
};

export default function OpenSciencePage() {
  const posts = listPosts();
  return (
    <>
      <main className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
        <header className="pt-40 animate-fade-up max-[768px]:pt-32">
          <div className="label text-text-dim mb-4">Open Science</div>
          <h1 className="max-w-[820px] font-sans text-[clamp(2.6rem,5.5vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-black">
            Science in the open
          </h1>
          <p className="mt-6 max-w-[560px] text-[clamp(1.05rem,1.5vw,1.25rem)] leading-[1.5] text-black/55">
            Proofs, benchmarks, code and results, released where anyone can
            check them.
          </p>
        </header>

        <section className="section-y grid grid-cols-[200px_1fr] gap-16 max-[960px]:grid-cols-1 max-[960px]:gap-6">
          <Reveal className="label text-text-dim pt-1">Our approach</Reveal>
          <Reveal className="max-w-[720px]">
            <p className="text-[1.05rem] leading-[1.75] text-black/70">
              Multiscalar Intelligence is a research driven company, and we
              publish what we find. We believe open science is how a field
              advances: proofs, benchmarks, code and results released where
              anyone can check them, including the results that did not go our
              way. Our contributions begin with the foundations the rest of our
              work depends on, mathematics, mechanism design and economics, and
              extend to the multi-agent systems built on top of them.
            </p>
          </Reveal>
        </section>

        <section id="results" className="section-b">
          <SectionHeader
            label="Publications"
            title="All posts"
          />
          <PostList posts={posts} ids={CARD_IDS} />
        </section>
      </main>

      <ClosingCard
        id="community"
        src="/home/models.webp"
        alt="An engineer checking tape drives inside a round computer vault"
        focus="50% 50%"
        label="Collaborate"
        title="Join our research community"
        description="We are opening a community of top tier researchers and engineers to collaborate on scientific work. Write to us with your research interests and CV."
        actions={[
          {
            href: contactHref("research"),
            label: "Get in touch",
          },
          { href: "/evals/", label: "Explore the evals", soon: HIDE.evalsLinks },
        ]}
      />
    </>
  );
}
