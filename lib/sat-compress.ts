// Stops for the compression-level slider (port of sat-compress.js).
// Left = least compression (original) -> right = most compression (highest ratio).

export interface CompressLevel {
  lambda: number;
  bytes: number;
  ratio: number;
}

export interface CompressManifest {
  original_bytes: number;
  levels: CompressLevel[];
}

export interface Stop {
  img: string;
  label: string;
  size: string;
}

export function fmtBytes(b: number): string {
  if (b >= 1048576) return (b / 1048576).toFixed(1) + " MB";
  if (b >= 1024) return (b / 1024).toFixed(1) + " KB";
  return b + " B";
}

export function buildStops(m: CompressManifest): Stop[] {
  const asc = m.levels.slice().sort((a, b) => a.ratio - b.ratio); // 55× … 142×
  const stops: Stop[] = [
    { img: "original.png", label: "Original", size: fmtBytes(m.original_bytes) },
  ];
  asc.forEach((lv) =>
    stops.push({
      img: "level_lambda-" + String(lv.lambda) + ".png",
      label: lv.ratio.toFixed(0) + "× smaller",
      size: fmtBytes(lv.bytes),
    })
  );
  return stops;
}
