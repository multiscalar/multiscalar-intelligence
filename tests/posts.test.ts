import { describe, it, expect } from "vitest";
import { listPosts, loadPost } from "@/lib/posts";

describe("listPosts", () => {
  it("lists the three launch posts newest first", () => {
    const posts = listPosts();
    expect(posts.map((p) => p.slug)).toEqual([
      "six-more-erdos-problems",
      "satellite-compression",
      "erdos-problem-690",
    ]);
  });

  it("carries the fields the cards and feed need", () => {
    for (const p of listPosts()) {
      expect(p.title).toBeTruthy();
      expect(p.display_date).toBeTruthy();
      expect(p.tag).toBeTruthy();
      expect(p.summary).toBeTruthy();
      expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(p.body.length).toBeGreaterThan(50);
    }
  });
});

describe("loadPost", () => {
  it("throws on a missing slug", () => {
    expect(() => loadPost("nope")).toThrow();
  });
});
