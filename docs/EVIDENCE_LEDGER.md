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
| C02 | The app completes the simulated bill flow | Observed in scope: implemented tree on ai-1; Chromium end-to-end receipt/recovery tests | Device/user evidence before expanding to independent use | “El pago de práctica funciona de principio a fin en las pruebas de navegador” |
| C03 | The app pays a real utility bill | Outside scope by explicit user clarification; not a release blocker | Would require a separate future scope request; do not seek live integration for this product | “Es un simulador completo: no realiza pagos reales” |
| C04 | People complete the task independently | Hypothesis H1/H4; no sessions | Versioned participant observations and honest `x/n` with assistance/stop counts | “Vamos a medir comprensión y autonomía” |
| C05 | Voice is usable on supported phones | Browser adapter implemented; stubbed controls, denial and absent-API paths observed; physical speech NOT RUN | Actual mobile input/output records | “Hay voz opcional con alternativas completas; falta comprobarla en teléfonos físicos” |
| C06 | Reload/restart does not duplicate an operation | Observed in scope: real SQLite, writer-process/replay, concurrent HTTP, lost-response and review-reload checks | Deployed host restart and additional browser/device scenarios | “Las pruebas del simulador conservan y recuperan una operación sin duplicarla” |
| C07 | The service is accessible | Scoped axe/keyboard and limited programmatic text-enlargement checks observed; manual screen reader/full zoom NOT RUN | Full scoped manual/device acceptance and users | “Pasó las comprobaciones automáticas y de teclado incluidas; no afirmamos certificación WCAG” |
| C08 | Pending/failed/cancelled results are honestly communicated | Provider-state/browser assertions observed; cancellation timeout stays unresolved until lookup | Spoken physical output and comprehension observations | “La app muestra el estado verificado del simulador y distingue un resultado incierto” |
| C09 | Institutions will distribute or pay for it | Unvalidated viability hypothesis | Actual named channel/buyer discussion with permission and concrete next-step record | “Proponemos explorar un canal institucional” |
| C10 | Official judging favors our selected dimensions | Unsupported; user reports no published criteria | Official event criteria or organizer confirmation | “Usamos estas dimensiones para revisión interna” |
| C11 | Pitch duration is 3–5 minutes | User-supplied fact in this session | Confirm exact slot with organizer before final deck | “Preparamos versiones de 3 y 5 minutos” |
| C12 | Open-source repositories have been integrated | Observed in scope: pinned React Aria/XState/Dexie/Zod plus attributed Ímpetu/Gambit/Wolf adaptations and tests | Recheck notices/pins on updates; no upstream cloud test inheritance | “Reutilizamos estas piezas con cambios y atribución documentados” |
| C13 | People with very low digital literacy can use it without prior coaching or unsafe misunderstanding | Design hypotheses RT01–RT05; human observations NOT RUN, technical subset in IMPLEMENTATION_STATUS.md | Unassisted first-use/transfer observations on the intended segment plus state/ledger/repeated-input checks | “El diseño contempla ese perfil; falta comprobarlo con usuarios” |

No participant result, partnership, real transaction, physical speech result or
public deployment is entered as completed. Technical evidence is scoped in
[IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md); the README describes an
implemented simulator with remaining manual/user gates.

### C14 — local message help and companion adaptation

Implemented and observed on authored examples: optional local rules quote matched
Spanish pressure cues, do not declare no-match safe, clear input and cannot
confirm payment or send a reply. Sources, exact adaptations and original-matcher
check are recorded in REUSE_ANALYSIS.md and NOTICE. This is neither measured
fraud-detection accuracy nor proof that older adults will interpret warnings safely.
Allowed: “Ayuda a revisar algunas frases y propone respuestas que vos decidís usar”.

### C15 — Personal-inspired mobile interface

Implemented blue/cyan phone shell, labeled navigation, manifest/icons and browser
checks. This is a user-requested visual direction, not a verified official design
system, partnership, native binary, store release or tested physical installation.
Allowed: “Una app móvil web con estilo azul/celeste inspirado en Personal”.

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
