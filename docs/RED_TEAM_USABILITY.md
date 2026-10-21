# Adversarial usability review — very low digital literacy

Date: 2026-10-21. Base: `20afb2950e43bc636c06b99eaba05a46d4a2ad2a`.
Scope: product, architecture and research documents; no executable application.
Updated scope: the complete product is simulation-only. “Provider” below means
our internal simulation engine, not an external financial service.

[Spanish team summary](PRODUCTO_EQUIPO.md) · [Product](PRODUCT.md) · [Validation](VALIDATION.md)

Method: repository [red-team-auditing](../.commandcode/skills/red-team-auditing/SKILL.md),
[non-overwhelming-ux](../.commandcode/skills/non-overwhelming-ux/SKILL.md) and
[claim-provenance-discipline](../.commandcode/skills/claim-provenance-discipline/SKILL.md).

## User model and authority boundaries

Design for an adult who can make their own financial decisions but may not know
what a browser, session, link, permission or pending transaction is. They may
read slowly, mishear speech, forget the previous screen, tap repeatedly, use
Android Back, close a tab, or confidently select the wrong option.

The user is not an attacker. Borrow adversarial methods to challenge our design
assumptions. Low digital literacy does not establish low decision-making ability.
Confusion never grants permission to bypass financial authentication, share
credentials or perform a simulated confirmation for the person. Real money and
financial integrations are outside the product scope.

Do not assume a trained facilitator, a relative beside them, stable internet,
perfect hearing, icon vocabulary or browser-settings expertise. We cannot control
native microphone dialogs; these need tested fallback journeys. External bank
interfaces are outside scope and must not become required practice steps.

## Evidence levels

**DESIGN OBSERVATION** means a requirement/omission read in the documents, the
documentation equivalent of CODE FACT in the skill. **PLAUSIBLE HYPOTHESIS**
means a predicted failure, not reproduced behavior. **CONFIRMED BY INDUCTION**
and **FALSIFIED** require an actual recorded experiment.

All behavioral risks here remain **PLAUSIBLE HYPOTHESIS**. No application test,
participant session or exploit was executed. There are no confirmed software
vulnerabilities or CVSS ratings. Priority below means potential user harm or a
blocked task. Adding requirements does not close a risk.

## Five design risks

### RT01 — “Cancel” can mean incompatible actions

- **Observation:** AGENTS.md I2/I7 and the baseline architecture require back/cancel
  paths but do not define one typed distinction between leaving a draft, stopping
  speech and requesting financial cancellation.
- **Bucket / priority:** ambiguous design contract; financial-safety gate.
- **Hypothesis:** generic “Cancelar” → user leaves after submission → provider
  operation continues → user believes no money moved.
- **Rivals:** the current result may already explain enough, or users may not
  choose that control. These need observation rather than assumption.
- **Prediction / experiment:** ask a participant to leave a submitted synthetic
  payment, explain its state, and compare that explanation with provider lookup.
- **Requirement:** separate `leaveDraft`, `stopSpeech` and
  `requestPaymentCancellation`. Leaving never changes provider state. A request
  is not a cancelled payment until the provider confirms cancellation.
- **Induction:** not run; implementation and comprehension checks still required.

### RT02 — A truthful status can still be incomprehensible

- **Observation:** PRODUCT.md/VALIDATION.md require outcome comprehension, but the
  baseline lacks an explicit shared state-to-copy-and-next-action contract.
- **Bucket / priority:** semantic usability hypothesis; financial-safety gate.
- **Hypothesis:** “en revisión”, a spinner or an error → person infers paid/not
  paid → repeats a payment or stops checking an unresolved bill.
- **Rivals:** icon/color or an inappropriate retry control may cause the error
  rather than wording. Change one factor at a time when comparing.
- **Prediction / experiment:** present pending, transport-unknown and cancelled
  synthetic scenarios separately; ask “¿Qué pasó? ¿Qué harías ahora?” without coaching.
