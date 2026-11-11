"use client";

import { useRef, useState } from "react";
import { useWidth } from "@/components/evals/useWidth";
import ChartCard from "@/components/evals/ChartCard";
import ModelMark from "@/components/evals/ModelMark";
import { r3 } from "@/lib/evals/chart";
import { useIndicator } from "@/components/useIndicator";
import { PROVIDER_ICONS } from "@/lib/evals/provider-icons";
import { logoColor, providerOf } from "@/lib/evals/providers";
import type { BenchData } from "@/lib/evals/types";

const GAMES: Record<string, string> = {
  bilateral_trade: "Bilateral trade",
  first_price_auction: "First-price auction",
  provision_point: "Provision point",
  ultimatum: "Ultimatum",
};

const VIEWS = {
  claim: {
    label: "Share kept",
    key: "per_game_claim",
    note: "Share of each deal's surplus the model keeps. 50% is an even split.",
    even: 50,
  },
  efficiency: {
    label: "Deal efficiency",
    key: "per_game_efficiency",
    note: "Share of the available surplus the pairing realises at all; failed or wasteful deals pull it down.",
    even: null,
  },
} as const;
type View = keyof typeof VIEWS;

const LANE_H = 23;
const MIN_GAP = 23; // px between dot centres in a lane (dot: 20px), so none overlap

// Beeswarm lanes for one game: each dot takes the lane nearest the centre
// line (0, -1, +1, -2, ...) where it clears the dots already there.
function swarm(xs: { name: string; x: number }[]): Map<string, number> {
  const lanes = new Map<number, number[]>();
  const out = new Map<string, number>();
  for (const { name, x } of [...xs].sort((a, b) => a.x - b.x)) {
    for (let k = 0; ; k++) {
      const lane = k === 0 ? 0 : k % 2 ? -(k + 1) / 2 : k / 2;
      const taken = lanes.get(lane) ?? [];
      if (taken.every((t) => Math.abs(t - x) >= MIN_GAP)) {
        lanes.set(lane, [...taken, x]);
        out.set(name, lane);
        break;
      }
    }
  }
  return out;
}

