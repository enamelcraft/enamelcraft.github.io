#!/usr/bin/env python3
"""Rebuild hero[] in js/ec-images.js from files in img/hero-img/."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HERO_DIR = ROOT / "img" / "hero-img"
JS_FILE = ROOT / "js" / "ec-images.js"
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


def alt_from_name(name: str) -> str:
    base = Path(name).stem.replace("-", " ").replace("_", " ")
    return f"Enamel Craft Dental Studio, Baner — {base}"


def main() -> None:
    files = sorted(
        f.name
        for f in HERO_DIR.iterdir()
        if f.is_file() and f.suffix.lower() in EXTS
    )
    entries = []
    for name in files:
        alt = alt_from_name(name).replace('"', '\\"')
        entries.append(
            f'      {{ src: "img/hero-img/{name}", alt: "{alt}" }},'
        )
    block = "    hero: [\n" + "\n".join(entries) + "\n    ],"

    text = JS_FILE.read_text(encoding="utf-8")
    new_text, n = re.subn(
        r"    hero: \[.*?\n    \],",
        block,
        text,
        count=1,
        flags=re.DOTALL,
    )
    if n != 1:
        raise SystemExit("Could not find hero array in ec-images.js")
    JS_FILE.write_text(new_text, encoding="utf-8")
    print(f"Updated hero manifest with {len(files)} images.")


if __name__ == "__main__":
    main()
