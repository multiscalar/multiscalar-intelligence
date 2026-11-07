import type { Metadata } from "next";

export const SITE_URL = "https://multiscalar.ai";

// Vercel preview deployments (and any build outside Vercel production) stay
// out of search results: robots.txt blocks crawlers and pages are noindex.
export const INDEXABLE = process.env.VERCEL_ENV === "production";
export const SITE_NAME = "Multiscalar Intelligence";
// The first sentence of the home hero (the full text runs past what search
// results show).
export const SITE_DESCRIPTION =
  "Multiscalar is an applied AI lab researching and building systems that invest, negotiate, and manage resources.";

// Share-card copy of a site photo, made by scripts/og-images.mjs:
// /home/shop.webp -> /og/home-shop.jpg, /hero.webp -> /og/hero.jpg.
export const ogImage = (src: string) =>
  `/og/${src.replace(/^\//, "").replace(/\.webp$/, "").replaceAll("/", "-")}.jpg`;

// Search results cut descriptions at about 160 characters; end on a word.
function clip(text: string, max = 160) {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

// Metadata for one page: title (the root layout appends the site name unless
// `fullTitle`), clipped description, canonical URL, and Open Graph and X
// cards with the page's photo. `path` is the route with its trailing slash.
export function pageMetadata({
  title,
  description,
  path,
  image = "/hero.webp",
  fullTitle = false,
  article,
}: {
  title: string;
  description: string;
  path: string;
  /** A site photo (.webp); its share-card JPEG is used. */
  image?: string;
  /** Use the title as is, without " | Multiscalar Intelligence" (automatic
   *  for titles over 33 characters). */
  fullTitle?: boolean;
  /** Marks the page as an article, with its publication date (YYYY-MM-DD). */
  article?: { published: string };
}): Metadata {
  const desc = clip(description);
  // Long titles drop the site-name suffix rather than get cut off in results.
  const absolute = fullTitle || title.length > 33;
  const images = [{ url: ogImage(image), width: 1200, height: 630 }];
  return {
    title: absolute ? { absolute: title } : title,
    description: desc,
    alternates: {
      canonical: path,
      // Child metadata replaces `alternates` whole, so the feed link rides
      // along on every page.
      types: {
        "application/rss+xml": [
          { url: "/open-science/feed.xml", title: `${SITE_NAME}: Open Science` },
        ],
      },
    },
    openGraph: {
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title,
      description: desc,
      images,
      ...(article
        ? { type: "article", publishedTime: article.published }
        : { type: "website" }),
    },
    twitter: { card: "summary_large_image", title, description: desc, images },
  };
}
