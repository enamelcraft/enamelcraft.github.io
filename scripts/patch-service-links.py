#!/usr/bin/env python3
"""Point treatment links to on-site service.html anchors."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

TITLE_TO_ID = {
    "Root canal treatment": "svc-root-canal",
    "Dental implants": "svc-implants",
    "Dentures": "svc-dentures",
    "Invisible aligners": "svc-aligners",
    "Dental bridges": "svc-bridges",
    "Teeth whitening": "svc-whitening",
    "Dental scaling": "svc-scaling",
    "Composite restoration": "svc-composite",
    "Wisdom tooth extraction": "svc-wisdom",
    "Veneers": "svc-veneers",
    "Zirconia crowns": "svc-crowns",
    "Pedodontic treatment": "svc-pediatric",
}

FOOTER_REPLACEMENTS = [
    (
        'href="https://blog.enamelcraft.in/root-canal-therapy-baner-wakad-aundh-pune/"',
        'href="service.html#svc-root-canal"',
    ),
    (
        'href="https://blog.enamelcraft.in/dental-implants/"',
        'href="service.html#svc-implants"',
    ),
    (
        'href="https://blog.enamelcraft.in/cosmetic-dentistry-baner"',
        'href="service.html#svc-whitening"',
    ),
    (
        'href="https://blog.enamelcraft.in/dental-cleanings-baner-wakad-aundh-pune-pancard-club-road/"',
        'href="service.html#svc-scaling"',
    ),
]


def fix_service_card(block: str) -> str:
    m = re.search(r"ec-service-detail__title">([^<]+)<", block)
    if not m:
        return block
    sid = TITLE_TO_ID.get(m.group(1).strip())
    if not sid:
        return block
    block = re.sub(
        r'<a class="ec-service-detail"[^>]*>',
        f'<a class="ec-service-detail" id="{sid}" href="service.html#{sid}">',
        block,
        count=1,
    )
    return block.replace(' target="_blank" rel="noopener noreferrer"', "")


def patch_file(path: Path) -> None:
    if path.name == "blogs.html":
        return
    text = path.read_text(encoding="utf-8")
    for old, rep in FOOTER_REPLACEMENTS:
        text = text.replace(old, rep)
    if "ec-service-detail" in text:
        text = re.sub(
            r'<a class="ec-service-detail"[\s\S]*?</a>',
            lambda m: fix_service_card(m.group(0)),
            text,
        )
    path.write_text(text, encoding="utf-8")


def main() -> None:
    for p in sorted(ROOT.glob("*.html")):
        patch_file(p)
        print(p.name)


if __name__ == "__main__":
    main()
