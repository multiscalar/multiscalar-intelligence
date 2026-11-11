// A small pill marking a disabled link to a page that isn't open yet
// (see evalsSoon in lib/launch.ts). Takes its colour from the text around it.
export default function SoonTag({
  short = false,
  className = "",
}: {
  /** "Soon" instead of "Coming soon", for tight menus. */
  short?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full bg-current/10 px-2 py-[0.15rem] text-[0.62rem] font-semibold uppercase leading-none tracking-[0.08em] ${className}`}
    >
      <span className="opacity-80">{short ? "Soon" : "Coming soon"}</span>
    </span>
  );
}
