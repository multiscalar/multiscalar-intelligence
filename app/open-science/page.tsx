import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { listPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Open Science | Multiscalar Intelligence",
  description:
    "Multiscalar Intelligence publishes what it finds: proofs, benchmarks, code and results in mathematics, mechanism design and economics.",
};

// Old deep links pointed at sections of the single page; keep the anchors
// alive on the matching cards.
const CARD_IDS: Record<string, string> = {
  "six-more-erdos-problems": "erdos-six",
  "satellite-compression": "compress",
};

export default function OpenSciencePage() {
  const posts = listPosts();
  return (
    <main className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
      {/* Hero */}
      <section className="pt-[11rem] pb-16 text-center max-w-[700px] mx-auto animate-fade-up max-[768px]:pt-36 max-[768px]:pb-12">
        <div className="font-mono text-[0.72rem] text-text-dim tracking-[0.25em] uppercase mb-[1.8rem]">
          Open Science
        </div>
        <h1 className="font-sans text-[clamp(2.6rem,5.5vw,4.2rem)] font-light leading-[1.12] tracking-[-0.03em] text-black max-[480px]:text-[2.2rem]">
          Science in the Open
        </h1>
      </section>

      {/* Statement */}
      <section className="max-w-[640px] mx-auto pt-16 pb-20 animate-fade-up [animation-delay:0.15s] max-[768px]:pt-12 max-[768px]:pb-16">
        <p className="text-[1.08rem] leading-[1.9] text-text-secondary mb-[1.6rem]">
          Multiscalar Intelligence is a research driven company, and we publish
          what we find. We believe open science is how a field advances: proofs,
          benchmarks, code and results released where anyone can check them,
          including the results that did not go our way. Our contributions begin
          with the foundations the rest of our work depends on, mathematics,
          mechanism design and economics, and extend to the multi-agent systems
          built on top of them.
        </p>
        <p className="text-[1.08rem] leading-[1.9] text-text-secondary">
          We are opening a community of top tier researchers and engineers to
          collaborate on scientific work. If you would like to be part of it,
          write to{" "}
          <a href="mailto:hello@multiscalar.ai">hello@multiscalar.ai</a> with
          your research interests and CV.
        </p>
      </section>

      {/* Posts */}
      <section className="pb-20 max-[768px]:pb-14" id="results">
        <ul className="list-none max-w-[880px] mx-auto border-t border-border">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-border">
              <a
                id={CARD_IDS[post.slug]}
                href={`/open-science/${post.slug}/`}
                className="group grid grid-cols-[180px_1fr] gap-x-10 items-baseline py-9 scroll-mt-28 max-[640px]:grid-cols-1 max-[640px]:gap-y-1.5 max-[640px]:py-7"
              >
                <span className="font-mono text-[0.78rem] text-text-dim tracking-[0.04em]">
                  {post.display_date}
                </span>
                <span className="font-sans text-[1.25rem] font-normal text-black tracking-[-0.01em] leading-[1.4] transition-opacity duration-150 group-hover:opacity-55 max-[768px]:text-[1.1rem]">
                  {post.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Divider */}
      <Reveal variant="divider" className="h-px bg-border" />

      <Footer />
    </main>
  );
}
