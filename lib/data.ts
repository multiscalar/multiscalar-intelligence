// Links to the data request form on /data/, optionally with a benchmark
// preselected (?bench=<slug>).
export function dataHref({ bench }: { bench?: string } = {}) {
  return `/data/${bench ? `?bench=${encodeURIComponent(bench)}` : ""}#start`;
}
