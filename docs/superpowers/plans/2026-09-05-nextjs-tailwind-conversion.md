# Next.js + Tailwind Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the multiscalar.ai static site to a pixel-faithful Next.js + Tailwind CSS app deployed on Vercel, with the Erdős paper pipeline emitting fragments consumed by a dynamic route.

**Architecture:** Next.js App Router (TypeScript) at the repo root. Static server components for all pages; client components only for the canvas background, scroll reveals, the evals leaderboard, the compression slider, and KaTeX rendering. `results/_lib/build.py` changes from emitting full pages to emitting `article.html` fragments under `content/results/<slug>/`, which `app/results/[slug]/page.tsx` reads at build time.

**Tech Stack:** Next.js (latest stable), React, TypeScript, Tailwind CSS v4 (`@tailwindcss/postcss`), `next/font/google` (Inter, IBM Plex Mono, Crimson Pro), `katex` npm package, Vitest for unit tests, Playwright (already available as MCP tools) for visual verification.

**Spec:** `docs/superpowers/specs/2026-09-05-nextjs-tailwind-conversion-design.md`

## Global Constraints

- **Pixel-faithful:** every CSS value ported must be copied verbatim from `style.css`, `evals/evals.css`, `results/article.css`. No "improvements" to spacing, color, or type.
- **URLs preserved:** `/`, `/evals/`, `/open-science/`, `/results/erdos-{390,486,536,690,788,1002,1038}/`, and every `/results/<slug>/paper.pdf|paper.tex|prompt.txt` deep link must resolve identically. `trailingSlash: true` in `next.config.ts`.
- **KaTeX version:** 0.16.11 (matches the CDN version the site uses today).
- **Copy is frozen:** all visible text is copied verbatim from the existing HTML files.
- **No static export:** the target is the Vercel runtime; do not set `output: 'export'`.
- **The old files are the reference until Task 9 deletes them.** Never edit `style.css`, `index.html`, `evals/`, `open-science/` in place; port from them.
- Commit after every task with the trailer:
  `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` and
  `Claude-Session: https://claude.ai/code/session_01NRzy6PFMZXg2saEcoWjZNa`

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `next-env.d.ts` (generated), `vitest.config.ts`, `app/layout.tsx`, `app/globals.css`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `app/layout.tsx` exporting the root layout with font CSS variables `--font-inter`, `--font-mono`, `--font-serif`; `app/globals.css` with the full `@theme` token set every later task uses.

- [ ] **Step 1: Install dependencies (manual scaffold — the repo root is not empty, `create-next-app` would refuse)**

```bash
npm init -y
npm install next@latest react@latest react-dom@latest katex@0.16.11
npm install -D typescript @types/react @types/react-dom @types/node tailwindcss @tailwindcss/postcss vitest
```

- [ ] **Step 2: Write config files**

`package.json` scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run"
  }
}
```

`next.config.ts`:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
};

export default nextConfig;
```

`postcss.config.mjs`:
```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

`tsconfig.json` (standard Next.js TS config; `strict: true`, path alias `"@/*": ["./*"]`).

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: { include: ["tests/**/*.test.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname) } },
});
```

Append to `.gitignore`:
```
node_modules/
.next/
next-env.d.ts
```

- [ ] **Step 3: Write `app/globals.css`**

Start with `@import "tailwindcss";` then an `@theme` block. Open `style.css` and copy **every** custom property from its `:root` block verbatim into `@theme` as `--color-*` / `--font-*` / spacing tokens (Tailwind v4 exposes `@theme` variables as utilities). Also copy the base `body` rules (background, color, font-family via `var(--font-inter)`, antialiasing) into an `@layer base` block. Do not invent values; every literal comes from `style.css`.

