// Published sample episodes per benchmark: short excerpts served from
// public/traces/<bench>/<id>/ (transcript.jsonl + result.json only). The
// briefing prompt and the episode config are not published: the prompt is
// proprietary and the config identifies the private replay window.

export interface SampleTrace {
  /** Directory under public/traces/<bench>/ holding the transcript. */
  id: string;
  /** Heading shown above the trace when an episode bundles several. */
  label?: string;
}

export interface SampleEpisode {
  id: string;
  model: string;
  provider: string;
  /** Picker chip label; defaults to the model's short name. */
  chip?: string;
  story: string;
  traces: SampleTrace[];
}

export interface BenchSamples {
  /** One-line note under the section heading. */
  note: string;
  episodes: SampleEpisode[];
}

export const BENCH_SAMPLES: Record<string, BenchSamples> = {
  "treasury-bench": {
    note: "Short excerpts from single replayed years.",
    episodes: [
      {
        id: "glm-5.3-clean-year",
        traces: [{ id: "glm-5.3-clean-year" }],
        model: "GLM-5.3",
        provider: "zai",
        story:
          "The best run on record: probes pool depth before committing, reasons about ACH return windows, and beats the scripted prudent baseline.",
      },
      {
        id: "qwen-3.8-max-clean-sweep",
        traces: [{ id: "qwen-3.8-max-clean-sweep" }],
        model: "Qwen 3.8 Max",
        provider: "alibaba",
        story:
          "A spotless narrated year: zero penalties, all 57 bills on time, with the model's reasoning captured at every turn.",
      },
      {
        id: "opus-5-beat-the-baseline",
        traces: [{ id: "opus-5-beat-the-baseline" }],
        model: "Claude Opus 5",
        provider: "anthropic",
        story: "Disciplined just-in-time treasury; also beats the baseline.",
      },
      {
        id: "terra-5.6-one-late-sweep",
        traces: [{ id: "terra-5.6-one-late-sweep" }],
        model: "GPT-5.6 Terra",
        provider: "openai",
        story:
          "Pathology sample: sleeps 365 days in one tool call, then pays all 57 bills in a single day-365 wire sweep.",
      },
      {
        id: "gemma-4-31b-collapse",
        traces: [{ id: "gemma-4-31b-collapse" }],
        model: "Gemma 4 31B",
        provider: "google",
        story:
          "Small-model failure mode: sets up lending competently, then abandons the bill calendar; 55 bills go to collection.",
      },
    ],
  },
  "economic-arena": {
    note: "One complete negotiation per model, reasoning included. Both face the same seeded scenario: selling to an aggressive lowballer with no possible deal.",
    episodes: [
      {
        id: "glm-5.2",
        model: "GLM-5.2",
        provider: "zai",
        chip: "GLM",
        story:
          "Concedes five rounds from 75 to 42 against a buyer whose ceiling is below any acceptable price; the counterpart walks.",
        traces: [
          { id: "glm-5.2-no-deal-wall", label: "Selling to an aggressive lowballer" },
        ],
      },
      {
        id: "kimi-k3",
        model: "Kimi K3",
        provider: "moonshot",
        chip: "Kimi",
        story:
          "The same no-overlap trap: five rounds of concessions, same walkaway ending.",
        traces: [
          { id: "kimi-k3-no-deal-wall", label: "Selling to an aggressive lowballer" },
        ],
      },
    ],
  },
};
