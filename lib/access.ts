// Site-wide password protection while the site is private. Set SITE_PASSWORD
// (Vercel → Settings → Environment Variables) to turn it on; without it the
// site is open. Visitors unlock at /unlock, which stores a cookie holding a
// hash of the password, so changing the password signs everyone out.
export const ACCESS_COOKIE = "mi-site-access";
export const ACCESS_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Stray spaces or line breaks (easy to paste into the Vercel field) and
// Unicode forms don't count, on either side.
export const normalizePassword = (value: string) => value.normalize("NFC").trim();

export async function accessToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`multiscalar-site:${normalizePassword(password)}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

// Only same-site paths are allowed as the post-unlock destination.
export const safeNext = (next: string | null | undefined) =>
  next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/unlock") ? next : "/";
