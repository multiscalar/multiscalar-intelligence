import { describe, it, expect } from "vitest";
import { providerOf, PROVIDERS } from "@/lib/evals/providers";
import type { BenchModel } from "@/lib/evals/types";

const model = (name: string, provider: string): BenchModel => ({
  name,
  provider,
  scores: {},
});

describe("providerOf", () => {
  it("resolves aliases to the canonical provider", () => {
    expect(providerOf(model("GLM-5", "Zhipu"))).toBe(PROVIDERS.zai);
    expect(providerOf(model("Qwen4-Max", "qwen"))).toBe(PROVIDERS.alibaba);
    expect(providerOf(model("Gemini", "Google DeepMind"))).toBe(PROVIDERS.google);
  });

  it("routes scripted baselines by name prefix", () => {
    expect(providerOf(model("Fixed 2% ladder", ""))).toBe(PROVIDERS.baseline);
  });

  it("folds unknown providers into other", () => {
    expect(providerOf(model("Mystery-1", "acme"))).toBe(PROVIDERS.other);
  });
});

describe("loadBench", () => {
  it("loads all four benchmarks with their metrics", async () => {
    const { BENCHES, loadBench } = await import("@/lib/evals/benches");
    for (const slug of BENCHES) {
      const d = loadBench(slug);
      expect(d.bench).toBe(slug);
      expect(d.models.length).toBeGreaterThan(0);
      expect(d.metrics.some((m) => m.id === d.defaultMetric)).toBe(true);
    }
  });

  it("throws on an unknown benchmark", async () => {
    const { loadBench } = await import("@/lib/evals/benches");
    expect(() => loadBench("nope")).toThrow();
  });
});
