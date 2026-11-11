"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import {
  IconBank,
  IconBuildingBlocks,
  IconChart3,
  IconCoins,
  IconJudgeGavel,
  IconPackage,
  IconChevronDownSmall,
  IconEmail1,
  IconFileText,
  IconHandshake,
  IconLab,
  IconProcessor,
  IconRocket,
  IconStore1,
  IconSword,
} from "central-icons";
import BrandIcon from "@/components/BrandIcon";
import SoonTag from "@/components/SoonTag";
import MobileMenu from "@/components/MobileMenu";
import { useIndicator } from "@/components/useIndicator";
import type { NavIcon, NavItem, NavMenu } from "@/lib/nav";
import { externalProps, type SocialIcon, type SocialLink } from "@/lib/social";

type IconComponent = ComponentType<{ className?: string; strokeWidth?: number }>;

// Brand marks are filled, so they ignore strokeWidth.
const brand = (icon: SocialIcon): IconComponent =>
  function Brand({ className }) {
    return <BrandIcon icon={icon} className={className} />;
  };

const ICONS: Record<NavIcon, IconComponent> = {
  boxes: IconBuildingBlocks,
  flask: IconLab,
  cpu: IconProcessor,
  rocket: IconRocket,
  swords: IconSword,
  landmark: IconBank,
  handshake: IconHandshake,
  store: IconStore1,
  package: IconPackage,
  coins: IconCoins,
  gavel: IconJudgeGavel,
  chart: IconChart3,
  file: IconFileText,
  mail: IconEmail1,
  github: brand("github"),
  x: brand("x"),
  linkedin: brand("linkedin"),
  discord: brand("discord"),
};

// Bottom edge of the nav's pills; the nav keeps its over-hero look until the
// hero's bottom edge scrolls above this.
const NAV_BOTTOM = 72;

// Mobile menu fade, in and out; matches sheet-in/sheet-out in globals.css.
const MENU_FADE_MS = 300;

const isMenu = (item: NavItem): item is NavMenu => "primary" in item;

// Pages that open on a full-bleed hero image: only home. The index opens
// on its split-flap board.
const hasHero = (path: string) => path === "/";

// The header button: a conversation with us, open to every visitor.
const CTA_HREF = "/contact/";

