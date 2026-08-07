"""
Build an HTML article page for an Erdős result from its LaTeX source.

    python3 _lib/build.py erdos-390 [erdos-486 ...]
    python3 _lib/build.py --all

This generalises the one-off `erdos-690/build.py` to the six papers published
at github.com/ShouqiaoW/erdos, which are considerably harder than 690:
`align` environments carrying their own equation numbers, cleveref (`\\Cref`),
mathtools `showonlyrefs`, aliascnt-shared theorem counters, and appendices.

The single idea that makes it reliable: **LaTeX already computed every number
we need**, and wrote them into `paper.aux` as
`\\newlabel{key}{{displayed-number}{page}{title}{counter.number}{}}`.  So we
never re-derive numbering from the source; we read it out of the .aux and only
interpolate for the handful of numbered items that carry no label.  Every
number on the page is therefore the number in the PDF by construction.

`paper.aux` is committed next to `paper.tex` so the build is reproducible
without a LaTeX installation.  To regenerate it:

    tectonic -X compile paper.tex --keep-intermediates --untrusted
"""

from __future__ import annotations

import html
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
RESULTS = HERE.parent

# Environments that share the `theorem` counter in all six papers.
THEOREM_ENVS = (
    "theorem",
    "lemma",
    "proposition",
    "corollary",
    "claim",
    "definition",
    "remark",
    "certificate",
)

# Counter name (as recorded in the .aux) -> displayed environment name.
COUNTER_LABEL = {
    "theorem": "Theorem",
    "lemma": "Lemma",
    "proposition": "Proposition",
    "corollary": "Corollary",
    "claim": "Claim",
    "definition": "Definition",
    "remark": "Remark",
    "certificate": "Certificate",
}

# cleveref name tables (\Crefname defaults plus the explicit ones in 390).
CREF_NAMES = {
    "section": ("Section", "Sections"),
    "subsection": ("Section", "Sections"),
    "subsubsection": ("Section", "Sections"),
    "equation": ("Equation", "Equations"),
    "theorem": ("Theorem", "Theorems"),
    "lemma": ("Lemma", "Lemmas"),
    "proposition": ("Proposition", "Propositions"),
    "corollary": ("Corollary", "Corollaries"),
    "claim": ("Claim", "Claims"),
    "definition": ("Definition", "Definitions"),
    "remark": ("Remark", "Remarks"),
    "certificate": ("Certificate", "Certificates"),
    "table": ("Table", "Tables"),
    "figure": ("Figure", "Figures"),
}


class BuildError(Exception):
    pass


# --------------------------------------------------------------------------
# paper.aux
# --------------------------------------------------------------------------

AUX_PLAIN = re.compile(
    r"\\newlabel\{(?P<key>[^}]+)\}\{\{(?P<num>[^{}]*)\}\{(?P<page>[^{}]*)\}"
    r"\{(?P<title>.*?)\}\{(?P<counter>[^{}]*)\}\{\}\}"
)
AUX_CREF = re.compile(
    r"\\newlabel\{(?P<key>[^}]+)@cref\}\{\{\[(?P<type>[^\]]*)\]"
)


class Aux:
    """label -> displayed number, counter kind, and cleveref type."""

    def __init__(self, text: str):
        self.number: dict[str, str] = {}
        self.counter: dict[str, str] = {}
        self.cref_type: dict[str, str] = {}
        for m in AUX_PLAIN.finditer(text):
            key = m.group("key")
            if key.endswith("@cref"):
                continue
            self.number[key] = m.group("num")
            self.counter[key] = m.group("counter").split(".")[0]
        for m in AUX_CREF.finditer(text):
            self.cref_type[m.group("key")] = m.group("type")

    def kind(self, key: str) -> str:
        return self.cref_type.get(key) or self.counter.get(key, "")

    def is_equation(self, key: str) -> bool:
        return self.counter.get(key) == "equation"

    def is_theorem_like(self, key: str) -> bool:
        return self.counter.get(key) in COUNTER_LABEL


# --------------------------------------------------------------------------
# LaTeX source scanning
# --------------------------------------------------------------------------


