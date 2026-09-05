"use client";

import { useState } from "react";
import { buildStops, type CompressManifest } from "@/lib/sat-compress";
import manifest from "@/public/assets/sat-compress/manifest.json";

const BASE = "/assets/sat-compress/";
const STOPS = buildStops(manifest as CompressManifest);

// Compression-level slider (port of sat-compress.js).
// Left = least compression (original) -> right = most compression.
export default function CompressDemo() {
  const [i, setI] = useState(0); // start on the original (no compression)
  const s = STOPS[i];
  return (
    <div className="flex flex-col items-start gap-[0.9rem] mt-[0.4rem]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="w-full max-w-[260px] aspect-square object-cover block border border-border"
        src={BASE + s.img}
        alt="compressed satellite tile"
      />
      <input
        type="range"
        className="w-full max-w-[260px] accent-black cursor-pointer"
        min={0}
        max={STOPS.length - 1}
        step={1}
        value={i}
        onChange={(e) => setI(parseInt(e.target.value, 10))}
      />
      <div className="flex items-baseline gap-[0.7rem] flex-wrap">
        <span className="font-sans text-[1.02rem] font-medium text-black tracking-[-0.01em]">
          {s.label}
        </span>
        <span className="font-mono text-[0.72rem] text-text-dim tracking-[0.04em]">
          {s.size}
        </span>
      </div>
    </div>
  );
}
