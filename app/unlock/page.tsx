import type { Metadata } from "next";
import { safeNext } from "@/lib/access";

export const metadata: Metadata = {
  title: { absolute: "Private preview | Multiscalar Intelligence" },
  robots: { index: false, follow: false },
};

// The password page. It covers the whole viewport, nav and footer included,
// since nothing behind it is reachable without the password.
export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return (
    <div className="fixed inset-0 z-[300] grid place-items-center overflow-y-auto bg-bg px-6 py-10">
      <form method="post" action="/api/unlock/" className="w-full max-w-[380px]">
        <div className="font-sans text-[0.8rem] font-semibold uppercase tracking-[0.15em] text-black">
          Multiscalar Intelligence
        </div>
        <h1 className="mt-10 font-sans text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-black">
          Private preview
        </h1>
        <p className="mt-3 text-[0.95rem] leading-[1.6] text-black/55">
          This site isn&apos;t public yet. Enter the password to continue.
        </p>
        <input type="hidden" name="next" value={safeNext(next)} />
        <label htmlFor="unlock-password" className="mt-8 mb-2 block text-[0.82rem] font-medium text-black/70">
          Password
        </label>
        <input
          id="unlock-password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "unlock-error" : undefined}
          className="w-full rounded-[12px] border border-black/10 bg-white px-4 py-3 font-sans text-[0.95rem] text-black outline-none transition-colors hover:border-black/20 focus:border-black/50"
        />
        {error && (
          <p id="unlock-error" role="alert" className="mt-2 text-[0.85rem] text-[#b3412e]">
            That password isn&apos;t right. Try again.
          </p>
        )}
        <button
          type="submit"
          className="mt-6 w-full cursor-pointer rounded-full bg-black px-6 py-3 text-[0.9rem] font-medium text-white transition-colors hover:bg-black/80"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
