#!/usr/bin/env python3
"""Sync main nav + logo path across marketing HTML pages."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

ACTIVE_BY_FILE = {
    "index.html": "home",
    "about.html": "about",
    "service.html": "services",
    "our-work.html": "our-work",
    "contact.html": "contact",
    "blogs.html": "home",
    "online-consultation.html": "home",
    "faq.html": "home",
    "dentist-in-baner.html": "home",
    "offer.html": "home",
    "voice-search.html": "home",
    "yashwin.html": "home",
    "online-consultation-thank-you.html": "home",
}

NAV_ITEMS = [
    ("home", "index.html", "Home"),
    ("about", "about.html", "About"),
    ("services", "service.html", "Services"),
    ("our-work", "our-work.html", "Our Work"),
    ("contact", "contact.html", "Contact"),
    ("blogs", "blogs.html", "Blogs"),
]

WA = (
    'https://wa.me/917666297468?text=Hello,%20Can%20I%20book%20an%20appointment%3F'
)
TEL = "+91-7666297468"


def link_html(key: str, href: str, label: str, active_key: str) -> str:
    cls = ' class="is-active"' if key == active_key else ""
    return f'                <a href="{href}"{cls}>{label}</a>'


def build_nav(active_key: str, collapse_id: str) -> str:
    links = "\n".join(link_html(k, h, l, active_key) for k, h, l in NAV_ITEMS)
    return f"""<header class="ec-header">
    <nav class="ec-nav__inner" aria-label="Main">
        <a class="ec-brand" href="index.html" aria-label="Enamel Craft Dental Studio">
            <img src="img/logo-img/enamel-craft-dental-studio-logo.png" width="200" height="50" alt="Enamel Craft Dental Studio">
        </a>
        <button type="button" class="ec-nav__toggle d-lg-none" data-ec-nav-toggle aria-expanded="false" aria-controls="{collapse_id}" aria-label="Open menu">
            <i class="bi bi-list" aria-hidden="true"></i>
        </button>
        <div class="ec-nav__collapse" id="{collapse_id}" data-ec-nav-collapse>
            <div class="ec-nav__links">
{links}
            </div>
            <div class="ec-nav__actions">
                <a class="ec-nav__phone ec-num d-none d-xl-inline-flex" href="tel:{TEL}">{TEL}</a>
                <a class="ec-btn ec-btn--outline ec-nav__cta-secondary" href="online-consultation.html" title="Video consult · ₹299">Online consult</a>
                <a class="ec-btn ec-btn--primary ec-nav__cta" href="{WA}" target="_blank" rel="noopener noreferrer">Book visit</a>
            </div>
        </div>
    </nav>
</header>"""


def collapse_id_for(path: Path) -> str:
    stem = path.stem.replace("-", "")
    return "ecNav" + stem[:12].title().replace("-", "")


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if '<header class="ec-header">' not in text:
        return False
    active = ACTIVE_BY_FILE.get(path.name, "home")
    cid = collapse_id_for(path)
    new_header = build_nav(active, cid)
    patched, n = re.subn(
        r'<header class="ec-header">.*?</header>',
        new_header,
        text,
        count=1,
        flags=re.DOTALL,
    )
    if n != 1:
        return False
    path.write_text(patched, encoding="utf-8")
    return True


def main() -> None:
    for name in ACTIVE_BY_FILE:
        p = ROOT / name
        if p.exists():
            ok = patch_file(p)
            print(f"{name}: {'ok' if ok else 'skip'}")


if __name__ == "__main__":
    main()
