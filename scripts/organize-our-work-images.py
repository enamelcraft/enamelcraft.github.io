#!/usr/bin/env python3
"""Copy img/our-work uploads to stable filenames (does not modify pixels)."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent / "img" / "our-work"

# WhatsApp originals → canonical names used by the site
COPY_MAP = {
    "case-study-1.jpeg": "case-wisdom-operculectomy.jpeg",
    "WhatsApp Image 2026-10-02 at 23.48.40.jpeg": "case-rct-lower-molar.jpeg",
    "WhatsApp Image 2026-10-02 at 23.50.48.jpeg": "case-fluorosis.jpeg",
    "WhatsApp Image 2026-10-02 at 23.50.48 (5).jpeg": "case-diastema.jpeg",
    "WhatsApp Image 2026-10-02 at 23.50.49.jpeg": "case-fracture-crown.jpeg",
    "WhatsApp Image 2026-10-02 at 23.50.48 (1).jpeg": "treatment-smile-refresh.jpeg",
    "WhatsApp Image 2026-10-02 at 23.50.48 (4).jpeg": "treatment-teeth-whitening.jpeg",
    "WhatsApp Image 2026-10-02 at 23.50.48 (6).jpeg": "treatment-aligners-smile.jpeg",
    "WhatsApp Image 2026-10-02 at 23.50.48 (7).jpeg": "treatment-crowns-veneers.jpeg",
}


def main():
    for src_name, dest_name in COPY_MAP.items():
        src = ROOT / src_name
        dest = ROOT / dest_name
        if not src.exists():
            print("missing source", src_name)
            continue
        shutil.copy2(src, dest)
        print("wrote", dest_name)


if __name__ == "__main__":
    main()
