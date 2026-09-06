import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PostBody from "@/components/posts/PostBody";
import { POST_EMBEDS } from "@/components/posts/embeds";
import { listPosts, loadPost } from "@/lib/posts";

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
  return {
    title: `${post.title} | Multiscalar Intelligence`,
    description: post.summary,
  };
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
      <a
        href="/open-science/"
        className="font-mono text-[0.72rem] text-text-dim tracking-[0.08em] hover:text-text"
      >
        ← Open Science
      </a>
      <div className="flex items-center gap-4 font-mono text-[0.72rem] text-text-dim tracking-[0.15em] uppercase mt-8 mb-4">
        <span>{post.display_date}</span>
        <span className="text-text-secondary">{post.tag}</span>
        {post.badge && (
          <span className="bg-[#16a34a] text-white px-[0.7em] py-[0.2em] rounded-full text-[0.62rem] tracking-[0.12em]">
            {post.badge}
          </span>
        )}
      </div>
      <h1 className="font-sans text-[clamp(1.9rem,4.2vw,2.6rem)] font-normal tracking-[-0.02em] leading-[1.18] text-black mb-2">
        {post.title}
      </h1>
      <p className="font-mono text-[0.75rem] text-text-secondary tracking-[0.06em] uppercase mb-10">
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
      <div className="h-px bg-border mt-16" />
      <Footer />
    </main>
  );
}
