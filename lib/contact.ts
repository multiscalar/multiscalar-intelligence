// Topics on the contact form. Links elsewhere on the site preselect one with
// ?topic=<key>, via contactHref.
export const CONTACT_TOPICS = [
  { key: "general", label: "General enquiry" },
  { key: "evaluation", label: "Evaluate a model" },
  { key: "partnership", label: "Partnerships" },
  { key: "research", label: "Research collaboration" },
  { key: "careers", label: "Join the team" },
  { key: "press", label: "Press" },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]["key"];

export const contactHref = (topic?: ContactTopic) =>
  topic ? `/contact/?topic=${topic}` : "/contact/";

// No backend yet: the form composes an email to this inbox. It is never shown
// on the site.
export const CONTACT_INBOX = "hello@multiscalar.ai";
