# Image style guide

How to make photography for the Multiscalar website that matches the images
already on the home and evals pages. This guide was written for an agent
generating new images. Follow it literally: the settings below were found by
trial and error, and small deviations noticeably lower the quality.

## The look in one line

A calm, sunlit 1970s science-fiction film still. Warm, faded colour, soft
grain, lots of empty space. People and friendly white retro robots work side
by side in autonomous businesses and research spaces.

Reference images in the repo (look at these before generating anything):

| File | Used on | What it shows |
| --- | --- | --- |
| `public/hero.webp` | Home hero | Long sunlit office, retro computers, plants, two people |
| `public/home/environments.webp` | Home, "What we build" | A researcher playing Go against a robot |
| `public/home/models.webp` | Home, "What we build" | An engineer in a 1970s tape-drive vault |
| `public/home/deployment.webp` | Home, "What we build" | Rows of small delivery robots in a warehouse |
| `public/home/shop.webp` | Home closing card, Vending-Bench closing | Corner shop run by a robot |
| `public/eii/hero.webp` | Evals hero, ZeroSum and TERMS closing | Robot shaking hands with a woman across a desk |
| `public/eii/analyst.webp` | Evals closing, Treasury closing | Robot reading ticker tape beside an analyst |

## Midjourney settings

- **Model: V8, which is the account default.** Do not add `--v 7`. Do not use
  `--oref` (omni reference): it only works on V7, and every V7 + `--oref`
  batch came out cluttered, staged and "AI-looking". The user rejected all of
  them.
- **Aspect ratio:** `--ar 3:2` for almost everything. Use `--ar 7:3` only for
  very wide banners. Avoid `16:9` with long prompts: those runs added
  letterbox bars and busier compositions.
- **Style:** always `--raw`.
- **No other parameters:** no `--stylize`, `--chaos`, `--sref` or `--ow`.

## Prompt recipe

```
<scene: one sentence, short>, <who: one robot + one or two named people>,
<2–4 setting details>, 1970s sci-fi film still, 35mm film, Kodak Ektachrome,
soft grain, halation, faded warm color, muted palette, calm, minimal,
natural light --ar 3:2 --raw
```

The style suffix (from "1970s sci-fi film still" onward) is fixed. Copy it
exactly, every time.

Rules for the first half:

1. **Keep it short.** The images that worked use about 25–40 words before the
   suffix. Long, detailed prompts produce staged, busy scenes.
2. **Use one robot and one or two people.** Scenes with "rows of robots",
   crowds or many named people come out cluttered. The exception is a scene
   about scale, such as the warehouse, where small robots are background
   texture.
3. **Describe the robot the same way every time:** "a friendly white retro
   robot with a dark screen face". This keeps it consistent with the shop
   robot across images without needing a reference image.
4. **Name the people's ethnicities and genders explicitly**, for example "a
   Black woman", "an East Asian man", "a South Asian woman analyst". Without
   this, Midjourney defaults to mostly white men. Vary the casting from image
   to image, and that includes men, white people, older people and children:
   the user called out that too many images were "robot and woman", always a
   woman of colour. Check the casting of the images already on the site
   before choosing a new one.
8. **Show an emotional connection between people and robots in an autonomous
   business.** This is the house theme: the robot-run corner shop is the
   benchmark ("gorgeous"). Prefer a warm everyday moment (serving a customer,
   wrapping flowers, handing over a coffee) over lab or metaphor scenes such
   as observation rooms, balance scales or stopwatches.
9. **Vary the composition, not just the casting.** Images shown together
   (bento cards, a row of pages) must not all be "robot on the left, a person
   facing it on the right": the user rejected a set of three like that. Mix
   close-ups of the robot alone at its craft (the watchmaker), wide
   establishing shots where the business is the subject (the petrol station),
   street scenes with passers-by (the newsstand) and two-person moments.
10. **Say "boxy" to get the right robot.** "A friendly boxy white retro robot
   with a square television screen for a head" reliably gives the corner-shop
   robot; the shorter description sometimes drifts into a dome-headed,
   astronaut-like robot, especially in close-ups.
5. **Use a "sunlit" or "golden hour" setting with tall or large windows and
   plants.** The warm window light is a large part of the look.
6. **Make it an economic or research activity, shown simply:** shaking hands
   over contracts, reading ticker tape, running a shop, playing Go, checking
   tape drives.
7. **Leave room for text.** Pages overlay a label, title and buttons on the
   bottom-left third of the image. Prefer compositions where the subjects sit
   centre or right, with calm wall, floor or table in the bottom-left. The
   page adds a dark gradient there.

## Prompts that produced images we use

Use these as templates. The first six are the exact prompts behind the files
listed above:

```
a sunlit 1970s meeting room, a friendly white retro robot with a dark screen face shakes hands across a table with a Black woman, contracts on the table, large windows, plants, 1970s sci-fi film still, 35mm film, Kodak Ektachrome, soft grain, halation, faded warm color, muted palette, calm, minimal, natural light --ar 3:2 --raw
```
→ `public/eii/hero.webp` (4th of the grid)

```
a sunlit 1970s trading office, a friendly white retro robot with a dark screen face sits at a desk reading a long ticker tape beside a South Asian woman analyst, large windows, plants, 1970s sci-fi film still, 35mm film, Kodak Ektachrome, soft grain, halation, faded warm color, muted palette, calm, minimal, natural light --ar 3:2 --raw
```
→ `public/eii/analyst.webp` (3rd of the grid)

