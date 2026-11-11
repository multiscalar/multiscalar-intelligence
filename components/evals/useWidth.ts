"use client";

import { useEffect, useRef, useState } from "react";

// Width of an element in px, kept current on resize. Starts at `initial` so
// the server render and the client's first pass match.
export function useWidth<T extends HTMLElement>(initial = 1000) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}
