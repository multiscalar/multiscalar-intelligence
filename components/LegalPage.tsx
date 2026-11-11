// Shared layout for long reading pages (privacy policy, terms, the index
// methodology): a narrow column with plain headings, paragraphs, lists and
// tables.
export default function LegalPage({
  title,
  updated,
  label = "Legal",
  intro,
  children,
}: {
  title: string;
  /** Shown as "Last updated", e.g. "7 October 2026". */
  updated: string;
  label?: string;
  /** A larger opening paragraph under the title. */
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-[720px] mx-auto pt-40 px-8 section-b max-[780px]:pt-32 max-[780px]:px-5">
      <div className="label text-text-dim">{label}</div>
      <h1 className="mt-4 font-sans text-[clamp(2.2rem,4.5vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-black">
        {title}
      </h1>
      {intro && (
        <p className="mt-6 text-[1.15rem] leading-[1.6] text-black/70">{intro}</p>
      )}
      <p className="mt-4 text-[0.85rem] text-text-dim">Last updated {updated}</p>
      <div className="mt-12 text-[0.98rem] leading-[1.75] text-[#444] [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:font-sans [&_h2]:text-[1.25rem] [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-black [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-2 [&_a]:text-black [&_a]:underline [&_a]:underline-offset-[3px] [&_strong]:font-semibold [&_table]:mt-5 [&_table]:w-full [&_table]:border-collapse [&_table]:text-[0.9rem] [&_th]:border-b [&_th]:border-black/10 [&_th]:py-2.5 [&_th]:pr-4 [&_th]:text-left [&_th]:text-[0.68rem] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.08em] [&_th]:text-text-dim [&_td]:border-b [&_td]:border-black/[0.06] [&_td]:py-3 [&_td]:pr-4 [&_td]:align-top">
        {children}
      </div>
    </main>
  );
}
