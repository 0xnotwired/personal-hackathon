# Autonomía Digital — product definition

Status: proposed product specification; implementation and user validation have
not started. Updated 2026-10-21.

[Start here](../README.md) · [Execution plan](ACTION_PLAN.md) · [Validation](VALIDATION.md)

## The promise

**Understand the next step, make your own decision, and recover when something
goes wrong.** Autonomía Digital is a mobile-first companion for everyday digital
procedures in a complete simulation environment, with plain es-AR text and
user-controlled spoken guidance. The product is for safe practice and learning;
it does not pay real bills or connect to banks or utility providers.

Suggested public line: **“Entendé cada paso. Decidí vos.”** This is a proposed
positioning, not a statement of measured impact.

The teammate's home gives people large labeled tasks, favorites, a microphone
and visible help. The product's value is in what follows: a complete procedure
with clear meaning, retained progress, explicit confirmation, an honest result
and a useful way forward after an error.

## What counts as a usable product

The user clarified that **a complete simulated experience is the finished scope**.
Every enabled task works end to end: select, enter data, review, confirm, persist
its simulated operation, understand the result and recover/cancel/repeat a practice.
Voice, accessibility, favorites, persistence, errors and tested startup are part
of completion. A sequence of decorative screens or a hardcoded success is not.

The first full practice is a synthetic utility-bill payment. Appointments,
transport and shopping can follow as complete simulations after that journey
meets its gates. No real payment API, bank login, provider onboarding, settlement
or financial credential is required now or as a release prerequisite.

The practice label **“Modo práctica — no se mueve dinero”** stays visible, and
receipts say they are practice receipts. Actual application state—not a real
bank transaction—establishes the simulated outcome. A new practice preserves the
previous attempt's history and does not silently reset an unresolved attempt.

## Who we are designing for

Primary working segment: an older adult who has access to a smartphone and can
make their own decisions, but needs help understanding an unfamiliar digital
procedure or hesitates because its consequences are unclear. Age alone does not
describe ability. Recruit across differing reading, vision, hearing and motor
needs; the product must not assume that voice helps everyone.

Design for **very low digital literacy**, including people unfamiliar with links,
permissions, accounts, sessions and transaction states. Do not require icon
knowledge, a tutorial or a relative beside them to discover the first action.
Explain unavoidable prerequisites where they appear; retain provider identity
and authorization controls. Assess reading/hearing/motor needs separately rather
than inferring them from age or digital unfamiliarity.

### Low-literacy interaction requirements

- Concrete action labels, short instructions and examples beside the requested
  field; no generic “OK”, unexplained icon or technical prerequisite.
- Going back, leaving a draft, stopping speech and annulling payment have distinct
  meanings. A close/cancel button never implies money stopped after submission.
- Repeated taps/held keys cannot cross review into an unintended confirmation.
  Consequential controls need fresh deliberate accessible activation.
- A pending/unknown state explains what is known and the safe next action; a
  comforting tone, color or spinner cannot substitute for comprehension.
- Listening to help needs no microphone permission. Denial leaves an obvious
  complete touch journey without a settings walkthrough.
- Someone who does not understand can stop safely and reach owned help. No
  forced quiz, credential sharing, shaming or automatic payment is a remedy.

The [adversarial usability review](RED_TEAM_USABILITY.md) defines five design
hypotheses and twenty acceptance scenarios; none has been executed yet.

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
| Existing payment/utility application | Executes actual transactions, outside this product's scope | A place to practice without real money or credentials | Compare practice comprehension; do not claim transaction capability or invent missing competitor features |
| Tutorials or digital-literacy courses | Reusable instruction and practice | Contextual help at the moment of a specific task | Observe completion and transfer, not just course preference |
| Human/family assistance | Familiarity, trust and flexibility | Person retains their own device/decisions when help is absent | Observe independent attempts; do not claim humans are unnecessary |
| Generic voice assistant | Flexible conversational entry | State-bound explanations and explicit financial authority | Command/confirmation and result-consistency tests |

This is a comparison agenda, not a completed competitor study. No “first”,
“only”, “most accessible” or blanket competitor deficiency belongs in the pitch.

## Capability and completion boundaries

| Capability | Complete behavior | Not sufficient |
| --- | --- | --- |
| Home/favorites | Every enabled task reaches a working procedure; preferences persist | Attractive cards with unavailable destinations |
| Practice payment | Synthetic bill lookup, correct simulated payee/amount, explicit confirmation, durable outcome and labeled practice receipt | Decorative success screen or a claim that actual money moved |
| Spoken guidance | Useful es-AR output, controls, tested browser support and full non-voice path | Browser API presence or a prerecorded voice clip |
| Recovery | Draft restoration, idempotent commit, honest unresolved state and safe support | A spinner, cached success or a retry that can pay again |
| Cancellation | The simulation engine changes and persists the simulated operation; result is verified by lookup | Hiding a screen or implying a real bill was annulled |
| Help | Complete contextual explanations, repeat/retry/safe exit; human contact only when actually available | Dead message/phone icons or a compulsory staffed support service |
| Additional practice | Its simulated booking/purchase/trip outcome and recovery are implemented end to end | A redirect or screenshot treated as working practice |

## Operational viability hypothesis

Candidate route: community digital-literacy sessions and independent practice
at home, without forcing a subscription. A community/public organization could
sponsor access or workshops. This is an unvalidated distribution hypothesis, not
a contract or a required service-provider partnership.

Test user trust and distribution separately from the buyer's willingness to fund
it. A workshop attendance or an interview with a buyer does not prove recurring
usage. Avoid commission incentives that encourage unnecessary transactions,
advertising against private bill data, or selling voice transcripts.

Use a bottom-up case, with blank inputs until sourced:

- Addressable pilot users = eligible people reachable through one actual channel,
  not the entire older-adult population.
- Monthly operating cost = hosting + retained application data + any
  optional speech costs + facilitation/maintenance time. No financial-provider fee.
- Contribution per sponsoring organization = agreed recurring revenue minus its
  variable teaching/support and application costs, if an organization funds it.
- Independence outcome = correct, understood completion without unplanned human
  takeover. Usage growth alone is not this outcome.

## Product release gates

1. **Usable practice:** all enabled tasks work end to end, including repeat
   practice, clear synthetic content, persistent operation state and cancellation.
2. **Comprehension:** observed first-use and second-synthetic-bill behavior with
   very low digital literacy; exploratory evidence does not establish real-world
   banking autonomy.
3. **Technical:** applicable I1–I10 checks plus physical-device voice and manual
   accessibility evidence. No mandatory external financial integration exists.
4. **Deployment/help:** tested startup and retained data, contextual help and safe
   exits, no imaginary support channel, appropriate privacy for practice records.
5. **Communication:** visible practice labels, practice receipts and claims scoped
   to what was actually tested. Live presentations/recordings stay distinguished.

The complete simulator can be released when these gates pass. Its simulation
boundary is the intended use, not an unfinished real-payment requirement.
Actual implementation, usability and device evidence remain pending.
