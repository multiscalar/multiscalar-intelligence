export default function Footer({
  variant = "default",
}: {
  variant?: "default" | "article";
}) {
  return (
    <footer className="border-t border-border">
      <div className="py-12 flex justify-between items-start flex-wrap gap-8 max-[768px]:flex-col">
        <div className="flex flex-col gap-[0.3rem]">
          <span className="font-mono font-medium text-[0.85rem] tracking-[0.1em]">
            Multiscalar Intelligence
          </span>
          <span className="font-mono text-[0.72rem] text-text-dim tracking-[0.05em]">
            London, UK
          </span>
        </div>
        <div className="flex gap-8 max-[768px]:flex-wrap max-[768px]:gap-[1.2rem]">
          {variant === "article" && (
            <a
              href="/open-science/"
              className="font-mono text-[0.78rem] text-text-secondary tracking-[0.03em] hover:text-text"
            >
              Open Science
            </a>
          )}
          <a
            href="mailto:hello@multiscalar.ai"
            className="font-mono text-[0.78rem] text-text-secondary tracking-[0.03em] hover:text-text"
          >
            Contact
          </a>
        </div>
        <div className="w-full font-mono text-[0.7rem] text-text-dim mt-4 tracking-[0.03em]">
          &copy; 2026 Multiscalar Intelligence. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
