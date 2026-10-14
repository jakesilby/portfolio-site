# Og cards

Templates and the render script for the 1200x630 share images in `/images/og/`. Not part of the site: `.vercelignore` keeps `/scripts/` out of the deploy.

- `case.html`: the left 700px text panel of a case study card ("Jake Silby", the H1 in Cormorant Garamond, the work grid outcome line in Atkinson Hyperlegible Next). Title and description come in as `?t=` and `?d=`.
- `site.html`: `site.png`, the homepage hero sentence with its highlight marks.
- `render.py`: renders both and writes the PNGs.

Both templates read `/tokens.css` and `/components/fonts.css`, so a font or color change in those files carries over on the next render.

## Re-render

Needs Google Chrome in `/Applications` and Python 3 with Pillow (`pip install pillow`). From the repo root:

```bash
python3 scripts/og/render.py
```

The script serves the repo on a free local port, so no dev server is needed. Case study cards keep their right-hand poster panel: the script copies it from the existing PNG and only replaces the left 700px. To change a card's title or description, edit `CASES` in `render.py`. Keep it in step with the case study H1 and `components/work-grid.js`.

A new case study needs a starting PNG with its poster in the right 500px (from x=700) before the script can fill in its left panel.