def strip_comments(tex: str) -> str:
    """Drop LaTeX comments so scans don't trip over commented-out markup."""
    out = []
    for line in tex.split("\n"):
        i, n = 0, len(line)
        while i < n:
            if line[i] == "\\" and i + 1 < n:
                i += 2
                continue
            if line[i] == "%":
                line = line[:i]
                break
            i += 1
        out.append(line)
    return "\n".join(out)


def referenced_labels(tex: str) -> set[str]:
    keys: set[str] = set()
    for m in re.finditer(r"\\(?:eqref|ref|Cref|cref|autoref)\{([^}]*)\}", tex):
        for k in m.group(1).split(","):
            keys.add(k.strip())
    return keys


def split_rows(body: str) -> list[str]:
    """Split an alignment body on its own `\\\\` row separators, ignoring the
    ones nested inside braces (`\\substack{a\\\\b}`) or inner environments
    (`cases`, `array`, `aligned`, ...)."""
    rows: list[str] = []
    depth_brace = 0
    depth_env = 0
    start = 0
    i, n = 0, len(body)
    while i < n:
        c = body[i]
        if c == "\\":
            if body.startswith(r"\begin{", i):
                depth_env += 1
                i += 7
                continue
            if body.startswith(r"\end{", i):
                depth_env -= 1
                i += 5
                continue
            if body.startswith("\\\\", i) and depth_brace == 0 and depth_env == 0:
                rows.append(body[start:i])
                i += 2
                # \\[2pt] style optional argument belongs to the separator
                m = re.match(r"\s*\[[^\]]*\]", body[i:])
                if m:
                    i += m.end()
                start = i
                continue
            i += 2  # any other control sequence: skip the escaped char
            continue
        if c == "{":
            depth_brace += 1
        elif c == "}":
            depth_brace -= 1
        i += 1
    rows.append(body[start:])
    return rows


def first_label(fragment: str) -> str | None:
    m = re.search(r"\\label(?:\[[^\]]*\])?\{([^}]+)\}", fragment)
    return m.group(1) if m else None


# --------------------------------------------------------------------------
# Numbering: theorem-like environments
# --------------------------------------------------------------------------


def theorem_numbers(tex: str, aux: Aux) -> tuple[list[dict], list[str]]:
    """Every theorem-like environment in source order, with its displayed
    number.  Labelled ones take their number straight from the .aux; unlabelled
    ones are interpolated from the previous number in the same section.

    Returns (records, problems).
    """
    records: list[dict] = []
    problems: list[str] = []
    events: list[tuple[int, str, str | None]] = []
    for m in re.finditer(r"\\section\*?\{", tex):
        events.append((m.start(), "section", None))
    for m in re.finditer(r"\\appendix\b", tex):
        events.append((m.start(), "appendix", None))
    envs = "|".join(THEOREM_ENVS)
    for m in re.finditer(r"\\begin\{(" + envs + r")\}(\[[^\]]*\])?", tex):
        label = None
        tail = tex[m.end() : m.end() + 300]
        lm = re.search(r"\\label(?:\[[^\]]*\])?\{([^}]+)\}", tail)
        if lm and r"\begin{" not in tail[: lm.start()]:
            label = lm.group(1)
        events.append((m.start(), "env:" + m.group(1), label))
    events.sort()

    section = "0"
    counter = 0
    for _, kind, label in events:
        if kind == "appendix":
            continue
        if kind == "section":
            counter = 0
            continue
        env = kind.split(":", 1)[1]
        if label and label in aux.number:
            number = aux.number[label]
            tail = number.rsplit(".", 1)[-1]
            if tail.isdigit():
                counter = int(tail)
            section = number.rsplit(".", 1)[0] if "." in number else section
        else:
            counter += 1
            number = f"{section}.{counter}"
            if label:
                problems.append(f"label {label!r} has no .aux entry")
        records.append({"env": env, "label": label, "number": number})
    return records, problems


# --------------------------------------------------------------------------
# Numbering: equations
# --------------------------------------------------------------------------

MATH_DISPLAY = re.compile(r'<span class="math display">(.*?)</span>', re.DOTALL)
MATH_ANY = re.compile(r'<span class="math (?:inline|display)">(.*?)</span>', re.DOTALL)

NUMBERED_ENVS = ("equation", "align", "gather", "multline", "flalign", "eqnarray")


