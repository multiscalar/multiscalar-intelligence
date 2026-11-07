import { IconChevronDownSmall } from "central-icons";

// Shared styles for the site's forms (dataset request, contact).
export const FIELD =
  "w-full rounded-[12px] border border-black/10 bg-white px-4 py-3 font-sans text-[0.92rem] text-black outline-none transition-colors placeholder:text-black/35 hover:border-black/20 focus:border-black/50";
export const LABEL = "mb-2 block text-[0.82rem] font-medium text-black/70";
export const SUBMIT =
  "inline-flex cursor-pointer items-center rounded-full bg-black px-6 py-3 text-[0.85rem] font-medium text-white transition-colors hover:bg-black/80";
const SELECT = `${FIELD} cursor-pointer appearance-none pr-10`;

// Native select with the site's chevron in place of the browser's arrows.
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={SELECT} />
      <IconChevronDownSmall
        aria-hidden
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45"
      />
    </div>
  );
}
