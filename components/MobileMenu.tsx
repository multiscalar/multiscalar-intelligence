"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { IconArrowRight } from "central-icons";
import BrandIcon from "@/components/BrandIcon";
import SoonTag from "@/components/SoonTag";
import { evalsSoon } from "@/lib/launch";
import type { NavItem, NavMenu } from "@/lib/nav";
import { SOCIAL_LINKS, externalProps } from "@/lib/social";

const isMenu = (item: NavItem): item is NavMenu => "primary" in item;

// Each row rises in a beat after the one above it.
const stagger = (i: number): CSSProperties => ({ animationDelay: `${60 + i * 45}ms` });

// Phones: a full-screen sheet under the nav bar. Each top-level section is a
// large row that expands (one at a time) to the same content as its desktop
// mega menu: pages with descriptions, then (after a divider) the secondary
// list, as plain text. Calls to action and
// social links sit at the bottom.
export default function MobileMenu({
  items,
  isCurrent,
  onClose,
  closing,
  top,
}: {
  items: NavItem[];
  /** Bottom edge of the nav bar, in px: the sheet's content starts there. */
  top: number;
  isCurrent: (paths: string[]) => boolean;
  onClose: () => void;
  /** Fading out; the nav unmounts the sheet when the fade ends. */
  closing: boolean;
}) {
  const menus = items.filter(isMenu);
  // Every section starts closed.
  const [open, setOpen] = useState<string | null>(null);

  // Lock the page behind the sheet, and let Escape close it.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      id="nav-menu"
      style={{ paddingTop: top }}
      className={`fixed inset-0 z-0 hidden max-[720px]:flex flex-col overflow-y-auto overscroll-contain bg-bg motion-reduce:animate-none ${
        closing ? "animate-sheet-out pointer-events-none" : "animate-sheet-in"
      }`}
    >
      <div className="flex-1 px-6 pt-4">
        {items.map((item, i) => {
          if (!isMenu(item)) {
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={onClose}
                style={stagger(i)}
                className="flex items-center justify-between border-b border-black/[0.08] py-5 animate-row-in motion-reduce:animate-none"
              >
                <span className="text-[1.75rem] font-semibold tracking-[-0.03em] text-black">
                  {item.label}
                </span>
                <IconArrowRight aria-hidden className="h-5 w-5 text-black/40" />
              </a>
            );
          }
          const expanded = open === item.label;
          const panelId = `nav-menu-${item.label.toLowerCase().replace(/\s+/g, "-")}`;
          return (
            <section
              key={item.label}
              style={stagger(i)}
              className="border-b border-black/[0.08] animate-row-in motion-reduce:animate-none"
            >
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : item.label)}
                className="flex w-full cursor-pointer items-center justify-between py-5 text-left"
              >
                <span className="text-[1.75rem] font-semibold tracking-[-0.03em] text-black">
                  {item.label}
                </span>
                {/* Plus when closed, minus when open: the vertical bar folds
                    away, so the menu's only cross is the close button. */}
                <span
                  aria-hidden
                  className={`relative grid h-9 w-9 place-items-center rounded-full border transition-colors duration-300 ${
                    expanded ? "border-black bg-black text-white" : "border-black/10 bg-white text-black"
                  }`}
                >
                  <span className="absolute h-[1.5px] w-3.5 rounded-full bg-current" />
                  <span
                    className={`absolute h-3.5 w-[1.5px] rounded-full bg-current transition-transform duration-300 motion-reduce:transition-none ${
                      expanded ? "scale-y-0" : "scale-y-100"
                    }`}
                  />
                </span>
              </button>

              {/* Height animates via grid rows: 0fr (closed) to 1fr (open). */}
              <div
                id={panelId}
                className={`grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden" inert={!expanded}>
                  <div className="pb-6">
                    <div className="flex flex-col gap-1">
                      {item.primary.map((link) => (
                        <a
                          key={link.href + link.title}
                          href={link.href}
                          onClick={onClose}
                          {...externalProps(link.href)}
                          className="-mx-3 rounded-xl px-3 py-2.5 transition-colors active:bg-black/[0.04]"
                        >
                          <span className="block text-[1rem] font-medium text-black">
                            {link.title}
                          </span>
                          {link.description && (
                            <span className="mt-0.5 block text-[0.85rem] leading-[1.45] text-[#777]">
                              {link.description}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>

                    {item.secondary.length > 0 && (
                      <div className="mt-4 border-t border-black/[0.08] pt-4">
                        <div className="label mb-1 text-text-dim">{item.secondaryLabel}</div>
                        {item.secondary.map((link) =>
                          link.soon ? (
                            <span
                              key={link.href + link.title}
                              aria-disabled="true"
                              className="-mx-3 flex items-center gap-2 px-3 py-2 text-[1rem] text-[#333]/45"
                            >
                              {link.title}
                              <SoonTag short />
                            </span>
                          ) : (
                          <a
                            key={link.href + link.title}
                            href={link.href}
                            onClick={onClose}
                            {...externalProps(link.href)}
                            className="-mx-3 block rounded-xl px-3 py-2 text-[1rem] text-[#333] transition-colors active:bg-black/[0.04]"
                          >
                            {link.title}
                          </a>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div
        style={stagger(items.length)}
        className="px-6 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] animate-row-in motion-reduce:animate-none"
      >
        <div className="flex flex-col gap-2.5">
          <a
            href="/contact/"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3.5 text-[0.9rem] font-medium text-white"
          >
            Get in touch
          </a>
          {evalsSoon("/evals/") ? (
            <span
              aria-disabled="true"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 px-5 py-3.5 text-[0.9rem] font-medium text-black/45"
            >
              Explore the evals
              <SoonTag />
            </span>
          ) : (
            <a
              href="/evals/"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-black/15 px-5 py-3.5 text-[0.9rem] font-medium text-black"
            >
              Explore the evals
            </a>
          )}
        </div>
        <div className="mt-6 flex items-center justify-center">
          <div className="flex gap-2">
            {SOCIAL_LINKS.map(({ href, label, icon }) => (
              <a
                key={icon}
                href={href}
                aria-label={label}
                {...externalProps(href)}
                className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white text-[#444]"
              >
                <BrandIcon icon={icon} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
