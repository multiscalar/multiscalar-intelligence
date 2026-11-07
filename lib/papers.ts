import { evalsSoon } from "@/lib/launch";
import { listResultSlugs, loadResult } from "@/lib/results";

// Every paper we publish, for /open-science/papers/. To add one, append to
// PAPERS below; the Erdős result papers are added automatically from
// content/results/.
export interface Paper {
  title: string;
  authors: string;
  /** Section the paper is listed under. */
  area: string;
  /** "March 2026", or empty. */
  date?: string;
  /** "Solved", "Proposed"… shown as a badge. */
  status?: string;
  /** Where the title links: the paper's page or abstract. */
  href: string;
  links: { label: string; href: string }[];
}

const PAPERS: Paper[] = [
  {
    title: "Profit is the Red Team: Stress-Testing Agents in Strategic Economic Interactions",
    authors: "Shouqiao Wang, Marcello Politi, Samuele Marro, Davide Crapis",
    area: "Economic intelligence",
    date: "March 2026",
    href: "https://arxiv.org/abs/2603.20925",
    links: [
      { label: "arXiv", href: "https://arxiv.org/abs/2603.20925" },
      { label: "PDF", href: "https://arxiv.org/pdf/2603.20925" },
      { label: "ZeroSum-Bench", href: "/evals/zerosum-bench/" },
    ].filter((l) => !evalsSoon(l.href)),
  },
];

// Files a result page links to, under shorter names; anything else is left out.
const RESULT_LINKS: Record<string, string> = {
  PDF: "PDF",
  "LaTeX source": "LaTeX",
  "Lean formalisation": "Lean",
  "Verifier code": "Verifier",
};

function resultPapers(): Paper[] {
  return listResultSlugs()
    .map((slug) => {
      const { meta } = loadResult(slug);
      return {
        title: meta.title,
        authors: "Multiscalar Intelligence",
        area: "Mathematics",
        status: meta.badge,
        href: `/results/${slug}/`,
        links: meta.links
          .filter(([label]) => RESULT_LINKS[label])
          .map(([label, href]) => ({
            label: RESULT_LINKS[label],
            href: href.startsWith("http") ? href : `/results/${slug}/${href}`,
          })),
      };
    })
    // Solved results first.
    .sort((a, b) => Number(b.status === "Solved") - Number(a.status === "Solved"));
}

/** Papers grouped by area, in the order the areas first appear. */
export function papersByArea(): { area: string; papers: Paper[] }[] {
  const all = [...PAPERS, ...resultPapers()];
  const areas = [...new Set(all.map((p) => p.area))];
  return areas.map((area) => ({ area, papers: all.filter((p) => p.area === area) }));
}
