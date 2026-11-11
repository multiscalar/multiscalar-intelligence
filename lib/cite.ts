// BibTeX for a page on this site (the index, a benchmark leaderboard). Kept
// out of components/evals/CiteBlock.tsx, a client module, so server pages
// can call it.
export function bibtexFor({
  key,
  title,
  snapshot,
  path,
  note,
}: {
  key: string;
  title: string;
  /** ISO date of the release or run the page shows. */
  snapshot: string;
  path: string;
  note: string;
}) {
  return [
    `@misc{${key},`,
    `  title  = {${title}},`,
    `  author = {{Multiscalar Intelligence}},`,
    `  year   = {${snapshot.slice(0, 4)}},`,
    `  note   = {${note}},`,
    `  url    = {https://multiscalar.ai${path}}`,
    `}`,
  ].join("\n");
}
