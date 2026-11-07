import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { papersByArea } from "@/lib/papers";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Papers",
  description:
    "Research papers from Multiscalar Intelligence, on economic intelligence and mathematics, with PDFs, source and code.",
  path: "/open-science/papers/",
  image: "/home/models.webp",
});

const isExternal = (href: string) => href.startsWith("http");

export default function PapersPage() {
  const groups = papersByArea();
  return (
    <main className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
      <header className="pt-40 animate-fade-up max-[768px]:pt-32">
        <div className="label text-text-dim mb-4">Open Science</div>
        <h1 className="max-w-[820px] font-sans text-[clamp(2.6rem,5.5vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-black">
          Papers
        </h1>
        <p className="mt-6 max-w-[560px] text-[clamp(1.05rem,1.5vw,1.25rem)] leading-[1.5] text-black/55">
          Our research, with the PDFs, source and code to check it.
        </p>
      </header>

      {groups.map(({ area, papers }) => (
        <section key={area} className="section-t last:section-b grid grid-cols-[200px_1fr] gap-16 max-[960px]:grid-cols-1 max-[960px]:gap-6">
          <Reveal className="label text-text-dim pt-1">{area}</Reveal>
          <ol className="border-b border-black/10">
            {papers.map((p, i) => (
              <li key={p.href} className="border-t border-black/10">
                <Reveal delay={Math.min(i, 4) * 0.04} className="grid gap-3 py-7">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] text-text-dim">
                    {p.status && (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.06em] ${
                          p.status === "Solved" ? "bg-[#141311] text-white" : "border border-black/15 text-black/60"
                        }`}
                      >
                        {p.status}
                      </span>
                    )}
                    {p.date && <span>{p.date}</span>}
                    <span>{p.authors}</span>
                  </div>
                  <h2 className="max-w-[720px] font-sans text-[clamp(1.2rem,1.8vw,1.5rem)] font-semibold leading-[1.25] tracking-[-0.02em]">
                    <a
                      href={p.href}
                      {...(isExternal(p.href) ? { target: "_blank", rel: "noopener" } : {})}
                      className="text-black transition-colors hover:text-black/65"
                    >
                      {p.title}
                    </a>
                  </h2>
                  {p.links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {p.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          {...(isExternal(l.href) ? { target: "_blank", rel: "noopener" } : {})}
                          className="rounded-full border border-black/12 px-3 py-1 text-[0.78rem] font-medium text-black/70 transition-colors hover:border-black/30 hover:text-black"
                        >
                          {l.label}
                          {isExternal(l.href) ? " ↗" : ""}
                        </a>
                      ))}
                    </div>
                  )}
                </Reveal>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </main>
  );
}
