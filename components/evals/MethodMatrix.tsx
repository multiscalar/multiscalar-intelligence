"use client";

import { IconArrowUpRight } from "central-icons";
import { useEffect, useRef, useState } from "react";

export interface MatrixRow {
  label: string;
  /** One list of benchmarks per column; `href` when it has a page. */
  cells: { title: string; href?: string }[][];
}

// Skills down the side, traits across the top. Each dot is a benchmark that
// feeds that skill and trait. Hovering or focusing a cell previews its
// benchmarks underneath; clicking locks it (click again, or anywhere outside
// the matrix and its readout, to release), so the benchmark links stay put
// while the pointer moves to them.
export default function MethodMatrix({
  columns,
  rows,
}: {
  columns: string[];
  rows: MatrixRow[];
}) {
  const [hover, setHover] = useState<[number, number] | null>(null);
  const [locked, setLocked] = useState<[number, number] | null>(null);
  const cell = hover ?? locked;
  const isLocked = (i: number, j: number) => locked?.[0] === i && locked?.[1] === j;
  const picked = cell && rows[cell[0]].cells[cell[1]];

  const root = useRef<HTMLDivElement>(null);
  const anyLocked = locked !== null;
  useEffect(() => {
    if (!anyLocked) return;
    const release = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setLocked(null);
    };
    document.addEventListener("pointerdown", release);
    return () => document.removeEventListener("pointerdown", release);
  }, [anyLocked]);

  return (
    <div ref={root}>
      <div className="-mx-2 overflow-x-auto px-2 [scrollbar-width:thin]">
        <div className="min-w-[620px]" onMouseLeave={() => setHover(null)}>
          <div className="grid items-end border-b border-white/10 pb-4" style={{ gridTemplateColumns: `minmax(9.5rem,1.2fr) repeat(${columns.length}, minmax(4.5rem,1fr))` }}>
            <span className="label text-white/40">Skill</span>
            {columns.map((c, j) => (
              <span
                key={c}
                className={`label text-center transition-colors duration-200 ${
                  cell && cell[1] === j ? "text-white" : "text-white/50"
                }`}
              >
                {c}
              </span>
            ))}
          </div>
          {rows.map((r, i) => (
            <div
              key={r.label}
              className="grid items-center border-b border-white/[0.06]"
              style={{ gridTemplateColumns: `minmax(9.5rem,1.2fr) repeat(${columns.length}, minmax(4.5rem,1fr))` }}
            >
              <span
                className={`py-4 pr-4 text-[0.95rem] font-medium transition-colors duration-200 ${
                  cell && cell[0] === i ? "text-white" : "text-white/80"
                }`}
              >
                {r.label}
              </span>
              {r.cells.map((benches, j) => {
                const on = cell?.[0] === i && cell?.[1] === j;
                const lit = cell && (cell[0] === i || cell[1] === j);
                return (
                  <button
                    key={j}
                    type="button"
                    aria-label={`${r.label} and ${columns[j]}: ${
                      benches.length ? benches.map((b) => b.title).join(", ") : "not measured"
                    }`}
                    aria-pressed={isLocked(i, j)}
                    onMouseEnter={() => setHover([i, j])}
                    onFocus={() => setHover([i, j])}
                    onBlur={() => setHover(null)}
                    onClick={() => setLocked(isLocked(i, j) ? null : [i, j])}
                    className={`flex h-14 cursor-pointer items-center justify-center gap-1.5 transition-colors duration-200 focus-visible:outline-none ${
                      isLocked(i, j)
                        ? "bg-white/[0.1] shadow-[inset_0_0_0_1px_rgba(242,235,221,0.35)]"
                        : on
                          ? "bg-white/[0.08]"
                          : lit
                            ? "bg-white/[0.03]"
                            : ""
                    }`}
                  >
                    {benches.length ? (
                      benches.map((b) => (
                        <span key={b.title} className="h-2.5 w-2.5 rounded-full bg-[#f2ebdd]" />
                      ))
                    ) : (
                      <span className="h-px w-3 bg-white/15" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Readout for the selected cell: just the benchmarks that feed it.
          Fixed height, so the page doesn't jump as the pointer moves. */}
      <div
        aria-live="polite"
        className="mt-6 flex min-h-[2rem] flex-wrap items-center gap-2 text-[0.8rem]"
      >
        {cell ? (
          picked && picked.length ? (
            <>
              <span className="mr-1 text-white/45">Measured by</span>
              {picked.map((b) =>
                b.href ? (
                  <a
                    key={b.title}
                    href={b.href}
                    className="inline-flex items-center gap-1 rounded-full border border-white/15 py-1 pl-3 pr-2.5 font-medium text-white/85 transition-colors hover:border-white/40 hover:text-white"
                  >
                    {b.title}
                    <IconArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span key={b.title} className="rounded-full border border-white/15 px-3 py-1 font-medium text-white/85">
                    {b.title}
                  </span>
                ),
              )}
            </>
          ) : (
            <span className="text-white/45">No benchmark measures this combination.</span>
          )
        ) : null}
      </div>
    </div>
  );
}
