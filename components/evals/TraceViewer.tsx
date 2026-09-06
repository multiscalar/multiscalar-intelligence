"use client";

import { useEffect, useState } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import {
  parseTranscript,
  turnSummary,
  type ParsedTrace,
  type TraceRow,
  type Turn,
} from "@/lib/evals/trace";

// The models write plain markdown (bold, lists); remark-breaks keeps their
// single newlines as line breaks. react-markdown never renders raw HTML.
const MD_COMPONENTS: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc ml-5 mb-2 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal ml-5 mb-2 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="my-0.5">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-medium text-black">{children}</strong>
  ),
  code: ({ children }) => (
    <code className="font-mono text-[0.72rem] bg-[#f0efec] px-1 rounded">
      {children}
    </code>
  ),
};

function MdText({ text }: { text: string }) {
  return (
    <Markdown remarkPlugins={[remarkBreaks]} components={MD_COMPONENTS}>
      {text}
    </Markdown>
  );
}

interface Statement {
  day?: number;
  net_worth_cents?: number;
  bank_cents?: number;
  supplied_cents?: number;
  wallet_stable_cents?: number;
  wallet_native_cents?: number;
  in_transit_cents?: number;
  penalties_cents?: number;
  collection_cents?: number;
  outstanding_cents?: number;
}

interface EpisodeResult {
  outcome?: string;
  calls_used?: number;
  statement?: Statement;
}

function fmtCents(c: number): string {
  const abs = (Math.abs(c) / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (c < 0 ? "−$" : "$") + abs;
}

function ThinkingBlock({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 500;
  return (
    <div className="border-l-2 border-[#d8d6d0] pl-3 py-1">
      <div className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-text-dim mb-1">
        Thinking
      </div>
      <div className="font-sans text-[0.8rem] leading-[1.6] text-text-secondary italic">
        <MdText text={long && !open ? text.slice(0, 500) + "…" : text} />
      </div>
      {long && (
        <button
          className="font-mono text-[0.62rem] text-text-secondary hover:text-text cursor-pointer mt-1"
          onClick={() => setOpen(!open)}
        >
          {open ? "collapse" : "show full thinking"}
        </button>
      )}
    </div>
  );
}

function ToolResultBlock({ row }: { row: TraceRow }) {
  const [open, setOpen] = useState(false);
  const json = JSON.stringify(row.data.result, null, 2) ?? "null";
  const long = json.length > 400;
  return (
    <div className="border-l-2 border-border pl-3 py-1">
      <div className="font-mono text-[0.7rem] text-text-secondary">
        {row.data.name}
        {row.data.arguments && row.data.arguments !== "{}" && (
          <span className="text-text-dim"> {row.data.arguments}</span>
        )}
      </div>
      <pre className="font-mono text-[0.68rem] leading-[1.55] text-text-secondary whitespace-pre-wrap break-words overflow-hidden mt-1 mb-0">
        {long && !open ? json.slice(0, 400) + "…" : json}
      </pre>
      {long && (
        <button
          className="font-mono text-[0.62rem] text-text-dim hover:text-text cursor-pointer mt-1"
          onClick={() => setOpen(!open)}
        >
          {open ? "collapse" : "show full result"}
        </button>
      )}
    </div>
  );
}

function TurnRow({ turn }: { turn: Turn }) {
  const [open, setOpen] = useState(false);
  const s = turnSummary(turn);
  return (
    <div className="border border-border rounded-lg bg-bg-elevated">
      <button
        className="w-full grid grid-cols-[2.4rem_1fr_auto] items-baseline gap-2 text-left px-4 py-[0.65rem] cursor-pointer"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-mono text-[0.7rem] text-text-dim">{turn.n}</span>
        <span className="min-w-0">
          {s.text && (
            <span className="block font-sans text-[0.8rem] text-text leading-[1.5] truncate">
              {s.text}
            </span>
          )}
          {s.tools && (
            <span
              className={`block font-mono text-[0.68rem] truncate ${
                s.text ? "text-text-secondary" : "text-text"
              }`}
            >
              {s.tools}
            </span>
          )}
        </span>
        <span className="font-mono text-[0.7rem] text-text-dim">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 pl-[3.4rem] flex flex-col gap-3 max-[780px]:pl-4">
          {turn.assistant.data.reasoning && (
            <ThinkingBlock text={turn.assistant.data.reasoning} />
          )}
          {turn.assistant.data.content && (
            <div className="font-sans text-[0.82rem] leading-[1.65] text-text-secondary">
              <MdText text={turn.assistant.data.content} />
            </div>
          )}
          {(turn.assistant.data.tool_calls ?? []).map((c, i) => (
            <div key={i} className="font-mono text-[0.72rem] text-text">
              {c.name}
              <span className="text-text-dim"> {c.arguments}</span>
            </div>
          ))}
          {turn.notes.map((n, i) => (
            <div
              key={i}
              className="font-mono text-[0.68rem] text-[#96682a] border-l-2 border-[#e0cba4] pl-3"
            >
              world note: {JSON.stringify(n.data)}
            </div>
          ))}
          {turn.results.map((r, i) => (
            <ToolResultBlock key={i} row={r} />
          ))}
        </div>
      )}
    </div>
  );
}