def normalise_nested_math(body_html: str) -> str:
    r"""Inside \text{...}, pandoc rewrites the source's `$x$` as `\(x\)`, which
    KaTeX does not accept as a delimiter.  Put the dollars back."""

    def handle(m: re.Match[str]) -> str:
        tex = m.group(1)
        if r"\(" not in tex:
            return m.group(0)
        tex = tex.replace(r"\(", "$").replace(r"\)", "$")
        cls = "display" if 'math display"' in m.group(0) else "inline"
        return f'<span class="math {cls}">{tex}</span>'

    return MATH_ANY.sub(handle, body_html)


def tag_equations(body_html: str, aux: Aux, showonlyrefs: bool, refd: set[str]):
    """Insert `\\tag{N.M}` into every numbered display equation, taking the
    number from the .aux.  Returns (html, tags, problems)."""
    tags: list[str] = []
    problems: list[str] = []
    # Interpolation state for numbered-but-unlabelled equations.
    state = {"section": None, "counter": 0}

    def number_for(label: str | None) -> str | None:
        if label is not None and label in aux.number and aux.is_equation(label):
            if showonlyrefs and label not in refd:
                return None
            n = aux.number[label]
            head, _, tail = n.rpartition(".")
            if head and tail.isdigit():
                state["section"] = head
                state["counter"] = int(tail)
            return n
        if showonlyrefs:
            # showonlyrefs prints no number on an unreferenced equation.
            return None
        if state["section"] is None:
            problems.append("unlabelled equation before any numbered one")
            return None
        state["counter"] += 1
        return f"{state['section']}.{state['counter']}"

    def handle(m: re.Match[str]) -> str:
        tex = html.unescape(m.group(1))
        em = re.match(r"\s*\\begin\{([a-zA-Z]+)\}(.*)\\end\{\1\}\s*\Z", tex, re.DOTALL)
        if not em or em.group(1) not in NUMBERED_ENVS:
            return m.group(0)  # unnumbered display (\[ ... \] or a starred env)
        env, inner = em.group(1), em.group(2)
        anchors: list[str] = []
        if env == "equation":
            label = first_label(inner)
            num = number_for(label)
            if num is not None:
                inner = inner.rstrip() + f"\n\\tag{{{num}}}\n"
                tags.append(num)
                if label:
                    anchors.append(label)
        else:
            rows = split_rows(inner)
            rebuilt = []
            for row in rows:
                label = first_label(row)
                if re.search(r"\\notag\b|\\nonumber\b", row):
                    rebuilt.append(row)
                    continue
                num = number_for(label)
                if num is None:
                    rebuilt.append(row)
                    continue
                rebuilt.append(row.rstrip() + f"\\tag{{{num}}}")
                tags.append(num)
                if label:
                    anchors.append(label)
            inner = "\\\\\n".join(rebuilt)
        rebuilt_tex = f"\\begin{{{env}}}{inner}\\end{{{env}}}"
        # An `align` can number several rows, so one block may answer to several
        # \eqref targets; the first label rides on the span, the rest get their
        # own empty anchor so no cross-reference lands nowhere.
        attr = f' id="{html.escape(anchors[0])}"' if anchors else ""
        extra = "".join(
            f'<span id="{html.escape(a)}" class="eq-anchor"></span>' for a in anchors[1:]
        )
        return (
            f"{extra}<span{attr} class=\"math display\">"
            f"{html.escape(rebuilt_tex)}</span>"
        )

    return MATH_DISPLAY.sub(handle, body_html), tags, problems


# --------------------------------------------------------------------------
# Cross-references, citations, bibliography
# --------------------------------------------------------------------------


def cref_replacement(keys: list[str], aux: Aux, capitalise: bool) -> str:
    """Rebuild what cleveref prints, as plain LaTeX using \\ref so pandoc keeps
    the hyperlinks: `Lemmas~\\ref{a} and~\\ref{b}`."""
    kinds = [aux.kind(k) or "equation" for k in keys]
    plural = len(keys) > 1
    same = len(set(kinds)) == 1
    parts = []
    if same:
        names = CREF_NAMES.get(kinds[0], ("Reference", "References"))
        name = names[1] if plural else names[0]
        if not capitalise:
            name = name[0].lower() + name[1:]
        refs = [f"\\ref{{{k}}}" for k in keys]
        if len(refs) == 1:
            return f"{name}~{refs[0]}"
        if len(refs) == 2:
            return f"{name}~{refs[0]} and~{refs[1]}"
        return f"{name}~" + ", ".join(refs[:-1]) + f" and~{refs[-1]}"
    for k, kind in zip(keys, kinds):
        names = CREF_NAMES.get(kind, ("Reference", "References"))
        name = names[0]
        if not capitalise:
            name = name[0].lower() + name[1:]
        parts.append(f"{name}~\\ref{{{k}}}")
    if len(parts) == 2:
        return f"{parts[0]} and {parts[1]}"
    return ", ".join(parts[:-1]) + f" and {parts[-1]}"


