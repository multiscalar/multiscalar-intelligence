import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { ERDOS_PROBLEMS } from "@/components/posts/ErdosProblemList";
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
        <div className="grid grid-cols-3 gap-5 max-[980px]:grid-cols-1 max-[980px]:max-w-[560px] max-[980px]:mx-auto">
          {posts.map((post) => (
            <a
              key={post.slug}
              id={CARD_IDS[post.slug]}
              href={`/open-science/${post.slug}/`}
              className="group flex flex-col bg-bg-elevated border border-border rounded-2xl p-7 max-[640px]:p-6 transition-[border-color,box-shadow] duration-200 hover:border-[#b0b0b0] hover:shadow-[0_2px_16px_rgba(0,0,0,0.05)] scroll-mt-28"
            >
              {post.image && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={post.image}
                  alt=""
                  className="w-full aspect-[7/3] object-cover rounded-xl border border-border mb-5"
                />
              )}
              <div className="flex items-center gap-3 font-mono text-[0.68rem] text-text-dim tracking-[0.14em] uppercase mb-4">
                <span>{post.display_date}</span>
                <span className="text-text-secondary">{post.tag}</span>
                {post.badge && (
                  <span className="bg-[#16a34a] text-white px-[0.7em] py-[0.2em] rounded-full text-[0.6rem] tracking-[0.12em]">
                    {post.badge}
                  </span>
                )}
              </div>
              <h3 className="font-sans text-[1.15rem] font-medium text-black tracking-[-0.015em] leading-[1.3] mb-1.5">
                {post.title}
              </h3>
              <p className="font-mono text-[0.68rem] text-text-secondary tracking-[0.06em] uppercase mb-3">
                {post.subtitle}
              </p>
              <p className="text-[0.88rem] leading-[1.65] text-text-secondary">
                {post.summary}
              </p>
              {post.slug === "six-more-erdos-problems" && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {ERDOS_PROBLEMS.map((p) => (
                    <span
                      key={p.number}
                      className="font-mono text-[0.68rem] text-text-secondary border border-border rounded-full px-2 py-0.5"
                    >
                      {p.number}
                    </span>
                  ))}
                </div>
              )}
              <div className="font-mono text-[0.78rem] text-text tracking-[0.03em] mt-auto pt-5 transition-[letter-spacing] duration-300 group-hover:tracking-[0.07em]">
                Read →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Divider */}
      <Reveal variant="divider" className="h-px bg-border" />

      <Footer />
    </main>
  );
}
