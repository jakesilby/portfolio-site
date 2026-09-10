# Pre-Infusion Assessment Flow
### Case study — draft v1, post hiring-manager critique pass

*(Working title — this is really about the assessment framework, with pre-infusion as the worked example. Flagging in case you want to retitle before this goes live, e.g. "Scaling the Assessment System" or similar.)*

---

Designed the framework OnePulse Connect uses to select, complete, and review clinical and module-level assessments at scale, then used pre-infusion assessments, the most demanding case in the catalog, to pressure-test it against real branching logic and hard safety stops.

---

## The Problem

**The assessment system in OnePulse started with a single, straightforward case:** a nurse fills out a pre-infusion form for one therapy. As real data came in, from a clinical branching-logic spreadsheet covering therapy groups like Neuro/Rheum, MS, CIDP/MMN, and CVID, it became clear that assessments weren't one thing. Each one carried several independent dimensions: which therapy and phase it applied to, who completed it (staff on-site or a patient completing it remotely), where it fell in the infusion timeline, and its own internal branching logic between questions.

**A flat list of assessment cards was fine for a handful of items.** But even a single therapy group could have four or more assessments across multiple phases, and with multiple therapy groups in the system, the real number was closer to 20 to 40 assessment types. The selection pattern needed to hold up at that scale.

> **[VISUAL — high priority, STATIC]** The original flat-list assessment picker, however many items it had at the time, next to a mockup or real data view showing the full 20-40 item catalog laid out the same way. Makes the scale problem visible rather than asserted.

---

## Why This Matters

Pre-infusion assessments gate whether a patient can proceed to treatment. Certain answers, a positive pregnancy test, a patient refusing consent, need to stop the workflow immediately rather than let a clinician click through to the next question. That's the clinical stakes layer.

The scale problem compounds it. If the pattern for finding and completing an assessment doesn't generalize, every new therapy program OnePulse adds either gets bolted onto a selection pattern that wasn't built for it, or requires the design to be redone from scratch. Getting the underlying framework right once, instead of per therapy group, is what makes the system able to grow without each addition becoming its own design project.

---

## The Framework

**Two decisions came out of this.** The first was how assessments get selected at scale. Three approaches were on the table: a grouped list with collapsible category headers, a two-step drill-down (choose audience first, then choose the specific assessment within that group), and a search-first pattern with filter chips. The grouped list was the most familiar but still turned into a long scroll once several categories were expanded. Search-first scaled the best long-term but added complexity that wasn't justified yet. The two-step drill-down won: staff and patient as the first choice, then the specific assessment grouped by therapy group within that. Making the completing-audience the first-level choice matched a real distinction in the data, since staff and patient assessments are fundamentally different outcomes, not different filters on the same list. Adding a new therapy group means adding one entry to a catalog structure. Adding a new assessment means adding one item to that group's list. Nothing about the layout breaks as the catalog grows.

> **[VISUAL — high priority, STATIC]** Side-by-side of the three considered patterns (grouped list / drill-down / search-first) as simple wireframes, with the chosen one called out. Shows the comparison was real, not asserted after the fact.

**The second decision was how assessments render once selected.** Some assessments are lightweight and scoped to whatever module a user is already working in (a status dropdown with a conditional reason field, for example). Others are the full clinical assessment, like pre-infusion, with sections, branching logic, and a progress indicator. Rather than deciding the rendering mode based on how many questions an assessment has, the split is config-driven: an assessment's type (module or clinical) determines whether it renders inline or as a full-page flow. That keeps the rendering logic simple and predictable instead of something re-evaluated case by case.

> **[VISUAL — medium priority, STATIC]** A simple diagram: assessment config → type flag → inline module render OR full-page clinical render. Two real examples of each, side by side.

---

## Pre-Infusion as the Worked Example

**Pre-infusion was the right assessment to validate the framework against, not because it was the first one available, but because it was the most demanding case in the catalog:** the most sections, the most branching logic, and the only assessment type carrying hard safety stops. If the framework held up here, including for a therapy group like Keytruda where the branching logic is especially dense, it would hold up for the rest of the catalog.

The clinical branching-logic data used to pressure-test the framework was the pre-infusion assessment: 35 questions (43 total, with 8 scoped to diagnosis-specific branches) organized into sections in a fixed order: Medication Verification, Vitals, Treatment History, Adherence, Critical Safety Screening, Infection Screening, Adverse Event, Pre-medications, Vascular Access, Diagnosis-Specific, Proceed Decision, Education and Consent, and Notes.

> **[VISUAL — high priority, STATIC]** Full assessment dialog showing the section list/progress indicator down the side, so a reader can see the scope of a "full clinical assessment" at a glance.

