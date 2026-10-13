# CLAUDE.md — Portfolio Site

Read this (along with `tokens.css`) at the start of every Claude Code session on this project before generating or editing anything. Keep it updated as conventions solidify — this file is what keeps output consistent across sessions, weeks apart, on a project with no other reviewer but you.

## What this site is

A design-systems/design-to-code portfolio: a homepage plus four case studies (Pulse Design System, Global Inline Drawer, Pre-Infusion Assessment Flow, one translated healthcare case study). The site itself is part of the pitch — it needs to be clean, code-forward, and not contradict the story the case studies tell. It does not need heavy interactivity or a complex framework.

## Design direction (v2, Oct 2026)

The site should read as a quiet, systematic frame around the work. Every visual choice should look like a rule applied consistently, not a one-off.

Layout
- Homepage order: header, hero sentence, credibility lines, two-column work grid, footer. Nothing else.
- No floating hero card, no glow or colored shadows, no decorative gradients. Two exceptions: the hero highlight's watercolor band, and the accent-tinted shadow on the work grid "Read more" pill.
- One content container width and one gutter, used on every page. Columns line up across sections.
- Rules (dividers) are solid hairlines using a border token. No dashed rules.
- Two container widths only: --layout-wide for the header, grid and media, and --layout-measure for reading text. Both are defined in tokens.css.

Typography (three families, fixed jobs)
- Cormorant Garamond 500 (--font-family-display): only the single hero sentence at the top of a page (homepage hero, case study title). Nowhere else.
- Bricolage Grotesque: everything else, including nav, body text, captions, meta, labels, buttons and footer. The brand ("Jake Silby" in the header) is Bricolage 500 16/24 (--type-brand).
- Spline Sans Mono: only literal token names, code, and file names inside case study prose (for example `accent-primary-fg-fill`). Never for labels, meta, nav or captions.
- No italic body text. No all-caps labels. No eyebrow labels above headings.
- EB Garamond and --font-family-serif remain only for legacy classes and are removed by the end of v2.

Color ("Clay + juniper" at faint warmth). All values live in tokens.css as clay / juniper / sand primitives behind these aliases:
- --bg-page #faf9f7. --bg-surface #eeede9 (media wells, code backgrounds). --border-default #e3e2dd (hairlines).
- --text-primary #1f2a26 (14.1:1 on page). --text-muted #5f6a64 (5.4:1).
- --accent #2f5d4e (7.1:1): links, focus rings and --text-link-hover.
- --accent-fill #567a6d (white text on it 4.8:1): the current nav pill and the work grid pill. --accent-fill-hover-subtle #e5e8e5: nav hover.
- --highlight #dae9e1 and --highlight-2 #f0e3c9: the hero highlight only.
- The cosmos red link hover is retired. The cosmos / greenwhite / smaltblue / elm primitives stay until nothing references them.

Motion
- One load animation: the hero highlight draws in once. Hover: nav pills change background; work grid items lift with a 'Read more' pill. Everything else stays still. All motion respects prefers-reduced-motion.
- Product videos and clips also move (see Videos below).
- No scroll-triggered reveals, staggers, blurs or fades on content. Shared chrome (header, footer, work grid, case study chrome) stays as JS-injected components. No content may start hidden and wait for JS or scroll to reveal it. Each page includes a <noscript> block with plain links to Work, About and Email.
- No smooth-scroll libraries, no custom cursors, no parallax. The work grid "Read more" pill follows the cursor inside a hovered item, but the system cursor stays.
- Hero highlight: each `.hero-mark` has a watercolor band behind it (::before) that scales in from the left, 520ms, "complex workflows" at 120ms then "design systems" at 300ms. CSS only, so the marks are fully drawn without JS and under reduced motion.
- Nav pills: the current section is filled with --accent-fill; the others get --accent-fill-hover-subtle on hover, a 150ms background transition.
- Work grid ("Lift + pill"): on mouse hover the media scales to 1.025 over 300ms, the other items dim to .55, and the pill follows the cursor. Pill and dimming only for (hover: hover) and (pointer: fine). Keyboard focus gets the lift and an outline, no pill. Reduced motion keeps the pill and dimming and drops the scale and transitions.
- Other hover and focus feedback (header name, footer links, work grid titles) is a color change only, 150ms ease-out. Every transition is wrapped in prefers-reduced-motion: no-preference. Focus rings stay visible (2px --accent).
- Videos: autoplay muted loop playsinline, with a poster frame. Pause when offscreen (IntersectionObserver). Under prefers-reduced-motion: reduce, don't autoplay and show the poster.

Copy
- Plain, specific, sentence case. No arrows appended to link text. No middle-dot separators.
- Don't overstate Jake's engineering role. He designs systems and directs AI-assisted prototyping, and engineers built production. Exception: the OnePulse Connect token-reference fix is accurate as written. Jake made that fix in code, opened the PR, and an engineer approved it and shipped it. Don't remove or reword it.
- No em dashes in UI copy.
- Headings are sentence case. Proper nouns keep their capitals (OnePulse Connect, Carbon, Figma, Tokens Studio, Claude Code).
- Page titles use the format 'Page name | Jake Silby'. The homepage title is 'Jake Silby | Product designer'.

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

**As actually built (confirmed 2026-10-08):** there is no markdown-rendering template yet. Each case study is a root-level hand-coded page (`onepulse-connect.html`, `pre-infusion-assessment-flow.html`, `carbon-token-audit.html`, ...) assembled from shared classes in `components/components.css` and the shared scripts (`nav.js`, `footer.js`, `lightbox.js`, `clip-video.js`). The `.md` in `/content/case-studies/` is the canonical copy: edit it first, then sync the page to it verbatim. Put a comment near the top of the page that names its content file. Working notes in a content file (a "Notes for you" section after a closing `---`, draft-status lines, `[VISUAL]` notes) are never rendered.

