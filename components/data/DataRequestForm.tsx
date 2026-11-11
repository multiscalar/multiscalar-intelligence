"use client";

import { useEffect, useState } from "react";
import { FIELD, LABEL, SUBMIT, Select } from "@/components/form";
import { CONTACT_INBOX } from "@/lib/contact";
import { BENCHES, loadBench } from "@/lib/evals/benches";

const USE_CASES = [
  "Academic research",
  "Model evaluation",
  "Training data",
  "Internal benchmarking",
  "Journalism / reporting",
  "Other",
];

// The request form on /data/. No backend yet: submitting composes a
// prefilled email with the answers. ?bench=<slug> preselects a benchmark.
export default function DataRequestForm() {
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
    location.href = `mailto:${CONTACT_INBOX}?subject=${encodeURIComponent(
      `Dataset request: ${benchTitle}`
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
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
      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
        <div>
          <label htmlFor="rq-usecase" className={LABEL}>
            Use case
          </label>
          <Select
            id="rq-usecase"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
          >
            {USE_CASES.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="rq-bench" className={LABEL}>
            Dataset
          </label>
          <Select
            id="rq-bench"
            value={bench}
            onChange={(e) => setBench(e.target.value)}
          >
            <option value="all">All benchmarks</option>
            {BENCHES.map((b) => (
              <option key={b} value={b}>
                {loadBench(b).title}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <label htmlFor="rq-message" className={LABEL}>
          Anything else <span className="font-normal text-black/45">(optional)</span>
        </label>
        <textarea
          id="rq-message"
          className={`${FIELD} min-h-[120px] resize-y`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What you are working on, timelines, anything that helps us respond."
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-5">
        <button type="submit" className={SUBMIT}>
          Send request
        </button>
        <span className="text-[0.78rem] text-text-dim">
          Opens your email client with your request ready to send
        </span>
      </div>
    </form>
  );
}
