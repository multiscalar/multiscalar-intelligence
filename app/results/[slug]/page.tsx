import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { Crimson_Pro } from "next/font/google";
import KatexRenderer from "@/components/KatexRenderer";
import Reveal from "@/components/Reveal";
import { listResultSlugs, loadResult } from "@/lib/results";
import "katex/dist/katex.min.css";
import "./article.css";

const crimson = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return listResultSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = loadResult(slug);
  return pageMetadata({
    title: meta.title,
    description: meta.description,
    path: `/results/${slug}/`,
  });
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { meta, articleHtml } = loadResult(slug);
  return (
    <main className={`article-main ${crimson.variable}`}>
      <header className="pt-8 pb-10 max-[768px]:pt-4 max-[768px]:pb-6">
        <div className="label text-text-dim mb-[1.1rem]">
          {meta.eyebrow}{" "}
          <span
            className={`status-badge ${meta.badge_class ?? "status-proposed"}`}
          >
            {meta.badge}
          </span>
        </div>
        <h1 className="font-sans font-semibold text-[clamp(2.2rem,4.6vw,3.2rem)] tracking-[-0.035em] leading-[1.06] text-black mb-4">
          {meta.title}
        </h1>
        <div className="font-sans text-[1.05rem] text-text-secondary mb-8 tracking-[-0.005em]">
          {meta.subtitle}
        </div>
        <div className="flex flex-wrap gap-y-[0.7rem] gap-x-[1.2rem] font-sans text-[0.78rem] text-text-secondary tracking-[0.04em] mb-6">
          <span className="text-text-dim">Multiscalar Intelligence</span>
        </div>
        <div className="flex flex-wrap gap-[1.4rem] mt-2">
          {meta.links.map(([label, url]) => (
            <a
              key={url}
              href={url}
              className="article-link"
              {...(url.startsWith("http")
                ? { target: "_blank", rel: "noopener" }
                : {})}
            >
              {label}
              {" "}↗
            </a>
          ))}
        </div>
      </header>

      <Reveal variant="divider" className="h-px bg-border mb-12" />

      <article
        className="paper"
        dangerouslySetInnerHTML={{ __html: articleHtml }}
      />

      <KatexRenderer />
    </main>
  );
}