def pandoc_input(tex: str, aux: Aux) -> str:
    """Rewrite the few constructs pandoc's LaTeX reader cannot parse.  Content
    is untouched; only reference plumbing changes."""
    # cleveref's typed labels: \label[theorem]{k} -> \label{k}
    tex = re.sub(r"\\label\[[^\]]*\]\{", r"\\label{", tex)

    def sub_cref(m: re.Match[str]) -> str:
        keys = [k.strip() for k in m.group(2).split(",") if k.strip()]
        return cref_replacement(keys, aux, capitalise=m.group(1) == "C")

    tex = re.sub(r"\\(C|c)ref\{([^}]*)\}", sub_cref, tex)
    tex = carry_cite_locators(tex)
    return modernise_font_switches(tex)


CITE_EXTRA_OPEN = "ZzCiteLocatorA"
CITE_EXTRA_CLOSE = "ZzCiteLocatorB"


def carry_cite_locators(tex: str) -> str:
    r"""pandoc silently drops the locator in `\cite[p.~48]{Er57}`, which the PDF
    prints as `[7, p. 48]`.  Move it out of the optional argument and into
    sentinel-wrapped body text so it survives, to be folded back into the
    citation bracket after conversion."""

    def sub(m: re.Match[str]) -> str:
        return (
            f"\\cite{{{m.group(2)}}}"
            f"{CITE_EXTRA_OPEN}{m.group(1)}{CITE_EXTRA_CLOSE}"
        )

    return re.sub(r"\\cite\[([^\]]*)\]\{([^}]*)\}", sub, tex)


def modernise_font_switches(tex: str) -> str:
    r"""Rewrite the pre-LaTeX2e `{\em X}` switch form as `\emph{X}` inside the
    bibliography only.

    A BibTeX alpha bibliography (390) emits `{\em Journal Name}`, which pandoc's
    reader silently drops, deleting every journal and book title.  The rewrite is
    scoped to `thebibliography` because the body text uses `{\bf e}` inside math,
    where `\textbf` would be wrong.
    """
    m = re.search(
        r"\\begin\{thebibliography\}.*?\\end\{thebibliography\}", tex, re.DOTALL
    )
    if not m:
        return tex
    block = m.group(0)
    for switch, cmd in (("em", "emph"), ("it", "textit"), ("bf", "textbf"), ("sc", "textsc")):
        pattern = re.compile(r"\{\\" + switch + r"\s+")
        while True:
            hit = pattern.search(block)
            if not hit:
                break
            depth = 1
            i = hit.end()
            while i < len(block) and depth:
                if block[i] == "\\":
                    i += 2
                    continue
                if block[i] == "{":
                    depth += 1
                elif block[i] == "}":
                    depth -= 1
                    if depth == 0:
                        break
                i += 1
            block = block[: hit.start()] + f"\\{cmd}{{" + block[hit.end() : i] + "}" + block[i + 1 :]
    return tex[: m.start()] + block + tex[m.end() :]


def _balanced(tex: str, i: int, open_ch: str, close_ch: str) -> tuple[str, int] | None:
    """Read a balanced `[...]` or `{...}` group starting at tex[i]."""
    if i >= len(tex) or tex[i] != open_ch:
        return None
    depth = 0
    j = i
    while j < len(tex):
        c = tex[j]
        if c == "\\":
            j += 2
            continue
        if c in (open_ch, "{"):
            depth += 1
        elif c in (close_ch, "}"):
            depth -= 1
            if depth == 0:
                return tex[i + 1 : j], j + 1
        j += 1
    return None


