// Cookie consent, stored in the visitor's browser. The site sets no
// non-essential cookies today; anything added later (analytics, embeds)
// should check `hasConsent` before loading.

export type ConsentCategory = "analytics" | "marketing";

export interface Consent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  // Bump CONSENT_VERSION when categories change, to ask everyone again.
  version: number;
  updatedAt: string;
}

export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = "mi-cookie-consent";
// Dispatch on window to reopen the consent dialog, e.g. from a footer link.
export const OPEN_CONSENT_EVENT = "mi:open-cookie-settings";

export const PRIVACY_POLICY_HREF = "/privacy/";
export const TERMS_HREF = "/terms/";

export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const consent = JSON.parse(raw) as Consent;
    return consent.version === CONSENT_VERSION ? consent : null;
  } catch {
    return null;
  }
}

export function saveConsent(choices: Record<ConsentCategory, boolean>): Consent {
  const consent: Consent = {
    necessary: true,
    ...choices,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // Storage unavailable (private mode, blocked): the choice holds for this
    // page view only, and the dialog shows again next visit.
  }
  return consent;
}

export function hasConsent(category: ConsentCategory): boolean {
  return readConsent()?.[category] ?? false;
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
