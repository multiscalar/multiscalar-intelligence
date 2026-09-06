import type { ReactNode } from "react";
import type { Post } from "@/lib/posts";

// Full-bleed card covers. A post with a frontmatter image uses the photo;
// these designed covers stand in for posts without one, and the fallback
// keeps future posts presentable until they get a cover of their own.

const DESIGNED: Record<string, ReactNode> = {
  "six-more-erdos-problems": (
    <div className="w-full h-full bg-[#161616] flex flex-wrap content-center justify-center gap-x-7 gap-y-2 px-8">
      {["390", "486", "536", "788", "1002", "1038"].map((n) => (
        <span
          key={n}
          className="font-mono text-[1.55rem] font-light tracking-[0.08em] text-[#fafafa]/85"
        >
          {n}
        </span>
      ))}
    </div>
  ),
  "erdos-problem-690": (
    <div className="w-full h-full bg-[#efede8] flex flex-col items-center justify-center gap-3">
      <span className="font-mono text-[4.2rem] font-light tracking-[-0.02em] text-black leading-none">
        690
      </span>
      <span className="bg-[#16a34a] text-white font-mono px-[0.8em] py-[0.25em] rounded-full text-[0.6rem] tracking-[0.14em] uppercase">
        Solved
      </span>
    </div>
  ),
};

export function postCover(post: Post): ReactNode {
  if (post.image) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={post.image}
        alt=""
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    );
  }
  return (
    DESIGNED[post.slug] ?? (
      <div className="w-full h-full bg-[#efede8] flex items-center justify-center">
        <span className="font-mono text-[0.72rem] tracking-[0.2em] uppercase text-text-secondary">
          {post.tag}
        </span>
      </div>
    )
  );
}
