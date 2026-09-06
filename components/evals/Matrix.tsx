"use client";

import { useState } from "react";
import Chip from "./Chip";
import { providerOf } from "@/lib/evals/providers";
import { short } from "@/lib/evals/names";
import type { BenchData, BenchModel } from "@/lib/evals/types";

function advantage(d: BenchData, row: BenchModel, col: BenchModel) {
  const v = d.matrix![`${row.model_id}|${col.model_id}`];
  const w = d.matrix![`${col.model_id}|${row.model_id}`];
  if (v == null || w == null) return null;
  return { own: v, opp: w, adv: (v - w) / 2 };
}

export default function Matrix({ d }: { d: BenchData }) {
  const ranked = [...d.models].sort(
    (a, b) =>
      b.scores.claim_share - a.scores.claim_share ||
      a.name.localeCompare(b.name)
  );
  const [focusId, setFocusId] = useState(ranked[0].model_id);
  const focus = ranked.find((m) => m.model_id === focusId) ?? ranked[0];

  const rows = ranked
    .filter((m) => m.model_id !== focus.model_id)
    .map((m) => ({ m, ...advantage(d, focus, m) }))
    .filter((r): r is { m: BenchModel; own: number; opp: number; adv: number } =>
      r.adv != null
    )
    .sort((a, b) => b.adv - a.adv || a.m.name.localeCompare(b.m.name));

  const wins = rows.filter((r) => r.adv > 0.5).length;
  const losses = rows.filter((r) => r.adv < -0.5).length;
  const best = rows[0];
  const worst = rows[rows.length - 1];
  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.adv)), 4);

  const record =
    losses === 0 ? (
      <>
        Takes more surplus than <strong>all {rows.length}</strong> opponents.
      </>
    ) : wins === 0 ? (
      <>
        Takes less surplus than <strong>all {rows.length}</strong> opponents.
      </>
    ) : (
      <>
        Ahead of <strong>{wins}</strong> opponents, behind{" "}
        <strong>{losses}</strong>.
      </>
    );

  return (
    <div className="h2h">
      <div className="h2h-label">Pick a model</div>
      <div className="h2h-picker">
        {ranked.map((m) => {
          const p = providerOf(m);
          const on = m.model_id === focus.model_id;
          return (
            <button
              key={m.model_id}
              className={`h2h-pick${on ? " active" : ""}`}
              title={m.name}
              onClick={() => setFocusId(m.model_id)}
            >
              <Chip p={p} />
              <span>{short(m.name)}</span>
            </button>
          );
        })}
      </div>
      <p className="h2h-lead">
        {record} {best.adv > 0 ? "Biggest edge" : "Smallest deficit"}{" "}
        <span className={`h2h-inline ${best.adv > 0 ? "win" : "lose"}`}>
          {best.adv > 0 ? "+" : "−"}
          {Math.abs(best.adv).toFixed(1)} vs {short(best.m.name)}
        </span>
        , {worst.adv < 0 ? "biggest deficit" : "closest matchup"}{" "}
        <span className={`h2h-inline ${worst.adv < 0 ? "lose" : "win"}`}>
          {worst.adv < 0 ? "−" : "+"}
          {Math.abs(worst.adv).toFixed(1)} vs {short(worst.m.name)}
        </span>
        .
      </p>
      <div className="h2h-head">
        <span>Opponent</span>
        <span className="h2h-axis">
          <i>opponent ahead</i>
          <i>even</i>
          <i>{short(focus.name)} ahead</i>
        </span>
        <span className="h2h-adv-h">edge</span>
        <span className="h2h-raw-h">shares</span>
      </div>
      <div className="h2h-chart">
        {rows.map((r) => {
          const pct = (Math.abs(r.adv) / maxAbs) * 48;
          const win = r.adv > 0;
          const p = providerOf(r.m);
          const side = win
            ? { left: "50%", width: `${pct}%` }
            : { right: "50%", width: `${pct}%` };
          return (
            <div className="h2h-row" key={r.m.model_id}>
              <span className="h2h-name">
                <Chip p={p} />
                <span>{short(r.m.name)}</span>
              </span>
              <span className="h2h-track">
                <span className="h2h-zero"></span>
                <span
                  className={`h2h-bar ${win ? "win" : "lose"}`}
                  style={side}
                ></span>
              </span>
              <span className={`h2h-adv ${win ? "win" : "lose"}`}>
                {win ? "+" : "−"}
                {Math.abs(r.adv).toFixed(1)}
              </span>
              <span className="h2h-raw">
                {Math.round(r.own)} vs {Math.round(r.opp)}
              </span>
            </div>
          );
        })}
      </div>
      <p className="h2h-note">
        Edge is how many points of the available surplus {focus.name} takes
        above or below that opponent. Shares are the two mean percentages in
        that pairing.
      </p>
    </div>
  );
}
