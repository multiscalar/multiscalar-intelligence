import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

const RESEARCH_CARDS = [
  {
    number: "01",
    title: "Strategic Capabilities",
    body: "Training agents to reason, plan, and act under incentives and uncertainty. We develop methods that go beyond static reasoning, enabling agents to model others, anticipate outcomes, and operate in strategic environments.",
  },
  {
    number: "02",
    title: "Collective Learning",
    body: "Extending learning from individuals to groups. We design algorithms that enable agents to learn jointly across coalitions, propagating signals through interactions, aligning behaviors, and improving coordination through shared experience.",
  },
  {
    number: "03",
    title: "Coordination at Scale",
    body: "Building the foundations for large-scale, open multi-agent systems. This includes protocols, benchmarks, and infrastructure for coordination in adversarial environments, where agents must discover, interact, and cooperate without central control.",
  },
  {
    number: "04",
    title: "Security & Safety in Multi-Agent Systems",
    body: "Designing agents that remain robust, aligned, and trustworthy in open environments. We study adversarial behavior, collusion, and deception, and build trust mechanisms and secure interaction protocols so agent ecosystems can scale safely under real-world incentives.",
  },
];

export default function Home() {
  return (
    <main className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
      {/* Hero */}
      <section className="pt-[11rem] pb-16 text-center max-w-[700px] mx-auto animate-fade-up max-[768px]:pt-36 max-[768px]:pb-12">
        <div className="font-mono text-[0.72rem] text-text-dim tracking-[0.25em] uppercase mb-[1.8rem]">
          Scaling Multi-Agent Intelligence
        </div>
        <h1 className="font-sans text-[clamp(2.6rem,5.5vw,4.2rem)] font-light leading-[1.12] tracking-[-0.03em] text-black max-[480px]:text-[2.2rem]">
          Teaching Machines to Coordinate
        </h1>
      </section>

      {/* Central Paragraph */}
      <section className="max-w-[640px] mx-auto pt-16 pb-20 animate-fade-up [animation-delay:0.15s] max-[768px]:pt-12 max-[768px]:pb-16">
        <p className="text-[1.08rem] leading-[1.9] text-text-secondary">
          Multiscalar Intelligence develops new algorithms and systems for
          multi-agent AI, enabling agents to learn, coordinate, and scale from
          individuals to open networks. Our work focuses on emerging scaling
          paradigms for coordination: training agents to reason strategically,
          enabling collective learning across coalitions, and building the
          foundations for large-scale coordination in open, adversarial
          environments.
        </p>
      </section>

      {/* Research */}
      <section className="py-20 max-[768px]:py-14" id="research">
        <Reveal className="font-mono text-[0.72rem] text-text-dim tracking-[0.2em] uppercase pt-[0.3rem] mb-12">
          Research
        </Reveal>
        <div className="grid grid-cols-2 gap-px bg-border mt-12 max-[768px]:grid-cols-1 max-[768px]:mt-8">
          {RESEARCH_CARDS.map((card, i) => (
            <Reveal
              key={card.number}
              delay={i * 0.08}
              className="bg-bg p-10 hover:bg-bg-elevated max-[480px]:p-[1.8rem]"
            >
              <div className="font-mono text-[0.7rem] text-text-dim tracking-[0.15em] mb-[1.2rem]">
                {card.number}
              </div>
              <h3 className="font-sans text-[1.15rem] font-medium text-black mb-4 tracking-[-0.01em]">
                {card.title}
              </h3>
              <p className="text-[0.92rem] text-text-secondary leading-[1.7]">
                {card.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Team */}
      <section id="team">
        <Reveal className="grid grid-cols-[200px_1fr] gap-16 py-20 max-[768px]:grid-cols-1 max-[768px]:gap-6 max-[768px]:py-14">
          <div className="font-mono text-[0.72rem] text-text-dim tracking-[0.2em] uppercase pt-[0.3rem]">
            Team
          </div>
          <div>
            <p className="text-[1.05rem] text-text-secondary mb-10 max-w-[650px]">
              We are researchers and engineers advancing new scaling paradigms
              for multi-agent AI, combining machine learning and game theory to
              enable coordination at scale.
            </p>
            <div className="border border-border p-8 rounded-[2px]">
              <a
                href="mailto:careers@multiscalar.ai"
                className="font-mono text-[0.85rem] text-text tracking-[0.02em] transition-[letter-spacing,color] duration-300 hover:tracking-[0.06em] hover:text-black"
              >
                Get in touch to collaborate →
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Divider */}
      <Reveal variant="divider" className="h-px bg-border" />

      <Footer />
    </main>
  );
}
