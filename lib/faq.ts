import type { FaqItem } from "@/components/Faq";
import { HIDE } from "@/lib/launch";
import { BENCH_CAPABILITIES, BENCH_PRIMARY, CAPABILITIES } from "@/lib/evals/eii";

// "a", "a and b", "a, b and c"
const list = (xs: string[]) =>
  xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
const capName = (short: string) =>
  (CAPABILITIES.find((c) => c.short === short)?.name ?? short).toLowerCase();
import { BENCH_SAMPLES } from "@/lib/evals/samples";
import type { BenchData } from "@/lib/evals/types";
import { contactHref } from "@/lib/contact";

// Questions and answers for the FAQ sections across the index pages. Answers
// only state what the site already says elsewhere; keep them in step.

// The Index page: the essentials, pointing to the methodology for the rest.
export const INDEX_FAQ: FaqItem[] = [
  {
    q: "What does the index measure?",
    a: "How well an AI model makes economic decisions on its own: negotiating, pricing, bidding, running a business and managing cash, against counterparties with their own interests and with real consequences for the money it controls.",
  },
  {
    q: "How is a score calculated?",
    a: "Each model plays every benchmark several times under the same conditions. We place each result on a 0-100 scale between a simple scripted strategy and the best outcome the benchmark allows, average the runs, and combine the benchmarks into five capability scores and one overall score.",
    link: { href: "/evals/#methodology", label: "Read the methodology" },
  },
  {
    q: "Does another model judge the results?",
    a: "No. Every benchmark in the index scores what the model's decisions caused, such as money made or the terms of a deal.",
  },
  {
    q: "Which benchmarks feed the index?",
    a: "Six today: TERMS-Bench, E-Commerce Bench, EconEvals and CoffeeBench from university and industry labs, and Auction Bench and Treasury-Bench, which we built. EconSec, on economic security, joins in a coming release.",
    link: { href: "/evals/#benchmarks", label: "See the benchmarks" },
  },
  {
    q: "Are scores comparable over time?",
    a: "Within a release, yes. Each release fixes the benchmarks, reference points and weights, and any change to them starts a new release.",
  },
  {
    q: "Can I evaluate my own model?",
    a: "Yes. We can run your model through the benchmarks before release, under the same conditions as every model here.",
    link: { href: contactHref("evaluation"), label: "Get in touch" },
  },
  {
    q: "Can I get the underlying data?",
    a: "Complete runs, transcripts and evidence are available under an agreement not to redistribute them or train on them.",
    link: { href: "/evals/request-dataset/", label: "Request a dataset" },
  },
];

export const DATASET_FAQ: FaqItem[] = [
  {
    q: "What is included?",
    a: "Complete runs, transcripts and evidence bundles for the benchmarks you choose: every episode, message, decision and score behind the leaderboards.",
  },
  {
    q: "How can I use the data?",
    a: "For your own analysis and evaluation. Under the agreement, the data is not redistributed or used to train models.",
  },
  {
    q: "Which benchmarks are available?",
    a: "Every published benchmark. Choose one, or all of them, in the form.",
    link: { href: "/evals/#benchmarks", label: "See the benchmarks" },
  },
  {
    q: "What happens after I send the request?",
    a: "We get back to you to agree the terms and share the data.",
  },
];

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

// One benchmark's page, built from its own data.
export function benchFaq(slug: string, d: BenchData): FaqItem[] {
  return d.notes && d.feeds ? indexBenchFaq(slug, d) : boardFaq(slug, d);
}

function whoBuilt(d: BenchData): FaqItem {
  const ours = d.source.name === "Multiscalar";
  return {
    q: "Who built it?",
    a: ours
      ? `Multiscalar built ${d.title} and runs it.`
      : d.source.index
        ? `${d.source.name} built ${d.title}. Multiscalar runs it, with attribution, as part of the Economic Intelligence Index.`
        : `${d.source.name} built ${d.title}. We show its published results with attribution.`,
    ...(!ours && d.source.url ? { link: { href: d.source.url, label: `Visit ${d.source.name}'s page` } } : {}),
  };
}

function transcripts(slug: string): FaqItem {
  return BENCH_SAMPLES[slug]
    ? {
        q: "Can I read full transcripts?",
        a: "Yes. The Samples tab has complete episodes, with every message and decision. Full runs are available on request.",
        link: { href: `/evals/${slug}/samples/`, label: "Open the samples" },
      }
    : {
        q: "Can I read full transcripts?",
        a: "You can request complete runs and transcripts.",
        link: { href: `/evals/request-dataset/?bench=${slug}`, label: "Request the dataset" },
      };
}

// A benchmark in the index: its notes say what it measures, how its own
// metric becomes 0-100 and what the unscaled results were.
function indexBenchFaq(slug: string, d: BenchData): FaqItem[] {
  const notes = d.notes!;
  return [
    { q: `What does ${d.title} measure?`, a: notes.measures },
    { q: "How is the score calculated?", a: notes.scoring },
    {
      q: d.source.paper ? "How do these scores differ from the paper?" : "How do these scores differ from the raw results?",
      a: notes.original,
      ...(d.source.paper ? { link: { href: d.source.paper, label: "Read the paper" } } : {}),
    },
    {
      q: "How does it feed the index?",
      a: `${d.title} counts toward ${d.feeds!.length === 1 ? "one" : d.feeds!.length === 5 ? "all five" : ["", "", "two", "three", "four"][d.feeds!.length]} of the index's five capabilities: ${list(d.feeds!)}. The methodology explains how the capabilities combine into one score.`,
      link: { href: "/evals/#methodology", label: "Read the methodology" },
    },
    whoBuilt(d),
    {
      q: "When were these results produced?",
      a: `For the index release of ${fmtDate(d.source.snapshot)}. Every model played the same episodes with the same settings. The page updates with each release.`,
    },
    transcripts(slug),
    {
      q: "Can I evaluate my own model on it?",
      a: `Yes. We can run your model through ${d.title} before release, under the same conditions as every model here.`,
      link: { href: contactHref("evaluation"), label: "Get in touch" },
    },
  ];
}

