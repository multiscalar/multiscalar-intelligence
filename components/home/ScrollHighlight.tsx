"use client";

import { useEffect, useRef, useState } from "react";

// Text whose words darken one by one as it scrolls up the screen, like
// subtitles keeping pace with the reader. Highlighting starts when the block's
// top reaches START of the viewport height and finishes when its bottom
// reaches END.
const START = 0.88;
const END = 0.32;

export default function ScrollHighlight({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * START; // top of block crosses this → 0
      const end = vh * END; // bottom of block crosses this → 1
      const total = start - end + rect.height;
      const done = start - rect.top;
      setProgress(Math.min(1, Math.max(0, done / total)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const lit = progress * words.length;

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className={`transition-colors duration-500 ${
            i < lit ? "text-black" : "text-[#cfcfcf]"
          }`}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
