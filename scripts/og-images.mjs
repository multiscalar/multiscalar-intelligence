// Share-card images: a 1200x630 JPEG crop of every site photo, written to
// public/og/ as <folder>-<name>.jpg (hero.webp becomes og/hero.jpg).
// Link previews on LinkedIn and some chat apps don't show WebP, hence JPEG.
// Run after adding or replacing a photo: node scripts/og-images.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.join(import.meta.dirname, "..", "public");
const SOURCES = ["hero.webp", "home", "eii"];
const OUT = path.join(PUBLIC, "og");

fs.mkdirSync(OUT, { recursive: true });
const files = SOURCES.flatMap((s) => {
  const full = path.join(PUBLIC, s);
  return fs.statSync(full).isDirectory()
    ? fs.readdirSync(full).filter((f) => f.endsWith(".webp")).map((f) => path.join(s, f))
    : [s];
});

for (const rel of files) {
  const name = rel.replace(/\.webp$/, "").replaceAll(path.sep, "-");
  const out = path.join(OUT, `${name}.jpg`);
  await sharp(path.join(PUBLIC, rel))
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(out);
  console.log(`og/${name}.jpg`, Math.round(fs.statSync(out).size / 1024), "KB");
}
