// Single row of logos scrolling right to left. The list is rendered twice and
// the track slides by half its width, so the loop is seamless.
export type MarqueeLogo = {
  name: string;
  // Path to a logo file in public/. Without it a neutral placeholder renders.
  src?: string;
  /** Height in px on desktop (phones use 85%). Wide wordmarks sit lower
   *  than compact marks so every logo carries a similar visual weight. */
  height?: number;
};

// Placeholder marks until the real logo files arrive.
const SHAPES = [
  <circle key="c" cx="12" cy="12" r="9" />,
  <rect key="r" x="3" y="3" width="18" height="18" rx="4" />,
  <path key="t" d="M12 3 21 20H3Z" />,
  <path key="d" d="M12 2 22 12 12 22 2 12Z" />,
];

function Placeholder({ name, index }: { name: string; index: number }) {
  return (
    <span className="inline-flex items-center gap-[0.6rem] text-[#b4b4b4]">
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current max-[768px]:w-7 max-[768px]:h-7" aria-hidden>
        {SHAPES[index % SHAPES.length]}
      </svg>
      <span className="font-sans text-[1.35rem] font-semibold max-[768px]:text-[1.15rem] tracking-[-0.01em]">
        {name}
      </span>
    </span>
  );
}

function Row({ logos, hidden }: { logos: MarqueeLogo[]; hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-20 pr-20 max-[768px]:gap-12 max-[768px]:pr-12" aria-hidden={hidden}>
      {logos.map((logo, i) => (
        <li key={logo.name} className="shrink-0">
          {logo.src ? (
            // Plain img: logos are small SVGs that need no optimisation.
            <img
              src={logo.src}
              alt={hidden ? "" : logo.name}
              style={{ "--h": `${logo.height ?? 36}px` } as React.CSSProperties}
              className="h-[var(--h)] w-auto opacity-60 grayscale max-[768px]:h-[calc(var(--h)*0.85)]"
            />
          ) : (
            <Placeholder name={logo.name} index={i} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function LogoMarquee({ logos }: { logos: MarqueeLogo[] }) {
  return (
    <section
      aria-label="Partners"
      className="group overflow-hidden py-10 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] max-[768px]:py-8"
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        <Row logos={logos} />
        <Row logos={logos} hidden />
      </div>
    </section>
  );
}
