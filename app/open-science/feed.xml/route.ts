import { listPosts } from "@/lib/posts";

export const dynamic = "force-static";

const SITE = "https://multiscalar.ai";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function GET() {
  const posts = listPosts();
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE}/open-science/${p.slug}/</link>
      <guid>${SITE}/open-science/${p.slug}/</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${esc(p.summary)}</description>
    </item>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Multiscalar Intelligence · Open Science</title>
    <link>${SITE}/open-science/</link>
    <description>Proofs, benchmarks, code and results from Multiscalar Intelligence.</description>
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
