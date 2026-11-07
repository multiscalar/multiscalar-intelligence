"use client";

import { useState } from "react";
import ChartCard from "@/components/evals/ChartCard";
import ModelMark from "@/components/evals/ModelMark";
import { short } from "@/lib/evals/names";
import { PROVIDER_ICONS } from "@/lib/evals/provider-icons";
import { logoColor, providerOf } from "@/lib/evals/providers";
import type { BenchData, BenchModel } from "@/lib/evals/types";

const AHEAD = [20, 19, 17];
const BEHIND = [224, 138, 95];

// Every pairing at once: row model against column model. A cell's edge is
// half the gap between the two mean shares of the available surplus, so
// ink means the row takes more, orange that it takes less.
export default function HeadToHead({ d }: { d: BenchData }) {
  const ranked = [...d.models].sort(
    (a, b) =>
      b.scores.claim_share - a.scores.claim_share ||
      a.name.localeCompare(b.name),
  );
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);

  const pair = (row: BenchModel, col: BenchModel) => {
    const own = d.matrix![`${row.model_id}|${col.model_id}`];
    const opp = d.matrix![`${col.model_id}|${row.model_id}`];
    if (own == null || opp == null || row === col) return null;
    return { own, opp, edge: (own - opp) / 2 };
  };
  const cells = ranked.map((row) => ranked.map((col) => pair(row, col)));
  const maxAbs = Math.max(
    ...cells.flat().map((c) => (c ? Math.abs(c.edge) : 0)),
    1,
  );
  const avg = cells.map((row) => {
    const xs = row.filter((c) => c !== null);
    return xs.reduce((s, c) => s + c!.edge, 0) / xs.length;
  });

  const color = (edge: number) => {
    const t = Math.min(Math.abs(edge) / maxAbs, 1);
    const [r, g, b] = edge >= 0 ? AHEAD : BEHIND;
    return `rgba(${r},${g},${b},${(0.06 + 0.9 * Math.pow(t, 0.8)).toFixed(3)})`;
  };
  const mark = (m: BenchModel) => {
    const p = providerOf(m);
    return {
      icon: p.icon ? PROVIDER_ICONS[p.icon] : undefined,
      mark: p.mark,
      color: logoColor(p),
      provider: p.label,
    };
  };
  const signed = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(1)}`;

  const focus = hover && cells[hover.r][hover.c];
  const readout = focus ? (
    <>
      <span className="font-semibold text-black">{ranked[hover.r].name}</span>{" "}
      keeps <span className="font-semibold text-black">{focus.own.toFixed(0)}%</span>{" "}
      against {ranked[hover.c].name}&apos;s{" "}
      <span className="font-semibold text-black">{focus.opp.toFixed(0)}%</span>
      <span
        className="ml-3 inline-block rounded-full px-2.5 py-1 align-middle text-[0.78rem] leading-none font-semibold tabular-nums"
        style={{
          background: color(focus.edge),
          color: Math.abs(focus.edge) / maxAbs > 0.45 ? "#fff" : "#141311",
        }}
      >
        edge {signed(focus.edge)}
      </span>
    </>
  ) : (
    <>Hover a cell to compare two models. Rows play against columns.</>
  );

  return (
    <ChartCard
      id="head-to-head"
      label="Head-to-head"
      title="Who takes money from whom"
      description="Every model against every other, across the same pairings. Ink means the row model walks away with more of the surplus; orange means it gives it up."
    >
      <p className="mb-6 min-h-[2rem] text-[0.92rem] leading-[2rem] text-black/55">
        {readout}
      </p>
      <div className="overflow-x-auto">
        <div
          className="grid min-w-[720px] gap-1"
          style={{
            gridTemplateColumns: `minmax(130px,170px) repeat(${ranked.length}, minmax(0,1fr)) 64px`,
          }}
          onMouseLeave={() => setHover(null)}
        >
          <span />
          {ranked.map((m, c) => (
            <span
              key={m.model_id}
              className={`flex justify-center pb-2 transition-opacity duration-200 ${
                hover && hover.c !== c ? "opacity-35" : ""
              }`}
            >
              <ModelMark {...mark(m)} title={m.name} tone="light" size="sm" />
            </span>
          ))}
          <span className="label pb-2 text-right text-text-dim">Avg</span>

          {ranked.map((row, r) => (
            <div key={row.model_id} className="contents">
              <span
                className={`flex min-w-0 items-center gap-2 pr-2 text-[0.82rem] font-medium transition-opacity duration-200 ${
                  hover && hover.r !== r ? "opacity-35" : ""
                }`}
              >
                <ModelMark {...mark(row)} tone="light" size="sm" />
                <span className="truncate">{short(row.name)}</span>
              </span>
              {cells[r].map((cell, c) => {
                const dim = hover && hover.r !== r && hover.c !== c;
                const on = hover?.r === r && hover?.c === c;
                if (!cell) {
                  return (
                    <span
                      key={c}
                      className="h-10 rounded-md bg-black/[0.025]"
                    />
                  );
                }
                const strong = Math.abs(cell.edge) / maxAbs > 0.45;
                return (
                  <span
                    key={c}
                    onMouseEnter={() => setHover({ r, c })}
                    className={`flex h-10 items-center justify-center rounded-md text-[0.68rem] font-semibold tabular-nums transition-[opacity,transform,box-shadow] duration-200 ${
                      dim ? "opacity-30" : ""
                    } ${on ? "scale-105 shadow-[0_4px_10px_-4px_rgba(0,0,0,0.18)] z-10" : ""}`}
                    style={{
                      background: color(cell.edge),
                      color: strong ? "#fff" : "rgba(20,19,17,0.6)",
                    }}
                  >
                    {Math.round(cell.edge) === 0 && Math.abs(cell.edge) < 0.5
                      ? "0"
                      : `${cell.edge > 0 ? "+" : "−"}${Math.abs(Math.round(cell.edge))}`}
                  </span>
                );
              })}
              <span
                className={`flex items-center justify-end text-[0.82rem] font-semibold tabular-nums transition-opacity duration-200 ${
                  hover && hover.r !== r ? "opacity-35" : ""
                }`}
                style={{ color: avg[r] >= 0 ? "#141311" : "#c2683e" }}
              >
                {signed(avg[r])}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 text-[0.75rem] text-text-dim">
        <span>Row gives up surplus</span>
        <span
          className="h-2 w-48 rounded-full"
          style={{
            background: `linear-gradient(90deg, rgb(${BEHIND}) 0%, rgba(${BEHIND},0.08) 48%, rgba(${AHEAD},0.08) 52%, rgb(${AHEAD}) 100%)`,
          }}
        />
        <span>Row takes surplus</span>
      </div>
    </ChartCard>
  );
}
