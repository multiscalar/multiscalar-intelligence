import type { Metadata } from "next";
import CompressDemo from "@/components/CompressDemo";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Open Science | Multiscalar Intelligence",
  description:
    "Multiscalar Intelligence publishes what it finds: proofs, benchmarks, code and results in mathematics, mechanism design and economics.",
};

const PROBLEMS = [
  {
    number: "390",
    title: (
      <>
        An exact asymptotic for the least largest factor of a factorisation of{" "}
        <em>n</em>!
      </>
    ),
    tag: "Number Theory",
  },
  {
    number: "486",
    title: <>A sieve whose survivors have no logarithmic density</>,
    tag: "Number Theory",
  },
  {
    number: "536",
    title: (
      <>
        Sets with no three equal pairwise least common multiples have density
        zero
      </>
    ),
    tag: "Combinatorics",
  },
  {
    number: "788",
    title: (
      <>
        The trade-off function is a square root, up to <em>n</em>
        <sup>o(1)</sup>
      </>
    ),
    tag: "Additive Combinatorics",
  },
  {
    number: "1002",
    title: <>Rotation discrepancy converges to a Cauchy law</>,
    tag: "Equidistribution",
  },
  {
    number: "1038",
    title: <>The exact infimum of a polynomial sublevel set</>,
    tag: "Approximation Theory",
  },
];

const META_CLS =
  "flex gap-[1.2rem] font-mono text-[0.72rem] text-text-dim tracking-[0.15em] uppercase mb-4";
const TITLE_CLS =
  "font-sans text-[1.4rem] font-medium text-black tracking-[-0.015em] leading-[1.25] mb-[0.4rem] max-[768px]:text-[1.2rem]";
const SUBTITLE_CLS =
  "font-mono text-[0.78rem] text-text-secondary tracking-[0.06em] uppercase mb-[1.1rem]";
const SUMMARY_CLS =
  "text-[0.98rem] leading-[1.75] text-text-secondary max-w-[700px] mb-[1.2rem]";

export default function OpenSciencePage() {
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

      {/* Results */}
      <section className="py-20 max-[768px]:py-14" id="results">
        <div className="flex flex-col">
          {/* A group entry holds several linked results, so the block itself is
              not a link and must not take the whole-card hover. */}
          <div className="block py-10 max-[768px]:py-[1.8rem]" id="erdos-six">
            <div className={META_CLS}>
              <span>July 2026</span>
              <span className="text-text-secondary">Open Problems</span>
            </div>
            <h3 className={TITLE_CLS}>Six More Erdős Problems, in Five Days</h3>
            <p className={SUBTITLE_CLS}>
              Found by GPT-5.6 under the Multiscalar research prompt
            </p>
            <p className={SUMMARY_CLS}>
              Erdős problem 690 took months of harness engineering. These six
              took five days, and almost all of the work went into the prompt.
              Each one states exactly what a full proof has to establish, names
              the traps, and sends adversarial agents at every candidate
              argument. We attempted about thirteen problems, so a little under
              half worked out. Every proof is posted on the erdosproblems.com
              forum for public attack, and the prompt that produced it is
              published next to it.
            </p>
            <ul className="list-none max-w-[820px] mt-[0.4rem] mb-[1.6rem] border-t border-[#e4e2dd]">
              {PROBLEMS.map((p) => (
                <li key={p.number} className="border-b border-[#e4e2dd]">
                  <a
                    href={`/results/erdos-${p.number}/`}
                    className="group grid grid-cols-[4.2rem_1fr_auto] items-baseline gap-x-[1.2rem] py-[0.95rem] px-[0.2rem] text-text transition-[background,padding-left] duration-[0.25s] hover:bg-bg-elevated hover:pl-[0.8rem] max-[640px]:grid-cols-[3.4rem_1fr]"
                  >
                    <span className="font-mono text-[0.86rem] text-text-dim tracking-[0.06em] group-hover:text-[#1a1a1a]">
                      {p.number}
                    </span>
                    <span className="font-sans text-[0.98rem] text-[#1a1a1a] leading-[1.45]">
                      {p.title}
                    </span>
                    <span className="font-mono text-[0.68rem] text-text-dim tracking-[0.14em] uppercase whitespace-nowrap max-[640px]:col-start-2 max-[640px]:mt-[0.3rem]">
                      {p.tag}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-[0.88rem] leading-[1.7] text-text-dim max-w-[700px]">
              Proposed solutions, published for attack rather than certified.
              Source, prompts and Lean formalisations are at{" "}
              <a
                href="https://github.com/ShouqiaoW/erdos"
                target="_blank"
                rel="noopener"
              >
                github.com/ShouqiaoW/erdos
              </a>
              .
            </p>
          </div>

          <a
            className="group block py-10 text-text transition-colors duration-300 hover:bg-bg-elevated hover:px-4 max-[768px]:py-[1.8rem] max-[768px]:hover:px-0"
            href="/results/erdos-690/"
          >
            <div className={META_CLS}>
              <span>May 2026</span>
              <span className="text-text-secondary">Number Theory</span>
            </div>
            <h3 className={TITLE_CLS}>
              A Complete Answer to Erdős Problem 690
            </h3>
            <p className={SUBTITLE_CLS}>
              Discovered by the Multiscalar Fields System
            </p>
            <p className={SUMMARY_CLS}>
              We prove that the natural density{" "}
              <em>
                d<sub>k</sub>(p)
              </em>
              , of integers whose <em>k</em>-th smallest prime divisor is{" "}
              <em>p</em>, is{" "}
              <strong>
                not unimodal for every <em>k</em> ≥ 4
              </strong>
              , completing Erdős&apos; classification. The proof was discovered
              by the Multiscalar Fields System with limited human interaction.
            </p>
            <span className="font-mono text-[0.82rem] text-text tracking-[0.03em] transition-[letter-spacing] duration-300 group-hover:tracking-[0.07em]">
              Read the proof →
            </span>
          </a>

          <div className="block py-10 max-[768px]:py-[1.8rem]" id="compress">
            <div className={META_CLS}>
              <span>June 2026</span>
              <span className="text-text-secondary">Neural Compression</span>
            </div>
            <h3 className={TITLE_CLS}>
              Neural Compression of Satellite Imagery
            </h3>
            <p className={SUBTITLE_CLS}>Discovered by Multiscalar Dynamo</p>
            <p className={SUMMARY_CLS}>
              A Sentinel-2 earth-observation tile compressed by our learned
              codec with no visible loss. Drag the slider across rate points.
              Even at the highest ratio, the reconstruction stays visually
              identical to the original.
            </p>
            <CompressDemo />
          </div>
        </div>
      </section>

      {/* Divider */}
      <Reveal variant="divider" className="h-px bg-border" />

      <Footer />
    </main>
  );
}
