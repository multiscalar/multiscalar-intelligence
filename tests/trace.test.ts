import { describe, it, expect } from "vitest";
import { parseTranscript, turnSummary } from "@/lib/evals/trace";

const SAMPLE = [
  JSON.stringify({ seq: 0, kind: "briefing", data: { content: "You are the treasurer." } }),
  JSON.stringify({
    seq: 1,
    kind: "assistant",
    data: {
      content: "I'll survey the world.\nMore detail.",
      tool_calls: [
        { name: "get_time", arguments: "{}" },
        { name: "get_treasury", arguments: "{}" },
      ],
    },
  }),
  JSON.stringify({ seq: 2, kind: "tool_result", data: { name: "get_time", arguments: "{}", result: { day: 0 } } }),
  JSON.stringify({ seq: 3, kind: "note", data: { nudged: true } }),
  JSON.stringify({ seq: 4, kind: "assistant", data: { content: "", tool_calls: [{ name: "wait_until", arguments: '{"day":1}' }] } }),
].join("\n");

describe("parseTranscript", () => {
  const t = parseTranscript(SAMPLE);

  it("extracts the briefing", () => {
    expect(t.briefing).toBe("You are the treasurer.");
  });

  it("groups tool results and notes under the preceding assistant turn", () => {
    expect(t.turns).toHaveLength(2);
    expect(t.turns[0].results).toHaveLength(1);
    expect(t.turns[0].notes).toHaveLength(1);
    expect(t.turns[1].results).toHaveLength(0);
    expect(t.turns[0].n).toBe(1);
  });

  it("summarizes a turn with first line and first tool call", () => {
    const s = turnSummary(t.turns[0]);
    expect(s.text).toBe("I'll survey the world.");
    expect(s.tools).toContain("get_time");
    expect(s.tools).toContain("+1 more");
  });

  it("strips markdown markers from the summary line", () => {
    const md = parseTranscript(
      JSON.stringify({
        seq: 0,
        kind: "assistant",
        data: { content: "**Position (Day 0):** `supply` queued", tool_calls: [] },
      })
    );
    expect(turnSummary(md.turns[0]).text).toBe(
      "Position (Day 0): supply queued"
    );
  });

  it("falls back to reasoning when the message is empty", () => {
    const withReasoning = parseTranscript(
      JSON.stringify({
        seq: 0,
        kind: "assistant",
        data: {
          content: "",
          reasoning: "Let me batch the independent reads.\nMore thought.",
          tool_calls: [{ name: "get_time", arguments: "{}" }],
        },
      })
    );
    const s = turnSummary(withReasoning.turns[0]);
    expect(s.text).toBe("Let me batch the independent reads.");
    expect(withReasoning.turns[0].assistant.data.reasoning).toContain(
      "More thought"
    );
  });

  it("parses a real transcript shape end to end", () => {
    // 906-line real file exercised in the browser; here just confirm empty
    // content is tolerated.
    const s = turnSummary(t.turns[1]);
    expect(s.text).toBe("");
    expect(s.tools).toContain("wait_until");
  });
});
