---
name: Multiscalar Intelligence
description: Applied AI lab researching economic intelligence; calm, sunlit, evidence-first.
colors:
  paper: "#f8f8f7"
  paper-raised: "#ffffff"
  hairline: "#e4e4e4"
  ink: "#1a1a1a"
  ink-secondary: "#4d4d4d"
  ink-dim: "#6b6b6b"
  instrument-black: "#141311"
  projector-black: "#161513"
  cream: "#f2ebdd"
  sand: "#ece6dc"
  umber: "#8a7d6a"
  umber-deep: "#5c5348"
  ember: "#eadcc5"
  ember-hover: "#f2e8d8"
  ember-deep: "#7d5e3b"
  ember-soft: "#f3ece0"
  ember-ink: "#141311"
  terracotta: "#d9774a"
  terracotta-soft: "#e08a5f"
  terracotta-deep: "#c2683e"
  stone: "#a8a39a"
  verified-green: "#16a34a"
typography:
  display:
    fontFamily: "Montserrat, -apple-system, sans-serif"
    fontSize: "clamp(2.2rem, 4.2vw, 3.6rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Montserrat, -apple-system, sans-serif"
    fontSize: "clamp(1.9rem, 3.2vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Montserrat, -apple-system, sans-serif"
    fontSize: "clamp(1.3rem, 2vw, 1.7rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  lede:
    fontFamily: "Montserrat, -apple-system, sans-serif"
    fontSize: "1.075rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Montserrat, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Montserrat, -apple-system, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.005em"
  data:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  hairline: "4px"
  field: "12px"
  card: "20px"
  frame: "28px"
  pill: "9999px"
spacing:
  frame-inset: "12px"
  gutter: "32px"
  gutter-phone: "24px"
  container: "1200px"
  section: "7rem"
  section-phone: "4.5rem"
components:
  button-primary:
    backgroundColor: "{colors.ember-ink}"
    textColor: "{colors.ember}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    typography: "{typography.label}"
  button-primary-on-image:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.ember-ink}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-ghost-on-image:
    textColor: "{colors.paper-raised}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  chip:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  field:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "12px 16px"
  card-sand:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.ink}"
    rounded: "{rounded.frame}"
  panel-dark:
    backgroundColor: "{colors.projector-black}"
    textColor: "{colors.cream}"
    rounded: "{rounded.frame}"
  tooltip:
    backgroundColor: "{colors.instrument-black}"
    textColor: "{colors.paper-raised}"
    rounded: "{rounded.field}"
    padding: "8px 12px"
---

# Design System: Multiscalar Intelligence

## Overview

**Creative North Star: "The Sunlit Research Lab"**

Calm daylight falls on serious work. The photography sets the mood: sunlit, faded 1970s science-fiction film stills where people and friendly white retro robots work side by side (see `docs/image-style-guide.md`). The interface stays out of the way. It looks like a well-kept lab: pale paper, near-black ink, one typeface, and numbers shown with care.

Pages alternate between three surfaces. **Paper** (off-white) carries reading and data. **Photographic frames** (full-bleed images inset from the viewport with large rounded corners) carry atmosphere. **Projector panels** (warm near-black with film grain, vignette and cream text) are the photography's shadows turned into surface. They hold the dark sections, such as the index snapshot and the evals hero areas. Sand cards are a warm middle tone for invitations and calls to action.

Density is low and the type is restrained. Headlines are semibold with tight tracking and never shout. Labels are small and sentence case. Depth comes from tone and imagery, not shadows. Terracotta is the one hue with real saturation and is used sparingly.

**Key Characteristics:**
- Photography as the source of warmth; UI stays neutral around it.
- Three surfaces: paper, photographic frame, projector panel (plus sand for invitations).
- One sans family (Montserrat) at 400–600, with tight negative tracking on headings; IBM Plex Mono only for data.
- Pill-shaped controls, big soft frame corners (28px), no decorative shadows.
- Ember (cream) as the warm accent: buttons, lit states on dark, and the full-bleed bands where the visitor acts; green only for "verified/new" status.

## Colors

A warm-neutral palette: off-white paper, ink with a hint of warmth, cream and umber borrowed from the photographs, and one terracotta accent.

