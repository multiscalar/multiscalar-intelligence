"use client";

import { useState } from "react";
import { FIELD, LABEL, SUBMIT } from "@/components/form";
import { CONTACT_INBOX } from "@/lib/contact";

// Blacksmith waitlist. No backend yet: submitting composes a prefilled email
// to the contact inbox, like the contact form.
export default function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [workflow, setWorkflow] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company}`,
      ...(workflow ? ["", "Workflow to hand over first:", workflow] : []),
    ].join("\n");
    location.href = `mailto:${CONTACT_INBOX}?subject=${encodeURIComponent(
      `Blacksmith waitlist: ${company || name}`,
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
        <div>
          <label htmlFor="wl-name" className={LABEL}>
            Name
          </label>
          <input id="wl-name" className={FIELD} value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
        </div>
        <div>
          <label htmlFor="wl-email" className={LABEL}>
            Work email
          </label>
          <input
            id="wl-email"
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
        <label htmlFor="wl-company" className={LABEL}>
          Company
        </label>
        <input
          id="wl-company"
          className={FIELD}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          autoComplete="organization"
        />
      </div>
      <div>
        <label htmlFor="wl-workflow" className={LABEL}>
          Which workflow would you hand over first? <span className="text-black/40">(optional)</span>
        </label>
        <textarea
          id="wl-workflow"
          className={`${FIELD} min-h-[120px] resize-y`}
          value={workflow}
          onChange={(e) => setWorkflow(e.target.value)}
          placeholder="For example: supplier renewals, refund requests, invoice reconciliation."
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-5">
        <button type="submit" className={SUBMIT}>
          Join the waitlist
        </button>
        <span className="text-[0.78rem] text-text-dim">Opens your email client with your details ready to send</span>
      </div>
    </form>
  );
}
