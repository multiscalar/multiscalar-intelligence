"use client";

import { useState } from "react";
import ModelMark from "@/components/evals/ModelMark";
import { useWidth } from "@/components/evals/useWidth";
import { fmtTick, niceTicks, r3 } from "@/lib/evals/chart";
import type { ChartModel } from "@/lib/evals/examples";
import { labelStyle, placeLabels, segmentBox, type Box } from "@/lib/evals/labels";
import { fmt } from "@/lib/evals/score";

export interface RoiPoint extends ChartModel {
  cost: number;
  score: number;
}

const H = 420;
// Mark radii, px: frontier models get the full disc, the rest a small one.
const R_FRONT = 14;
const R_REST = 10;

// Score against inference cost per run (log scale). The efficient frontier
// joins the models that no cheaper model beats; everything below it pays
// more for less. Only frontier models are named, each where its label clears
// every mark, the frontier line and the other labels; hover names the rest.
export default function RoiChart({
  points,
  unit,
  metric,
}: {
  points: RoiPoint[];
  unit?: string;
  metric: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [plot, width] = useWidth<HTMLDivElement>();
  const live = points.filter((p) => p.cost > 0);

  const c0 = Math.pow(10, Math.floor(Math.log10(Math.min(...live.map((p) => p.cost)))));
  const c1 = Math.pow(10, Math.ceil(Math.log10(Math.max(...live.map((p) => p.cost)))));
  const xTicks: number[] = [];
  for (let d = c0; d <= c1 + 1e-9; d *= 10) {
    xTicks.push(d);
    if (d * 3 < c1) xTicks.push(d * 3);
  }
  const scores = live.map((p) => p.score);
  const pad = (Math.max(...scores) - Math.min(...scores)) * 0.12 || 1;
  const yTicks = niceTicks(Math.min(...scores) - pad, Math.max(...scores) + pad, 5);
  const y0 = yTicks[0];
  const y1 = yTicks[yTicks.length - 1];
  const px = (c: number) =>
    r3(((Math.log10(c) - Math.log10(c0)) / (Math.log10(c1) - Math.log10(c0))) * 100);
  const py = (v: number) => r3((1 - (v - y0) / (y1 - y0)) * 100);

  // The most attractive quadrant: cheaper than the median model and scoring
  // above the median one.
  const median = (xs: number[]) => {
    const v = [...xs].sort((a, b) => a - b);
    const m = Math.floor(v.length / 2);
    return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
  };
  const qx = px(median(live.map((p) => p.cost)));
  const qy = py(median(scores));

  // Frontier: walking up in cost, keep each model that beats every cheaper one.
  const frontier: RoiPoint[] = [];
  for (const p of [...live].sort((a, b) => a.cost - b.cost || b.score - a.score)) {
    if (!frontier.length || p.score > frontier[frontier.length - 1].score) frontier.push(p);
  }
  const onFrontier = new Set(frontier.map((p) => p.name));
  const steps = frontier
    .map((p, i) =>
      i === 0
        ? `M${px(p.cost)},${py(p.score)}`
        : `L${px(p.cost)},${py(frontier[i - 1].score)} L${px(p.cost)},${py(p.score)}`,
    )
    .join(" ");

  // Label placement, in px.
  const X = (p: RoiPoint) => (px(p.cost) / 100) * width;
  const Y = (p: RoiPoint) => (py(p.score) / 100) * H;
  const lines: Box[] = [{ l: 0, r: 170, t: 0, b: 34 }]; // the corner note
  frontier.forEach((p, i) => {
    if (!i) return;
    const prev = frontier[i - 1];
    lines.push(segmentBox(X(prev), Y(prev), X(p), Y(prev)));
    lines.push(segmentBox(X(p), Y(prev), X(p), Y(p)));
  });
  const labels = placeLabels(
    [...frontier]
      .sort((a, b) => b.score - a.score)
      .map((p) => ({ id: p.name, x: X(p), y: Y(p), text: p.name })),
    {
      width,
      height: H,
      radius: R_FRONT,
      marks: live.map((p) => ({ x: X(p), y: Y(p), r: onFrontier.has(p.name) ? R_FRONT : R_REST })),
      obstacles: lines,
      // Above-left of a frontier model is always clear of data: nothing
      // cheaper scores higher.
      sides: ["top-left", "left", "top", "right", "top-right", "bottom-right", "bottom"],
    },
  );

  return (
    <div>
      <div
        ref={plot}
        className="relative ml-14 mr-4 max-[780px]:ml-11"
        style={{ height: H }}
        onMouseLeave={() => setHovered(null)}
      >
        {yTicks.map((t) => (
          <div key={`y${t}`}>
            <div
              className={`absolute inset-x-0 border-t ${t === 0 ? "border-black/25" : "border-black/[0.06]"}`}
              style={{ top: `${py(t)}%` }}
            />
            <span
              className="absolute -left-14 w-12 -translate-y-1/2 text-right text-[0.7rem] tabular-nums text-text-dim max-[780px]:-left-11 max-[780px]:w-9"
              style={{ top: `${py(t)}%` }}
            >
              {fmtTick(t, unit)}
            </span>
          </div>
        ))}
        {xTicks.map((t) => (
          <div key={`x${t}`}>
            <div
              className="absolute inset-y-0 border-l border-black/[0.06]"
              style={{ left: `${px(t)}%` }}
            />
            <span
              className="absolute top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap text-[0.7rem] tabular-nums text-text-dim"
              style={{ left: `${px(t)}%` }}
            >
              ${t < 1 ? t.toFixed(1) : t}
            </span>
          </div>
        ))}
        <div
          aria-hidden
          className="absolute left-0 top-0 bg-[#7fbf6a]/[0.14]"
          style={{ width: `${qx}%`, height: `${qy}%` }}
        />
        <span className="absolute left-3 top-3 text-[0.72rem] font-medium text-[#3f7a33]">
          ↖ Better and cheaper
        </span>

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          <path
            d={steps}
            fill="none"
            stroke="#141311"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Off-frontier models first, so the frontier sits on top. */}
        {[...live]
          .sort((a, b) => Number(onFrontier.has(a.name)) - Number(onFrontier.has(b.name)))
          .map((p) => {
            const on = hovered === p.name;
            const best = onFrontier.has(p.name);
            const side = labels.get(p.name);
            return (
              <div
                key={p.name}
                onMouseEnter={() => setHovered(p.name)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
                  hovered && !on ? "opacity-30" : best ? "" : "opacity-55"
                } ${on ? "z-30" : best ? "z-20" : "z-10"}`}
                style={{ left: `${px(p.cost)}%`, top: `${py(p.score)}%` }}
              >
                <span className={`block transition-transform duration-200 ${on ? "scale-125" : ""}`}>
                  <ModelMark
                    icon={p.icon}
                    mark={p.mark}
                    color={p.color}
                    tone="light"
                    size={best ? "md" : "sm"}
                    title={p.name}
                  />
                </span>
                {on ? (
                  <span className="absolute left-1/2 bottom-[calc(100%+10px)] -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#141311] px-3 py-2 text-[0.72rem] leading-[1.5] text-white shadow-lg">
                    <span className="font-semibold">{p.name}</span>
                    <br />
                    {metric}: {fmt(p.score, unit)} · ${p.cost.toFixed(2)} per run
                  </span>
                ) : (
                  side && (
                    <span
                      className="pointer-events-none absolute whitespace-nowrap text-[0.75rem] font-medium leading-4 text-black/75 max-[780px]:hidden"
                      style={labelStyle(side, best ? R_FRONT : R_REST)}
                    >
                      {p.name}
                    </span>
                  )
                )}
              </div>
            );
          })}
      </div>
      <div className="mt-10 flex justify-between gap-4 pl-14 text-[0.75rem] text-text-dim max-[780px]:pl-11">
        <span>↑ {metric}</span>
        <span>Inference cost per run (log scale) →</span>
      </div>
    </div>
  );
}
