"use client";

import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

// A background pill that slides between items instead of fading in on each.
// Items inside `container` carry `data-indicator={key}`; the returned style
// positions an absolutely placed element over the item matching `active`
// (hidden when `active` is null). Appearing from hidden jumps into place, so
// only moves between items animate.
export function useIndicator(
  container: RefObject<HTMLElement | null>,
  active: string | null,
): CSSProperties {
  const [box, setBox] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const [instant, setInstant] = useState(true);

  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;
    const measure = () => {
      const el =
        active === null
          ? null
          : root.querySelector<HTMLElement>(
              `[data-indicator="${CSS.escape(active)}"]`,
            );
      if (!el) {
        setBox(null);
        return;
      }
      const r = root.getBoundingClientRect();
      const e = el.getBoundingClientRect();
      setBox({ x: e.left - r.left, y: e.top - r.top, w: e.width, h: e.height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [container, active]);

  // Snap (no transition) whenever the pill is hidden, so it appears in place.
  useLayoutEffect(() => {
    if (!box) {
      setInstant(true);
      return;
    }
    const frame = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(frame);
  }, [box]);

  return {
    position: "absolute",
    left: 0,
    top: 0,
    width: box?.w ?? 0,
    height: box?.h ?? 0,
    transform: `translate(${box?.x ?? 0}px, ${box?.y ?? 0}px)`,
    opacity: box ? 1 : 0,
    transition: instant
      ? "opacity 200ms"
      : "transform 400ms cubic-bezier(0.22,1,0.36,1), width 400ms cubic-bezier(0.22,1,0.36,1), height 400ms cubic-bezier(0.22,1,0.36,1), opacity 200ms",
    pointerEvents: "none",
  };
}
