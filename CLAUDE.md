# CLAUDE.md — Portfolio Site

Read this (along with `tokens.css`) at the start of every Claude Code session on this project before generating or editing anything. Keep it updated as conventions solidify — this file is what keeps output consistent across sessions, weeks apart, on a project with no other reviewer but you.

## What this site is

A design-systems/design-to-code portfolio: a homepage plus four case studies (Pulse Design System, Global Inline Drawer, Pre-Infusion Assessment Flow, one translated healthcare case study). The site itself is part of the pitch — it needs to be clean, code-forward, and not contradict the story the case studies tell. It does not need heavy interactivity or a complex framework.

## Stack

- Static site — plain HTML/CSS/light JS, or Astro if template reuse across 5 pages gets repetitive. No client-side framework needed; nothing here requires app-level state.
- No CSS framework/utility library required — hand-written CSS against `tokens.css` is fine and keeps the code itself readable as a portfolio artifact.
- Deployed via Vercel (or Netlify) connected to this git repo, auto-deploy on push to `main`, preview deploy on every branch/PR.

## Source of truth

- `tokens.css` — the ONLY place color, spacing, type scale, and radius values live. Three-tier taxonomy: primitive → semantic alias → mapped, same pattern as the Pulse token architecture. Never write a raw hex code, px value, or font-size directly in a page or component — reference a token.
- If a value you need doesn't exist as a token yet, add it to `tokens.css` first, then use it. Don't improvise a one-off value inline.

## File structure

```
/tokens.css              -- single source of styling values
/components/             -- shared chrome: nav, footer, case-study template, any repeated UI
/content/case-studies/   -- one file per case study (Markdown/MDX), not hand-coded pages
/pages/ (or /src/pages/) -- homepage + thin page shells that render templates + content
```

Content and layout stay separate. A case study is a content file rendered through the shared template — updating a case study later means editing the content file, not touching component code. Adding case study #5 means adding a content file, not building a new page from scratch.

**As actually built (confirmed 2026-10-08):** there is no markdown-rendering template yet. Each case study is a root-level hand-coded page (`onepulse-connect.html`, `pre-infusion-assessment-flow.html`, `carbon-token-audit.html`, ...) assembled from shared classes in `components/components.css` and the shared scripts (`case-header.js`, `footer.js`, `lightbox.js`, `clip-video.js`). The `.md` in `/content/case-studies/` is the canonical copy: edit it first, then sync the page to it verbatim. Put a comment near the top of the page that names its content file. Working notes in a content file (a "Notes for you" section after a closing `---`, draft-status lines, `[VISUAL]` notes) are never rendered.

## Case study page conventions

- **Page skeleton:** `case-header.js` → `.case-title-block` → (optional `.case-hero`, `.at-a-glance`) → `.case-section`s alternating `--alt` (first section is `--alt`) → `.case-footer-nav` → `footer.js`, `lightbox.js`. `<body data-page="case-study" id="top">`.
- **Title block eyebrow:** "Case study" for OPC work, "Personal project" for personal work. If the content file has no description, meta line or stats, leave them out rather than writing new copy.
- **Homepage listing:** add a row to the `projectRows` array in `components/project-row.js`. Personal projects use `type: 'Personal project'` as the badge, in the same list (decided 2026-10-08, no separate section). Rows take either `video` or a static `image`.
- **Images:** live flat in `/images/`, named `<project-prefix>-<subject>.<ext>` (e.g. `carbon-classifier-flow.png`, `ds_tabgroup.webp`). An optional `/images/large/` copy serves as the lightbox source when the inline file is downsized. Every real image gets its own `case-visual__image--<name>` modifier with `aspect-ratio` set from the file's real pixel dimensions, plus `loading="lazy" data-lightbox-src="<path>" tabindex="0" role="button"` so it opens full size.
- **Screenshot vs diagram:** screenshots sit in a `.case-visual` tray (add `--transparent` if the capture has its own light background). Diagrams drawn in the site's own visual language get no tray: use `.case-diagram` (or the older page-local equivalents) directly.
- **Captions:** wrap image and caption in `.case-figure`, with `<figcaption class="case-figure__caption type-meta">`. Alt text and captions come verbatim from the content file.
- **Small text in screenshots** (DevTools, terminal, dense UI): use `.case-figure--wide`, which breaks out to `--layout-case-wide-width` while its caption stays at the text-column width. It still opens in the lightbox.
- **Code:** multi-line or standalone snippets use `<pre class="case-code type-code"><code>…</code></pre>`, which scrolls horizontally and never wraps. Inline code in prose and captions uses `<code class="case-code-inline">`.
- **Subsections:** `<h3 class="case-section__subheading type-subsection-heading">` inside a `.case-section`.
- **Lists:** `.case-rules-list` / `.case-rules-list__item type-body`, a real `<ul>`.

