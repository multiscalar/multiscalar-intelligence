# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary (from 11 Nov 2026): businesses** that want an AI agent working on their own economic workflows: negotiating, pricing, procurement, finance. Their job on the site: understand what Blacksmith does and why it can be trusted with money, then get in touch (the site's call to action everywhere is "Get in touch"; there is no waitlist wording).

Secondary audiences:

- **Researchers** who want to check, build on or join the work: Open Science, the Erdős papers and the research community.
- **AI labs, analysts and press** who read the Economic Intelligence Index and may request the benchmark data (`/data/`).
- **People who want to join the team** in London (Work with us).

**Withdrawn:** model evaluation as a service is no longer offered or shown anywhere on the site (11 Nov 2026). `/evaluate/` redirects to `/data/`.

## Product Purpose

Multiscalar Intelligence is an applied AI lab in London. It researches **economic intelligence**: an AI agent's ability to make good decisions about money and resources when the other side wants something different (negotiating, bidding, pricing, managing cash). The work runs as one loop:

1. **Measure:** the Economic Intelligence Index, one score built from six benchmarks.
2. **Train:** simulated economic environments (markets with counterparties, prices and cash flows), where models are trained with reinforcement learning and rewarded on the economic outcome.
3. **Deploy:** Blacksmith, a private model trained on how a business runs, with spend limits and sign-off on every action.

Success for the site: businesses understand Blacksmith and get in touch; the index and open science make that trust credible.

## Positioning

Headline (from the 11 Nov 2026 deck, adopted on the home page): **"Self-improving AI that runs businesses"**, with "the applied AI lab for economic intelligence" as the descriptor. The mechanism: we turn how organizations operate into environments where AI trains itself (business data → environment generation → RL and post-training → deployment, which starts the next cycle).


The claim: Multiscalar is the lab dedicated to economic intelligence, and it owns the full measure → train → deploy loop for it. General eval companies and frontier labs cannot truthfully claim that focus.

The proof: open science. Proofs, benchmarks and code are public, including results that went against us. Open science backs the claim. It is not a second, competing message.

## Operating Context

- Routes: `/` home, `/evals/` (the index, benchmark pages, dataset request), `/blacksmith/`, `/open-science/` (posts, RSS feed, Erdős result papers at `/results/[slug]/`), `/work-with-us/`, `/contact/`, legal pages.
- The site is in **private preview** behind a password gate on Vercel Preview deployments. `docs/hidden-for-launch.md` lists what is hidden and what is still a placeholder.
- Forms (Blacksmith enquiry, contact, data request) compose an email. There is no backend yet.
- Benchmark data lives in `data/evals/*.json` and is imported at build time. Erdős papers are built by a pandoc pipeline (`content/results/_lib/build.py`).

## Capabilities and Constraints

- Next.js 16 (App Router, a version with breaking changes; read `node_modules/next/dist/docs/` before writing code), React 19, TypeScript, Tailwind CSS v4, deployed on Vercel. Every route is statically generated.
- Math renders with KaTeX. Posts are Markdown (`content/posts/`).
- Terms: "Economic Intelligence Index" (nav label "Index"), "economic intelligence", "economic environments", "Blacksmith", "Open Science".
- Undecided: US versus British spelling. Prose currently uses US forms ("behavior", "organization") with a few "colour"s mixed in.

## Brand Commitments

- Name: **Multiscalar Intelligence** ("Multiscalar" for short).
- Voice: plain, concrete and understated. Short sentences, evidence first, no hype words or superlatives. Say what a model does, not how revolutionary it is. Confirmed as the voice to keep.
- Photography follows `docs/image-style-guide.md`: sunlit, 1970s science-fiction film stills where people and friendly white retro robots work side by side. New images must follow that guide.

## Evidence on Hand

- **Cleared for the site (11 Nov 2026):** research partners Oxford and Together AI; EconSec environments modelled on Shopify, Stripe, Ramp, Odoo and Xero (logos in `public/logos/`); the EconSec accounts-payable episode transcript.
- **Not cleared, keep off the site:** the deck's training result (Gemma 4 31B 37.6% → 45.5% on the Seeded Bargaining Arena), revenue and contracts ("$600K closed", named customers and their logos), and the team slide.

- Partner and affiliation logos in `public/logos/` (Oxford, Stanford, ARIA, Ethereum Foundation, Microsoft, IBM, ESA, Lyft). **Permission to show each one is still unconfirmed** before launch.
- Benchmark results in `data/evals/` (auction, coffee, e-commerce, terms, treasury, vending, zero-sum and others), plus the index.
- Research posts: agent-economy design report (ARIA Arena auction), Erdős problem papers with PDFs, TeX, prompts and verifiers in `public/results/`.
- **Placeholders that must not be presented as real:** example index scores, release dates and costs (`lib/evals/examples.ts`); FAQ answers marked `// EXAMPLE`; legal entity details; social links. There are no testimonials or customer case studies, so do not invent any.

## Product Principles

1. **Blacksmith is the front door.** When pages compete, the path for a business to understand Blacksmith and get in touch wins; the index and the research are its proof.
2. **Every claim has a receipt.** Pair statements about model behavior with the benchmark, paper or data behind them, and show unflattering results too.
3. **One loop, one story.** Measure, train and deploy are steps in a single process, not three products.
4. **Plain words over impressive ones.** If a sentence would work in any AI company's marketing, rewrite it until it could only be about Multiscalar.
5. **Each visitor finds their door quickly.** Labs, businesses and researchers each get a clear next step without having to work out which page is theirs.
