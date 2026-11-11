import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/home/SectionHeader";

// What stands between AI and running a business (deck slide 3). The numbers
// are only a count here, so the three sit as equal columns between rules.
const BARRIERS = [
  {
    title: "Unit economics",
    body: "AI must generate more economic value than it costs to operate. Frontier-level intelligence needs to be affordable at scale.",
  },
  {
    title: "Economic security",
    body: "Agents must make reliable decisions, respect business constraints and resist manipulation, even in unfamiliar situations.",
  },
  {
    title: "Competitive advantage",
    body: "When everyone has the same intelligence, the difference comes from proprietary data, expertise and optimization.",
  },
];

export default function Barriers() {
  return (
    <section className="section-b">
      <SectionHeader
        title="Three barriers stand in the way"
        description="To run a business, AI has to pay for itself, be safe to trust, and give you an edge no one else has."
      />
      <Reveal>
        <ul className="grid grid-cols-3 border-t border-black/15 max-[900px]:grid-cols-1">
          {BARRIERS.map((b, i) => (
            <li
              key={b.title}
              className={`py-8 pr-10 max-[900px]:pr-0 ${
                i > 0 ? "border-l border-black/15 pl-10 max-[900px]:border-l-0 max-[900px]:border-t max-[900px]:pl-0" : ""
              }`}
            >
              <h3 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-black">{b.title}</h3>
              <p className="mt-3 text-[1rem] leading-[1.65] text-black/65">{b.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-[1.075rem] leading-[1.6] text-black/70">
          Businesses need AI that is specialized, secure and continuously improving.
        </p>
      </Reveal>
    </section>
  );
}
