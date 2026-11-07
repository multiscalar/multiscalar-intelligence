import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import JsonLd, { articleData } from "@/components/JsonLd";
import PostBody from "@/components/posts/PostBody";
import PostList from "@/components/home/PostList";
import SectionHeader from "@/components/home/SectionHeader";
import { listNews, loadNews } from "@/lib/news";
import BackLink from "@/components/BackLink";

export const dynamicParams = false;

export function generateStaticParams() {
  return listNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = loadNews(slug);
  return pageMetadata({
    title: item.title,
    description: item.summary,
    path: `/news/${slug}/`,
    article: { published: item.date },
  });
}

export default async function NewsItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = loadNews(slug);
  const more = listNews()
    .filter((n) => n.slug !== slug)
    .slice(0, 3);
  return (
    <>
      <main className="max-w-[760px] mx-auto pt-32 px-8 pb-16 max-[768px]:pt-28 max-[768px]:px-6">
        <JsonLd
          data={articleData({
            title: item.title,
            description: item.summary,
            path: `/news/${slug}/`,
            published: item.date,
          })}
        />
        <BackLink href="/news/">News</BackLink>
        <div className="label flex items-center gap-4 text-text-dim mt-10 mb-4">
          <span>{item.display_date}</span>
          <span className="text-text-secondary">{item.tag}</span>
        </div>
        <h1 className="font-sans text-[clamp(2.2rem,4.6vw,3.2rem)] font-semibold tracking-[-0.035em] leading-[1.06] text-black mb-10">
          {item.title}
        </h1>
        <div className="h-px bg-border mb-10" />
        <article>
          <PostBody body={item.body} />
        </article>
      </main>

      {more.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-8 pt-16 section-b max-[768px]:px-6">
          <SectionHeader
            label="News"
            title="More news"
            link={{ href: "/news/", label: "All news" }}
          />
          <PostList posts={more} basePath="/news" />
        </section>
      )}
    </>
  );
}
