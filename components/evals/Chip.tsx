import type { Provider } from "@/lib/evals/providers";
import { PROVIDER_ICONS } from "@/lib/evals/provider-icons";

export default function Chip({ p }: { p: Provider }) {
  const path = p.icon ? PROVIDER_ICONS[p.icon] : undefined;
  return (
    <span className="bar-chip" title={p.label} aria-label={p.label}>
      {path ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={path} fill={p.color} />
        </svg>
      ) : (
        <span className="chip-mark" style={{ color: p.color }}>
          {p.mark || "•"}
        </span>
      )}
    </span>
  );
}
