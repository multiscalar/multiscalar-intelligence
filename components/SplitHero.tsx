import Image from "next/image";
import SoonTag from "@/components/SoonTag";
import { IconChevronLeft, IconChevronRight } from "central-icons";
import BackLink from "@/components/BackLink";

// Inner-page hero: text on the page background on the left, a tall rounded
// image on the right (or, with `secondary`, a staggered pair; with `split`, one
// image continuing across a staggered pair). A quieter alternative to the full-bleed Hero, so pages
// below the top level don't all open the same way. The nav stays in its
// light style (no #hero to overlay).
export default function SplitHero({
  src,
  alt,
  focus = "50% 50%",
  back,
  eyebrow,
  title,
  description,
  badge,
  secondary,
  split = false,
  pager,
  actions = [],
}: {
  src: string;
  alt: string;
  /** object-position for the image. */
  focus?: string;
  back?: { href: string; label: string };
  /** Small label above the title. Leave it out on new pages: the title carries the page. */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Small glass chip on the image, e.g. "02 / 04". */
  badge?: string;
  /** Optional second image, shown beside the first, shorter and dropped. */
  secondary?: { src: string; alt: string; focus?: string };
  /** Show `src` as one picture continuing across a staggered pair of panels. */
  split?: boolean;
  /** Carousel-style arrows under the image to the neighbouring pages in a
      series, with a "02 / 04" counter between them. */
  pager?: {
    prev: { href: string; label: string };
    next: { href: string; label: string };
    current: number;
    total: number;
  };
  // The first action renders as the primary (solid) button.
  actions?: { href: string; label: string; soon?: boolean }[];
}) {
  return (
    <section className="max-w-[1200px] mx-auto px-8 pt-32 max-[768px]:px-6 max-[768px]:pt-28">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] items-center gap-14 max-[900px]:grid-cols-1 max-[900px]:gap-10">
        <div className="animate-fade-up">
          {back && (
            <BackLink href={back.href}>{back.label}</BackLink>
          )}
          {eyebrow ? (
            <div className={`label mb-4 text-text-dim ${back ? "mt-10 max-[900px]:mt-8" : ""}`}>
              {eyebrow}
            </div>
          ) : (
            back && <div className="h-10 max-[900px]:h-8" />
          )}
          <h1 className="font-sans text-[clamp(2.6rem,5vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-black">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-[460px] text-[1.05rem] leading-[1.6] text-black/60">
              {description}
            </p>
          )}
          {actions.length > 0 && (
            // Phones show only the primary action.
            <div className="mt-9 flex flex-wrap gap-3">
              {[...actions.filter((a) => !a.soon), ...actions.filter((a) => a.soon)].map(({ href, label, soon }, i) =>
                soon ? (
                  <span
                    key={href}
                    aria-disabled="true"
                    className="inline-flex cursor-default items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-[0.85rem] font-medium text-black/45 max-[768px]:hidden"
                  >
                    {label}
                    <SoonTag />
                  </span>
                ) : (
                <a
                  key={href}
                  href={href}
                  className={`inline-flex items-center rounded-full px-6 py-3 text-[0.85rem] font-medium transition-colors ${
                    i === 0
                      ? "bg-ember-ink text-ember hover:bg-black hover:text-ember"
                      : "border border-black/15 text-black hover:bg-black/[0.04] hover:text-black max-[768px]:hidden"
                  }`}
                >
                  {label}
                </a>
              ),
              )}
            </div>
          )}
        </div>

        {split ? (
          <SplitPair src={src} alt={alt} focus={focus} badge={badge} />
        ) : (
          <div className={secondary ? "grid grid-cols-2 items-start gap-4 max-[768px]:gap-3" : ""}>
            <div
              className={`relative overflow-hidden rounded-[28px] bg-[#1a1712] max-[768px]:rounded-[20px] ${
                secondary
                  ? "h-[min(72svh,660px)] min-h-[420px] max-[900px]:h-[400px] max-[768px]:h-[300px] max-[768px]:min-h-0"
                  : "h-[min(72svh,660px)] min-h-[420px] max-[900px]:h-[420px]"
              }`}
            >
              <Image
                src={src}
                alt={alt}
                fill
                preload
                sizes={secondary ? "(max-width: 900px) 50vw, 28vw" : "(max-width: 900px) 100vw, 55vw"}
                className="object-cover"
                style={{ objectPosition: focus }}
              />
              {badge && (
                <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[0.72rem] font-semibold tracking-[0.08em] text-white backdrop-blur-md max-[768px]:left-3 max-[768px]:top-3">
                  {badge}
                </span>
              )}
            </div>
            {secondary && (
              <div className="relative mt-16 h-[min(58svh,520px)] min-h-[340px] overflow-hidden rounded-[28px] bg-[#1a1712] max-[900px]:mt-12 max-[900px]:h-[320px] max-[768px]:mt-10 max-[768px]:h-[240px] max-[768px]:min-h-0 max-[768px]:rounded-[20px]">
                <Image
                  src={secondary.src}
                  alt={secondary.alt}
                  fill
                  sizes="(max-width: 900px) 50vw, 28vw"
                  className="object-cover"
                  style={{ objectPosition: secondary.focus ?? "50% 50%" }}
                />
              </div>
            )}
          </div>
        )}
      </div>
      {pager && <Pager {...pager} />}
    </section>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

