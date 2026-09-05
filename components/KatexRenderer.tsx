"use client";

import { useEffect } from "react";
import katex from "katex";
import renderMathInElement from "katex/contrib/auto-render";

// Render the math pandoc emitted (port of results/render-math.js).
//
// pandoc writes every formula as <span class="math inline|display"> holding raw
// TeX with no $ delimiters, so KaTeX auto-render never sees it; we walk the
// spans ourselves. \label{...} is dropped because KaTeX has no concept of it
// (equation numbers arrive as \tag{...}, injected at build time from paper.aux).
// auto-render then picks up the $-delimited math we hand-write in page copy.
export default function KatexRenderer() {
  useEffect(() => {
    const macros = {
      "\\e": "\\mathrm{e}",
      "\\eps": "\\varepsilon",
      "\\dd": "\\,\\mathrm{d}",
    };
    const failures: { tex: string; message: string }[] = [];
    document
      .querySelectorAll<HTMLElement>("span.math.inline, span.math.display")
      .forEach((el) => {
        // Already rendered (the effect can run twice under React strict mode).
        if (el.querySelector(".katex")) return;
        const display = el.classList.contains("display");
        const tex = (el.textContent || "").replace(/\\label\{[^}]*\}/g, "");
        try {
          katex.render(tex, el, {
            displayMode: display,
            throwOnError: true,
            macros,
            output: "html",
          });
        } catch (e) {
          failures.push({ tex: tex.slice(0, 160), message: (e as Error).message });
          try {
            katex.render(tex, el, {
              displayMode: display,
              throwOnError: false,
              macros,
              output: "html",
            });
          } catch {
            /* leave the raw TeX visible rather than blanking it */
          }
        }
      });
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
      throwOnError: false,
      macros,
    });
    // A handful of formulas are wider than the text column. They scroll, but the
    // scrollbar is hidden, so flag them for the CSS fade that says so.
    document
      .querySelectorAll<HTMLElement>(".paper .katex-display")
      .forEach((el) => {
        if (el.scrollWidth - el.clientWidth < 3) return;
        el.classList.add("is-scrollable");
        el.addEventListener("scroll", () => {
          el.classList.toggle(
            "at-end",
            el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
          );
        });
      });
    // The build audit reads these two off the rendered page.
    (window as unknown as Record<string, unknown>).__katexFailures = failures;
    document.documentElement.setAttribute(
      "data-katex-failures",
      String(failures.length)
    );
    if (failures.length) {
      console.warn(
        "KaTeX failed on " + failures.length + " formula(s)",
        failures
      );
    }
  }, []);

  return null;
}
