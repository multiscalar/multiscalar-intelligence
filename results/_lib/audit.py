"""
Audit a built result page against the PDF it was generated from.

    python3 _lib/audit.py erdos-390 [...]        # one or more slugs
    python3 _lib/audit.py --all

The page is loaded in headless Chrome so KaTeX actually runs.  A temporary copy
of the page carries one extra script that walks the rendered DOM and reports the
structures we care about as JSON; the real page keeps no audit code.  Everything
is then compared against `pdftotext paper.pdf`.  Checks, in order of how much
they would embarrass us if they failed:

  1. KaTeX rendered every formula, and no formula is still raw TeX.
  2. Every theorem-like heading on the page ("Lemma 4.7") appears in the PDF.
  3. Every equation number on the page appears in the PDF.
  4. Every section heading appears in the PDF.
  5. The prose matches: each paragraph's non-math text is found in the PDF.
  6. Every bibliography entry is present.
  7. Every table cell is present.
  8. No internal link points at a missing anchor, and no pandoc residue
     (`[eq:key]`, unresolved citations, literal `\\Cref`) survived.

Exit status is non-zero if any check fails.
"""

from __future__ import annotations

import html
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

HERE = Path(__file__).resolve().parent
RESULTS = HERE.parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

LIGATURES = {"ﬁ": "fi", "ﬂ": "fl", "ﬀ": "ff", "ﬃ": "ffi", "ﬄ": "ffl", "ﬅ": "st"}

# Injected into a throwaway copy of the page. It cannot simply listen for
# DOMContentLoaded: render-math.js is `defer`red, so its listener registers after
# this inline script's would, and would run second. Instead we poll until the
# rendered-formula count stops growing.
EXTRACT_JS = r"""
<pre id="audit-json" hidden></pre>
<script>
(function waitForMath(last, still) {
  var n = document.querySelectorAll("span.math .katex, span.math .katex-display").length;
  if (n === 0 || n !== last) { return setTimeout(function () { waitForMath(n, 0); }, 150); }
  if (still < 3) { return setTimeout(function () { waitForMath(n, still + 1); }, 150); }
  var article = document.querySelector("article.paper");
  var text = function (node) {
    var c = node.cloneNode(true);
    c.querySelectorAll("span.math, .katex, .katex-display").forEach(function (m) {
      m.replaceWith(document.createTextNode(" @@MATH@@ "));
    });
    return c.textContent.replace(/\s+/g, " ").trim();
  };
  var out = {
    katexFailures: (window.__katexFailures || []).map(function (f) {
      return { message: f.message, tex: f.tex };
    }),
    rendered: document.querySelectorAll("span.math .katex, span.math .katex-display").length,
    unrendered: Array.from(document.querySelectorAll("span.math")).filter(function (s) {
      return !s.querySelector(".katex, .katex-display");
    }).length,
    tags: Array.from(document.querySelectorAll("article.paper .tag")).map(function (t) {
      return t.textContent.trim();
    }),
    headings: Array.from(article.querySelectorAll("h1, h2, h3")).map(text),
    theoremHeads: Array.from(article.querySelectorAll("p > strong, p > em")).map(function (e) {
      return e.textContent.replace(/\s+/g, " ").trim();
    }),
    paragraphs: Array.from(article.querySelectorAll("p")).filter(function (p) {
      return !p.closest(".references-section");
    }).map(text),
    references: Array.from(document.querySelectorAll(".references-section li")).map(function (li) {
      var c = li.cloneNode(true);
      var n = c.querySelector(".ref-num");
      if (n) n.remove();
      return text(c);
    }),
    refTags: Array.from(document.querySelectorAll(".references-section .ref-num")).map(function (n) {
      return n.textContent.trim();
    }),
    cells: Array.from(article.querySelectorAll("td, th")).map(text),
    citations: Array.from(article.querySelectorAll("a.cite")).map(function (a) {
      return a.textContent.trim();
    }),
    deadLinks: Array.from(document.querySelectorAll('a[href^="#"]')).map(function (a) {
      return a.getAttribute("href").slice(1);
    }).filter(function (id) {
      return id && !document.getElementById(id) && !document.querySelector('[id="' + id + '"]');
    }),
    residue: article.innerHTML.match(/\[eq:[^\]]+\]|data-cites=|\\Cref\{|\\cref\{|\[\?/g) || []
  };
  document.getElementById("audit-json").textContent = JSON.stringify(out);
})(-1, 0);
</script>
"""


