# User research, experiments and release evidence

Status: protocol only; **zero participant sessions or application tests have
been executed for this protocol**. Date: 2026-10-21.

[Product hypotheses](PRODUCT.md) · [Evidence ledger](EVIDENCE_LEDGER.md) · [Book sources B01–B07](BOOK_REFERENCE.md)

## Decisions these studies should inform

Can the intended person understand and complete the supported procedure without
someone taking over? Which obstacle actually prevents that? Is spoken help useful
to this person? Can the chosen provider deliver the real operation? These are
separate questions; do not answer all of them with “participants liked the app.”

Use sketches to answer interaction questions cheaply. Clearly disclose any
facilitator-operated behavior. Sketch findings cannot establish software
reliability, speech recognition, data persistence or payment settlement.

## Recruitment and care

Recruit people who match the behavioral segment, including different digital
experience and accessibility needs. Do not select only relatives who want to
encourage the team. Record the recruitment channel and sample limitations.

Proposed first exploratory cohort: **5 participants**, followed by a changed
version with new participants if possible. This is a practical team planning
choice, not a sample-size rule from the book or proof of population performance.
Do not reinterpret a smaller convenience sample as the original target met.

Participation is voluntary and can stop at any time. Explain that the product,
not the person, is being tested. Use synthetic bills, names and accounts. Do not
request real passwords, PINs, banking screens, health details or financial data.
Use anonymous IDs in the repo; consent and any recontact details stay separately
secured with a responsible human. No participant outreach or recording has been
authorized or performed by the agent.

Study introduction in es-AR:

> “Estamos probando si nuestra herramienta explica bien los pasos. No te estamos
> evaluando a vos. Usamos una factura inventada: no se va a mover dinero real.
> Podés parar cuando quieras. ¿Querés participar?”

Ask separate consent for audio/video or quotations; default to handwritten
sanitized observations. Do not assume consent to participate permits publicity.

## Discovery interview before showing the solution

Suggested 15–20-minute format, adjustable to the participant, not an event rule.
One person facilitates, another notes if available; avoid an intimidating group.

1. “Contame la última vez que necesitaste pagar un servicio o hacer un trámite.”
2. “¿Cómo empezaste? ¿Qué hiciste después?”
3. “¿En qué momento necesitaste ayuda o decidiste dejarlo?”
4. “¿Qué necesitabas saber antes de confirmar?”
5. “¿Cómo te enteraste de si había terminado bien?”
6. “Si te equivocaste o no apareció un resultado, ¿qué hiciste?”
7. “¿Qué ayuda te sirve? ¿Hay ayuda que te resulte incómoda?”

Ask about a recent event; do not lead with “¿te da miedo?” or “¿usarías nuestra
app?”. Observation uses a synthetic or safely reconstructed task, not inspection
of personal banking. Capture **what was seen/heard**, then interpretation in a
separate column. A persona or insight changes when evidence contradicts it.

## Experiment queue, ordered by decision risk

| ID | Hypothesis / scope | Experiment and observation | Decision before expanding |
| --- | --- | --- | --- |
| E01 | H1: consequence clarity and recovery address the main obstacle | Observe a bill-review task, then ask for payee, amount, status and next action in the participant's own words | If comprehension fails, change copy/sequence before visual polishing or adding procedures |
| E02 | H2: speech helps some intended users | Let the participant choose text or spoken help; observe use of repeat/slower/mute and task behavior | Do not force voice; identify who benefits and preserve a complete text path |
| E03 | H4: learning transfers | Later present a different synthetic bill through the same procedure, without coaching | If they need takeover again, revise guidance rather than claim digital autonomy |
| E04 | Recovery remains understandable | Safely inject interruption, pending result or lost response; observe next action | If they try to pay again while status is unresolved, treat it as a release-blocking misunderstanding |
| E05 | Browser speech is feasible | Test real input/output on physical Android Chrome and iOS Safari; record versions and processing route | Resolve adapter/target support early; mocks do not establish speech capability |
| E06 | Real utility-bill execution is feasible | Inspect actual provider documentation and an approved sandbox flow with utility bill lookup/settlement/status capabilities | Merchant checkout or a deep link alone cannot pass the payment-provider gate |
| E07 | A distribution/buyer channel is plausible | Present the observed problem, complete journey and operational requirements to a potential sponsor | Record an actual next step, not a partnership claim; no outreach performed yet |

E01 and E06 begin early: understanding and provider capability are independent
ways the product can fail. E05 also starts before speech implementation spreads.
Their results may change architecture; an experiment is not a commitment to keep
the original idea regardless of evidence.

## Task script for the working application

Use the same released test version and synthetic scenario for the cohort.

