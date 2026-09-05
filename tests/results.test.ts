import { describe, it, expect } from "vitest";
import { listResultSlugs, loadResult } from "@/lib/results";

describe("listResultSlugs", () => {
  it("lists all seven papers and no _lib", () => {
    const slugs = listResultSlugs();
    expect(slugs).toContain("erdos-690");
    expect(slugs).not.toContain("_lib");
    expect(slugs).toHaveLength(7);
  });
});

describe("loadResult", () => {
  it("loads meta and fragment", () => {
    const r = loadResult("erdos-486");
    expect(r.meta.title).toMatch(/Erdős Problem 486/);
    expect(r.articleHtml).toContain('<section class="abstract">');
  });

  it("loads the pre-pipeline paper too", () => {
    const r = loadResult("erdos-690");
    expect(r.meta.badge).toBe("Solved");
    expect(r.articleHtml).toContain('<section class="abstract">');
  });

  it("throws on a missing slug", () => {
    expect(() => loadResult("erdos-000")).toThrow();
  });
});