def bib_entries(tex: str) -> list[tuple[str, str]]:
    r"""(key, displayed tag) per \bibitem, in source order.

    390 carries a BibTeX *alpha* bibliography, so its citations print as
    `[ABT99]`, not `[1]`; the other five are plain numeric.  The optional
    argument needs a brace-balanced read because alpha tags nest markup, as in
    `\bibitem[ACR{\etalchar{+}}26]{...}`.
    """
    out: list[tuple[str, str]] = []
    for m in re.finditer(r"\\bibitem\s*", tex):
        i = m.end()
        tag = None
        got = _balanced(tex, i, "[", "]")
        if got:
            tag, i = got
        got = _balanced(tex, i, "{", "}")
        if not got:
            continue
        key, _ = got
        if tag is None:
            tag = str(len(out) + 1)
        else:
            tag = tag.replace(r"{\etalchar{+}}", "+")
            tag = re.sub(r"\\[a-zA-Z]+\s*", "", tag).replace("{", "").replace("}", "")
        out.append((key.strip(), tag.strip()))
    return out


def fix_citations(body: str, bib: list[tuple[str, str]]) -> tuple[str, list[str]]:
    key_to = {k: (i + 1, tag) for i, (k, tag) in enumerate(bib)}
    problems: list[str] = []

    def repl(m: re.Match[str]) -> str:
        # \cite{a,b} prints as one bracket, "[1, 2]", exactly as in the PDF.
        inner = []
        first = None
        for k in m.group(1).split():
            hit = key_to.get(k)
            if hit is None:
                problems.append(f"unresolved \\cite key {k!r}")
                inner.append(f"?{k}")
                continue
            n, tag = hit
            first = first or n
            inner.append(html.escape(tag))
        target = f' href="#ref-{first}"' if first else ""
        return f'<a{target} class="cite">[{", ".join(inner)}]</a>'

    body = re.sub(
        r'<span class="citation"\s+data-cites="([^"]+)"\s*>\s*</span>', repl, body
    )
    # Fold the carried locator back inside the bracket: [7] + "p. 48" -> [7, p. 48]
    body = re.sub(
        r'(<a[^>]*class="cite">\[[^\]]*)\]</a>\s*'
        + CITE_EXTRA_OPEN
        + r"(.*?)"
        + CITE_EXTRA_CLOSE,
        lambda m: f"{m.group(1)}, {m.group(2).strip()}]</a>",
        body,
        flags=re.DOTALL,
    )
    leftover = body.count(CITE_EXTRA_OPEN) + body.count(CITE_EXTRA_CLOSE)
    if leftover:
        problems.append(f"{leftover} citation locator sentinel(s) left unmerged")
    return body, problems


def fix_references(body: str, aux: Aux) -> tuple[str, list[str]]:
    """Rewrite pandoc's flat counters to the numbers LaTeX printed."""
    problems: list[str] = []

    def repl(m: re.Match[str]) -> str:
        key, kind = m.group("key"), m.group("kind")
        if key not in aux.number:
            problems.append(f"unresolved \\{kind} target {key!r}")
            return m.group(0)
        num = aux.number[key]
        shown = f"({num})" if kind == "eqref" else num
        cls = "eq-ref" if kind == "eqref" else "xref"
        return (
            f'<a href="#{html.escape(key)}" class="{cls}" '
            f'data-reference-type="{kind}" data-reference="{html.escape(key)}">'
            f"{shown}</a>"
        )

    body = re.sub(
        r'<a\s+href="#(?P<key>[^"]+)"[^>]*data-reference-type="(?P<kind>ref|eqref)"'
        r'[^>]*>.*?</a>',
        repl,
        body,
        flags=re.DOTALL,
    )
    return body, problems


def rebuild_bibliography(body: str, bib: list[tuple[str, str]]) -> tuple[str, int]:
    m = re.search(r'<div class="thebibliography">(.*?)</div>', body, re.DOTALL)
    if not m:
        return body, 0
    entries = re.findall(r"<p>(.*?)</p>", m.group(1), re.DOTALL)
    # \begin{thebibliography}{WIDEST-LABEL} renders as a leading paragraph of
    # its own; it is layout metadata, not an entry.
    if len(entries) == len(bib) + 1:
        entries = entries[1:]
    items = "".join(
        f'<li id="ref-{i}"><span class="ref-num">[{html.escape(tag)}]</span>'
        f'<span class="ref-body">{e.strip()}</span></li>'
        for i, (e, (_, tag)) in enumerate(zip(entries, bib), start=1)
    )
    block = (
        '<section class="references-section" id="references">'
        '<h2 class="references-heading">References</h2>'
        f'<ol class="bib-list">{items}</ol></section>'
    )
    body = body[: m.start()] + body[m.end() :]
    # The bibliography sits after \appendix in these papers, so pandoc nests it
    # inside the last appendix <section>. Emit it as a sibling instead.
    last = body.rfind("</section>")
    if last == -1:
        return body + block, len(entries)
    cut = last + len("</section>")
    return body[:cut] + block + body[cut:], len(entries)