- **Requirement:** visible/spoken output shares state-bound copy, allowed action
  and recovery/support explanation. Do not say “no se cobró” without provider evidence.
- **Induction:** not run; state equality alone does not prove comprehension.

### RT03 — Voice discovery can create a permission dead end

- **Observation:** optional voice/denial fallback is specified, but first-use
  explanations do not distinguish listening to help from microphone capture.
- **Bucket / priority:** boundary assumption; task-completion gate.
- **Hypothesis:** taps help → unfamiliar permission dialog → denies/closes it →
  cannot discover the equivalent touch journey or thinks the app cannot work.
- **Rivals:** poor speech quality or environmental noise may be the main obstacle.
- **Prediction / experiment:** first use on a physical phone, permissions reset,
  then denied; observe completion without a browser-settings walkthrough.
- **Requirement:** speech output never requests microphone access. Input explains
  permission only after choosing to speak; denial leaves an obvious touch path.
- **Induction:** not run; API availability is not this evidence.

### RT04 — Prior coaching can hide an inaccessible product

- **Observation:** the baseline avoids facilitator takeover, but does not require
  demonstrated very low digital familiarity or separately measure entry/help discovery.
- **Bucket / priority:** validation assumption; release-evidence gate.
- **Hypothesis:** introduction teaches where to tap → rehearsed task succeeds →
  apparent independence disappears on first use or a new bill.
- **Rivals:** the person may already know the task, or the interface may genuinely help.
- **Prediction / experiment:** no walkthrough; observe entry/help discovery, then
  a different synthetic bill through the same procedure. Record all coaching.
- **Requirement:** recruit using concrete recent behavior; distinguish target
  users, digitally experienced proxies and team runs. Retain assistance counts.
- **Induction:** not run; a small cohort cannot establish population-wide autonomy.

### RT05 — Valid clicks can compose into unintended confirmation

- **Observation:** the baseline specifies idempotency, but not prevention of old
  UI input crossing several steps into a newly rendered confirmation control.
- **Bucket / priority:** interaction-composition hypothesis; financial-safety gate.
- **Hypothesis:** repeated taps/held Enter → next screen under the same position
  → confirmation from an old gesture. Exactly one operation can still be unintended.
- **Rival:** correct event handling may already prevent this; only an implementation
  and device checks can decide.
- **Prediction / experiment:** double-tap Continue, hold Enter and use mobile
  keyboard submit while editing; inspect transitions and ledger operations.
- **Requirement:** financial confirmation requires a fresh deliberate activation
  of its own review control. No implicit field submission, previous pointer
  sequence, key-repeat, route or effect supplies it. Preserve normal accessible
  keyboard activation when the person intentionally focuses that control.
- **Induction:** not run; disabling a button alone is not proof.

## Proposed state-language contract

Candidate copy for testing, not wording proven understandable. Every factual
sentence is gated by the actual server state and provider capability.

| State/action | Candidate es-AR explanation | Allowed behavior |
| --- | --- | --- |
| Draft | “Todavía no confirmaste ningún pago.” | “Guardar y salir” only after save succeeds; otherwise explain not saved |
| Review | “En esta práctica, vas a pagar [importe] por [servicio y factura].” | Explicit “Confirmar pago de práctica”; secondary “Volver y corregir” |
| Submitted/pending | “Estamos consultando el resultado. No vuelvas a pagar esta factura por ahora.” | Lookup/reconciliation, not another charge; retained operation and safe exit |
| Transport unknown | “Todavía no sabemos si se realizó el pago.” | “Consultar resultado” or owned help; do not assert unpaid |
| Verified success | “Terminaste la práctica del pago.” | Current verified receipt; no cached green icon as evidence |
| Verified failure | Provider-supported plain-language reason | Explicit retry only when safe; no unverified refund/no-charge claim |
| Exit after submit | “Salir de esta pantalla no anula el pago.” | Leave UI, retain operation; no pretend cancellation |
| Cancellation requested | “Pedimos anular el pago. Falta confirmar si se pudo.” | Check cancellation outcome, without claiming cancelled |
| Cancellation verified | “El pago de práctica fue anulado.” | Show verified state; refund timing only if established |
| Microphone denied | “Podés seguir con los botones.” | Complete touch journey; listening to help needs no microphone capture |

