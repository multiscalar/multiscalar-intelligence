import Reveal from "@/components/Reveal";
interface ListItem {
  slug: string;
  title: string;
  display_date: string;
  tag: string;
  summary: string;
}

// Posts or news as a typographic index: date, title and summary, tag;
// full-width rows separated by hairlines. Shared by the home page's latest
// posts, the Open Science index and News.
export default function PostList({
  posts,
  basePath = "/open-science",
  ids = {},
}: {
  posts: ListItem[];
  /** Section the items link into, e.g. "/news". */
  basePath?: string;
  /** Optional anchor ids per slug, for old deep links. */
  ids?: Record<string, string>;
}) {
  return (
    <Reveal>
      <ul className="border-t border-black/10">
        {posts.map((post) => (
          <li key={post.slug} className="border-b border-black/10">
            <a
              id={ids[post.slug]}
              href={`${basePath}/${post.slug}/`}
              className="group grid grid-cols-[150px_1fr_220px] items-baseline gap-8 py-8 scroll-mt-28 max-[900px]:grid-cols-1 max-[900px]:gap-3 max-[900px]:py-6"
            >
              <span className="text-[0.85rem] tabular-nums text-text-dim">
                {post.display_date}
              </span>
              <span className="block">
                <span className="block font-sans text-[clamp(1.2rem,1.8vw,1.5rem)] font-medium leading-[1.25] tracking-[-0.02em] text-black transition-colors duration-300 group-hover:text-black/60">
                  {post.title}
                </span>
                <span className="mt-2 block max-w-[620px] text-[0.98rem] leading-[1.6] text-[#555] line-clamp-2">
                  {post.summary}
                </span>
              </span>
              <span className="label text-right whitespace-nowrap text-text-dim max-[900px]:text-left max-[900px]:order-first">
                {post.tag}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
