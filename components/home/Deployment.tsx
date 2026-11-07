"use client";

import { useState } from "react";
import Image from "next/image";
import { IconChevronDownSmall } from "central-icons";
import Reveal from "@/components/Reveal";
import { contactHref } from "@/lib/contact";

// Draft copy; review before launch.
const POINTS = [
  {
    title: "Private by design",
    body: "Models run inside your own infrastructure, so financial data, counterparties and strategy never leave it.",
  },
  {
    title: "A fraction of the cost",
    body: "Specialized models do the job of far larger general ones, so running agents across a whole function stays affordable.",
  },
  {
    title: "More accurate where it counts",
    body: "Trained on the decisions your function actually makes and scored on the index, so you know how they perform before they touch a budget.",
  },
];

// What enterprises get from systems built on our models, between the index
// and the customer quotes. Text on the left, image on the right.
export default function Deployment() {
  // One point open at a time, so the column stays within the image's height.
  const [open, setOpen] = useState(0);
  return (
    <section className="section-y grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] items-center gap-14 max-[900px]:grid-cols-1 max-[900px]:gap-10">
      <Reveal>
        <div className="label mb-4 text-text-dim">For enterprises</div>
        <h2 className="max-w-[480px] font-sans text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-black">
          Private, cheaper and better at the job
        </h2>
        <p className="mt-6 max-w-[460px] text-[1.05rem] leading-[1.6] text-black/60">
          Our systems run on specialized models trained in our economic
          worlds. They beat general models on the decisions that matter to
          your business, at a fraction of the cost, without your data leaving
          your infrastructure.
        </p>
        <ul className="mt-8 max-w-[460px] border-t border-black/10">
          {POINTS.map((p, i) => {
            const on = i === open;
            return (
              <li key={p.title} className="border-b border-black/10">
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => setOpen(i)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-[0.95rem] font-medium transition-colors ${
                    on ? "text-black" : "text-black/55 hover:text-black"
                  }`}
                >
                  {p.title}
                  <IconChevronDownSmall
                    aria-hidden
                    className={`h-4 w-4 shrink-0 transition-transform duration-300 ${on ? "rotate-180" : ""}`}
                  />
                </button>
                {/* Animates height by moving the row between 0fr and 1fr. */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  {/* Every body is stacked in the same cell (only this row's
                      visible), so each panel is as tall as the longest one and
                      the column, and the image centred beside it, never shift. */}
                  <div className="grid overflow-hidden">
                    {POINTS.map((q, j) => (
                      <p
                        key={q.title}
                        aria-hidden={j !== i}
                        className={`col-start-1 row-start-1 pb-5 pr-8 text-[0.9rem] leading-[1.6] text-black/60 ${
                          j === i ? "" : "invisible"
                        }`}
                      >
                        {q.body}
                      </p>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <a
          href={contactHref("partnership")}
          className="mt-9 inline-flex items-center rounded-full border border-black/15 px-6 py-3 text-[0.85rem] font-medium text-black transition-colors hover:bg-black/[0.04] hover:text-black"
        >
          Discuss a project
        </a>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="relative h-[640px] overflow-hidden rounded-[28px] bg-[#1a1712] max-[900px]:h-[420px] max-[768px]:h-[300px] max-[768px]:rounded-[20px]">
          <Image
            src="/home/deployment.webp"
            alt="A sunlit hall where rows of small white robots wait beside parcels while two people check a clipboard"
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
            className="object-cover"
            style={{ objectPosition: "60% 50%" }}
          />
        </div>
      </Reveal>
    </section>
  );
}
