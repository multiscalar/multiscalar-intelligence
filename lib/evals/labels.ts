import type { CSSProperties } from "react";

// Collision-aware label placement for the scatter-style charts. Every point
// tries a list of sides in order and takes the first whose label box stays in
// the plot and clear of every mark, line and label already placed; points
// with no free side go unlabelled (hover still names them).

export type Box = { l: number; r: number; t: number; b: number };
export type Side = "right" | "left" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

// Rough metrics of a 0.75rem Montserrat label.
const CHAR_W = 6.9;
const LABEL_H = 16;
const GAP = 6;

const overlaps = (a: Box, b: Box) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;

function boxFor(side: Side, x: number, y: number, r: number, w: number): Box {
  const h = LABEL_H;
  switch (side) {
    case "right":
      return { l: x + r + GAP, r: x + r + GAP + w, t: y - h / 2, b: y + h / 2 };
    case "left":
      return { l: x - r - GAP - w, r: x - r - GAP, t: y - h / 2, b: y + h / 2 };
    case "top":
      return { l: x - w / 2, r: x + w / 2, t: y - r - 4 - h, b: y - r - 4 };
    case "bottom":
      return { l: x - w / 2, r: x + w / 2, t: y + r + 4, b: y + r + 4 + h };
    case "top-left":
      return { l: x - GAP - w, r: x - GAP, t: y - r - 2 - h, b: y - r - 2 };
    case "top-right":
      return { l: x + GAP, r: x + GAP + w, t: y - r - 2 - h, b: y - r - 2 };
    case "bottom-left":
      return { l: x - GAP - w, r: x - GAP, t: y + r + 2, b: y + r + 2 + h };
    case "bottom-right":
      return { l: x + GAP, r: x + GAP + w, t: y + r + 2, b: y + r + 2 + h };
  }
}

// CSS for a label beside a mark of radius `r` px, matching boxFor.
export function labelStyle(side: Side, r: number): CSSProperties {
  const g = `${r + GAP}px`;
  const v = `${r + 3}px`;
  switch (side) {
    case "right":
      return { left: `calc(50% + ${g})`, top: "50%", transform: "translateY(-50%)" };
    case "left":
      return { right: `calc(50% + ${g})`, top: "50%", transform: "translateY(-50%)" };
    case "top":
      return { left: "50%", bottom: `calc(50% + ${v})`, transform: "translateX(-50%)" };
    case "bottom":
      return { left: "50%", top: `calc(50% + ${v})`, transform: "translateX(-50%)" };
    case "top-left":
      return { right: `calc(50% + ${GAP}px)`, bottom: `calc(50% + ${v})` };
    case "top-right":
      return { left: `calc(50% + ${GAP}px)`, bottom: `calc(50% + ${v})` };
    case "bottom-left":
      return { right: `calc(50% + ${GAP}px)`, top: `calc(50% + ${v})` };
    case "bottom-right":
      return { left: `calc(50% + ${GAP}px)`, top: `calc(50% + ${v})` };
  }
}

export function placeLabels(
  items: { id: string; x: number; y: number; text: string }[],
  {
    width,
    height,
    radius,
    marks,
    obstacles = [],
    sides,
  }: {
    width: number;
    height: number;
    /** Radius of the labelled marks, px. */
    radius: number;
    /** Every mark on the chart (labelled or not), as centre and radius. */
    marks: { x: number; y: number; r: number }[];
    /** Lines and fixed annotations to keep clear of. */
    obstacles?: Box[];
    sides: Side[];
  },
): Map<string, Side> {
  const taken: Box[] = [
    ...marks.map((m) => ({ l: m.x - m.r, r: m.x + m.r, t: m.y - m.r, b: m.y + m.r })),
    ...obstacles,
  ];
  const out = new Map<string, Side>();
  for (const it of items) {
    const w = it.text.length * CHAR_W;
    for (const side of sides) {
      const box = boxFor(side, it.x, it.y, radius, w);
      if (box.l < 0 || box.r > width || box.t < 0 || box.b > height) continue;
      if (taken.some((o) => overlaps(o, box))) continue;
      out.set(it.id, side);
      taken.push(box);
      break;
    }
  }
  return out;
}

// Thin boxes along a horizontal or vertical segment, for `obstacles`.
export function segmentBox(x1: number, y1: number, x2: number, y2: number, pad = 2): Box {
  return {
    l: Math.min(x1, x2) - pad,
    r: Math.max(x1, x2) + pad,
    t: Math.min(y1, y2) - pad,
    b: Math.max(y1, y2) + pad,
  };
}