**The form isn't static.** Certain answers reveal follow-up questions inline, directly below the triggering question, without a page reload or navigation away from where the clinician is working. The form grows and contracts as it's filled out.

> **[VISUAL — high priority, CLIP]** 3-5 second clip: select "Yes" on the infection screening question and watch the fever/cough/urinary sub-questions expand inline. A behavior claim a screenshot can't prove.

**Certain answers also carry more weight than others.** A positive pregnancy test or a patient refusing consent needs to stop the workflow immediately rather than let the clinician continue to the next section. Those hard stops surface as alerts placed directly next to the question that triggered them, not just as a banner at the top of the form, so the warning is visible at the exact point of decision.

> **[VISUAL — high priority, STATIC]** A hard-stop alert (e.g. positive pregnancy test) shown inline next to its triggering field, using the real design system alert component (error variant, `#fff5f5` bg / `#ffc9cb` border).

**Layout went through a real revision here too.** Fields were originally laid out two or three to a row in places like Vitals (blood pressure and heart rate side by side, for example). That changed to one field per line across the entire form, including Vitals, because a clinician moving through a long form under time pressure benefits more from a predictable, scannable vertical rhythm than from saving vertical space.

> **[VISUAL — medium priority, STATIC]** Before/after of the Vitals section: multi-column layout vs. the single-column revision.

---

## Reasoning Under Iteration

**The completed-assessment view mode started as a two-step chooser:** click a completed assessment, then decide whether to view it standalone or alongside an active assessment. Testing showed that extra step wasn't earning its place for the standalone case, so it was removed for that path. Clicking a completed item now opens directly into a read-only view. The alongside option still exists, but only as an action available from inside an active assessment dialog, since that's the only context where it's actually relevant.

**The submission confirmation pattern changed after review too.** The original design stacked a confirmation dialog on top of the assessment dialog once submitted, which read as cluttered. That was replaced with an inline transform: the dialog's form content is replaced in place by a success state, summary card, and a single "Done" button, on the same surface, with no stacking.

> **[VISUAL — medium priority, CLIP]** 3-5 second clip: submit an assessment and watch the dialog transform in place to the success state, no second dialog appearing on top.

---

## Catching a Validation Gap in Testing

**The clearest example of iterating through a real gap, rather than getting a decision right on the first pass, came from required-field validation.**

The first version of the prototype let a user submit an assessment with required fields empty. The obvious fix was to disable Submit until required fields were filled. But the first pass at that logic was too strict: it scanned every input on the form, not just the fields that were actually required, so the button stayed disabled even once the real requirements were met.

Narrowing the validator to an explicit list of required-field IDs fixed that. Testing again surfaced a second, more specific gap: the infection screening question has its own branching sub-questions. If a user answers "yes" there, three follow-up fields (fever, cough, urinary status) become required. But the validator had no way of knowing a branch had opened, so it still let submission through even when those follow-up fields were empty.

The fix made the required-field set conditional on that branch: answering "yes" to infection screening adds the three follow-up fields to the required set, and switching back to "no" removes that requirement again. It took two rounds of testing to find both gaps, and each needed a different kind of fix: one about scope (which fields to watch), one about state (what "required" means once a branch is open).

> **[VISUAL — high priority, CLIP]** 3-5 second clip: attempt to submit with infection screening set to "Yes" and sub-questions empty, showing Submit stays disabled/fields highlight, then fill them and Submit activates. The single most important visual in this section, proves the specific gap and its fix.

---

## Status

This work was fully designed and spec'd, including the branching logic, hard stops, alert placement, and the audience-first selection framework, but it wasn't built into OnePulse's production codebase before I left the company. The prototype is what makes the design tangible: an interactive artifact that demonstrates the framework working end to end, from selecting an assessment through submission, built with AI-assisted coding tools that I directed.

The framework covers both clinical assessments (pre-infusion and similar, full-page, branching, section-based) and lighter module-level assessments (inline, scoped to whatever module a user is working in) under the same config-driven rendering split. The inline drawer also includes a reference view showing all assessments run across modules for a given patient, so staff can look back at what's been completed without leaving their current context. What I didn't design is the patient-facing side of assessment completion itself, the experience a patient has when filling one out remotely. That was outside my scope on this project.

What's still open if this were to ship: wiring the framework to real assessment data instead of the CSV-derived example set, and extending past the therapy groups used to validate the pattern during design. The two-step selection pattern, the config-driven rendering split, and the conditional validation logic described above are the reusable parts, exactly the kind of edge case that surfaces when a framework gets tested against real branching data rather than a single flat form.
