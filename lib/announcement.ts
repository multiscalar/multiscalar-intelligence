import { HIDE } from "@/lib/launch";

// The band above the nav. Set to null to hide it. Change `id` whenever the
// message changes: visitors who dismissed the previous one will see the new one.
export interface Announcement {
  id: string;
  message: string;
  href?: string;
  cta?: string;
}

export const dismissedKey = (id: string) => `announcement-dismissed:${id}`;

// Runs in <head> before first paint: if this announcement was dismissed, hide
// the band and zero its height so the page never flashes it.
export function dismissedCheckScript(id: string): string {
  const key = JSON.stringify(dismissedKey(id));
  return `try{if(localStorage.getItem(${key})){var d=document.documentElement;d.setAttribute("data-banner-dismissed","");d.style.setProperty("--banner-h","0px")}}catch(e){}`;
}

// Height of the band (Tailwind h-9), used for the first paint before the Nav
// and hero can measure it.
export const BANNER_HEIGHT_PX = 36;

// Off during the private preview, as it links to the evals (lib/launch.ts).
export const ANNOUNCEMENT: Announcement | null = HIDE.evalsLinks ? null : {
  id: "2026-10-treasury-bench",
  message: "Treasury-Bench results are live: 14 models managing a year of company cash.",
  href: "/evals/treasury-bench/",
  cta: "See the leaderboard",
};