- [ ] **Step 4: Write `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Multiscalar Intelligence | Multi-Agent Intelligence at Scale",
  description:
    "Multiscalar Intelligence develops new algorithms and systems for multi-agent AI, enabling agents to learn, coordinate, and scale from individuals to open networks.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>◆</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

(Crimson Pro is added in Task 7, scoped to the results route.)

- [ ] **Step 5: Add a placeholder `app/page.tsx`** (`export default function Home() { return <main /> }`) so the build has a route.

- [ ] **Step 6: Verify the build passes**

Run: `npm run build`
Expected: build succeeds, `/` route generated.

- [ ] **Step 7: Commit** — `chore: scaffold Next.js + Tailwind project`

---

### Task 2: Shared components — Nav, Footer, GridBackground, Reveal

**Files:**
- Create: `components/Nav.tsx`, `components/Footer.tsx`, `components/GridBackground.tsx`, `components/Reveal.tsx`
- Modify: `app/layout.tsx` (mount Nav, GridBackground; Footer stays per-page because the article pages place it inside `main.article-main`)

**Interfaces:**
- Produces: `<Nav />` (server component; renders `nav-current` styling on the link matching the current path — implement as a client component using `usePathname()` from `next/navigation`), `<Footer />` (server), `<GridBackground />` (client), `<Reveal as?; className?; children>` (client wrapper div that adds the ported `.visible` styles when the IntersectionObserver fires at threshold 0.15).

- [ ] **Step 1: Port `Nav`**

Markup from `index.html` lines 16–26: logo (`Multiscalar` / `Intelligence` stacked spans), links Research (`/#research`), Evals (`/evals/`), Open Science (`/open-science/`), Contact (`mailto:hello@multiscalar.ai`). Use `usePathname()` to add the current-page style (`nav-current` behavior from `style.css`). Style with Tailwind utilities matching the `nav`, `.nav-inner`, `.logo`, `.nav-links` rules in `style.css` exactly (fixed positioning, blur, borders — copy each value).

- [ ] **Step 2: Port `Footer`**

Markup from `index.html` lines 94–107 (logo, "London, UK", Contact link, copyright). Article pages additionally show an Open Science link (see `results/_lib/template.html` lines 62–76) — support via a prop `variant?: "default" | "article"`.

- [ ] **Step 3: Port `GridBackground`**

Client component. Port `script.js` lines 1–66 verbatim into a `useEffect`: canvas sized to the window, dots every 40px with `baseAlpha 0.08 + random*0.04`, mouse influence radius 200 raising alpha by up to 0.25 and radius from 0.6 to 1.8, rAF loop, resize and mouseleave handlers. Clean up listeners and `cancelAnimationFrame` on unmount. Render `<canvas>` with the `#grid-bg` positioning styles from `style.css`.

- [ ] **Step 4: Port `Reveal`**

Client component replacing `script.js` lines 67–91: wraps children in a div that starts in the ported `.animate` state and transitions to `.visible` when intersecting at threshold 0.15. Copy the transition values from `style.css` (`.animate`, `.visible`, and the `.divider` variant — support `variant?: "default" | "divider"`).

- [ ] **Step 5: Mount in layout** — `<GridBackground />` and `<Nav />` in `app/layout.tsx` around `{children}`.

- [ ] **Step 6: Verify** — `npm run build` passes; `npm run dev`, load `/`, confirm the dot grid animates and reacts to the mouse.

- [ ] **Step 7: Commit** — `feat: shared Nav, Footer, GridBackground, Reveal components`

---

### Task 3: Home page

**Files:**
- Create: `app/page.tsx` (replace placeholder)

- [ ] **Step 1: Port `index.html` body → `app/page.tsx`**

Sections in order, copy verbatim: hero (`Scaling Multi-Agent Intelligence` label, `Teaching Machines to Coordinate` h1), central paragraph, Research section (`id="research"`, four numbered cards 01–04 with their exact headings and copy), Team section, divider, `<Footer />`. Wrap the elements that `script.js` observed (`.section-grid`, research section label, each research card, dividers) in `<Reveal>`. Style each section with Tailwind utilities transcribing the corresponding `style.css` rules (`.hero`, `.central-paragraph`, `.research-grid`, `.research-card`, `.card-number`, `.section-grid`, `.section-label`, `.team-intro`, `.link-arrow`, `.divider`, `footer` rules) value-for-value, including media queries.

- [ ] **Step 2: Verify** — `npm run dev`; compare `http://localhost:3000/` against the pre-conversion page side by side (open the old `index.html` via the live site or a static server). Headings, spacing, card grid, hover states, scroll reveals must match.

- [ ] **Step 3: Commit** — `feat: home page`

---

### Task 4: Evals data layer (typed, tested)

**Files:**
- Create: `data/evals/` (move the four JSONs: `git mv evals/data/*.json data/evals/`), `data/evals/README.md` (git mv), `lib/evals/types.ts`, `lib/evals/providers.ts`, `lib/evals/provider-icons.ts`, `lib/evals/benches.ts`
- Test: `tests/providers.test.ts`

