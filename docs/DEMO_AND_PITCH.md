# Demonstration, pitch and questions

Status: rehearsal material, **not a claim that a demo exists**. Date: 2026-10-21.

[Strategy](HACKATHON_PLAYBOOK.md) · [Product](PRODUCT.md) · [Claim register](EVIDENCE_LEDGER.md)

The user reports a 3–5-minute pitch and no published judging criteria. Prepare
both durations. Confirm whether questions are inside that window. The spoken
scripts below are intentionally es-AR; the planning instructions stay English.

## What the audience should remember

**“Entendé cada paso. Decidí vos.”** The contribution is a procedure a person can
understand and control, including what happens after interruption or uncertainty.
Show that behavior. A stack diagram, chatbot conversation or grid of task icons
cannot substitute for it.

Use one fictional scenario consistently: a synthetic utility bill, “Luz Ejemplo”,
ARS 15,000. This is not a participant quotation or a real account. The finished
product uses synthetic services throughout; no live transaction is needed.

## Demonstration readiness and fallback

The following is a **target sequence to implement and rehearse**. Do not present
future behavior as working software. Select only a build that has passed the
relevant checks and register its exact commit/device in the evidence ledger.

| Beat | Person's action | What we should visibly prove |
| --- | --- | --- |
| Start | Select “Pagar una factura” at home | The teammate's simple task-first design opens a working journey |
| Ask | Tap “Escuchar ayuda” or speak a supported help command | Spoken help matches the visible step; controls and text path remain available |
| Review | Inspect payee and amount; return to correct if needed | The person remains the decision maker, with no auto-submit |
| Interrupt | Reload before committing and resume | Same entered values and step; do not replay a payment |
| Confirm | Explicitly activate confirmation | One provider operation with an authoritative result |
| Resolve | See receipt, or reconcile pending/uncertain result | The UI never fabricates “pagado”; cancellation is capability-bound |

The 3-minute version shows one interruption/recovery and a confirmed result.
Reserve cancellation or a pending-result alternative for the 5-minute version or
questions. Do not race through multiple failures that hide the core experience.

Keep **“Modo práctica — no se mueve dinero”** visible in the finished app and
presentation. The complete product is a practice simulator; receipts are practice
receipts. There is no pending real-payment integration gate.

Before stage time, the operator checks browser/device/audio, microphone consent,
projector zoom, network route, server/ledger state and a fresh synthetic session.
Reset only test-owned synthetic data via a tested script; never clear a live
ledger or another user's data. Close unrelated apps and disable notifications.

Fallback order, prepared in advance:

1. A recording of the same actual tested build, labeled with its build and
   “grabación”. Do not cut away failure or manually operated work while claiming
   one uninterrupted autonomous run. Keep real duration or disclose editing.
2. Stills of the actual build, clearly identified as a walkthrough rather than
   an interactive demonstration. Explain only what those artifacts establish.
3. Printed cue cards: keep speaking, state that the live demo is unavailable,
   and describe the supported evidence without pretending the software just ran.

Say: “La demostración en vivo no está disponible; les muestro una grabación de
la misma versión probada.” A failure does not imply extra stage time.

## Three-minute structure — 180 seconds total

These are rehearsal allocations, not measured delivery times or official slots.
Time actual runs and edit the script to fit; do not solve overruns by speaking
faster or making UI steps unreadable.

| Time | Material | Intended audience takeaway |
| --- | --- | --- |
| 0:00–0:25 | Problem and plain-language product | What procedure, for whom, and why understanding matters |
| 0:25–0:45 | What changes for the person | Written/spoken guidance, personal control, recovery |
| 0:45–1:55 | Actual journey or disclosed recording | One concrete task and a visible interruption/recovery |
| 1:55–2:20 | Actual evidence or honest pending status | What has been observed, in which version and sample |
| 2:20–2:45 | Operational path and distinction | Complete practice, repeat exercises and why this is more than shortcuts |
| 2:45–3:00 | Contribution and close | The same clear message, not a list of future features |

## Three-minute spoken draft

Adapt the tense to the claim register before delivering. **Current planning-only
state:** use the opening/product proposal and openly state that implementation
and validation are pending. The demonstration/factual branches below may be used
only when earned; this file is not a finished results-based pitch.

**Opening:**

> “Para una persona que no conoce un trámite digital, confirmar un pago exige
> entender a quién le paga, cuánto y qué puede hacer si algo sale mal.
> Autonomía Digital está pensada para acompañarla durante todo ese recorrido,
> con instrucciones claras, ayuda por voz y decisiones que siguen siendo suyas.”

**Experience:**

> “La entrada es simple: elegís la tarea que necesitás. En cada paso podés
> escuchar la explicación, pedir ayuda o volver. La voz acompaña; no decide
> por vos.”

**Working-demo branch, only after relevant evidence exists:**

> “En esta demostración usamos una factura inventada y no movemos dinero real.
> Miren este paso: podemos escuchar qué dato hace falta. Ahora cerramos y
> retomamos: los datos siguen ahí. Antes de confirmar aparecen el servicio y
> el importe. La persona confirma; el resultado viene del proveedor simulado.
> Si no sabemos si terminó, no mostramos ‘pagado’ ni hacemos otro pago.”

Show the behavior as spoken; remove any sentence not visible or verified on the
selected build. Do not narrate desired behavior over a nonfunctional mockup.

**Evidence branch A, after an actual study:**

