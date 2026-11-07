import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import PostList from "@/components/home/PostList";
import { listNews } from "@/lib/news";

export const metadata: Metadata = pageMetadata({
  title: "News",
  description:
    "Announcements, launches and press from Multiscalar Intelligence: new benchmarks, research results and company news.",
  path: "/news/",
});

export default function NewsPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-8 section-b max-[768px]:px-6">
      <header className="pt-40 pb-16 animate-fade-up max-[768px]:pt-32 max-[768px]:pb-12">
        <div className="label text-text-dim mb-4">News</div>
        <h1 className="font-sans text-[clamp(2.6rem,5.5vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-black">
          News from Multiscalar
        </h1>
        <p className="mt-6 max-w-[560px] text-[clamp(1.05rem,1.5vw,1.25rem)] leading-[1.5] text-black/55">
          Announcements, launches and press. For research write-ups, see{" "}
          <a
            href="/open-science/"
            className="text-black/75 underline decoration-black/20 underline-offset-2 hover:text-black"
          >
            Open Science
          </a>
          .
        </p>
      </header>
      <PostList posts={listNews()} basePath="/news" />
    </main>
  );
}
