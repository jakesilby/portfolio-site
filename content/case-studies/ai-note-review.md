<!-- Rendered by ai-note-review.html. Canonical copy: edit here first, then sync the page. -->
# Treating an AI draft like an unverified order

---

A personal project on how a primary care clinician reviews and signs a visit note drafted by an AI scribe. I wrote a fictional visit and an AI draft with three realistic errors, then designed a review that scales with risk, shows the clinician where each line came from, and records what she actually checked when she signs. The patient, clinician and visit are fictional. You can [try the prototype](https://fieldnote-prototype.vercel.app/).

> **[VISUAL — HERO, CLIP]** `videos/fn_dose-check.mp4`, poster `videos/fn_dose-check_poster.jpg`. The hero copy is aria-hidden; the body copy in "From frames to a working prototype" carries the label.

---

## The problem

A primary care nurse practitioner finishes her last visit and opens a stack of unsigned notes. An AI scribe listened to every one of those visits and wrote the drafts. Her signature makes each note hers, errors included.

Most drafts are fine, which makes the bad ones easy to sign. When reviewers at UC San Diego Health checked AI-drafted notes during a pilot, they found omissions in 18% and hallucinations in 11.5%, and in a national survey of UK GPs who use scribes, 14% had seen errors with significant to critical implications.

The errors read like correct documentation. At Kaiser Permanente, a physician talked about scheduling a prostate exam, and the scribe wrote it up as already done. A preprint audit of three commercial scribes found failures bunched in allergy and medication details. It also turned up a failure the authors couldn't place in any existing taxonomy: a treatment the clinician took back, recorded as care delivered. A wrong dose looks like any other dose, and a pertinent negative nobody asked about looks like template text. Omissions are harder still. They leave nothing on the page to catch.

Researchers who compared notes from commercial scribes with notes written by clinicians concluded that AI notes are drafts and need review. The products I looked at hand that review to the clinician and stop there. Abridge's getting-started guide sums up the step as "review the generated draft, verify with Linked Evidence, and send directly to Epic." Linked Evidence ties a line to its moment in the transcript, and the guide describes nothing that confirms the review happened before the note goes out. Dragon Copilot pins a reminder at the top of every note telling clinicians to check AI content for mistakes. I set out to design the review step those products leave open.

---

## Why this matters

I wrote one routine visit to make the problem concrete. Dennis Kowalczyk is 58 and has type 2 diabetes and high blood pressure. He sees Dana Reyes, a nurse practitioner, for a ten-minute follow-up where she raises his metformin because his A1c went up, keeps his blood pressure medication where it is, orders labs, and refers him for an eye exam.

The AI draft of that visit reads well. It has three errors, and each one mirrors a failure type from the published audits.

**A dose she ruled out.** Dana floats 1,000 mg of metformin twice a day. Then she drops the idea, because Dennis had stomach trouble when he first started the drug, and settles on 1,000 mg in the morning and 500 mg at night, which she repeats in her recap. The draft kept the number she rejected. A pharmacist, a covering clinician, or Dennis reading his portal could follow it to 2,000 mg a day.

**A screening that never happened.** According to the review of systems, Dennis denies chest pain and shortness of breath. Dana never asked. Diabetes and high blood pressure put him at high risk for heart trouble, and diabetes can blunt the warning signs. After she signs, the chart claims she screened him and found nothing, which gives the next clinician a reason to skip the question.

**A symptom that disappears.** Dennis mentions he gets woozy getting out of bed, and Dana tells him to call if it gets worse or if he falls. None of that is in the draft. In someone on lisinopril, lightheadedness on standing can mean his blood pressure drops when he gets up, and that bears directly on her choice to leave his medication alone. The signed note would say "controlled, no changes." Her instruction about falls would be gone.

A fast read catches none of these. The harm reaches Dennis months later, but the responsibility is Dana's the moment she signs.

**Scope.** I designed the review and sign-off: the review screen, how flagged items behave, what happens to things the note left out, and what signing records. Recording and transcription, EHR integration and orders, the patient's side, settings, and the note queue are out. I haven't tested any of this with clinicians, and the validation plan near the end covers how I would.

**Why this project.** For four years I designed pharmacy software, and a big share of that work was guardrails. In a [pre-infusion assessment flow](https://jakesilby.xyz/pre-infusion-assessment-flow.html) I designed, answers like a refused consent trigger a hard stop on the spot, and the record shows the assessment couldn't be fully performed. An AI draft needs the same kind of guardrail before it reaches the chart, and the same honest record of what happened.

---

## The core decision: review in proportion to risk

Nobody signing a full day of notes reads every word. A design that assumes otherwise protects nothing, so I assumed attention would run short and let the interface spend it. Each line in the draft gets one of four treatments, depending on what an error there would do to the patient.

| Treatment | Lines | What the clinician does |
| --- | --- | --- |
| Must verify | New or changed medications and doses, allergies, new orders and referrals | Verify, edit, or reject each one before signing |
| Verify on flag | Review of systems, vitals, lab values | Nothing, unless the line has no transcript source. Then she deletes it or keeps it on purpose. |
| Skim | Chief complaint, history narrative, exam findings said aloud | Nothing. The source is there on request. |
| Not in note | Things said in the visit that the draft left out | Add each one to the note or dismiss it |

I picked these tiers as starting defaults. The validation plan tests them, and the open questions at the end ask whether clinicians should be able to move lines between them.

**Must verify** covers lines that act on their own. A dose goes to the pharmacy. An order goes to the lab, and an allergy line decides what anyone can prescribe next. Errors here cost the most, so each of these lines gets an explicit check with its transcript source showing by default. Unchanged medications with a matching source stay quiet. Dennis's note ends up with six checks: the metformin change, the allergy line, three labs, and the eye referral.

**Verify on flag** answers a question software handles better than a tired person can. Did anyone actually say this? A pertinent negative with a transcript source stays quiet. One without a source gets flagged and holds the sign button until the clinician decides what to do with it. That's how Error 2 surfaces while the three real negatives next to it stay plain.

**Not in note** exists because Error 3 isn't on the page, and a review screen can only point at what's there. The system lists what came up in the visit but never made the draft, and the clinician adds or dismisses each item. Dismissing needs no reason. The one exception is an item she gave advice about during the visit, which asks for a second look first.

Until every check, flag, and omission has a decision, the sign button stays locked. No decision needs a justification. I wanted each choice to be visible and cheap, with nobody explaining themselves at 6 p.m.

Checks still cost time, so each one has to earn its place. Error 1 shows where that gets hard. A verify button next to "1000 mg twice daily" is useless unless the clinician can see the number is wrong, and the worked example shows what the check does to make that possible.

---

## Finding the layout

Before settling on one, I explored four directions for the review screen. All four held identical content: Dennis's note, six checks, one unsupported line, two omissions.

![Four review-screen wireframes, labeled A to D: a note with a source panel, a checklist rail, a step-through of open items, and a single column with everything inline.](images/fn-directions-a-to-d.png)

*The four directions, each holding the same note, six checks, one unsupported line and two omissions.*

Direction A ran review top to bottom through the note, with sources in a right panel. It felt familiar, but a clinician could scroll right past an open item and never know. B moved every open item into a checklist rail on the left, so nothing got missed, though review started to feel like clearing a to-do list. C gave each open item its own card and saved the note for last. It was the quickest to get through, and I didn't like seeing every item pulled out of its context. D kept everything in one column, with sources opening under their lines and omissions appearing as suggested lines where they belong. That kept the most context and made for a very long page.

B guaranteed nothing got skipped. D kept review inside the note, and dropping a missing symptom into the exact spot it belongs was my best answer to "what happens to the comment the AI left out." I wanted both.

**E combines them.** The rail lists every open item and holds the sign button, while the note stays one reading column. Picking an item scrolls to its line and opens the source right underneath. A header button opens the full transcript beside the note.

![The Fieldnote review screen. A rail on the left lists seven open items under the note's section names. The note sits as a white page on the right, with two suggested lines, an amber line with no source, and the selected metformin change.](images/fn-review.png)

*Direction E. The rail lists every open item and holds the sign button, and the note stays one reading column.*

**Making the rail and the note read as one thing.** In the first version of E, I kept losing the connection between a rail item and its line. The rail said "Checks" where the line said "must verify." The rail said "Metformin change," and the line said "Increase metformin to 1000 mg." The rail grouped items by type while the note ran by section, so matching them meant reading both. Four rules fixed it.

1. The rail follows the note's order, under the note's own section names.
2. Each state has one label, used in both places: Verify, No source, Not in note, Verified.
3. Rail items reuse the line's own words, for example "Metformin 500 → 1000 mg twice daily."
4. The same icon marks the item in the rail and on the line's tag.

![Two versions of the rail next to the selected metformin line. Before, the rail groups items under Checks, Flags and Omissions with its own labels, like Metformin change, while the line's tag says Must verify. After, the rail follows the note's sections and reuses each line's words.](images/fn-rail-wording-before-after.png)

*The rail before and after the wording rules, shown in the grayscale wireframe where the rules were set.*

With those rules in place, the rail reads like a table of contents for unfinished work. Per-type counts moved out of the list and into one summary line at the top, "4 to verify, 1 with no source, 2 not in note."

---

## Worked example: Dennis's note

Dana opens Dennis's draft at the end of the day. Seven items are open in the rail. Four are checks still waiting, one is a line with no source, and two are things from the visit that never made the note. She's already verified the allergy line and the A1c order. The sign button is locked.

![The selected metformin check. It shows Metformin 500 mg twice daily changing to 1000 mg twice daily, a daily total of 1,000 to 2,000 mg, and three transcript moments: 07:09 marked Draft used this, 07:18, and the 09:13 recap.](images/fn-metformin-check.png)

*The check puts the moment the draft used next to the two moments that disagree with it.*

**The dose (Error 1).** This is the hardest one to catch, since 1,000 mg twice a day is a perfectly normal dose. The check shows the change as before and after, and puts the daily total on its own line, 1,000 → 2,000 mg. Below that sits every moment the dose came up in the visit, with the one the draft used marked. At 07:09 Dana floats a thousand twice a day. At 07:18 she drops it. Her recap at 09:13 says 1,000 in the morning and 500 at night.

The system can't know the draft is wrong. If it could, it would have written the right dose. What it can do is set the moment it used next to the moments that disagree, so Dana sees the conflict on screen and doesn't have to dredge it up from a visit eight hours old.

For more context, the Transcript button opens the full transcript next to the note, scrolled to 07:09, with all five dose mentions marked. The note narrows to make room, and the line and its source stay side by side.

![The transcript drawer open beside a narrowed note. It was opened from the metformin change, five dose mentions are highlighted, and 07:09 is outlined as the moment the draft used.](images/fn-transcript-drawer.png)

*The full transcript, scrolled to the moment the draft used, with every other dose mention marked.*

She edits the line to 1,000 mg with breakfast and 500 mg with dinner. The daily total drops to 1,500, and the edit goes into the attestation.

**The unsupported line (Error 2).** "Denies chest pain or shortness of breath" carries a No source badge, the words "Not found in the transcript," and an amber dashed border. The three negatives around it, which she did ask about, stay plain. She can delete it, or keep it if she remembers asking. The record shows which.

**The missing symptom (Error 3).** The lightheadedness sits in the history as a suggested line, right after the sentence about Dennis walking his dog, roughly where Dana would have put it herself. It carries the timestamp and a note that she gave advice at 02:25. One click adds it.

Dismissing it brings up a second look. The card quotes what she told Dennis at the time ("If it gets worse, or you ever fall or pass out, I want you to call me") and says that dismissing leaves her advice out of the signed note. Add is the primary button. Dismiss takes one more click and asks for no reason. The bikes comment just below goes away in one click. Dana did mention the bikes again later ("Your wife's onto something"). That was encouragement, and there's no advice for the note to carry.

![The lightheadedness suggestion with its second look open. A panel quotes the NP's advice at 02:25 and says dismissing leaves that advice out of the signed note. Add here is the primary button, with Dismiss anyway beside it.](images/fn-second-look.png)

*Dismissing a suggestion she gave advice about asks once before it goes.*

Seven items resolved. The sign button unlocks.

---

## Signing that means something

Attestations on scribed notes today are mostly a fixed sentence. One health system's documentation guide lists the shortcut codes clinicians type to insert theirs, with separate codes for the provider and the scribe. Microsoft's Dragon Copilot docs walk through adding a standard statement, attestations included, to every AI-written note. That sentence is identical whether the clinician checked every line or none.

I wanted the signature to carry a record of the review. Pressing Sign opens a summary:

- **What she changed,** with the old line struck through next to the new one
- **What she verified**
- **What she dismissed**
- **What was available to skim:** the 45 lines with transcript sources and no individual check

![The Review and sign dialog. It lists three changes (the edited metformin dose, the deleted chest pain line and the added lightheadedness), five verified items, one dismissed suggestion, 45 lines available to skim, and the attestation sentence.](images/fn-review-and-sign.png)

*The summary before signing. The attestation sentence is built from these counts.*

The attestation sentence is built from those counts. Dana's reads, "I verified 5 items, made 3 changes, and dismissed 1 suggestion. The note as edited reflects the visit." A clinician who verified two items and changed nothing would get a different sentence.

I care most about the skim line. Writing an attestation that implies she read everything would be easy. This one says what she checked and names the rest, and it claims nothing the review can't back up.

**The same screen when review fails.** Dana catches all three errors, and plenty of clinicians won't. So I designed a second version of the summary, for a clinician who caught the unsupported line, verified the wrong dose, and dismissed the lightheadedness even after the second look.

![Two Review and sign dialogs side by side. The first lists three changes. The second lists one change, the metformin line verified at 2,000 mg a day, and the lightheadedness dismissed after a second look.](images/fn-sign-all-caught-and-misses.png)

*The same summary for a clinician who caught all three errors and one who caught one.*

It doesn't call her wrong. It shows that she confirmed 2,000 mg a day and set aside a symptom she had given advice about in the visit, so if Dennis runs into trouble months later, anyone reading the chart can trace exactly what she confirmed at signing.

I also considered recording whether she opened each source. That would make the record more complete. It would also make review feel watched. I'd expect a clinician who knows her clicks are logged to open every source for the record instead of reading them. The record keeps what she decided. How she got there stays with her.

**After signing.** The note locks. The rail turns into a review record listing who signed, what changed, what was verified or dismissed, and what stayed as the AI wrote it. Edited and added lines keep a small marker in the note, and any later change goes through an addendum.

![The signed note. The header shows Signed 10/14/2026, 5:42 PM. The rail has become a review record of changed, verified and dismissed items, edited and added lines keep a small badge, and the attestation sits at the bottom of the note.](images/fn-signed.png)

*After signing, the note locks and the rail becomes a record of the review.*

---

## States that don't turn the page yellow

How do you flag risk without turning every line yellow? In a systematic review of medication-order alerts, clinicians overrode between 46% and 96% of them. Highlight everything and you teach people to ignore highlights, so I kept color scarce and ranked it by risk.

On the full page, my first pass had two problems. Two blue omission cards outweighed the single amber line, so the eye went to the omissions first, the reverse of their risk. The selection outline also used the kit's pale focus ring, which made the selected line look weaker than it did in grayscale. Two token changes fixed both. The omission cards lost their blue fill, and the selection outline moved to the primary color. Amber became the only filled state on the page, and because the fix lived in the tokens, every screen updated at once.

![The same part of the note before and after the color rebalance. Before, the two omission cards have a blue fill and the selected line has a pale outline. After, the omission cards are white and the selected line has a dark outline, leaving amber as the only filled state.](images/fn-color-rebalance.png)

*Two token changes made amber the only filled state on the page.*

A later critique pass found two more. Open verify lines carried a dark left bar, and four of them stacked in the orders were the heaviest marks in the note, darker than the amber line. I removed the bar and let the Verify badge carry the state. The rail also set its omission rows larger than its verify rows, which made "lightheaded getting up" look more important than the dose change. Every rail row now uses one size.

| State | Treatment | Why |
| --- | --- | --- |
| No source | Amber fill, dashed amber border, "Not found in the transcript" | The most dangerous error gets the loudest state |
| Not in note | Blue border, tag, and text on a white fill | Content she might add. Visible, and quieter than amber. |
| Verify | Outline badge with an empty circle, no color | The most common open state. Color here would spread across the page. |
| Verified | Forest check, faded text, Undo until signing | Never a fill, so the page calms down as she works |
| Edited, Added, Deleted | A small label with no color and no icon | These are records of what she did, so they stay plain |
| Selected | Forest outline | Marks the current item, in the rail and in the note |

States that ask for her attention get an icon, and records of what she decided don't. Every state also has a label and a shape, so it reads without color, for someone with color blindness or anyone holding a printout. Dennis's note ends up with one amber line, two blue cards, and six neutral checks.

**Giving it a look.** With the hierarchy settled in grayscale, I wanted a visual layer a clinician could look at for an hour at the end of a long day. Fieldnote uses sage neutrals, one forest green accent for anything confirmed or current, and Figtree throughout. The note sits as a white page on a sage surface. The palette stays away from amber and blue, so it never competes with the states.

![The review screen in grayscale next to the same screen in the Fieldnote theme, with sage neutrals, a forest green accent, and the note as a white page on a sage surface.](images/fn-grayscale-and-fieldnote.png)

*The grayscale hierarchy, then the Fieldnote visual layer on top of it.*

**Building it into the system.** The review states are their own token collection in my shadcn library, each pointing to a kit color and scoped to text, fill, or border. The Fieldnote theme is a mode across five collections (theme, colors, review states, corner radii, and typography). Switching a screen to that mode restyles it all the way down, including inside the kit's Button and Badge, without detaching anything.

![The Figma variables panel showing the review states collection, with a token for each state and a Fieldnote mode beside the default.](images/fn-review-states-tokens.png)

*The review states collection and the Fieldnote mode in the shadcn library.*

---

## From frames to a working prototype

Static frames can't show whether the review feels quick, or whether every state holds up once it has to work. So I built a clickable prototype in React with shadcn/ui, the same library the Figma file uses, with the review state tokens carried over under the same names. I don't write production code. I directed Claude Code with written specs, one step at a time, reviewed each step against the Figma frames, and made the design calls as they came up.

**Try it:** [fieldnote-prototype.vercel.app](https://fieldnote-prototype.vercel.app/). It works best on a desktop browser, and the Shortcuts link lists the keys.

Building it turned up three problems the frames had hidden.

**The decoy wasn't clean.** At 08:03 Dana brings the bikes back up ("Your wife's onto something"). Under my original rule, a second look for anything she responded to, the bikes comment needed one too, and the sign summary's "You didn't respond to it" was false. I narrowed the rule to advice and instructions. That still covers her 02:25 warning about falls, and the bikes comment goes back to one click. The fix also gave me a sharper open question, listed at the end.

**The skim count was a placeholder.** The frames said 24 lines were available to skim. Counted from the full note, the number is 45. The prototype counts it from the note itself, so the attestation can't understate how much went unchecked.

**The record showed the wrong dose.** The signed review record first reused the rail's wording, so the edited metformin item read "500 → 1000 mg twice daily," the dose she had just corrected. A record of an edit has to show what was signed, so the item now reads "Edited metformin 1000 mg AM, 500 mg PM."

The prototype also runs from the keyboard. J and K move between open items, V verifies, A adds a suggestion, and D dismisses, so a clinician can clear a note without reaching for the mouse. I kept motion to the moments where something changes. The daily total counts down from 2,000 to 1,500 when she fixes the dose, the second look opens inside its card, and the transcript slides in while the note narrows to make room. With reduced motion turned on, each step shows its end state right away.

> **[VISUAL — CLIP]** `videos/fn_dose-check.mp4`. Label: "Selecting the metformin change shows the 07:09 moment the draft used above the 07:18 moment that contradicts it. The dose is edited to 1000 mg with breakfast and 500 mg with dinner, and the daily total counts down from 2,000 to 1,500 mg." The same clip loops in the hero.

> **[VISUAL — CLIP]** `videos/fn_second-look.mp4`. Label: "Pressing Dismiss on the lightheadedness suggestion opens a second look quoting the NP's advice at 02:25. Add here puts the line into the note."

> **[VISUAL — CLIP]** `videos/fn_no-source.mp4`. Label: "Selecting the amber line with no source and deleting it. The line is struck through and the rail's open count drops by one."

> **[VISUAL — CLIP]** `videos/fn_sign.mp4`. Label: "With every item resolved, Sign note opens the summary. Signing locks the note and turns the rail into a review record."

---

## How I'd validate this

I haven't tested this with clinicians. So far it rests on published research, a look at how current scribe products handle sign-off, and four years of designing pharmacy software. Here's how I'd test it.

**Who and how.** Three to five primary care clinicians (physicians, nurse practitioners, physician assistants, or family medicine residents), in two rounds with one design change in between. Each session is 30 minutes on a video call:

1. **Warm-up, 5 minutes.** How do you review notes today, and what do you trust about AI scribes?
2. **Task, 15 minutes.** "Review and sign this note the way you would at the end of the day." They think aloud, and I give no hints about the errors.
3. **Reveal and debrief, 10 minutes.** I show them anything they missed and ask what would have caught their eye, and what felt like too much friction.

The task uses Dennis's note and its three seeded errors, plus the bikes comment as a low-value decoy so the real omission has company. I'd record which errors each person caught and when, time to sign, and which sources they opened. Tracking source views is fine here because it's research, done with consent, and it stays out of the clinical record.

**What would change the design:**

| If I see this | It means | What I'd change |
| --- | --- | --- |
| They verify the metformin line without reading the sources | Verifying costs too little to make anyone look | Flag lines where the transcript mentions more than one dose for the same drug |
| They read the sources and still miss the dose | Showing every moment isn't enough on its own | Pull the conflicting numbers into the check itself, next to the daily total |
| They click through the second look as fast as the first dismiss | The prompt is turning into a speed bump | Change its wording, or make adding the line easier than dismissing it |
| They dismiss the lightheadedness and the bikes comment the same way | The list reads as noise | Rank omissions, and show the ones the clinician gave advice about first |
| They use the rail and stop reading the note | The rail is pulling attention off the record | Test a smaller rail |
| Time to sign runs far past what they'd accept today | The tiers ask for too much | Move items between tiers, starting with the orders |

Round one shows sources by default on must-verify lines, and round two shows them on click. If the default doesn't catch more dose errors, it's clutter. If live sessions don't happen, a clinician recording a 10-minute review on their own schedule is an easier ask.

---

## What I'd measure, and what's next

In production, the hard part is telling real review from review that only looks real. I'd watch the spread of time to sign more than the median, since a clinician who signs every note in the same few seconds probably isn't reviewing. Edit rates by tier show whether the checks catch real errors. I'd also track how often clinicians keep No source lines (if they keep most of them, the transcript matching is missing things) and how often the second look turns a dismiss into an add. None of these count the errors that slipped through, so I'd add a periodic audit of signed notes against their transcripts, the way the UC San Diego pilot reviewed scribe quality.

**Open questions.**

- **How many omission candidates does a typical visit produce?** Dennis's note has two. If a real visit produces ten, the list will need ranking.
- **How reliably can a system tell advice from a passing acknowledgment?** The second look depends on it, and the bikes comment at 08:03 is the test case.
- **Should clinicians be able to move a line between tiers?** Some will want to check every medication, unchanged ones included.

**What I'd design next.** Clinician testing, as soon as I can recruit for it. Then the end-of-day queue, so a clinician can see which drafts have open items before opening any. And a flag for lines where the transcript mentions more than one value, which would put Error 1's kind of mistake in front of the clinician before she verifies.

**The short version.** Dana should sign an AI draft the way she'd sign an order someone else wrote. She checks what could hurt Dennis, sees where each line came from, and signs a record of what she actually did. You can [try the prototype](https://fieldnote-prototype.vercel.app/) and catch the dose yourself.

---

## Sources

1. UC San Diego Health pilot. "Quality of Clinical Notes Created by Ambient Listening Generative AI: Pragmatic Prospective Pilot Study." JMIR Medical Informatics, 2026. https://medinform.jmir.org/2026/1/e86474
2. Blease C, et al. "Ambient AI in primary care: an exploratory mixed methods survey of UK general practitioners." BMJ Health & Care Informatics. DOI: 10.1136/bmjhci-2025-101847
3. The Permanente Medical Group ambient AI scribe rollout, NEJM Catalyst, as reported by the AMA. https://ama-assn.org/practice-management/digital-health/ai-scribe-saves-doctors-hour-keyboard-every-day
4. "One note in three: a verified census of three deployed AI scribes, and the instrument that counted it." arXiv:2608.31017, August 2026. Preprint, not peer reviewed.
5. Comparison of 11 ambient AI scribe platforms with human clinicians, Annals of Internal Medicine, as reported by MDLinx. https://www.mdlinx.com/article/ai-scribes-hit-the-modest-savings-chapter-humans-still-write-better-notes/45q0RFu1TXXANhykDVbB02
6. Abridge Support Center, "Get Started Using Abridge." https://support.abridge.com/hc/en-us/articles/30287281533715-Get-Started-using-Abridge-Ambient-Note-taking, and Web Editor Basics, https://support.abridge.com/hc/en-us/sections/30235080804243-Web-Editor-Basics
7. Cooper Health, Clinical Documentation Improvement Tip Sheet #3: Attestations. https://blogs.cooperhealth.org/ctd/files/2019/02/Attestation-Tip-Sheet-3-Final.pdf
8. Microsoft, "How to add a standard statement," Dragon Copilot support. https://support.microsoft.com/dragon-copilot/physicians/how-to-add-a-standard-statement
9. Poly TN, Islam MM, Yang HC, Li YC. "Appropriateness of Overridden Alerts in Computerized Physician Order Entry: Systematic Review." JMIR Medical Informatics, 2020. https://medinform.jmir.org/2020/7/e15653

---

## Notes for you

Not rendered.

- **Images.** Figma export names map to site names: fig-01-directions-a-to-d → fn-directions-a-to-d, fig-02-review-e → fn-review, fig-03-rail-wording → fn-rail-wording-before-after, fig-04-metformin-check → fn-metformin-check, fig-05-transcript-drawer → fn-transcript-drawer, fig-06-second-look → fn-second-look, fig-07-review-and-sign → fn-review-and-sign, fig-08-f-and-f2 → fn-sign-all-caught-and-misses, fig-09-signed → fn-signed, fig-10-color-rebalance → fn-color-rebalance, fig-11-grayscale-and-fieldnote → fn-grayscale-and-fieldnote. fig-00-hero-f-and-f2 isn't used on the page.
- **Figure 12** (fn-review-states-tokens) still needs a hand-taken screenshot of the library's variables panel.
- **Clips.** From the prototype's clips folder: dose-check, second-look, no-source and sign become fn_dose-check, fn_second-look, fn_no-source and fn_sign, each with a webm and a poster. They run 6 to 14 seconds, longer than the site's 3 to 5 second guideline, because each shows a multi-step interaction. transcript.mp4 isn't used.
