import PatternArt, { type PatternKind, type Picture } from "@/components/PatternArt";
import Reveal from "@/components/Reveal";

// Textures from the bento family, one per card in turn. (Class strings
// written out in full so Tailwind finds them.)
const PATTERNS: { kind: PatternKind; css: string }[] = [
  {
    kind: "dots",
    css: "bg-[radial-gradient(circle,rgba(60,45,25,0.18)_1.2px,transparent_1.6px)] bg-[length:22px_22px]",
  },
  {
    kind: "grid",
    css: "bg-[linear-gradient(rgba(60,45,25,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(60,45,25,0.08)_1px,transparent_1px)] bg-[length:28px_28px]",
  },
  {
    kind: "stripes",
    css: "bg-[repeating-linear-gradient(135deg,rgba(60,45,25,0.10)_0_1px,transparent_1px_11px)]",
  },
  // Fourth card: fine horizontal rules, like ledger paper.
  {
    kind: "rules",
    css: "bg-[repeating-linear-gradient(0deg,rgba(60,45,25,0.10)_0_1px,transparent_1px_10px)]",
  },
];

// Sand cards (three in a row, or four as a two-by-two grid), numbered, each with its own texture fading out towards
// the text at the bottom. A card with a `picture` has its texture draw it on
// hover (see PatternArt).
export default function SandCards({
  items,
}: {
  items: { title: string; body: string; picture?: Picture }[];
}) {
  return (
    <div
      className={`grid gap-4 ${
        items.length === 4
          ? "grid-cols-2 max-[640px]:grid-cols-1"
          : "grid-cols-3 max-[960px]:grid-cols-1"
      }`}
    >
      {items.map((a, i) => {
        const pattern = PATTERNS[i % PATTERNS.length];
        return (
          <Reveal key={a.title} delay={i * 0.06} className="h-full">
            <article className={`group relative flex flex-col ${items.length === 4 ? "h-[320px]" : "h-[380px]"} overflow-hidden rounded-[20px] bg-[#ece6dc] p-8 text-[#1f1b16] max-[960px]:h-[320px] max-[768px]:p-6`}>
              {a.picture ? (
                <PatternArt kind={pattern.kind} picture={a.picture} />
              ) : (
                <div
                  aria-hidden
                  className={`absolute inset-0 [mask-image:linear-gradient(to_bottom,black_0%,black_30%,transparent_75%)] ${pattern.css}`}
                />
              )}
              <div className="label relative text-[#8a7d6a]">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="relative mt-auto">
                <h3 className="text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.025em]">
                  {a.title}
                </h3>
                <p className="mt-3 max-w-[460px] text-[0.92rem] leading-[1.6] text-[#5c5348]">
                  {a.body}
                </p>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
