# Next.js + Tailwind Conversion — Design

**Date:** 2026-09-05
**Status:** Approved

## Goal

Convert the multiscalar.ai static site (hand-written HTML/CSS/JS on GitHub
Pages) to a Next.js + Tailwind CSS application deployed on Vercel. The
conversion is pixel-faithful: same design, fonts, layout, animations, and
URLs. All existing content — including the pipeline-generated Erdős paper
pages — becomes part of the Next.js app.

## Current state

- `index.html`, `style.css` (669 lines), `script.js` — home page, shared
  styles, animated canvas dot-grid background + IntersectionObserver
  scroll-reveal animations.
- `evals/` — `index.html`, `evals.css` (585 lines), `evals.js` (421 lines,
  vanilla DOM leaderboard renderer), `logos.js` (provider SVG paths),
  `data/*.json` (four benchmark result files).
- `open-science/index.html` + `sat-compress.js` — static page with a
  satellite-compression slider widget reading
  `assets/sat-compress/manifest.json`.
- `results/erdos-{390,486,536,690,788,1002,1038}/` — paper pages generated
  by `results/_lib/build.py` (pandoc LaTeX → HTML into `template.html`),
  each with `index.html`, `meta.json`, `paper.pdf`, `paper.tex`,
  `prompt.txt`, plus shared `results/article.css` and `results/render-math.js`
  (client-side KaTeX auto-render).
- Deployed via GitHub Pages: `CNAME` = multiscalar.ai, `.nojekyll`.
- `tools/` — Python utilities that fetch/estimate benchmark data; unrelated
  to serving, kept as-is.

## Decisions (user-confirmed)

1. **Hosting: Vercel.** Full Next.js runtime, no static export. User flips
   DNS for multiscalar.ai when ready.
2. **Erdős pages: converted to Next.js pages** via a dynamic route fed by
   the generation pipeline (see below), not left as opaque static files.
3. **Visuals: pixel-faithful port.** No redesign.

## Architecture

### Stack

- Next.js (latest stable), App Router, TypeScript.
- Tailwind CSS v4. Current CSS custom properties become theme tokens in
  `@theme` so values match exactly.
- Fonts via `next/font/google`: Inter, IBM Plex Mono, Crimson Pro
  (Crimson Pro loaded only on article pages).
- Repo root becomes the Next.js project root.

### Routes

| Route | Type | Notes |
|---|---|---|
| `/` | Static server component | Hero, central paragraph, 4 research cards, team, footer. |
| `/evals` | Static page + client leaderboard component | Benchmark JSON imported at build time from `data/evals/*.json` (moved from `evals/data/`); no runtime fetch, no loading flash. `logos.js` becomes a typed module. |
| `/open-science` | Static page + client `CompressDemo` component | Slider widget ports to React; images stay in `public/assets/sat-compress/`. |
| `/results/[slug]` | `generateStaticParams` over `content/results/*/` | Header rendered from `meta.json`; article body injected via `dangerouslySetInnerHTML` from a pipeline-emitted fragment. |

`trailingSlash: true` in `next.config.ts` preserves today's `/evals/`-style
URLs.

### Erdős pipeline change

`results/_lib/build.py` currently renders a complete standalone page. It
changes to emit, per paper:

- `content/results/<slug>/article.html` — the pandoc-generated article body
  fragment only (abstract + sections + references).
- `content/results/<slug>/meta.json` — unchanged schema (title, subtitle,
  eyebrow, badge, links, description).

Static artifacts (`paper.pdf`, `paper.tex`, `prompt.txt`) move to
`public/results/<slug>/` so existing deep links keep working. The Next.js
route reads fragment + meta at build time. KaTeX continues to render
client-side (same KaTeX version and auto-render delimiters as
`render-math.js`), wrapped in a small client component. Future papers: run
the pipeline, commit, redeploy — no manual conversion.

`.tex`/verifier sources and `build-report.json` stay in `content/results/<slug>/`
(not served).

### Shared components

- `Nav` — logo + links, `nav-current` state from the pathname.
- `Footer`.
- `GridBackground` — client component; ports the canvas dot-grid animation
  from `script.js` verbatim (resize, mousemove influence, rAF loop).
- `Reveal` — client wrapper replacing the IntersectionObserver
  scroll-reveal (`.animate`/`.visible`) behavior.

### Styling strategy

- Hand-written markup: Tailwind utilities, tokens from the existing
  custom properties.
- **Scoped global CSS remains for:** article typography (`article.css`
  targets pandoc-generated tags that cannot carry classes) and KaTeX
  overrides. Lives in a CSS file imported by the results route, scoped
  under `.paper`.
- Everything else in `style.css` / `evals.css` is ported to utilities or
  small component-level styles.

### Data flow

- Evals: `data/evals/*.json` → typed import → client component renders
  bars/chips exactly as `evals.js` does today (provider colors, aliases,
  signed bars, baselines).
- Compress demo: `manifest.json` imported at build time; images from
  `public/`.

## Error handling

- A `content/results/<slug>/` directory missing `article.html` or
  `meta.json` fails the build loudly (throw during `generateStaticParams`
  / page render) rather than shipping a broken page.
- Unknown providers in evals data fold into the neutral "other" slot, as
  today.

## Deployment

- Vercel project connected to the GitHub repo; production branch `main`.
- `CNAME` and `.nojekyll` removed once DNS points at Vercel (user's call
  on timing; files are harmless in the interim but will be deleted as part
  of the conversion since GitHub Pages will no longer serve the site).
- No redirects needed: all public URLs are preserved.

## Testing & verification

- `next build` passes with all 10 routes statically generated.
- Playwright screenshot comparison of every page (desktop + mobile widths)
  against the current live site to verify pixel fidelity: `/`, `/evals/`,
  `/open-science/`, and one representative Erdős page plus `/results/erdos-690/`.
- Manual checks: canvas animation, scroll reveals, evals benchmark
  switching, compression slider, KaTeX rendering, PDF/TeX/prompt deep
  links.

## Out of scope

- Visual redesign of any page.
- Changes to `tools/` Python utilities.
- DNS cutover (user performs it).
- Rewriting the LaTeX→HTML conversion itself (pandoc stays; only the
  output shape changes).
