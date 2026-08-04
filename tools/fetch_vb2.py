#!/usr/bin/env python3
"""Regenerate evals/data/vending-bench-2.json from Andon Labs' public VB2 page.

Usage: python3 tools/fetch_vb2.py [--html path/to/saved.html]
Numbers are Andon Labs' published results, displayed with attribution.
"""
import argparse
import datetime
import html
import json
import pathlib
import re
import urllib.request

URL = "https://andonlabs.com/evals/vending-bench-2"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
OUT = pathlib.Path(__file__).resolve().parent.parent / "evals" / "data" / "vending-bench-2.json"

ROW_RE = re.compile(
    r'alt="(?P<name>[^"]+)"[^>]*/>\s*(?P=name)?.*?'
    r'money-balance-\w+[^>]*>\$(?P<worth>[\d,]+(?:\.\d+)?)'
    r'(?:.*?±\s*\$(?P<stderr>[\d,]+))?',
    re.S,
)


def parse(src: str):
    models, seen = [], set()
    # split into table rows so the lazy regex cannot bleed across rows
    for chunk in src.split("<tr")[1:]:
        m = ROW_RE.search(chunk)
        if not m or m.group("name") in seen:
            continue
        seen.add(m.group("name"))
        entry = {
            "name": html.unescape(m.group("name")),
            "scores": {"net_worth": float(m.group("worth").replace(",", ""))},
        }
        if m.group("stderr"):
            entry["stderr"] = float(m.group("stderr").replace(",", ""))
        models.append(entry)
    return models


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--html", help="parse a saved HTML file instead of fetching")
    args = ap.parse_args()
    if args.html:
        src = pathlib.Path(args.html).read_text()
    else:
        req = urllib.request.Request(URL, headers={"User-Agent": UA})
        src = urllib.request.urlopen(req).read().decode()

    models = parse(src)
    assert len(models) >= 5, f"parsed only {len(models)} rows; page layout changed?"
    models.sort(key=lambda m: -m["scores"]["net_worth"])

    data = {
        "bench": "vending-bench-2",
        "title": "Vending-Bench 2",
        "question": "Can the agent run a business over a long horizon?",
        "source": {
            "name": "Andon Labs",
            "url": URL,
            "snapshot": datetime.date.today().isoformat(),
        },
        "blurb": (
            "Agents manage a simulated vending-machine business over a year-long horizon: "
            "ordering stock, setting prices, paying fees. Score is final net worth. "
            "Results by Andon Labs, displayed with attribution."
        ),
        "metrics": [
            {"id": "net_worth", "label": "Net worth", "unit": "$", "higherIsBetter": True}
        ],
        "defaultMetric": "net_worth",
        "models": models,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2) + "\n")
    print(f"wrote {OUT} with {len(models)} models")


if __name__ == "__main__":
    main()
