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
    reasoning?: string;
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
  /** Rows that precede the first assistant turn (e.g. a counterpart
      opening a negotiation before the agent has moved). */
  preamble: TraceRow[];
  turns: Turn[];
}

export function parseTranscript(jsonl: string): ParsedTrace {
  const rows: TraceRow[] = jsonl
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));

  let briefing = "";
  const preamble: TraceRow[] = [];
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
    // tool_result / note rows belong to the preceding assistant turn;
    // before any turn exists they form the preamble.
    const turn = turns[turns.length - 1];
    if (!turn) {
      preamble.push(row);
      continue;
    }
    if (row.kind === "note") turn.notes.push(row);
    else turn.results.push(row);
  }
  return { briefing, preamble, turns };
}

// Collapsed rows show plain text, so drop the markdown markers the models
// write (bold, inline code, a leading list bullet).
function stripMd(line: string): string {
  return line
    .replace(/^\s*(?:[-*]|\d+\.)\s+/, "")
    .replace(/\*\*|`/g, "")
    .trim();
}

// One-line summary for a collapsed turn row; falls back to the reasoning
// when the visible message is empty (narrated runs think more than they say).
export function turnSummary(turn: Turn): { text: string; tools: string } {
  const content = (
    turn.assistant.data.content ||
    turn.assistant.data.reasoning ||
    ""
  ).trim();
  const firstLine = stripMd(content.split("\n")[0]);
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
