import type { BenchModel } from "./types";

export interface Provider {
  label: string;
  color: string;
  /** The brand's own logo colour, where its logo has one. Without it the
      logo is monochrome (black on light, cream on the dark panels). */
  brand?: string;
  icon?: string;
  mark?: string;
}

// Colour follows the provider (the entity), never the rank. Hues are the seven
// validated categorical slots; every other provider folds into the neutral slot.
// Identity is carried by the provider mark either way.
export const PROVIDERS: Record<string, Provider> = {
  // Brand colours from the official colour logos (as collected in LobeHub's
  // icon set, MIT): Claude's coral, Gemini's blue, Qwen's violet, DeepSeek's
  // blue, MiniMax's magenta, Meta's blue and ByteDance's blue. OpenAI, Z.ai,
  // Kimi and xAI only use black-and-white logos.
  anthropic: { label: "Anthropic", color: "#eb6834", brand: "#D97757", icon: "anthropic" },
  openai: { label: "OpenAI", color: "#1baf7a", icon: "openai" },
  google: { label: "Google", color: "#2a78d6", brand: "#3186FF", icon: "google" },
  alibaba: { label: "Alibaba", color: "#4a3aa7", brand: "#6F69F7", icon: "alibaba" },
  zai: { label: "Z.ai", color: "#141311", icon: "zai" },
  moonshot: { label: "Moonshot", color: "#e87ba4", icon: "moonshot" },
  deepseek: { label: "DeepSeek", color: "#eda100", brand: "#4D6BFE", icon: "deepseek" },
  xai: { label: "xAI", color: "#8a8a80", icon: "xai" },
  minimax: { label: "MiniMax", color: "#8a8a80", brand: "#E2167E", icon: "minimax" },
  meta: { label: "Meta", color: "#8a8a80", brand: "#0082FB", icon: "meta" },
  bytedance: { label: "ByteDance", color: "#8a8a80", brand: "#3C8CFF", icon: "bytedance" },
  other: { label: "Other", color: "#8a8a80", mark: "•" },
  baseline: { label: "Scripted baseline", color: "#b9b9b2", mark: "fx" },
};

const PROVIDER_ALIASES: Record<string, string> = {
  anthropic: "anthropic",
  openai: "openai",
  google: "google",
  "google deepmind": "google",
  alibaba: "alibaba",
  qwen: "alibaba",
  "z.ai": "zai",
  zai: "zai",
  zhipu: "zai",
  glm: "zai",
  moonshot: "moonshot",
  "moonshot ai": "moonshot",
  deepseek: "deepseek",
  xai: "xai",
  minimax: "minimax",
  meta: "meta",
  bytedance: "bytedance",
  doubao: "bytedance",
  baseline: "baseline",
};

export function providerOf(model: BenchModel): Provider {
  const raw = (model.provider || "").toLowerCase().trim();
  const slug = PROVIDER_ALIASES[raw];
  if (slug) return PROVIDERS[slug];
  if (/^fixed /i.test(model.name)) return PROVIDERS.baseline;
  return PROVIDERS.other;
}

// Colour for a provider's logo: the brand's own colour, or near-black for
// brands whose logo is black-and-white.
export const MONO = "#141311";
export function logoColor(p: Provider): string {
  return p.brand ?? MONO;
}

// The same on a dark panel: monochrome logos take the panel's cream.
export function logoColorOnDark(color: string): string {
  return color === MONO ? "currentColor" : color;
}
