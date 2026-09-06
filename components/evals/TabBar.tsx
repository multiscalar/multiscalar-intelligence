"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface Tab {
  href: string;
  label: string;
}

// idler-style tab row under the benchmark header; tabs are real URLs.
export default function TabBar({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();
  if (tabs.length < 2) return null;
  const norm = (p: string) => p.replace(/\/+$/, "");
  return (
    <div className="flex gap-6 border-b border-border mb-2" role="tablist">
      {tabs.map((t) => {
        const active = norm(pathname) === norm(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            role="tab"
            aria-selected={active}
            className={`font-mono text-[0.78rem] lowercase tracking-[0.05em] pb-2 -mb-px border-b-2 ${
              active
                ? "text-black font-medium border-black"
                : "text-text-dim border-transparent hover:text-text"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
