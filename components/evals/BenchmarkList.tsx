import BenchCard from "@/components/evals/BenchCard";
import Reveal from "@/components/Reveal";
import type { BenchCardData } from "@/lib/evals/cards";

// Scored benchmarks as a grid of leaderboard cards. Benchmarks still in
// development have no results to show, so they get a slim row underneath
// instead of a card full of placeholder bars.
export default function BenchmarkList({ cards }: { cards: BenchCardData[] }) {
  const scored = cards.filter((c) => !c.comingSoon);
  const upcoming = cards.filter((c) => c.comingSoon);
  return (
    <>
      <Reveal className="grid grid-cols-3 gap-4 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1">
        {scored.map((card) => (
          <BenchCard key={card.slug} card={card} tone="light" cta chips={false} />
        ))}
      </Reveal>
      {upcoming.length > 0 && (
        <Reveal className="mt-4">
          <ul className="flex flex-col gap-4">
            {upcoming.map((card) => (
              <li
                key={card.slug}
                className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 rounded-[20px] border border-dashed border-black/15 px-7 py-5 max-[600px]:px-6"
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="text-[1.05rem] font-semibold tracking-[-0.015em] text-black">{card.title}</h3>
                  <p className="text-[0.92rem] text-black/60">{card.question}</p>
                </div>
                <span className="text-[0.85rem] text-black/50">In development, results coming soon</span>
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </>
  );
}