> “En [versión], [x] de [n] participantes completaron esta tarea de prueba sin
> ayuda del facilitador. [a] necesitaron ayuda. Observamos [hallazgo concreto],
> cambiamos [detalle] y [resultado real del retest o ‘falta volver a probarlo’].
> Son resultados exploratorios, no una prueba de uso sostenido.”

**Evidence branch B, when no study exists:**

> “La comprensión y el uso independiente todavía deben probarse con el público
> objetivo. Definimos tareas de validación que miden si la persona entiende
> el importe, el destinatario y el resultado, también ante un error.”

**Complete-product scope:**

> “El producto es un simulador completo para practicar. No conectamos bancos ni
> proveedores de pagos. La experiencia sí funciona: guarda el avance, registra
> la operación de práctica, permite recuperarla y anularla, y ayuda a entender
> qué pasó. Se puede volver a practicar sin mover dinero ni compartir contraseñas.”

Use that wording only for capabilities actually implemented and verified on the
selected build; at today's documentation-only stage, describe it as the target.

**Close:**

> “La contribución que proponemos es concreta: comprender el paso, conservar
> el control y poder recuperarse. Autonomía Digital: entendé cada paso, decidí vos.”

If the product is implemented, use a verified contribution in the close instead
of “proponemos”; do not finish with a backlog or promise universal independence.

## Five-minute structure — 300 seconds total

| Time | Material | Extra depth over the short version |
| --- | --- | --- |
| 0:00–0:35 | Problem and observed context | One consented actual observation, or a clearly hypothetical situation |
| 0:35–1:00 | Product and six-frame journey | State what stays under the person's control |
| 1:00–2:40 | Journey, recovery and one pending/cancel scenario | Show honest state and the real capability boundary |
| 2:40–3:25 | User/technical evidence | Counts with scope, changed design and current test results |
| 3:25–4:05 | Alternatives and distinction | Tutorials, existing service apps, human help; no invented competitor weaknesses |
| 4:05–4:35 | Viability and operating responsibility | Community-practice channel, simple operating costs and actual help |
| 4:35–5:00 | Team contribution and close | Acknowledge actual work and repeat the concrete contribution |

Possible short deck: problem, product/journey, demo, evidence, operating model,
team/contribution. This is our adapted structure, not the book's ten-slide rule
or an organizer requirement. Keep big readable text, one idea per slide, and an
appendix for contracts, cost assumptions, supported devices and source details.

## Questions to rehearse

| Question | Honest answer boundary |
| --- | --- |
| “¿Qué hay funcionando hoy?” | Name the exact implemented build/capabilities; currently only documentation exists |
| “¿Paga servicios reales?” | No: the product is a complete simulator for practice, not a financial integration |
| “¿Por qué otra app?” | A targeted hypothesis about understanding/control/recovery; show observed comparative evidence when available |
| “¿Por qué no un tutorial?” | Help is tied to the active procedure/state; transfer and independent completion still need testing |
| “¿La IA puede pagar por error?” | No free-form AI or speech authority is proposed; explicit control plus server checks must be evidenced |
| “¿Cómo evitan pagar dos veces?” | Explain stable attempts, ledger constraints and reconciliation; cite actual race/lost-response tests when run |
| “¿Se puede anular cualquier pago?” | The simulator annuls its own recorded practice operation; it makes no claim about real-world payments |
| “¿Qué pasa si no hay internet?” | Preserve available local draft, block mutation, reconcile later; do not claim an offline payment |
| “¿Y si la voz no funciona?” | A complete text/touch/keyboard path; name only the physically tested voice/browser combinations |
| “¿Escuchan todo el tiempo?” | Explicit activation, visible listening and stop control; no background capture by design, to be tested |
| “¿Dónde se procesa el audio?” | State the actual verified browser/vendor route; if unknown: “Todavía tenemos que verificarlo” |
| “¿Qué pasa con quien no lee o no oye bien?” | Explain alternatives and relevant tested accessibility; do not claim all needs are already covered |
| “¿Cuántas personas lo probaron?” | Give exact completed/assisted/stopped counts and recruitment; currently zero |
| “¿Eso prueba autonomía?” | Exploratory task comprehension/transfer only; sustained independent use requires longitudinal evidence |
| “¿Qué hicieron ustedes y qué reutilizaron?” | Distinguish domain, copy, interaction and integration work from OSS packages; retain license notices |
| “¿Cuánto cuesta?” | Use sourced hosting/storage/optional speech/maintenance inputs, or say estimates remain open; no invented price |
| “¿Quién paga o distribuye?” | A candidate institutional channel is a hypothesis until a real documented commitment exists |
| “¿Qué pasa si queda pendiente?” | Lookup of the stored simulated operation, clear next action and contextual help; no real provider SLA |
| “¿Quién responde cuando falla?” | Show contextual help/retry/safe exit; include human contact only if actually provided |
| “¿Por qué deberían elegirlos?” | Point to demonstrated contribution and evidence, not a promise to win or claims about competing teams |

## Rehearsal gate

One presenter and one demo operator where team capacity permits. Rehearse both
durations and the failure transition, with questions from a skeptical listener.
Time the actual speech and UI, test audio in a room, and ask the listener what
they believe works today. If that differs from the evidence ledger, rewrite.

No placeholder statistic, participant name, logo of an unconfirmed partner or
unsupported implementation claim remains in the submission. The final sentence
states a concrete contribution; future work belongs before the close or in Q&A.
