// One deep-dive chart under a benchmark's leaderboard, straight on the page
// background: label, title, a line on how to read it, then the chart.
export default function ChartCard({
  id,
  label,
  title,
  description,
  controls,
  children,
}: {
  id?: string;
  label: string;
  title: string;
  description?: React.ReactNode;
  /** Marks the chart's data as illustrative, until the real data lands.
   *  Not shown on the page (the visible tag was removed on 2026-10-07). */
  example?: boolean;
  /** Rendered top-right, beside the title (e.g. a pill toggle). */
  controls?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="section-mt scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[680px]">
          <div className="mb-3">
            <span className="label text-text-dim">{label}</span>
          </div>
          <h2 className="font-sans text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-black">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-[1rem] leading-[1.65] text-black/55">
              {description}
            </p>
          )}
        </div>
        {controls}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}

