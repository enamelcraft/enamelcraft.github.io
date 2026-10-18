#!/usr/bin/env python3
"""Legacy helper: strip site-added mattes from old img/case-*.jpg files.

Case study and treatment photos now live under img/our-work/ as provided—
do not run processing on those files. This script is only kept if old JPGs
reappear in img/.
"""
from pathlib import Path

IMG = Path(__file__).resolve().parent.parent / "img"

PAIRS = []


def main():
    if not PAIRS:
        print("No img/case-*.jpg pairs configured. Use img/our-work/ instead.")
        return


if __name__ == "__main__":
    main()
