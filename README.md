# Portfolio Site

Design-systems / design-to-code portfolio. Homepage + four case studies (Pulse Design System, Global Inline Drawer, Pre-Infusion Assessment Flow, one translated healthcare case study).

**Before touching this repo in Claude Code, read `CLAUDE.md` first.** It's the governance doc — stack conventions, file structure, token rules, git workflow, and the visual (STATIC/CLIP/LIVE EMBED) system for case study assets.

## Current state

- `tokens.css` — done. Colors and spacing pulled from Figma's bound variables via the Plugin API; typography documented as composite classes.
- `index.html` — placeholder only, confirms the deploy pipeline works end to end. Not the real homepage build (Phase 1 in the build plan).
- `/components/`, `/content/case-studies/` — empty, staged for the shared template + per-case-study content files described in `CLAUDE.md`.

## Local dev

No build step. Open `index.html` directly in a browser, or serve the folder with any static server, e.g.:

```
npx serve .
```

## Deploy

Connected to Vercel (or Netlify), auto-deploy on push to `main`, preview deploy on every branch/PR. See `CLAUDE.md` → Git workflow.
