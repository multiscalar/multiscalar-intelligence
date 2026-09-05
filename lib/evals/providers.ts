import type { BenchModel } from "./types";

export interface Provider {
  label: string;
  color: string;
  icon?: string;
  mark?: string;
}

// Colour follows the provider (the entity), never the rank. Hues are the seven
// validated categorical slots; every other provider folds into the neutral slot.
// Identity is carried by the provider mark either way.
export const PROVIDERS: Record<string, Provider> = {
  anthropic: { label: "Anthropic", color: "#eb6834", icon: "anthropic" },
  openai: { label: "OpenAI", color: "#1baf7a", icon: "openai" },
  google: { label: "Google", color: "#2a78d6", icon: "google" },
  alibaba: { label: "Alibaba", color: "#4a3aa7", icon: "alibaba" },
  zai: { label: "Z.ai", color: "#008300", mark: "Z" },
  moonshot: { label: "Moonshot", color: "#e87ba4", icon: "moonshot" },
  deepseek: { label: "DeepSeek", color: "#eda100", icon: "deepseek" },
  xai: { label: "xAI", color: "#8a8a80", icon: "xai" },
  minimax: { label: "MiniMax", color: "#8a8a80", icon: "minimax" },
  meta: { label: "Meta", color: "#8a8a80", icon: "meta" },
  bytedance: { label: "ByteDance", color: "#8a8a80", icon: "bytedance" },
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
