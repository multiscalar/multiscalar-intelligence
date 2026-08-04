#!/usr/bin/env python3
"""Regenerate evals/data/terms-bench.json from Stanford's public TERMS-Bench data.js.

Usage: python3 tools/fetch_terms_bench.py [--js path/to/saved_data.js]
Numbers are Stanford's published results, displayed with attribution.
"""
import argparse
import datetime
import json
import pathlib
import re
import urllib.request

URL = "https://terms-bench.github.io/data.js"
SITE = "https://terms-bench.github.io/"
OUT = pathlib.Path(__file__).resolve().parent.parent / "evals" / "data" / "terms-bench.json"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--js", help="parse a saved data.js instead of fetching")
    args = ap.parse_args()
    src = (
        pathlib.Path(args.js).read_text()
        if args.js
        else urllib.request.urlopen(URL).read().decode()
    )
    raw = json.loads(re.sub(r"^.*?window\.TERMS_DATA\s*=\s*", "", src, flags=re.S).rstrip().rstrip(";"))

    models = []
    for row in raw["rows"]:
        overall = row["regimes"]["overall"]
        models.append(
            {
                "name": row["display"],
                "provider": row.get("provider"),
                "scores": {
                    "se_plus": round(overall["se_plus"] * 100, 1),
                    "agr_plus": round(overall["agr_plus"] * 100, 1),
                },
            }
        )
    models.sort(key=lambda m: -m["scores"]["se_plus"])

    data = {
        "bench": "terms-bench",
        "title": "TERMS-Bench",
        "question": "Can the agent negotiate well?",
        "source": {
            "name": "Stanford",
            "url": SITE,
            "snapshot": datetime.date.today().isoformat(),
            "run": raw.get("run"),
        },
        "blurb": (
            "LLM agents negotiate against a fixed stochastic scripted counterpart across "
            "commerce and bankroll regimes. SE+ is the fraction of feasible surplus captured; "
            "AGR+ the feasible agreement rate. Results by Stanford, displayed with attribution."
        ),
        "metrics": [
            {"id": "se_plus", "label": "SE+ (surplus efficiency)", "unit": "%", "higherIsBetter": True},
            {"id": "agr_plus", "label": "AGR+ (agreement rate)", "unit": "%", "higherIsBetter": True},
        ],
        "defaultMetric": "se_plus",
        "models": models,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2) + "\n")
    print(f"wrote {OUT} with {len(models)} models")


if __name__ == "__main__":
    main()
