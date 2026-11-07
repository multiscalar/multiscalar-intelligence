// PLACEHOLDER customer quotes: names, companies and wording are stand-ins for
// layout only. Replace every entry with an approved quote, and add `logo` and
// `avatar` (files in public/) once the customer has agreed to be named.
//
// The first quote starts open; the others open on hover.

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  logo?: string;
  /** Square headshot; without one the card shows the person's initials. */
  avatar?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Before Multiscalar we had no way to know how a model would behave with a real budget. Now every model we consider is tested against the index first.",
    name: "Name Surname",
    role: "Head of Treasury",
    company: "Partner 1",
  },
  {
    quote:
      "Their environments surfaced failure modes our internal evals missed entirely. The negotiation results changed how we post-train.",
    name: "Name Surname",
    role: "Research Lead",
    company: "Partner 2",
  },
  {
    quote:
      "We went from a pilot to an agent running procurement across three business units, with every decision logged and reviewable.",
    name: "Name Surname",
    role: "Chief Operating Officer",
    company: "Partner 3",
  },
];
