"""Publish ZeroSum-Bench sample negotiations as site trace excerpts.

    python3 tools/export_zerosum_samples.py <trace_examples_dir>

Transforms termsbench v2 episode traces into the common transcript.jsonl
shape the site's trace viewer renders: one assistant turn per round (the
agent's decision, with its captured reasoning), counterpart moves as tool
results attached to the turn they answer, and the episode outcome as a
closing result. Excluded on purpose: system prompts (proprietary), tree
search internals, token usage, and the kernel's counterpart-step
probabilities (evaluator-privileged).
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

# (source model dir, episode filename stem, published episode id)
EPISODES = [
    ("glm-5.2", "episode_00001_urgency_shift_strategic_seller_agent_opens_seed50", "glm-5.2-urgency-deal"),
    ("glm-5.2", "episode_00002_no_deal_adversarial_seller_counterpart_opens_seed51", "glm-5.2-no-deal-wall"),
    ("glm-5.2", "episode_00003_urgency_shift_taciturn_buyer_counterpart_opens_seed52", "glm-5.2-buyer-hold"),
    ("kimi-k3", "episode_00001_urgency_shift_strategic_seller_agent_opens_seed50", "kimi-k3-urgency-deal"),
    ("kimi-k3", "episode_00002_no_deal_adversarial_seller_counterpart_opens_seed51", "kimi-k3-no-deal-wall"),
    ("kimi-k3", "episode_00003_urgency_shift_taciturn_buyer_counterpart_opens_seed52", "kimi-k3-buyer-soft"),
]

OUT = Path(__file__).resolve().parent.parent / "public" / "traces" / "economic-arena"


def fmt_price(p) -> str:
    return f"{p:.2f}" if isinstance(p, (int, float)) else str(p)


def counterpart_row(seq: int, cp: dict) -> dict:
    result = {"price": round(cp["price"], 2)}
    if cp.get("sentiment"):
        result["sentiment"] = cp["sentiment"]
    if cp.get("stance_cue"):
        result["tone"] = cp["stance_cue"]
    return {
        "seq": seq,
        "kind": "tool_result",
        "data": {"name": "counterpart_offer", "arguments": "{}", "result": result},
    }


def export(src_root: Path, model_dir: str, stem: str, episode_id: str) -> None:
    trace = json.loads((src_root / model_dir / "traces" / f"{stem}.json").read_text())
    scenario = trace["scenario"]
    outcome = trace["outcome"]
    calls = trace["llm_calls"]

    rows = []
    seq = 0

    # The scenario, at the level the round data already shows.
    rows.append(
        {
            "seq": seq,
            "kind": "tool_result",
            "data": {
                "name": "scenario",
                "arguments": "{}",
                "result": {
                    "regime": scenario["regime"].replace("_", " "),
                    "agent_role": scenario["agent_role"],
                    "price_range": f"{scenario['p_min']:.0f} to {scenario['p_max']:.0f}",
                    "max_rounds": scenario["K"],
                },
            },
        }
    )
    seq += 1

    for rnd in trace["rounds"]:
        cp = rnd.get("counterpart") or {}
        if cp.get("price") is not None:
            rows.append(counterpart_row(seq, cp))
            seq += 1
        root = None
        ri = rnd.get("root_llm_call_index")
        if ri is not None and 0 <= ri < len(calls):
            root = calls[ri]
        agent = rnd["agent"]
        decision = (agent.get("decision") or "").lower() or "act"
        args = (
            json.dumps({"price": fmt_price(agent["price"])})
            if agent.get("price") is not None
            else "{}"
        )
        data = {
            "content": (root or {}).get("parsed_message") or "",
            "tool_calls": [{"name": decision, "arguments": args}],
        }
        reasoning = (root or {}).get("reasoning")
        if reasoning:
            data["reasoning"] = reasoning
        rows.append({"seq": seq, "kind": "assistant", "data": data})
        seq += 1

    final = {
        "agreement_reached": outcome["agreement_reached"],
        "termination": outcome["termination_reason"],
        "rounds_played": outcome["rounds_played"],
        "agent_utility": round(outcome["agent_utility"], 2),
    }
    if outcome.get("outcome_price") is not None:
        final["price"] = round(outcome["outcome_price"], 2)
    rows.append(
        {
            "seq": seq,
            "kind": "tool_result",
            "data": {"name": "outcome", "arguments": "{}", "result": final},
        }
    )

    out_dir = OUT / episode_id
    out_dir.mkdir(parents=True, exist_ok=True)
    with open(out_dir / "transcript.jsonl", "w") as f:
        for row in rows:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
    print(f"wrote {out_dir}/transcript.jsonl ({len(rows)} rows)")


def main(src_root: Path) -> int:
    for model_dir, stem, episode_id in EPISODES:
        export(src_root, model_dir, stem, episode_id)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(Path(sys.argv[1])))
