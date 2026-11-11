import ModelMark from "@/components/evals/ModelMark";
import Reveal from "@/components/Reveal";
import { CAPABILITIES } from "@/lib/evals/eii";
import { INDEX_BENCHES } from "@/lib/evals/benches";
import { INDEX_SNAPSHOT, withIndexScores } from "@/lib/evals/index-scores";
import { modelRoster } from "@/lib/evals/overview";

// The index at a glance for the home page: the top of the leaderboard as
// bars, with the three numbers that say how much stands behind it.
const SHOWN = 6;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

export default function IndexSnapshot() {
  const ranked = withIndexScores(modelRoster())
    .map((m) => ({ ...m, score: Math.round(m.overall * 1000) / 10 }))
    .sort((a, b) => b.score - a.score);
  const top = ranked.slice(0, SHOWN);
  const max = top[0]?.score ?? 100;

  const stats = [
    { value: ranked.length, label: "models scored" },
    { value: INDEX_BENCHES.length, label: "benchmarks" },
    { value: CAPABILITIES.length, label: "capabilities" },
  ];

  return (
    <section aria-labelledby="snapshot-title" className="p-3 pt-0 max-[768px]:p-2 max-[768px]:pt-0">
      <div className="rounded-[28px] panel-dark panel-light max-[768px]:rounded-[20px]">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-20 px-8 py-20 max-[960px]:grid-cols-1 max-[960px]:gap-12 max-[768px]:px-6 max-[768px]:py-14">
          <Reveal className="flex flex-col">
            <h2
              id="snapshot-title"
              className="max-w-[420px] font-sans text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-white"
            >
              Where frontier models stand today
            </h2>
            <p className="mt-5 max-w-[420px] text-[1rem] leading-[1.65] text-white/60">
              Overall Economic Intelligence Index score out of 100, as of{" "}
              {formatDate(INDEX_SNAPSHOT)}. Every score comes from the same set of benchmarks, so
              models compare directly.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {stats.map((s) => (
                // The term comes first in the markup and shows under its value.
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-2 text-[0.82rem] text-white/50">{s.label}</dt>
                  <dd className="font-sans text-[2.4rem] font-semibold leading-none tracking-[-0.04em] text-white tabular-nums max-[768px]:text-[2rem]">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
            <a
              href="/evals/"
              className="mt-10 inline-flex w-fit items-center rounded-full bg-ember px-6 py-3 text-[0.85rem] font-medium text-ember-ink transition-colors hover:bg-ember-hover hover:text-ember-ink"
            >
              Explore the index
            </a>
          </Reveal>

          <Reveal delay={0.08}>
            <ol className="flex flex-col gap-3.5">
              {top.map((m, i) => (
                <li
                  key={m.name}
                  className="grid grid-cols-[1.5rem_minmax(0,11rem)_1fr_3rem] items-center gap-4 max-[560px]:grid-cols-[1.5rem_1fr_3rem] max-[560px]:gap-x-3"
                >
                  <span className="text-[0.8rem] tabular-nums text-white/35">{i + 1}</span>
                  <span className="flex min-w-0 items-center gap-3">
                    <ModelMark icon={m.icon} mark={m.mark} color={m.color} size="md" />
                    <span className="truncate text-[0.92rem] text-white/85">{m.name}</span>
                  </span>
                  <span
                    aria-hidden
                    className="h-2 overflow-hidden rounded-full bg-white/[0.07] max-[560px]:order-last max-[560px]:col-span-3 max-[560px]:col-start-1 max-[560px]:-mt-1.5"
                  >
                    <span
                      className={`block h-full rounded-full ${i === 0 ? "bg-ember" : "bg-white/30"}`}
                      style={{ width: `${(m.score / max) * 100}%` }}
                    />
                  </span>
                  <span className="text-right text-[0.95rem] font-medium tabular-nums text-white">
                    {m.score.toFixed(1)}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
