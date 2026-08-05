# Real OpenRouter prices (fetched 2026-08-05), $ per token -> per 1M below.
POOL = {  # id: (in$/M, out$/M, reasoning_by_default)
 "anthropic/claude-opus-5":        (5.00, 25.00, True),
 "anthropic/claude-sonnet-5":      (2.00, 10.00, True),
 "openai/gpt-5.6-terra":           (1.00,  6.00, True),
 "google/gemini-3.1-pro-preview":  (2.00, 12.00, True),
 "x-ai/grok-4.20":                 (1.25,  2.50, True),
 "z-ai/glm-5.1":                   (0.966, 3.036, True),
 "moonshotai/kimi-k2.6":           (0.589, 2.48, True),
 "deepseek/deepseek-v4-pro":       (0.435, 0.87, True),
 "qwen/qwen3.6-plus":              (0.325, 1.95, True),
 "openai/gpt-oss-120b":            (0.037, 0.17, False),
}
N = len(POOL)
SYS, PER_MSG = 450, 120          # tokens: rules+role+private value; growth per message

def per_side(turns_total, out_per_call):
    calls = turns_total / 2                      # each side acts on half the turns
    inp = sum(SYS + PER_MSG*(2*i) for i in range(int(calls)))
    return inp, calls*out_per_call

def cell_cost(a, b, episodes, turns, out_per_call_reasoning, out_low):
    total = 0.0
    for m in (a, b):
        pin, pout, reasons = POOL[m]
        opc = out_per_call_reasoning if reasons else out_low
        i, o = per_side(turns, opc)
        total += episodes * (i*pin + o*pout) / 1e6
    return total

import itertools
unordered = list(itertools.combinations(POOL, 2))          # 45
selfplay  = [(m, m) for m in POOL]                          # 10
# asymmetric games need both role assignments; symmetric ones don't
CELLS_ASYM = len(unordered)*2 + len(selfplay)                # ultimatum, bilateral trade
CELLS_SYM  = len(unordered)   + len(selfplay)                # auction, provision-point
print(f"pool {N} models | asym-game cells {CELLS_ASYM} x2 games | sym-game cells {CELLS_SYM} x2 games")

def run_total(episodes, turns, opc_reason, opc_low):
    t = 0.0
    for pair in unordered:
        t += 2*cell_cost(*pair, episodes, turns, opc_reason, opc_low)   # 2 asym games, both orders
        t += 2*cell_cost(*pair, episodes, turns, opc_reason, opc_low)   # 2 sym games, one order... 
    for m,_ in selfplay:
        t += 4*cell_cost(m, m, episodes, turns, opc_reason, opc_low)
    return t
# NB: asym = 2 games x 2 orders = 4 unordered-equivalents; sym = 2 games x 1 order = 2. Total 6.
def run_total_correct(episodes, turns, opc_reason, opc_low):
    t = 0.0
    for pair in unordered:
        t += 6*cell_cost(*pair, episodes, turns, opc_reason, opc_low)
    for m,_ in selfplay:
        t += 6*cell_cost(m, m, episodes, turns, opc_reason, opc_low)
    return t

eps_total = (len(unordered)+len(selfplay))*6
for label, turns, opc_r, opc_l in [
    ("capped reasoning (low effort, ~350 out/call)", 8, 350, 120),
    ("default reasoning (~1200 out/call)",           8, 1200, 120),
    ("default reasoning, long episodes (T=10)",      10, 1200, 120),
]:
    for episodes in (12, 20):
        c = run_total_correct(episodes, turns, opc_r, opc_l)
        print(f"  {label:44} {episodes:2d} ep/cell -> ${c:7,.0f}  ({eps_total*episodes:,} episodes)")
