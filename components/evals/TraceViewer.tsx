"use client";

import { useEffect, useState } from "react";
import {
  parseTranscript,
  turnSummary,
  type ParsedTrace,
  type TraceRow,
  type Turn,
} from "@/lib/evals/trace";

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
            <span className="block font-mono text-[0.68rem] text-text-dim truncate">
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
          {turn.assistant.data.content && (
            <p className="font-sans text-[0.82rem] leading-[1.65] text-text-secondary whitespace-pre-wrap mb-0">
              {turn.assistant.data.content}
            </p>
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

// Renders one published episode: briefing, every turn of the real
// transcript, and the closing statement.
export default function TraceViewer({
  bench,
  episode,
}: {
  bench: string;
  episode: string;
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

  const st = result?.statement;
  return (
    <div className="mt-6">
      <details className="border border-border rounded-lg bg-bg-elevated px-4 py-3 mb-4">
        <summary className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-secondary cursor-pointer">
          Briefing — the exact instructions the model received
        </summary>
        <pre className="font-sans text-[0.82rem] leading-[1.65] text-text-secondary whitespace-pre-wrap mt-3 mb-1">
          {trace.briefing}
        </pre>
      </details>

      <div className="flex items-baseline justify-between mb-2">
        <div className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-dim">
          Trajectory — {trace.turns.length} turns
          {result?.calls_used ? ` · ${result.calls_used} tool calls` : ""}
        </div>
        <div className="font-mono text-[0.68rem] text-text-dim">
          <a href={`${base}/transcript.jsonl`} className="hover:text-text">
            raw transcript ↗
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
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-dim mb-3">
            Closing statement — Day {st.day}
            {result?.outcome ? ` · ${result.outcome}` : ""}
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
