import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Montserrat (SIL Open Font License), self-hosted: the Latin subset of the
// variable font covers every weight, and the build needs no network.
const montserrat = localFont({
  src: "./fonts/montserrat-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-montserrat",
  fallback: ["system-ui", "sans-serif"],
});

const SITE_URL = "https://multiscalar.ai";
const TITLE = "Multiscalar Intelligence | Self-improving AI that runs businesses";
const DESCRIPTION =
  "The applied AI lab for economic intelligence. We turn how organizations operate into environments where AI trains itself.";

// Vercel previews stay out of search results.
const INDEXABLE = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "Multiscalar Intelligence",
    locale: "en_US",
    type: "website",
    url: "/",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og.jpg"] },
  ...(INDEXABLE ? {} : { robots: { index: false, follow: false } }),
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      {/* Browser extensions add attributes to <body> before hydration. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
