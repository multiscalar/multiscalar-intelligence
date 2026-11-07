"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IconCrossSmall } from "central-icons";
import {
  OPEN_CONSENT_EVENT,
  PRIVACY_POLICY_HREF,
  TERMS_HREF,
  readConsent,
  saveConsent,
  type ConsentCategory,
} from "@/lib/consent";

const CATEGORIES: { key: ConsentCategory; title: string; description: string }[] = [
  {
    key: "analytics",
    title: "Analytics",
    description: "Help us understand how the site is used so we can improve it.",
  },
  {
    key: "marketing",
    title: "Marketing",
    description: "Let us and partners measure and personalise outreach.",
  },
];

// On pages with a hero, wait until it has scrolled out from under the nav
// (the same point the nav turns solid) so the dialog never covers the hero.
const HERO_EXIT_PX = 72;

const pillBase =
  "inline-flex items-center justify-center rounded-full px-5 py-[0.7rem] font-sans text-[0.85rem] font-medium whitespace-nowrap cursor-pointer transition-[background-color,transform] duration-150 active:scale-[0.97]";
const pillPrimary = `${pillBase} bg-[#141414] text-white hover:bg-black`;
const pillOutline = `${pillBase} border border-black/15 text-black hover:bg-black/[0.04]`;

export default function CookieConsent() {
  const pathname = usePathname();
  // Hidden until mounted: whether to show depends on browser storage.
  const [open, setOpen] = useState(false);
  // Set while the exit animation plays; the dialog unmounts when it ends.
  const [closing, setClosing] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [choices, setChoices] = useState<Record<ConsentCategory, boolean>>({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    if (readConsent()) return;
    const hero = document.getElementById("hero");
    if (!hero) {
      setOpen(true);
      return;
    }
    const check = () => {
      if (hero.getBoundingClientRect().bottom > HERO_EXIT_PX) return;
      setOpen(true);
      window.removeEventListener("scroll", check);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [pathname]);

  useEffect(() => {
    const reopen = () => {
      const saved = readConsent();
      if (saved) setChoices({ analytics: saved.analytics, marketing: saved.marketing });
      setCustomizing(true);
      setClosing(false);
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  const finishClosing = () => {
    setOpen(false);
    setClosing(false);
    setCustomizing(false);
  };
  // Backstop for the exit animation: browsers pause animations in background
  // tabs, so animationend may never fire. Slightly longer than consent-out.
  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(finishClosing, 320);
    return () => clearTimeout(timer);
  }, [closing]);
  const decide = (next: Record<ConsentCategory, boolean>) => {
    saveConsent(next);
    setChoices(next);
    // No exit animation runs under reduced motion, so close straight away.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finishClosing();
    else setClosing(true);
  };
  const acceptAll = () => decide({ analytics: true, marketing: true });
  // Closing without choosing counts as declining non-essential cookies.
  const rejectAll = () => decide({ analytics: false, marketing: false });

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      onAnimationEnd={(e) => {
        if (closing && e.target === e.currentTarget) finishClosing();
      }}
      className={`fixed left-4 bottom-4 z-[200] w-[min(560px,calc(100vw-2rem))] max-h-[calc(100svh-2rem)] overflow-y-auto rounded-[24px] border border-black/[0.07] bg-white p-7 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] motion-reduce:animate-none max-[480px]:left-2 max-[480px]:bottom-2 max-[480px]:w-[calc(100vw-1rem)] max-[480px]:p-5 ${
        closing ? "animate-consent-out pointer-events-none" : "animate-consent-in"
      }`}
    >
      <button
        type="button"
        onClick={rejectAll}
        aria-label="Close and decline non-essential cookies"
        className="absolute top-5 right-5 grid place-items-center w-9 h-9 rounded-full border border-black/10 text-black cursor-pointer transition-[background-color,transform] duration-150 hover:bg-black/[0.04] active:scale-[0.94]"
      >
        <IconCrossSmall aria-hidden className="w-4 h-4" />
      </button>

      <h2
        id="cookie-consent-title"
        className="pr-12 font-sans text-[1.35rem] font-semibold tracking-[-0.02em] text-black"
      >
        We value your privacy
      </h2>

      {!customizing ? (
        <p
          key="intro"
          className="mt-3 text-[0.9rem] leading-[1.6] text-text-secondary animate-consent-swap motion-reduce:animate-none"
        >
          We use cookies that are essential for the site to work. With your
          consent, we would also use optional cookies to understand how the site
          is used. You can accept, decline, or choose by category.
        </p>
      ) : (
        <div
          key="categories"
          className="mt-5 flex flex-col divide-y divide-black/[0.07] border-y border-black/[0.07] animate-consent-swap motion-reduce:animate-none"
        >
          <CategoryRow
            title="Strictly necessary"
            description="Required for the site to work. Always on."
            checked
            disabled
          />
          {CATEGORIES.map(({ key, title, description }) => (
            <CategoryRow
              key={key}
              title={title}
              description={description}
              checked={choices[key]}
              onChange={(value) => setChoices((c) => ({ ...c, [key]: value }))}
            />
          ))}
        </div>
      )}

      <div className="mt-5 flex gap-5 text-[0.85rem]">
        <a href={PRIVACY_POLICY_HREF} className="underline underline-offset-[3px] text-text-secondary hover:text-black">
          Privacy Policy
        </a>
        <a href={TERMS_HREF} className="underline underline-offset-[3px] text-text-secondary hover:text-black">
          Terms of Use
        </a>
      </div>

      <div
        key={customizing ? "save-actions" : "actions"}
        className="mt-6 flex flex-wrap gap-2 animate-consent-swap motion-reduce:animate-none"
      >
        {!customizing ? (
          <>
            <button type="button" onClick={acceptAll} className={pillPrimary}>
              Accept all
            </button>
            <button type="button" onClick={rejectAll} className={pillOutline}>
              Reject all
            </button>
            <button type="button" onClick={() => setCustomizing(true)} className={pillOutline}>
              Customize
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => decide(choices)} className={pillPrimary}>
              Save choices
            </button>
            <button type="button" onClick={acceptAll} className={pillOutline}>
              Accept all
            </button>
            <button type="button" onClick={rejectAll} className={pillOutline}>
              Reject all
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function CategoryRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}) {
  return (
    <label
      className={`flex items-start justify-between gap-6 py-4 ${disabled ? "" : "cursor-pointer"}`}
    >
      <span>
        <span className="block font-sans text-[0.92rem] font-medium text-black">{title}</span>
        <span className="mt-1 block text-[0.82rem] leading-[1.5] text-text-secondary">
          {description}
        </span>
      </span>
      <span className="relative mt-[0.15rem] shrink-0">
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="block w-10 h-6 rounded-full bg-black/15 transition-colors peer-checked:bg-[#141414] peer-disabled:opacity-50 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-black"
        />
        <span
          aria-hidden
          className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4"
        />
      </span>
    </label>
  );
}
