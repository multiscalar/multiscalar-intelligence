"use client";

import { useState } from "react";
import { IconChevronDownSmall } from "central-icons";
import Reveal from "@/components/Reveal";

export interface FaqItem {
  q: string;
  a: string;
  /** Optional link under the answer. */
  link?: { href: string; label: string };
}

// Questions and answers: the heading on the left, the questions on the right
// between hairlines. Each opens in place (several can be open at once), the
// answer sliding down by moving its row between 0fr and 1fr.
export default function Faq({
  items,
  title = "Common questions",
  contact,
}: {
  items: FaqItem[];
  /** No longer shown: headings carry their own weight (DESIGN.md). */
  label?: string;
  title?: string;
  /** "Still have questions?" line under the heading. */
  contact?: { href: string; label: string };
}) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-16 max-[960px]:grid-cols-1 max-[960px]:gap-10">
      <Reveal>
        <h2 className="font-sans text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-black">
          {title}
        </h2>
        {contact && (
          <p className="mt-5 text-[0.95rem] leading-[1.6] text-black/55">
            Still have questions?{" "}
            <a href={contact.href} className="font-medium text-black underline decoration-black/25 underline-offset-4 hover:decoration-black">
              {contact.label}
            </a>
          </p>
        )}
      </Reveal>

      {/* Side by side, the list drops so the first question is centred on the
          title's first line: half the title's line, minus the first row's
          border, top padding and half its line. */}
      <Reveal delay={0.06} className="min-[961px]:mt-[calc(clamp(1.9rem,3.2vw,2.75rem)*0.55-2.27rem-1px)]">
        <ul className="border-b border-black/10">
          {items.map((item, i) => {
            const on = open.has(i);
            return (
              <li key={item.q} className="border-t border-black/10">
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => toggle(i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-[1.1rem] font-medium leading-[1.4] tracking-[-0.01em] text-black">
                    {item.q}
                  </span>
                  <IconChevronDownSmall
                    aria-hidden
                    className={`h-5 w-5 shrink-0 text-black/45 transition-transform duration-300 ${on ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                    on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="max-w-[620px] pb-7 pr-10">
                      <p className="text-[1rem] leading-[1.65] text-black/60">{item.a}</p>
                      {item.link && (
                        <a
                          href={item.link.href}
                          className="mt-3 inline-block text-[0.9rem] font-medium text-black underline decoration-black/25 underline-offset-4 hover:decoration-black"
                        >
                          {item.link.label}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </div>
  );
}
