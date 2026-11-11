import type { Metadata } from "next";
import { Montserrat, IBM_Plex_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { headerNavItems } from "@/lib/nav";
import JsonLd, { ORGANIZATION } from "@/components/JsonLd";
import { INDEXABLE, SITE_DESCRIPTION, SITE_NAME, SITE_URL, ogImage } from "@/lib/site";
import { SOCIAL_LINKS } from "@/lib/social";
import AnnouncementBar from "@/components/AnnouncementBar";
import {
  ANNOUNCEMENT,
  BANNER_HEIGHT_PX,
  dismissedCheckScript,
} from "@/lib/announcement";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-plex-mono",
});

// Fallbacks for every page. Pages set their own title, description,
// canonical URL and share card through pageMetadata (lib/site.ts); their
// titles get " | Multiscalar Intelligence" from the template.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [{ url: ogImage("/hero.webp"), width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  ...(INDEXABLE ? {} : { robots: { index: false, follow: false } }),
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>◆</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const bannerHeight = ANNOUNCEMENT ? BANNER_HEIGHT_PX : 0;
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${plexMono.variable}`}
      data-scroll-behavior="smooth"
      style={{ "--banner-h": `${bannerHeight}px` } as React.CSSProperties}
      // The dismissed-check script below edits <html> before React hydrates.
      suppressHydrationWarning
    >
      {ANNOUNCEMENT && (
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: dismissedCheckScript(ANNOUNCEMENT.id),
            }}
          />
        </head>
      )}
      {/* Browser extensions (e.g. ColorZilla) add attributes to <body> before
          React hydrates; they are not ours to match. */}
      <body suppressHydrationWarning>
        <JsonLd
          data={{
            "@graph": [
              {
                ...ORGANIZATION,
                description: SITE_DESCRIPTION,
                sameAs: SOCIAL_LINKS.map((s) => s.href).filter((href) => href.startsWith("http")),
              },
              {
                "@type": "WebSite",
                name: SITE_NAME,
                url: SITE_URL,
                publisher: { "@id": ORGANIZATION["@id"] },
              },
            ],
          }}
        />
        {ANNOUNCEMENT && <AnnouncementBar announcement={ANNOUNCEMENT} />}
        <Nav items={headerNavItems()} />
        {children}
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
