"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/#research", label: "Research", path: null },
  { href: "/evals/", label: "Evals", path: "/evals" },
  { href: "/open-science/", label: "Open Science", path: "/open-science" },
  { href: "mailto:hello@multiscalar.ai", label: "Contact", path: null },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="fixed top-0 left-0 right-0 z-100 bg-[rgba(250,250,250,0.88)] backdrop-blur-[20px] border-b border-border">
      <div className="max-w-[1200px] mx-auto px-8 py-4 flex justify-between items-center max-[768px]:px-6">
        <Link
          href="/"
          className="font-mono font-semibold text-[1.1rem] uppercase text-text leading-[1.05] inline-flex flex-col items-center text-center gap-1"
        >
          <span className="tracking-[0.15em] pl-[0.15em]">Multiscalar</span>
          <span className="tracking-[0.15em] pl-[0.15em]">Intelligence</span>
        </Link>
        <div className="flex gap-8 max-[768px]:gap-[1.2rem] max-[480px]:gap-[0.8rem]">
          {LINKS.map(({ href, label, path }) => {
            const current = path !== null && pathname.startsWith(path);
            return (
              <a
                key={href}
                href={href}
                className={`font-mono text-[0.8rem] tracking-[0.05em] lowercase max-[768px]:text-[0.72rem] ${
                  current
                    ? "text-black font-medium"
                    : "text-text-dim hover:text-text"
                }`}
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