export default function Nav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  // Distance from the top of the viewport: below the announcement band while
  // it is on screen, then pinned to the top once it has scrolled away. Until
  // measured, --banner-h (set by the layout, zeroed if dismissed) stands in.
  const [top, setTop] = useState<number | null>(null);
  // Pages with a hero start in overlay mode so the server-rendered nav
  // doesn't flash light before the effect runs.
  const [overHero, setOverHero] = useState(hasHero(pathname));
  // Below 720px the links collapse into a full-screen menu, which starts at
  // the nav bar's bottom edge (measured when it opens).
  const [menuOpen, setMenuOpen] = useState(false);
  // Set while the menu fades out; it unmounts when the fade ends. The bar,
  // its backing and the sheet all fade on the same MENU_FADE_MS timing.
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [menuTop, setMenuTop] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const resetMenu = useCallback(() => {
    clearTimeout(closeTimer.current);
    setMenuOpen(false);
    setClosing(false);
  }, []);
  const closeMenu = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      resetMenu();
      return;
    }
    setClosing(true);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(resetMenu, MENU_FADE_MS);
  }, [resetMenu]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);
  const sheetShown = menuOpen && !closing;
  // True once the sheet has finished fading in. Until then the sheet alone
  // paints the light background, behind the bar as well as below it, so the
  // two can't fade at different moments.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!sheetShown) {
      setSettled(false);
      return;
    }
    const timer = setTimeout(() => setSettled(true), MENU_FADE_MS);
    return () => clearTimeout(timer);
  }, [sheetShown]);
  const toggleMenu = () => {
    if (sheetShown) return closeMenu();
    clearTimeout(closeTimer.current);
    setClosing(false);
    setMenuTop(navRef.current?.getBoundingClientRect().bottom ?? 0);
    setMenuOpen(true);
  };
  // Label of the open desktop mega menu ("" when closed). Radix handles hover,
  // keyboard, Escape and outside clicks; we only reset it on navigation.
  const [openMenu, setOpenMenu] = useState("");

  useEffect(() => {
    resetMenu();
    setOpenMenu("");
    const hero = document.getElementById("hero");
    if (!hero) {
      setOverHero(false);
      return;
    }
    const update = () =>
      setOverHero(hero.getBoundingClientRect().bottom > NAV_BOTTOM);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname, resetMenu]);

  useEffect(() => {
    const update = () => {
      const band = document.getElementById("announcement");
      setTop(Math.max(0, (band?.offsetHeight ?? 0) - window.scrollY));
    };
    update();
    // Follows the band frame by frame while it collapses.
    const band = document.getElementById("announcement");
    const observer = band ? new ResizeObserver(update) : null;
    if (band) observer?.observe(band);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // An open mobile menu needs the light style to sit on its light panel. It
  // switches back as soon as the menu starts closing, so the bar fades out
  // together with the sheet.
  const overlay = overHero && !sheetShown;

  const isCurrent = (paths: string[]) =>
    paths.some((p) => (p === "/" ? pathname === "/" : pathname.startsWith(p)));

  // Over the hero, the current page's white chip and a soft hover highlight
  // are single pills that slide between items rather than fading per item.
  const list = useRef<HTMLUListElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const currentLabel = items.find((i) => isCurrent(i.paths))?.label ?? null;
  const hoverKey = overlay ? (hovered ?? (openMenu || null)) : null;
  const chip = useIndicator(list, overlay ? currentLabel : null);
  const highlight = useIndicator(
    list,
    hoverKey === currentLabel ? null : hoverKey,
  );

  // Over the hero the links sit in a frosted pill on a transparent bar.
  // Elsewhere it's a plain nav: white bar, no pill (the pill keeps its padding
  // with a transparent fill, so nothing shifts between the two).
  const pill = `rounded-full border transition-[background-color,border-color,color] duration-300 ${
    overlay
      ? "bg-white/15 border-white/25 backdrop-blur-md"
      : "bg-transparent border-transparent"
  }`;

  // Current page: a white chip over the hero, bold black text elsewhere.
  const linkStyle = (current: boolean) =>
    current
      ? overlay
        ? "text-black hover:text-black"
        : "text-black font-semibold hover:text-black"
      : overlay
        ? "text-white/90 hover:text-white"
        : "text-[#444] hover:text-black";

  const itemClass =
    "relative inline-flex items-center gap-1 rounded-full px-4 py-[0.45rem] font-sans text-[0.85rem] font-medium tracking-[0.005em] whitespace-nowrap cursor-pointer transition-[background-color,color] duration-300 max-[768px]:px-3 max-[768px]:text-[0.75rem]";

  return (
    <nav
      ref={navRef}
      style={{ top: top ?? "var(--banner-h, 0px)" }}
      className={`fixed left-0 right-0 z-100 pt-3 transition-colors duration-300 max-[768px]:pt-2 ${
        overHero ? "bg-transparent" : "bg-bg"
      }`}
    >
      {/* The mobile menu sheet renders inside the nav (z-0) and covers the
          whole screen, bar included, so one layer fades in and out. Once it
          has settled, a solid backing (z-[5]) covers the nav's own box so
          scrolled menu content passes under the bar (z-10), not through it. */}
      {settled && <div aria-hidden className="absolute inset-0 z-[5] bg-bg" />}
      <div className="relative z-10 max-w-[1200px] mx-auto px-8 py-3 flex justify-between items-center max-[768px]:px-6">
        <Link
          href="/"
          className={`font-sans font-semibold text-[0.9rem] uppercase tracking-[0.15em] whitespace-nowrap transition-colors duration-300 max-[768px]:text-[0.8rem] ${
            overlay ? "text-white hover:text-white" : "text-black hover:text-black"
          }`}
        >
          Multiscalar Intelligence
        </Link>

        {/* Desktop: Radix Navigation Menu. Moving between triggers keeps the
            panel open, resizes it to the new content and slides the content
            in from the side you moved towards. */}
        <NavigationMenu.Root
          value={openMenu}
          onValueChange={setOpenMenu}
          delayDuration={60}
          className="relative ml-auto max-[720px]:hidden"
        >
          <NavigationMenu.List
            ref={list}
            onMouseLeave={() => setHovered(null)}
            className={`relative flex gap-1 p-1 ${pill}`}
          >
            <li aria-hidden className="rounded-full bg-white/15" style={highlight} />
            <li aria-hidden className="rounded-full bg-white" style={chip} />
            {items.filter((item) => isMenu(item) || item.href !== CTA_HREF).map((item) => {
              const current = isCurrent(item.paths);
              if (!isMenu(item)) {
                return (
                  <NavigationMenu.Item key={item.label}>
                    <NavigationMenu.Link
                      href={item.href}
                      active={current}
                      data-indicator={item.label}
                      onMouseEnter={() => setHovered(item.label)}
                      onFocus={() => setHovered(item.label)}
                      className={`${itemClass} ${linkStyle(current)}`}
                    >
                      {item.label}
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                );
              }
              return (
                <NavigationMenu.Item key={item.label} value={item.label}>
                  <NavigationMenu.Trigger
                    aria-current={current ? "page" : undefined}
                    data-indicator={item.label}
                    onMouseEnter={() => setHovered(item.label)}
                    onFocus={() => setHovered(item.label)}
                    className={`group ${itemClass} ${linkStyle(current)}`}
                  >
                    {item.label}
                    <IconChevronDownSmall
                      aria-hidden
                      className="w-3.5 h-3.5 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180"
                    />
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content className="w-[640px] data-[motion^=to-]:absolute data-[motion^=to-]:top-0 data-[motion^=to-]:left-0 data-[motion=from-start]:animate-enter-from-left data-[motion=from-end]:animate-enter-from-right data-[motion=to-start]:animate-exit-to-left data-[motion=to-end]:animate-exit-to-right">
                    <MegaMenu menu={item} />
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
              );
            })}
          </NavigationMenu.List>

          <div className="absolute top-full right-0 mt-3 flex justify-end">
            <NavigationMenu.Viewport className="relative origin-top-right overflow-hidden rounded-[20px] border border-black/[0.07] bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.3)] h-[var(--radix-navigation-menu-viewport-height,auto)] w-[var(--radix-navigation-menu-viewport-width,auto)] transition-[width,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=open]:animate-menu-in data-[state=closed]:animate-menu-out" />
          </div>
        </NavigationMenu.Root>

        {/* The bar's one button. Phones get it at the foot of the menu. */}
        <Link
          href={CTA_HREF}
                    className={`ml-2 inline-flex items-center rounded-full px-5 py-[0.55rem] font-sans text-[0.85rem] font-medium whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 max-[720px]:hidden ${
            overlay
              ? "bg-ember text-ember-ink hover:bg-ember-hover hover:text-ember-ink focus-visible:outline-white"
              : "bg-ember-ink text-ember hover:bg-black hover:text-ember focus-visible:outline-black"
          }`}
        >
          Get in touch
        </Link>

        <button
          type="button"
          aria-expanded={sheetShown}
          aria-controls="nav-menu"
          aria-label={sheetShown ? "Close menu" : "Open menu"}
          onClick={toggleMenu}
          className={`relative hidden max-[720px]:inline-flex h-10 w-10 items-center justify-center cursor-pointer transition-colors duration-300 ${
            overlay ? "text-white" : "text-black"
          }`}
        >
          {/* Two lines that rotate into a cross when the menu opens. */}
          <span
            aria-hidden
            className={`absolute h-[1.5px] w-[18px] rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              sheetShown ? "rotate-45" : "-translate-y-[3.5px]"
            }`}
          />
          <span
            aria-hidden
            className={`absolute h-[1.5px] w-[18px] rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              sheetShown ? "-rotate-45" : "translate-y-[3.5px]"
            }`}
          />
        </button>
      </div>

      {menuOpen && (
        <MobileMenu
          items={items}
          isCurrent={isCurrent}
          onClose={closeMenu}
          closing={closing}
          top={menuTop}
        />
      )}
    </nav>
  );
}

function MegaMenu({ menu }: { menu: NavMenu }) {
  return (
    <div className="grid grid-cols-2">
      <div className="p-8">
        <div className="label text-text-dim mb-4">
          {menu.primaryLabel}
        </div>
        <div className="flex flex-col gap-2">
          {menu.primary.map((link) => (
            <NavigationMenu.Link
              key={link.href + link.title}
              href={link.href}
              className="-mx-3 block rounded-xl px-3 py-3 transition-colors hover:bg-[#f6f6f6]"
            >
              <div className="font-sans text-[0.95rem] font-medium text-black">
                {link.title}
              </div>
              {link.description && (
                <div className="mt-1 font-sans text-[0.82rem] leading-[1.5] text-[#777]">
                  {link.description}
                </div>
              )}
            </NavigationMenu.Link>
          ))}
        </div>
      </div>

      <div className="p-8 bg-[#f7f7f7] border-l border-black/[0.05]">
        <div className="label text-text-dim mb-4">
          {menu.secondaryLabel}
        </div>
        <div className="flex flex-col gap-1">
          {menu.secondary.map((link) => {
            const Icon = link.icon ? ICONS[link.icon] : null;
            if (link.soon)
              return (
                <span
                  key={link.href + link.title}
                  aria-disabled="true"
                  className="-mx-3 flex cursor-default items-start gap-3 px-3 py-[0.6rem] font-sans text-[0.9rem] font-medium leading-[1.4] text-black/40"
                >
                  {Icon && (
                    <Icon strokeWidth={1.8} className="mt-[0.1rem] w-4 h-4 shrink-0" />
                  )}
                  {link.title}
                  <SoonTag short className="mt-[0.1rem]" />
                </span>
              );
            return (
              <NavigationMenu.Link
                key={link.href + link.title}
                href={link.href}
                {...externalProps(link.href)}
                className="-mx-3 flex items-start gap-3 rounded-xl px-3 py-[0.6rem] font-sans text-[0.9rem] font-medium leading-[1.4] text-black transition-colors hover:bg-white hover:text-black"
              >
                {Icon && (
                  <Icon
                    strokeWidth={1.8}
                    className="mt-[0.1rem] w-4 h-4 shrink-0 text-[#444]"
                  />
                )}
                {link.title}
              </NavigationMenu.Link>
            );
          })}
        </div>
        {menu.socials && (
          <div className="mt-4">
            <SocialRow socials={menu.socials} />
          </div>
        )}
      </div>
    </div>
  );
}

// Social profiles as a row of round icon buttons, no labels.
function SocialRow({ socials }: { socials: SocialLink[] }) {
  return (
    <div className="flex gap-2">
      {socials.map(({ href, label, icon }) => (
        <a
          key={icon}
          href={href}
          aria-label={label}
          {...externalProps(href)}
          className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white text-[#444] transition-colors hover:border-black/20 hover:text-black"
        >
          <BrandIcon icon={icon} className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