// A board outside the index.
function boardFaq(slug: string, d: BenchData): FaqItem[] {
  const metric = d.metrics.find((m) => m.id === d.defaultMetric)!;
  const ours = d.source.name === "Multiscalar";
  const traits = d.source.index ? (BENCH_CAPABILITIES[slug] ?? []) : [];
  const primary = BENCH_PRIMARY[slug] ?? traits;
  const secondary = traits.filter((t) => !primary.includes(t));
  return [
    { q: `What does ${d.title} measure?`, a: `${d.question} ${d.blurb}` },
    {
      q: "How are models ranked?",
      a: `By ${metric.label.charAt(0).toLowerCase()}${metric.label.slice(1)}${
        metric.higherIsBetter === false ? ", where lower is better" : ", where higher is better"
      }.`,
    },
    {
      q: "Who built it?",
      a: ours
        ? `Multiscalar built ${d.title} and runs it.`
        : d.source.index
          ? `${d.source.name} built ${d.title}. Multiscalar runs it, with attribution, as part of the Economic Intelligence Index.`
          : `${d.source.name} built ${d.title}. We show its published results with attribution.`,
      ...(!ours && d.source.url ? { link: { href: d.source.url, label: `Visit ${d.source.name}'s page` } } : {}),
    },
    {
      q: "When were these results produced?",
      a: `The current results come from a run on ${fmtDate(d.source.snapshot)}. The leaderboard updates when the benchmark is rerun.`,
    },
    BENCH_SAMPLES[slug]
      ? {
          q: "Can I read full transcripts?",
          a: "Yes. The Samples tab has complete episodes, with every message and decision. Full runs are available on request.",
          link: { href: `/evals/${slug}/samples/`, label: "Open the samples" },
        }
      : {
          q: "Can I read full transcripts?",
          a: "Complete runs and transcripts are available on request.",
          link: { href: `/evals/request-dataset/?bench=${slug}`, label: "Request the dataset" },
        },
    ...(traits.length
      ? [
          {
            q: "How does it feed the index?",
            a: `${d.title} is one of the benchmarks the Economic Intelligence Index averages, scored from 0 to 100. Its primary capabilities are ${list(primary.map(capName))}${
              secondary.length ? `; it also exercises ${list(secondary.map(capName))}` : ""
            }.`,
            link: { href: "/evals/#methodology", label: "Read the methodology" },
          },
        ]
      : []),
    {
      q: "Can I evaluate my own model on it?",
      a: `Yes. We can run your model through ${d.title} before release, under the same conditions as every other model.`,
      link: { href: contactHref("evaluation"), label: "Get in touch" },
    },
  ];
}

/* ---------- EXAMPLE placeholders: replace with real answers before launch ---------- */

// A benchmark still in development (/evals/<slug>/ for upcoming ones).
export function upcomingFaq(b: {
  slug: string;
  title: string;
  question: string;
  blurb: string;
  traits: string[];
}): FaqItem[] {
  return [
    { q: `What will ${b.title} measure?`, a: `${b.question} ${b.blurb}` },
    {
      // EXAMPLE
      q: "When will results be published?",
      a: "With the next version of the Economic Intelligence Index. Leave your details to hear when they go live.",
      link: { href: contactHref("evaluation"), label: "Get notified" },
    },
    ...(b.traits.length
      ? [
          {
            q: "How will it feed the index?",
            a: `${b.title} will contribute to ${b.traits.join(", ").replace(/, ([^,]*)$/, " and $1").toLowerCase()} in the index.`,
            link: { href: "/evals/#methodology", label: "Read the methodology" },
          },
        ]
      : []),
    {
      // EXAMPLE
      q: "Can my model be evaluated before launch?",
      a: `Yes. Labs can run their models through ${b.title} ahead of the public release, under the same conditions as every other model.`,
      link: { href: contactHref("evaluation"), label: "Get in touch" },
    },
  ];
}

export const CONTACT_FAQ: FaqItem[] = [
  {
    // EXAMPLE
    q: "How quickly will you reply?",
    a: "Usually within a few working days.",
  },
  {
    q: "Can you evaluate our model?",
    a: "Yes. We run models through the benchmarks behind the index, before or after release. Choose \"Evaluate a model\" in the form.",
  },
  {
    q: "I'm writing about Multiscalar. Who should I contact?",
    a: "Use this form and choose \"Press\" as the topic.",
  },
  {
    q: "Can I get the benchmark data?",
    a: "Complete runs and transcripts are available through a dataset request.",
    ...(HIDE.evalsLinks ? {} : { link: { href: "/evals/request-dataset/", label: "Request a dataset" } }),
  },
];
