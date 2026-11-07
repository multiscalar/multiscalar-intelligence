# Hidden for the private preview

Everything taken off the site while it is in private preview, and how to
bring each part back. Keep this list up to date whenever something is hidden.

## Switches

In `lib/launch.ts`. Set a switch to `false` to show that part again.

| Switch | What it hides | Hidden on |
| --- | --- | --- |
| `homeIndexSection` | The dark "We measure how well AI handles money" section on the home page (`components/home/Leaderboards.tsx`), with the benchmark cards. An Open Science photo card (the library reading-room photo, with links to the papers and posts) takes its place. | 19 Oct 2026 |

Shown again on 22 Oct 2026, for the video: `evalsInHeader` (the Evals menu)
and `evalsLinks` (every link to the evals, the Treasury-Bench banner, the
benchmark cards on research pages). Set them back to `true` to hide them again.

## Removed or moved (not a switch)

| What | How it was hidden | To bring it back |
| --- | --- | --- |
| Careers page | Folder renamed `app/careers` → `app/_careers`, so Next.js doesn't publish it. Removed from the Company menu (`lib/nav.ts`), the sitemap (`app/sitemap.ts`), the footer ("Work with us" now says "Explore the index"), the About page buttons and the Contact page intro. `lib/careers.ts` is kept. | Rename the folder back to `app/careers`, then re-add the links in those places. |
| RSS feed link | Removed from the Open Science menu and the Open Science page header. The feed itself (`/open-science/feed.xml`) still works and is linked in every page's head. | Re-add the "RSS feed" item in `lib/nav.ts` and the `link` on the "All posts" header in `app/open-science/page.tsx`. |
| "Example data" tags | No longer shown on charts. `ChartCard` still takes an `example` prop that records which charts use placeholder data. | Only relevant if placeholder data goes public: show the tag again in `components/evals/ChartCard.tsx`, or replace the data. |

## Password gate

- On while `SITE_PASSWORD` is set (Vercel, Averta → multiscalar-intelligence → Environment Variables, Preview only).
- Delete the variable and redeploy to open the previews. Production never had it.
- Code: `proxy.ts`, `lib/access.ts`, `app/unlock/`, `app/api/unlock/`. Can stay in place after launch: without the variable it does nothing.

## Before launch (placeholders, not hidden)

- Example index scores, release dates and costs (`lib/evals/examples.ts`)
- FAQ answers marked `// EXAMPLE` (`lib/faq.ts`)
- Privacy and Terms placeholders: legal entity, company number, address, retention period (`app/privacy/`, `app/terms/`)
- X, LinkedIn and Discord links still `#` (`lib/social.ts`)
- News articles starting "Placeholder article." (`content/news/`)
- Favicon is still the ◆ emoji (`app/layout.tsx`)
- Permission to show each partner logo (`public/logos/`)
