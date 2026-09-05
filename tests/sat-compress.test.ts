import { describe, it, expect } from "vitest";
import { fmtBytes, buildStops } from "@/lib/sat-compress";

describe("fmtBytes", () => {
  it("formats bytes like the original widget", () => {
    expect(fmtBytes(500)).toBe("500 B");
    expect(fmtBytes(2048)).toBe("2.0 KB");
    expect(fmtBytes(1572864)).toBe("1.5 MB");
  });
});

describe("buildStops", () => {
  it("orders stops original-first then ascending ratio", () => {
    const stops = buildStops({
      original_bytes: 1048576,
      levels: [
        { lambda: 4000, ratio: 142.1, bytes: 7000 },
        { lambda: 200, ratio: 55.4, bytes: 19000 },
      ],
    });
    expect(stops[0].label).toBe("Original");
    expect(stops[1].label).toBe("55× smaller");
    expect(stops[2].label).toBe("142× smaller");
  });

  it("names level images by their lambda without a decimal point", () => {
    const stops = buildStops({
      original_bytes: 1,
      levels: [{ lambda: 200.0, ratio: 2, bytes: 1 }],
    });
    expect(stops[1].img).toBe("level_lambda-200.png");
  });
});
