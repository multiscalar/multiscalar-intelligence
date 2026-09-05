import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import GridBackground from "@/components/GridBackground";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Multiscalar Intelligence | Multi-Agent Intelligence at Scale",
  description:
    "Multiscalar Intelligence develops new algorithms and systems for multi-agent AI, enabling agents to learn, coordinate, and scale from individuals to open networks.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>◆</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body>
        <Nav />
        {children}
        <GridBackground />
      </body>
    </html>
  );
}