def relabel_appendix(body: str, tex: str, aux: Aux) -> str:
    """LaTeX letters appendix sections (A, B, ...); pandoc keeps counting."""
    app = tex.find("\\appendix")
    if app == -1:
        return body
    ids = []
    for m in re.finditer(r"\\section\*?\{", tex):
        if m.start() < app:
            continue
        lm = re.search(r"\\label\{([^}]+)\}", tex[m.end() : m.end() + 400])
        ids.append(lm.group(1) if lm else None)
    for key in ids:
        if not key or key not in aux.number:
            continue
        letter = aux.number[key]
        pat = (
            r'(<section id="' + re.escape(key) + r'"[^>]*data-number=")[^"]*(")'
        )
        body = re.sub(pat, lambda m, L=letter: f"{m.group(1)}{L}{m.group(2)}", body)
        body = re.sub(
            r'(<section id="'
            + re.escape(key)
            + r'"[^>]*>\s*<h\d data-number=")[^"]*("[^>]*>\s*'
            r'<span class="header-section-number">)[^<]*(</span>)',
            lambda m, L=letter: f"{m.group(1)}{L}{m.group(2)}{L}{m.group(3)}",
            body,
            flags=re.DOTALL,
        )
    return body


def fix_theorem_headings(body: str, records: list[dict]) -> tuple[str, list[str]]:
    """Replace pandoc's flat `Theorem 7` with the section-relative number.

    Walked in document order so unlabelled environments are covered too.
    """
    problems: list[str] = []
    kinds = "|".join(COUNTER_LABEL.values())
    pattern = re.compile(
        r"<(?P<tag>p)><(?P<em>strong|em)>(?P<kind>" + kinds + r")(?:&nbsp;| )(?P<num>\d+)</\2>"
    )
    queue = list(records)
    out = []
    pos = 0
    for m in pattern.finditer(body):
        want = None
        while queue:
            rec = queue.pop(0)
            if COUNTER_LABEL.get(rec["env"]) == m.group("kind"):
                want = rec
                break
            problems.append(
                f"source has {rec['env']} {rec['number']} with no heading in the HTML"
            )
        if want is None:
            problems.append(f"HTML has {m.group('kind')} {m.group('num')} not in source")
            continue
        out.append(body[pos : m.start()])
        out.append(
            f"<{m.group('tag')}><{m.group('em')}>{m.group('kind')} "
            f"{want['number']}</{m.group('em')}>"
        )
        pos = m.end()
    out.append(body[pos:])
    for rec in queue:
        problems.append(
            f"source has {rec['env']} {rec['number']} with no heading in the HTML"
        )
    return "".join(out), problems


def anchor_theorem_ids(body: str) -> str:
    """pandoc gives the wrapper div the label as its id already; nothing to do
    beyond making unlabelled ones addressable is unnecessary."""
    return body


# --------------------------------------------------------------------------
# pandoc
# --------------------------------------------------------------------------


def run_pandoc(tex: str, extra: list[str], cwd: Path) -> str:
    # --wrap=none matters: with wrapping on, pandoc breaks lines *inside* start
    # tags (`<span\nclass="math display">`), which every post-processing regex
    # here would then miss.
    proc = subprocess.run(
        ["pandoc", "-f", "latex", "-t", "html5", "--katex", "--wrap=none", *extra],
        input=tex,
        capture_output=True,
        text=True,
        cwd=cwd,
    )
    if proc.returncode != 0:
        raise BuildError(f"pandoc failed: {proc.stderr.strip()[:800]}")
    return proc.stdout


ABSTRACT_TEMPLATE = "$abstract$"


