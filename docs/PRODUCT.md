# Autonomía Digital — product definition

Status: proposed product specification; implementation and user validation have
not started. Updated 2026-10-21.

[Start here](../README.md) · [Execution plan](ACTION_PLAN.md) · [Validation](VALIDATION.md)

## The promise

**Understand the next step, make your own decision, and recover when something
goes wrong.** Autonomía Digital is a mobile-first companion for everyday digital
procedures, with plain es-AR text and user-controlled spoken guidance.

Suggested public line: **“Entendé cada paso. Decidí vos.”** This is a proposed
positioning, not a statement of measured impact.

The teammate's home gives people large labeled tasks, favorites, a microphone
and visible help. The product's value is in what follows: a complete procedure
with clear meaning, retained progress, explicit confirmation, an honest result
and a useful way forward after an error.

## What counts as a usable product

The user explicitly requires a usable product rather than a demo-only destination. A release must
complete its declared task in the intended environment, not merely resemble it.
All visible enabled features work. Speech, accessibility, persistence, errors,
support and tested startup are part of completion, not optional polish.

For **paying a real utility bill**, success means the correct bill was paid
through an authorized provider and the result is reconciled. A synthetic bill
and a mock receipt do not meet that definition. Simulators remain essential for
development and safe demonstrations but are not the operational release.

The initial operational target remains utility-bill payment end to end. Other
procedures—appointments, transport, shopping, then banking—must each satisfy
their own completion definition before becoming active tasks. This is sequencing
of complete capabilities, not permission to build shallow versions of all of them.

## Who we are designing for

Primary working segment: an older adult who has access to a smartphone and can
make their own decisions, but needs help understanding an unfamiliar digital
procedure or hesitates because its consequences are unclear. Age alone does not
describe ability. Recruit across differing reading, vision, hearing and motor
needs; the product must not assume that voice helps everyone.

These are **persona hypotheses**, not interviews:

| Need | Hypothesis to investigate | Product response to test |
| --- | --- | --- |
| Functional | “I need to finish this bill, not learn every menu in a banking app” | One bounded task with the next step explained |
| Emotional | “I am afraid I will pay the wrong thing or pay twice” | Payee/amount review, explicit decision, honest pending status and recovery |
| Social | “I want help without handing over my phone or feeling incapable” | Guidance that keeps control with the person; optional support with no password sharing |

Job story: **When I have a bill to resolve and no trusted helper beside me, help
me understand and finish the procedure so I can remain in control of my money
and know what happened.**

A family member may help someone discover the product, a community organization
may host an introductory session, and a utility/provider may be an integration
partner. They are distinct roles. None is a confirmed partner or a substitute
for studying the person who actually uses the application.

## Insight hypotheses and competing explanations

Inspired by B02–B06 in [the book notes](BOOK_REFERENCE.md), not asserted findings:

| ID | Hypothesis | What would change the design |
| --- | --- | --- |
| H1 | Understanding consequences and knowing a safe recovery path matter more than fewer taps alone | People still cannot explain payee/amount/status despite our guidance |
| H2 | Optional spoken help can unblock some users without taking over their decision | Speech confuses, exposes private information, or gets ignored; retain text-first completion and adjust voice |
| H3 | A reusable guided journey is more useful than a directory of external-app links | Participants already complete the task easily with a trusted shortcut; revise the segment or procedure |
| H4 | People can transfer the guidance to another bill without a facilitator | A second synthetic bill requires the same human coaching; investigate learned dependence |

Rival explanations to preserve: unfamiliar terminology; insufficient visual or
motor accessibility; distrust of a new intermediary; no usable provider/account
access; or a preference for an existing channel. Do not automatically label every
obstacle “fear of technology.”

## The experience in six frames

The scenario below is fictional and uses synthetic values. It is a design tool,
not a participant story or evidence of a real payment.

| Frame | What the person sees/does | Product behavior and proof required |
| --- | --- | --- |
| 1. Choose | “¿Qué necesitás hacer?” → “Pagar una factura” | Large labeled task card; favorites and help; no dead-end services |
| 2. Understand | Choose service, identify the requested bill detail | Written example and “Escuchar ayuda”; microphone only on explicit request |
| 3. Review | “Luz Ejemplo · $15.000 · factura de prueba” | Payee and amount originate at the provider; edit/back invalidates prior confirmation |
| 4. Decide | Read or hear the summary and personally confirm | No voice phrase, suggestion, route entry or restoration sends money |
| 5. Recover | Close/reopen or encounter a lost response | Recover the draft or reconcile the existing operation; do not create another charge |
| 6. Know | See confirmed result and receipt, or a clear pending/failure path | Explain what happened and what can be done; cancellation only if provider-supported |

