import Reveal from "@/components/Reveal";

// Principles as an editorial list: full-width rows between hairlines, a small
// number, the title in large type and the explanation beside it in grey.
// On phones the explanation drops under the title. The number and the
// explanation's first line are centred on the title's first line: both use a
// 1.65rem line, pushed down by half the difference to the title's line
// (--lift), which follows the title's fluid size.
export default function Principles({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <ol className="border-b border-black/10">
      {items.map((p, i) => (
        <li key={p.title} className="border-t border-black/10">
          <Reveal
            delay={i * 0.06}
            className="grid grid-cols-[3.5rem_minmax(0,1.1fr)_minmax(0,1fr)] items-start gap-x-10 py-10 [--lift:calc((clamp(1.4rem,2.2vw,1.95rem)*1.2-1.65rem)/2)] max-[860px]:grid-cols-[2.5rem_minmax(0,1fr)] max-[860px]:gap-x-4 max-[860px]:py-8"
          >
            <span className="pt-[var(--lift)] text-[0.8rem] font-medium leading-[1.65rem] tabular-nums text-text-dim">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-sans text-[clamp(1.4rem,2.2vw,1.95rem)] font-semibold leading-[1.2] tracking-[-0.025em] text-black">
              {p.title}
            </h3>
            <p className="max-w-[440px] pt-[var(--lift)] text-[1rem] leading-[1.65rem] text-black/55 max-[860px]:col-start-2 max-[860px]:mt-3 max-[860px]:pt-0">
              {p.body}
            </p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
