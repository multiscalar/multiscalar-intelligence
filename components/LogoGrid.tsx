import { IconArrowUpRight } from "central-icons";

export type GridLogo = {
  name: string;
  /** Path to a logo file in public/. Without it a neutral placeholder renders. */
  src?: string;
  /** Corner tab, e.g. "Case study" or "Read more". */
  cta?: string;
  /** Makes the whole cell a link (to the case study, post, ...). */
  href?: string;
};

// Placeholder marks until the real logo files arrive.
const SHAPES = [
  <circle key="c" cx="12" cy="12" r="9" />,
  <rect key="r" x="3" y="3" width="18" height="18" rx="4" />,
  <path key="t" d="M12 3 21 20H3Z" />,
  <path key="d" d="M12 2 22 12 12 22 2 12Z" />,
];

// Class sets per tone, written out in full so Tailwind finds them. "dark"
// sits on the hero photo: white hairlines and a light tint behind each cell.
const TONES = {
  light: {
    grid: "grid-cols-5 border-black/[0.08] max-[900px]:grid-cols-3 max-[600px]:grid-cols-2",
    cell: "h-[128px] border-black/[0.08] max-[768px]:h-[104px]",
    link: "hover:bg-black/[0.02]",
    img: "opacity-45 grayscale group-hover:opacity-90",
    mark: "text-[#b4b4b4] group-hover:text-[#141311]",
    tab: "border-black/[0.08] text-black/40 group-hover:text-black",
  },
  dark: {
    grid: "grid-cols-5 border-white/[0.14]",
    cell: "h-[96px] border-white/[0.14] bg-black/20 backdrop-blur-[2px]",
    link: "hover:bg-black/35",
    img: "opacity-60 brightness-0 invert group-hover:opacity-100",
    mark: "text-white/55 group-hover:text-white",
    tab: "border-white/[0.14] text-white/50 group-hover:text-white",
  },
};

// Partner logos in a grid of equal cells divided by hairlines. Logos sit
// muted and brighten on hover; a cell with a `cta` carries a small tab in its
// top right corner, and with an `href` the whole cell is the link.
export default function LogoGrid({
  logos,
  tone = "light",
  className = "",
}: {
  logos: GridLogo[];
  tone?: keyof typeof TONES;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <ul
      aria-label="Partners"
      className={`grid border-l border-t ${t.grid} ${className}`}
    >
      {logos.map((logo, i) => {
        const inner = (
          <>
            {logo.src ? (
              // Plain img: logos are small SVGs that need no optimisation.
              <img
                src={logo.src}
                alt={logo.name}
                className={`h-8 w-auto transition-opacity duration-300 max-[768px]:h-7 ${t.img}`}
              />
            ) : (
              <span className={`inline-flex items-center gap-2.5 transition-colors duration-300 ${t.mark}`}>
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
                  {SHAPES[i % SHAPES.length]}
                </svg>
                <span className="text-[1.1rem] font-semibold tracking-[-0.01em]">
                  {logo.name}
                </span>
              </span>
            )}
            {logo.cta && (
              <span className={`absolute right-0 top-0 inline-flex items-center gap-1 border-b border-l px-2.5 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ${t.tab}`}>
                {logo.cta}
                {logo.href && <IconArrowUpRight aria-hidden className="h-2.5 w-2.5" />}
              </span>
            )}
          </>
        );
        const cell = `group relative flex items-center justify-center border-b border-r ${t.cell}`;
        return (
          <li key={logo.name}>
            {logo.href ? (
              <a href={logo.href} className={`${cell} transition-colors duration-300 ${t.link}`}>
                {inner}
              </a>
            ) : (
              <div className={cell}>{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
