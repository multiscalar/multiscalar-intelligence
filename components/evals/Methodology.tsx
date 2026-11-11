import { Fragment, type ReactNode } from "react";
import SectionHeader from "@/components/home/SectionHeader";

// How the index is computed: one paragraph with its two equations (MathML,
// no dependency). The site is public: symbols only, never the reference
// points' values or the weights. The notation is our own (a, j, t; anchors
// l and u; the [.] cap; weights alpha and beta summing to 1), deliberately
// unlike other indices' write-ups.

function Equation({ n, children }: { n: number; children: ReactNode }) {
  return (
    <span className="my-5 grid grid-cols-[1fr_auto_1fr] items-center">
      <span />
      <math display="block" className="text-[1.15rem] text-black">
        {children}
      </math>
      <span className="justify-self-end pl-6 text-[0.9rem] tabular-nums text-black/45">({n})</span>
    </span>
  );
}

const P = "text-[1.05rem] leading-[1.8] text-black/70";

// An inline subscripted symbol, e.g. sym("u", "j", "t") for u_{j,t}. A
// trailing punctuation mark stays on the same line: keep(sym(...), ",").
const keep = (m: ReactNode, after?: string) =>
  after ? <span className="whitespace-nowrap">{m}{after}</span> : m;

function sym(base: string, ...subs: string[]) {
  return (
    <math>
      <msub>
        <mi>{base}</mi>
        <mrow>
          {subs.map((s, i) => (
            <Fragment key={i}>
              {i > 0 && <mo>,</mo>}
              <mi>{s}</mi>
            </Fragment>
          ))}
        </mrow>
      </msub>
    </math>
  );
}

const v = (x: string) => (
  <math>
    <mi>{x}</mi>
  </math>
);

export default function Methodology() {
  return (
    <section id="methodology" className="section-b scroll-mt-28">
      <SectionHeader label="Methodology" title="How the index is computed" />

      <p className={P}>
        The Economic Intelligence Index measures how well a language model
        makes economic decisions as an autonomous agent. It aggregates six
        benchmarks in which the model acts through tools against markets,
        counterparties or a running business, and each benchmark scores the
        outcome of those actions, such as profit, surplus captured or net worth;
        no model grades another. Every model plays the same episodes with the
        same tools, information and limits. Because benchmarks report outcomes
        in different units, we map the outcome {sym("y", "a", "t")} of model{" "}
        {v("a")} on episode {v("t")} of benchmark {v("j")} onto a common scale,
        <Equation n={1}>
          <msub><mi>z</mi><mrow><mi>a</mi><mo>,</mo><mi>t</mi></mrow></msub><mo>=</mo><mn>100</mn><mo>·</mo><msubsup><mrow><mo>[</mo><mfrac><mrow><msub><mi>y</mi><mrow><mi>a</mi><mo>,</mo><mi>t</mi></mrow></msub><mo>−</mo><msub><mi>ℓ</mi><mrow><mi>j</mi><mo>,</mo><mi>t</mi></mrow></msub></mrow><mrow><msub><mi>u</mi><mrow><mi>j</mi><mo>,</mo><mi>t</mi></mrow></msub><mo>−</mo><msub><mi>ℓ</mi><mrow><mi>j</mi><mo>,</mo><mi>t</mi></mrow></msub></mrow></mfrac><mo>]</mo></mrow><mn>0</mn><mn>1</mn></msubsup>
        </Equation>
        where the lower anchor {sym("ℓ", "j", "t")} is the outcome of a simple
        scripted strategy on the same episode, the upper anchor{" "}
        {sym("u", "j", "t")} is the best outcome the benchmark admits, or a
        demanding target where none exists, and the bracket caps the ratio at 0
        and 1, so no single episode can dominate. The mean of{" "}
        {sym("z", "a", "t")} over a benchmark&apos;s episodes is its score{" "}
        {keep(sym("Z", "a", "j"), ".")} Each benchmark feeds one or more of five
        capabilities {v("c")} (valuation and allocation, strategic interaction,
        planning and execution, economic security, and economic discovery), and
        <Equation n={2}>
          <msub><mi>Q</mi><mrow><mi>a</mi><mo>,</mo><mi>c</mi></mrow></msub><mo>=</mo><munder><mo>∑</mo><mi>j</mi></munder><msub><mi>α</mi><mrow><mi>j</mi><mo>,</mo><mi>c</mi></mrow></msub><msub><mi>Z</mi><mrow><mi>a</mi><mo>,</mo><mi>j</mi></mrow></msub><mo>,</mo><mspace width="2.5em" /><msub><mi>EII</mi><mi>a</mi></msub><mo>=</mo><munder><mo>∑</mo><mi>c</mi></munder><msub><mi>β</mi><mi>c</mi></msub><msub><mi>Q</mi><mrow><mi>a</mi><mo>,</mo><mi>c</mi></mrow></msub>
        </Equation>
        where the weights {sym("α", "j", "c")} sum to 1 over benchmarks and put
        most weight on the capability a benchmark tests most directly, and the
        weights {sym("β", "c")} sum to 1 over capabilities. Each release fixes
        the benchmarks, anchors and weights, so scores compare within a release.
      </p>
    </section>
  );
}
