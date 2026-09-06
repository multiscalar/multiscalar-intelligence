"use client";

import { useState } from "react";
import Chip from "./Chip";
import { providerOf } from "@/lib/evals/providers";
import { short } from "@/lib/evals/names";
import { fmt } from "@/lib/evals/score";
import type { RadarData } from "@/lib/evals/overview";

const W = 620;
const H = 470;
const CX = W / 2;
const CY = 225;
const R = 158;
const DEFAULT_ON = 5;

// Axis i sits at -90° + i·90°: ZeroSum top, Treasury right, TERMS bottom,
// Vending left.
function point(i: number, frac: number): [number, number] {
  const a = ((-90 + i * 90) * Math.PI) / 180;
  return [CX + Math.cos(a) * R * frac, CY + Math.sin(a) * R * frac];
}

interface Tip {
  x: number;
  y: number;
  name: string;
  axis: number;
  raw: number;
  norm: number;
}

export default function Radar({ data }: { data: RadarData }) {
  const [active, setActive] = useState<Set<string>>(
    () => new Set(data.models.slice(0, DEFAULT_ON).map((m) => m.name))
  );
  const [tip, setTip] = useState<Tip | null>(null);

  const toggle = (name: string) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const rings = [0.25, 0.5, 0.75, 1];
  const labelPos: [number, number, "middle" | "start" | "end"][] = [
    [CX, CY - R - 22, "middle"],
    [CX + R + 16, CY, "start"],
    [CX, CY + R + 26, "middle"],
    [CX - R - 16, CY, "end"],
  ];

  return (
    <div className="radar-wrap">
      <div className="radar-plot">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Normalized model scores across the four benchmarks"
        >
          {/* grid */}
          {rings.map((f) => (
            <polygon
              key={f}
              points={[0, 1, 2, 3].map((i) => point(i, f).join(",")).join(" ")}
              fill="none"
              stroke={f === 1 ? "#dedcd7" : "#eae8e4"}
              strokeWidth="1"
            />
          ))}
          {[0, 1, 2, 3].map((i) => {
            const [x, y] = point(i, 1);
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={x}
                y2={y}
                stroke="#eae8e4"
                strokeWidth="1"
              />
            );
          })}
          {/* ring values along the top axis */}
          {rings.map((f) => (
            <text
              key={f}
              x={CX + 6}
              y={CY - R * f + 3}
              className="radar-ring-label"
            >
              {f * 100}
            </text>
          ))}
          {/* axis labels */}
          {data.axes.map((a, i) => {
            const [x, y, anchor] = labelPos[i];
            return (
              <text
                key={a.slug}
                x={x}
                y={y}
                textAnchor={anchor}
                className="radar-axis-label"
              >
                {a.title}
              </text>
            );
          })}
          {/* model outlines: an open outline means no result on the skipped
              benchmark; the line never pretends a zero */}
          {data.models
            .filter((m) => active.has(m.name))
            .map((m) => {
              const p = providerOf(m.model);
              const n = m.values.length;
              const present = m.values
                .map((v, i) => (v === null ? null : i))
                .filter((i): i is number => i !== null);
              const missing = [...Array(n).keys()].filter(
                (i) => !present.includes(i)
              );
              const order =
                missing.length === 0
                  ? present
                  : Array.from(
                      { length: n - 1 },
                      (_, k) => (missing[0] + 1 + k) % n
                    );
              const pts = order.map((i) => point(i, m.values[i]! / 100));
              const line = pts
                .map(([x, y], k) => `${k ? "L" : "M"}${x},${y}`)
                .join(" ");
              return (
                <g key={m.name}>
                  {/* the area always closes; the outline stays open across a
                      missing axis so the gap remains visible */}
                  <path d={`${line} Z`} fill={p.color} fillOpacity="0.09" />
                  <path
                    d={line + (missing.length === 0 ? " Z" : "")}
                    fill="none"
                    stroke={p.color}
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  {order.map((i) => {
                    const [x, y] = point(i, m.values[i]! / 100);
                    return (
                      <g key={i}>
                        <circle
                          cx={x}
                          cy={y}
                          r="3.5"
                          fill={p.color}
                          stroke="var(--color-bg)"
                          strokeWidth="2"
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r="11"
                          fill="transparent"
                          onMouseEnter={() =>
                            setTip({
                              x,
                              y,
                              name: m.name,
                              axis: i,
                              raw: m.raw[i]!,
                              norm: m.values[i]!,
                            })
                          }
                          onMouseLeave={() => setTip(null)}
                        />
                      </g>
                    );
                  })}
                </g>
              );
            })}
        </svg>
        {tip && (
          <div
            className="chart-tip radar-tip"
            style={{
              left: `${(tip.x / W) * 100}%`,
              top: `${(tip.y / H) * 100}%`,
            }}
          >
            <span className="tip-title">{tip.name}</span>
            <br />
            <span className="tip-row">
              {data.axes[tip.axis].title}:{" "}
              {fmt(tip.raw, data.axes[tip.axis].unit)}
            </span>
            <br />
            <span className="tip-row">{Math.round(tip.norm)}/100 normalized</span>
          </div>
        )}
      </div>
      <div className="h2h-picker radar-picker">
        {data.models.map((m) => {
          const p = providerOf(m.model);
          const on = active.has(m.name);
          return (
            <button
              key={m.name}
              className={`h2h-pick${on ? " active" : ""}`}
              title={m.name}
              onClick={() => toggle(m.name)}
            >
              <Chip p={p} />
              <span>{short(m.name)}</span>
            </button>
          );
        })}
      </div>
      <p className="radar-note">
        Each axis is a benchmark&apos;s headline metric, scaled 0–100 between
        the worst and best model on that benchmark. An open outline means the
        model has no result on the benchmark it skips.
      </p>
    </div>
  );
}
