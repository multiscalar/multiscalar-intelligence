# Site plan: structure and pages

Status: phase 1 built on 11 Nov 2026 (header, footer, `/evaluate/`, Index reorder, benchmark pages). Phases 2–5 not started. Written 11 Nov 2026 from an audit of the current `site-redesign` branch and a teardown of comparable sites (AI labs: Anthropic, Sakana, Thinking Machines, Mistral; applied-AI products: Sierra, Harvey, Decagon; agent-economics and index peers: Andon Labs, Prime Intellect, Artificial Analysis, Epoch AI).

It follows `PRODUCT.md`. The primary visitor is an AI lab or enterprise deciding whether to trust the index and commission an evaluation or license data. The visual world in `DESIGN.md` ("The Sunlit Research Lab") **evolves**: the photography and brand stay recognisable, while type, colour use and layout may change where that improves the site.

## 1. What the audit found

| Page | Works | Doesn't work |
| --- | --- | --- |
| Home | Strong hero photo and clear claim. The index snapshot is the best block on the site. | The story is told three times ("Our field", "Measure, train, deploy", "Start here"). The only proof is the logo strip and six bars. Nothing on the page is newer than its hero. |
| Index (`/evals/`) | Rich charts (capabilities, cost, progress), benchmark cards, methodology and FAQ. | The scores sit about two screens down, behind a photo hero and a statement paragraph. The page has no version number or update date, nothing to cite and no data access. "Evaluate your model" appears only at the very bottom. |
| Benchmark pages | Already the best pattern on the site: stats strip, then the leaderboard, a time series, cost and FAQ. | There's no citation, no "run your model on this" path and no visible methodology or prompt. Some sections fade in only once they scroll into view. |
| Blacksmith | Honest "in development" framing. The cycle diagram is a real explanation. | The product video is a mock-up and the three trust blocks are claims with nothing behind them. The page never connects Blacksmith to the index's evidence of how models fail with money, which is the one argument a competitor can't make. |
| Open Science | Good lead post and real papers. | It's a flat list with no types (paper, benchmark, report, post), no grouping by programme, no code or data links and no venue badges. |
| Work with us | Clear pitch and three-part loop. | It repeats the home page. There's no process, no location or way-of-working facts, and applying means writing an email. |
| Contact | Short form. | It's the only route into an evaluation conversation, and it says nothing about what an evaluation is. |

The biggest structural gap: **the main commercial offer (evaluate your model, license the data) has no page of its own.** It appears only as a contact-form topic and a dataset request form.

## 2. Patterns worth borrowing