const STATEMENT_ROWS: [keyof Statement, string][] = [
  ["net_worth_cents", "Net worth"],
  ["bank_cents", "Bank"],
  ["supplied_cents", "Supplied to lending"],
  ["wallet_stable_cents", "Wallet stable"],
  ["wallet_native_cents", "Wallet native"],
  ["in_transit_cents", "In transit"],
  ["penalties_cents", "Penalties paid"],
  ["collection_cents", "Sent to collection"],
  ["outstanding_cents", "Outstanding"],
];

// Renders the published excerpt of one episode plus the closing statement of
// the full run. The briefing prompt is proprietary and never published.
export default function TraceViewer({
  bench,
  episode,
  totalTurns,
}: {
  bench: string;
  episode: string;
  totalTurns: number;
}) {
  const [trace, setTrace] = useState<ParsedTrace | null>(null);
  const [result, setResult] = useState<EpisodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const base = `/traces/${bench}/${episode}`;

  useEffect(() => {
    let cancelled = false;
    setTrace(null);
    setResult(null);
    setError(null);
    Promise.all([
      fetch(`${base}/transcript.jsonl`).then((r) => {
        if (!r.ok) throw new Error(`transcript: HTTP ${r.status}`);
        return r.text();
      }),
      fetch(`${base}/result.json`).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([jsonl, res]) => {
        if (cancelled) return;
        setTrace(parseTranscript(jsonl));
        setResult(res);
      })
      .catch((e) => !cancelled && setError(String(e)));
    return () => {
      cancelled = true;
    };
  }, [base]);

  if (error)
    return (
      <div className="font-mono text-[0.78rem] text-text-dim py-8">
        Could not load the trace ({error}).
      </div>
    );
  if (!trace)
    return (
      <div className="font-mono text-[0.78rem] text-text-dim py-8">
        Loading trace…
      </div>
    );

  const shown = trace.turns.length;
  const excerpt = shown < totalTurns;
  const st = result?.statement;
  return (
    <div className="mt-6">
      <div className="flex items-baseline justify-between mb-2">
        <div className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-black font-medium">
          {excerpt
            ? `Trajectory excerpt · first ${shown} of ${totalTurns} turns`
            : `Trajectory · all ${shown} turns`}
        </div>
        <div className="font-mono text-[0.68rem] text-text-secondary">
          <a href={`${base}/transcript.jsonl`} className="hover:text-text">
            raw excerpt ↗
          </a>
          {" · "}
          <a href={`${base}/result.json`} className="hover:text-text">
            result ↗
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-[3px]">
        {trace.turns.map((t) => (
          <TurnRow key={t.n} turn={t} />
        ))}
      </div>
      {st && (
        <div className="border border-border rounded-lg bg-bg-elevated px-5 py-4 mt-5">
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-black font-medium mb-3">
            Closing statement of the full episode · Day {st.day}
            {result?.outcome ? ` · ${result.outcome}` : ""}
            {result?.calls_used ? ` · ${result.calls_used} tool calls` : ""}
          </div>
          <div className="grid grid-cols-3 gap-x-8 gap-y-3 max-[780px]:grid-cols-2">
            {STATEMENT_ROWS.filter(([k]) => typeof st[k] === "number").map(
              ([k, label]) => (
                <div key={k}>
                  <div className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-text-dim">
                    {label}
                  </div>
                  <div
                    className={`font-mono text-[0.88rem] ${
                      k === "net_worth_cents"
                        ? (st[k] as number) < 0
                          ? "text-[#a8322f] font-medium"
                          : "text-black font-medium"
                        : "text-text-secondary"
                    }`}
                  >
                    {fmtCents(st[k] as number)}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
