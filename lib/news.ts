import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Company news: announcements, launches and press, one Markdown file per
// item in content/news/ (frontmatter: title, date, display_date, tag,
// summary). Distinct from Open Science, which holds research write-ups.

export interface NewsItem {
  slug: string;
  title: string;
  date: string;
  display_date: string;
  tag: string;
  summary: string;
  body: string;
}

const NEWS = path.join(process.cwd(), "content", "news");

function read(slug: string): NewsItem {
  const file = path.join(NEWS, `${slug}.md`);
  if (!fs.existsSync(file)) throw new Error(`news/${slug}.md not found`);
  const { data, content } = matter(fs.readFileSync(file, "utf-8"));
  for (const field of ["title", "date", "display_date", "tag", "summary"]) {
    if (!data[field]) throw new Error(`news/${slug}.md: missing ${field}`);
  }
  return {
    slug,
    title: data.title,
    // YAML parses bare dates as Date objects (UTC midnight).
    date:
      data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : String(data.date).slice(0, 10),
    display_date: data.display_date,
    tag: data.tag,
    summary: data.summary,
    body: content.trim(),
  };
}

// All news, newest first.
export function listNews(): NewsItem[] {
  if (!fs.existsSync(NEWS)) return [];
  return fs
    .readdirSync(NEWS)
    .filter((f) => f.endsWith(".md"))
    .map((f) => read(f.replace(/\.md$/, "")))
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function loadNews(slug: string): NewsItem {
  return read(slug);
}
