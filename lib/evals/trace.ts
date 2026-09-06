// Parsing and turn-grouping for published episode transcripts
// (public/traces/<bench>/<episode>/transcript.jsonl).

export interface ToolCall {
  name: string;
  arguments: string;
}

export interface TraceRow {
  seq: number;
  kind: "briefing" | "assistant" | "tool_result" | "note";
  data: {
    content?: string;
    tool_calls?: ToolCall[];
    name?: string;
    arguments?: string;
    result?: unknown;
    nudged?: unknown;
    [key: string]: unknown;
  };
}

export interface Turn {
  n: number;
  assistant: TraceRow;
  results: TraceRow[];
  notes: TraceRow[];
}

export interface ParsedTrace {
  briefing: string;
  turns: Turn[];
}

export function parseTranscript(jsonl: string): ParsedTrace {
  const rows: TraceRow[] = jsonl
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));

  let briefing = "";
  const turns: Turn[] = [];
  for (const row of rows) {
    if (row.kind === "briefing") {
      briefing = row.data.content ?? "";
      continue;
    }
    if (row.kind === "assistant") {
      turns.push({ n: turns.length + 1, assistant: row, results: [], notes: [] });
      continue;
    }
    // tool_result / note rows belong to the preceding assistant turn; a
    // stray one before any turn would indicate a malformed transcript.
    const turn = turns[turns.length - 1];
    if (!turn) continue;
    if (row.kind === "note") turn.notes.push(row);
    else turn.results.push(row);
  }
  return { briefing, turns };
}

// One-line summary for a collapsed turn row.
export function turnSummary(turn: Turn): { text: string; tools: string } {
  const content = (turn.assistant.data.content ?? "").trim();
  const firstLine = content.split("\n")[0];
  const calls = turn.assistant.data.tool_calls ?? [];
  const first = calls[0];
  const tools = first
    ? `${first.name} ${truncate(first.arguments, 60)}${
        calls.length > 1 ? `  · +${calls.length - 1} more` : ""
      }`
    : "";
  return { text: truncate(firstLine, 130), tools };
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
