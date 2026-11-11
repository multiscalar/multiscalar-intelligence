"use client";

import { useEffect, useRef, useState } from "react";

// The product walkthrough: muted, looping, with a pause button (it runs past
// five seconds). It stays on the poster frame for reduced-motion users.
export default function DemoVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-black/10 bg-[#ececea]">
      <video
        ref={ref}
        src="/blacksmith/demo.mp4"
        poster="/blacksmith/poster.jpg"
        muted
        loop
        playsInline
        preload="metadata"
        width={3328}
        height={1112}
        className="block h-auto w-full"
        aria-label="Blacksmith walkthrough: connect a company's data, generate training environments from it, train a model on them, then ask it to renew a supplier contract"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute bottom-3 right-3 cursor-pointer rounded-full bg-black/70 px-3.5 py-1.5 text-[0.75rem] font-medium text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
}
