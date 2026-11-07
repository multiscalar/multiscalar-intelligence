import BrandIcon from "@/components/BrandIcon";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import SoonTag from "@/components/SoonTag";
import { evalsSoon } from "@/lib/launch";
import { isMenu, navItems, type NavLink } from "@/lib/nav";
import { SOCIAL_LINKS, externalProps } from "@/lib/social";

// The footer bookends the hero: a dark card inset from the sides, rounded at
// the top and running flush to the bottom edge so it closes the page.
export default function Footer() {
  const menus = navItems().filter(isMenu);
  const evals = menus.find((m) => m.label === "Evals");
  const company = menus.find((m) => m.label === "Company");

  // Evals also lists its skills and Company adds Contact; the other
  // menus' right-hand lists (research areas, latest posts) are too long or
  // repetitive here.
  const columns: { label: string; links: NavLink[] }[] = menus.map((menu) => ({
    label: menu.label,
    links:
      menu === evals
        ? [...menu.primary, ...menu.secondary]
        : menu === company
          ? [...menu.primary, { href: "/contact/", title: "Contact" }]
          : menu.primary,
  }));

  return (
    <footer className="px-3 max-[768px]:px-2">
      <div className="relative overflow-hidden rounded-t-[28px] bg-[#0c0c0c] text-white max-[768px]:rounded-t-[20px]">
        <div className="max-w-[1200px] mx-auto px-8 pt-20 pb-10 max-[768px]:px-6 max-[768px]:pt-14 max-[768px]:pb-8">
          <div className="grid grid-cols-[1.1fr_1.4fr] gap-16 max-[960px]:grid-cols-1 max-[960px]:gap-14">
            <div>
              <div className="label text-white/50 mb-3">Multiscalar Intelligence</div>
              <h2 className="max-w-[420px] font-sans text-[clamp(2rem,3.4vw,2.8rem)] font-semibold leading-[1.08] tracking-[-0.035em]">
                Teaching machines to coordinate.
              </h2>
              <p className="max-w-[380px] mt-5 text-[0.95rem] leading-[1.6] text-white/60">
                Economic intelligence for the agent economy.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <a
                  href="/contact/"
                  className="inline-flex items-center rounded-full bg-white px-6 py-3 text-[0.85rem] font-medium text-black transition-colors hover:bg-white/85 hover:text-black"
                >
                  Get in touch
                </a>
                {evalsSoon("/evals/") ? (
                  <span
                    aria-disabled="true"
                    className="inline-flex cursor-default items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-[0.85rem] font-medium text-white/50"
                  >
                    Explore the index
                    <SoonTag />
                  </span>
                ) : (
                  <a
                    href="/evals/"
                    className="inline-flex items-center rounded-full border border-white/25 bg-white/5 px-6 py-3 text-[0.85rem] font-medium text-white transition-colors hover:bg-white/15 hover:text-white"
                  >
                    Explore the index
                  </a>
                )}
              </div>
              <div className="flex gap-2 mt-6">
                {SOCIAL_LINKS.map(({ href, label, icon }) => (
                  <a
                    key={icon}
                    href={href}
                    aria-label={label}
                    {...externalProps(href)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                  >
                    <BrandIcon icon={icon} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <nav
              aria-label="Footer"
              className="grid grid-cols-4 gap-8 max-[640px]:grid-cols-2 max-[640px]:gap-y-10"
            >
              {columns.map((column) => (
                <div key={column.label}>
                  {/* A column of pages not open yet shows one tag, by its heading. */}
                  <div className="label text-white/50 mb-4 flex items-center gap-2">
                    {column.label}
                    {column.links.every((l) => evalsSoon(l.href)) && <SoonTag short />}
                  </div>
                  <ul className="flex flex-col gap-3">
                    {column.links.map((link) => (
                      <li key={link.href + link.title}>
                        {evalsSoon(link.href) ? (
                          <span aria-disabled="true" className="text-[0.88rem] text-white/35">
                            {link.title}
                          </span>
                        ) : (
                          <a
                            href={link.href}
                            className="text-[0.88rem] text-white/75 transition-colors hover:text-white"
                          >
                            {link.title}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-20 pt-6 border-t border-white/10 text-[0.78rem] text-white/45 max-[768px]:mt-14">
            <span>London, UK</span>
            <span>&copy; 2026 Multiscalar Intelligence</span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <a href="/privacy/" className="text-white/45 transition-colors hover:text-white">
                Privacy
              </a>
              <a href="/terms/" className="text-white/45 transition-colors hover:text-white">
                Terms
              </a>
              <CookieSettingsButton className="text-white/45 transition-colors hover:text-white" />
              <a href="#" className="text-white/45 transition-colors hover:text-white">
                Back to top ↑
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
