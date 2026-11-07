"use client";

import { useState } from "react";
import { IconCrossSmall } from "central-icons";
import { dismissedKey, type Announcement } from "@/lib/announcement";

// How long the band takes to collapse; the hero's height transition matches.
const CLOSE_MS = 400;

// Sits in normal flow at the very top of the page, so it scrolls away; the Nav
// watches #announcement's size to sit just below it. Visitors who already
// dismissed it never see it: a script in the layout's <head> hides it before
// first paint (html[data-banner-dismissed]).
export default function AnnouncementBar({
  announcement,
}: {
  announcement: Announcement;
}) {
  const [state, setState] = useState<"open" | "closing" | "gone">("open");

  if (state === "gone") return null;

  const dismiss = () => {
    // Collapse the band and let the hero grow into the space at the same pace.
    setState("closing");
    document.documentElement.style.setProperty("--banner-h", "0px");
    setTimeout(() => setState("gone"), CLOSE_MS);
    try {
      localStorage.setItem(dismissedKey(announcement.id), "1");
    } catch {
      // Ignore: it will just reappear on the next visit.
    }
  };

  return (
    <div
      id="announcement"
      aria-hidden={state === "closing" || undefined}
      className={`relative flex items-center justify-center gap-3 px-12 overflow-hidden bg-[#111] text-white font-sans text-[0.78rem] transition-[height,opacity] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none max-[640px]:px-10 max-[640px]:text-[0.72rem] ${
        state === "closing" ? "h-0 opacity-0" : "h-9 opacity-100"
      }`}
    >
      <p className="truncate">
        {/* On phones the message itself is the link (the CTA would be cut off). */}
        {announcement.href ? (
          <a
            href={announcement.href}
            className="text-white/80 hover:text-white min-[641px]:pointer-events-none"
          >
            {announcement.message}
          </a>
        ) : (
          <span className="text-white/80">{announcement.message}</span>
        )}
        {announcement.href && (
          <a
            href={announcement.href}
            className="ml-3 font-semibold text-white underline underline-offset-[3px] decoration-white/40 hover:text-white hover:decoration-white max-[640px]:hidden"
          >
            {announcement.cta ?? "Learn more"}
          </a>
        )}
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 p-1 rounded-full text-white/60 cursor-pointer hover:text-white hover:bg-white/10"
      >
        <IconCrossSmall aria-hidden className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