**Interfaces:**
- Produces:
  - `types.ts`: `BenchData`, `BenchModel` interfaces derived from the actual JSON shape (read all four files in `data/evals/` and type every field they use).
  - `providers.ts`: `PROVIDERS: Record<string, Provider>`, `providerOf(model: BenchModel): Provider` — port the tables and logic from `evals/evals.js` (PROVIDERS map lines 10–25, PROVIDER_ALIASES lines 27–48, the `providerOf` function including the `/^fixed /i` baseline rule and the `other` fallback) with colors and labels verbatim.
  - `provider-icons.ts`: `PROVIDER_ICONS: Record<string, string>` — the SVG path strings from `evals/logos.js`, exported instead of set on `window`.
  - `benches.ts`: `BENCHES` ordered slug list (`['economic-arena','treasury-bench','terms-bench','vending-bench-2']`), `MAX_BARS = 12`, and `loadBench(slug): BenchData` using static imports of the four JSONs.

- [ ] **Step 1: Write failing tests** in `tests/providers.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { providerOf, PROVIDERS } from "@/lib/evals/providers";

describe("providerOf", () => {
  it("resolves aliases to the canonical provider", () => {
    expect(providerOf({ name: "GLM-5", provider: "Zhipu" } as any)).toBe(PROVIDERS.zai);
    expect(providerOf({ name: "Qwen4-Max", provider: "qwen" } as any)).toBe(PROVIDERS.alibaba);
    expect(providerOf({ name: "Gemini", provider: "Google DeepMind" } as any)).toBe(PROVIDERS.google);
  });
  it("routes scripted baselines by name prefix", () => {
    expect(providerOf({ name: "Fixed 2% ladder", provider: "" } as any)).toBe(PROVIDERS.baseline);
  });
  it("folds unknown providers into other", () => {
    expect(providerOf({ name: "Mystery-1", provider: "acme" } as any)).toBe(PROVIDERS.other);
  });
});
```

- [ ] **Step 2: Run** `npm test` — expected FAIL (module not found).
- [ ] **Step 3: Implement** the four modules by porting from `evals/evals.js` / `evals/logos.js` as specified above. Before typing `BenchData`, read all four JSON files fully so the type covers every field `evals.js` touches (including signed-bar and baseline fields).
- [ ] **Step 4: Run** `npm test` — expected PASS.
- [ ] **Step 5: Commit** — `feat: typed evals data layer`

---

### Task 5: Evals page

**Files:**
- Create: `app/evals/page.tsx`, `components/evals/Leaderboard.tsx` (client; may split into `BenchList.tsx`, `BenchCard.tsx` if it grows past ~250 lines)

**Interfaces:**
- Consumes: everything Task 4 produces.

- [ ] **Step 1: Read `evals/evals.js` fully** (all 421 lines) before writing any JSX. List every rendering behavior: bench sidebar list, card header/description/source link handling (tolerate missing source URL), bar chart with MAX_BARS cap, provider chips with icon-or-mark fallback, signed bars (negative values), baseline rows, aligned chip rows for signed charts, any footnotes/metadata rows.

