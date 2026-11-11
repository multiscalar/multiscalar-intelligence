"use client";

import { useEffect, useState } from "react";
import { FIELD, LABEL, SUBMIT, Select } from "@/components/form";
import { CONTACT_INBOX, CONTACT_TOPICS, type ContactTopic } from "@/lib/contact";

// No backend yet: submitting composes a prefilled email with the answers.
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState<ContactTopic>("general");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const pre = new URLSearchParams(location.search).get("topic");
    const match = CONTACT_TOPICS.find((t) => t.key === pre);
    if (match) setTopic(match.key);
  }, []);

  const topicLabel = CONTACT_TOPICS.find((t) => t.key === topic)!.label;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      ...(company ? [`Company: ${company}`] : []),
      "",
      message,
    ].join("\n");
    location.href = `mailto:${CONTACT_INBOX}?subject=${encodeURIComponent(
      `${topicLabel}: ${name}`,
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
        <div>
          <label htmlFor="ct-name" className={LABEL}>
            Name
          </label>
          <input
            id="ct-name"
            className={FIELD}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="ct-email" className={LABEL}>
            Email
          </label>
          <input
            id="ct-email"
            type="email"
            className={FIELD}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
        <div>
          <label htmlFor="ct-company" className={LABEL}>
            Company or institution <span className="text-black/40">(optional)</span>
          </label>
          <input
            id="ct-company"
            className={FIELD}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            autoComplete="organization"
          />
        </div>
        <div>
          <label htmlFor="ct-topic" className={LABEL}>
            Topic
          </label>
          <Select
            id="ct-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value as ContactTopic)}
          >
            {CONTACT_TOPICS.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <label htmlFor="ct-message" className={LABEL}>
          Message
        </label>
        <textarea
          id="ct-message"
          className={`${FIELD} min-h-[160px] resize-y`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          placeholder="What you are working on, and how we can help."
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-5">
        <button type="submit" className={SUBMIT}>
          Send message
        </button>
        <span className="text-[0.78rem] text-text-dim">
          Opens your email client with your message ready to send
        </span>
      </div>
    </form>
  );
}
