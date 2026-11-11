#!/usr/bin/env python3
"""Write the index benchmarks' card data from an eii index.json.

The Economic Intelligence Index scores every benchmark 0-100 per episode
(between the benchmark's floor and ceiling, clipped), then averages. This
script takes those per-benchmark scores from the index run's index.json and
writes one data/evals/<slug>.json per benchmark, in the site's BenchData
format, with the index score as the only metric.

Get index.json from the index run in MLflow (experiment eii/prod, run
eii-prod@<version>, artifact index.json), or from `make show
SUITE=index/eii-prod.yaml` in the eii repo (runs/eii-prod/index.json).

    python3 tools/export_eii_cards.py <index.json> [--snapshot YYYY-MM-DD]

It also writes data/evals/index.json, the index preview's scores: the run
rescored under the C1-C5 dimension design in the eii repo
(index/eii-dimensions.yaml, private: the site publishes no weights).
Each dimension is the weighted mean of the benchmarks' index scores it draws
on, and the overall score the weighted mean of the dimensions. That is exact
only while every contribution keeps the run's own metric, floor and ceiling,
which the script checks.
"""

import argparse
import datetime as dt
import json
from pathlib import Path

import yaml

OUT = Path(__file__).resolve().parent.parent / "data" / "evals"
# The dimension design (weights and bounds) lives in the private eii repo:
# this repo is public, so the weights never come in here.
DESIGN = Path(__file__).resolve().parents[2] / "eii" / "index" / "eii-dimensions.yaml"

# eii model key -> (display name, provider as lib/evals/providers.ts reads it,
# release date). The release date is the model's `created` date in
# OpenRouter's catalog (openrouter.ai/api/v1/models), for the progress chart.
MODELS = {
    "gpt-6-astra": ("GPT-6 Astra", "OpenAI", "2026-09-04"),
    "claude-opus-5.5": ("Claude Opus 5.5", "Anthropic", "2026-09-22"),
    "mimo-v2.6-pro": ("MiMo V2.6 Pro", "Xiaomi", "2026-09-21"),
    "minimax-m3": ("MiniMax M3", "MiniMax", "2026-05-31"),
    "gemini-3.8-flash": ("Gemini 3.8 Flash", "Google", "2026-09-02"),
    "glm-5.3": ("GLM-5.3", "Z.ai", "2026-08-18"),
    "kimi-k3": ("Kimi K3", "Moonshot", "2026-07-16"),
    "deepseek-v4.1-flash": ("DeepSeek V4.1 Flash", "DeepSeek", "2026-09-10"),
    "mistral-large-4-0": ("Mistral Large 4", "Mistral", "2026-10-06"),
    "qwen3.8-flash": ("Qwen3.8 Flash", "Alibaba", "2026-08-26"),
    "gemma-4-26b-a4b-it": ("Gemma 4 26B A4B", "Google", "2026-04-03"),
}

# eii benchmark entry -> the site's card and its page copy, for a general
# reader. The site is public: describe what 0 and 100 mean in words, never
# the bounds' values or the index weights.
#   blurb     what an episode is ("How it works")
#   measures  the capability under test (first question)
#   scoring   how the benchmark's own result becomes 0-100
#   original  results in the benchmark's own units, and what differs from it
#   raw       one model's result in those units, for the bar chart's hover
#   refs      reference lines on the bar chart, on the 0-100 scale
# Prose rules: no em dashes, no adverbs, active voice (stop-slop).


def money(v: float, sign: str = "$") -> str:
    return ("−" if v < 0 else "") + f"{sign}{abs(v):,.0f}"


def multiple(log10x: float) -> str:
    if log10x <= -4:
        return "bankrupt"
    x = 10 ** log10x
    return f"{x:.1f}×" if x >= 1 else f"{x:.2f}×"


