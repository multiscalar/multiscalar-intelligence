"use client";

import { useEffect, useRef } from "react";

// The background as a mosaic: the edited port photo (public/port.webp,
// already mirrored and toned black to orange) redrawn as small squares inside
// the photo frame. Each square takes its cell's colour: orange containers
// become orange squares, the brightest tops cream, and the black sea keeps a
// faint grain. On tall screens the photo is turned a quarter clockwise so the
// sea sits at the bottom, behind the text.
//
// The squares load in from the quay outward, a slow light sweeps across them,
// and they brighten and grow around the pointer.

const SRC = "/port.webp";
const ORANGE = "255,91,26";
const CREAM = "255,240,230";
const LEVELS = 12; // alpha buckets; one fill per colour and bucket per frame

type Field = {
  n: number;
  x: Float32Array;
  y: Float32Array;
  size: Float32Array; // full side length, CSS px
  alpha: Float32Array;
  cream: Uint8Array; // 1 = cream, 0 = orange
  delay: Float32Array; // intro start, seconds
  phase: Float32Array;
  sweep: Float32Array; // position along the sweep axis, 0..1
};

const smooth = (v: number) => {
  const c = v < 0 ? 0 : v > 1 ? 1 : v;
  return c * c * (3 - 2 * c);
};

function build(img: HTMLImageElement, w: number, h: number): Field {
  const tall = h > w * 1.05;
  const cell = w < 700 ? 7 : w < 1400 ? 8 : 9;
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);

  // One source pixel per cell: let the browser average each cell for us.
  const src = document.createElement("canvas");
  src.width = cols;
  src.height = rows;
  const sctx = src.getContext("2d", { willReadFrequently: true })!;
  sctx.imageSmoothingEnabled = true;
  sctx.imageSmoothingQuality = "high";
  sctx.fillStyle = "#0a0a0a";
  sctx.fillRect(0, 0, cols, rows);
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (tall) {
    // A quarter turn clockwise: the photo's right side (the sea) ends at the bottom.
    sctx.save();
    sctx.translate(cols / 2, rows / 2);
    sctx.rotate(Math.PI / 2);
    const s = Math.max(rows / iw, cols / ih);
    sctx.drawImage(img, (-iw * s) / 2, (-ih * s) / 2, iw * s, ih * s);
    sctx.restore();
  } else {
    // Cover the frame, favouring the sea side like the photo (object-position 70%).
    const s = Math.max(cols / iw, rows / ih);
    sctx.drawImage(img, (cols - iw * s) * 0.7, (rows - ih * s) / 2, iw * s, ih * s);
  }
  const data = sctx.getImageData(0, 0, cols, rows).data;

  const max = cols * rows;
  const f: Field = {
    n: 0,
    x: new Float32Array(max),
    y: new Float32Array(max),
    size: new Float32Array(max),
    alpha: new Float32Array(max),
    cream: new Uint8Array(max),
    delay: new Float32Array(max),
    phase: new Float32Array(max),
    sweep: new Float32Array(max),
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = (r * cols + c) * 4;
      const R = data[i];
      const G = data[i + 1];
      // The photo runs black (10) to orange (~214 red): red is the brightness.
      const v = ((R - 10) / 204 - 0.03) / 0.7;
      const rnd = Math.random();
      let size: number, alpha: number, cream: number;
      if (v < 0.05) {
        // The sea and the gaps: a sparse, faint grain so the dark reads as surface.
        if (rnd > 0.06) continue;
        size = cell * 0.18;
        alpha = 0.12 + rnd * 1.2;
        cream = 1;
      } else {
        const t = Math.min(1, v);
        cream = G > 165 ? 1 : 0;
        size = cell * (0.3 + 0.52 * t);
        alpha = 0.3 + 0.7 * t;
      }
      const k = f.n++;
      f.x[k] = c * cell + cell / 2;
      f.y[k] = r * cell + cell / 2;
      f.size[k] = size;
      f.alpha[k] = alpha;
      f.cream[k] = cream;
      f.phase[k] = rnd * Math.PI * 2;
      // Distance from the sea edge, 0 at the waterline side.
      const fromSea = tall ? 1 - r / rows : 1 - c / cols;
      f.sweep[k] = fromSea;
      f.delay[k] = 0.15 + fromSea * 1.3 + Math.random() * 0.45;
    }
  }
  return f;
}

export default function PortField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const box = canvas?.parentElement;
    if (!canvas || !box) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let img: HTMLImageElement | null = null;
    let field: Field | null = null;
    let w = 0;
    let h = 0;
    let raf = 0;
    let start = 0;
    let frame = 0;
    const pointer = { x: -1e4, y: -1e4, energy: 0 };

    let paths = Array.from({ length: 2 * LEVELS }, () => new Path2D());

    const draw = (time: number) => {
      if (!field) return;
      const t = reduce ? 99 : (time - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      paths = paths.map(() => new Path2D());

      // The sweep: a soft band crossing from the sea inland every 11s.
      const sweepPos = reduce ? -1 : ((t - 2.2) % 11) / 8.5;
      const pr2 = 150 * 150;
      const pe = pointer.energy;

      const { n, x, y, size, alpha, cream, delay, phase, sweep } = field;
      for (let k = 0; k < n; k++) {
        const p = smooth((t - delay[k]) / 0.7);
        if (p <= 0) continue;
        let s = size[k] * p;
        let a = alpha[k] * p;
        let lit = cream[k];

        const d = sweep[k] - sweepPos;
        if (d > -0.09 && d < 0.09) {
          const b = 1 - Math.abs(d) / 0.09;
          a = Math.min(1, a + b * 0.45);
          s *= 1 + b * 0.25;
        }
        if (pe > 0) {
          const dx = x[k] - pointer.x;
          const dy = y[k] - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < pr2) {
            const b = (1 - d2 / pr2) * pe;
            a = Math.min(1, a + b * 0.5);
            s *= 1 + b * 0.45;
            // The brightest squares near the pointer flare to cream.
            if (b > 0.6 && size[k] > 3) lit = 1;
          }
        }
        // A slow shimmer, a few percent either way.
        a *= 0.9 + 0.1 * Math.sin(t * 1.3 + phase[k]);

        const level = Math.min(LEVELS - 1, Math.floor(a * LEVELS));
        if (level <= 0 && a < 0.04) continue;
        const half = s / 2;
        paths[lit * LEVELS + level].rect(x[k] - half, y[k] - half, s, s);
      }
      for (let c = 0; c < 2; c++) {
        ctx.fillStyle = `rgb(${c ? CREAM : ORANGE})`;
        for (let l = 0; l < LEVELS; l++) {
          ctx.globalAlpha = (l + 0.5) / LEVELS;
          ctx.fill(paths[c * LEVELS + l]);
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (!start) start = time;
      pointer.energy *= 0.96;
      // After the intro, every other frame is plenty for a slow sweep.
      frame++;
      if ((time - start) / 1000 > 3 && frame % 2 === 1) return;
      draw(time);
    };

    const resize = () => {
      const rect = box.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (img) field = build(img, w, h);
      if (reduce) draw(0);
    };

    const onMove = (e: PointerEvent) => {
      const rect = box.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.energy = 1;
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 120);
    };

    const image = new Image();
    image.decoding = "async";
    image.src = SRC;
    image.onload = () => {
      img = image;
      resize();
      canvas.classList.add("ready");
      if (!reduce) raf = requestAnimationFrame(loop);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="field" aria-hidden />;
}
