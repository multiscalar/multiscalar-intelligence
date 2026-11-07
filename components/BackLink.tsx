import { IconArrowLeft } from "central-icons";

// "← Section" link at the top of inner pages. The arrow nudges left on hover.
// Colour (and any margin) comes from `className`; the default suits the light
// page background.
export default function BackLink({
  href,
  children,
  className = "text-text-dim hover:text-black",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-1.5 text-[0.8rem] font-medium transition-colors ${className}`}
    >
      <IconArrowLeft
        aria-hidden
        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
      />
      {children}
    </a>
  );
}