BENCHES = {
    "terms-bilateral": {
        "bench": "terms-bench",
        "title": "TERMS-Bench",
        "question": "Can the agent negotiate a good price?",
        "source": {
            "name": "Stanford",
            "url": "https://terms-bench.github.io/",
            "paper": "https://arxiv.org/abs/2605.13909",
        },
        "blurb": (
            "The agent haggles over a price with a scripted buyer or seller and "
            "never learns how far the other side would go. Some counterparts "
            "say little, some bluff, some play hardball. In some markets no good "
            "deal exists, and the right move is to walk away. Each model plays "
            "the paper's full set of 1,800 negotiations."
        ),
        "measures": (
            "How much of the possible gain from a deal the agent keeps for "
            "itself, and whether it knows when to walk away. A bad deal counts "
            "against it."
        ),
        "scoring": (
            "The paper measures the share of the possible gain the agent "
            "keeps, from 0 to 1. We turn that into a 0-100 score. 0 matches a "
            "simple scripted negotiator that gives ground at a fixed pace. 100 "
            "means every possible deal closed at the agent's best price."
        ),
        "original": (
            "The paper reports the raw share. On that scale GPT-6 Astra and "
            "Claude Opus 5.5 both kept 72% of the possible gain, and MiniMax M3 "
            "47%. Our score starts from the scripted negotiator instead of from "
            "zero, so it shows how much better than that baseline each model "
            "bargains. The negotiations and model settings follow the paper."
        ),
        "raw": lambda e: f"{e['raw']['mean']:.0%}",
        "raw_label": "Share of the gain kept",
    },
    "ecommerce-bench": {
        "bench": "e-commerce-bench",
        "title": "E-Commerce Bench",
        "question": "Can the agent run an online store for a year?",
        "source": {
            "name": "Qwen",
            "url": "https://github.com/QwenLM/E-CommerceBench",
            "paper": "https://arxiv.org/abs/2608.30730",
        },
        "blurb": (
            "The agent gets ¥100,000 and one simulated year to run up to four "
            "online shops. It picks products, haggles with suppliers (some of "
            "them scammers), sets prices, ships orders and handles returns. "
            "Every model faces the same market and plays the year three times."
        ),
        "measures": (
            "Running a business over a long stretch: thousands of decisions, "
            "cash that can run out, and suppliers who try to cheat."
        ),
        "scoring": (
            "The paper measures how many times over the agent multiplied its "
            "starting money. We turn that into a 0-100 score on a log scale, "
            "where each tenfold gain adds the same number of points. 0 matches "
            "an agent that opens one shop and does nothing else, and going "
            "bankrupt also scores 0. 100 is a return far beyond any model's."
        ),
        "original": (
            "In the paper's terms, GPT-6 Astra multiplied its money between 16 "
            "and 24 times in its three years, and Claude Opus 5.5 between 10 "
            "and 15 times. Mistral Large 4 and MiniMax M3 went bankrupt every "
            "time. The log scale stops one huge year from hiding two "
            "bankruptcies. We ran three years per model, where the paper runs "
            "five."
        ),
        "raw": lambda e: ", ".join(multiple(c["raw"]) for c in e["cells"]),
        "raw_label": "Money multiplied, each year",
    },
    "econevals-pricing": {
        "bench": "econevals",
        "title": "EconEvals",
        "question": "Can the agent learn to price in a market it can't see?",
        "source": {
            "name": "Fish et al.",
            "url": "https://github.com/sara-fish/econ-evals-paper",
            "paper": "https://arxiv.org/abs/2503.18825",
        },
        "blurb": (
            "The agent prices ten products for 100 rounds. It never sees what "
            "customers will pay, and their tastes keep shifting. It has its own "
            "past prices, sales and profits to learn from, plus notes it writes "
            "to itself. Each model plays four different markets."
        ),
        "measures": (
            "Learning a market from experience, and adjusting when that "
            "market changes."
        ),
        "scoring": (
            "The paper measures profit in the second half of the game as a "
            "share of the best profit possible. We turn that into a 0-100 "
            "score. 0 matches a simple pricing rule that ignores the data. 100 "
            "means the best possible prices in every round."
        ),
        "original": (
            "In the paper's terms, Claude Opus 5.5 earned 87% of the best "
            "possible profit and DeepSeek V4.1 Flash 52%. The simple rule earns "
            "a large share without learning anything, so raw shares make the "
            "field look closer than it is. Our score shows how far each model "
            "gets beyond that rule. We use the paper's hardest setting and its "
            "model settings."
        ),
        "raw": lambda e: f"{e['raw']['mean']:.0%}",
        "raw_label": "Share of the best profit",
    },
    "auction-bench": {
        "bench": "auction-bench",
        "title": "Auction Bench",
        "question": "Can the agent bid well against other bidders?",
        "source": {"name": "Multiscalar"},
        "blurb": (
            "Six items go up for auction at once, and bidding closes after 15 "
            "minutes of real time. The agent bids against four scripted rivals "
            "with a £1,000 budget and pays a small fee for every bid. Nobody "
            "can chat. Each model plays five auctions, and in each one the "
            "items are worth different amounts to each bidder."
        ),
        "measures": (
            "Knowing what things are worth and bidding with discipline: "
            "winning items for less than their value, spreading the budget, "
            "and leaving bidding wars that lose money."
        ),
        "scoring": (
            "The raw result is the agent's profit: what the items it won are "
            "worth to it, minus what it paid and the fees. We compare it with "
            "what a bidder earns in the same auction by bidding exactly what "
            "each item is worth to it. 0 means no profit, and a loss also "
            "scores 0. 100 means matching that bidder; doing better still "
            "scores 100."
        ),
        "original": (
            "We built Auction Bench. In pounds, DeepSeek V4.1 Flash made £152 "
            "per auction on average and Claude Opus 5.5 £144. Comparing each "
            "profit with that bidder's puts auctions with bigger and smaller "
            "prizes on one scale."
        ),
        "raw": lambda e: money(e["raw"]["mean"], "£"),
        "raw_label": "Average profit per auction",
    },
    "coffeebench": {
        "bench": "coffeebench",
        "title": "CoffeeBench",
        "question": "Can the agent run a business inside a supply chain?",
        "source": {
            "name": "Sakana AI",
            "url": "https://github.com/SakanaAI/CoffeeBench",
            "paper": "https://arxiv.org/abs/2606.16613",
        },
        "blurb": (
            "The agent runs a coffee roaster for 90 days in a supply chain of "
            "six companies. It buys beans from farmers, sells to shops, and "
            "trades, chats and invoices with the five other companies, which "
            "Claude Sonnet 4.6 runs. Each model plays three times."
        ),
        "measures": (
            "Running a business that depends on other businesses: buying, "
            "pricing, agreeing terms and getting paid."
        ),
        "scoring": (
            "The paper measures net income in dollars. We turn that into a "
            "0-100 score. 0 matches a roaster that does nothing and loses money "
            "to running costs. 100 is the paper's estimate of what a roaster "
            "could earn."
        ),
        "original": (
            "In dollars, Claude Opus 5.5 made $3,456 on average and GPT-6 Astra "
            "$2,759, while MiMo V2.6 Pro and Gemma 4 26B A4B lost money. "
            "GPT-5.5, the best model in the paper, made $3,109, about 22 on our "
            "scale. Every model sits far below 100, so this benchmark has "
            "plenty of room left. We use the paper's settings."
        ),
        "raw": lambda e: money(e["raw"]["mean"]),
        "raw_label": "Average net income",
        "refs": [{"label": "GPT-5.5 in the paper", "value": 22.1}],
    },
    "treasury-bench": {
        "bench": "treasury-bench",
        "title": "Treasury-Bench",
        "question": "Can the agent manage a company's cash?",
        "source": {"name": "Multiscalar"},
        "blurb": (
            "The agent runs a company's cash for one year, replayed from real "
            "2025 market data. It starts with $100,000 and must pay 57 bills, "
            "worth $91,790 in total, on time through bank transfers. Between "
            "bills it can lend spare cash for interest, or trade, at that "
            "year's real rates and prices. Every model gets the same year and "
            "plays it three times."
        ),
        "measures": (
            "Paying what the company owes before chasing returns: every bill "
            "on time, money moved through slow and costly channels, and spare "
            "cash put to work without risking the bills."
        ),
        "scoring": (
            "The raw result is what the company is worth at the end of the "
            "year. We turn that into a 0-100 score. 0 matches a treasurer that "
            "pays every bill on time and does nothing else. 100 is the best a "
            "treasurer could do by lending spare cash with perfect hindsight. "
            "Paying bills late costs penalties and scores 0."
        ),
        "original": (
            "We built Treasury-Bench. After paying the bills, GLM-5.3 ended the "
            "year with $9,760, and Gemma 4 26B A4B with −$19,057 after late "
            "and unpaid bills. Starting the scale at the punctual treasurer "
            "separates the models that only pay their bills from those that "
            "also make the cash work."
        ),
        "raw": lambda e: money(e["raw"]["mean"] / 100),
        "raw_label": "Company value at year end",
        "refs": [{"label": "Careful scripted treasurer", "value": 74.7}],
    },
}