def normalise(s: str) -> str:
    """Collapse a string to what both renderers must agree on: letters and
    digits, with typography, ligatures and line-break hyphenation removed."""
    for k, v in LIGATURES.items():
        s = s.replace(k, v)
    s = unicodedata.normalize("NFKD", s)
    s = s.replace("-\n", "")  # pdftotext hyphenates across line breaks
    s = re.sub(r"[^0-9A-Za-z]+", "", s)
    return s.lower()


# pdftotext has to guess a reading order, and a display equation sitting inside
# a sentence makes it guess differently in each mode: the default flows by
# column, -layout preserves the visual grid, -raw follows the content stream.
# Taking all three means "is this text in the PDF" never hinges on that guess.
PDFTOTEXT_MODES = ([], ["-layout"], ["-raw"])


def pdf_text(pdf: Path, mode: list[str] | None = None) -> str:
    out = subprocess.run(
        ["pdftotext", "-nopgbrk", *(mode or []), str(pdf), "-"],
        capture_output=True,
        text=True,
    )
    if out.returncode != 0:
        raise SystemExit(f"pdftotext failed on {pdf}: {out.stderr}")
    return out.stdout


def pdf_texts(pdf: Path) -> list[str]:
    return [pdf_text(pdf, mode) for mode in PDFTOTEXT_MODES]


def drop_page_numbers(text: str) -> str:
    """Remove the footer page numbers.  They sit on their own line and would
    otherwise appear mid-sentence in any paragraph that spans a page break,
    making a perfectly correct paragraph look like a mismatch."""
    return "\n".join(
        line for line in text.split("\n") if not re.fullmatch(r"\s*\d{1,4}\s*", line)
    )


def extract(page: Path) -> dict:
    """Render `page` in headless Chrome and read the audit JSON back out."""
    source = page.read_text(encoding="utf-8")
    probe = page.with_name(".audit-" + page.name)
    probe.write_text(source.replace("</body>", EXTRACT_JS + "</body>"), encoding="utf-8")
    try:
        out = subprocess.run(
            [
                CHROME,
                "--headless",
                "--disable-gpu",
                "--no-sandbox",
                "--virtual-time-budget=60000",
                "--dump-dom",
                probe.resolve().as_uri(),
            ],
            capture_output=True,
            text=True,
        )
    finally:
        probe.unlink(missing_ok=True)
    m = re.search(r'<pre id="audit-json" hidden="">(.*?)</pre>', out.stdout, re.DOTALL)
    if not m:
        raise SystemExit(
            f"audit probe produced no JSON for {page}\n{out.stderr[:600]}"
        )
    return json.loads(html.unescape(m.group(1)))


THEOREM_HEAD = re.compile(
    r"^(Theorem|Lemma|Proposition|Corollary|Claim|Definition|Remark|Certificate)"
    r"\s+((?:\d+|[A-Z])\.\d+)$"
)
# KaTeX puts every row tag of an `align` inside a single .tag element, so its
# text reads "(6.1)(6.2)"; and it appends a zero-width space.
EQ_TAG = re.compile(r"\((\d+\.\d+|[A-Z]\.\d+)\)")


def normalise_words(s: str, join_hyphens: bool = True) -> list[str]:
    """Word list for shingling.

    A hyphen at a line end is ambiguous in extracted PDF text: it is either
    LaTeX breaking a long word ("de-\nleted" -> "deleted") or a compound the
    author wrote ("finite-\nprime" -> "finite", "prime").  Both readings are
    generated and the shingle set is the union, so neither costs us a false
    mismatch.
    """
    for k, v in LIGATURES.items():
        s = s.replace(k, v)
    s = unicodedata.normalize("NFKD", s)
    if join_hyphens:
        s = re.sub(r"-\s*\n\s*", "", s)
    return [w for w in re.split(r"[^0-9A-Za-z]+", s.lower()) if w]


