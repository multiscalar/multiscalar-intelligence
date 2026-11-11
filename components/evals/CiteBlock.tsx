"use client";

import { useEffect, useRef, useState } from "react";
import { IconCheckmark1Small, IconSquareBehindSquare1 } from "central-icons";

// A BibTeX entry with a copy button, for the index and each benchmark page.
export default function CiteBlock({ bibtex }: { bibtex: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(bibtex);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (permissions, insecure context): the text stays
      // selectable, so the visitor can copy it by hand.
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[12px] border border-black/10 bg-white">
      <pre className="overflow-x-auto px-5 py-4 pr-28 font-mono text-[0.78rem] leading-[1.7] text-black/80 selection:bg-black/10">
        <code>{bibtex}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        className="absolute right-3 top-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[0.75rem] font-medium text-black/75 transition-colors hover:border-black/25 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        {copied ? (
          <IconCheckmark1Small aria-hidden className="h-3.5 w-3.5" />
        ) : (
          <IconSquareBehindSquare1 aria-hidden className="h-3.5 w-3.5" />
        )}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}
