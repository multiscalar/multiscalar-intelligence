import Reveal from "@/components/Reveal";

// Label, headline and an optional "see all" link, shared by the home sections.
export default function SectionHeader({
  label,
  title,
  description,
  link,
  dark = false,
}: {
  label: string;
  title: string;
  description?: string;
  link?: { href: string; label: string };
  dark?: boolean;
}) {
  return (
    <Reveal className="flex items-end justify-between gap-8 mb-12 max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-5 max-[768px]:mb-8">
      <div>
        <div className={`label mb-3 ${dark ? "text-white/50" : "text-text-dim"}`}>
          {label}
        </div>
        <h2
          className={`max-w-[640px] font-sans text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.035em] ${
            dark ? "text-white" : "text-black"
          }`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`max-w-[560px] mt-5 text-[1rem] leading-[1.65] ${
              dark ? "text-white/60" : "text-[#666]"
            }`}
          >
            {description}
          </p>
        )}
      </div>
      {link && (
        <a
          href={link.href}
          className={`shrink-0 text-[0.88rem] font-medium ${
            dark ? "text-white/80 hover:text-white" : "text-[#444] hover:text-black"
          }`}
        >
          {link.label}
        </a>
      )}
    </Reveal>
  );
}