def score(entry: dict) -> float:
    """The benchmark's index score: the mean of its clipped episode scores."""
    contributions = list(entry["contributions"].values())
    return contributions[0]["score"]


def bound(b) -> str:
    """A design bound in index.json's spelling, numbers compared by value."""
    if isinstance(b, dict):
        (kind, ref), = b.items()
        return f"agent {ref}" if kind == "agent" else f"metadata.{ref}"
    return f"{float(b):.6g}"


def same_bound(design, run: str) -> bool:
    try:
        return bound(design) == f"{float(run):.6g}"
    except ValueError:
        return bound(design) == run


def export_dimensions(idx: dict, design: dict, run: str, snapshot: str) -> None:
    """Rescore the run under the dimension design: data/evals/index.json."""
    run_bounds = {c["benchmark"]: c for d in idx["dimensions"].values() for c in d["contributions"]}
    weights: dict[str, dict[str, float]] = {d: {} for d in design["dimensions"]}
    for bench, entry in design["benchmarks"].items():
        if bench not in run_bounds:
            raise SystemExit(f"{bench} is in the design but not in {run}")
        have = run_bounds[bench]
        for c in entry["contributes"]:
            if (c["metric"] != have["metric"] or not same_bound(c["floor"], have["floor"])
                    or not same_bound(c["ceiling"], have["ceiling"])):
                raise SystemExit(
                    f"{bench} -> {c['dimension']}: metric/floor/ceiling differ from "
                    f"{run}, so its score can't be reused; rerun the index under the design")
            weights[c["dimension"]][bench] = c.get("weight", 1)

    dims = []
    for i, (key, d) in enumerate(design["dimensions"].items()):
        code, _, rest = d["description"].partition(". ")
        name, _, info = rest.partition(": ")
        dims.append({"key": key, "code": code, "name": name, "info": info})
    dim_weight = [design["dimensions"][d["key"]].get("weight", 1) for d in dims]
    total = sum(dim_weight)

    models = []
    for model_key, m in idx["models"].items():
        name, _, released = MODELS[model_key]
        bench = {b: score(m["benchmarks"][b]) for b in design["benchmarks"]}
        scores = [sum(w * bench[b] for b, w in weights[d["key"]].items())
                  / sum(weights[d["key"]].values()) for d in dims]
        overall = sum(w * s for w, s in zip(dim_weight, scores)) / total
        models.append({
            "name": name,
            "model_id": model_key,
            "overall": round(overall, 1),
            "dimensions": [round(s, 1) for s in scores],
            "cost_usd": round(m["cost_usd"], 2),
            "released": released,
        })
    models.sort(key=lambda m: (-m["overall"], m["name"]))
    data = {
        "snapshot": snapshot,
        "dimensions": dims,
        "models": models,
    }
    path = OUT / "index.json"
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"{path.relative_to(OUT.parent.parent)}: {len(models)} models, "
          f"leader {models[0]['name']} {models[0]['overall']}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("index_json", type=Path)
    ap.add_argument("--snapshot", help="date shown as 'Updated' (default: computed_at)")
    ap.add_argument("--dimensions", type=Path, default=DESIGN,
                    help="dimension design (default: ../eii/index/eii-dimensions.yaml)")
    args = ap.parse_args()

    idx = json.loads(args.index_json.read_text())
    run = f"{idx['suite']}@{idx['version']}"
    snapshot = args.snapshot or dt.datetime.fromtimestamp(
        idx["computed_at"], dt.timezone.utc
    ).strftime("%Y-%m-%d")

    design = yaml.safe_load(args.dimensions.read_text())
    dim_names = {k: d["description"].partition(". ")[2].partition(":")[0]
                 for k, d in design["dimensions"].items()}

    for key, card in BENCHES.items():
        if key not in idx["benchmarks"]:
            raise SystemExit(f"{key} is not in {run}")
        models = []
        for model_key, m in idx["models"].items():
            if model_key not in MODELS:
                raise SystemExit(f"no display name for {model_key}: add it to MODELS")
            name, provider, _ = MODELS[model_key]
            models.append({
                "name": name,
                "provider": provider,
                "model_id": model_key,
                "scores": {"index_score": round(score(m["benchmarks"][key]), 1)},
                "raw": card["raw"](m["benchmarks"][key]),
            })
        models.sort(key=lambda m: (-m["scores"]["index_score"], m["name"]))
        data = {
            "bench": card["bench"],
            "title": card["title"],
            "question": card["question"],
            "blurb": card["blurb"],
            "footnote": (
                "Scores on the Economic Intelligence Index's 0-100 scale, "
                "rescaled from the benchmark's own results. The questions "
                "below explain the scale."
            ),
            "notes": {k: card[k] for k in ("measures", "scoring", "original")},
            "rawLabel": card["raw_label"],
            "refs": card.get("refs", []),
            # The capabilities it feeds, the one it counts most toward
            # first. Names only: the site publishes no weights.
            "feeds": [
                dim_names[c["dimension"]]
                for c in sorted(design["benchmarks"][key]["contributes"],
                                key=lambda c: -c.get("weight", 1))
            ],
            "defaultMetric": "index_score",
            "metrics": [{
                "id": "index_score",
                "label": "Index score (0-100)",
                "unit": "score",
                "higherIsBetter": True,
            }],
            "models": models,
            "source": {**card["source"], "snapshot": snapshot, "index": True},
        }
        path = OUT / f"{card['bench']}.json"
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
        print(f"{path.relative_to(OUT.parent.parent)}: {len(models)} models, "
              f"leader {models[0]['name']} {models[0]['scores']['index_score']}")

    export_dimensions(idx, design, run, snapshot)


if __name__ == "__main__":
    main()
