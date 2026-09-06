# multiscalar.ai

The Multiscalar Intelligence website: a Next.js (App Router, TypeScript) +
Tailwind CSS v4 app, deployed on Vercel.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # vitest unit tests (lib/)
npm run build    # production build; statically generates every route
```

## Structure

- `app/` - routes: `/` (home), `/evals/`, `/open-science/`,
  `/results/[slug]/` (Erdős papers, statically generated).
- `components/` - Nav, Footer, GridBackground (canvas dot grid), Reveal
  (scroll animations), the evals Leaderboard, CompressDemo, KatexRenderer.
- `lib/` - typed data access: evals benchmarks, provider identity,
  results loader, compression-demo stops.
- `data/evals/*.json` - benchmark results, imported at build time.
- `content/results/<slug>/` - paper sources (LaTeX, aux, meta.json) and the
  pipeline-generated `article.html` fragments.
- `public/results/<slug>/` - served artifacts (PDF, TeX, prompt, verifier),
  copied there by the pipeline.
- `tools/` - data-fetching and cost-estimation utilities (unrelated to the
  site build).

## Publishing a new Erdős paper

1. Create `content/results/erdos-NNN/` with `paper.tex`, `paper.aux`
   (regenerate with `tectonic -X compile paper.tex --keep-intermediates
   --untrusted`), `prompt.txt`, `paper.pdf`, and a `meta.json` (copy an
   existing one for the schema; local files named in `links` are copied to
   `public/` and served).
2. Run the pipeline (requires pandoc):

   ```bash
   python3 content/results/_lib/build.py erdos-NNN   # or --all
   ```

   It writes `article.html` next to the sources and copies the linked
   artifacts into `public/results/erdos-NNN/`. A build with problems prints
   `WARN` lines - fix them before publishing.
3. Commit and push; the new route appears automatically via
   `generateStaticParams`.

## Deployment (Vercel)

Import the GitHub repo into Vercel (framework preset: Next.js; no
environment variables needed). Production branch: `main`. Point
`multiscalar.ai` DNS at Vercel when ready to cut over from GitHub Pages -
until then the old Pages deployment keeps serving the previous site.
