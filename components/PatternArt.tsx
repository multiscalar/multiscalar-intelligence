"use client";

import { useEffect, useRef, useState } from "react";

// A sand card's texture drawn as real elements (dots, grid cells, stripe
// segments) instead of a CSS background, so the texture itself can draw a
// picture: on hover (of the parent `group`) the elements inside the picture
// grow and darken in the order the thing would be drawn (see BUILD), and the
// rest dim a little. On the way out everything fades back at once.
// At rest it matches the plain textures, fading out towards the card's text.

export type PatternKind = "dots" | "grid" | "stripes" | "rules";

// Pictures as pixel art on each texture's own lattice ("#" is in).
export const PICTURES = {
  // A classical bank: pediment, four columns, two steps (dots).
  treasury: [
    "......#......",
    "...#######...",
    "#############",
    ".##.##.##.##.",
    ".##.##.##.##.",
    ".##.##.##.##.",
    "#############",
  ],
  // Three crates, stacked (grid cells).
  procurement: [
    "..#####..",
    "..#####..",
    "..#####..",
    "####.####",
    "####.####",
    "####.####",
  ],
  // A price tag with its hole (stripe segments).
  pricing: [
    "....###########",
    "...############",
    "..#############",
    ".##..##########",
    "##....#########",
    "##....#########",
    ".##..##########",
    "..#############",
    "...############",
    "....###########",
  ],
  // How a score is built, one picture per step.
  // Episodes: many runs, as timelines of different lengths (dots).
  episodes: [
    "###########..",
    "#######......",
    "##########...",
    "#####........",
    "#########....",
  ],
  // Outcomes: results of different sizes, as a bar chart (grid cells).
  outcomes: [
    "......#..",
    "..#...#.#",
    "..#.#.#.#",
    "#.#.#.#.#",
  ],
  // Normalized: a bell curve, hatched by the stripes themselves; its
  // widest row is the baseline the results sit on.
  normalized: [
    "..........###..........",
    ".........#####.........",
    "........#######........",
    ".......#########.......",
    "......###########......",
    ".....#############.....",
    "...#################...",
    "#######################",
  ],
  // Index: many scores rolling up into one, as ledger rules that narrow
  // row by row to a single short stroke.
  index: [
    "########################",
    "........................",
    "..####################..",
    "........................",
    "....################....",
    "........................",
    "......############......",
    "........................",
    "........########........",
    "........................",
    "..........####..........",
    "........................",
    "...........##...........",
  ],
} as const;
export type Picture = keyof typeof PICTURES;

// When each cell of a picture lights, in ms from hover, given its row and
// column in the picture (h rows, w columns).
const BUILD: Record<Picture, (r: number, c: number, h: number, w: number) => number> = {
  // Built from the steps up.
  treasury: (r, c, h, w) => (h - 1 - r) * 90 + Math.abs(c - (w - 1) / 2) * 12,
  // The two bottom crates set down, then the top one on them.
  procurement: (r, c) => (r < 3 ? 2 : c < 4 ? 0 : 1) * 220,
  // Swept in from the tag's point.
  pricing: (_r, c) => c * 45,
  // One timeline after another, each drawn left to right.
  episodes: (r, c) => r * 140 + c * 35,
  // Bar by bar, each growing up from the baseline.
  outcomes: (r, c, h) => (c / 2) * 180 + (h - 1 - r) * 90,
  // Rising from its baseline, the middle first.
  normalized: (r, c, h, w) => (h - 1 - r) * 80 + Math.abs(c - (w - 1) / 2) * 10,
  // Rule by rule down the funnel, each drawn out from the middle.
  index: (r, c, _h, w) => r * 70 + Math.abs(c - (w - 1) / 2) * 12,
};

const STEP: Record<PatternKind, number> = { dots: 22, grid: 28, stripes: 11 * Math.SQRT2, rules: 10 };
// Ink strength at rest (matching the plain textures) and for the picture.
const REST: Record<PatternKind, number> = { dots: 0.18, grid: 0.08, stripes: 0.1, rules: 0.1 };
// Only a step above rest: the picture should be noticed, not announced.
const LIT: Record<PatternKind, number> = { dots: 0.3, grid: 0.045, stripes: 0.19, rules: 0.24 };
const INK = "60,45,25";
// Pictures start below the card's number and end above its text.
const TOP_PX = 28;

