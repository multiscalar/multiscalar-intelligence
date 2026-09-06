import type { BenchData, BenchModel } from "./types";

export interface Row {
  model: BenchModel;
  value: number;
}

// Exploitability: delta extracted surplus as % of the game's feasible surplus;
// "overall" is the unweighted mean across the four games.
export function exploitScore(
  model: BenchModel,
  metric: string,
  games: NonNullable<BenchData["games"]>
): number {
  const norm = (g: string) =>
    (model.deltaSurplus![g] / games[g].feasibleSurplus) * 100;
  if (metric === "overall") {
    const keys = Object.keys(games);
    return keys.reduce((s, g) => s + norm(g), 0) / keys.length;
  }
  return norm(metric);
}

export function scoredModels(d: BenchData, metric: string): Row[] {
  const higherIsBetter =
    d.metrics.find((m) => m.id === metric)!.higherIsBetter !== false;
  const rows = d.models.map((m) => ({
    model: m,
    value:
      d.bench === "exploitability"
        ? exploitScore(m, metric, d.games!)
        : m.scores[metric],
  }));
  // Explicit tiebreak by name: two models with equal scores must not swap places
  // between renders or regenerations.
  rows.sort((a, b) => {
    const diff = higherIsBetter ? b.value - a.value : a.value - b.value;
    return diff !== 0 ? diff : a.model.name.localeCompare(b.model.name);
  });
  return rows;
}

export function fmt(value: number, unit?: string): string {
  if (typeof value !== "number" || !isFinite(value)) return "n/a";
  if (unit === "$") {
    const abs = Math.abs(Math.round(value)).toLocaleString("en-US");
    return (value < 0 ? "−$" : "$") + abs;
  }
  return value.toFixed(value >= 100 ? 0 : 1) + "%";
}