### Primary
- **Ember** (`ember`): the brand's warm cream accent; see The Ember Rule. `ember-deep` (bronze) for accents on paper, `ember-soft` for selection, `ember-ink` for text on cream.
- **Terracotta** (`terracotta`): the same hue in data: In charts it marks the series or result to look at (one highlighted lab, bidders' profit). Outside charts it may mark a single key highlight per view. Never a fill for large areas, never a button background.
- **Soft Terracotta** (`terracotta-soft`): the same signal on dark panels and for "loss" values in the leaderboard, where the base tone is too heavy.
- **Deep Terracotta** (`terracotta-deep`): terracotta as text on light surfaces (negative deltas, emphasised figures), where the base tone lacks contrast.

### Neutral
- **Paper** (`paper`): page background everywhere.
- **Raised Paper** (`paper-raised`): fields, menus, chips, primary buttons on images.
- **Hairline** (`hairline`): dividers and borders on paper. Black at 7–15% opacity is used interchangeably for borders on white surfaces.
- **Ink** (`ink`): body text and primary buttons. Headings go to pure black.
- **Secondary Ink** (`ink-secondary`) and **Dim Ink** (`ink-dim`): supporting copy and section labels.
- **Instrument Black** (`instrument-black`): the "ink" of data: chart lines, frontier markers, bars, and the background of every chart tooltip.
- **Projector Black** (`projector-black`): the base of dark panels, always with grain and vignette (see Elevation & Depth).
- **Cream** (`cream`): replaces white inside dark panels. The `panel-dark` utility remaps `--color-white` to it, so every white utility inside a panel becomes cream.
- **Sand** (`sand`): warm card fill for the "Start here" block and the index step card.
- **Umber** (`umber`) and **Deep Umber** (`umber-deep`): labels and body text on sand.
- **Stone** (`stone`): neutral bars in charts next to a highlighted terracotta series.

### Status
- **Verified Green** (`verified-green`): only for "new" or "verified" tags on research posts and papers. Not a general success color.

### Named Rules
**The Borrowed Light Rule.** Dark and warm tones come from the photographs: shadows become projector black, highlights become cream, wood and paper become sand and umber. Don't introduce a hue the photography doesn't contain.

**The Ember Rule.** Ember is the brand's warm accent, a cream (`#eadcc5`), and it has four jobs only: (1) primary buttons: on the light page they are ink with cream text, on photographs and dark panels they are cream with ink text; (2) lit states on dark ground: the index leader's bar, the active training-loop stage, the decision icons, the "New" badge; (3) focus rings and selection, which on the light page use ember-deep (bronze) and ember-soft; (4) the full-bleed bands where the visitor acts (announcement bar, home "Work with Multiscalar", Blacksmith "Get in touch", the /data/ request), cream with ink text. Small accents on the light page (tags, progress, counts) use ember-deep. Cream with none of these jobs is wrong.

## Typography

**Display Font:** Montserrat (with -apple-system, sans-serif)
**Body Font:** Montserrat
**Label/Mono Font:** IBM Plex Mono, for data only

**Character:** One geometric sans carries everything, kept quiet through weight (never above 600) and tight tracking on headings. Plex Mono appears only where numbers need to line up: chart tooltips, chips, traces, figures.

### Hierarchy
- **Display** (600, `clamp(2.2rem, 4.2vw, 3.6rem)`, 1.08, −0.035em): hero titles on photographic frames, always white on the darkened image. Max ~640px wide.
- **Headline** (600, `clamp(1.9rem, 3.2vw, 2.75rem)`, 1.1, −0.035em): section headings and benchmark titles. Black on paper, white on panels. Max ~640px.
- **Title** (600, `clamp(1.3rem, 2vw, 1.7rem)`, 1.2, −0.025em): card and row headings, audience statements. Card names on photos run around 1.5rem.
- **Statement** (600, `clamp(1.4rem, 2.2vw, 1.95rem)`, 1.28, −0.025em): the home page's field statement, revealed word by word on scroll.
- **Lede** (400, 1.075rem, 1.6): the paragraph under a headline. Max ~580px. 60% ink on paper, 65% cream on panels.
- **Body** (400, 1rem, 1.7): running text. Article bodies are capped near 65–75ch.
- **Label** (500, 0.85rem, 1.4, −0.005em, **sentence case**): menu headings, side labels in label-left rows, form labels, metadata ("Release 3 November 2026"), buttons. Usually dim ink. Never an eyebrow above a heading.
- **Data** (Plex Mono, 0.6–0.72rem, tabular figures): tooltips, chips, axis notes.

### Named Rules
**The No-Eyebrow Rule.** Headings carry their own weight: no small label above a section heading or hero title. A label above a title is allowed only when it carries information (a status, a "New" link, a back link).

**The Sentence-Case Rule.** Labels are small sentence-case text at weight 500. Uppercase is reserved for the wordmark (nav, footer, unlock page; 0.15em tracking), tiny status tags such as "Coming soon" and post badges (0.62rem, semibold), and the academic typography inside Erdős paper articles.

**The 600 Ceiling Rule.** No weight above 600 anywhere. Hierarchy comes from size and tracking, not from bold.

## Layout

- **Container:** 1200px, centred, with 32px side gutters (24px on phones at ≤768px).
- **Frames:** full-bleed sections (hero, Start here, dark panels) sit inside the viewport with a 12px inset (8px on phones) and rounded corners, so the page reads as a stack of framed cards on paper.
- **Hero:** full viewport height minus the inset (82svh on inner pages, `short`), content anchored bottom-left with a darkening gradient behind it. The nav overlays the hero and switches to dark-on-paper once scrolled past.
- **Section rhythm:** one vertical value for the whole site, `--section-space` (7rem, 4.5rem on phones), applied through the `section-y`, `section-t`, `section-b` and `section-mt` utilities. Section headers have 48px below them (32px on phones).
- **Grids:** three equal columns for step cards, collapsing to one column at 900px. Label-left statement rows use a 200px label column, stacking at 960px. Audience rows are three columns (who/need, body, actions) on a top hairline.
- **Breakpoints in use:** 480, 720 (nav collapses to the mobile menu), 768 (gutters, radii and spacing tighten), 900/960 (grids collapse).
- **Sticky sub-bars** sit under `--nav-h` (82px, 72px on phones).

## Elevation & Depth

The system is flat at rest. Depth comes from three things: tonal shifts between paper, sand and projector black; photography; and the grain and vignette of dark panels. Shadows exist only on things that float above the page.

### Shadow Vocabulary
- **Floating menu** (`box-shadow: 0 24px 60px -20px rgba(0,0,0,0.3)`): the desktop mega-menu viewport and the cookie dialog.
- **Chip lift** (`box-shadow: 0 1px 3px rgba(0,0,0,0.12)`): the white sliding indicator inside segmented pills (nav, tab bars).
- **Panel hairline** (`box-shadow: inset 0 0 0 1px rgba(242,235,221,0.07)`): the inner edge of every dark panel.
- **Dark card edge** (`box-shadow: inset 0 1px 0 rgba(242,235,221,0.07), inset 0 0 0 1px rgba(242,235,221,0.04)`): cards inside dark panels; their fill is cream at 3.5%.

### Projector panel recipe
Projector black base, an optional soft window-light radial from above (`panel-light`), a radial vignette darkening the corners to 45% black, and SVG fractal-noise grain at 16% opacity in overlay blend. Always use the `panel-dark` utility rather than rebuilding it.

### Named Rules
**The Flat Paper Rule.** Nothing on paper casts a shadow. Only floating layers (menus, dialogs, tooltips, the pill indicator) get one.

## Shapes

Soft and generous. Large framed surfaces (hero, dark panels, sand blocks) use 28px corners, 20px on phones. Cards and the floating menu use 20px. Fields and tooltips use 12px (tooltips in charts use 8px). Every button, chip, tag, segmented control and nav item is a full pill. Small chart marks (bars, legend swatches) keep 3–4px corners so data stays crisp. Borders are hairlines (1px, black at 7–15% or `hairline`). There are no hard corners on interactive elements.

## Components

### Buttons
Soft, quiet pills. They don't shout; they sit there clearly.
- **Shape:** full pill (`rounded.pill`), 12px × 24px padding, label type (0.85rem, 500).
- **Primary on paper:** ink fill, white text; hover drops to 80% ink.
- **Primary on images and panels:** white (cream) fill, ink text; hover to 85% white.
- **Ghost on images:** white at 10% with a 35% white border and backdrop blur; hover to 20%. Hidden on phones, where only the primary action shows.
- **Soon:** disabled pill with a "Coming soon" tag, always ordered after live actions.
- **Focus:** 2px outline, 2px offset.

### Chips
- **Style:** pill, black at 5% fill, 0.75rem medium text at 75% ink, 6px × 12px padding.
- **On images:** white at 15% fill, 30% white border, backdrop blur, 0.72rem semibold.
- **Status tag:** verified green fill, white 0.62rem semibold text, slight positive tracking. Only for "new"/"verified".

### Segmented control (nav and tab bars)
A pill track (black at 5% on paper, white at 15% on images) with a white sliding indicator that carries the chip-lift shadow and animates between items.

### Cards / Containers
- **Step cards (home):** 20px corners, either a photograph with a bottom gradient and white text, or a sand card with umber label and black title. Content is anchored at the bottom with 28px padding (24px on phones).
- **Sand block:** sand fill, 28px frame, 80px vertical padding; holds the audience rows.
- **Chart card:** sits on paper with no fill or border; label, headline and lede above, chart below at 40px.
- **Dark panel:** see Elevation & Depth.

### Inputs / Fields
- **Style:** white fill, 1px black-at-10% border, 12px corners, 12px × 16px padding, 1rem text, placeholder at 35% ink.
- **Hover:** border to 20%. **Focus:** border to 50%, no glow.
- **Label:** 0.82rem, 500, 70% ink, 8px above the field.
- **Select:** same as a field with the site chevron at 45% ink.
- **Submit:** primary pill.

### Navigation
Fixed bar with a 12px top inset. Over the hero it is transparent with white text and a translucent segmented pill. Past the hero it settles on paper with ink text. The wordmark is uppercase Montserrat semibold, 0.9rem, 0.15em tracking. Desktop dropdowns open a 640px white floating panel (20px corners, floating-menu shadow) with slide transitions between menus. At ≤720px it collapses to a two-line burger that opens a full sheet with staggered rows.

### Chart tooltip
Instrument black fill, white text, 0.72rem, 8–12px corners, positioned above the mark with a 10px gap. One style across every chart.

### Photographic frame (signature)
A full-bleed photograph inset 12px from the viewport with 28px corners, darkened at the top (for the nav) and the bottom-left (for the title), with white display type anchored bottom-left. It's the site's main expressive device. Every image follows `docs/image-style-guide.md`.

## Do's and Don'ts

### Do:
- **Do** use the `section-y` / `section-t` / `section-mt` utilities for vertical spacing between sections instead of ad-hoc padding.
- **Do** build dark sections with `panel-dark` (and `panel-light` for window light), so grain, vignette and cream text come for free.
- **Do** keep every control a pill and every large frame at 28px (20px on phones).
- **Do** use Instrument Black for chart ink and tooltips, Stone for neutral series, and Ember for the one series or row that matters (the leader).
- **Do** write labels in sentence case at 0.85rem, weight 500, in dim ink, and never as an eyebrow above a heading.
- **Do** darken images where text sits on them so white text stays legible on any photograph.

### Don't:
- **Don't** use weights above 600 or uppercase tracked eyebrows (uppercase belongs only to the wordmark, tiny status tags and paper articles).
- **Don't** put shadows on paper-level cards or sections; only floating layers get shadows.
- **Don't** put cream buttons on the light page (use ink with cream text), or cream on anything without one of its four jobs (DESIGN.md "The Ember Rule").
- **Don't** use green for anything except the "new/verified" status tag.
- **Don't** use pure white text on dark panels; let `panel-dark` remap it to cream.
- **Don't** introduce stock or off-style imagery; new photos follow `docs/image-style-guide.md` exactly.
- **Don't** add a second sans or display typeface; Plex Mono is for data only.
