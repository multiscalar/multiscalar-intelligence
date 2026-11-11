import BrandIcon from "@/components/BrandIcon";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import SoonTag from "@/components/SoonTag";
import { contactHref } from "@/lib/contact";
import { evalsSoon } from "@/lib/launch";
import { SOCIAL_LINKS, externalProps } from "@/lib/social";

// A sitemap footer: who we are in one line, then the site grouped by what a
// visitor came for (the index, Blacksmith, research, the company). It closes the page quietly;
// the call to action belongs to each page, not to the footer.
const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Index",
    links: [
      { href: "/evals/", label: "Leaderboard" },
      { href: "/evals/#benchmarks", label: "Benchmarks" },
      { href: "/evals/#methodology", label: "Methodology" },
      { href: "/data/", label: "Benchmark data" },
    ],
  },
  {
    title: "Blacksmith",
    links: [
      { href: "/blacksmith/", label: "How it works" },
      { href: "/blacksmith/#get-in-touch", label: "Get in touch" },
    ],
  },
  {
    title: "Open Science",
    links: [
      { href: "/open-science/", label: "All research" },
      { href: "/open-science/feed.xml", label: "RSS feed" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/work-with-us/", label: "Work with us" },
      { href: "/contact/", label: "Contact" },
      { href: contactHref("press"), label: "Press" },
    ],
  },
];

const LINK = "text-[0.92rem] text-white/65 transition-colors hover:text-white";

export default function Footer() {
  return (
    <footer className="px-3 max-[768px]:px-2">
      <div className="relative overflow-hidden rounded-t-[28px] bg-[#161513] text-white max-[768px]:rounded-t-[20px]">
        <div className="mx-auto max-w-[1200px] px-8 pt-16 pb-8 max-[768px]:px-6 max-[768px]:pt-12">
          <div className="grid grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))] gap-12 max-[960px]:grid-cols-4 max-[640px]:grid-cols-2 max-[640px]:gap-10">
            <div className="max-[960px]:col-span-4 max-[640px]:col-span-2">
              <a
                href="/"
                className="font-sans text-[0.9rem] font-semibold uppercase tracking-[0.15em] whitespace-nowrap text-white hover:text-white"
              >
                Multiscalar Intelligence
              </a>
              <p className="mt-4 max-w-[300px] text-[0.92rem] leading-[1.6] text-white/55">
                An applied AI lab in London measuring, training and deploying AI
                that makes economic decisions.
              </p>
              <ul className="mt-6 flex gap-2">
                {SOCIAL_LINKS.map(({ href, label, icon }) => (
                  <li key={icon}>
                    <a
                      href={href}
                      aria-label={label}
                      {...externalProps(href)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/65 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <BrandIcon icon={icon} className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="text-[0.85rem] font-medium text-white">{col.title}</h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((link) =>
                    evalsSoon(link.href) ? (
                      <li key={link.href} className="flex items-center gap-2 text-[0.92rem] text-white/40">
                        {link.label}
                        <SoonTag />
                      </li>
                    ) : (
                      <li key={link.href}>
                        <a href={link.href} className={LINK}>
                          {link.label}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-[0.8rem] text-white/45 max-[768px]:mt-12">
            <span>&copy; 2026 Multiscalar Intelligence, London</span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <a href="/privacy/" className="text-white/45 transition-colors hover:text-white">
                Privacy
              </a>
              <a href="/terms/" className="text-white/45 transition-colors hover:text-white">
                Terms
              </a>
              <CookieSettingsButton className="cursor-pointer text-white/45 transition-colors hover:text-white" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
