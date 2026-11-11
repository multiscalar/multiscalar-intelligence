"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIndicator } from "@/components/useIndicator";

export interface Tab {
  href: string;
  label: string;
}

// Pill tabs under the benchmark header; tabs are real URLs, and the white
// pill slides to the current one.
export default function TabBar({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const norm = (p: string) => p.replace(/\/+$/, "");
  const current = tabs.find((t) => norm(pathname) === norm(t.href))?.href;
  const pill = useIndicator(ref, current ?? null);
  if (tabs.length < 2) return <div className="mt-14" />;
  return (
    <div
      ref={ref}
      role="tablist"
      className="relative mt-14 mb-8 inline-flex gap-1 rounded-full bg-black/[0.05] p-1"
    >
      <span
        aria-hidden
        className="rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
        style={pill}
      />
      {tabs.map((t) => {
        const active = t.href === current;
        return (
          <Link
            key={t.href}
            href={t.href}
            role="tab"
            data-indicator={t.href}
            aria-selected={active}
            className={`relative rounded-full px-5 py-2 text-[0.85rem] font-medium transition-colors duration-300 ${
              active ? "text-black hover:text-black" : "text-black/55 hover:text-black"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
