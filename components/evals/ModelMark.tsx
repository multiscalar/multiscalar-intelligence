// A provider's logo (SVG path or fallback character) in its brand colour on
// a small white disc, so every logo stays legible on the dark panels and the
// light cards alike. Without a colour it falls back to a monochrome mark.
export default function ModelMark({
  icon,
  mark,
  color,
  tone = "dark",
  size = "md",
  title,
}: {
  icon?: string;
  mark?: string;
  color?: string;
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  title?: string;
}) {
  const box = { sm: "w-5 h-5", md: "w-7 h-7", lg: "w-11 h-11" }[size];
  const glyph = { sm: "w-3 h-3", md: "w-3.5 h-3.5", lg: "w-5 h-5" }[size];
  const text = { sm: "text-[0.55rem]", md: "text-[0.65rem]", lg: "text-[0.85rem]" }[
    size
  ];
  const disc = color
    ? tone === "light"
      ? "bg-white ring-1 ring-black/[0.08]"
      : "bg-white"
    : tone === "dark"
      ? "bg-white/[0.08] text-white"
      : "bg-black/[0.05] text-black";
  return (
    <span
      title={title}
      className={`flex ${box} shrink-0 items-center justify-center rounded-full ${disc}`}
      style={color ? { color } : undefined}
    >
      {icon ? (
        <svg viewBox="0 0 24 24" aria-hidden className={glyph}>
          <path d={icon} fill="currentColor" />
        </svg>
      ) : (
        <span className={`${text} font-semibold`}>{mark ?? "•"}</span>
      )}
    </span>
  );
}
