"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useIndicator } from "@/components/useIndicator";
import { CAPABILITIES, CAPABILITY_OVERALL_INFO } from "@/lib/evals/eii";
import type { IndexScores } from "@/lib/evals/examples";
import { withIndexScores } from "@/lib/evals/index-scores";
import type { RosterModel } from "@/lib/evals/overview";
import { logoColorOnDark } from "@/lib/evals/providers";

// Economic Intelligence Index preview: eii-prod scores on the C1-C5
// dimensions (lib/evals/index-scores.ts).
// Axes are the C1–C5 capability taxonomy.
const AXES: string[] = CAPABILITIES.map((c) => c.short);
const capOf = (view: string) => CAPABILITIES.find((c) => c.short === view);
const infoOf = (view: string) =>
  view === "Overall" ? CAPABILITY_OVERALL_INFO : capOf(view)?.info;

const TOP_N = 10;
// Row height lives in a CSS variable so phones can use tighter rows.
const ROWS = "[--row-h:52px] max-[640px]:[--row-h:44px]";
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

type ScoredModel = RosterModel & IndexScores;

const valuesOf = (m: ScoredModel) => m.dims;
const valueOf = (m: ScoredModel, view: string) =>
  view === "Overall" ? m.overall : m.dims[AXES.indexOf(view)];

// Radar geometry.
const SIZE = 360;
const C = SIZE / 2;
const R = 140;
const RINGS = [0.25, 0.5, 0.75, 1];
const point = (i: number, v: number) => {
  const a = (-90 + (360 / AXES.length) * i) * (Math.PI / 180);
  return [C + Math.cos(a) * R * v, C + Math.sin(a) * R * v] as const;
};
const polygon = (values: number[]) =>
  values.map((v, i) => point(i, v).join(",")).join(" ");

// Provider logo, in its brand colour, on a faint disc.
function Mark({ m }: { m: RosterModel }) {
  return (
    <span className="flex w-7 h-7 shrink-0 items-center justify-center rounded-full bg-white/[0.08]">
      {m.icon ? (
        <svg viewBox="0 0 24 24" aria-hidden className="w-3.5 h-3.5">
          <path d={m.icon} fill={logoColorOnDark(m.color)} className="text-white" />
        </svg>
      ) : (
        <span className="text-[0.65rem] font-semibold text-white">
          {m.mark ?? "•"}
        </span>
      )}
    </span>
  );
}

