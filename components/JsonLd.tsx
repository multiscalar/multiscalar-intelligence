import { SITE_NAME, SITE_URL } from "@/lib/site";

// Structured data for search engines (schema.org JSON-LD). `<` is escaped so
// text from content files can't close the script tag.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
};

// A post or news item, published by the organization.
export function articleData({
  title,
  description,
  path,
  published,
}: {
  title: string;
  description: string;
  path: string;
  published: string;
}) {
  return {
    "@type": "Article",
    headline: title,
    description,
    datePublished: published,
    url: `${SITE_URL}${path}`,
    mainEntityOfPage: `${SITE_URL}${path}`,
    author: { "@id": ORGANIZATION["@id"] },
    publisher: { "@id": ORGANIZATION["@id"] },
  };
}