Use “Volver y corregir”, “Todavía no confirmaste ningún pago”, and “Estamos
revisando si el pago se realizó” at the states where they are true. Do not display
reassurance that contradicts a submitted or uncertain operation.

## Distinctive experience to prove

The differentiator is the **combination of comprehension, personal control and
recovery inside a real procedure**, with optional speech. It is not having a
microphone, a chatbot, large buttons or a collection of open-source packages.

| Alternative category to investigate | Strength to acknowledge | Our proposed distinction | Evidence needed |
| --- | --- | --- | --- |
| Existing payment/utility application | Existing provider access and settlement | Guidance and recoverability for this segment | Compare the same synthetic task and provider constraints; do not invent missing competitor features |
| Tutorials or digital-literacy courses | Reusable instruction and practice | Contextual help at the moment of a specific task | Observe completion and transfer, not just course preference |
| Human/family assistance | Familiarity, trust and flexibility | Person retains their own device/decisions when help is absent | Observe independent attempts; do not claim humans are unnecessary |
| Generic voice assistant | Flexible conversational entry | State-bound explanations and explicit financial authority | Command/confirmation and result-consistency tests |

This is a comparison agenda, not a completed competitor study. No “first”,
“only”, “most accessible” or blanket competitor deficiency belongs in the pitch.

## Capability and completion boundaries

| Capability | Complete behavior | Not sufficient |
| --- | --- | --- |
| Home/favorites | Every enabled task reaches a working procedure; preferences persist | Attractive cards with unavailable destinations |
| Payment | Authorized bill lookup, correct payee/amount, explicit confirmation, reconciled outcome and valid receipt | Mock success or merchant checkout assumed to settle a utility bill |
| Spoken guidance | Useful es-AR output, controls, tested browser support and full non-voice path | Browser API presence or a prerecorded voice clip |
| Recovery | Draft restoration, idempotent commit, honest unresolved state and safe support | A spinner, cached success or a retry that can pay again |
| Cancellation | Real provider capability explained and verified | Calling a settled payment reversible without evidence |
| Support | An available help route, safe diagnostics and a response owner/process | A phone/message icon with nobody behind it |
| Additional procedure | Its real booking/purchase/trip outcome and recovery are defined and implemented | A redirect or screenshot treated as completion |

## Operational viability hypothesis

Candidate route: a community/utility-supported deployment that makes basic use
available without forcing a subscription on the older adult. A utility, service
provider or public/community organization could sponsor delivery or pay for a
supported integration. This is an unvalidated B2B2C hypothesis, not a contract.

Test user trust and distribution separately from the buyer's willingness to fund
it. A workshop attendance or an interview with a buyer does not prove recurring
usage. Avoid commission incentives that encourage unnecessary transactions,
advertising against private bill data, or selling voice transcripts.

Use a bottom-up case, with blank inputs until sourced:

- Addressable pilot users = eligible people reachable through one actual channel,
  not the entire older-adult population.
- Monthly operating cost = hosting + database/backups + provider fees + any
  speech usage + support labor + compliance/maintenance.
- Contribution per sponsoring organization = agreed recurring revenue minus its
  variable integration, support and transaction costs.
- Independence outcome = correct, understood completion without unplanned human
  takeover. Usage growth alone is not this outcome.

## Product release gates

1. **Desirability:** observed task and comprehension evidence, including a second
   bill and failures; exploratory limitations retained.
2. **Technical:** all required I1–I10 checks and physical-device voice/accessibility
   evidence for the supported browser matrix.
3. **Provider:** verified utility-bill capability and authority, not an assumed
   payment-collection API; explicit settlement/cancellation/reconciliation semantics.
4. **Operational:** owned support, deployment, HTTPS, secrets management, monitoring,
   backups/restore and appropriate privacy/provider/legal review.
5. **Communication:** all claims trace to evidence; simulations and recordings are
   labeled; no mock receipt is described as actual payment.

A hackathon submission and an operational release are different gates. If the
provider gate remains open, present the implemented work honestly and keep the
operational target on the plan. Do not rename an incomplete payment product a
finished usable one.