- [ ] **Step 2: Build the page.** `app/evals/page.tsx` is a server component with the hero copied verbatim from `evals/index.html` lines 31–39 plus `<Leaderboard />` and metadata export (title/description from that file's `<head>`). `Leaderboard` is a client component holding `useState` for the selected bench (default: first in `BENCHES`), rendering the sidebar and card from the statically imported data — no fetch, no loading state.

- [ ] **Step 3: Style** with Tailwind utilities transcribing `evals/evals.css` (585 lines) value-for-value, including responsive rules. Chart bar widths computed exactly as `evals.js` computes them.

- [ ] **Step 4: Verify** — `npm run dev`; for each of the four benchmarks compare against the live `/evals/` page: same ordering, same bar lengths, same colors/chips, same signed-bar rendering, missing-source cards render without a link. `npm run build` passes.

- [ ] **Step 5: Commit** — `feat: evals leaderboard page`

---

### Task 6: Open Science page + compression demo

**Files:**
- Create: `app/open-science/page.tsx`, `components/CompressDemo.tsx` (client), `lib/sat-compress.ts`
- Move: `git mv assets public/assets`
- Test: `tests/sat-compress.test.ts`

**Interfaces:**
- Produces: `lib/sat-compress.ts` exporting `fmtBytes(b: number): string` and `buildStops(manifest): Stop[]` where `Stop = { img: string; label: string; size: string }` — the logic from `sat-compress.js` lines 13–46 (sort levels ascending by ratio, prepend the original, `label = ratio.toFixed(0) + "× smaller"`).

- [ ] **Step 1: Write failing tests** `tests/sat-compress.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { fmtBytes, buildStops } from "@/lib/sat-compress";

it("formats bytes like the original widget", () => {
  expect(fmtBytes(500)).toBe("500 B");
  expect(fmtBytes(2048)).toBe("2.0 KB");
  expect(fmtBytes(1572864)).toBe("1.5 MB");
});

it("orders stops original-first then ascending ratio", () => {
  const stops = buildStops({
    original_bytes: 1048576,
    levels: [
      { lambda: 4000, ratio: 142.1, bytes: 7000 },
      { lambda: 200, ratio: 55.4, bytes: 19000 },
    ],
  });
  expect(stops[0].label).toBe("Original");
  expect(stops[1].label).toBe("55× smaller");
  expect(stops[2].label).toBe("142× smaller");
});
```

- [ ] **Step 2: Run** `npm test` — FAIL. **Step 3:** implement `lib/sat-compress.ts`. **Step 4:** `npm test` — PASS.

- [ ] **Step 5: Build the page.** Port `open-science/index.html` verbatim: hero, two central paragraphs, the `erdos-six` result group (six problem links with numbers/titles/tags exactly as written), the Erdős 690 entry, the compression demo entry, divider, `<Footer />`. `CompressDemo` imports `public/assets/sat-compress/manifest.json` statically via `buildStops`, holds slider state, swaps `<img src>` between the PNGs in `/assets/sat-compress/`. Metadata export from the old `<head>`. Styles transcribed from the `.results`, `.result-entry`, `.problem-list`, `.compress-*` rules in `style.css`.

- [ ] **Step 6: Verify** — dev server: slider swaps images and readouts starting at "Original"; all eight result links point at the right URLs. Build passes.

- [ ] **Step 7: Commit** — `feat: open science page with compression demo`

---

### Task 7: Erdős pipeline emits fragments; content/public restructure

**Files:**
- Create: `content/results/` (git mv each `results/erdos-*` dir into it), `public/results/<slug>/` (artifact copies, built)
- Modify: `results/_lib/build.py` (moves to `content/results/_lib/build.py` along with `audit.py`, `math_fidelity.py`; `template.html` is deleted)
- Test: run of the pipeline itself over all seven papers

**Interfaces:**
- Produces, per slug under `content/results/<slug>/`: `article.html` (fragment: the `<section class="abstract">…</section>` block followed by the body sections — exactly what the old template placed inside `<article class="paper">`), `meta.json` (unchanged schema: `number,title,subtitle,tag,eyebrow,badge,badge_class?,description,links: [name,url][]`). And per slug under `public/results/<slug>/`: `paper.pdf`, `paper.tex`, `prompt.txt` copied by the build.

- [ ] **Step 1: Move directories**

```bash
mkdir -p content/results public/results
git mv results/erdos-390 results/erdos-486 results/erdos-536 results/erdos-690 results/erdos-788 results/erdos-1002 results/erdos-1038 content/results/
git mv results/_lib content/results/_lib
git rm results/article.css results/render-math.js   # article.css content is ported in Task 8 — copy it somewhere safe first (e.g. keep a copy until Task 8 lands, or do Tasks 7–8 in one working tree before committing the removal)
```

**Careful:** `results/article.css` is still needed as the porting reference for Task 8. Move it (`git mv results/article.css content/results/_lib/article-reference.css`) instead of deleting.

- [ ] **Step 2: Modify `build.py`**

In `build(slug)` (currently lines 817–837): replace the template interpolation with:

```python
    # Fragment consumed by app/results/[slug]/page.tsx at build time.
    fragment = (
        '<section class="abstract">\n'
        '  <div class="abstract-label">Abstract</div>\n'
        f"  {abstract}\n"
        "</section>\n\n"
        f"{body}\n"
    )
    (d / "article.html").write_text(fragment, encoding="utf-8")
    for name in ("paper.pdf", "paper.tex", "prompt.txt"):
        src = d / name
        if src.exists():
            dst = PUBLIC / slug / name
            dst.parent.mkdir(parents=True, exist_ok=True)
            dst.write_bytes(src.read_bytes())
```

with `PUBLIC = HERE.parent.parent.parent / "public" / "results"` (i.e. `<repo>/public/results`) defined next to `RESULTS`. Delete the template read, the `links` HTML assembly, and the `index.html` write; delete `template.html`. Everything else (aux parsing, pandoc, all fix-up passes, `build-report.json`) is untouched. Also `git rm content/results/*/index.html` — the generated full pages are superseded.

- [ ] **Step 3: Run the pipeline**

Run: `python3 content/results/_lib/build.py --all` (requires pandoc; it is installed since the committed pages were built with it — if missing, `brew install pandoc`).
Expected: `ok <slug>` for all seven papers, `article.html` present in each `content/results/<slug>/`, PDFs/TeX/prompts in `public/results/<slug>/`.

- [ ] **Step 4: Check the fragments** — each `article.html` starts with `<section class="abstract">` and contains no `<html>`, `<nav>`, or `<footer>` tags: `grep -L '<nav>' content/results/*/article.html` lists all seven.

- [ ] **Step 5: Commit** — `feat: pipeline emits article fragments for Next.js consumption`

---

### Task 8: `/results/[slug]` route

**Files:**
- Create: `app/results/[slug]/page.tsx`, `app/results/[slug]/article.css`, `lib/results.ts`, `components/KatexRenderer.tsx` (client)
- Test: `tests/results.test.ts`

**Interfaces:**
- Consumes: Task 7's `content/results/<slug>/{article.html,meta.json}`.
- Produces: `lib/results.ts` exporting `listResultSlugs(): string[]` (directories under `content/results/` containing `meta.json`, excluding `_lib`) and `loadResult(slug): { meta: ResultMeta; articleHtml: string }` which **throws** if `article.html` or `meta.json` is missing (build must fail loudly per spec). `ResultMeta` typed to the meta.json schema from Task 7.

- [ ] **Step 1: Write failing tests** `tests/results.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { listResultSlugs, loadResult } from "@/lib/results";

it("lists all seven papers and no _lib", () => {
  const slugs = listResultSlugs();
  expect(slugs).toContain("erdos-690");
  expect(slugs).not.toContain("_lib");
  expect(slugs).toHaveLength(7);
});

it("loads meta and fragment", () => {
  const r = loadResult("erdos-486");
  expect(r.meta.title).toMatch(/Erdős Problem 486/);
  expect(r.articleHtml).toContain('<section class="abstract">');
});

it("throws on a missing slug", () => {
  expect(() => loadResult("erdos-000")).toThrow();
});
```

- [ ] **Step 2: Run** `npm test` — FAIL. **Step 3:** implement `lib/results.ts` with `node:fs` reads. **Step 4:** `npm test` — PASS.

- [ ] **Step 5: Build the page**

```tsx
import { listResultSlugs, loadResult } from "@/lib/results";
import { Crimson_Pro } from "next/font/google";
import KatexRenderer from "@/components/KatexRenderer";
import Footer from "@/components/Footer";
import "katex/dist/katex.min.css";
import "./article.css";

const crimson = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export function generateStaticParams() {
  return listResultSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta } = loadResult(slug);
  return { title: `${meta.title} | Multiscalar Intelligence`, description: meta.description };
}

export default async function ResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta, articleHtml } = loadResult(slug);
  // header: eyebrow + badge, title, subtitle, affiliation, links row —
  // markup mirrors results/_lib/template.html lines 36–46; relative links
  // (paper.pdf …) resolve against /results/<slug>/ thanks to trailingSlash.
  // body:
  return (
    <main className={`article-main ${crimson.variable}`}>
      {/* header from meta … */}
      <article className="paper" dangerouslySetInnerHTML={{ __html: articleHtml }} />
      <Footer variant="article" />
      <KatexRenderer />
    </main>
  );
}
```

Header JSX transcribes `template.html` lines 36–48 (eyebrow with `status-badge` + `meta.badge_class ?? "status-proposed"`, title, subtitle, `meta-affil`, links row where http links get `target="_blank" rel="noopener"` and the `↗` suffix, divider).

- [ ] **Step 6: Port `article.css`** — copy `content/results/_lib/article-reference.css` (the old `results/article.css`) into `app/results/[slug]/article.css` essentially verbatim (it is already scoped under `.paper`/`.article-*`; keep it plain CSS per the spec — pandoc output can't carry Tailwind classes). Also port the article-page rules living in `style.css` if any (`.article-main`, `.status-badge`, `.article-*` — check both files).

- [ ] **Step 7: Write `KatexRenderer`** — client component, `useEffect` porting `results/render-math.js` verbatim with imports instead of globals:

```tsx
"use client";
import { useEffect } from "react";
import katex from "katex";
import renderMathInElement from "katex/contrib/auto-render";
```

Same macros (`\e`, `\eps`, `\dd`), same walk of `span.math.inline|display` stripping `\label{…}`, same throwOnError-then-fallback, same auto-render pass for `$`-delimited copy, same `.katex-display` scrollable-fade logic, same `data-katex-failures` attribute (the audit tooling reads it).

- [ ] **Step 8: Verify** — `npm run build`: seven `/results/*` routes generated. Dev server: open `/results/erdos-486/` and `/results/erdos-690/`; math renders (zero KaTeX failures in console), theorem numbers match the PDF spot-checks, `paper.pdf` / `paper.tex` / `prompt.txt` links download, wide equations scroll with the fade.

- [ ] **Step 9: Commit** — `feat: results route rendering pipeline fragments`

---

### Task 9: Retire the old site files

**Files:**
- Delete: `index.html`, `style.css`, `script.js`, `sat-compress.js`, `evals/index.html`, `evals/evals.css`, `evals/evals.js`, `evals/logos.js`, `open-science/index.html`, `CNAME`, `.nojekyll`, `content/results/_lib/article-reference.css`
- Keep: `tools/`, `docs/`, `data/`, `content/`, `public/`, all Next.js files

- [ ] **Step 1: Confirm nothing still references the deleted files** — `grep -rn "style.css\|evals.js\|script.js\|sat-compress.js" app components lib` returns nothing.
- [ ] **Step 2: Delete** with `git rm` (directories `evals/`, `open-science/` should end up empty and gone).
- [ ] **Step 3: Verify** — `npm run build` and `npm test` both pass from a clean tree.
- [ ] **Step 4: Commit** — `chore: remove the static-site files replaced by Next.js`

---

### Task 10: Full verification pass

**Files:** none (verification only; fix regressions found, committing fixes individually)

- [ ] **Step 1: Production build & serve** — `npm run build && npm run start`.
- [ ] **Step 2: Playwright screenshot comparison** against the live site (https://multiscalar.ai). For each of `/`, `/evals/`, `/open-science/`, `/results/erdos-690/`, `/results/erdos-486/` at 1440px and 390px widths: screenshot live vs `http://localhost:3000`, compare visually, and fix any deviation beyond font-rendering noise. (Use the Playwright MCP tools; save screenshots to the scratchpad.)
- [ ] **Step 3: Interaction checklist** — canvas grid reacts to mouse; scroll reveals fire once; evals bench switching, chips, signed bars; compression slider; KaTeX zero-failure attribute (`document.documentElement.dataset.katexFailures === "0"`); every `paper.pdf`/`paper.tex`/`prompt.txt` deep link returns 200.
- [ ] **Step 4: URL parity** — `curl -sI localhost:3000/evals | head -1` style checks: `/evals` → 308 to `/evals/`; `/evals/`, `/open-science/`, all seven `/results/<slug>/` → 200.
- [ ] **Step 5: Commit** any fixes — `fix: <specific deviation>`

---

### Task 11: Vercel deployment readiness

**Files:**
- Create: `README.md` section (or new file) documenting: `npm run dev`, `npm run build`, `npm test`, the paper pipeline (`python3 content/results/_lib/build.py --all` after adding a paper, then commit), and the Vercel setup.

- [ ] **Step 1: Write the README section.**
- [ ] **Step 2: Check for the Vercel CLI** (`command -v vercel`). If present and logged in, offer to run `vercel link` + `vercel deploy`; otherwise document the dashboard flow (import the GitHub repo, framework preset Next.js, no env vars needed) and note that the user flips `multiscalar.ai` DNS when ready. **Do not** perform DNS changes.
- [ ] **Step 3: Commit** — `docs: development and deployment instructions`

---

## Self-review notes

- Spec coverage: routes (Tasks 3, 5, 6, 8), pipeline change (7), shared components (2), styling boundary (8 keeps article.css as plain CSS), error handling (Task 8's `loadResult` throws; evals unknown-provider fallback tested in Task 4), deployment (11), verification (10), URL preservation (Tasks 1, 7, 10). CNAME/.nojekyll removal (9).
- Type consistency: `providerOf`, `BenchData`, `loadResult`, `listResultSlugs`, `buildStops`, `fmtBytes`, `Footer variant` are each defined once and consumed with the same signatures.
- The CSS "port verbatim from named file" instructions are deliberate: the reference files live in the repo until Task 9, and pixel values must come from them, not from this document.
