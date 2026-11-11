import BenchCard from "@/components/evals/BenchCard";
import Reveal from "@/components/Reveal";
import type { BenchCardData } from "@/lib/evals/cards";

// Every benchmark card in one grid, no filter.
export default function BenchmarkList({ cards }: { cards: BenchCardData[] }) {
  return (
    <Reveal className="grid grid-cols-3 gap-4 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1">
      {cards.map((card) => (
        <BenchCard key={card.slug} card={card} tone="light" cta chips={false} />
      ))}
    </Reveal>
  );
}