// One track per game, every model a mark along a shared axis fitted to the
// data (in steps of 10%). Close values stack above and below the line
// without overlapping, and each row is only as tall as its own stack.
// Hovering a model lights it up in every game (a click locks it), so its
// strategy reads across the column.
export default function GameProfile({ d }: { d: BenchData }) {
  const [view, setView] = useState<View>("claim");
  // Hover previews a model; a click locks it (click again to release).
  const [preview, setPreview] = useState<string | null>(null);
  const [locked, setLocked] = useState<string | null>(null);
  const hovered = preview ?? locked;
  const toggle = (name: string) => setLocked((l) => (l === name ? null : name));
  const pills = useRef<HTMLDivElement>(null);
  const pill = useIndicator(pills, view);
  const [track, width] = useWidth<HTMLDivElement>();
  const v = VIEWS[view];

  const models = d.models.map((m) => {
    const p = providerOf(m);
    return {
      name: m.name,
      provider: p.label,
      icon: p.icon ? PROVIDER_ICONS[p.icon] : undefined,
      mark: p.mark,
      color: logoColor(p),
      values: (m[v.key] ?? {}) as Record<string, number>,
    };
  });

  // Axis fitted to this view's values across all games, in steps of 10%,
  // always including the even split when there is one.
  const all = models.flatMap((m) => Object.values(m.values));
  const lo = Math.max(0, Math.floor((Math.min(...all, v.even ?? 100) - 2) / 10) * 10);
  const hi = Math.min(100, Math.ceil((Math.max(...all, v.even ?? 0) + 2) / 10) * 10);
  const at = (x: number) => r3(((x - lo) / (hi - lo)) * 100);
  const ticks: number[] = [];
  for (let t = lo; t <= hi; t += 10) ticks.push(t);

  // Lanes per game; each row fits its own swarm.
  const lanesFor = (game: string) =>
    swarm(
      models
        .filter((m) => typeof m.values[game] === "number")
        .map((m) => ({ name: m.name, x: (at(m.values[game]) / 100) * width })),
    );
  const swarms = Object.fromEntries(Object.keys(GAMES).map((g) => [g, lanesFor(g)]));
  const trackOf = (game: string) => {
    const lanes = [...swarms[game].values()];
    const up = Math.max(1, ...lanes.map((l) => -l));
    const down = Math.max(1, ...lanes);
    return { h: (up + down + 1) * LANE_H, mid: (up + 0.5) * LANE_H };
  };

  const controls = (
    <div
      ref={pills}
      role="tablist"
      className="relative inline-flex gap-1 rounded-full bg-black/[0.05] p-1"
    >
      <span
        aria-hidden
        className="rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
        style={pill}
      />
      {(Object.keys(VIEWS) as View[]).map((k) => (
        <button
          key={k}
          type="button"
          role="tab"
          data-indicator={k}
          aria-selected={k === view}
          onClick={() => setView(k)}
          className={`relative rounded-full px-4 py-[0.45rem] text-[0.8rem] font-medium cursor-pointer transition-colors duration-300 ${
            k === view ? "text-black" : "text-black/55 hover:text-black"
          }`}
        >
          {VIEWS[k].label}
        </button>
      ))}
    </div>
  );

  return (
    <ChartCard
      id="games"
      label="Strategy profile"
      title="Where each model wins its money"
      description={v.note}
      controls={controls}
    >
      <div onMouseLeave={() => setPreview(null)}>
        {Object.entries(GAMES).map(([game, label], gi) => {
          const placed = models.filter((m) => typeof m.values[game] === "number");
          const lane = swarms[game];
          const { h: TRACK_H, mid } = trackOf(game);
          const last = gi === Object.keys(GAMES).length - 1;
          return (
            <div
              key={game}
              className="grid grid-cols-[170px_minmax(0,1fr)] items-center gap-6 border-t border-black/[0.06] py-5 max-[700px]:grid-cols-1 max-[700px]:gap-2"
            >
              <div className="text-[0.92rem] font-semibold text-black">
                {label}
              </div>
              <div
                ref={gi === 0 ? track : undefined}
                className="relative"
                style={{ height: TRACK_H + (last ? 22 : 0) }}
              >
                <div
                  className="absolute inset-x-0 h-px bg-black/10"
                  style={{ top: mid }}
                />
                {ticks.map((t) => (
                  <div
                    key={t}
                    className="absolute w-px bg-black/[0.06]"
                    style={{ left: `${at(t)}%`, top: 0, height: TRACK_H }}
                  >
                    {last && (
                      <span className="absolute top-[calc(100%+6px)] -translate-x-1/2 text-[0.7rem] tabular-nums text-text-dim">
                        {t}%
                      </span>
                    )}
                  </div>
                ))}
                {v.even !== null && (
                  <div
                    className="absolute border-l border-dashed border-black/35"
                    style={{ left: `${at(v.even)}%`, top: -6, height: TRACK_H + 12 }}
                  >
                    {gi === 0 && (
                      <span className="absolute -top-5 -translate-x-1/2 whitespace-nowrap text-[0.68rem] font-medium text-black/45">
                        even split
                      </span>
                    )}
                  </div>
                )}
                {placed.map((m) => {
                  const x = m.values[game];
                  const on = hovered === m.name;
                  const dim = hovered !== null && !on;
                  return (
                    <div
                      key={m.name}
                      onMouseEnter={() => setPreview(m.name)}
                      onClick={() => toggle(m.name)}
                      className={`absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 transition-[left,top,opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        dim ? "opacity-25" : ""
                      } ${on ? "z-20" : "z-10"}`}
                      style={{
                        left: `${at(x)}%`,
                        top: mid + (lane.get(m.name) ?? 0) * LANE_H,
                      }}
                    >
                      <span
                        className={`block rounded-full bg-white ring-1 transition-transform duration-200 ${
                          on ? "scale-125 ring-black" : "ring-black/10"
                        }`}
                      >
                        <ModelMark
                          icon={m.icon}
                          mark={m.mark}
                          color={m.color}
                          tone="light"
                          size="sm"
                          title={m.name}
                        />
                      </span>
                      {on && (
                        <span className="absolute left-1/2 bottom-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#141311] px-2.5 py-1.5 text-[0.72rem] font-medium text-white shadow-lg">
                          {m.name} · {x.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {models.map((m) => (
          <button
            key={m.name}
            type="button"
            aria-pressed={locked === m.name}
            onClick={() => toggle(m.name)}
            onMouseEnter={() => setPreview(m.name)}
            onMouseLeave={() => setPreview(null)}
            onFocus={() => setPreview(m.name)}
            onBlur={() => setPreview(null)}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border py-1 pl-1 pr-3 text-[0.75rem] font-medium transition-colors ${
              locked === m.name
                ? "border-black bg-black text-white"
                : hovered === m.name
                  ? "border-black/40 bg-black/[0.04] text-black"
                  : "border-black/10 text-black/70 hover:border-black/30"
            }`}
          >
            <ModelMark
              icon={m.icon}
              mark={m.mark}
              color={m.color}
              tone={locked === m.name ? "dark" : "light"}
              size="sm"
            />
            {m.name}
          </button>
        ))}
      </div>
    </ChartCard>
  );
}
