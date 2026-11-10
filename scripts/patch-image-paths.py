#!/usr/bin/env python3
"""Normalize image paths after img/ folder reorganization."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    ('src="img/ecGallary', 'src="img/gallery/ecGallary'),
    ('href="img/logo.png"', 'href="img/logo-img/logo.png"'),
    ('src="img/enamel-craft-dental-studio-logo.png"', 'src="img/logo-img/enamel-craft-dental-studio-logo.png"'),
    ('src="img/google-logo.svg"', 'src="img/services/google-logo.svg"'),
    ('src="img/blog-', 'src="img/blogs/blog-'),
    ('src="img/blog-root-canal.jpg"', 'src="img/blogs/blog-root-canal.jpg"'),  # noop if already blogs
    ('src="assets-lib/Headshots/dr-g1.png"', 'src="img/dr-girija/dr-g1.png"'),
    ('src="assets-lib/Headshots/', 'src="img/dr-girija/'),
    ('src="img/dentures-pune.jpg"', 'src="img/services/dentures-pune.jpg"'),
    ('src="img/dental-bridges-pune.jpg"', 'src="img/services/dental-bridges-pune.jpg"'),
    ('src="img/teeth-whitening-baner.jpg"', 'src="img/services/teeth-whitening-baner.jpg"'),
    ('src="img/dental-scaling-polishing-pune.jpg"', 'src="img/services/dental-scaling-polishing-pune.jpg"'),
    ('src="img/veneers-smile-makeover-baner.jpg"', 'src="img/services/veneers-smile-makeover-baner.jpg"'),
    ('src="img/pediatric-dentistry-baner.jpg"', 'src="img/services/pediatric-dentistry-baner.jpg"'),
    ('src="img/before.jpg"', 'src="img/our-work/before.jpg"'),
    ('src="img/after.jpg"', 'src="img/our-work/after.jpg"'),
    ('<i class="fas fa-bars"', '<i class="bi bi-list"'),
]

FONT_AWESOME_LINK = '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">\n'

EC_IMAGES_SCRIPT = '<script src="js/ec-images.js" defer></script>\n'

def patch_file(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    orig = text
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = text.replace(FONT_AWESOME_LINK, "")
    if "js/site.js" in text and "js/ec-images.js" not in text:
        text = text.replace(
            '<script src="js/site.js" defer></script>',
            EC_IMAGES_SCRIPT + '<script src="js/site.js" defer></script>',
        )
    if text != orig:
        path.write_text(text, encoding="utf-8")
        print("patched", path.name)


def main() -> None:
    for path in ROOT.glob("*.html"):
        patch_file(path)


if __name__ == "__main__":
    main()
