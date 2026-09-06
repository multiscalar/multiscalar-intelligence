import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface PostMeta {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  display_date: string;
  tag: string;
  summary: string;
  badge?: string;
  image?: string;
}

export interface Post extends PostMeta {
  body: string;
}

const POSTS = path.join(process.cwd(), "content", "posts");

function read(slug: string): Post {
  const file = path.join(POSTS, `${slug}.md`);
  if (!fs.existsSync(file)) {
    throw new Error(`posts/${slug}.md not found`);
  }
  const { data, content } = matter(fs.readFileSync(file, "utf-8"));
  for (const field of [
    "title",
    "subtitle",
    "date",
    "display_date",
    "tag",
    "summary",
  ]) {
    if (!data[field]) throw new Error(`posts/${slug}.md: missing ${field}`);
  }
  return {
    slug,
    title: data.title,
    subtitle: data.subtitle,
    // YAML parses bare dates as Date objects (UTC midnight).
    date:
      data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : String(data.date).slice(0, 10),
    display_date: data.display_date,
    tag: data.tag,
    summary: data.summary,
    badge: data.badge,
    image: data.image,
    body: content.trim(),
  };
}

// All posts, newest first.
export function listPosts(): Post[] {
  return fs
    .readdirSync(POSTS)
    .filter((f) => f.endsWith(".md"))
    .map((f) => read(f.replace(/\.md$/, "")))
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function loadPost(slug: string): Post {
  return read(slug);
}
