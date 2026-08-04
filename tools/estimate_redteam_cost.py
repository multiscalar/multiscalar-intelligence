# Cost model for running "Profit is the Red Team" over 4 games x a terms-bench-sized panel.
# Paper params: T=10 turns/episode; TAP branching=3, width=4, depth=5; eval 20 episodes x 2 conditions.

GAMES = 4
TAP_CANDIDATES = 4 * 3 * 5      # width * branching * depth = 60 candidate evaluations
EVAL_EPISODES = 20 * 2          # baseline + red-teamed conditions

# Per-episode tokens, split evenly between the two sides.
# 10 alternating calls; input grows with history (500 + 150*(i-1)); output per call varies.
def episode_tokens(out_per_call):
    calls = 10
    inp = sum(500 + 150 * i for i in range(calls))
    out = calls * out_per_call
    return inp / 2, out / 2                      # per side

PRICES = {  # $ per 1M tokens (in, out)
    "opus-5":      (5.0, 25.0),
    "sonnet-5":    (3.0, 15.0),
    "haiku-4.5":   (1.0, 5.0),
    "gpt-5.x":     (1.25, 10.0),                  # GPT-5-class, assumed
    "open-weight": (0.30, 1.20),                  # Qwen/GLM/Kimi/DeepSeek-class on OpenRouter
}

def cost(n_episodes, price_in, price_out, out_per_call):
    i, o = episode_tokens(out_per_call)
    return n_episodes * (i * price_in + o * price_out) / 1e6

ATTACKER = PRICES["gpt-5.x"]   # paper pins the attacker to GPT-5.2

def per_target(tier, out_per_call, episodes_per_game):
    tin, tout = PRICES[tier]
    n = episodes_per_game * GAMES
    return cost(n, tin, tout, out_per_call) + cost(n, *ATTACKER, 150)

# Panel roughly matching terms-bench: 12 models
PANEL = [("opus-5", 3), ("sonnet-5", 2), ("haiku-4.5", 1), ("gpt-5.x", 2), ("open-weight", 4)]

for label, eps, note in [
    ("FULL TAP per target (K=5 eval episodes/candidate)", TAP_CANDIDATES * 5 + EVAL_EPISODES, "60 candidates x 5 + 40 eval"),
    ("FULL TAP per target (K=3)",                          TAP_CANDIDATES * 3 + EVAL_EPISODES, "60 x 3 + 40"),
    ("FROZEN attacks (no search)",                          EVAL_EPISODES,                      "40 episodes only"),
]:
    print(f"\n=== {label} — {eps} episodes/game/target ({note}) ===")
    for reasoning, opc in [("non-reasoning (150 out/call)", 150), ("reasoning (800 out/call)", 800)]:
        total = sum(k * per_target(t, opc, eps) for t, k in PANEL)
        example = per_target("opus-5", opc, eps)
        print(f"  {reasoning:<30} panel total ${total:8,.0f}   (one Opus-tier target: ${example:,.0f})")