## Case study page conventions

- **Page skeleton:** `nav.js` → `<main class="case-layout">` containing `<header class="case-intro">` and `<div class="case-body">` (optional `.case-hero`, then `.case-section`s) → `.case-footer-nav` → `footer.js`, `lightbox.js`. `<body data-page="case-study" id="top">`. Pages have no `<style>` block: every case study rule, including each image's aspect-ratio modifier, lives in `components/components.css`.
- **Widths:** one column inside `--layout-wide`. Prose (body, lists, captions, intro description) is capped at `--layout-measure`; the title, hero, figures, code blocks and clips fill the column. Sections are separated by spacing and a solid hairline, not alternating background bands.
- **Title block eyebrow:** "Case study" for OPC work, "Personal project" for personal work. If the content file has no description, meta line or stats, leave them out rather than writing new copy.
- **Homepage listing:** add an item to the `workItems` array in `components/work-grid.js` (title, one outcome line, category, year, href; media is decorative here, so no alt text or aria-label). Personal projects use `category: 'Personal project'` in the same grid (decided 2026-10-08, no separate section). Items take either `video` (mp4 source first, poster required) or a static `image`; media fills a 16:10 box edge to edge (object-fit: cover), so export grid media at 16:10. Anything more than 3% off 16:10 should use object-fit: contain on the `--bg-surface` well instead of being cropped. Grid videos are paused offscreen by `components/clip-video.js`, which the homepage loads after the grid.
- **Images:** live flat in `/images/`, named `<project-prefix>-<subject>.<ext>` (e.g. `carbon-classifier-flow.png`, `ds_tabgroup.webp`). An optional `/images/large/` copy serves as the lightbox source when the inline file is downsized. Every real image gets its own `case-visual__image--<name>` (or `case-diagram--<name>`) modifier in components.css, grouped by page, with `aspect-ratio` set from the file's real pixel dimensions, plus `loading="lazy" data-lightbox-src="<path>" tabindex="0" role="button"` so it opens full size.
- **Screenshot vs diagram:** screenshots sit in a `.case-visual` tray (add `--transparent` if the capture has its own light background). Diagrams drawn in the site's own visual language get no tray: use `.case-diagram` (or the older page-local equivalents) directly.
- **Captions:** wrap image and caption in `.case-figure`, with `<figcaption class="case-figure__caption">`. Alt text and captions come verbatim from the content file.
- **Code:** multi-line or standalone snippets use `<pre class="case-code"><code>…</code></pre>`, which scrolls horizontally and never wraps. Inline code in prose and captions uses `<code class="case-code-inline">`.
- **Type:** no `type-*` classes in case-page markup. Each BEM selector sets its own v2 role in CSS, for example `.case-figure__caption { font: var(--type-caption); letter-spacing: var(--type-caption-letter-spacing); }`. type/code has no `font` shorthand, so set its parts individually (see `.case-code-inline`).
- **Subsections:** `<h3 class="case-section__subheading">` inside a `.case-section`.
- **Lists:** `.case-rules-list` / `.case-rules-list__item`, a real `<ul>`.

## Component conventions

- BEM-style class naming (matches the Pulse library conventions).
- Every shared component (nav, footer, case-study template, any repeated card/section pattern) lives in `/components/` and is used everywhere it appears — never copy-pasted and modified per page.
- Responsive by default — build mobile-first or check mobile at the same time as desktop, not as a separate pass at the end.
- Work grid item hover: "Lift + pill" (see Motion above), and the title changes to --text-link-hover. (The dark ProjectRow hover is retired in v2.)

## Case study visuals: static vs. clip

Every `[VISUAL]` note in a case study draft carries a tag: STATIC, CLIP, or LIVE EMBED. Build each according to its tag, don't default everything to a screenshot.

- **STATIC** — a plain image (PNG/WebP). Use for states a still frame communicates fully: empty/populated comparisons, reference diagrams, form fields, anything where the claim is about *what something looks like* rather than *what happens when you act on it*. Also the right call for anything sourced from a former employer's live production app rather than your own coded prototype — those are screenshots you already captured, not something to go record new footage of.
- **CLIP** — a short (3-5 second), muted, looping video for a genuine interaction: a row moving between two zones, an alert surfacing on trigger, a hover/selected/disabled state that can't be honestly faked as a still frame. Only reach for this when the case study text makes a claim about *behavior* that a screenshot can't prove. Encode as webm or mp4, `autoplay muted loop playsinline`, no controls, and always set a static `poster` frame as the fallback for `prefers-reduced-motion`. Never use animated GIF, same visual result at a much larger file size. Hero visuals are static, pulling a still frame rather than autoplaying, even when a clip exists for that content. Most section clips are too busy or too specific to a single claim to sit at the top of the page. Every case study hero is the clip's poster as a static `<img>` (`.case-hero__frame`), and the clip plays where it appears in the body.
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

- Final stack choice (plain static vs. Astro): plain static, confirmed 2026-10-13 (hand-coded HTML/CSS/JS pages + shared components, no `package.json`, no build step). A markdown-rendering template is still undecided.
- Hosting provider: Vercel, confirmed 2026-10-13 (every page loads Vercel Web Analytics from `/_vercel/insights/script.js`).
- Domain: ___