1. Give the person a synthetic utility bill and the starting task, without a
   walkthrough: “Querés resolver esta factura. Mostrame cómo lo harías.”
2. Let them choose voice or text. Use neutral prompts such as “¿Qué estás
   pensando?”; do not point at buttons. Record any assistance immediately.
3. At review, ask what will happen, to whom, and for how much. Record their answer
   before explaining. An incorrect answer triggers intervention before confirmation.
4. Allow correction/back navigation. Later interrupt/reopen or inject one safe
   pending/error scenario. Ask what they believe happened and would do next.
5. After the task, use a second synthetic bill to test transfer. Do not coach
   them on the earlier mistake before this measurement; if safety requires help,
   mark the second task assisted rather than pretending it was independent.
6. Ask what felt clear, confusing or uncomfortable, and which help they chose.
   Invite a voluntary second session; do not require a signup or payment.

Never let a research task become a real financial operation. Operational pilot
validation has a separate provider/privacy/authorization gate and protocol.

## Measures and provisional thresholds

Freeze definitions, cohort target and thresholds before the first measured
session. These are **internal engineering/research decisions**, not book rules,
official judging criteria, or results.

| Measure | Definition | Initial decision threshold |
| --- | --- | --- |
| Correct independent completion | Supported task completed with correct outcome and no facilitator pointing, taking over or providing the next action; product help is allowed | Target at least 4 of the planned 5 first attempts; report `x/n` and every assistance |
| Confirmation comprehension | Participant correctly identifies payee, amount and the action about to occur before confirming | Require correct understanding at every observed confirmation; any unsafe misunderstanding triggers correction and redesign |
| Outcome comprehension | Participant distinguishes paid, pending, failed and cancelled in the scenarios they actually encounter | Any belief that pending equals paid, or that uncertain means safe to pay again, blocks that scenario's release |
| Transfer | Correct independent second synthetic-bill task, reported separately from first attempts | Target 4/5; failure reopens H4, even if first-task results look good |
| Recovery | Resume same entered values or explain unresolved result without creating another payment | All tested recovery cases preserve state and avoid duplicate operation; software gate plus participant observation |
| Voice usefulness | Chosen help mode, whether it unblocked a step, and confusion/abandonment | Descriptive findings by participant/device; no fabricated universal preference percentage |
| Self-reported confidence | Optional before/after answer to the same simple question | Report as self-report, separate from observed competence; confidence without comprehension is not success |
| Time and errors | Task duration, pauses, error/retry and assistance points | Diagnostic measures; no speed target that pressures the user or skips review |

For incomplete or stopped sessions, retain the reason and report them separately;
do not silently remove them from the denominator. A team-only run, facilitator
walkthrough, accessibility audit and target-user session have different labels.
Never combine different versions/cohorts into a single improved percentage.

## Observation and result templates

Create a new sanitized record per run; no records have been filled yet:

```text
Study ID / participant pseudonym / date / consent scope:
Recruitment channel and relevant accessibility needs (minimum necessary):
Build/commit / device / OS / browser / speech mode:
Task/scenario / expected provider state:
Raw observation or consented quotation:
Assistance given / stopped task and reason:
Completion / confirmation understanding / result understanding / second task:
Interpretation and rival explanation:
Change proposed / owner / retest required:
```

Aggregate reporting sentence, only after real data exists:

> “En [versión], [x] de [n] participantes completaron [tarea sintética] sin ayuda
> del facilitador. [a] necesitaron ayuda y [b] no terminaron. La muestra fue
> [canal de reclutamiento]; no medimos pagos reales ni adopción sostenida.”

Do not copy the template into the pitch with invented counts. When no study has
run, say that validation remains pending and describe the protocol.

## Learn, change, retest

Keep a short chain: observation → interpretation/hypothesis → proposed change →
retest → current claim in the [ledger](EVIDENCE_LEDGER.md). Praise and confusion
both remain visible. Do not cherry-pick a favorable quote or average away a
financial misunderstanding. If several plausible causes remain, test the
cheapest discriminating alternative instead of changing everything at once.

If the product fails the target, revise the affected module and test it again;
do not weaken the threshold after seeing results. If the segment does not need
the solution, or provider execution is unavailable, revisit the product decision
and disclose the consequence rather than labeling the same simulation usable.

## Software and operational evidence

The application plan already assigns tests to each module. User observation is
additional evidence, not a replacement for confirmation/idempotency/ownership,
restart, cancellation and accessibility tests. Likewise, passing software tests
does not establish comprehension, trust or sustained independent use.

For operational readiness, retain provider sandbox evidence, security and privacy
review, supported-device matrix, restore drill, support escalation check and
actual end-to-end provider reconciliation. Keep all raw sensitive artifacts
outside the public repo and link only sanitized approved summaries.
