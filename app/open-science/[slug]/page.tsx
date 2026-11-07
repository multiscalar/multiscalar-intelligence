import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import JsonLd, { articleData } from "@/components/JsonLd";
import PostBody from "@/components/posts/PostBody";
import { POST_EMBEDS } from "@/components/posts/embeds";
import { listPosts, loadPost } from "@/lib/posts";
import BackLink from "@/components/BackLink";

export const dynamicParams = false;

export function generateStaticParams() {
  return listPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = loadPost(slug);
  return pageMetadata({
    title: post.title,
    description: post.summary,
    path: `/open-science/${slug}/`,
    article: { published: post.date },
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = loadPost(slug);
  const Embed = POST_EMBEDS[slug];
  return (
    <main className="max-w-[760px] mx-auto pt-32 px-8 pb-16 max-[768px]:pt-28 max-[768px]:px-6">
      <JsonLd
        data={articleData({
          title: post.title,
          description: post.summary,
          path: `/open-science/${slug}/`,
          published: post.date,
        })}
      />
      <BackLink href="/open-science/">Open Science</BackLink>
      <div className="label flex items-center gap-4 text-text-dim mt-10 mb-4">
        <span>{post.display_date}</span>
        <span className="text-text-secondary">{post.tag}</span>
        {post.badge && (
          <span className="bg-[#16a34a] text-white px-[0.7em] py-[0.2em] rounded-full text-[0.62rem] font-semibold tracking-[0.08em]">
            {post.badge}
          </span>
        )}
      </div>
      <h1 className="font-sans text-[clamp(2.2rem,4.6vw,3.2rem)] font-semibold tracking-[-0.035em] leading-[1.06] text-black mb-4">
        {post.title}
      </h1>
      <p className="label text-text-secondary mb-10">
        {post.subtitle}
      </p>
      <div className="h-px bg-border mb-10" />
      <article>
        <PostBody body={post.body} />
        {Embed && (
          <div className="mt-8">
            <Embed />
          </div>
        )}
      </article>

    </main>
  );
}
