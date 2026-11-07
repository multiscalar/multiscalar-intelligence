import Image from "next/image";
import { IconArrowUpRight } from "central-icons";
import BackLink from "@/components/BackLink";
import SoonTag from "@/components/SoonTag";

// Full-bleed hero card: an image with rounded corners, inset from the viewport
// edges. The Nav overlays it (see Nav.tsx, which watches #hero). Without `src`
// it falls back to a gradient placeholder. `short` trims it for inner pages.
// `mobileFocus` is the image's object-position on phones, where the tall crop
// shows only a narrow slice of a wide photo. `back` adds a small link above
// the eyebrow; an `external` action opens in a new tab and shows ↗, and a
// `soon` one is disabled, tagged "Coming soon" and moved after the others.
export default function Hero({
  src,
  alt = "",
  short = false,
  mobileFocus = "28% 50%",
  eyebrow,
  title,
  description,
  back,
  actions = [],
}: {
  src?: string;
  alt?: string;
  short?: boolean;
  mobileFocus?: string;
  eyebrow: string;
  title: string;
  description?: string;
  back?: { href: string; label: string };
  // The first action renders as the primary (solid) button.
  actions?: { href: string; label: string; external?: boolean; soon?: boolean }[];
}) {
  const ordered = [...actions.filter((a) => !a.soon), ...actions.filter((a) => a.soon)];
  return (
    <section id="hero" className="p-3 max-[768px]:p-2">
      <div
        className={`relative ${
          short
            ? "h-[calc(82svh-1.5rem-var(--banner-h,0px))] max-h-[860px]"
            : "h-[calc(100svh-1.5rem-var(--banner-h,0px))] max-h-[1100px]"
        } min-h-[560px] rounded-[28px] overflow-hidden bg-[#0d1220] transition-[height] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none max-[768px]:h-[calc(100svh-1rem-var(--banner-h,0px))] max-[768px]:min-h-[520px] max-[768px]:rounded-[20px]`}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            preload
            sizes="100vw"
            style={{ "--hero-focus-mobile": mobileFocus } as React.CSSProperties}
            className="object-cover object-center max-[768px]:object-[var(--hero-focus-mobile)]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,#3b4f9a_0%,transparent_55%),radial-gradient(ellipse_at_85%_70%,#7a4a8c_0%,transparent_50%),radial-gradient(ellipse_at_60%_10%,#1f6b7a_0%,transparent_45%),linear-gradient(160deg,#141a2e,#0b0e18)]"
          />
        )}

        {/* Darken the top (for the nav), bottom and left (for the title) so white text stays legible on any image. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.15)_18%,rgba(0,0,0,0)_38%,rgba(0,0,0,0.25)_60%,rgba(0,0,0,0.7)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_60%)]"
        />

        <div className="absolute inset-x-0 bottom-0">
          <div className="max-w-[1200px] mx-auto px-8 pb-16 animate-fade-up max-[768px]:px-6 max-[768px]:pb-10">
            {back && (
              <BackLink
                href={back.href}
                className="mb-6 text-white/70 hover:text-white"
              >
                {back.label}
              </BackLink>
            )}
            <div className="label text-white/85 mb-3">
              {eyebrow}
            </div>
            <h1 className="max-w-[640px] font-sans text-[clamp(2.2rem,4.2vw,3.6rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-white max-[480px]:text-[2rem]">
              {title}
            </h1>
            {description && (
              <p className="max-w-[560px] mt-5 text-pretty text-[1rem] leading-[1.6] font-normal text-white/85 max-[480px]:text-[0.95rem]">
                {description}
              </p>
            )}
            {actions.length > 0 && (
              // Phones show only the primary action; secondaries are desktop-only.
              <div className="flex flex-wrap gap-3 mt-8">
                {ordered.map(({ href, label, external, soon }, i) =>
                  soon ? (
                    <span
                      key={href}
                      aria-disabled="true"
                      className="inline-flex cursor-default items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-[0.85rem] font-medium tracking-[0.01em] text-white/60 backdrop-blur-md max-[768px]:hidden"
                    >
                      {label}
                      <SoonTag />
                    </span>
                  ) : (
                  <a
                    key={href}
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener" } : {})}
                    className={`inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-[0.85rem] font-medium tracking-[0.01em] transition-colors duration-200 ${
                      i === 0
                        ? "bg-white text-black hover:bg-white/85 hover:text-black"
                        : `bg-white/10 text-white border border-white/35 backdrop-blur-md hover:bg-white/20 hover:text-white max-[768px]:hidden`
                    }`}
                  >
                    {label}
                    {external && <IconArrowUpRight aria-hidden className="w-4 h-4" />}
                  </a>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
