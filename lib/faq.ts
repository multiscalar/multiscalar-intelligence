import type { FaqItem } from "@/components/Faq";
import { HIDE } from "@/lib/launch";
import { BENCH_DIMENSIONS } from "@/lib/evals/eii";
import { BENCH_SAMPLES } from "@/lib/evals/samples";
import type { BenchData } from "@/lib/evals/types";
import { contactHref } from "@/lib/contact";

// Questions and answers for the FAQ sections across the index pages. Answers
// only state what the site already says elsewhere; keep them in step.

export const METHODOLOGY_FAQ: FaqItem[] = [] = [
  {
    q: "What does the index measure?",
    a: "Economic agency, not knowledge of economics: the ability to pursue economic objectives on its own, under constraints, uncertainty, strategic counterparties and financial risk, while protecting the interests of the principal it represents.",
  },
  {
    q: "What is the difference between skills and traits?",
    a: "Skills are the jobs, such as negotiating, pricing or allocating capital. Traits are the qualities that make an agent trustworthy at them: good outcomes, low cost, consistency, resistance to being played, and avoiding harm.",
  },
  {
    q: "How is a score calculated?",
    a: "Each model plays every scenario many times under the same conditions. We record what its decisions caused, place each result against fixed reference points, and roll the results up into skill and trait scores and then the index, with published weights and the uncertainty across runs.",
  },
  {
    q: "Does another model judge the results?",
    a: "Wherever possible, no. We score realized economic outcomes, such as money made or a deal's terms, rather than asking a model for its opinion.",
  },
  {
    q: "Which benchmarks feed the index?",
    a: "A mix of economic benchmarks, public and private, built by us and by others. Each one feeds every skill and trait it can measure, so no single test decides a score.",
    link: { href: "/evals/#benchmarks", label: "See the benchmarks" },
  },
  {
    q: "Can a model be tuned to the test?",
    a: "Public benchmarks and their results are open, so anyone can check how a score was produced. The official index also includes private, held-out scenarios that are never published.",
  },
  {
    q: "Are scores comparable over time?",
    a: "Within a version, yes: results are normalized against fixed reference points, with no ceiling to saturate. Any change to the benchmarks, weights, environments or normalization creates a new version, and results are only compared within a version.",
  },
  {
    q: "Can I get the underlying data?",
    a: "Complete runs, transcripts and evidence bundles are available under an agreement that they are not redistributed or used for training.",
    link: { href: "/evals/request-dataset/", label: "Request a dataset" },
  },
];

const byQuestion = (q: string) => METHODOLOGY_FAQ.find((f) => f.q === q)!;

// The Index page: the essentials, pointing to the methodology for the rest.
export const INDEX_FAQ: FaqItem[] = [
  byQuestion("What does the index measure?"),
  {
    ...byQuestion("How is a score calculated?"),
    link: { href: "/evals/methodology/", label: "Read the methodology" },
  },
  byQuestion("Which benchmarks feed the index?"),
  byQuestion("Are scores comparable over time?"),
  {
    q: "Can I evaluate my own model?",
    a: "Yes. We can run your model through the benchmarks before release, under the same conditions as every other model.",
    link: { href: contactHref("evaluation"), label: "Get in touch" },
  },
  byQuestion("Can I get the underlying data?"),
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
  const metric = d.metrics.find((m) => m.id === d.defaultMetric)!;
  const ours = d.source.name === "Multiscalar";
  const traits = BENCH_DIMENSIONS[slug] ?? [];
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
            a: `${d.title} contributes to ${traits.join(" and ").toLowerCase()} in the Economic Intelligence Index.`,
            link: { href: "/evals/methodology/", label: "Read the methodology" },
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
            link: { href: "/evals/methodology/", label: "Read the methodology" },
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

// A research capability page (/research/<slug>/).
export function researchFaq(title: string): FaqItem[] {
  return [
    {
      // EXAMPLE
      q: `Can we work with you on ${title.toLowerCase()}?`,
      a: "Yes. We work with a small number of partners at a time, starting from a specific problem and a measurable baseline.",
      link: { href: contactHref("partnership"), label: "Discuss a project" },
    },
    {
      q: "How do you measure progress?",
      a: HIDE.evalsLinks
        ? "On the Economic Intelligence Index, our benchmark suite for economic decision-making, so results are comparable with every other model. The index opens soon."
        : "On the Economic Intelligence Index. The benchmarks on this page feed it, so results are public and comparable with every other model.",
      ...(HIDE.evalsLinks ? {} : { link: { href: "/evals/methodology/", label: "Read the methodology" } }),
    },
    {
      q: "Do you publish this research?",
      a: "Wherever we can. Papers, code and results go out through Open Science, including the results that did not go our way.",
      link: { href: "/open-science/papers/", label: "See our papers" },
    },
    {
      // EXAMPLE
      q: "Where does our data go?",
      a: "Nowhere you don't choose. Models can run inside your own infrastructure, and nothing from a deployment is used to train other models.",
    },
  ];
}

export const ABOUT_FAQ: FaqItem[] = [
  {
    q: "What is economic intelligence?",
    a: "The ability to pursue economic objectives autonomously: negotiating, pricing, allocating capital and managing risk, under uncertainty and against counterparties with their own interests.",
  },
  {
    q: "Who do you work with?",
    a: "Enterprises and financial institutions putting AI to work, AI labs that want to know how their models behave as economic agents, and researchers working on the same problems.",
  },
  { q: "Where are you based?", a: "London, UK." },
  {
    // EXAMPLE
    q: "Are you hiring?",
    a: "Not for open roles right now, but we always want to hear from exceptional researchers and engineers.",
    link: { href: "/contact/", label: "Introduce yourself" },
  },
];

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
