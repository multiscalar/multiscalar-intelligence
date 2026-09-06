// Published sample episodes per benchmark: complete single episodes served
// from public/traces/<bench>/<id>/ (transcript.jsonl + result.json only —
// the episode config identifies the private replay window and stays out).

export interface SampleEpisode {
  id: string;
  model: string;
  provider: string;
  closing: string;
  onTime: string;
  story: string;
}

export interface BenchSamples {
  episodes: SampleEpisode[];
  note: string;
}

export const BENCH_SAMPLES: Record<string, BenchSamples> = {
  "treasury-bench": {
    episodes: [
      {
        id: "glm-5.3-clean-year",
        model: "GLM-5.3",
        provider: "zai",
        closing: "+$10,044.95",
        onTime: "56/57",
        story:
          "The best run on record: probes pool depth before committing, reasons about ACH return windows, and beats the scripted prudent baseline.",
      },
      {
        id: "opus-5-beat-the-baseline",
        model: "Claude Opus 5",
        provider: "anthropic",
        closing: "+$9,842.22",
        onTime: "55/57",
        story: "Disciplined just-in-time treasury; also beats the baseline.",
      },
      {
        id: "terra-5.6-one-late-sweep",
        model: "GPT-5.6 Terra",
        provider: "openai",
        closing: "+$1,437.69",
        onTime: "0/57",
        story:
          "Pathology sample: sleeps 365 days in one tool call, then pays all 57 bills in a single day-365 wire sweep, eating $8,905 in penalties.",
      },
      {
        id: "gemma-4-31b-collapse",
        model: "Gemma 4 31B",
        provider: "google",
        closing: "−$14,874.14",
        onTime: "2/57",
        story:
          "Small-model failure mode: sets up lending competently, then abandons the bill calendar; 55 bills go to collection.",
      },
    ],
    note:
      "These are illustrative single episodes reported as the closing treasury against a scripted prudent baseline of +$9,517.90 (doing nothing closes at −$19,696.65); the leaderboard averages value added across repeated seeded runs, so the figures differ. Asset and venue names in the transcripts (ember, granary, meridian, flint) are deliberate aliases and dates are fictional — the benchmark's anti-contamination layer.",
  },
};
