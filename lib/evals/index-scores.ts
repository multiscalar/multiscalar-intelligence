import data from "@/data/evals/index.json";
import { CAPABILITIES } from "./eii";
import { withExampleScores, type IndexScores } from "./examples";

// The Economic Intelligence Index scores the preview and the evals page show:
// eii-prod rescored under the C1-C5 dimension design
// (tools/export_eii_cards.py writes data/evals/index.json), with each model's
// inference cost for the run and its release date (OpenRouter's catalog).

export const INDEX_SNAPSHOT = data.snapshot;

// The radar draws CAPABILITIES in order: the data must list them the same way.
data.dimensions.forEach((d, i) => {
  if (d.code !== CAPABILITIES[i]?.code) {
    throw new Error(`index.json dimension ${i} is ${d.code}, expected ${CAPABILITIES[i]?.code}`);
  }
});

const byName = new Map(data.models.map((m) => [m.name, m]));

// Roster models with their index scores (0-1, as the charts draw them);
// models the index run didn't score are left out.
export function withIndexScores<T extends { name: string }>(
  roster: T[],
): (T & IndexScores)[] {
  return withExampleScores(roster)
    .filter((m) => byName.has(m.name))
    .map((m) => {
      const s = byName.get(m.name)!;
      return {
        ...m,
        dims: s.dimensions.map((v) => v / 100),
        overall: s.overall / 100,
        cost: s.cost_usd,
      };
    });
}

// A model's release date, as ms since the epoch (the progress chart's x).
export function releaseDate(name: string): number {
  const m = byName.get(name);
  if (!m) throw new Error(`${name} is not in the index run`);
  return Date.parse(m.released);
}
