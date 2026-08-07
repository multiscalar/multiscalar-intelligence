"""
Build the HTML article page for erdos-690 from the LaTeX source.

Runs pandoc once, then post-processes the body to:
  - resolve \\cite{} keys against the inline thebibliography
  - replace the broken tabularx block with a real HTML table
  - number bibliography entries

The output index.html embeds the body inside a hand-written shell that
matches the multiscalar-intelligence site style and loads KaTeX.
"""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
TEX_PATH = Path(
    "/Users/marcellopoliti/Coding/multiscalar/repositories/infra/results/erdos-690/erdos#690.tex"
)
OUT_HTML = HERE / "index.html"
TEMPLATE = HERE / "_template.html"


def run_pandoc(tex: Path) -> str:
    result = subprocess.run(
        [
            "pandoc",
            str(tex),
            "--katex",
            "--section-divs",
            "--number-sections",
            "-t",
            "html5",
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout


def extract_bib_order(tex_source: str) -> list[str]:
    return re.findall(r"\\bibitem\{([^}]+)\}", tex_source)


def fix_citations(html: str, bib_order: list[str]) -> str:
    key_to_num = {k: i + 1 for i, k in enumerate(bib_order)}

    def replace_cite(match: re.Match[str]) -> str:
        keys = match.group(1).split()
        parts = []
        for k in keys:
            n = key_to_num.get(k)
            if n is None:
                parts.append(f"?{k}")
            else:
                parts.append(f'<a href="#ref-{n}" class="cite">[{n}]</a>')
        return ", ".join(parts)

    html = re.sub(
        r'<span class="citation"\s+data-cites="([^"]+)"\s*></span>',
        replace_cite,
        html,
    )
    html = re.sub(
        r'<span\s+class="citation"\s+data-cites="([^"]+)">\s*</span>',
        replace_cite,
        html,
    )
    return html


def number_bibliography(html: str) -> str:
    """Renumber bibliography entries and lift the block out of the appendix
    section it ended up inside (because in the .tex it lives after the
    \\appendix marker).  We emit a proper top-level <section>."""
    bib_match = re.search(
        r'<div class="thebibliography">(.*?)</div>',
        html,
        flags=re.DOTALL,
    )
    if not bib_match:
        return html
    inner = bib_match.group(1)
    inner = re.sub(r"<p><span>99</span></p>\s*", "", inner)
    entries = re.findall(r"<p>(.*?)</p>", inner, flags=re.DOTALL)
    rebuilt_items = []
    for i, entry in enumerate(entries, start=1):
        rebuilt_items.append(
            f'<li id="ref-{i}"><span class="ref-num">[{i}]</span><span class="ref-body">{entry.strip()}</span></li>'
        )
    rebuilt_block = (
        '<section class="references-section" id="references">'
        '<h2 class="references-heading">References</h2>'
        '<ol class="bib-list">'
        + "".join(rebuilt_items)
        + "</ol></section>"
    )

    # Remove the original bibliography div from wherever pandoc placed it.
    html = html[: bib_match.start()] + html[bib_match.end() :]

    # Pandoc wrapped the (now-empty-tail of the) appendix section. Close that
    # section before our new top-level references block so they aren't nested.
    # Find the appendix section opening and its matching close, then move the
    # closing </section> tag to come *before* the references block.
    appendix_open = html.find('<section id="app:verification"')
    if appendix_open == -1:
        # No appendix; just append references at the end.
        return html.replace("</article>", rebuilt_block + "</article>", 1)

    # Find the last </section> tag in the document (which closes the appendix).
    last_close = html.rfind("</section>")
    if last_close == -1:
        return html + rebuilt_block

    # Insert references block right after the appendix's </section>.
    insertion = last_close + len("</section>")
    return html[:insertion] + rebuilt_block + html[insertion:]


SMALL_CASES_TABLE = """
<figure class="result-table">
  <table>
    <caption>Table 1. Exact certificates for the small cases. The first displayed gap in each row gives a strict descent, and the second, later gap gives a strict ascent.</caption>
    <thead>
      <tr><th>$r$</th><th>Descent certificate</th><th>Later ascent certificate</th></tr>
    </thead>
    <tbody>
      <tr><td>3</td><td>$13\\to17$, $g=4$: $R_3(13^-)<3.506<5$</td><td>$17\\to19$, $g=2$: $R_3(17^-)>3.048>3$</td></tr>
      <tr><td>4</td><td>$23\\to29$, $g=6$: $R_4(23^-)<4.759<7$</td><td>$29\\to31$, $g=2$: $R_4(29^-)>4.371>3$</td></tr>
      <tr><td>5</td><td>$31\\to37$, $g=6$: $R_5(31^-)<6.748<7$</td><td>$37\\to41$, $g=4$: $R_5(37^-)>6.263>5$</td></tr>
      <tr><td>6</td><td>$73\\to79$, $g=6$: $R_6(73^-)<6.437<7$</td><td>$79\\to83$, $g=4$: $R_6(79^-)>6.282>5$</td></tr>
      <tr><td>7</td><td>$89\\to97$, $g=8$: $R_7(89^-)<8.085<9$</td><td>$97\\to101$, $g=4$: $R_7(97^-)>7.911>5$</td></tr>
      <tr><td>8</td><td>$113\\to127$, $g=14$: $R_8(113^-)<9.303<15$</td><td>$127\\to131$, $g=4$: $R_8(127^-)>9.145>5$</td></tr>
      <tr><td>9</td><td>$113\\to127$, $g=14$: $R_9(113^-)<11.677<15$</td><td>$127\\to131$, $g=4$: $R_9(127^-)>11.452>5$</td></tr>
      <tr><td>10</td><td>$113\\to127$, $g=14$: $R_{10}(113^-)<14.414<15$</td><td>$127\\to131$, $g=4$: $R_{10}(127^-)>14.101>5$</td></tr>
      <tr><td>11</td><td>$293\\to307$, $g=14$: $R_{11}(293^-)<12.085<15$</td><td>$307\\to311$, $g=4$: $R_{11}(307^-)>12.011>5$</td></tr>
      <tr><td>12</td><td>$293\\to307$, $g=14$: $R_{12}(293^-)<14.050<15$</td><td>$307\\to311$, $g=4$: $R_{12}(307^-)>13.959>5$</td></tr>
      <tr><td>13</td><td>$523\\to541$, $g=18$: $R_{13}(523^-)<13.651<19$</td><td>$541\\to547$, $g=6$: $R_{13}(541^-)>13.607>7$</td></tr>
      <tr><td>14</td><td>$523\\to541$, $g=18$: $R_{14}(523^-)<15.415<19$</td><td>$541\\to547$, $g=6$: $R_{14}(541^-)>15.364>7$</td></tr>
      <tr><td>15</td><td>$523\\to541$, $g=18$: $R_{15}(523^-)<17.279<19$</td><td>$541\\to547$, $g=6$: $R_{15}(541^-)>17.218>7$</td></tr>
      <tr><td>16</td><td>$887\\to907$, $g=20$: $R_{16}(887^-)<16.752<21$</td><td>$907\\to911$, $g=4$: $R_{16}(907^-)>16.721>5$</td></tr>
      <tr><td>17</td><td>$887\\to907$, $g=20$: $R_{17}(887^-)<18.438<21$</td><td>$907\\to911$, $g=4$: $R_{17}(907^-)>18.402>5$</td></tr>
      <tr><td>18</td><td>$887\\to907$, $g=20$: $R_{18}(887^-)<20.191<21$</td><td>$907\\to911$, $g=4$: $R_{18}(907^-)>20.151>5$</td></tr>
      <tr><td>19</td><td>$1129\\to1151$, $g=22$: $R_{19}(1129^-)<20.742<23$</td><td>$1151\\to1153$, $g=2$: $R_{19}(1151^-)>20.711>3$</td></tr>
    </tbody>
  </table>
</figure>
"""


def replace_table(html: str) -> str:
    html = re.sub(
        r'<div class="tabularx">.*?</div>',
        SMALL_CASES_TABLE,
        html,
        count=1,
        flags=re.DOTALL,
    )
    # The source writes "Table~\ref{tab:smallcases}", so the link text is the
    # bare number: emitting "Table 1" here would print "Table Table 1".
    html = re.sub(
        r'<a\s+href="#tab:smallcases"[^>]*>\s*(?:\[tab:smallcases\]|tab:smallcases)\s*</a>',
        '<a href="#tab-smallcases">1</a>',
        html,
    )
    html = re.sub(
        r'\[<a\s+href="#tab:smallcases"[^>]*>\s*tab:smallcases\s*</a>\]',
        '<a href="#tab-smallcases">1</a>',
        html,
    )
    html = re.sub(
        r'(<figure class="result-table">)',
        r'<figure id="tab-smallcases" class="result-table">',
        html,
        count=1,
    )
    return html


THEOREM_KINDS = ("Theorem", "Lemma", "Proposition", "Corollary", "Certificate", "Remark")


def parse_numbering(tex_source: str) -> dict[str, str]:
    """Walk the .tex source and assign section-relative numbers to every
    labeled theorem-like environment and labeled displayed equation,
    matching the LaTeX preamble's [section] counters.

    Returns a dict: label -> "N.M" (e.g. "thm:main" -> "1.1").
    """
    events: list[tuple[int, str, str | None]] = []
    for m in re.finditer(r"\\section\{", tex_source):
        events.append((m.start(), "section", None))
    for m in re.finditer(r"\\appendix\b", tex_source):
        events.append((m.start(), "appendix", None))
    for m in re.finditer(
        r"\\begin\{(theorem|lemma|proposition|corollary|certificate|remark)\}",
        tex_source,
    ):
        tail = tex_source[m.end() : m.end() + 250]
        lm = re.search(r"\\label\{([^}]+)\}", tail)
        if lm and "\\begin" not in tail[: lm.start()]:
            events.append((m.start(), "thm", lm.group(1)))
    for m in re.finditer(r"\\begin\{equation\}", tex_source):
        tail = tex_source[m.end() : m.end() + 250]
        lm = re.search(r"\\label\{([^}]+)\}", tail)
        if lm and "\\end" not in tail[: lm.start()]:
            events.append((m.start(), "eq", lm.group(1)))
    events.sort()

    labels: dict[str, str] = {}
    section_num = 0
    in_appendix = False
    current: str | None = None
    thm_ct = 0
    eq_ct = 0
    for _, kind, arg in events:
        if kind == "appendix":
            in_appendix = True
        elif kind == "section":
            if in_appendix:
                current = "A"
            else:
                section_num += 1
                current = str(section_num)
            thm_ct = 0
            eq_ct = 0
        elif kind == "thm" and current is not None and arg is not None:
            thm_ct += 1
            labels[arg] = f"{current}.{thm_ct}"
        elif kind == "eq" and current is not None and arg is not None:
            eq_ct += 1
            labels[arg] = f"{current}.{eq_ct}"
    return labels


def apply_numbering(html: str, labels: dict[str, str]) -> str:
    """Replace pandoc's global counters with section-relative numbers, fix
    \\eqref placeholders, and tag each displayed equation with its number."""

    # 1. Rewrite the displayed label of each theorem-like block.
    for key, number in labels.items():
        if key.startswith("eq:"):
            continue
        kinds = "|".join(THEOREM_KINDS)
        pattern = (
            r'(<div\s+id="' + re.escape(key) + r'"[^>]*>\s*<p>\s*<strong>'
            r"(?:" + kinds + r"))\s+\d+(</strong>)"
        )
        html = re.sub(
            pattern,
            lambda m, n=number: f"{m.group(1)} {n}{m.group(2)}",
            html,
        )

    # 2. Cross-references to theorem-like blocks: rewrite the displayed number.
    def fix_ref(m: re.Match[str]) -> str:
        key = m.group(1)
        if key in labels:
            return (
                f'<a href="#{key}" class="xref" data-reference-type="ref" '
                f'data-reference="{key}">{labels[key]}</a>'
            )
        return m.group(0)

    html = re.sub(
        r'<a\s+href="#([^"]+)"[^>]*data-reference-type="ref"[^>]*>[^<]*</a>',
        fix_ref,
        html,
    )

    # 3. \eqref{...} references: pandoc emits [eq:KEY] as the link text.
    def fix_eqref(m: re.Match[str]) -> str:
        key = m.group(1)
        if key in labels:
            return (
                f'<a href="#{key}" class="eq-ref" data-reference-type="eqref" '
                f'data-reference="{key}">({labels[key]})</a>'
            )
        return m.group(0)

    html = re.sub(
        r'<a\s+href="#([^"]+)"[^>]*data-reference-type="eqref"[^>]*>\[[^\]]+\]</a>',
        fix_eqref,
        html,
    )

    # 4. Add the equation number on the right (\tag) and an anchor id on the
    #    enclosing <span>, so #eq:KEY scrolls to the equation.
    def fix_eq_block(m: re.Match[str]) -> str:
        prefix, key, suffix = m.group(1), m.group(2), m.group(3)
        if key not in labels:
            return m.group(0)
        return (
            f'<span id="{key}" class="math display">{prefix}\\tag{{{labels[key]}}}{suffix}'
        )

    html = re.sub(
        r'<span\s+class="math display">(\s*\\begin\{equation\}\s*)\\label\{(eq:[^}]+)\}(\s*)',
        fix_eq_block,
        html,
    )

    return html


def strip_personal_acknowledgement(html: str) -> str:
    """Remove the paragraph thanking Samuele Marro and Marcello Politi.
    Matched by the opening phrase so minor wording changes upstream still
    drop the whole paragraph."""
    return re.sub(
        r"<p>\s*We thank Samuele Marro.*?</p>\s*",
        "",
        html,
        count=1,
        flags=re.DOTALL,
    )


def relabel_appendix(html: str) -> str:
    """Pandoc numbers the appendix as section 8; the paper calls it "Appendix A"."""
    html = re.sub(
        r'(<section id="app:verification"[^>]*data-number=")8(")',
        r"\1A\2",
        html,
    )
    html = re.sub(
        r'(<h1 data-number=")8(">\s*<span class="header-section-number">)8(</span>)',
        r"\1A\2A\3",
        html,
    )
    html = re.sub(
        r'(href="#app:verification"[^>]*>)8(</a>)',
        r"\1A\2",
        html,
    )
    return html


def main() -> None:
    tex_source = TEX_PATH.read_text(encoding="utf-8")
    bib_order = extract_bib_order(tex_source)
    labels = parse_numbering(tex_source)
    body = run_pandoc(TEX_PATH)
    body = fix_citations(body, bib_order)
    body = number_bibliography(body)
    body = replace_table(body)
    body = relabel_appendix(body)
    body = apply_numbering(body, labels)
    body = strip_personal_acknowledgement(body)

    template = TEMPLATE.read_text(encoding="utf-8")
    out = template.replace("<!-- ARTICLE_BODY -->", body)
    OUT_HTML.write_text(out, encoding="utf-8")
    print(f"wrote {OUT_HTML}", file=sys.stderr)


if __name__ == "__main__":
    main()
