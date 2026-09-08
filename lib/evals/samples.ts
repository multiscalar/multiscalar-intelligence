// Published sample episodes per benchmark: short excerpts served from
// public/traces/<bench>/<id>/ (transcript.jsonl + result.json only). The
// briefing prompt and the episode config are not published: the prompt is
// proprietary and the config identifies the private replay window.

export interface SampleEpisode {
  id: string;
  model: string;
  provider: string;
  /** Picker chip label; defaults to the model's short name. Needed when
      one model has several episodes. */
  chip?: string;
  story: string;
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
        model: "GLM-5.3",
        provider: "zai",
        story:
          "The best run on record: probes pool depth before committing, reasons about ACH return windows, and beats the scripted prudent baseline.",
      },
      {
        id: "qwen-3.8-max-clean-sweep",
        model: "Qwen 3.8 Max",
        provider: "alibaba",
        story:
          "A spotless narrated year: zero penalties, all 57 bills on time, with the model's reasoning captured at every turn.",
      },
      {
        id: "opus-5-beat-the-baseline",
        model: "Claude Opus 5",
        provider: "anthropic",
        story: "Disciplined just-in-time treasury; also beats the baseline.",
      },
      {
        id: "terra-5.6-one-late-sweep",
        model: "GPT-5.6 Terra",
        provider: "openai",
        story:
          "Pathology sample: sleeps 365 days in one tool call, then pays all 57 bills in a single day-365 wire sweep.",
      },
      {
        id: "gemma-4-31b-collapse",
        model: "Gemma 4 31B",
        provider: "google",
        story:
          "Small-model failure mode: sets up lending competently, then abandons the bill calendar; 55 bills go to collection.",
      },
    ],
  },
  "economic-arena": {
    note: "Complete short negotiations, reasoning included. Both models play the same three seeded scenarios: selling to a strategic buyer, selling to an aggressive lowballer with no possible deal, and buying from a taciturn seller.",
    episodes: [
      {
        id: "glm-5.2-urgency-deal",
        model: "GLM-5.2",
        provider: "zai",
        chip: "GLM · vs strategic",
        story:
          "Seller against a strategic buyer: opens at 80, accepts the counterpart's 59.6 in round two for 24.2 utility.",
      },
      {
        id: "glm-5.2-no-deal-wall",
        model: "GLM-5.2",
        provider: "zai",
        chip: "GLM · vs lowballer",
        story:
          "Seller against an aggressive lowballer with no overlap: concedes five rounds from 75 to 42, and the counterpart walks.",
      },
      {
        id: "glm-5.2-buyer-hold",
        model: "GLM-5.2",
        provider: "zai",
        chip: "GLM · as buyer",
        story:
          "Buyer against a taciturn seller opening at 72: holds at 50.0, and the seller takes it.",
      },
      {
        id: "kimi-k3-urgency-deal",
        model: "Kimi K3",
        provider: "moonshot",
        chip: "Kimi · vs strategic",
        story:
          "The same seeded scenario as GLM's deal: one round slower to the same 59.6 close.",
      },
      {
        id: "kimi-k3-no-deal-wall",
        model: "Kimi K3",
        provider: "moonshot",
        chip: "Kimi · vs lowballer",
        story:
          "The same no-overlap trap: five rounds of concessions, same walkaway ending.",
      },
      {
        id: "kimi-k3-buyer-soft",
        model: "Kimi K3",
        provider: "moonshot",
        chip: "Kimi · as buyer",
        story:
          "The same taciturn seller: settles at 55.0 where GLM held out for 50, giving up a third of the utility.",
      },
    ],
  },
};