def render_abstract(tex: str, cwd: Path) -> str:
    tpl = cwd / ".abstract-template.html"
    tpl.write_text(ABSTRACT_TEMPLATE, encoding="utf-8")
    try:
        out = run_pandoc(tex, ["--standalone", f"--template={tpl.name}"], cwd)
    finally:
        tpl.unlink(missing_ok=True)
    return out.strip()


# --------------------------------------------------------------------------
# driver
# --------------------------------------------------------------------------


def build(slug: str) -> dict:
    d = RESULTS / slug
    meta = json.loads((d / "meta.json").read_text(encoding="utf-8"))
    raw = (d / "paper.tex").read_text(encoding="utf-8")
    aux = Aux((d / "paper.aux").read_text(encoding="utf-8"))
    tex = strip_comments(raw)

    showonlyrefs = "showonlyrefs" in tex
    refd = referenced_labels(tex)
    bib = bib_entries(tex)
    records, problems = theorem_numbers(tex, aux)

    source = pandoc_input(tex, aux)
    body = run_pandoc(source, ["--section-divs", "--number-sections"], d)
    abstract = render_abstract(source, d)

    body, p = fix_citations(body, bib)
    problems += p
    body, n_refs = rebuild_bibliography(body, bib)
    if n_refs != len(bib):
        problems.append(f"bibliography: {n_refs} entries rendered, {len(bib)} in source")
    body = relabel_appendix(body, tex, aux)
    body, p = fix_theorem_headings(body, records)
    problems += p
    body, p = fix_references(body, aux)
    problems += p
    body, tags, p = tag_equations(body, aux, showonlyrefs, refd)
    problems += p
    body = normalise_nested_math(body)
    abstract = normalise_nested_math(abstract)

    # Residue checks: nothing from pandoc's unresolved-reference vocabulary
    # may survive into the page.
    for pat, what in (
        (r"\[eq:[^\]]+\]", "literal \\eqref placeholder"),
        (r'data-cites="', "unresolved citation span"),
        (r'class="tabularx"', "unconverted tabularx block"),
        (r"\\Cref\{|\\cref\{", "unconverted cleveref"),
    ):
        n = len(re.findall(pat, body))
        if n:
            problems.append(f"{n} x {what} left in the output")

    template = (HERE / "template.html").read_text(encoding="utf-8")
    links = "\n        ".join(
        f'<a href="{html.escape(u)}" class="article-link"'
        + (' target="_blank" rel="noopener"' if u.startswith("http") else "")
        + f">{html.escape(t)}&nbsp;↗</a>"
        for t, u in meta["links"]
    )
    page = template
    for key, value in {
        "TITLE": meta["title"],
        "DESCRIPTION": meta["description"],
        "EYEBROW": meta["eyebrow"],
        "BADGE": meta["badge"],
        "BADGECLASS": meta.get("badge_class", "status-proposed"),
        "SUBTITLE": meta["subtitle"],
        "LINKS": links,
        "ABSTRACT": abstract,
        "BODY": body,
    }.items():
        page = page.replace(f"<!--{key}-->", value)
    (d / "index.html").write_text(page, encoding="utf-8")

    report = {
        "slug": slug,
        "theorems": [f"{COUNTER_LABEL[r['env']]} {r['number']}" for r in records],
        "equations": tags,
        "reference_tags": [t for _, t in bib],
        "showonlyrefs": showonlyrefs,
        "problems": problems,
    }
    (d / "build-report.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    return report


def main(argv: list[str]) -> int:
    slugs = argv[1:]
    if not slugs or slugs == ["--all"]:
        slugs = sorted(
            p.name
            for p in RESULTS.iterdir()
            if p.is_dir() and (p / "meta.json").exists()
        )
    bad = 0
    for slug in slugs:
        try:
            r = build(slug)
        except BuildError as e:
            print(f"{slug}: BUILD FAILED: {e}", file=sys.stderr)
            bad += 1
            continue
        flag = "ok " if not r["problems"] else "WARN"
        print(
            f"{flag} {slug}: {len(r['theorems'])} theorem-like, "
            f"{len(r['equations'])} numbered equations, "
            f"{len(r['reference_tags'])} references"
            + (" [showonlyrefs]" if r["showonlyrefs"] else "")
        )
        for p in r["problems"]:
            print(f"       - {p}")
        bad += 1 if r["problems"] else 0
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
