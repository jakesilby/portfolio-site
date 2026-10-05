# Assessments at Scale, Safety Stops Included

*(Pre-Infusion Assessment Flow)*

*(Working title — this is really about the assessment framework, with pre-infusion as the worked example.)*

---

I designed a framework for OnePulse Connect to select, complete, and review 20 to 40 clinical and module-level assessments through one system. Then I stress-tested it against the hardest case in the catalog, a 43-question form with hard safety stops.

---

## The Problem

The assessment system in OnePulse started with one case, a nurse filling out a pre-infusion form for one therapy. Then the clinical data came in. A branching-logic spreadsheet covered therapy groups like Neuro/Rheum, MS, CIDP/MMN, and CVID, and every assessment in it carried several independent dimensions at once: the therapy and phase it applied to, who completed it (staff on-site or a patient remotely), where it fell in the infusion timeline, and the branching between its own questions.

A flat list of assessment cards worked for a handful of items. One therapy group alone could have four or more assessments across several phases, though, and with multiple groups in the system the count was closer to 20 to 40 assessment types. The selection pattern had to hold up at that size.

---

## Why This Matters

Pre-infusion assessments gate whether a patient can go ahead with treatment. Some answers have to halt the process on the spot, like a positive pregnancy test or a patient refusing consent.

OnePulse also keeps adding therapy programs. If the pattern for finding and completing an assessment doesn't generalize, each new program gets bolted onto something that wasn't built for it. I wanted to get the framework right once, so a new therapy group wouldn't turn into its own design project.

---

## The Framework

The first decision was how assessments get selected at scale. I looked at two approaches. The grouped list with collapsible category headers was the most familiar, but once a few categories were expanded it still turned into a long scroll. Search-first with filter chips would scale best long-term, but on its own the complexity wasn't worth it. I went with a hybrid, a single searchable list grouped by therapy category. Adding a therapy group means one new entry in that structure. New assessments slot in under their group.

> **[VISUAL — high priority, STATIC]** Side by side, both at full catalog scale: the same flat-list pattern from the Problem section crowded to 30 ungrouped items, next to the searchable, grouped list at 23 items across 8 therapy groups. One paired image proving both the breakdown and the fix.

The second decision was where someone runs into an assessment in the first place, and how it renders. Module assessments live in the Processing tab of the Global Inline Drawer (GID), inline with whatever the user is already doing there, like a status dropdown with a conditional reason field. Clinical assessments like pre-infusion sit behind a separate Assessments tab and open as a full page with sections, branching logic, and hard stops. An assessment's config decides which path it belongs to before anyone sees it, so each path stays simple. Both decisions are about how staff get to an assessment once they're looking for one. Whether they should have to browse at all comes up again near the end.

> **[VISUAL — medium priority, STATIC]** Two separate paths, not a shared branch: GID Processing tab → module assessment → renders inline (e.g. status dropdown), and separately, GID Assessments tab → Select Assessment picker → clinical assessment → renders full-page (e.g. pre-infusion assessment). An assessment's config sets which path it belongs to ahead of time; this isn't a decision a user or the system makes live.

---

## Pre-Infusion as the Worked Example

I picked pre-infusion to test the framework because nothing else in the catalog is harder. It has the most sections and the most branching, and it's the only assessment type with hard safety stops. If the framework held up here, including for a therapy group like Keytruda where the branching gets especially dense, it would hold up for everything else.

The form has 35 core questions, plus 8 more scoped to diagnosis-specific branches, for 43 total. They fall into thirteen sections, always in this order: Medication Verification, Vitals, Treatment History, Adherence, Critical Safety Screening, Infection Screening, Adverse Event, Pre-medications, Vascular Access, Diagnosis-Specific, Proceed Decision, Education and Consent, and Notes. As a clinical assessment, it opens as a dedicated full page. The picker that selects it is the only dialog.

The page has three regions. On the left is a vertical list of sections with the active one highlighted, the form sits in the center, and on the right an inline drawer lists completed assessments as cards, so a nurse can check prior responses without losing their place. That drawer belongs to this page. It's separate from the Global Inline Drawer used on Processing pages. An early version swapped the section list for a progress stepper. I cut it because a stepper implies a fixed, linear sequence, and the branching logic doesn't work that way.

> **[VISUAL — high priority, STATIC]** The full assessment page: section nav on the left, form in the center, inline drawer (completed assessments) on the right, so a reader can see the scope of a "full clinical assessment" at a glance.

Some answers open follow-up questions inline, right below the question that triggered them, with no page reload and no jump away from where the nurse is working.

