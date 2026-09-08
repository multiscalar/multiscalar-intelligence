import { describe, it, expect } from "vitest";
import { overviewStats, radarData } from "@/lib/evals/overview";

describe("overviewStats", () => {
  it("counts benchmarks and distinct non-baseline models", () => {
    const s = overviewStats();
    expect(s.benches).toBe(4);
    expect(s.models).toBe(24); // distinct model names minus scripted baselines
    expect(s.snapshot).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("radarData", () => {
  const data = radarData();

  it("has one axis per benchmark", () => {
    expect(data.axes.map((a) => a.slug)).toEqual([
      "economic-arena",
      "treasury-bench",
      "terms-bench",
      "vending-bench-2",
    ]);
  });

  it("offers only models present on at least three benchmarks", () => {
    // The t5 treasury board names newer model versions (GLM-5.3, Qwen 3.8
    // Max), so the older versions keep only two benchmarks and drop off.
    expect(data.models.length).toBe(6);
    for (const m of data.models) {
      expect(m.values.filter((v) => v !== null).length).toBeGreaterThanOrEqual(
        3
      );
    }
  });

  it("normalizes each axis to 0–100 with min at 0 and max at 100", () => {
    for (let i = 0; i < data.axes.length; i++) {
      const vals = data.models
        .map((m) => m.values[i])
        .filter((v): v is number => v !== null);
      for (const v of vals) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
    }
  });

  it("excludes scripted baselines", () => {
    expect(data.models.some((m) => /^fixed |heuristic/i.test(m.name))).toBe(
      false
    );
  });

  it("keeps the raw value alongside for tooltips", () => {
    const withValue = data.models[0];
    const i = withValue.values.findIndex((v) => v !== null);
    expect(typeof withValue.raw[i]).toBe("number");
  });
});
