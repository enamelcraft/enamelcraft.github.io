#!/usr/bin/env python3
"""
Rebuild the gallery[] list in js/ec-images.js from files in img/gallery/.
Skips .DS_Store and non-image files. Run after adding/removing gallery photos.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GALLERY_DIR = ROOT / "img" / "gallery"
JS_FILE = ROOT / "js" / "ec-images.js"
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


def alt_from_name(name: str) -> str:
    base = Path(name).stem.replace("-", " ").replace("_", " ")
    if base.lower().startswith("ecgallary"):
        return f"Enamel Craft Dental Studio — clinic photo {base[-2:]}"
    return f"Enamel Craft Dental Studio, Baner — {base}"


def main() -> None:
    files = sorted(
        f.name
        for f in GALLERY_DIR.iterdir()
        if f.is_file() and f.suffix.lower() in EXTS
    )
    entries = []
    for name in files:
        entries.append(
            f'    {{ src: GALLERY_DIR + "{name}", alt: "{alt_from_name(name)}" }},'
        )
    block = "  var gallery = [\n" + "\n".join(entries) + "\n  ];"

    text = JS_FILE.read_text(encoding="utf-8")
    new_text, n = re.subn(
        r"  var gallery = \[.*?\n  \];",
        block,
        text,
        count=1,
        flags=re.DOTALL,
    )
    if n != 1:
        raise SystemExit("Could not find gallery array in ec-images.js")
    JS_FILE.write_text(new_text, encoding="utf-8")
    print(f"Updated gallery manifest with {len(files)} images.")


if __name__ == "__main__":
    main()
