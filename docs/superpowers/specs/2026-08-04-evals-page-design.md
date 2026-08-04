# Evals Page (v0) — Economic Agent Leaderboards on multiscalar.ai

Date: 2026-08-04
Status: draft, awaiting Marcello's review
Repo: `repositories/multiscalar-intelligence` (static site, GitHub Pages, domain multiscalar.ai)

## 1. Goal

Add an intelligence.ai-style leaderboard section to multiscalar.ai that positions Multiscalar as the curator of economic-agent evaluation. v0 is **display-only**: no new eval runs, zero API spend. It shows three benchmarks:

1. **Exploitability** (ours): results from "Profit is the Red Team" (arXiv:2603.20925), re-normalized for cross-game comparability.
2. **TERMS-Bench** (Stanford): negotiation competence, snapshot of their public results.
3. **Vending-Bench 2** (Andon Labs): long-horizon business coherence, transcribed from their public leaderboard.

Narrative carried by the sidebar: *Can it negotiate? Can it run a business? Can it be exploited?* Ours is the only bench measuring the failure mode that costs money, and it's listed first.

Audience: investors and researchers landing from the deck or socials. Success = the page reads as a credible, ongoing benchmark platform, not a paper screenshot.

## 2. Placement, deploy, staging

- New page `evals/index.html` (served at `multiscalar.ai/evals/`).
- Built on branch `evals-v0`, previewed locally (`python3 -m http.server`).
- **Dark launch**: merge to main with the page reachable at /evals/ but NOT linked from the site nav. Production release = a later one-line commit adding the "Evals" nav tab.
- No new infra, no build step; GitHub Pages serves static files from main as today.

## 3. Page structure

