const SHORT: Record<string, string> = {
  "Gemini 3.1 Pro": "Gemini",
  "Claude Opus 5": "Opus 5",
  "GPT-5.6 Terra": "Terra",
  "Qwen 3.6 Plus": "Qwen",
  "Kimi K2.6": "Kimi",
  "Claude Sonnet 5": "Sonnet 5",
  "GLM 5.1": "GLM",
  "DeepSeek V4 Pro": "DeepSeek",
  "GPT-OSS-120B": "GPT-OSS",
  "Grok 4.20": "Grok",
};

export const short = (n: string) => SHORT[n] || n.split(" ")[0];