- **One nav item per offering.** Small labs name their offerings in the nav (Thinking Machines: Inkling, Tinker, Connectionism; Andon: Pion, Evals, Publications). None of the 13 sites has a header button for commissioning evaluations, so Multiscalar can own that slot.
- **Benchmarks as a dropdown**, each with its own permanent URL (Andon, Epoch).
- **Home page as one band per audience**, each ending in its own CTA: thesis, then credibility, then offerings, then research, then hiring (Sakana, Andon).
- **Eval cards that read as a question plus its leader**: "Can the agent run a business over a long horizon? Highest score: Claude Opus 5" (Andon).
- **Index page signals of rigour:** a version number in the title, "Updated" dates, example tasks showing what the score measures, methodology in three layers (summary, FAQ, full method), citation with copy, data downloads and licence (Artificial Analysis, Epoch).
- **A commissioning page that lists the kinds of work, then past work, then a 4-field form** (Epoch's consultations page). This is the closest template for "evaluate your model".
- **Product page order:** claim, then problem, then three capability bands, then proof, then security and controls, then CTA (Harvey's Vault page). Controls get a band of their own, and sometimes a nav item.
- **The latest release surfaced with a small "New" pill or the announcement bar**, so the page doesn't need restructuring every time.

What to avoid: deep mega-menus (Harvey), repeated near-duplicate sections (Decagon), archive pages poorer than the home page (Sakana), and commercial paths hidden in the footer (Artificial Analysis).

## 3. Site map

```
/                       Home                              Persuade
/evals/                 Economic Intelligence Index       Read (data-first)
/evals/<benchmark>/     Benchmark pages (6 + upcoming)    Read
/evals/methodology/     Full methodology        NEW       Read
/evaluate/              Evaluate your model & data NEW    Persuade (convert)
/blacksmith/            Blacksmith                        Persuade
/open-science/          Research index                    Read
/open-science/<slug>/   Posts and papers                  Read
/results/<slug>/        Erdős papers (unchanged)          Read
/work-with-us/          Careers + research community      Persuade
/contact/               Contact, routed by intent         Operate
/privacy/ /terms/       Legal (unchanged)
```

`/evals/request-dataset/` folds into `/evaluate/#data` and redirects there.

**Header nav:** Index ▾ · Blacksmith · Open Science · Work with us, with **"Evaluate your model"** as the header button in place of "Contact us".
- The Index dropdown lists the overview, each benchmark by name with its one-line question, Methodology, and Data & licensing. It replaces today's flat link and stays compact (one panel, no promo slot).
- Contact moves to the footer and to every page's closing band. The header button serves the primary visitor.

**Footer:** Index (Overview, Benchmarks, Methodology, Data & licensing) · Blacksmith (Overview, Join the waitlist) · Open Science (All research, Erdős results, RSS) · Company (Work with us, Contact) · legal row.

## 4. Pages

### Home: "what this lab is, and proof it's real"

1. **Hero.** Keep the photo and the claim. Remove the duplicated "Our field" paragraph and fold its key sentence into the subhead. Add a "New" pill above the title linking to the latest post or benchmark, so the announcement bar can drop the job. Two CTAs: *Explore the index* (primary) and *Evaluate your model*.
2. **Logo strip.** Unchanged, pending permission for each logo.
3. **Index band (moved up to second).** The dark panel with the top models, plus a row of six question cards, one per benchmark ("Can the agent negotiate a good price? Leader: …"), each linking to its benchmark page. This is the home page's proof and the front door.
4. **One loop, three doors.** Merge "Measure, train, deploy" and "Start here" into one band of three rows. Each row is a step of the loop, the audience it serves and that audience's CTA:
   - Measure → AI labs and enterprises → *Evaluate your model*
   - Train → researchers → *Read our research*
   - Deploy → businesses → *Join the Blacksmith waitlist*
   One block instead of two, and no repeated story.
5. **Latest research.** Three items, each with a type label (Paper, Benchmark, Report, Post), date and one-line result.
6. **Closing band.** "See how your model performs as an economic agent" with the evaluation CTA and a link to the short form on `/evaluate/`.

Removed: the "Our field" statement section and the standalone "Start here" block (merged into item 4).

### Index (`/evals/`): "the scores, first"

1. **Compact header**, no full-height photo: "Economic Intelligence Index **v1**" (version still to be set), a one-line definition, an "Updated <date>" label, and actions *Evaluate your model* and *Methodology*. Photography moves to the closing band and a thin strip at most.
2. **Leaderboard immediately.** The existing capability panel (Overall / Valuation / Strategy / Planning / Security / Discovery tabs and the radar chart) becomes the first viewport, with a stats line (models scored, benchmarks, capabilities). Rows link to each model's results across benchmarks if model pages are built later; until then they don't link anywhere.
3. **What the index measures.** One example task per capability, drawn from the real benchmark samples the site already has (`SamplesViewer` / `TraceViewer` data). Replaces the "Why an index" paragraph.
4. **Benchmarks.** The existing cards, reworded as question plus leader.
5. **Cost** and **Progress** charts (unchanged content).
6. **Methodology, layer 1.** A short summary of weighting and inclusion with a link to `/evals/methodology/` (layer 3). The FAQ is layer 2.
7. **Cite and access the data.** BibTeX with a copy button, data downloads if licensing allows (open decision), a changelog of index updates.
8. **Commission panel.** "Run your model before release" and "License the data", both linking to `/evaluate/`, on the page itself rather than only at the bottom.
9. FAQ, then the closing photo band.

The section nav (Scores · Measures · Benchmarks · Cost · Progress · Methodology · Data · FAQ) stays sticky.

### Benchmark pages

Keep the current order (stats, leaderboard, time series, cost, FAQ, similar benchmarks) and add three things, following Andon's single-URL "complete research artefact":
- **How it's scored.** Rules, starting conditions and the system prompt, in an expander. Samples and traces where they already exist.
- **Cite this benchmark**, with BibTeX and attribution for external benchmarks.
- **"Run your model on <Benchmark>"**, a small panel linking to `/evaluate/` with the benchmark preselected.

Also: content must be visible without scroll-triggered reveals (today some sections stay faded until they scroll into view).

### Evaluate (`/evaluate/`), new: "what we can do for your model"

The page that's missing today. It follows Epoch's consultations pattern: kinds of work, proof, short form.

1. **Header.** "Know how your model behaves with money at stake" and the form anchor.
2. **Three offers**, each with what you send, what you get back and the format:
   - **Pre-release evaluation:** your model run through the six index benchmarks, privately.
   - **Custom economic environment:** a benchmark built for your use case.
   - **Data licensing:** the full transcripts and results behind the public leaderboards.
3. **What a report looks like.** A real excerpt, or a labelled sample built from public results.
4. **How it works.** Steps and timing.
5. **Why trust it.** Public leaderboards, open methodology, published results including ones that went against us, partner logos once permission is confirmed. No invented clients or testimonials.
6. **Form.** Name, work email, organisation, which offer, message. Same backend situation as today (composes an email).

Facts for sections 2–4 (turnaround, deliverables, privacy terms, pricing model) must come from you.

### Blacksmith: "the model that's allowed to touch money"

Harvey's product sequence, honest about being in development:
1. **Hero.** Keep the claim and *Join the waitlist*, with an "In development" status. Product visual labelled as illustrative ("Acme Industrial is fictional" stays).
2. **The problem, with our own evidence.** What the index shows about general models handling money: real numbers from the benchmarks (for example the auction result where models broke their own deals). This is the argument no competitor can copy.
3. **How it works.** The cycle diagram (keep it).
4. **Controls.** Spend limits, sign-off on every action, data stays with you, you own the model. Stated as design commitments of a product in development, not as certifications.
5. **FAQ.** Timeline, who it's for first, how pricing will work (or "not decided yet").
6. **Waitlist form** (keep).

### Open Science: "a research programme, not a blog"

1. **Header.** Keep "Science in the open" plus the approach paragraph, shortened.
2. **Programmes.** Cards for Market design, Open problems (the Erdős series) and Benchmarks, each with a one-line description and an item count (Anthropic's team cards).
3. **Featured.** The latest item, large (as today).
4. **All research.** A list with type filter (All · Papers · Benchmarks · Reports · Posts) and counts. Each row shows date, type, programme, title, one-line result, and links to PDF, code and data where they exist. Add venue badges if any work is accepted somewhere.
5. **Community band** (keep).

### Work with us

1. **Pitch** (keep).
2. **What you would work on.** Keep the three cards, but make them about the work, not a repeat of the home page's loop.
3. **How we work.** Facts: location and in-office policy, team size, how hiring works (steps, timing). Andon even shows salary and equity ranges.
4. **Open areas.** If there are no fixed roles, list two or three areas you're hiring into.
5. **Apply.** A short form (name, email, links, what you'd build) instead of "write to us".
6. **Research community**, a secondary band (moved here from being the only Open Science CTA).

### Contact

Route by intent before the form: three cards (Evaluate a model → `/evaluate/`, Blacksmith → waitlist, Research and press → this form), then the existing form and FAQ.

## 5. How the look evolves

These are directions only. The actual visual decisions run through Impeccable's direction round before any code.

- **Photography becomes a reward, not a gate.** Full-height photo heroes stay on Home, Blacksmith and Work with us. Working pages (Index, benchmarks, research) open with a compact header so data or content is in the first viewport.
- **Data gets its own voice.** Numbers, version labels, dates and citations get a consistent data style (tabular figures, possibly a mono face), so rigour shows at a glance.
- **Terracotta earns a job.** It marks "new", the current leader and the one highlighted series. That way the accent signals something instead of being absent outside charts.
- **One closing pattern.** Every page ends on the same closing band, with the CTA for that page's audience.
- **Content visible by default.** Reveal-on-scroll animation never hides content from people who don't scroll smoothly, from screenshots or from crawlers.

## 6. Facts needed before building

1. **The evaluation offer:** what's included, turnaround, what the report contains, confidentiality terms, and whether you name a pricing model or keep "talk to us".
2. **Data licensing:** what can be downloaded publicly (if anything), under what licence, and what is paid.
3. **Index version and update cadence:** for example "v1, updated monthly".
4. **Partner logos:** which ones have permission (already on the launch list).
5. **Hiring facts:** location policy, process, open areas, and whether to show compensation ranges.
6. **Blacksmith:** first workflows or industries, timeline wording, and pricing stance.
7. **Naming:** keep "Open Science" as the nav label, or use "Research"? (Recommendation: keep it. It's the proof of the positioning.)

## 7. Build order

Each phase ends with `/impeccable critique` on what changed.

1. **Front door.** Header nav and button, footer, `/evaluate/`, Index page reorder, benchmark page additions.
2. **Home.** New sequence (merged loop/doors band, benchmark question cards).
3. **Blacksmith.** Evidence band and controls band.
4. **Open Science.** Programmes, filters, type labels.
5. **Work with us and Contact.**

Phase 1 can start with placeholders clearly marked where the facts in section 6 are missing, but nothing ships with invented claims.

## Phase 1 decisions (11 Nov 2026)

- **No separate methodology page.** `/evals/methodology` was folded into the Index page earlier the same day (redirect in `next.config.ts`), so methodology stays a section there.
- **`/evaluate/` offers two things, not three.** "Custom economic environment" was dropped because nothing on the site commits to it. "Early access to upcoming benchmarks" was dropped because the FAQ answers behind it are marked `// EXAMPLE`. The upcoming-benchmark pages still say "Get early access" and now link to `/evaluate/`.
- **No index version number.** Releases are identified by date ("Release of 3 November 2026"), which is how the FAQ already describes them.
- **No turnaround, price or confidentiality wording**, because none is decided.
- **Eyebrows removed** from section headers, chart cards, closing cards, the FAQ and the index panel (DESIGN.md "No-Eyebrow Rule"). Hero eyebrows on Home, Blacksmith and Work with us are left for their phases.
- **Reveal-on-scroll never hides content** that is already on screen, or when JavaScript, motion or the observer is unavailable.
