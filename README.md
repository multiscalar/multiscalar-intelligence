# multiscalar.ai

The Multiscalar Intelligence website: a single landing page, built with
Next.js (App Router, TypeScript) and deployed on Vercel.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Deployment (Vercel)

Pushes to `dev` get a Vercel preview deployment; pushes to `main` deploy
production. Other branches are not deployed (`vercel.json`).

## Structure

- `app/page.tsx`: the landing page; `app/layout.tsx`: metadata and font
  (Montserrat); `app/globals.css`: all styles, including the background
  (`public/port.webp`, framed inside the window). The photo file is already
  edited: mirrored so the sea is on the right, toned black to orange, and the
  sea faded to black so the text stays readable.
- `components/Landing.tsx`: the logo, the bottom-right dock (home, Company,
  Research and Contact panels, switched in place via `#hash`) and the
  scrolling partner logos along the bottom (`public/logos/`).
- `next.config.ts`: redirects every section of the previous site to `/`.
- `assets/brand/`: wordmark source files; `public/brand/wordmark.svg` is the
  one on the page.
