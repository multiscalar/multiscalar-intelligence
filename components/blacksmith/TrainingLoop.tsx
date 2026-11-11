"use client";

import { useEffect, useState, type ComponentType } from "react";
import {
  IconArrowRotateCounterClockwise,
  IconBrain,
  IconFolders,
  IconLayersThree,
  IconRocket,
} from "central-icons";

// How Blacksmith works, as the loop it is (the deck's slide 5): business data
// becomes environments, agents train in them, and deployment feeds the next
// training cycle. Four stages left to right with a return path underneath;
// on phones they stack. A highlight walks the stages on its own and the
// return path flows while Deployment is lit; clicking a stage pins it. With
// `detail`, a panel under the loop explains the lit stage. Reduced motion: no
// walking, the first stage is lit.

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

const STAGES: { title: string; short: string; body: string; icon: Icon }[] = [
  {
    title: "Business data",
    short: "Documents, systems, policies and expertise go in.",
    body: "Contracts, records, policies and past decisions, connected from the systems your team already uses, plus the expertise of the people who run the workflow.",
    icon: IconFolders,
  },
  {
    title: "Environment generation",
    short: "Turned automatically into simulations of real economic scenarios, with graders.",
    body: "The workflow becomes simulations of the economic situations it really meets, with counterparties, prices and constraints, and graders that score outcomes the way you do.",
    icon: IconLayersThree,
  },
  {
    title: "RL and post-training",
    short: "Agents train through increasingly complex economic interactions.",
    body: "An open model trains by reinforcement learning on those environments, from simple cases to hard ones. Each version is scored on evals built automatically for that business.",
    icon: IconBrain,
  },
  {
    title: "Deployment",
    short: "Agents run in production, and outcomes feed the next cycle.",
    body: "Your team hands the agent work inside its tools, with spend limits and sign-off on every action. Every decision and outcome is captured and becomes material for the next training cycle.",
    icon: IconRocket,
  },
];

const STEP_MS = 2600;

export default function TrainingLoop({
  tone = "light",
  detail = false,
}: {
  tone?: "light" | "dark";
  detail?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [still, setStill] = useState(true);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (pinned || still) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % STAGES.length), STEP_MS);
    return () => clearTimeout(t);
  }, [active, pinned, still]);

  const dark = tone === "dark";
  const ink = dark ? "text-white" : "text-black";
  const soft = dark ? "text-white/60" : "text-black/60";
  const line = dark ? "bg-white/20" : "bg-black/15";
  const looping = active === STAGES.length - 1 && !still;
  const stage = STAGES[active];

  return (
    <div>
      <ol className="relative grid grid-cols-4 gap-4 max-[900px]:grid-cols-1 max-[900px]:gap-3">
        {STAGES.map((s, i) => {
          const on = i === active;
          const Icon = s.icon;
          return (
            <li key={s.title} className="relative">
              {/* Connector to the next stage (desktop: right, phones: down). */}
              {i < STAGES.length - 1 && (
                <span
                  aria-hidden
                  className={`absolute top-[2.15rem] -right-4 z-0 h-px w-4 ${line} max-[900px]:top-auto max-[900px]:-bottom-3 max-[900px]:left-[2.15rem] max-[900px]:right-auto max-[900px]:h-3 max-[900px]:w-px`}
                />
              )}
              <button
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setActive(i);
                  setPinned(true);
                }}
                className={`relative z-10 flex h-full w-full cursor-pointer flex-col items-start rounded-[20px] border p-6 text-left transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-offset-2 max-[900px]:flex-row max-[900px]:items-center max-[900px]:gap-4 max-[900px]:p-4 ${
                  dark
                    ? on
                      ? "border-ember/60 bg-white/[0.09] focus-visible:outline-white"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 focus-visible:outline-white"
                    : on
                      ? "border-ember bg-white focus-visible:outline-black"
                      : "border-black/10 bg-white/60 hover:border-black/25 focus-visible:outline-black"
                }`}
              >
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors duration-500 ${
                    on ? "bg-ember text-ember-ink" : dark ? "bg-white/10 text-white/75" : "bg-black/[0.05] text-black/70"
                  }`}
                >
                  <Icon strokeWidth={1.8} className="h-5 w-5" />
                </span>
                <span className="mt-6 block max-[900px]:mt-0">
                  <span className={`block font-mono text-[0.72rem] tabular-nums ${soft}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`mt-1 block text-[1.1rem] font-semibold leading-[1.25] tracking-[-0.02em] ${ink}`}>
                    {s.title}
                  </span>
                  <span className={`mt-2 block text-[0.92rem] leading-[1.55] ${soft} max-[900px]:hidden`}>
                    {s.short}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* The return path: from Deployment back to the data, under the row. */}
      <div aria-hidden className="relative mx-[12.5%] mt-0 h-14 max-[900px]:hidden">
        <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 56">
          <path
            d="M 100 0 V 28 Q 100 44 92 44 H 8 Q 0 44 0 28 V 6"
            fill="none"
            vectorEffect="non-scaling-stroke"
            strokeWidth="1.5"
            strokeDasharray="5 6"
            className={`transition-[stroke] duration-500 ${looping ? "stroke-ember animate-loop-flow" : dark ? "stroke-white/35" : "stroke-black/30"}`}
          />
        </svg>
        {/* Arrowhead into the first stage. */}
        <span
          className={`absolute -top-[2px] left-0 h-2 w-2 -translate-x-1/2 rotate-45 border-l-[1.5px] border-t-[1.5px] ${
            dark ? "border-white/45" : "border-black/40"
          }`}
        />
        <span
          className={`absolute left-1/2 top-[44px] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[0.78rem] font-medium transition-colors duration-500 ${
            dark ? "bg-[#1b1a18] text-white/75" : "bg-bg text-black/70"
          } ${looping ? (dark ? "!text-ember" : "!text-ember-deep") : ""}`}
        >
          Deployment starts the next training cycle
        </span>
      </div>
      <p className={`mt-4 hidden items-center gap-2 text-[0.85rem] font-medium ${soft} max-[900px]:flex`}>
        <IconArrowRotateCounterClockwise aria-hidden strokeWidth={1.8} className="h-4 w-4" />
        Deployment starts the next training cycle
      </p>

      {detail && (
        <div aria-live="polite" className={`mt-8 border-t pt-8 ${dark ? "border-white/10" : "border-black/10"}`}>
          <h3 className={`text-[1.3rem] font-semibold tracking-[-0.02em] ${ink}`}>{stage.title}</h3>
          <p className={`mt-3 max-w-[680px] text-[1rem] leading-[1.65] ${soft}`}>{stage.body}</p>
        </div>
      )}
    </div>
  );
}
