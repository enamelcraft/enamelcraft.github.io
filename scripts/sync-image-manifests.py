#!/usr/bin/env python3
"""Sync hero + gallery arrays in js/ec-images.js from img folders."""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def main() -> None:
    for name in ("sync-hero-manifest.py", "sync-gallery-manifest.py"):
        r = subprocess.run([sys.executable, str(ROOT / name)], check=False)
        if r.returncode != 0:
            raise SystemExit(r.returncode)


if __name__ == "__main__":
    main()
