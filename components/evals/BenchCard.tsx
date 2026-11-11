import {
  IconBank,
  IconBasket1,
  IconChart3,
  IconHandshake,
  IconJudgeGavel,
  IconShield,
  IconStore1,
  IconSword,
} from "central-icons";

type IconComponent = typeof IconBank;
import type { BenchCardData } from "@/lib/evals/cards";
import { logoColorOnDark } from "@/lib/evals/providers";

export const ICONS: Record<BenchCardData["icon"], IconComponent> = {
  swords: IconSword,
  landmark: IconBank,
  handshake: IconHandshake,
  store: IconStore1,
  gavel: IconJudgeGavel,
  cart: IconBasket1,
  chart: IconChart3,
  shield: IconShield,
};

// Dark cards sit on the homepage's dark panel; light cards on the page bg.
const TONES = {
  dark: {
    card: "border-white/[0.08] card-dark text-white",
    hover: "hover:border-white/20 hover:bg-[#201f1c] hover:text-white",
    chip: "border border-transparent bg-white/[0.07] text-white/85",
    chipSecondary: "border border-white/15 text-white/55",
    question: "text-white/55",
    meta: "text-white/55",
    rank: "text-white/50",
    icon: "text-white/90",
    value: "text-white/85",
    track: "bg-white/[0.08]",
    lead: "bg-white shadow-[0_0_14px_rgba(242,235,221,0.45)]",
    bar: "bg-white/35",
    source: "text-white/50",
    cta: "text-white group-hover:text-white/60",
    skeleton: "bg-white/[0.07]",
    skeletonRank: "text-white/20",
    skeletonTrack: "bg-white/[0.05]",
  },
  light: {
    card: "border-black/[0.06] bg-bg-elevated text-black",
    hover: "hover:border-black/15 hover:text-black",
    chip: "border border-transparent bg-black/[0.05] text-black/75",
    chipSecondary: "border border-black/10 text-black/50",
    question: "text-black/55",
    meta: "text-black/55",
    rank: "text-black/50",
    icon: "text-black/85",
    value: "text-black/80",
    track: "bg-black/[0.06]",
    lead: "bg-black",
    bar: "bg-black/25",
    source: "text-black/55",
    cta: "text-black group-hover:text-black/55",
    skeleton: "bg-black/[0.05]",
    skeletonRank: "text-black/20",
    skeletonTrack: "bg-black/[0.04]",
  },
} as const;

type Tone = keyof typeof TONES;

// One benchmark: the index dimensions it feeds, its question, and its live
// top five as bars; a
// benchmark without results shows skeleton rows and is not a link. With
// `cta`, the footer shows a "View benchmark" hint (the whole card is the link).
// `chips={false}` drops the capability chips.
export default function BenchCard({
  card,
  tone = "dark",
  cta = false,
  chips = true,
  className = "",
}: {
  card: BenchCardData;
  tone?: Tone;
  cta?: boolean;
  chips?: boolean;
  className?: string;
}) {
  const t = TONES[tone];
  const cardClass = `group flex min-w-0 flex-col rounded-[20px] border p-7 max-[600px]:p-6 ${t.card} ${className}`;
  const body = (
    <>
      {/* The index capabilities this benchmark feeds: primary filled,
          secondary outlined. */}
      {chips && <div className="mb-5 flex flex-wrap items-center gap-1">
        {card.dimensions.map((d) => (
          <span
            key={d}
            title={card.primary.includes(d) ? "Primary capability" : "Secondary capability"}
            className={`rounded-full px-2.5 py-1.5 text-[0.72rem] font-medium ${
              card.primary.includes(d) ? t.chip : t.chipSecondary
            }`}
          >
            {d}
          </span>
        ))}
      </div>}
      <h3 className="text-[1.3rem] font-semibold tracking-[-0.02em]">
        {card.title}
      </h3>
      <p
        className={`mt-1.5 min-h-[2.8em] text-[0.82rem] leading-[1.45] line-clamp-2 ${t.question}`}
      >
        {card.question}
      </p>
      <div className={`mt-4 mb-4 text-[0.78rem] ${t.meta}`} title={card.metric}>
        {card.comingSoon
          ? "Results coming soon"
          : `Ranked by ${card.metricShort}`}
      </div>
      {card.comingSoon ? (
        <SkeletonRows tone={tone} />
      ) : (
        <ol className="flex flex-col gap-3.5">
          {card.rows.map((row, r) => (
            <li key={row.name}>
              <div className="flex items-center gap-2.5 text-[0.85rem]">
                <span className={`w-3 text-[0.7rem] tabular-nums ${t.rank}`}>
                  {r + 1}
                </span>
                <span
                  className={`flex items-center justify-center w-4 h-4 shrink-0 ${t.icon}`}
                  title={row.provider}
                >
                  {row.icon ? (
                    <svg viewBox="0 0 24 24" aria-hidden className="w-3.5 h-3.5">
                      <path
                        d={row.icon}
                        fill={tone === "dark" ? logoColorOnDark(row.color) : row.color}
                      />
                    </svg>
                  ) : (
                    <span className="text-[0.62rem] font-semibold">
                      {row.mark ?? "•"}
                    </span>
                  )}
                </span>
                <span className="flex-1 truncate font-medium">{row.name}</span>
                <span className={`tabular-nums ${t.value}`}>{row.value}</span>
              </div>
              <div className={`mt-2 ml-[2.15rem] h-[3px] rounded-full ${t.track}`}>
                <div
                  className={`h-full rounded-full ${r === 0 ? t.lead : t.bar}`}
                  style={{ width: `${row.share * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
      {/* Footer only where it carries the link: source and "View benchmark". */}
      {cta && (
        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <span className={`text-[0.72rem] ${t.source}`}>{card.source}</span>
          {!card.comingSoon && (
            <span
              className={`text-[0.82rem] font-medium transition-colors duration-300 ${t.cta}`}
            >
              View benchmark
            </span>
          )}
        </div>
      )}
    </>
  );
  // Every card opens its page; an announced one opens its "in development" page.
  return (
    <a
      href={`/evals/${card.slug}/`}
      className={`${cardClass} transition-colors duration-300 ${t.hover}`}
    >
      {body}
    </a>
  );
}

// Placeholder rows for a benchmark without results: same rhythm as the real
// rows, with grey shapes instead of models and scores.
const SKELETON = [0.62, 0.48, 0.56, 0.4, 0.52];

function SkeletonRows({ tone }: { tone: Tone }) {
  const t = TONES[tone];
  return (
    <ol aria-hidden className="flex flex-col gap-3.5">
      {SKELETON.map((w, r) => (
        <li key={r}>
          <div className="flex h-[1.275rem] items-center gap-2.5">
            <span
              className={`w-3 text-[0.7rem] tabular-nums ${t.skeletonRank}`}
            >
              {r + 1}
            </span>
            <span className={`w-4 h-4 shrink-0 rounded-full ${t.skeleton}`} />
            <span
              className={`h-2.5 rounded-full ${t.skeleton}`}
              style={{ width: `${w * 60}%` }}
            />
            <span className={`ml-auto h-2.5 w-10 rounded-full ${t.skeleton}`} />
          </div>
          <div
            className={`mt-2 ml-[2.15rem] h-[3px] rounded-full ${t.skeletonTrack}`}
          />
        </li>
      ))}
    </ol>
  );
}
