# v2 direction audit (baseline, Oct 13 2026)

## 1. Type

**Fonts the pages load:**
- Every case page loads EB Garamond regular and italic at 400 only.
- `index.html:8` loads Barlow at 700 and 800 only.
- `about.html:10` loads Barlow at 700 and 800, plus EB Garamond at 400, 500, italic 400 and italic 600.

| Selector (where it's defined) | Family | Size/LH | Weight | Style | Letter-spacing | Transform | Pages | v2 issue |
|---|---|---|---|---|---|---|---|---|
| `.type-wordmark` (tokens.css:407) | Barlow | 14/16 | 700 | normal | 0 | none | index, about | – |
| `.type-nav-label` (:417) | Spline Sans Mono | 11/16 | 500 | normal | 1.1px | none | index, about (nav pills) | **Mono used for nav** |
| `.type-hero-heading` (:463) | EB Garamond | 40/48 | 400 | normal | -1px | none | index h1 "Hi, I'm Jake" | Hero is two lines (heading + subhead), not one sentence |
| `.type-hero-subhead` (:477) | EB Garamond | 20/32 | 400 | normal | 0 | none | index | **Garamond outside the single hero sentence** |
| `.type-section-label` (:507) | Barlow | 16/18 | 700 | normal | -0.8px | none | index "Selected Work ↓" | – |
| `.type-case-title` (:537) | Barlow | 32/48 | 800 | normal | -1.2px | none | used through the two overrides below | – |
| ↳ `.project-row__title` (components.css:867) | Barlow | 24/32 | 800 | normal | -0.6px | none | index | – |
| ↳ `.stat-tile__value` (components.css:328) | **EB Garamond** | 32/48 | 800 | normal | -1.2px | none | onepulse, linking, pre-infusion | **Garamond outside the hero.** Weight 800 isn't loaded, so the browser fakes the bold |
| `.type-label-secondary` (:545) | Spline Sans Mono | 11/16 | 400 | normal | 0.88px (overridden to 0 on most uses) | none | all pages: footer links, badge, project-row subtitle, case-header back link, eyebrow, title-block subtitle, "At a glance" label, problem-diagram cards and captions, case-footer-nav links | **Mono used for labels, nav, meta and an eyebrow** |
| `.type-meta` (:520) | Spline Sans Mono | 13/20 | 400 | normal | 1.04px (overridden to 0 on most uses) | none | all pages: footer ©, project-row year, title-block meta, stat-tile labels, figure captions | **Mono used for meta and captions** |
| `.type-description` (:577) | EB Garamond | 20/32 | 400 | **italic** | 0 | none | index (project-row description) | **Garamond outside the hero; italic body text** |
| `.type-tagline` (:494) | EB Garamond | 20/normal | 400 | **italic** | 0 | none | all 4 case pages (`.case-title-block__description`) | **Garamond outside the hero; italic body text** |
| `.type-page-title` (:593) | Barlow | 48/56, overridden to 40px on every case page (line-height stays 56) | 800 | normal | -1.6px | none | all 4 case pages h1 | **Case study title should be EB Garamond** |
| `.type-section-heading` (:601) | Barlow | 24/32 | 700 | normal | -0.8px | none | all case pages | – |
| `.type-subsection-heading` (:624) | Barlow | 18/24 | 700 | normal | 0 | none | carbon | – |
| `.type-body` (:612) | Barlow | 16/24 | 400 (strong 600) | normal | 0 | none | all case pages, token-chain caption | – |
| `.type-code` (:635) | Spline Sans Mono | 13/20 | 400 | normal | 0 | none | carbon `<pre>` | – |
| `.case-code-inline` (components.css:295) | Spline Sans Mono | 14 (inherits in captions) | inherited | normal | 0 | none | carbon | – |
| `.type-token-name` (:560) | Spline Sans Mono | 12/normal | 500 | normal | 0.88px | none | onepulse token chain | **Mono for the card labels "Primitive", "Semantic Alias", "Mapped Token"** (component-js/token-chain.js:16,24,32). The token names themselves are fine |
| `.type-about-heading` (:649) | EB Garamond | 18/24 | 500 | normal | 0 | none | about "Experience:", "Education:" | **Garamond outside the hero** |
| `.type-about-entry` (:658) | EB Garamond | 14/24 | 400 (strong 500) | normal | 0 | none | about | **Garamond outside the hero** |
| `.type-about-entry-years` (:673) | Spline Sans Mono | 11/24 | 400 | normal | 0 | none | about | **Mono used for meta** |
| `.type-about-bio-lead` (:687) | EB Garamond | 20/normal | 600 | **italic** | 0 | none | about | **Garamond outside the hero; italic body text** |
| `.type-about-bio-body` (:701) | EB Garamond | 20/normal | 400 | normal | 0 | none | about | **Garamond outside the hero** |
| `.lightbox__close` (components.css:1066) | Barlow | 32 / line-height 1 | inherited | normal | – | none | onepulse, pre-infusion, carbon | – |
| `.type-eyebrow`, `.type-hero-eyebrow` (:431, :447) | Spline Sans Mono | 16/20 and 18/20 | 400 | normal | 1.04px and 1.5px | none | unused | Eyebrow styles still defined |

**Other type issues:**
- All four case pages have an eyebrow above the h1: "Case study" or "Personal project".
- The About page has no Barlow body text at all; every line is Garamond or mono.

## 2. Tokens: raw values outside tokens.css

There are no raw hex or rgba values outside tokens.css. Raw px, ms, deg and other unitless values:

**Page `<style>` blocks:**
- **index.html:**
  - 23 `width: 634px`
  - 38, 76, 77 `109.04deg` / `469.04deg`
  - 59 `blur(13.45px) saturate(0.85)`
  - 66 `opacity: 0.7`
  - 86 `height: 234px`
  - 102 `max-width: 729px`
  - 111 `max-width: 599px`
  - 126 `1px dashed`
- **about.html:**
  - 23–24 `1px`
  - 39 `width: 456px`
  - 46, 81, 82 `deg` values
  - 60 `blur(13.45px) saturate(0.85)`
  - 70 `opacity: 0.7`
  - 112 `1px dashed`
  - 119 `max-width: 379px`
  - 128 `720px`
- **onepulse-connect.html:**
  - 40 `956px`
  - 54 `760px`
  - 90 and 110 `720px`
  - 118 `width: 700px`
  - 159 `712px`
- **linking-documents-prescriptions.html:**
  - 39 `956px`
  - 51 `760px`
  - 116 `720px`
  - 127 `width: 956px`
  - 163 `760px`
  - 197 `712px`
- **pre-infusion-assessment-flow.html:**
  - 39 `956px`
  - 52 `760px`
  - 100 `720px`
  - 108 `width: 956px`
  - 172 `760px`
  - 184 `712px`

**components/components.css:**
- 42, 750 `1px dashed`
- 107 `736px`
- 135, 201, 483, 587 `760px`
- 144 `712px`
- 177 `2px dashed`
- 368–408 problem-diagram geometry: `270/220/61/160/108/112/157/103/67/119/156/100/150/90px`, `rotate(7deg/-5deg/4deg)`
- 411, 507, 891 `1px solid` (`--border-width-hairline` exists but isn't used)
- 423 `220px`
- 446–447 and 575–576 `14px` / `14.7279px`
- 459–468 `280/220/22/175px`
- 493 `gap: 1px`
- 503 `110px`
- 513 `200ms`
- 592 and 1090 `600px`
- 601 `90deg`
- 613 `height: 80px`
- 638 `blur(6px)`
- 639 `900ms`
- 660, 732 `44px`
- 664 `2px`
- 687 `350ms cubic-bezier(...)`
- 698 `120ms`
- 778 `280px`
- 912–945 `340ms`, `blur(4px)`, `translateY(6px)`, `scale(0.98)`, delays `60/120/180/240ms`
- 948 `720px`
- 997–998 `2px`
- 1024–1052 `200ms`, `scale(0.96)`
- 1077 `line-height: 1`
- 1087 `15%`

**Misused tokens:** spacing tokens used as radii at components.css:412, 525 and 892 (`border-radius: var(--space-4)`), and at :1059 (`--space-96` inside `calc`).

**HTML attributes:** components/nav.js:7 `width="16" height="16"`.

**Missing token:** the v2 work-grid rule needs a "link-hover color token", and no such token exists. Only `--text-link` exists (tokens.css:334).

**tokens.css tier issue:** some semantic tokens hold raw px values instead of pointing at primitives: tokens.css:368 `--hero-section-padding-y: 80px`, :369 `15px`, :375 `19px`, :377–380 `3/14/17/3px`.

## 3. Motion

**Animations and keyframes:**
- index.html:69–78: `hero-glow-rotate`, 48s linear infinite, rotating the gradient angle. Inside `no-preference`.
- about.html:74–83: `about-glow-rotate`, same treatment.

**Transitions:**
- components.css:639: brand text `opacity` and `filter` 900ms ease-in-out, with `blur(6px)`. It is **not** inside a reduced-motion query.
- components.css:687–699: nav-pill `transform` 350ms with `scale(1.025)` on hover and `scale(0.97)` on active. Not a color change.
- components.css:513: token-chain card `border-color` at 200ms, not 150ms.
- components.css:908–946: project-row stagger with opacity, `blur(4px)`, `translateY(6px)`, `scale(0.98)`, 340ms plus delays.
- components.css:1022–1054: lightbox opacity, visibility, and `scale(0.96→1)` at 200ms.
- components.css:738 (footer links) and 753 (project row): hover states with no transition. Neither is wrapped in a reduced-motion query.

**IntersectionObserver:**
- components/project-row.js:108–126 adds `js-stagger` and then `is-visible` on intersection (threshold 0.15) for the reveal.
- components/clip-video.js:91–103 plays and pauses section clips (threshold 0.5).

**Interval JS:** components/nav.js:23–57 swaps `is-active` on the brand text every 2500ms.

**Hidden before JS runs:**
- `.site-header__brand-text` defaults to `opacity: 0; filter: blur(6px)` (components.css:637–638). The "Welcome" slot is only visible because nav.js writes it with `is-active` already set. The header itself is injected by JS, so with no JS there is no header at all.
- The project row, footer, case header, token chain and lightbox are all injected by JS. With JS off, the homepage has no work list, and every page loses its footer and nav.
- Project rows render visible, then project-row.js:112 adds `js-stagger`, which hides the title, badge, image and description until they intersect.

**Hero videos** (onepulse :205, linking :234, pre-infusion :224) and the homepage row videos (project-row.js:73) autoplay with no offscreen pause. Only `[data-clip-video]` wrappers are observed. Under reduced motion, project-row.js leaves out `autoplay`, and clip-video.js:25–30 strips it from the case-page heroes. linking-documents-prescriptions.html never loads `lightbox.js`, but it does load `clip-video.js`.

## 4. Chrome

**Header brand** (components/nav.js:4–18, only on index and about):
- 16px `brand-mark.png` (36×36 source) plus two stacked `.type-wordmark` spans.
- nav.js:23–57 cycles 13 greetings every 2.5s, starting "Welcome", "Haere mai", "Bonjour", …, with a 900ms blur crossfade.
- No `aria-live`, and screen readers get both spans.
- Nav is "Work" and "About" pills in mono with a 2px `--border-highlight` underline when active and a scale hover.
- Case pages don't use this header. components/case-header.js:3–7 injects only `← Work`, with no brand and no About link, even though components.css:6 and :12 describe an About link.

**Hero card and glow:**
- index.html:21–119 has `.hero-card` at 634px with an animated blurred gradient `.hero-card__glow` behind a `.hero-card__content` panel, `--radius-lg`, fixed 234px height.
- about.html:37–94 has the same pattern again (`.about-card`, `.about-card__glow`), duplicated in page CSS rather than shared.

**"Selected Work ↓":** index.html:147 is an h2 with an appended arrow, Title Case, and `1px dashed` bottom border (index.html:126).

**Project rows** (components/project-row.js:70–102):
- Single-column list. Each row is one `<a>` wrapping:
  - a header with an h3 title and an optional subtitle
  - a meta block with the badge and year
  - a body with the image or video and the description.
- `.project-row:hover` swaps the background to `--bg-inverse` (components.css:753), which v2 retires.
- `1px dashed` bottom border (components.css:750).
- Image tray uses `--shadow-card` (components.css:792).
- Titles are Title Case ("Standardizing a Design System With No Foundation").

**Badges** (components.css:888–894): `1px solid --border-muted`, radius `--space-4`, mono 11px. Values are Title Case "Design Systems" and "Product Design", plus "Personal project".

**Dashed rules:**
- index.html:126
- about.html:112
- components.css:42 (`.case-footer-nav`)
- components.css:177 (unused placeholder)
- components.css:750 (`.project-row`)

**Footer** (components/footer.js:1–9):
- "© {year} Jake Silby" in mono, plus "LinkedIn" and "Resume" links in mono.
- No email link.

**Email link per page:**
- about: `about.html:208`, a ✉️ emoji followed by "jake.r.silby[at]gmail.com", with `href` set by JS at :218. With no JS it's an `<a>` without `href`.
- index, onepulse, linking, pre-infusion, carbon: none.

**Case footer nav:**
- onepulse:364 "Next: Linking Documents & Prescriptions →"
- linking:367 "Next: Pre-Infusion Assessment Flow →"
- pre-infusion:340 and carbon:177 "More work →"
- All have trailing arrows. The `<footer>` element is reused for this, so case pages have two `<footer>` elements.

**Other shared chrome:**
- `.problem-diagram__image` has `--shadow-resolved` (components.css:471).
- `.case-hero__frame` has `--shadow-card` on onepulse :124, linking :132, pre-infusion :113.

## 5. Case study template

There is no template. All four case studies are hand-built HTML pages that share `components.css` classes and the scripts `case-header.js`, `footer.js`, `lightbox.js`, `clip-video.js` and `token-chain.js`.

**Duplicated page CSS:**
- `.case-title-block*`, `.case-hero*` and `.at-a-glance*` are copied into each page's `<style>`: onepulse 21–142, linking 19–153, pre-infusion 19–134, carbon 24–47.
- `.case-clip-video*` is copied into three pages, with a different `aspect-ratio` in each (onepulse :156, linking :194, pre-infusion :181).

**Content files:** only `content/case-studies/carbon-token-audit-case-study-v1.md` and `pre-infusion-assessment-flow.md` exist. onepulse and linking have no content file and no content-source comment.

**Where each piece comes from:**

| Element | Source |
|---|---|
| "Case study" / "Personal project" eyebrow | Hardcoded `<p class="case-title-block__eyebrow">` per page: onepulse:192, linking:221, pre-infusion:211, carbon:81. Styled in each page's own CSS |
| Role / Timeframe / Stack | Hardcoded `.case-title-block__meta` spans per page: onepulse:196–200, linking:225–229, pre-infusion:215–219. Carbon has none |
| "At a glance" | Hardcoded `<section class="at-a-glance">` per page: onepulse:212, linking:241, pre-infusion:230. Wrapper CSS lives on each page; `.stat-grid` and `.stat-tile` are shared (components.css:313–344). Carbon has none |
| Back link | components/case-header.js:5, "← Work" linking to `/` |
| Next-case link | Hardcoded `<footer class="case-footer-nav">` per page (lines listed in section 4). The sequence is fixed by hand and doesn't match the homepage order: carbon is fourth on the homepage, and nothing links to it |

## 6. Head and landmarks

| Page | `<main>` | Skip link | meta description | og:title | og:description | og:image | canonical | favicon |
|---|---|---|---|---|---|---|---|---|
| index.html | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| about.html | ✓ (:153) | ✗ | ✓ (:7, contains an em dash) | ✗ | ✗ | ✗ | ✗ | ✓ (:8) |
| onepulse-connect.html | ✗ | ✗ | ✓ (:7) | ✗ | ✗ | ✗ | ✗ | ✓ (:8) |
| linking-documents-prescriptions.html | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| pre-infusion-assessment-flow.html | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| carbon-token-audit.html | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

**Also:**
- Every `<title>` uses an em dash ("X — Jake Silby").
- carbon-token-audit.html has no Vercel Analytics script on `main`. That's only on the unmerged `fix/carbon-page-analytics` branch.
- On about.html, the `<h1>` sits outside `<main>` at :151.
- The favicon is `components/brand-mark.png`, a 36×36 PNG.

## 7. Videos

webm is listed first, so browsers pick it, but every webm is larger than its mp4.

| Location | Attributes | Poster | aria-label | Files |
|---|---|---|---|---|
| index, via project-row.js:73 (rows 1–3) | `autoplay` (left out under reduced motion), `muted loop playsinline`, no offscreen pause | ds_siteoverview_poster.jpg (94 KB), link-document-flow-short_poster.jpg (31 KB), as_infectionscreening_poster.jpg (20 KB) | yes (the row's `imageAlt`) | ds_siteoverview webm 1.84 MB / mp4 1.05 MB; link-document-flow-short webm 258 KB / mp4 196 KB; as_infectionscreening mp4 174 KB (no webm) |
| onepulse:205 hero | `autoplay muted loop playsinline`, no offscreen pause | ds_siteoverview_poster.jpg | yes | webm 1.84 MB / mp4 1.05 MB |
| onepulse:298 | `muted loop playsinline`, played by IntersectionObserver, rate keyframes | ds_datatable_rowstates.jpg (15 KB) | yes | webm 588 KB / mp4 427 KB |
| onepulse:347 | `muted loop playsinline`, IntersectionObserver | ds_siteoverview_poster.jpg | yes (same text as the hero) | webm 1.84 MB / mp4 1.05 MB |
| linking:234 hero | `autoplay muted loop playsinline`, no offscreen pause | link-document-flow-short_poster.jpg | yes | webm 258 KB / mp4 196 KB |
| linking:284 | `muted loop playsinline`, IntersectionObserver | same poster | yes (same text as the hero) | same files as the hero |
| linking:309 | IntersectionObserver | linked-prescriptions-alert_poster.jpg (39 KB) | yes | webm 207 KB / mp4 123 KB |
| linking:319 | IntersectionObserver | reference-toggle_poster.jpg (34 KB) | yes | webm 163 KB / mp4 83 KB |
| linking:340 | IntersectionObserver | link-document-full_poster.jpg (31 KB) | yes | webm 722 KB / mp4 552 KB |
| pre-infusion:224 hero | `autoplay muted loop playsinline`, no offscreen pause | as_infectionscreening_poster.jpg | yes | mp4 174 KB only |
| pre-infusion:306 | IntersectionObserver | as_submitassessment_poster.jpg (21 KB) | yes | mp4 262 KB only |
| pre-infusion:319 | IntersectionObserver | as_validationgap_poster.jpg (21 KB) | yes | mp4 366 KB only |

**Video issues:**
- None of the `<video>` elements has `role="img"`, so their `aria-label` may not be announced.
- None has `preload` set.
- The `.case-clip-video--siteoverview` aspect ratio (onepulse:175, `1600/986`) doesn't match the clip's 1600×1000 encode, which onepulse:120 states.

## Other v2 conflicts found in passing

These are outside your seven sections:
- **Production-code implication:** onepulse-connect.html:334 says "I opened a pull request … An engineer reviewed and approved it, and it shipped to production." That reads as Jake writing production code.
- **Em dashes in visible copy:** in alt text at onepulse:305 and linking:292, and in about.html:7's meta description.
- **Headings aren't sentence case:** project-row titles, case h1s and h2s ("Why This Matters", "The Design-to-Code Bridge"), and badges ("Design Systems").
- **Homepage structure:** there are no credibility lines and no two-column grid.
- **Container widths:** at least seven different width values are in use: 634, 456, 700, 712, 736, 760 and 956px, plus `--layout-max-width` 1200px. No shared container is applied on every page.