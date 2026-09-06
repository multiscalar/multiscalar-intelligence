import fs from "node:fs";
import path from "node:path";

export interface ResultMeta {
  number: string;
  title: string;
  subtitle: string;
  tag: string;
  eyebrow: string;
  badge: string;
  badge_class?: string;
  description: string;
  links: [string, string][];
}

const CONTENT = path.join(process.cwd(), "content", "results");

export function listResultSlugs(): string[] {
  return fs
    .readdirSync(CONTENT)
    .filter(
      (name) =>
        !name.startsWith("_") &&
        fs.existsSync(path.join(CONTENT, name, "meta.json"))
    )
    .sort();
}

// Throws on anything missing: a paper directory without its fragment or meta
// must fail the build loudly rather than ship a broken page.
export function loadResult(slug: string): {
  meta: ResultMeta;
  articleHtml: string;
} {
  const dir = path.join(CONTENT, slug);
  const metaPath = path.join(dir, "meta.json");
  const articlePath = path.join(dir, "article.html");
  if (!fs.existsSync(metaPath)) {
    throw new Error(`results/${slug}: meta.json not found`);
  }
  if (!fs.existsSync(articlePath)) {
    throw new Error(
      `results/${slug}: article.html not found; run content/results/_lib/build.py`
    );
  }
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as ResultMeta;
  const articleHtml = fs.readFileSync(articlePath, "utf-8");
  return { meta, articleHtml };
}