class Audit:
    MIN_PROSE = 40  # characters of normalised text worth fingerprinting
    SHINGLE = 6  # words per prose fingerprint
    PROSE_TOLERANCE = 0.0  # with all three extraction modes, expect an exact match

    def __init__(self, slug: str):
        self.slug = slug
        self.dir = RESULTS / slug
        self.failures: list[str] = []
        self.notes: list[str] = []
        self.d = extract(self.dir / "index.html")
        report = self.dir / "build-report.json"
        # erdos-690 predates this pipeline and has no report; its page is still
        # audited against its PDF, just without the build cross-check.
        self.report = (
            json.loads(report.read_text(encoding="utf-8")) if report.exists() else None
        )
        variants = pdf_texts(self.dir / "paper.pdf")
        self.pdf_raw = variants[0]
        self.pdf = "\n".join(normalise(drop_page_numbers(v)) for v in variants)
        self.pdf_shingles = set()
        for v in variants:
            for join in (True, False):
                words = normalise_words(drop_page_numbers(v), join_hyphens=join)
                self.pdf_shingles |= {
                    tuple(words[i : i + self.SHINGLE])
                    for i in range(max(0, len(words) - self.SHINGLE + 1))
                }

    def fail(self, msg: str) -> None:
        self.failures.append(msg)

    def in_pdf(self, s: str) -> bool:
        """Is every non-formula stretch of `s` present in the PDF text?

        Split on the math sentinel first: a heading or a reference with a
        formula in it is contiguous on neither side of the comparison.  A
        stretch shorter than three characters is punctuation left over from the
        split, not evidence of anything.
        """
        pieces = [normalise(p) for p in s.split("@@MATH@@")]
        pieces = [p for p in pieces if len(p) > 2]
        if not pieces:
            return True
        return all(p in self.pdf for p in pieces)

    # -- 1 ------------------------------------------------------------------
    def check_katex(self) -> None:
        fails = self.d["katexFailures"]
        if fails:
            self.fail(
                f"KaTeX failed on {len(fails)} formula(s); first: "
                f"{fails[0]['message'][:120]} in {fails[0]['tex'][:80]!r}"
            )
        if self.d["unrendered"]:
            self.fail(f"{self.d['unrendered']} math span(s) are still raw TeX")
        self.notes.append(f"{self.d['rendered']} formulas rendered by KaTeX")

    # -- 2 ------------------------------------------------------------------
    def check_theorems(self) -> None:
        heads = [h for h in self.d["theoremHeads"] if THEOREM_HEAD.match(h)]
        planned = self.report["theorems"] if self.report else sorted(heads)
        if sorted(heads) != sorted(planned):
            self.fail(
                f"page shows {len(heads)} theorem headings, the build wrote "
                f"{len(planned)}; "
                f"only on the page: {sorted(set(heads) - set(planned))[:5]}; "
                f"only in the build: {sorted(set(planned) - set(heads))[:5]}"
            )
        missing = sorted({h for h in heads if not self.in_pdf(h)})
        if missing:
            self.fail(
                f"{len(missing)} theorem heading(s) absent from the PDF: "
                + ", ".join(missing[:8])
            )
        self.notes.append(f"{len(heads)} theorem headings cross-checked")

    # -- 3 ------------------------------------------------------------------
    def check_equations(self) -> None:
        rendered: list[str] = []
        for t in self.d["tags"]:
            rendered += EQ_TAG.findall(t)
        if not rendered:
            self.fail("no equation numbers rendered on the page")
            return
        planned = self.report["equations"] if self.report else sorted(rendered)
        if sorted(rendered) != sorted(planned):
            only_page = sorted(set(rendered) - set(planned))
            only_plan = sorted(set(planned) - set(rendered))
            self.fail(
                f"page shows {len(rendered)} equation numbers, the build wrote "
                f"{len(planned)}"
                + (f"; only on the page: {', '.join(only_page[:6])}" if only_page else "")
                + (f"; only in the build: {', '.join(only_plan[:6])}" if only_plan else "")
            )
        pdf_tags = set(EQ_TAG.findall(self.pdf_raw))
        missing = sorted(set(rendered) - pdf_tags)
        if missing:
            self.fail(
                f"{len(missing)} equation number(s) not in the PDF: "
                + ", ".join(missing[:10])
            )
        self.notes.append(
            f"{len(rendered)} equation numbers rendered, all matching the build "
            f"and present in the PDF"
        )

    # -- 4 ------------------------------------------------------------------
    def check_sections(self) -> None:
        heads = [h for h in self.d["headings"] if normalise(h)]
        missing = [h for h in heads if not self.in_pdf(re.sub(r"^[\dA-Z.]+\s+", "", h))]
        if missing:
            self.fail(
                f"{len(missing)} heading(s) not found in the PDF: " + " | ".join(missing[:5])
            )
        self.notes.append(f"{len(heads)} headings cross-checked")

    # -- 5 ------------------------------------------------------------------
    def check_prose(self) -> None:
        """Compare word shingles rather than whole runs.

        pdftotext emits a page in vertical reading order, so a display equation
        sitting mid-sentence splits that sentence in the extracted text even
        though the HTML has it contiguous.  Requiring contiguity therefore
        reports false mismatches.  Six-word shingles tolerate that (only the
        shingles straddling the split are lost) while still catching text that
        is genuinely missing or garbled, which loses shingles in bulk.
        """
        total = misses = 0
        worst: list[tuple[float, str]] = []
        for para in self.d["paragraphs"]:
            runs = para.split("@@MATH@@")
            for i, run in enumerate(runs):
                words = normalise_words(run)
                # A word touching a formula fuses with it in the extracted PDF
                # text ("$i$-th" comes out as "ith"), so drop the words on a
                # math boundary rather than chase a phantom mismatch.
                if i > 0:
                    words = words[1:]
                if i < len(runs) - 1:
                    words = words[:-1]
                if len(words) < self.SHINGLE:
                    if words and not self.in_pdf(run):
                        misses += 1
                        total += 1
                    else:
                        total += 1 if words else 0
                    continue
                shingles = [
                    tuple(words[i : i + self.SHINGLE])
                    for i in range(len(words) - self.SHINGLE + 1)
                ]
                bad = [sh for sh in shingles if sh not in self.pdf_shingles]
                total += len(shingles)
                misses += len(bad)
                if bad:
                    worst.append((len(bad) / len(shingles), " ".join(bad[0])))
        rate = misses / total if total else 0.0
        worst.sort(reverse=True)
        if rate > self.PROSE_TOLERANCE or any(r > 0.5 for r, _ in worst):
            self.fail(
                f"prose mismatch: {misses} of {total} word shingles "
                f"({rate:.2%}) absent from the PDF; worst runs: "
                + " || ".join(t for _, t in worst[:3])
            )
        self.notes.append(
            f"{total} prose shingles cross-checked, {misses} unmatched ({rate:.2%})"
        )

    # -- 6 ------------------------------------------------------------------
    def check_bibliography(self) -> None:
        refs = self.d["references"]
        if not refs:
            self.fail("no bibliography entries on the page")
            return
        bad = [r[:70] for r in refs if not self.in_pdf(r[:70])]
        if bad:
            self.fail(f"{len(bad)} reference(s) not in the PDF: " + " || ".join(bad[:3]))
        cited = set(self.d["citations"])
        tags = {t.strip("[]") for t in self.d["refTags"]}
        # A citation may carry a locator ("[7, p. 48]") or several keys
        # ("[1, 2]"); every leading token must name a real entry.
        orphan = sorted(c for c in cited if c.strip("[]").split(",")[0].strip() not in tags)
        if orphan:
            self.fail(f"citation(s) with no matching entry: {', '.join(orphan[:6])}")
        self.notes.append(
            f"{len(refs)} references and {len(cited)} distinct citation labels cross-checked"
        )

    # -- 7 ------------------------------------------------------------------
    def check_tables(self) -> None:
        cells = [c.strip() for c in self.d["cells"]]
        cells = [c for c in cells if normalise(c)]
        if not cells:
            self.notes.append("no table text on this page")
            return
        bad = [c for c in cells if not self.in_pdf(c)]
        if bad:
            self.fail(
                f"{len(bad)} of {len(cells)} table cells not in the PDF: "
                + ", ".join(bad[:5])
            )
        self.notes.append(f"{len(cells)} table cells cross-checked")

    # -- 8 ------------------------------------------------------------------
    def check_links_and_residue(self) -> None:
        dead = sorted(set(self.d["deadLinks"]))
        if dead:
            self.fail(
                f"{len(dead)} internal link(s) point at a missing anchor: "
                + ", ".join(dead[:8])
            )
        if self.d["residue"]:
            counts: dict[str, int] = {}
            for r in self.d["residue"]:
                counts[r] = counts.get(r, 0) + 1
            self.fail("pandoc residue on the page: " + ", ".join(f"{k} x{v}" for k, v in counts.items()))

    def run(self) -> bool:
        for check in (
            self.check_katex,
            self.check_theorems,
            self.check_equations,
            self.check_sections,
            self.check_prose,
            self.check_bibliography,
            self.check_tables,
            self.check_links_and_residue,
        ):
            check()
        ok = not self.failures
        print(f"{'PASS' if ok else 'FAIL'}  {self.slug}")
        for n in self.notes:
            print(f"        · {n}")
        for f in self.failures:
            print(f"      ✗ {f}")
        return ok


def main(argv: list[str]) -> int:
    slugs = argv[1:]
    if not slugs or slugs == ["--all"]:
        slugs = sorted(
            p.name for p in RESULTS.iterdir() if p.is_dir() and (p / "paper.pdf").exists()
        )
    ok = True
    for slug in slugs:
        ok &= Audit(slug).run()
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
