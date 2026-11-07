"use client";

import { useEffect, useState } from "react";
import BenchCard from "@/components/evals/BenchCard";
import Reveal from "@/components/Reveal";
import type { BenchCardData } from "@/lib/evals/cards";
import { SKILLS } from "@/lib/evals/skills";

// The benchmark cards in a grid, with a skill filter above them. The filter
// starts from ?skill=<slug> (the Index menu links there) and keeps the URL in
// step, so a filtered list can be shared.
export default function BenchmarkList({ cards }: { cards: BenchCardData[] }) {
  const [skill, setSkill] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      const s = new URLSearchParams(location.search).get("skill");
      setSkill(SKILLS.some((k) => k.slug === s) ? s : null);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const pick = (slug: string | null) => {
    setSkill(slug);
    const url = new URL(location.href);
    if (slug) url.searchParams.set("skill", slug);
    else url.searchParams.delete("skill");
    history.replaceState(null, "", url);
  };

  const active = SKILLS.find((k) => k.slug === skill);
  const shown = active ? cards.filter((c) => active.benches.includes(c.slug)) : cards;

  const filter = (
    <div role="group" aria-label="Filter benchmarks by skill" className="mb-8 flex flex-wrap gap-2">
      {[{ slug: null, label: "All skills" }, ...SKILLS].map((k) => {
        const on = k.slug === skill;
        return (
          <button
            key={k.label}
            type="button"
            aria-pressed={on}
            onClick={() => pick(k.slug)}
            className={`cursor-pointer rounded-full border px-4 py-[0.45rem] text-[0.8rem] font-medium transition-colors ${
              on
                ? "border-black bg-black text-white"
                : "border-black/10 bg-white text-black/70 hover:border-black/25 hover:text-black"
            }`}
          >
            {k.label}
          </button>
        );
      })}
    </div>
  );

  const list = shown.map((card) => (
    <BenchCard key={card.slug} card={card} tone="light" cta />
  ));

  return (
    <>
      {filter}
      <Reveal className="grid grid-cols-3 gap-4 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1">
        {list}
      </Reveal>
    </>
  );
}
