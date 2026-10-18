# Image folder map

| Folder | Used for | How to update |
|--------|----------|----------------|
| `hero-img/` | Homepage hero carousel **only** | Add/remove files, then run `python3 scripts/sync-hero-manifest.py` |
| `gallery/` | Homepage & About marquee + lightbox | Add/remove files, then run `python3 scripts/sync-gallery-manifest.py` |
| `our-work/` | Case study photos | Update `src` in `our-work.html` |
| `services/` | Service thumbnails, offers, Google logo SVG | Reference in HTML |
| `dr-girija/` | Doctor & clinic portraits | `dr-2.png` (home/about), `dr-g-3.png` (online consult) |
| `blogs/` | Blog index cards | `blogs.html` |
| `reviews/` | Google review avatars | `index.html` |
| `logo-img/` | Logo, favicon | Nav + `<link rel="icon">` |

**Sync both hero and gallery after folder changes:**

```bash
python3 scripts/sync-image-manifests.py
```

Hero images must live only in `hero-img/`. Gallery images must live only in `gallery/` (even if filenames match—keep separate copies if needed).
