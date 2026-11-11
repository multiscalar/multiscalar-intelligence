"use client";

import { useEffect, useRef, useState } from "react";

// A muted video that starts on its own and loops, with a pause button (it
// runs past five seconds). It stays on the poster frame for reduced-motion
// users. Used by the Blacksmith page and, as <loop-video>, in posts.
export default function LoopVideo({
  src,
  poster,
  label,
  width,
  height,
}: {
  src: string;
  poster: string;
  label: string;
  width: number | string;
  height: number | string;
}) {
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
    <div className="relative my-0 overflow-hidden rounded-[20px] border border-black/10 bg-[#ececea]">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        width={Number(width)}
        height={Number(height)}
        className="block h-auto w-full"
        aria-label={label}
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
