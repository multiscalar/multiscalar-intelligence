import Image from "next/image";
import SoonTag from "@/components/SoonTag";
import Reveal from "@/components/Reveal";

interface ClosingCardProps {
  id?: string;
  src: string;
  alt: string;
  /** CSS object-position for the image. */
  focus?: string;
  /** No longer shown: headings carry their own weight (DESIGN.md). */
  label?: string;
  title: string;
  description: string;
  // The first action renders as the primary (solid) button.
  actions: { href: string; label: string; soon?: boolean }[];
}

const HOME: ClosingCardProps = {
  id: "team",
  src: "/home/shop.webp",
  alt: "A small shop run by a friendly robot, with two customers at the counter",
  focus: "50% 35%",
  label: "Work with us",
  title: "Help build the autonomous organizations of the future",
  description:
    "Our team combines frontier AI research, game theory, and experience building economic systems at scale.",
  actions: [
    { href: "/contact/", label: "Get in touch" },
    { href: "/open-science/", label: "See our work" },
  ],
};

// A shorter echo of the hero, closing the page before the footer. Defaults to
// the home page's "Work with us".
export default function ClosingCard(props: Partial<ClosingCardProps>) {
  const { id, src, alt, focus, title, description, actions } = {
    ...HOME,
    ...props,
  };
  // Paper below the band keeps it a page section, not a second footer.
  return (
    <section id={id} className="px-3 pb-16 scroll-mt-24 max-[768px]:px-2 max-[768px]:pb-10">
      <div className="relative h-[560px] overflow-hidden rounded-[28px] bg-[#0d1220] max-[768px]:h-[520px] max-[768px]:rounded-[20px]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: focus }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_30%,rgba(0,0,0,0.65)_100%),linear-gradient(to_right,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_60%)]"
        />
        <div className="absolute inset-x-0 bottom-0">
          <Reveal className="max-w-[1200px] mx-auto px-8 pb-16 max-[768px]:px-6 max-[768px]:pb-10">
            <h2 className="max-w-[600px] font-sans text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-white">
              {title}
            </h2>
            <p className="max-w-[480px] mt-5 text-[1.075rem] leading-[1.6] text-white/90">
              {description}
            </p>
            {/* Phones show only the primary action. */}
            <div className="flex flex-wrap gap-3 mt-8">
              {[...actions.filter((a) => !a.soon), ...actions.filter((a) => a.soon)].map(({ href, label, soon }, i) =>
                soon ? (
                  <span
                    key={href}
                    aria-disabled="true"
                    className="inline-flex cursor-default items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-[0.85rem] font-medium text-white/60 backdrop-blur-md max-[768px]:hidden"
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
                      ? "bg-ember text-ember-ink hover:bg-ember-hover hover:text-ember-ink"
                      : "border border-white/35 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white max-[768px]:hidden"
                  }`}
                >
                  {label}
                </a>
              ),
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