function Pager({
  prev,
  next,
  current,
  total,
}: NonNullable<Parameters<typeof SplitHero>[0]["pager"]>) {
  const button =
    "flex h-11 w-11 items-center justify-center rounded-full border border-black/15 text-black transition-colors hover:bg-black/[0.04] hover:text-black";
  return (
    <nav
      aria-label="More in this series"
      className="mt-8 flex items-center justify-end gap-5 max-[900px]:justify-center"
    >
      <a href={prev.href} aria-label={`Previous: ${prev.label}`} title={prev.label} className={button}>
        <IconChevronLeft aria-hidden className="h-4 w-4" />
      </a>
      <span className="text-[0.9rem] tabular-nums text-black/70">
        {pad(current)} / {pad(total)}
      </span>
      <a href={next.href} aria-label={`Next: ${next.label}`} title={next.label} className={button}>
        <IconChevronRight aria-hidden className="h-4 w-4" />
      </a>
    </nav>
  );
}

// One image behind a staggered pair of panels, as if seen through two windows.
// The pair is a size container; inside each panel the image is sized to the
// whole pair (100cqw x 100cqh) and shifted back by that panel's offset, so the
// picture lines up across the gap. Offsets mirror the grid gap (gap-4, gap-3)
// and the second panel's top margin (mt-16, mt-12, mt-10).
function SplitPair({
  src,
  alt,
  focus,
  badge,
}: {
  src: string;
  alt: string;
  focus: string;
  badge?: string;
}) {
  // The second panel repeats the photo as decoration, without the alt text.
  const image = (described: boolean) => (
    <Image
      src={src}
      alt={described ? alt : ""}
      fill
      preload
      sizes="(max-width: 900px) 100vw, 55vw"
      className="object-cover"
      style={{ objectPosition: focus }}
    />
  );
  return (
    <div className="grid grid-cols-2 items-start gap-4 [container-type:size] h-[min(72svh,660px)] min-h-[420px] max-[900px]:h-[400px] max-[768px]:h-[300px] max-[768px]:min-h-0 max-[768px]:gap-3">
      <div className="relative h-full overflow-hidden rounded-[28px] bg-[#1a1712] max-[768px]:rounded-[20px]">
        <div className="absolute left-0 top-0 w-[100cqw] h-[100cqh]">{image(true)}</div>
        {badge && (
          <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[0.72rem] font-semibold tracking-[0.08em] text-white backdrop-blur-md max-[768px]:left-3 max-[768px]:top-3">
            {badge}
          </span>
        )}
      </div>
      <div
        aria-hidden
        className="relative mt-16 h-[min(58svh,520px)] min-h-[340px] overflow-hidden rounded-[28px] bg-[#1a1712] max-[900px]:mt-12 max-[900px]:h-[320px] max-[768px]:mt-10 max-[768px]:h-[240px] max-[768px]:min-h-0 max-[768px]:rounded-[20px]"
      >
        <div className="absolute left-[calc(-50cqw-8px)] top-[-64px] w-[100cqw] h-[100cqh] max-[900px]:top-[-48px] max-[768px]:left-[calc(-50cqw-6px)] max-[768px]:top-[-40px]">
          {image(false)}
        </div>
      </div>
    </div>
  );
}