Review includes the correct bill/period and recognizable account reference with
privacy-appropriate detail. A correct amount alone does not establish the correct
bill. Do not guess an amount or payee from speech.

## Adversarial scenario matrix — all NOT RUN

Automate relevant state/ledger checks and separately observe understanding on
physical devices. Use synthetic data, consent and a stop option; never provoke
these mistakes on a participant's real financial account.

| ID | Input/situation | Expected invariant and observation | Owner modules |
| --- | --- | --- | --- |
| U01 | First visit, no icon/browser vocabulary | Discover task/help without unexplained prerequisites | M01, M02, M07 |
| U02 | Cannot find requested number on bill | Example and relevant help; no guessing or blind mandatory field | M01, M06 |
| U03 | Spaces, leading zeros, incorrect reference | Parse by provider rules; preserve input and explain correction in place | M01, M05, M06 |
| U04 | Same amount, wrong account/period | Recognizable review catches mismatch before commit | M01, M05, M09 |
| U05 | Double-tap/repeated taps on Continue | Cannot skip review or confirm with a previous gesture | M02, M06 |
| U06 | Held Enter/mobile keyboard submit | No implicit financial commit; deliberate keyboard confirmation still works | M02, M06 |
| U07 | Repeated intentional confirmation requests | One operation per attempt despite repeated requests | M04, M05 |
| U08 | “Sí”, “dale”, misrecognized command | No speech payment/guessed amount; clear bounded fallback | M06, M08 |
| U09 | Denies microphone permission | Complete touch path; no required browser-settings lesson | M02, M08 |
| U10 | Misses words/cannot follow a paragraph | Short instruction, example, repeat/slower; no hidden essential text | M01, M02, M08 |
| U11 | Android Back/reload/close before submit | Same saved step/values, no payment or silent reset | M03, M06 |
| U12 | Reload after send; response lost | Reconcile original operation; no new charge or false unpaid result | M04–M06 |
| U13 | Leaves after submit, expects cancellation | Explain exit vs annulment; provider state stays discoverable | M06, M09 |
| U14 | Cancellation request times out | Unresolved until checked; no false “anulado” or duplicate refund request | M04, M09 |
| U15 | Pending lasts longer than expected | Status/next action and owned escalation; no invented completion time | M09, M10 |
| U16 | Storage denied/full or session expired | Honest save/auth state; preserve what can safely remain without another user's data | M03, M05 |
| U17 | Stale tab/helper changes task | Detect revision/ownership conflict; no silent overwrite or financial reassignment | M03–M06 |
| U18 | Zoom, tremor, reader, no sound | Complete supported non-voice journey and deliberately activated controls | M02, M07, M08 |
| U19 | Practice screen asks for bank credentials | No real bank login, PIN, OTP or card data is requested/sent; synthetic examples explicitly labeled | M01, M05, M10 |
| U20 | Needs a human or stops understanding | Contextual help and safe exit; human contact only if available; no shame/takeover | M07, M09, M10 |

## Release acceptance and non-results

Financial misunderstandings and unexpected commits block the affected flow.
Do not average them away behind a favorable completion percentage. Record the
error before explaining; a corrected/coached attempt is not unassisted success.

A mandatory quiz, repeated confirmation dialogs, timed hold, precise swipe,
forced speech or authentication bypass is not the default remedy. Improve the
interaction and test it; keep financial authority intact. Those interventions
are rejected as default choices, **not experimentally falsified** as techniques.

Current outcome: five design risks and twenty proposed scenarios; zero executed
behavioral checks, zero confirmed vulnerabilities and zero confirmed usability
failures. Requirements below have been strengthened; the risks remain open until
implementation and observation earn a result.
