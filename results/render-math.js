// Render the math pandoc emitted.
//
// pandoc writes every formula as <span class="math inline|display"> holding raw
// TeX with no $ delimiters, so KaTeX auto-render never sees it; we walk the
// spans ourselves. \label{...} is dropped because KaTeX has no concept of it
// (equation numbers arrive as \tag{...}, injected at build time from paper.aux).
// auto-render then picks up the $-delimited math we hand-write in page copy.
document.addEventListener("DOMContentLoaded", function () {
  var macros = {
    "\\e": "\\mathrm{e}",
    "\\eps": "\\varepsilon",
    "\\dd": "\\,\\mathrm{d}"
  };
  var failures = [];
  document.querySelectorAll("span.math.inline, span.math.display").forEach(function (el) {
    var display = el.classList.contains("display");
    var tex = el.textContent.replace(/\\label\{[^}]*\}/g, "");
    try {
      katex.render(tex, el, {
        displayMode: display,
        throwOnError: true,
        macros: macros,
        output: "html"
      });
    } catch (e) {
      failures.push({ tex: tex.slice(0, 160), message: e.message });
      try {
        katex.render(tex, el, {
          displayMode: display,
          throwOnError: false,
          macros: macros,
          output: "html"
        });
      } catch (e2) { /* leave the raw TeX visible rather than blanking it */ }
    }
  });
  if (typeof renderMathInElement === "function") {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ],
      throwOnError: false,
      macros: macros
    });
  }
  // A handful of formulas are wider than the text column. They scroll, but the
  // scrollbar is hidden, so flag them for the CSS fade that says so.
  document.querySelectorAll(".paper .katex-display").forEach(function (el) {
    if (el.scrollWidth - el.clientWidth < 3) return;
    el.classList.add("is-scrollable");
    el.addEventListener("scroll", function () {
      el.classList.toggle("at-end", el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    });
  });
  // The build audit reads these two off the rendered page.
  window.__katexFailures = failures;
  document.documentElement.setAttribute("data-katex-failures", String(failures.length));
  if (failures.length) {
    console.warn("KaTeX failed on " + failures.length + " formula(s)", failures);
  }
});
