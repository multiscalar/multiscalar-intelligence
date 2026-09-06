"use client";

import { useEffect, useState } from "react";
import { BENCHES, loadBench } from "@/lib/evals/benches";

const USE_CASES = [
  "Academic research",
  "Model evaluation",
  "Training data",
  "Internal benchmarking",
  "Journalism / reporting",
  "Other",
];

const FIELD =
  "w-full bg-bg-elevated border border-border rounded-lg px-4 py-3 font-sans text-[0.9rem] text-text outline-none transition-colors focus:border-[#1a1a1a]";
const LABEL =
  "block font-mono text-[0.68rem] uppercase tracking-[0.14em] text-text-secondary mb-2";

// No backend yet: submitting composes a prefilled email to
// hello@multiscalar.ai with the answers.
export default function DatasetRequestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [useCase, setUseCase] = useState(USE_CASES[0]);
  const [bench, setBench] = useState<string>("all");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const pre = new URLSearchParams(location.search).get("bench");
    if (pre && (BENCHES as readonly string[]).includes(pre)) setBench(pre);
  }, []);

  const benchTitle =
    bench === "all" ? "All benchmarks" : loadBench(bench).title;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      `Name: ${name}`,
      `Company: ${company}`,
      `Use case: ${useCase}`,
      `Dataset: ${benchTitle}`,
      "",
      message,
    ].join("\n");
    location.href = `mailto:hello@multiscalar.ai?subject=${encodeURIComponent(
      `Dataset request: ${benchTitle}`
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-5 max-[640px]:grid-cols-1">
        <div>
          <label htmlFor="rq-name" className={LABEL}>
            Name
          </label>
          <input
            id="rq-name"
            className={FIELD}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="rq-email" className={LABEL}>
            Work email
          </label>
          <input
            id="rq-email"
            type="email"
            className={FIELD}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
      </div>
      <div>
        <label htmlFor="rq-company" className={LABEL}>
          Company or institution
        </label>
        <input
          id="rq-company"
          className={FIELD}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          autoComplete="organization"
        />
      </div>
      <div className="grid grid-cols-2 gap-5 max-[640px]:grid-cols-1">
        <div>
          <label htmlFor="rq-usecase" className={LABEL}>
            Use case
          </label>
          <select
            id="rq-usecase"
            className={FIELD}
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
          >
            {USE_CASES.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rq-bench" className={LABEL}>
            Dataset
          </label>
          <select
            id="rq-bench"
            className={FIELD}
            value={bench}
            onChange={(e) => setBench(e.target.value)}
          >
            <option value="all">All benchmarks</option>
            {BENCHES.map((b) => (
              <option key={b} value={b}>
                {loadBench(b).title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="rq-message" className={LABEL}>
          Anything else
        </label>
        <textarea
          id="rq-message"
          className={`${FIELD} min-h-[120px] resize-y`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What you are working on, timelines, anything that helps us respond."
        />
      </div>
      <div className="flex items-center gap-5 flex-wrap">
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-[#1a1a1a] text-[#fafafa] font-mono text-[0.78rem] tracking-[0.03em] px-6 py-3 rounded-lg transition-colors hover:bg-black cursor-pointer"
        >
          Send request
          <span aria-hidden="true">→</span>
        </button>
        <span className="font-mono text-[0.7rem] text-text-secondary">
          Opens your email client, addressed to hello@multiscalar.ai
        </span>
      </div>
    </form>
  );
}
