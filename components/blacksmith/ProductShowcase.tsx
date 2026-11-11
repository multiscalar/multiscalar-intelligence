"use client";

import { useEffect, useRef, useState } from "react";
import { IconPause, IconPlay } from "central-icons";

// The Blacksmith demo as a product window with its four steps underneath.
// Each step's bar fills while the video is in that chapter, so the steps read
// as the video's own table of contents; clicking one jumps there. The frame
// scales into place as it scrolls into view (CSS scroll timeline, see
// .scroll-zoom in globals.css). Reduced motion: the video waits on its poster
// and the steps are plain links into it.

// Chapter starts in the demo (public/blacksmith/demo.mp4, 20.4 s).
// `focus` is where the action sits in each chapter (object-position x), for
// the taller phone crop.
const STEPS = [
  { at: 0, focus: 26, title: "Connect your data", body: "Contracts, records and policies, from the systems your team already uses." },
  { at: 4.8, focus: 26, title: "Generate environments", body: "Simulations of the situations the workflow meets, with graders that score outcomes your way." },
  { at: 8.6, focus: 27, title: "Train the agent", body: "Reinforcement learning on an open model, scored on evals built for your business." },
  { at: 16.3, focus: 27, title: "Hand it the work", body: "Your team asks, reviews what it proposes and approves. Outcomes feed the next run." },
];

export default function ProductShowcase({
  src,
  poster,
  label,
  width,
  height,
}: {
  src: string;
  poster: string;
  label: string;
  width: number;
  height: number;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(20.4);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  // Smooth bars: read the playhead every frame while playing.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      if (video.current) setTime(video.current.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const active = STEPS.reduce((acc, s, i) => (time >= s.at ? i : acc), 0);
  const end = (i: number) => (i < STEPS.length - 1 ? STEPS[i + 1].at : duration);
  const fill = (i: number) =>
    i < active ? 1 : i > active ? 0 : Math.min(1, (time - STEPS[i].at) / (end(i) - STEPS[i].at));

  const seek = (i: number) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = STEPS[i].at + 0.05;
    setTime(v.currentTime);
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
  };
  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div>
      {/* Wider than the text column: the video is 3:1, so it needs the width
          to have any height. On phones it becomes a taller 5:4 window onto
          the product that pans to where each chapter's action is. */}
      <div className="px-3 max-[768px]:px-2">
      <div className="scroll-zoom relative mx-auto max-w-[1520px] overflow-hidden rounded-[28px] border border-black/10 bg-[#1a1712] shadow-[0_40px_80px_-40px_rgba(20,19,17,0.45)] max-[768px]:rounded-[20px]">
        <video
          ref={video}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          width={width}
          height={height}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 20.4)}
          style={{ "--focus-x": `${STEPS[active].focus}%` } as React.CSSProperties}
          className="block h-auto w-full max-[768px]:aspect-[5/4] max-[768px]:object-cover max-[768px]:[object-position:var(--focus-x)_50%] max-[768px]:transition-[object-position] max-[768px]:duration-700 max-[768px]:ease-[cubic-bezier(0.16,1,0.3,1)]"
          aria-label={label}
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause the walkthrough" : "Play the walkthrough"}
          className="absolute bottom-4 right-4 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-[#141311]/75 text-white transition-colors hover:bg-[#141311] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-deep"
        >
          {playing ? <IconPause aria-hidden className="h-4 w-4" /> : <IconPlay aria-hidden className="h-4 w-4" />}
        </button>
      </div>

      </div>

      <ol className="mx-auto mt-8 grid max-w-[1200px] grid-cols-4 gap-8 px-8 max-[768px]:px-6 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1 max-[560px]:gap-5">
        {STEPS.map((s, i) => {
          const on = i === active;
          return (
            <li key={s.title}>
              <button
                type="button"
                onClick={() => seek(i)}
                aria-current={on ? "step" : undefined}
                className="group block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember-deep"
              >
                <span aria-hidden className="block h-[2px] overflow-hidden rounded-full bg-black/10">
                  <span
                    className="block h-full origin-left bg-ember-deep"
                    style={{ transform: `scaleX(${fill(i)})` }}
                  />
                </span>
                <span className={`mt-4 block font-mono text-[0.72rem] tabular-nums transition-colors ${on ? "text-ember-deep" : "text-black/50"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`mt-1 block text-[1.05rem] font-semibold tracking-[-0.015em] transition-colors ${on ? "text-black" : "text-black/60 group-hover:text-black/85"}`}>
                  {s.title}
                </span>
                <span className={`mt-2 block text-[0.92rem] leading-[1.55] transition-colors ${on ? "text-black/70" : "text-black/55"}`}>
                  {s.body}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