```
a small sunlit 1970s corner shop run entirely by a friendly white retro robot behind the counter, neat shelves of goods, a South Asian woman and an older Black man as customers, large shop window, plants, 1970s sci-fi film still, 35mm film, Kodak Ektachrome, soft grain, halation, faded warm color, muted palette, calm, minimal, natural light --ar 3:2 --raw
```
→ `public/home/shop.webp`

```
a Black woman researcher playing a game of Go against a friendly white retro 1970s robot at a long white table in a sunlit research lab, retro-futuristic computer terminals and plants, tall windows, 1970s sci-fi film still, 35mm film, Kodak Ektachrome, soft grain, halation, faded warm color, muted palette, calm, minimal, natural light --ar 3:2 --raw
```
→ `public/home/environments.webp`

```
a Middle Eastern woman engineer checking reel-to-reel tape drives in a quiet 1970s computer vault, heavy round vault door ajar, warm light spilling in, minimal white interior, plants, 1970s sci-fi film still, 35mm film, Kodak Ektachrome, soft grain, halation, faded warm color, muted palette, calm, minimal, natural light --ar 3:2 --raw
```
→ `public/home/models.webp`

```
a calm sunlit 1970s automated warehouse, rows of small white retro robots moving parcels along tidy aisles, an East Asian woman and a Latino man supervising with clipboards, high windows, plants, 1970s sci-fi film still, 35mm film, Kodak Ektachrome, soft grain, halation, faded warm color, muted palette, calm, minimal, natural light --ar 3:2 --raw
```
→ `public/home/deployment.webp`

Two wide banner prompts in the same style (not yet used on the site):

```
a few researchers of different ethnicities, women and men, walking and talking across a quiet modernist research campus courtyard at golden hour, concrete and glass buildings, trees, long shadows, wide negative space in the sky, 1970s sci-fi film still, 35mm film, Kodak Ektachrome, soft grain, halation, faded warm color, muted palette, calm, minimal, natural light --ar 7:3 --raw
```

```
a quiet sunlit 1970s university reading room, a Black man and an East Asian woman reviewing stacks of handwritten proof papers spread across a long wooden table, green banker's lamps, plants, tall windows, 1970s sci-fi film still, 35mm film, Kodak Ektachrome, soft grain, halation, faded warm color, muted palette, calm, minimal, natural light --ar 3:2 --raw
```

## What the user rejected (don't repeat)

- **Walls of numbers or scoreboards** (exchange halls with split-flap boards):
  "not sure the idea of the screen with all the numbers is cool".
- **Anything from V7 + `--oref`** (exam halls full of robots, auction rooms,
  fruit markets, bank counters): "super slop". The causes were the older
  model, a strong reference weight, and too many subjects.
- **Astronaut or dome-headed humanoid robots.** The robot should look like a
  friendly appliance: boxy or rounded white shell, dark screen face.
- **Symmetrical compositions with the subject dead centre and people on both
  sides.** The overlaid title then covers someone's face.
- **Generating an image for every blog post.** Called "sloppy". Images are
  for hero, section and closing cards only.

## Picking from a grid

Midjourney returns four images. Before proposing one, check:

- **Mood:** calm, warm and uncluttered, with clear negative space.
- **Robot:** white, friendly, with a screen face, and not a humanoid
  astronaut.
- **People:** the casting you asked for, natural poses, faces and hands
  intact.
- **Artefacts:** no text, numbers, logos or garbled signage.
- **Edges:** no black letterbox bars. Crop them off if present (see below).
- **Composition:** works at the target crop. A hero is wide (around 2:1 on
  desktop) and tall on mobile, so subjects shouldn't sit at the extreme edges.

Show the user the candidates (a contact sheet of the four is easiest) and
let them choose. They often spot a favourite in the grid themselves.

## Getting the file into the site

1. **Download the full-resolution image.** URLs look like
   `https://cdn.midjourney.com/<job-id>/0_<index>.png`, where the index runs
   0–3 across the grid. The CDN rejects plain `curl` (403), so either:
   - download it from the Midjourney UI, or
   - from a page served by the local dev server (`http://localhost:3000`), run
     `fetch(url)` in the browser and post the blob to a small local receiver.
     The `midjourney.com` page itself blocks requests to localhost.
2. **Convert and crop with `sharp`**, which is already a dependency. Write
   WebP at quality 85 and keep the native width (about 1344–1456 px):

   ```js
   const sharp = require("sharp");
   await sharp("in.png").webp({ quality: 85 }).toFile("public/eii/name.webp");
   // letterboxed source: find the first/last non-black rows, then
   // .extract({ left: 0, top, width, height })
   ```

   Aim for roughly 90–220 KB per image.
3. **Choose where it goes.** Home imagery lives in `public/home/`, evals and
   index imagery in `public/eii/`. Don't put files under `public/evals/`, which
   would shadow the `/evals` routes.
4. **Wire it in:**
   - Heroes: the `Hero` component (`src`, `alt`, and `short` for inner pages).
   - Closing cards: `ClosingCard` (`src`, `alt`, `focus` for
     `object-position`).
   - Per-benchmark closing images: `CLOSING_IMAGE` in
     `app/evals/[slug]/layout.tsx`.
5. **Write alt text** that describes the scene plainly, in about 15 words,
   for example "A white retro robot reading a ticker tape beside a woman
   analyst".
6. **Clear the cache after replacing a file under the same name:**
   `rm -rf .next/dev/cache/images`. Next.js otherwise keeps serving the old
   optimised version.
7. **Check it on the page** at desktop width and at 375 px. Make sure the
   overlaid text doesn't sit on a face, and adjust `focus` if needed.
