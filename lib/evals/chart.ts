// Small helpers shared by the hand-built charts.

/** Round, evenly spaced ticks spanning [min, max]: the first tick is at or
 *  below min and the last at or above max. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) return [min];
  const raw = (max - min) / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step =
    [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
  const out: number[] = [];
  const last = Math.ceil(max / step - 1e-9) * step;
  for (let t = Math.floor(min / step + 1e-9) * step; t <= last + step * 1e-9; t += step) {
    out.push(Math.abs(t) < step * 1e-9 ? 0 : Math.round(t * 1e6) / 1e6);
  }
  return out;
}

/** Compact axis label: $12k, −$4.5k, 40%. */
export function fmtTick(v: number, unit?: string): string {
  if (unit === "%") return `${Math.round(v)}%`;
  const abs = Math.abs(v);
  const body =
    abs >= 1000
      ? `${(abs / 1000).toFixed(abs % 1000 === 0 ? 0 : 1)}k`
      : abs.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return `${v < 0 ? "−" : ""}${unit === "$" ? "$" : ""}${body}`;
}

/** Round a computed coordinate so server and client render identical
 *  strings (Math.log10 and friends can differ in the last digit). */
export const r3 = (v: number) => Math.round(v * 1000) / 1000;