// Base opacity: full at the top, fading out between 30% and 75% of the
// height, like the plain textures' mask.
const fade = (y: number, h: number) =>
  Math.max(0, Math.min(1, (0.75 * h - y) / (0.45 * h)));

export default function PatternArt({ kind, picture }: { kind: PatternKind; picture: Picture }) {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setSize({ w: e.contentRect.width, h: e.contentRect.height }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const s = STEP[kind];
  const art = PICTURES[picture];
  const cells: { x: number; y: number; on: boolean; delay: number }[] = [];
  if (size) {
    const cols = Math.ceil(size.w / s) + 1;
    const rows = Math.ceil(size.h / s) + 1;
    const c0 = Math.floor((cols - 1 - art[0].length) / 2);
    const r0 = Math.ceil(TOP_PX / s);
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const on = art[j - r0]?.[i - c0] === "#";
        const x = i * s;
        const y = j * s;
        const delay = on ? BUILD[picture](j - r0, i - c0, art.length, art[0].length) : 0;
        cells.push({ x, y, on, delay });
      }
    }
  }

  return (
    <svg ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
      {size &&
        cells.map(({ x, y, on, delay }) => {
          const base = fade(y + s / 2, size.h);
          // Opacity at rest (identical inside and outside the picture) and on
          // hover, as variables the classes read.
          const vars = {
            "--o": REST[kind] * base,
            "--oh": on ? LIT[kind] : REST[kind] * base * 0.9,
            "--d": `${Math.round(delay)}ms`,
          } as React.CSSProperties;
          // The picture's cells light quickly, one after another; the rest
          // dim slowly. Delays apply going in only.
          const anim = `opacity-[var(--o)] group-hover:opacity-[var(--oh)] transition-[opacity,transform,stroke-width] ease-out group-hover:[transition-delay:var(--d)] motion-reduce:transition-none ${on ? "duration-500 group-hover:duration-300" : "duration-700"}`;
          if (kind === "dots") {
            return (
              <circle
                key={`${x},${y}`}
                cx={x + s / 2}
                cy={y + s / 2}
                r={1.2}
                fill={`rgb(${INK})`}
                className={`${anim} origin-center [transform-box:fill-box] ${on ? "group-hover:scale-[1.2]" : ""}`}
                style={vars}
              />
            );
          }
          if (kind === "grid") {
            return (
              <g key={`${x},${y}`}>
                <path d={`M${x} ${y + s}V${y}H${x + s}`} fill="none" stroke={`rgb(${INK})`} strokeWidth={1} style={{ opacity: REST.grid * base }} />
                {on && (
                  <rect
                    x={x + 1}
                    y={y + 1}
                    width={s - 1}
                    height={s - 1}
                    fill={`rgba(${INK},${LIT.grid})`}
                    className="opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-hover:duration-300 group-hover:[transition-delay:var(--d)] motion-reduce:transition-none"
                    style={vars}
                  />
                )}
              </g>
            );
          }
          if (kind === "rules") {
            // Ledger paper: one horizontal rule per row, in cell-wide pieces.
            return (
              <line
                key={`${x},${y}`}
                x1={x}
                y1={y + s - 0.5}
                x2={x + s}
                y2={y + s - 0.5}
                stroke={`rgb(${INK})`}
                strokeWidth={1}
                className={`${anim} ${on ? "group-hover:[stroke-width:1.6px]" : ""}`}
                style={vars}
              />
            );
          }
          return (
            <line
              key={`${x},${y}`}
              x1={x}
              y1={y + s}
              x2={x + s}
              y2={y}
              stroke={`rgb(${INK})`}
              strokeWidth={1}
              strokeLinecap="square"
              className={`${anim} ${on ? "group-hover:[stroke-width:1.25px]" : ""}`}
              style={vars}
            />
          );
        })}
    </svg>
  );
}
