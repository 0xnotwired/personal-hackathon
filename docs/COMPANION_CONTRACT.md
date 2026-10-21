# Companion contract — adapting Ímpetu

Source inspected: [Ímpetu agent/prompts.py at 2e90c8f](https://github.com/annatchijova/impetu/blob/2e90c8f4ccd96f056a7d054e16545d61177e3bf6/agent/prompts.py).
Apache-2.0, Copyright 2026 Anna Tchijova. Adapted files and notices are in NOTICE.
This is a product-specific adaptation, not adoption of upstream instructions.

## Destination

Help a person start and understand their next action while retaining control.
Technology unfamiliarity never authorizes infantilization, diagnoses or deciding
for someone. Our audience is older adults with very low digital familiarity;
Ímpetu's ADHD/autism audience is not evidence that the populations are equivalent.

## What changes in this product

| Ímpetu principle | Our concrete behavior | Boundary |
| --- | --- | --- |
| Starting can be harder than a plan | One visible next action and an optional concrete example | No full plan dumped into the bill step |
| Negotiate, do not command | Help offers “Podés…”; refusal, back and pause remain available | Direct factual button labels remain clear, never euphemistic |
| Produce the useful first draft | The bill-example button fills only a synthetic number; safety help supplies editable reply text | No submission, sending or account action |
| Hold the thread | Persist step, entered code, favorite and speech preference | Stored data is not authorization; server verifies review/result |
| No shame or over-praise | Errors describe what happened and the available next move | No guilt, streaks, nagging, diminishing language or emotional diagnosis |
| Be honest about uncertainty | Lost responses lead to owned status lookup, not automatic replay | Failed, pending, unknown and cancelled remain distinct |

Do not carry over instructions to use background subagents, hide delegation,
access mail/calendar, schedule nudges, infer energy or avoid real crisis support.
Those are upstream product decisions, not requirements for this simulator.
No LLM or Google integration is added. Approved text is the same source for
written guidance and optional speech. User-created message text is never spoken
as instructions or persisted as a preference.

## Copy review

Prefer “Podés usar este número de ejemplo” over “Es muy fácil”. Prefer
“No encontramos esa factura de práctica. Usá uno de los ejemplos” over
“Te equivocaste”. Prefer “El registro confirmó la cancelación” over “Ya está”
when cancellation is actually verified. Avoid “pasito”, “abuelito”, “deberías
saber”, “si no lo hacés ahora”, inflated congratulations and therapeutic openers.
Do not ban explanations of basic controls: our audience may need an explicit
example even though Ímpetu's original audience sometimes does not.

`app/lib/companion.ts` is the approved per-step next-move catalogue. The help
modal's “Mostrarme el próximo paso” reveals it; the example button requires
activation. A help request, spoken phrase, saved preference or pasted message
cannot reach `commitProcedure`.

## Evidence and acceptance

`tests/e2e/safety.spec.ts` exercises smaller-step help, requested field filling,
no auto-confirmation, quoted message evidence, inconclusive output and text clearing.
`tests/flow.test.ts` protects review, repeats, old-result guards and preserved fields.
These checks establish software behavior only. Respectful tone and independence
still require copy review and unassisted target-user observation under VALIDATION.md.
