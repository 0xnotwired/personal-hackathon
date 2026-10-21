# Reference notes — Hackathons Unboxed

Date: 2026-10-21. Purpose: trace the book's influence on our decisions, without
reproducing the book or treating its advice as event rules.

## Source and reading scope

Alvin Chia, *Hackathons Unboxed: A Field Guide to Ideating, Leading and Winning*,
Marshall Cavendish Business. ISBN 978-981-4779-25-8. The supplied scan's copyright
page says 2018; its cataloguing entry says 2017. Page references below identify
this specific supplied scan rather than assuming another edition's pagination.

The uploaded PDF has 164 pages. For the cited numbered body pages, printed page
`p` corresponds to PDF page `p + 2`. Its SHA-256 is
`4941630a6bda634fce72ee78c3e5a7730845d3613fb25b0f95ffe62d2135d810`.
The source PDF and extracted text remain outside the project checkout and must
not be bundled with a public submission. Notes below are our own paraphrases.

Reading focused on insights preparation, human-centred design, experimentation,
mentorship, pitching/judging and follow-through. This is an application of those
sections, not a claim to have independently verified the author's examples.

## Source-to-decision map

| ID | Printed pages / PDF pages | Paraphrased book guidance | Our application |
| --- | --- | --- | --- |
| B01 | 34–35 / 36–37 | Identify the problem, intended people, and why it matters; qualitative research helps explain behavior | A narrow behavioral segment and explicit hypotheses in [PRODUCT.md](PRODUCT.md) |
| B02 | 54–65 / 56–67 | Consider functional, emotional and social needs; make persona/ecosystem assumptions explicit | Separate ability, confidence, autonomy and support needs; no invented interview findings |
| B03 | 68–79 / 70–81 | Combine contextual observation and conversation; retain observations before interpreting themes | Non-leading field protocol and raw-observation-to-insight traceability in [VALIDATION.md](VALIDATION.md) |
| B04 | 80–84 / 82–86 | Find the tension behind an insight and turn it into a bounded question | Test the tension between wanting independence and fearing an unrecoverable mistake |
| B05 | 94–96 / 96–98 | Combine complementary ideas into a concept and show its value through a customer storyboard | Use the teammate's home sketch as the entrance to one coherent guided procedure |
| B06 | 97–110 / 99–112 | Identify risky desirability, viability and feasibility assumptions; define observable experiments and learn from them | Test comprehension/control and provider capability early, before adding breadth |
| B07 | 112–115 / 114–117 | Actual attention, time, action and repeat engagement are stronger signals than praise alone | Observe task behavior and offer an optional repeat session; no monetary pledge or personal-data collection required |
| B08 | 135 / 137 | Mentors can challenge audience, insight quality, differentiation and viability | Prepare precise questions with an artifact and a decision to inform |
| B09 | 136–149 / 138–151 | Confirm pitch duration; show problem, solution, experience, evidence, opportunity and differentiation; rehearse and keep a fallback | Our user-confirmed 3–5-minute format and honest live/recorded backup paths in [DEMO_AND_PITCH.md](DEMO_AND_PITCH.md) |
| B10 | 150–153 / 152–155 | Illustrative judging dimensions include relevance, insights, ambition and presentation | An internal review lens only; the user reports no published judging criteria |
| B11 | 154–157 / 156–159 | Continue learning and organize ownership after the event | Provider/operational release gates, named responsibilities and a post-event pilot plan |

## Adaptations that matter

1. **A usable product is the destination.** The book recommends quick experiments
   and varying prototype fidelity. We use sketches to learn, not as a substitute
   for the working product the user explicitly requested. Transaction authority,
   persistence, accessibility and recovery are built into the application.
2. **The book is not this hackathon's rulebook.** Its corporate/DBS examples, time
   formats and sample judging form do not establish our event's scoring or rules.
   The user confirmed a 3–5-minute pitch and no published criteria.
3. **Heuristics are not statistical proof.** The author's sample sizes, success
   percentages and time/budget suggestions are contextual practitioner advice.
   Our small exploratory studies report counts, versions and limitations. A
   favorable session is not evidence of population-wide adoption or causation.
4. **Behavior beats applause.** Likes, compliments and signups do not establish
   that a person understands a pending payment, can recover, or will use this
   product independently. Those need task observations and a repeat task.
5. **No concealed manual payment.** A book example uses human effort to simulate
   an automated service. We do not secretly transact for participants or present
   manual intervention as working software. Any facilitator-operated sketch,
   simulated payment, video or fallback is disclosed as such.
6. **No real-money validation experiment.** We do not solicit deposits from older
   adults or use their bills/credentials to validate desirability. Live operation
   belongs to an explicitly authorized, verified integration and a distinct
   operational release gate.
7. **Current tools need current verification.** Tool names and price examples in
   an older book are not current recommendations or cost evidence. Our repo reuse
   list is in [ARCHITECTURE.md](ARCHITECTURE.md).

## Evidence boundary

The book supports the methodology, not the claim that our product works or will
win. Those claims require our own product runs, user observations, provider
evidence and the event result. All such claims begin unverified in
[EVIDENCE_LEDGER.md](EVIDENCE_LEDGER.md).
