import Image from "next/image";
import type { PostMeta } from "@/lib/posts";

// Covers for posts without their own image, from the site's photography,
// picked per post so neighbours don't repeat.
const FALLBACK: Record<string, { src: string; alt: string }> = {
  "six-more-erdos-problems": { src: "/home/reading-room.webp", alt: "A quiet sunlit reading room" },
  "erdos-problem-690": { src: "/home/watchmaker.webp", alt: "A watchmaker's bench under warm light" },
};
const DEFAULT_COVER = { src: "/home/environments.webp", alt: "A researcher playing Go against a white retro robot" };

// A research card in the Open Science and home indexes: a cover, then the
// programme, date, title and one-line result. `featured` spans wider with a
// taller cover.
export default function PostCard({ post, featured = false }: { post: PostMeta; featured?: boolean }) {
  const cover = post.image ? { src: post.image, alt: "" } : (FALLBACK[post.slug] ?? DEFAULT_COVER);
  return (
    <a
      href={`/open-science/${post.slug}/`}
      className="group flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember-deep"
    >
      <div
        className={`relative overflow-hidden rounded-[20px] bg-[#1a1712] ${
          featured ? "aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes={featured ? "(max-width: 900px) 100vw, 66vw" : "(max-width: 900px) 100vw, 33vw"}
          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-5 flex items-center gap-2 text-[0.8rem] text-text-dim">
        <span className="font-medium text-ember-deep">{post.tag}</span>
        <span aria-hidden>·</span>
        <span className="tabular-nums">{post.display_date}</span>
      </div>
      <h3
        className={`mt-2 font-semibold leading-[1.15] tracking-[-0.025em] text-black transition-colors group-hover:text-black/70 ${
          featured ? "text-[clamp(1.5rem,2.6vw,2.2rem)]" : "text-[1.25rem]"
        }`}
      >
        {post.title}
      </h3>
      <p className={`mt-3 leading-[1.6] text-black/60 ${featured ? "max-w-[640px] text-[1.02rem]" : "text-[0.95rem] line-clamp-3"}`}>
        {post.summary}
      </p>
    </a>
  );
}
