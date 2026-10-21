# Evidence and claim ledger

Updated 2026-10-21. This is the single register for statements that may enter the
README, pitch, submission or release announcement.

[Validation protocol](VALIDATION.md) · [Pitch wording](DEMO_AND_PITCH.md) · [Reference method](BOOK_REFERENCE.md)

## Status vocabulary

- **Documented:** a source or design exists; no behavior is implied.
- **Hypothesis:** a testable proposition, not an observed result.
- **Implemented, unverified:** code exists but its relevant check has not run.
- **Observed in scope:** a cited run/session supports the exact version, sample
  and conditions; not a broader guarantee.
- **Blocked / refuted:** required evidence is absent, or an observation contradicts
  the claim. Keep the reason and next decision visible.

Only the evidence owner promotes a behavioral claim, after checking its artifact.
Include unsuccessful sessions, failures, skips and unsupported devices. A summary
may shorten the detail but may not promote confidence or widen scope.

## Current register

| ID | Claim under consideration | Current status and origin | Evidence required before stronger wording | Wording allowed now |
| --- | --- | --- | --- | --- |
| C01 | Product target is understood, controlled, recoverable procedures | Documented: user discussion and PRODUCT.md | New design approval if the scope changes | “Diseñamos un acompañante para…” |
| C02 | The app completes the simulated bill flow | Blocked: no application code exists | Actual complete journey with build/run reference, ledger and checks | “El recorrido está especificado; falta implementarlo” |
| C03 | The app pays a real utility bill | Outside scope by explicit user clarification; not a release blocker | Would require a separate future scope request; do not seek live integration for this product | “Es un simulador completo: no realiza pagos reales” |
| C04 | People complete the task independently | Hypothesis H1/H4; no sessions | Versioned participant observations and honest `x/n` with assistance/stop counts | “Vamos a medir comprensión y autonomía” |
| C05 | Voice is usable on supported phones | Hypothesis H2; no device checks | Separate physical-device input/output records and no-voice journey | “La voz es una capacidad propuesta” |
| C06 | Reload/restart does not duplicate an operation | Specified in architecture; unimplemented | Concurrency, lost-response and process-restart checks against durable state | “El diseño exige idempotencia y reconciliación” |
| C07 | The service is accessible | Target I6 only | axe plus keyboard, focus, screen-reader, target-size and zoom evidence scoped to version/screens | “Tenemos un objetivo de accesibilidad y un protocolo de verificación” |
| C08 | Pending/failed/cancelled results are honestly communicated | Specified I4/I10; unimplemented | Provider-state, visible/spoken agreement and comprehension scenarios | “El producto debe distinguir estos estados” |
| C09 | Institutions will distribute or pay for it | Unvalidated viability hypothesis | Actual named channel/buyer discussion with permission and concrete next-step record | “Proponemos explorar un canal institucional” |
| C10 | Official judging favors our selected dimensions | Unsupported; user reports no published criteria | Official event criteria or organizer confirmation | “Usamos estas dimensiones para revisión interna” |
| C11 | Pitch duration is 3–5 minutes | User-supplied fact in this session | Confirm exact slot with organizer before final deck | “Preparamos versiones de 3 y 5 minutos” |
| C12 | Open-source repositories have been integrated | Documented research only | Pinned dependencies/source notices plus working integration evidence | “Identificamos estas piezas para reutilizar” |
| C13 | People with very low digital literacy can use it without prior coaching or unsafe misunderstanding | Design hypotheses RT01–RT05; U01–U20 all unexecuted | Unassisted first-use/transfer observations on the intended segment plus state/ledger/repeated-input checks | “El diseño contempla ese perfil; falta comprobarlo con usuarios” |

No participant result, partnership, real transaction, deployment or test pass has
been invented or entered as completed. The public README describes an intended
experience and clearly identifies the current planning state.

## Per-claim evidence record

When an observation exists, add a sanitized entry using this schema:

```text
Claim ID / status / date / evidence owner:
Origin: executed command, provider documentation, or study/session ID
Build/commit, environment/device, scenario and sample:
Exact observation including failures, assistance, skips and unknowns:
Artifact location (approved and sanitized):
Interpretation, assumptions and rival explanations:
Allowed public wording:
Falsifier/retest trigger:
Supersedes earlier entry:
```

Never publish session secrets, bill/customer identifiers, recordings, transcripts
or contact details as evidence. A consented, sanitized quotation is a separate
research artifact; runtime logging of voice input is still prohibited.

## Before presenting or publishing

1. Match each slide/README claim to this register and current evidence.
2. Replace simulated outcomes with explicit simulation wording; separate an
   intended feature from a live one and a recording from a live demonstration.
3. Check counts against the original cohort/build, including incomplete sessions.
4. Remove all `[fill]` placeholders from public material. If no observation exists,
   remove the unsupported line or state the pending validation honestly.
5. Remove “first”, “only”, “guaranteed”, “all older adults”, “eliminates fraud”,
   “works on every phone”, “approved partner” and similar claims without their
   specific evidence. Tests of one mock do not establish real settlement.
6. Have a second team member explain what they believe works today. Any mismatch
   is a communication defect to fix before submission, not their misunderstanding.