Layout grammar copied from intelligence.ai (see reference screenshot), skinned with the existing multiscalar.ai stylesheet (reuse CSS variables, fonts, card styles from `style.css`; do not import intelligence.ai's cream theme).

- Page title: "Economic Agent Leaderboards".
- Left sidebar: 3 selectable bench entries (radio-list style): Exploitability, TERMS-Bench, Vending-Bench 2. Selecting swaps the main card. Default selection: Exploitability.
- Main card, per bench:
  - Bench title + one-line question it answers.
  - Source badge: "by Multiscalar (arXiv:2603.20925)" / "by Stanford" / "by Andon Labs", linked to source.
  - Vertical bar chart (see §5), with a metric/game toggle top-right where applicable.
  - Two-sentence methodology blurb + "results as of <date>" stamp.
- Mobile: sidebar collapses to horizontal chips above the card; chart scrolls horizontally inside its container.
- Vanilla HTML/CSS/JS, consistent with the rest of the repo (no framework).

## 4. The three cards

### 4.1 Exploitability (flagship, default)

Data: the four result tables of arXiv:2603.20925 (ultimatum bargaining, first-price auction, bilateral trade, provision-point game). 6 target models: GPT-OSS-120B, Qwen3-32B, MiniMax-M2.5, GLM-4.6, Kimi-K2, GPT-5.2. Attacker fixed to GPT-5.2, TAP-optimized (paper §attacker).

Metric (cross-game normalization): for game g with feasible joint surplus S_g, and paper-reported mean attacker surplus baseline b and red-teamed r:

    exploitability_g(model) = (r − b) / S_g × 100   (percentage points of the pie additionally extracted by the optimized adversary)

Feasible surpluses: ultimatum S=40 (R=100 − 30 − 30); auction S=30 (v=30); bilateral trade S=40 (80 − 40); provision-point S=40 (70 + 70 − 100).

Views (toggle): **Overall** = unweighted mean of the 4 games (default), plus one view per game. Sorted most-robust (lowest) first. Bar label = the percentage, e.g. "47%".

Faithfulness rules:
- Only numbers derivable from the published tables. No target-side surplus (not derivable from attacker means), no invented error bars on the overall view.
- Footnote: "Attacker strategies were optimized per-target (adaptive upper-bound search). Lower is better."
- Roadmap note under the chart: "Frontier panel (Claude, Gemini, Grok, ...) coming in v1."

### 4.2 TERMS-Bench (Stanford)

Data: snapshot of `https://terms-bench.github.io/data.js` (public, auto-generated file; ~10 models incl. Claude Opus 4.6/4.7, GPT-5.5, Gemini 3.1 Pro, Grok 4.20, DeepSeek V4, GLM-5.1, Kimi K2.6).

Display: their two headline metrics as separate toggle views, **SE+** (feasible surplus efficiency, default) and **AGR+** (feasible agreement rate). No composite (matches their own "no composite score" stance). Attribution line links to their site; blurb states results are Stanford's, snapshot date shown.

### 4.3 Vending-Bench 2 (Andon Labs)

Data: net worth ($) per model, transcribed from their public page (data embedded in page HTML; extraction script in §6, manual fallback acceptable).

Display: single metric (Net worth $), no toggle.

## 5. Chart spec (shared component)

One reusable render function (`evals/evals.js`) drawing intelligence.ai-style bars:

- Show **top 12 models max** per view.
- **Tail effect**: if the source has more models than shown, render a dashed vertical separator, then one final bar for the worst performer with its rank badge (e.g. "#27"), exactly the screenshot effect, plus a "+N more at source ↗" link.
- Bars: value label above/inside top, model name (2 lines max) below, provider favicon-style dot optional (skip logos in v0 to avoid trademark fuss; use colored initial chips).
- Height encodes the displayed metric; for Exploitability (lower = better) the sort is ascending and the axis label says "lower is better". Do not invert into a synthetic "robustness score".
- Both light/dark friendly using the site's existing palette variables.
- Implementation note: load the `dataviz` skill before writing chart code.

## 6. Data pipeline

- `evals/data/exploitability.json`, `terms-bench.json`, `vending-bench-2.json`. Shared schema:

```json
{
  "bench": "terms-bench",
  "source": {"name": "Stanford", "url": "https://terms-bench.github.io/", "snapshot": "2026-08-04"},
  "metrics": [{"id": "se_plus", "label": "SE+", "unit": "%", "higherIsBetter": true}],
  "models": [{"name": "Claude Opus 4.7", "scores": {"se_plus": 0.81}}]
}
```

- Exploitability JSON additionally carries per-game scores and the S_g constants; overall computed client-side.
- `tools/fetch_terms_bench.py` and `tools/fetch_vb2.py`: regenerate the two external JSONs from their public pages (curl + parse). Run manually when sources update; commit the JSON. Paper JSON hand-written once from the TeX tables.
- Every card renders `source.snapshot` so staleness is visible, honest, and cheap to update.

## 7. Attribution and etiquette

External numbers are facts displayed with prominent attribution and links (Epoch-style curation). Blurbs explicitly say "results by <org>, displayed with attribution". If either org objects, the card degrades to a link-out card; no dependency on their goodwill for our own bench.

## 8. Out of scope (v0)

New eval runs; frontier-panel extension of Exploitability (v1, frozen-attack transfer evaluation, est. ~$100); submission form; Elo; cross-bench composite table; methodology subpages; provider logos.

## 9. Files

- Add: `evals/index.html`, `evals/evals.css`, `evals/evals.js`, `evals/data/*.json`, `tools/fetch_terms_bench.py`, `tools/fetch_vb2.py`, this spec.
- Modify (production release only): `index.html` (nav tab "Evals").

## 10. Acceptance checklist

- [ ] /evals/ renders all three cards from local JSON with correct numbers vs sources.
- [ ] Exploitability overall = mean of 4 normalized games; spot-check GPT-5.2 by hand.
- [ ] Top-12 cap + tail-outlier bar works on TERMS/VB2 views.
- [ ] Page passes mobile width 375px without horizontal body scroll.
- [ ] No nav link to /evals/ on main site (dark launch).
