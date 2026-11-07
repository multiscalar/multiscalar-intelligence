"use client";

import { useMemo, useRef, useState } from "react";
import ModelMark from "@/components/evals/ModelMark";
import { useIndicator } from "@/components/useIndicator";

export interface SkillModel {
  name: string;
  icon?: string;
  mark?: string;
  color: string;
  /** One score per skill, in the order of `skills`. */
  scores: number[];
}

const TOP_N = 10;
const ROW_H = 46;
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

// The top ten models for one economic skill at a time, as horizontal bars.
// Switching skill re-ranks the rows in place, so a model's move is visible.
export default function SkillBars({
  skills,
  info,
  models,
}: {
  skills: string[];
  /** One line per skill, shown under the tabs. */
  info: Record<string, string>;
  models: SkillModel[];
}) {
  const [skill, setSkill] = useState(skills[0]);
  const tabs = useRef<HTMLDivElement>(null);
  const pill = useIndicator(tabs, skill);
  const k = skills.indexOf(skill);

  const top = useMemo(
    () =>
      [...models]
        .sort((a, b) => b.scores[k] - a.scores[k] || a.name.localeCompare(b.name))
        .slice(0, TOP_N),
    [models, k],
  );
  const max = top[0].scores[k];
  const rankOf = new Map(top.map((m, i) => [m.name, i]));

  return (
    <div>
      <div className="max-[640px]:-mx-6 max-[640px]:overflow-x-auto max-[640px]:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          ref={tabs}
          role="tablist"
          aria-label="Skill"
          className="relative inline-flex flex-wrap gap-1 rounded-full bg-black/[0.04] p-1 max-[640px]:flex-nowrap"
        >
          <span aria-hidden className="rounded-full bg-black" style={pill} />
          {skills.map((s) => (
            <button
              key={s}
              role="tab"
              type="button"
              data-indicator={s}
              aria-selected={s === skill}
              onClick={(e) => {
                setSkill(s);
                e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
              }}
              className={`relative shrink-0 cursor-pointer whitespace-nowrap rounded-full px-4 py-[0.45rem] text-[0.8rem] font-medium transition-colors duration-300 ${
                s === skill ? "text-white" : "text-black/55 hover:text-black"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <p key={skill} className="mt-5 min-h-[1.6em] max-w-[640px] text-[0.95rem] leading-[1.6] text-black/55 animate-fade-up">
        <span className="font-medium text-black">{skill}.</span> {info[skill]}
      </p>

      <ol
        className="relative mt-8"
        style={{ height: TOP_N * ROW_H }}
        aria-label={`Top ${TOP_N} models in ${skill.toLowerCase()} (example data)`}
      >
        {models.map((m) => {
          const rank = rankOf.get(m.name);
          const visible = rank !== undefined;
          const v = m.scores[k];
          const lead = rank === 0;
          return (
            <li
              key={m.name}
              aria-hidden={!visible || undefined}
              className={`absolute inset-x-0 grid grid-cols-[1.75rem_minmax(0,13rem)_minmax(0,1fr)_2.5rem] items-center gap-4 transition-[transform,opacity] duration-[600ms] ${EASE} max-[640px]:grid-cols-[1rem_minmax(0,9rem)_minmax(0,1fr)_1.75rem] max-[640px]:gap-3 ${
                visible ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              style={{ height: ROW_H, transform: `translateY(${(visible ? rank : TOP_N) * ROW_H}px)` }}
            >
              <span className="text-[0.78rem] tabular-nums text-text-dim">{visible ? rank + 1 : ""}</span>
              <span className="flex min-w-0 items-center gap-2.5">
                <ModelMark icon={m.icon} mark={m.mark} color={m.color} tone="light" size="sm" />
                <span className={`truncate text-[0.9rem] font-medium ${lead ? "text-black" : "text-black/70"}`}>
                  {m.name}
                </span>
              </span>
              <span className="h-2 rounded-full bg-black/[0.05]">
                <span
                  className={`block h-full rounded-full transition-[width,background-color] duration-[900ms] ${EASE} ${
                    lead ? "bg-[#141311]" : "bg-black/25"
                  }`}
                  style={{ width: `${(v / max) * 100}%` }}
                />
              </span>
              <span className={`text-right text-[0.9rem] font-semibold tabular-nums ${lead ? "text-black" : "text-black/60"}`}>
                {Math.round(v * 100)}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