// The title sits at the top of the left column, so the radar column
// can run the full height beside them instead of leaving a gap above.
export default function IndexPreview({
  roster,
  title,
  description,
}: {
  roster: RosterModel[];
  /** No longer shown: headings carry their own weight (DESIGN.md). */
  label?: string;
  title: string;
  description?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [view, setView] = useState("Overall");
  const axes = AXES;
  const [hovered, setHovered] = useState<string | null>(null);
  // Axis label under the pointer (or keyboard focus): shows what it measures.
  const [tip, setTip] = useState<number | null>(null);
  // Clicked model: holds the radar on it, ignoring hover, until clicked again.
  const [locked, setLocked] = useState<string | null>(null);
  const models = useMemo(() => withIndexScores(roster), [roster]);
  const tabs = useRef<HTMLDivElement>(null);
  const pill = useIndicator(tabs, view);

  // A click anywhere else unlocks: everywhere but the rows, the tabs (so
  // switching dimension keeps the lock) and the radar.
  useEffect(() => {
    if (!locked) return;
    const unlock = (e: PointerEvent) => {
      if (!(e.target as Element).closest?.("[data-keeps-lock]")) setLocked(null);
    };
    document.addEventListener("pointerdown", unlock);
    return () => document.removeEventListener("pointerdown", unlock);
  }, [locked]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShown(true),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Rank every model for the current view; rows are positioned by rank so a
  // re-rank animates them into place.
  const top = useMemo(
    () =>
      [...models]
        .sort(
          (a, b) =>
            valueOf(b, view) - valueOf(a, view) ||
            a.name.localeCompare(b.name),
        )
        .slice(0, TOP_N),
    [models, view],
  );
  const max = valueOf(top[0], view);
  const rankOf = new Map(top.map((m, i) => [m.name, i]));
  // A locked model that drops out of this view's top 10 is ignored here (and
  // comes back if a later view ranks it again).
  const lockedModel = top.find((m) => m.name === locked);
  const active = lockedModel ?? top.find((m) => m.name === hovered) ?? top[0];
  const axis = view === "Overall" ? -1 : axes.indexOf(view);

  return (
    <div
      ref={ref}
      className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-x-14 max-[1180px]:grid-cols-1"
    >
      {/* Title, tabs and description span both columns; below them the
          rankings and the radar start on the same line. */}
      <div className="col-span-2 max-[1180px]:col-span-1">
        <div className="mb-10 max-[640px]:mb-7">
          <h2 className="font-sans text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.035em]">
            {title}
          </h2>
          {description && (
            <p className="mt-5 max-w-[560px] text-pretty text-[1rem] leading-[1.65] text-white/60 max-[640px]:mt-4 max-[640px]:text-[0.95rem]">
              {description}
            </p>
          )}
        </div>
        {/* Phones: one row that scrolls sideways, running to the panel's
            edges, instead of wrapping into a lumpy two-line pill. */}
        <div className="max-[640px]:-mx-6 max-[640px]:overflow-x-auto max-[640px]:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          ref={tabs}
          data-keeps-lock
          role="tablist"
          aria-label="Index capability"
          className="relative inline-flex flex-wrap gap-1 rounded-full bg-white/[0.06] p-1 max-[640px]:flex-nowrap"
        >
          <span aria-hidden className="rounded-full bg-white" style={pill} />
          {["Overall", ...axes].map((v) => (
            <button
              key={v}
              role="tab"
              type="button"
              data-indicator={v}
              aria-selected={v === view}
              onClick={(e) => {
                setView(v);
                e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
              }}
              className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-[0.45rem] text-[0.8rem] font-medium cursor-pointer transition-colors duration-300 ${
                v === view ? "text-black" : "text-white/65 hover:text-white"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        </div>
      </div>

      {/* Wraps within the rankings' column (the columns are fixed, so a long
          description can't squeeze the radar) and always takes two lines'
          height, so the list doesn't jump between views. */}
      <p
        key={view}
        className="col-start-1 mt-5 min-h-[3.2em] max-w-[620px] text-pretty text-[0.95rem] leading-[1.6] text-white/60 animate-fade-up max-[640px]:mt-4 max-[640px]:text-[0.9rem]"
      >
        <span className="font-medium text-white">{capOf(view)?.name ?? view}.</span>{" "}
        {infoOf(view)}
      </p>

        {/* Ranked top 10 */}
        <ol
          className={`relative col-start-1 mt-10 max-[1180px]:mt-8 max-[640px]:mt-6 ${ROWS}`}
          style={{ height: `calc(var(--row-h, 52px) * ${TOP_N})` }}
          data-keeps-lock
          onMouseLeave={() => setHovered(null)}
          aria-label={`Top ${TOP_N} models by ${view.toLowerCase()} score`}
        >
          {models.map((m) => {
            const rank = rankOf.get(m.name);
            const visible = rank !== undefined;
            const isActive = visible && m.name === active.name;
            const isLocked = visible && m.name === lockedModel?.name;
            // Phones have no radar, so there is nothing to lock.
            const toggleLock = () =>
              visible &&
              !matchMedia("(max-width: 640px)").matches &&
              setLocked(isLocked ? null : m.name);
            const v = valueOf(m, view);
            return (
              <li
                key={m.name}
                aria-hidden={!visible || undefined}
                role={visible ? "button" : undefined}
                tabIndex={visible ? 0 : -1}
                aria-pressed={visible ? isLocked : undefined}
                aria-label={visible ? `${isLocked ? "Unlock" : "Lock"} the profile on ${m.name}` : undefined}
                onClick={toggleLock}
                onKeyDown={(e) => {
                  if (e.key !== "Enter" && e.key !== " ") return;
                  e.preventDefault();
                  toggleLock();
                }}
                // Touch taps fire mouseenter too; only real hover picks a
                // model, so a tap doesn't leave a row lit for no reason.
                onMouseEnter={() =>
                  visible && matchMedia("(hover: hover)").matches && setHovered(m.name)
                }
                className={`absolute inset-x-0 grid grid-cols-[1.75rem_11.5rem_1fr_2.5rem] items-center gap-4 outline-none transition-[transform,opacity] duration-[600ms] ${EASE} max-[640px]:grid-cols-[1rem_minmax(0,9.5rem)_1fr_1.75rem] max-[640px]:gap-3 min-[641px]:cursor-pointer before:pointer-events-none before:absolute before:-inset-x-3 before:inset-y-1 before:rounded-xl before:transition-colors before:duration-300 before:content-[''] focus-visible:before:ring-1 focus-visible:before:ring-white/40 ${
                  isLocked ? "before:bg-white/[0.06]" : "before:bg-transparent"
                } ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                style={{
                  height: "var(--row-h, 52px)",
                  transform: `translateY(calc(var(--row-h, 52px) * ${visible ? rank : TOP_N}))`,
                }}
              >
                <span className="text-[0.78rem] tabular-nums text-white/50">
                  {visible ? rank + 1 : ""}
                </span>
                <span className="flex min-w-0 items-center gap-3">
                  <Mark m={m} />
                  <span
                    className={`truncate text-[0.92rem] font-medium transition-colors duration-300 max-[640px]:text-[0.88rem] ${
                      isActive ? "text-white" : "text-white/70"
                    }`}
                  >
                    {m.name}
                  </span>
                </span>
                <span className="h-2 rounded-full bg-white/[0.06] max-[640px]:h-1.5">
                  <span
                    className={`block h-full rounded-full transition-[width,background-color] duration-[900ms] ${EASE} ${
                      isActive ? "bg-ember" : "bg-white/25"
                    }`}
                    style={{ width: shown ? `${(v / max) * 100}%` : "0%" }}
                  />
                </span>
                <span
                  className={`text-right text-[0.92rem] font-semibold tabular-nums transition-colors duration-300 max-[640px]:text-[0.88rem] ${
                    isActive ? "text-white" : "text-white/70"
                  }`}
                >
                  {Math.round(v * 100)}
                </span>
              </li>
            );
          })}
        </ol>

      {/* Radar: every top-10 profile faintly, the active one in full, with
          the active model's scores underneath. Spans the description and
          rankings rows, its top label level with the description. Hidden on
          phones: its labels shrink to a few pixels, there's no hover to pick a
          model, and the tabs already re-rank the list by each dimension. */}
      <div data-keeps-lock className="max-[640px]:hidden col-start-2 row-span-2 row-start-2 mt-2 self-start max-[1180px]:col-start-1 max-[1180px]:row-span-1 max-[1180px]:row-start-auto max-[1180px]:mt-14">
        <div className="relative mx-auto w-full max-w-[480px]">
        <svg
          viewBox={`-74 -2 ${SIZE + 148} ${SIZE + 4}`}
          role="img"
          aria-label={`Profile for ${active.name} across ${axes.join(", ").toLowerCase()}, against the other top ${TOP_N} models`}
          className="block w-full h-auto"
        >
          {RINGS.map((r) => (
            <polygon
              key={r}
              points={polygon(axes.map(() => r))}
              fill="none"
              stroke="rgba(242,235,221,0.08)"
            />
          ))}
          {axes.map((_, i) => {
            const [x, y] = point(i, 1);
            return (
              <line
                key={i}
                x1={C}
                y1={C}
                x2={x}
                y2={y}
                stroke={
                  i === axis || i === tip
                    ? "rgba(242,235,221,0.5)"
                    : "rgba(242,235,221,0.08)"
                }
                className="transition-[stroke] duration-300"
              />
            );
          })}
          <g
            className={`transition-transform duration-[1200ms] ${EASE} ${shown ? "scale-100" : "scale-0"}`}
            style={{ transformOrigin: `${C}px ${C}px` }}
          >
            {top
              .filter((m) => m.name !== active.name)
              .map((m) => (
                <polygon
                  key={m.name}
                  points={polygon(valuesOf(m))}
                  fill="none"
                  stroke="rgba(242,235,221,0.14)"
                  strokeLinejoin="round"
                />
              ))}
            <polygon
              points={polygon(valuesOf(active))}
              fill="rgba(242,235,221,0.1)"
              stroke="#f2ebdd"
              strokeWidth={2}
              strokeLinejoin="round"
            />
            {valuesOf(active).map((v, i) => {
              const [x, y] = point(i, v);
              return <circle key={i} cx={x} cy={y} r={3.5} fill="#f2ebdd" />;
            })}
          </g>
          {CAPABILITIES.map((c, i) => {
            const [x, y] = point(i, 1.12);
            const anchor =
              Math.abs(x - C) < 1 ? "middle" : x > C ? "start" : "end";
            const lit = axis === -1 || axis === i || tip === i;
            return (
              <text
                key={c.code}
                x={x}
                y={anchor === "middle" ? y - 8 : y}
                textAnchor={anchor}
                dominantBaseline="middle"
                tabIndex={0}
                aria-label={`${c.name}: ${c.info}`}
                onMouseEnter={() => setTip(i)}
                onMouseLeave={() => setTip(null)}
                onFocus={() => setTip(i)}
                onBlur={() => setTip(null)}
                className={`cursor-help outline-none font-sans text-[10px] font-semibold uppercase tracking-[0.08em] transition-[fill] duration-300 ${
                  tip === i ? "fill-white" : lit ? "fill-white/75" : "fill-white/35"
                }`}
              >
                {c.short}
              </text>
            );
          })}
        </svg>
        {tip !== null && (() => {
          // Place the card by the hovered label, in % of the SVG's viewBox
          // (-74..434 wide, -2..362 tall), opening away from the chart centre.
          const c = CAPABILITIES[tip];
          const [x, y] = point(tip, 1.12);
          const left = ((x + 74) / (SIZE + 148)) * 100;
          const top = ((y + 2) / (SIZE + 4)) * 100;
          const below = y < C;
          const shift = Math.abs(x - C) < 1 ? "-50%" : x > C ? "-85%" : "-15%";
          return (
            // Position on the outer box, fade on the inner one: the fade
            // animates transform and would override the placement.
            <div
              className="pointer-events-none absolute z-10 w-[240px]"
              style={{
                left: `${left}%`,
                top: below ? `calc(${top}% + 28px)` : `calc(${top}% - 18px)`,
                transform: `translate(${shift}, ${below ? "0" : "-100%"})`,
              }}
            >
            <div
              role="tooltip"
              className="rounded-xl border border-white/10 bg-[#141414]/95 px-4 py-3 shadow-xl backdrop-blur animate-fade-up"
            >
              <div className="text-[0.9rem] font-medium text-white">
                {c.name}
              </div>
              <p className="mt-1.5 text-[0.8rem] leading-[1.5] text-white/65">
                {c.info}
              </p>
            </div>
            </div>
          );
        })()}
        </div>
        <div className="@container mx-auto mt-8 w-full max-w-[480px] border-t border-white/10 pt-6">
          <div className="flex items-center justify-between gap-4">
            <span className="flex min-w-0 items-center gap-3">
              <Mark m={active} />
              <span className="truncate text-[0.95rem] font-medium text-white">
                {active.name}
              </span>
            </span>
            <span className="flex shrink-0 items-baseline gap-2">
              <span className="text-[0.75rem] text-white/50">Overall</span>
              <span className="text-[1.5rem] font-semibold tabular-nums tracking-[-0.02em] text-white">
                {Math.round(active.overall * 100)}
              </span>
            </span>
          </div>
          <dl className="mt-6 grid grid-cols-5 gap-3">
            {axes.map((d, i) => (
              <div key={d} className="min-w-0">
                <dt
                  className={`min-h-[2.6em] text-[0.6rem] font-semibold uppercase leading-[1.3] tracking-[0.08em] transition-colors duration-300 @max-[460px]:text-[0.52rem] @max-[460px]:tracking-[0.03em] ${
                    axis === i ? "text-white" : "text-white/45"
                  }`}
                >
                  {d}
                </dt>
                <dd
                  className={`mt-1.5 text-[1.05rem] font-semibold tabular-nums transition-colors duration-300 ${
                    axis === -1 || axis === i ? "text-white" : "text-white/60"
                  }`}
                >
                  {Math.round(valuesOf(active)[i] * 100)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
