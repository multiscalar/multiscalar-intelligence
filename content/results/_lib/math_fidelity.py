"""
Check that the TeX inside every formula on a built page still matches the paper.

pandoc passes math through verbatim, so a formula can only be corrupted by our
own rewrites (`\\tag` injection, `align` row re-splitting, the `\\(` -> `$` fix,
`\\label[type]` stripping) or by pandoc expanding the paper's own `\\newcommand`
macros.  Undo ours, apply the paper's macros the way pandoc does, collapse
whitespace, and require every formula to appear in the source.

This is the one thing `audit.py`'s PDF comparison cannot see: it strips math
before comparing, so a formula could render cleanly and still be wrong.
"""

import html
import re
from pathlib import Path

ENVS = r"(equation|align|gather|multline|flalign)\*?"

import html, re, sys
from pathlib import Path

ENVS = r"(equation|align|gather|multline|flalign)\*?"


def read_macros(tex):
    """{name: (argcount, body)} for \newcommand definitions."""
    macros = {}
    for m in re.finditer(
        r"\\(?:re)?newcommand\s*\{?\\([A-Za-z]+|[0-9])\}?\s*(?:\[(\d+)\])?\s*\{", tex
    ):
        name, nargs = m.group(1), int(m.group(2) or 0)
        depth, i = 1, m.end()
        while i < len(tex) and depth:
            if tex[i] == "\\":
                i += 2
                continue
            depth += (tex[i] == "{") - (tex[i] == "}")
            i += 1
        macros[name] = (nargs, tex[m.end() : i - 1])
    return macros


ROWBREAK = "\x01ROWBREAK\x01"


def expand(tex, macros, rounds=6):
    # Hide row separators first: in "\\\\ R>R_0" the second backslash would
    # otherwise start a match for a \R macro and expand what is really a line
    # break followed by a plain letter.
    tex = tex.replace("\\\\", ROWBREAK)
    for _ in range(rounds):
        changed = False
        for name, (nargs, body) in macros.items():
            # \1 style names take no letter-boundary guard
            pat = re.compile(
                r"\\" + re.escape(name) + (r"(?![A-Za-z])" if name.isalpha() else "")
            )
            out, pos = [], 0
            for m in pat.finditer(tex):
                if m.start() < pos:
                    continue
                i = m.end()
                args = []
                ok = True
                for _ in range(nargs):
                    while i < len(tex) and tex[i] in " \n":
                        i += 1
                    if i >= len(tex) or tex[i] != "{":
                        ok = False
                        break
                    depth, j = 1, i + 1
                    while j < len(tex) and depth:
                        if tex[j] == "\\":
                            j += 2
                            continue
                        depth += (tex[j] == "{") - (tex[j] == "}")
                        j += 1
                    args.append(tex[i + 1 : j - 1])
                    i = j
                if not ok:
                    continue
                rep = body
                for k, a in enumerate(args, start=1):
                    rep = rep.replace(f"#{k}", a)
                out.append(tex[pos : m.start()])
                out.append(rep)
                pos = i
                changed = True
            out.append(tex[pos:])
            tex = "".join(out)
        if not changed:
            break
    return tex.replace(ROWBREAK, "\\\\")


def norm(t):
    t = html.unescape(t)
    t = re.sub(r"\\tag\{[^}]*\}", "", t)
    t = re.sub(r"\\label(\[[^\]]*\])?\{[^}]*\}", "", t)
    # Row separators must be hidden before treating \( as a delimiter, or a
    # formula corrupted at a `\\(` boundary would normalise to the same string as
    # the correct source and the check would pass on a broken page.
    t = t.replace("\\\\", ROWBREAK)
    t = t.replace("\\(", "$").replace("\\)", "$")
    t = t.replace(ROWBREAK, "\\\\")
    t = re.sub(r"\\notag\b|\\nonumber\b", "", t)
    t = re.sub(r"\\begin\{" + ENVS + r"\}|\\end\{" + ENVS + r"\}", "", t)
    t = re.sub(r"\\\\", "", t)
    t = re.sub(r"\s+", "", t)
    return t




def mismatches(page_html: str, tex_source: str) -> tuple[int, list[str]]:
    """(formulas checked, formulas whose TeX is not in the source)."""
    src = norm(expand(tex_source, read_macros(tex_source)))
    spans = re.findall(
        r'<span[^>]*class="math (?:inline|display)">(.*?)</span>', page_html, re.S
    )
    bad = [
        re.sub(r"\s+", " ", html.unescape(s))[:190]
        for s in spans
        if len(norm(s)) > 1 and norm(s) not in src
    ]
    return len(spans), bad


def tabular_cell_count(tex: str) -> int:
    r"""Non-empty cells across every `tabular` in the source.

    Guards against pandoc silently discarding a row: it drops any row whose
    cells it cannot evaluate (`\text{...}` in text mode did exactly that), and
    then reads the following row as the body's first row.
    """
    total = 0
    # tabularx takes a width argument before its column spec; 690 uses it.
    for env, block in re.findall(
        r"\\begin\{(tabularx?\*?)\}(.*?)\\end\{\1\}", tex, re.S
    ):
        args = 2 if env.startswith("tabularx") else 1
        for _ in range(args):
            block = re.sub(r"^\s*(\[[^\]]*\])?\s*\{[^{}]*\}", "", block, count=1)
        block = re.sub(r"\\(top|mid|bottom)rule|\\hline|\\cmidrule(\[[^\]]*\])?(\{[^{}]*\})?", "", block)
        for row in split_top(block, "\\\\"):
            for cell in split_top(row, "&"):
                if re.sub(r"[^0-9A-Za-z]+", "", cell):
                    total += 1
    return total


def split_top(text: str, sep: str) -> list[str]:
    """Split on `sep` at brace depth zero, skipping escaped characters."""
    parts, depth, start, i, n = [], 0, 0, 0, len(text)
    while i < n:
        c = text[i]
        if c == "\\":
            if text.startswith(sep, i) and depth == 0 and sep.startswith("\\"):
                parts.append(text[start:i])
                i += len(sep)
                start = i
                continue
            i += 2
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
        elif depth == 0 and text.startswith(sep, i) and not sep.startswith("\\"):
            parts.append(text[start:i])
            i += len(sep)
            start = i
            continue
        i += 1
    parts.append(text[start:])
    return parts
