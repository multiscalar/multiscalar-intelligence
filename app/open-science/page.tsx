import type { Metadata } from "next";
import Image from "next/image";
import { IconArrowUpRight } from "central-icons";
import { HIDE } from "@/lib/launch";
import { pageMetadata } from "@/lib/site";
import Reveal from "@/components/Reveal";
import ClosingCard from "@/components/home/ClosingCard";
import SectionHeader from "@/components/home/SectionHeader";
import PostCard from "@/components/posts/PostCard";
import { contactHref } from "@/lib/contact";
import { BENCHES } from "@/lib/evals/benches";
import { listPosts } from "@/lib/posts";
import { listResults } from "@/lib/results";

export const metadata: Metadata = pageMetadata({
  title: "Open Science",
  description:
    "Multiscalar Intelligence publishes what it finds: proofs, benchmarks, code and results in mathematics, mechanism design and economics.",
  path: "/open-science/",
  image: "/home/models.webp",
});

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function OpenSciencePage() {
  const posts = listPosts();
  const [featured, ...rest] = posts;
  const results = listResults();
  const solved = results.filter((r) => r.badge === "Solved").length;

  // The three lines of work, each with what is public today.
  const programmes = [
    {
      title: "Market design",
      body: "How AI agents behave in auctions, negotiations and markets, and how to design markets they can't game.",
      count: plural(posts.filter((p) => p.tag === "Market Design").length, "report"),
      href: "#writing",
      image: { src: "/eii/fruit-stall.webp", alt: "A white retro robot selling fruit to a customer at a market stall" },
    },
    {
      title: "Open problems in mathematics",
      body: "Erdős problems attacked with frontier models under a published research prompt, every proof posted for public scrutiny.",
      count: `${results.length} papers, ${solved} solved`,
      href: "#erdos",
      image: { src: "/home/bench.webp", alt: "A small white robot working alone at a bench in a bright empty room" },
    },
    {
      title: "Benchmarks",
      body: "Economic environments where models negotiate, bid, price and manage cash, scored on what their decisions caused.",
      count: `${BENCHES.length} public leaderboards`,
      href: "/evals/",
      image: { src: "/eii/observation.webp", alt: "A white retro robot at a desk, watched through a glass partition" },
    },
  ];

  const stats = [
    { value: posts.length, label: "research posts" },
    { value: results.length, label: "Erdős papers" },
    { value: BENCHES.length, label: "public leaderboards" },
  ];

  return (
    <>
      <main className="max-w-[1200px] mx-auto px-8 max-[768px]:px-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-12 pt-40 animate-fade-up max-[900px]:grid-cols-1 max-[900px]:gap-8 max-[768px]:pt-32">
          <div>
            <h1 className="max-w-[820px] font-sans text-[clamp(2.8rem,6vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-black">
              Science in the open
            </h1>
            <p className="mt-6 max-w-[560px] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.55] text-black/60">
              We publish what we find: proofs, benchmarks, code and results, released where anyone
              can check them, including the results that did not go our way.
            </p>
          </div>
          <dl className="flex gap-10 pb-2 max-[560px]:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-[0.82rem] text-text-dim">{s.label}</dt>
                <dd className="text-[clamp(2rem,3.4vw,2.8rem)] font-semibold leading-none tracking-[-0.03em] text-black tabular-nums">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </header>

        <section aria-label="Programmes" className="section-t">
          <Reveal className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-1">
            {programmes.map((p, i) => (
              <a
                key={p.title}
                href={p.href}
                className="group flex flex-col overflow-hidden rounded-[20px] border border-black/10 bg-white transition-colors hover:border-black/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-deep"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#1a1712]">
                  <Image
                    src={p.image.src}
                    alt={p.image.alt}
                    fill
                    preload={i === 0}
                    sizes="(max-width: 900px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-black">{p.title}</h2>
                  <p className="mt-2 flex-1 text-[0.95rem] leading-[1.6] text-black/60">{p.body}</p>
                  <p className="mt-5 text-[0.82rem] font-medium text-ember-deep">{p.count}</p>
                </div>
              </a>
            ))}
          </Reveal>
        </section>

        <section id="writing" className="section-y scroll-mt-28">
          <SectionHeader title="Writing" description="Reports and notes from the lab, newest first." />
          {featured && (
            <Reveal className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-10 max-[900px]:grid-cols-1">
              <PostCard post={featured} featured />
              <div className="flex flex-col gap-10">
                {rest.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </Reveal>
          )}
        </section>

        <section id="erdos" className="section-b scroll-mt-28">
          <SectionHeader
            title="Erdős problems"
            description="Each paper ships with its PDF, LaTeX source and the research prompt that produced it. Proposed solutions stay proposed until the community checks them."
          />
          <Reveal>
            <ul className="border-t border-black/15">
              {results.map((r) => {
                const pdf = r.links.find(([label]) => label === "PDF");
                return (
                  <li
                    key={r.slug}
                    className="grid grid-cols-[6rem_minmax(0,1fr)_auto] items-center gap-6 border-b border-black/10 py-5 max-[768px]:grid-cols-[4.5rem_minmax(0,1fr)] max-[768px]:gap-x-4 max-[768px]:gap-y-2"
                  >
                    <span className="font-mono text-[0.95rem] font-medium tabular-nums text-black">#{r.number}</span>
                    <a
                      href={`/results/${r.slug}/`}
                      className="group min-w-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-deep"
                    >
                      <span className="block truncate text-[1.05rem] font-medium tracking-[-0.01em] text-black group-hover:text-black/65 max-[768px]:whitespace-normal">
                        {r.title}
                      </span>
                      <span className="mt-1 block text-[0.85rem] text-text-dim">{r.tag}</span>
                    </a>
                    <span className="flex items-center gap-4 max-[768px]:col-start-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[0.7rem] font-semibold tracking-[0.04em] ${
                          r.badge === "Solved" ? "bg-[#16a34a] text-white" : "bg-black/[0.06] text-black/70"
                        }`}
                      >
                        {r.badge}
                      </span>
                      {pdf && (
                        <a
                          href={`/results/${r.slug}/${pdf[1]}`}
                          className="inline-flex items-center gap-1 text-[0.85rem] font-medium text-black underline decoration-black/25 underline-offset-4 hover:decoration-black"
                        >
                          PDF
                          <IconArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </section>
      </main>

      <ClosingCard
        id="community"
        src="/home/models.webp"
        alt="An engineer checking tape drives inside a round computer vault"
        focus="50% 50%"
        title="Join our research community"
        description="We are opening a community of top tier researchers and engineers to collaborate on scientific work. Write to us with your research interests and CV."
        actions={[
          { href: contactHref("research"), label: "Get in touch" },
          { href: "/evals/", label: "Explore the index", soon: HIDE.evalsLinks },
        ]}
      />
    </>
  );
}