## Component conventions

- BEM-style class naming (matches the Pulse library conventions).
- Every shared component (nav, footer, case-study template, any repeated card/section pattern) lives in `/components/` and is used everywhere it appears — never copy-pasted and modified per page.
- Responsive by default — build mobile-first or check mobile at the same time as desktop, not as a separate pass at the end.
- **ProjectRow hover state:** background swaps to `--bg-inverse`; text stays `--text-primary` (does not swap to an inverse text color). `--bg-inverse` was deliberately repointed from a dark color to a light tint in a later Figma revision — this is that revision's intended behavior, not an unfinished implementation. Driven by the same tokens, not a separate hardcoded style.

## Case study visuals: static vs. clip

Every `[VISUAL]` note in a case study draft carries a tag: STATIC, CLIP, or LIVE EMBED. Build each according to its tag, don't default everything to a screenshot.

- **STATIC** — a plain image (PNG/WebP). Use for states a still frame communicates fully: empty/populated comparisons, reference diagrams, form fields, anything where the claim is about *what something looks like* rather than *what happens when you act on it*. Also the right call for anything sourced from a former employer's live production app rather than your own coded prototype — those are screenshots you already captured, not something to go record new footage of.
- **CLIP** — a short (3-5 second), muted, looping video for a genuine interaction: a row moving between two zones, an alert surfacing on trigger, a hover/selected/disabled state that can't be honestly faked as a still frame. Only reach for this when the case study text makes a claim about *behavior* that a screenshot can't prove. Encode as webm or mp4, `autoplay muted loop playsinline`, no controls, and always set a static `poster` frame as the fallback for `prefers-reduced-motion`. Never use animated GIF, same visual result at a much larger file size. Hero visuals default to static, pulling a still frame rather than autoplaying, even when a clip exists for that content — most section clips are too busy or too specific to a single claim to sit at the top of the page. Autoplay a clip in the hero only when it's been specifically cut for that placement: short, calm, no camera movement/zoom, and confirmed to loop cleanly with no visible seam. That's a deliberate exception per case study, not a default — treat OnePulse Connect's site-overview hero clip as the reference example, not a precedent that overrides the static default elsewhere.
- **LIVE EMBED** — a real, running piece of the site itself (e.g. the token-resolution diagram in Pulse's Token Architecture section), not a capture of anything. Build it as an actual coded element once the relevant tokens/components are finalized.

## Working from Figma

- Pull design context per section/frame, not the whole file at once — one section, build it, verify it, move to the next.
- Pull actual variable values via the Figma variable defs, don't eyeball colors/spacing from a screenshot.
- After building a section, compare a screenshot of the live build against the Figma screenshot before moving on.

## Git workflow

- Never commit directly to `main`.
- One branch per case study or per meaningful change (`case-study/pulse`, `fix/homepage-nav-spacing`).
- Push → preview deploy → visually check the preview → merge to `main` only after it looks right.
- Commit messages describe what changed and why, not "update files."

## "Done" checklist (run before merging any page/section)

- [ ] No raw hex/px values outside `tokens.css`
- [ ] Matches Figma at the section level (screenshot-compared)
- [ ] Responsive at mobile/tablet/desktop
- [ ] Alt text on all images, contrast checked
- [ ] No console errors
- [ ] Shared components used, not duplicated inline

## Open questions to fill in as decided

- Final stack choice (plain static vs. Astro): plain static in practice, as of 2026-10-08 (hand-coded pages + shared components, no build step). A markdown-rendering template is still undecided.
- Hosting provider: Vercel (default recommendation — swap this line if you go with Netlify instead)
- Domain: ___
