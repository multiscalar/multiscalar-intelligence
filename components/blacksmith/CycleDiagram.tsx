"use client";

import { useState } from "react";

// The Blacksmith cycle as a ring: six steps clockwise, the arc from Monitor
// back to Map dashed because it starts the next version. Picking a step
// (click, hover or keyboard) shows what happens there and where it lives in
// the app, using the app's own sidebar names (Data, Build, Train, Run).
const STEPS = [
  { title: "Map", body: "We learn the workflow from your documents, systems and people.", where: ["Data", "Connectors"] },
  { title: "Simulate", body: "We turn it into thousands of realistic scenarios, scored the way you score outcomes.", where: ["Build", "Environments"] },
  { title: "Train", body: "Reinforcement learning on an open model, inside your infrastructure.", where: ["Train", "Training runs"] },
  { title: "Evaluate", body: "We test the model against your current process and frontier models before anything ships.", where: ["Train", "Evaluations"] },
  { title: "Deploy", body: "Your team hands it work inside your tools, with spending limits and sign-off on every action.", where: ["Run", "Assistant"] },
  { title: "Monitor", body: "We track every decision and outcome. Failures become new scenarios for the next version.", where: ["Run", "Deployments"] },
];

const SIZE = 520;
const C = SIZE / 2;
const R = 168; // ring
const L = 214; // labels
const GAP = 10; // degrees left clear around each node

const rad = (deg: number) => (deg * Math.PI) / 180;
const angle = (i: number) => -90 + i * (360 / STEPS.length);
// Rounded so the server and the browser render identical markup.
const round = (v: number) => Math.round(v * 100) / 100;
const at = (deg: number, r: number) => [round(C + r * Math.cos(rad(deg))), round(C + r * Math.sin(rad(deg)))];

function arc(i: number) {
  const [x1, y1] = at(angle(i) + GAP, R);
  const [x2, y2] = at(angle(i + 1) - GAP, R);
  return `M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`;
}

export default function CycleDiagram() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];
  const pct = (v: number) => `${round((v / SIZE) * 100)}%`;

  return (
    <div className="grid grid-cols-[minmax(0,520px)_minmax(0,1fr)] items-center gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-8">
      <div className="mx-auto w-full max-w-[520px] max-[640px]:px-12">
      <div className="relative aspect-square w-full">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <marker id="cycle-head" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 1 1 L 8 5 L 1 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          {STEPS.map((_, i) => {
            const back = i === STEPS.length - 1;
            const lit = i === active || (i + 1) % STEPS.length === active;
            return (
              <path
                key={i}
                d={arc(i)}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeDasharray={back ? "4 6" : undefined}
                markerEnd="url(#cycle-head)"
                className={`transition-colors duration-300 ${lit ? "text-black/70" : "text-black/20"}`}
              />
            );
          })}
          {STEPS.map((_, i) => {
            const [x, y] = at(angle(i), R);
            const on = i === active;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={on ? 8 : 6}
                strokeWidth={1.5}
                className={`transition-[fill,stroke] duration-300 ${on ? "fill-black stroke-black" : "fill-bg stroke-black/35"}`}
              />
            );
          })}
        </svg>

        {/* The dashed arc's label, inside the ring between Monitor and Map. */}
        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[0.72rem] text-black/45 max-[520px]:hidden"
          style={{ left: pct(at(240, R - 34)[0]), top: pct(at(240, R - 34)[1]) }}
        >
          next version
        </span>

        {STEPS.map((s, i) => {
          const a = angle(i);
          const [x, y] = at(a, L);
          const cos = round(Math.cos(rad(a)));
          const shift = cos > 0.2 ? "translate(0,-50%)" : cos < -0.2 ? "translate(-100%,-50%)" : "translate(-50%,-50%)";
          const on = i === active;
          return (
            <button
              key={s.title}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`absolute cursor-pointer rounded-md px-2 py-1 font-sans text-[1rem] font-medium tabular-nums transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black max-[520px]:text-[0.85rem] ${
                on ? "text-black" : "text-black/45 hover:text-black"
              }`}
              style={{ left: pct(x), top: pct(y), transform: shift }}
            >
              <span className="mr-1.5 text-[0.75rem] text-black/35">{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </button>
          );
        })}

        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="font-sans text-[clamp(2rem,5vw,3rem)] font-semibold leading-none tracking-[-0.04em] text-black">
              {step.title}
            </div>
            <div className="mt-3 text-[0.8rem] text-black/45">
              Step {active + 1} of {STEPS.length}
            </div>
          </div>
        </div>
      </div>
      </div>

      <div aria-live="polite">
        <p key={active} className="animate-fade-up max-w-[420px] text-[1.25rem] leading-[1.5] tracking-[-0.01em] text-black motion-reduce:animate-none">
          {step.body}
        </p>
        <div className="mt-6 flex items-center gap-2 text-[0.85rem] text-black/50">
          In the app
          <span className="rounded-md border border-black/10 bg-white px-2 py-0.5 text-black/75">
            {step.where[0]} › {step.where[1]}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setActive((active + 1) % STEPS.length)}
          className="mt-10 inline-flex cursor-pointer items-center rounded-full border border-black/15 px-5 py-2.5 text-[0.85rem] font-medium text-black transition-colors hover:bg-black/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Next: {STEPS[(active + 1) % STEPS.length].title}
        </button>
      </div>
    </div>
  );
}
