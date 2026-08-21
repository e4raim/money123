#!/usr/bin/env python3
"""Render a client site from template/index.html + configs/<name>.json.

Usage:
    python3 generate.py configs/barbershop-example.json
    python3 generate.py configs/barbershop-example.json --out output/custom.html
"""
import argparse
import json
import sys
from pathlib import Path

from jinja2 import Environment, FileSystemLoader

ROOT = Path(__file__).parent


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("config", help="Path to a client JSON config")
    parser.add_argument("--out", help="Output HTML path (default: output/<config-name>.html)")
    args = parser.parse_args()

    config_path = Path(args.config)
    data = json.loads(config_path.read_text(encoding="utf-8"))

    env = Environment(loader=FileSystemLoader(str(ROOT / "template")))
    template = env.get_template("index.html")
    html = template.render(**data)

    out_path = Path(args.out) if args.out else ROOT / "output" / f"{config_path.stem}.html"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(html, encoding="utf-8")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    sys.exit(main())
