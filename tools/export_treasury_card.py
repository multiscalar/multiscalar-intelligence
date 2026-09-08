"""Export the Treasury-Bench site data from the stable-genesis t5 board.

    python3 tools/export_treasury_card.py /Users/vitto/Projects/Gaia/runs

Reads the per-episode result.json files of the named runs and writes BOTH
data/evals/treasury-bench.json (the leaderboard card) and
data/evals/treasury-scatter.json, so the two views can never carry
different vintages. Value added is measured from the scenario's pinned
prudent zero (run_stable_year_prudent, 951790 cents), the same reference
scripts/render_leaderboard.py prints in the Gaia repo; narrated episodes
never feed a board row.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

# Pinned by Gaia's tests; see scripts/render_leaderboard.py SCENARIOS["t5"].
PRUDENT_ZERO_CENTS = 951_790
IDLE_FLOOR_CENTS = -1_969_665
GAMBLER_CENTS = 828_257

# run dir (relative to the runs root), episode subdir, display name, provider
EPISODES = [
    ("t5-board2-z-ai_glm-5_3", "z-ai_glm-5.3", "GLM-5.3", "zai"),
    ("t5-board2-anthropic_claude-opus-5", "anthropic_claude-opus-5", "Claude Opus 5", "anthropic"),
    ("t5-board2-qwen_qwen3_8-max-0902-r3", "qwen_qwen3.8-max-0902", "Qwen 3.8 Max", "qwen"),
    ("t5-board2-anthropic_claude-sonnet-5", "anthropic_claude-sonnet-5", "Claude Sonnet 5", "anthropic"),
    ("t5-board2-deepseek_deepseek-v4-pro-0813-r2", "deepseek_deepseek-v4-pro-0813", "DeepSeek V4 Pro", "deepseek"),
    ("t5-board2-openai_gpt-5_6-sol", "openai_gpt-5.6-sol", "GPT-5.6 Sol", "openai"),
    ("t5-board2-openai_gpt-5_6-terra", "openai_gpt-5.6-terra", "GPT-5.6 Terra", "openai"),
    ("t5-board2-minimax_minimax-m3-r2", "minimax_minimax-m3", "MiniMax M3", "minimax"),
    ("t5-board2-google_gemini-3_1-pro-preview-r3", "google_gemini-3.1-pro-preview", "Gemini 3.1 Pro", "google"),
    ("t5-board2-openai_gpt-oss-120b", "openai_gpt-oss-120b", "GPT-OSS-120B", "openai"),
    ("t5-board2-google_gemma-4-31b-it", "google_gemma-4-31b-it", "Gemma 4 31B", "google"),
]

SNAPSHOT = "2026-09-08"

# Scatter label placement, tuned by eye against the rendered chart.
SCATTER_LABELS = {
    "GLM-5.3": "top",
    "Claude Opus 5": "bottom",
    "Qwen 3.8 Max": "tr",
    "Claude Sonnet 5": "tl",
    "DeepSeek V4 Pro": "left",
    "GPT-5.6 Sol": "right",
    "GPT-5.6 Terra": "bottom",
    "MiniMax M3": "left",
    "Gemini 3.1 Pro": "top",
    "GPT-OSS-120B": "top",
    "Gemma 4 31B": "bottom",
}


def main(runs_root: Path) -> int:
    models = []
    points = []
    for run_dir, episode_dir, name, provider in EPISODES:
        result_path = runs_root / run_dir / episode_dir / "episode-1" / "result.json"
        result = json.loads(result_path.read_text())
        if result.get("outcome") != "completed":
            raise SystemExit(f"{result_path}: outcome {result.get('outcome')!r}")
        config = json.loads((result_path.parent / "config.json").read_text())
        if (config.get("scenario") or {}).get("id") != "t5":
            raise SystemExit(f"{result_path}: not a t5 episode")
        if config.get("narrate"):
            raise SystemExit(f"{result_path}: narrated episodes never feed a board")
        st = result["statement"]
        loss_cents = st["penalties_cents"] + st["collection_cents"]
        points.append(
            {
                "name": name,
                "provider": provider,
                "net_worth_cents": st["net_worth_cents"],
                "penalties_cents": st["penalties_cents"],
                "collection_cents": st["collection_cents"],
                "label": SCATTER_LABELS.get(name, "top"),
            }
        )
        models.append(
            {
                "name": name,
                "provider": provider,
                "scores": {
                    "value_add": round((st["net_worth_cents"] - PRUDENT_ZERO_CENTS) / 100, 2),
                    "penalty_loss": round(loss_cents / 100, 2),
                },
            }
        )
    # The pinned scripted reference: value added only, no recorded penalties
    # field, so the loss chart simply omits it.
    models.append(
        {
            "name": "Gambler round trip",
            "provider": "baseline",
            "scores": {
                "value_add": round((GAMBLER_CENTS - PRUDENT_ZERO_CENTS) / 100, 2)
            },
        }
    )

    card = {
        "bench": "treasury-bench",
        "title": "Treasury-Bench",
        "question": "Can the agent manage cash it must never run out of?",
        "source": {
            "name": "Multiscalar",
            "label": "Multiscalar",
            "snapshot": SNAPSHOT,
            "run": "t5-stable-genesis",
        },
        "blurb": (
            "Agents manage $100k of company cash for a simulated year on "
            "replayed recorded market history: fifty-seven bills, none visible "
            "at genesis, real banking rails, and a lending venue paying "
            "recorded rates. Each model plays one replayed year. Score is "
            "value added over a scripted prudent treasurer that keeps a "
            "float, lends the rest, and pays every bill on time: zero means "
            "no better than playing it safe, and below zero the agent lost "
            "money the obvious policy would have kept. Doing nothing closes "
            f"${abs(IDLE_FLOOR_CENTS) / 100:,.2f} underwater. Gambler round "
            "trip is not a language model but a scripted conversion round "
            "trip, included as a priced reference."
        ),
        "footnote": "",
        "metrics": [
            {
                "id": "value_add",
                "label": "Value added vs prudent baseline",
                "unit": "$",
                "higherIsBetter": True,
            },
            {
                "id": "penalty_loss",
                "label": "Loss to penalties and collection",
                "unit": "$",
                "higherIsBetter": False,
            },
        ],
        "defaultMetric": "value_add",
        "models": models,
    }
    scatter = {
        "title": "Discipline is the whole game",
        "note": "Closing treasury against everything paid in penalties and collection. Each dot is one replayed year.",
        "footnote": (
            "A late payment costs a one-off 1.4% fee; anything unpaid at the "
            "close goes to collection with a 20% surcharge, which is what "
            "turns neglect into the only catastrophic outcome in the "
            "environment."
        ),
        "stamp": f"stable-genesis year · results as of {SNAPSHOT}",
        "points": points,
    }

    data_dir = Path(__file__).resolve().parent.parent / "data" / "evals"
    out = data_dir / "treasury-bench.json"
    out.write_text(json.dumps(card, indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {out} ({len(models)} rows)")
    out = data_dir / "treasury-scatter.json"
    out.write_text(json.dumps(scatter, indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {out} ({len(points)} points)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(Path(sys.argv[1])))
