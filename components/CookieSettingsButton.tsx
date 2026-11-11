"use client";

import { OPEN_CONSENT_EVENT } from "@/lib/consent";

// Reopens the cookie consent dialog on its category view.
export default function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className={`cursor-pointer ${className}`}
    >
      Cookie settings
    </button>
  );
}
