"use client";

import { useEffect, useRef, useState } from "react";

// A full-width bar of jump links that sticks under the header on long pages.
// The current section is the last one whose top has passed a line a third
// of the way down the screen; a rule under its link marks it.
export default function SectionNav({
  title,
  items,
}: {
  title: string;
  items: { id: string; label: string }[];
}) {
  const [active, setActive] = useState("");
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.33;
      let current = "";
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  // Anchored sections already clear the header (scroll-mt-28); this adds the
  // bar's own height while the page is open.
  useEffect(() => {
    const root = document.documentElement;
    root.style.scrollPaddingTop = "32px";
    return () => {
      root.style.scrollPaddingTop = "";
    };
  }, []);

  // On phones the row scrolls sideways: keep the current link in view.
  useEffect(() => {
    // Scrolls the row only, never the page (scrollIntoView would do both).
    const row = list.current;
    const link = row?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!row || !link) return;
    const left = link.offsetLeft - 24;
    const right = link.offsetLeft + link.offsetWidth + 24 - row.clientWidth;
    if (row.scrollLeft > left) row.scrollTo({ left, behavior: "smooth" });
    else if (row.scrollLeft < right) row.scrollTo({ left: right, behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-[var(--nav-h)] z-40 border-b border-black/[0.08] bg-bg/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1200px] items-center gap-10 px-8 max-[768px]:px-0">
        <span className="shrink-0 text-[0.85rem] font-semibold text-black max-[900px]:hidden">{title}</span>
        <ul
          ref={list}
          className="relative flex items-center gap-7 overflow-x-auto [scrollbar-width:none] max-[768px]:gap-6 max-[768px]:px-6"
        >
          {items.map(({ id, label }) => (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={`relative block py-4 text-[0.85rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black after:absolute after:inset-x-0 after:bottom-[-1px] after:h-[2px] after:rounded-full after:transition-colors ${
                  active === id
                    ? "text-black after:bg-black hover:text-black"
                    : "text-black/50 after:bg-transparent hover:text-black"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