> **[VISUAL — high priority, STATIC]** A still frame from the same clip playing in the hero above: "Yes" selected on the infection screening question, with the fever, cough, urinary, and skin sub-questions expanded inline and still unanswered. The live version of this interaction already plays at the top of the page, so this section shows the resulting state rather than repeating the clip.

A positive pregnancy test or a refused consent has to stop the workflow right there, before the nurse moves to the next section. Those hard stops show up as alerts directly next to the question that triggered them, at the point of decision. A banner at the top of the form is easy to scroll past.

> **[VISUAL — high priority, STATIC]** A hard-stop alert (e.g. positive pregnancy test) shown inline next to its triggering field, using the real design system alert component (error variant, `#fff5f5` bg / `#ffc9cb` border).

I originally laid out some fields two or three to a row, like blood pressure and heart rate side by side in Vitals. I changed the whole form to one field per line, Vitals included. Someone moving through a long form under time pressure needs a predictable vertical rhythm they can scan, and the space it saved wasn't worth losing that.

> **[VISUAL — medium priority, STATIC]** Before/after of the Vitals section: multi-column layout vs. the single-column revision.

---

## Reasoning Under Iteration

Yes/No questions started as dropdowns. A dropdown takes two clicks to answer a question with two possible values and hides both until it's opened, which adds up on a form with dozens of them. Most of those questions also trigger branches, and with both options visible it's easier to see why a set of sub-questions just appeared. I switched them to radio buttons. My first pass also laid short option sets out horizontally, a rule I made up on the spot. When I checked the design system, it said to keep the pattern vertical regardless of option count, so I changed it.

Clicking a completed assessment used to bring up a chooser asking whether to view it standalone or alongside an active assessment. For the standalone case, that step added a click for no reason. Now a click opens a read-only view directly. The side-by-side option moved inside active assessments, the only place it's relevant.

After review, I also replaced the submission confirmation. It used to stack on top of the assessment, which looked cluttered. Now the form content transforms in place into a success state, a summary card, and a single "Done" button on the same surface.

> **[VISUAL — medium priority, CLIP]** 3-5 second clip: submit an assessment and watch it transform in place to the success state, no second confirmation appearing on top.

---

## Catching a Validation Gap in Testing

The first version of the prototype let a user submit with required fields empty. So Submit needed to stay disabled until those were filled. My first pass at that logic scanned every input on the form instead of only the required ones, and the button stayed disabled even after every requirement was met.

Narrowing the validator to an explicit list of required-field IDs fixed that. Another round of testing turned up a second gap, in infection screening. Answering "yes" there opens three follow-up fields (fever, cough, urinary status) that become required. The validator had no idea a branch had opened, so it let submission through with those fields empty.

I made the required set conditional on that branch. A "yes" on infection screening adds the three follow-up fields, and switching back to "no" removes them. Finding both gaps took two rounds of testing. The first fix narrowed which fields the validator watched, and the second taught it that a branch opening changes what counts as required.

> **[VISUAL — high priority, CLIP]** 3-5 second clip: attempt to submit with infection screening set to "Yes" and sub-questions empty, showing Submit stays disabled/fields highlight, then fill them and Submit activates. The single most important visual in this section, proves the specific gap and its fix.

---

## Status

I fully designed and spec'd this work, including the branching logic, hard stops, alert placement, and the selection framework. It wasn't built into OnePulse's production codebase before I left. The clips on this page are a working prototype built with AI-assisted coding tools I directed, running end to end from picking an assessment through submission. It was never deployed for public use. The two validation bugs above show what directing that work involved: reading the generated logic closely enough to see where it was wrong, then prompting a specific fix.

The framework covers clinical assessments like pre-infusion, which open as full pages with sections and branching, and lighter module assessments that render inline in whatever module a user is working in, with config deciding which is which. The inline drawer also has a reference view of every assessment run across modules for a patient, so staff can look back without leaving where they are. I didn't design the patient-facing side, where a patient fills an assessment out remotely. That was outside my scope.

Shipping it would still mean wiring the framework to real assessment data in place of the CSV-derived example set and extending it past the therapy groups I used during design.

When I tested with Humira, a self-administered biologic, the picker still offered infusion-specific assessments that didn't apply to it at all. Selection happens from inside a specific patient's active medication or order, so the system already knows enough to filter the picker to the relevant therapy group automatically. Staff would still need the grouped, searchable list for Ad Hoc assessments, broader browsing, or work across therapies. Context-aware filtering is the next thing I'd build if I picked this back up.