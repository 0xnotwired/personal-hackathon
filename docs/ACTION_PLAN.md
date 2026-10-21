# Autonomía Digital — module action plan

Status: **proposed work; no application modules implemented**. Date: 2026-10-21.

[Architecture, repository links and decisions](ARCHITECTURE.md) · [Product contract](../AGENTS.md)

## Destination and delivery order

Build an accessible digital companion that speaks, listens when invited, and
helps a person complete procedures independently. The agreed first milestone is
one complete simulated bill payment with the teammate's home/favorites design,
recovery, help, confirmation, cancellation, and voice. A second procedure starts
only after that milestone satisfies AGENTS.md I1–I10.

The modules below are construction units, not independent release promises.
Scaffolding, a screen, or an open port alone is not a completed product level.
Persistence, authorization, accessibility, and verification enter with the first
module that needs them; none is deferred to a later “hardening” phase.

| Product level | Observable outcome | Completion gate |
| --- | --- | --- |
| L1 — guided simulated payment | A person starts at home, pays a synthetic bill, hears/reads help, resumes interruptions, sees a verified result, and can cancel the simulated operation | M00–M10 plus integrated review and evidence; this is the first deliverable |
| L2 — second complete procedure | A chosen appointment OR transport journey works through the same accessible shell and contracts | Start only after L1; document its own provider and authority boundary |
| L3 — supported external integration | A specific external provider can be used with honest status, return and cancellation semantics | Real authorization, settlement, privacy and recovery design reviewed before implementation |

Do not fill the home with nonfunctional L2/L3 buttons. If time is limited, finish
L1 with its invariants intact rather than presenting incomplete extra journeys.

## Dependency map

```mermaid
flowchart LR
  M00[Runtime and scaffold] --> M01[Domain contracts and copy]
  M00 --> M02[Accessible UI primitives]
  M01 --> M03[Draft and preference storage]
  M01 --> M04[Durable mock provider]
  M04 --> M05[Validated API and commit boundary]
  M01 --> M06[Procedure controller]
  M02 --> M06
  M03 --> M06
  M05 --> M06
  M02 --> M07[Home and favorites]
  M03 --> M07
  M06 --> M07
  M01 --> M08[Speech adapters and commands]
  M02 --> M08
  M06 --> M08
  M05 --> M09[Results and receipts]
  M06 --> M09
  M07 --> M10[Delivery evidence and runtime]
  M08 --> M10
  M09 --> M10
```

Checks belong to their modules even though the combined delivery evidence is
collected in M10. Candidate test paths below are to create during implementation,
not tests that already exist or have passed.

## M00 — Reproducible runtime and application shell

**Create:** Next.js/TypeScript scaffold, root layout with `lang="es-AR"`, npm
lockfile, runtime pin, ignored output/data paths, unit/integration/browser test
configuration, and minimal CI wiring. Existing AGENTS.md, skills and taste survive
scaffolding; inspect generator behavior before running it over this checkout.

**Dependencies:** none. Follow ADR-001/002.

**Tasks:** verify compatible Next/React/Node 24 versions; check SQLite native
adapter installation; add only the packages required by the next modules. Confirm
the Node deployment can write a private data directory. Keep dummy data and test
outputs ignored at creation, except intentionally authored synthetic catalog
definitions and migration source.

**Exit evidence:** frozen installation, production build and a real request to
the app shell work in this environment. Record actual commands/version pins in
AGENTS.md after running them. Run one meaningful test of the shell/configuration,
not a zero-test command. If native SQLite fails, resolve ADR-002 before claiming
that operations survive restart.

**Skills:** `git-discipline`, `secure-by-construction`, `falsifiable-testing`.

## M01 — Procedure contracts, synthetic bills and shared es-AR copy

**Create:** `app/flows/contracts.ts`, `registry.ts`, `pago-servicio/`,
`app/lib/copy/es-AR/`, and `money.ts`.

**Depends on:** M00.

**Tasks:** define versioned steps/events/drafts/reviews/results; enumerate one
primary action, help and back/cancel targets for every step. Define a small
synthetic bill catalog with server-owned payee/amount. Store money as integer
centavos with `Intl` formatting. Each copy record provides heading, instruction,
help and result wording consumed by both visual UI and speech.

**Exit evidence:** `tests/unit/procedure-contracts` rejects a step without help,
multiple primary actions, invalid events, invalid amounts, unknown services and
unsupported persisted versions. `tests/unit/money` checks exact ARS formatting and
rounding boundaries. Enumerate all steps to detect dead ends. UI copy review
confirms synthetic/demo labels and understandable confirmations.

**Invariants:** I1, I4, I5, I7, I8, I10.
**Skills:** `secure-by-construction`, `non-overwhelming-ux`, `falsifiable-testing`.

## M02 — Accessible visual primitives and procedure shell

**Create:** cohesive fields/buttons/dialogs in `app/components/ui/`, plus the
procedure shell, help panel, error summary and progress indicator.

**Depends on:** M00; use M01 copy as it becomes available.

**Tasks:** native semantics first; use React Aria for complex behavior. Keep a
field's label/hint/error together. Keep help/back in predictable positions and
focus the new step heading. Use the teammate's large cards and simple hierarchy;
do not introduce a component library's default dashboard layout.

**Exit evidence:** browser tests verify keyboard operation, associated labels,
dialog focus/return and error announcements. Check 44×44 px project targets,
4.5:1 body contrast and 200% zoom manually; run axe on representative states.
Fix a deliberately removed label or broken focus return and show the relevant
check detects it. Later journey steps inherit these checks, not just this shell.

**Invariants:** I5, I6, I7.
**Skills:** `frontend-component-boundaries`, `frontend-accessibility-by-construction`,
`non-overwhelming-ux`, `falsifiable-testing`.

## M03 — Draft, favorites and preference repository

**Create:** `app/lib/persistence/` with Dexie implementation, explicit schema
versions/migrations, and a narrow storage interface.

**Depends on:** M01.

**Tasks:** persist entered values and step IDs, stable draft/attempt IDs and keys,
implemented-task favorites, and speech preferences. Validate on restore. Exclude
audio, transcripts, credentials and card details. Handle IndexedDB denial,
corruption, quota and incompatible versions visibly; retain entered in-memory
values and never falsely say they were saved. Prevent confirmation if its stable
attempt key cannot be persisted. Expose an explicit local-data reset that does
not imply cancelling a server operation.

**Exit evidence:** browser tests reload, close/reopen the page, navigate back and
restore the same values/step. Integration checks exercise migration and failure
paths. Two tabs cannot overwrite a newer draft unnoticed; use draft revisions
and an explicit stale-tab recovery choice. A persisted draft marked “paid” cannot
create a successful result without provider lookup.

**Invariants:** I3, I4, I8, I10.
**Skills:** `secure-by-construction`, `decision-record-discipline`, `falsifiable-testing`.

## M04 — Durable simulated provider and operation ledger

**Create:** `app/providers/contracts.ts`, `mock/` with schema/migrations and
transactional ledger, and `server-factory.ts`.

**Depends on:** M01 and the storage-runtime gate in M00.

**Tasks:** implement server quotes, commit, owned lookup and cancellation using
synthetic bills. Persist owner, request fingerprint, stable attempt/key, revision,
status and cancellation capability. Enforce uniqueness/idempotency atomically.
Provide deterministic succeeded/pending/failed/cancellation scenarios with test
fixtures; never use random outcomes or public arbitrary status overrides. Reject
live credentials/configuration in demo mode.

**Exit evidence:** integration tests use the real SQLite-backed mock, not a stub
that merely returns the expected status. Send concurrent identical requests,
different keys for the same active attempt, conflicting payloads, duplicate
cancellations and cancel/status races. Assert exact ledger rows/status, restart
the provider process and assert the same operation survives. A subsequent lookup
must prove cancellation changed the operation. Removing a unique constraint or
transaction guard must make a relevant test fail.

**Invariants:** I1, I2, I4, I8.
**Skills:** `secure-by-construction`, `decision-record-discipline`, `falsifiable-testing`.

## M05 — Anonymous session, review API and commit boundary

**Create:** `app/lib/server/` and the review/operation route handlers described in
the architecture. `commitProcedure()` is the only financial commit service.

**Depends on:** M01, M04.

**Tasks:** isolate demo sessions without accounts; parse bounded requests and
enforce ownership on every operation route. Add same-origin/CSRF checks and
server confirmation bindings to quote, owner and draft revision. Never accept a
client-supplied amount as authoritative. Replays return the existing operation;
unknown results go through lookup by operation or owned draft/attempt ID.

**Exit evidence:** actual API calls reject missing/stale confirmation, manipulated
amount/payee, another session's operation, oversized or malformed bodies and
cross-origin mutations. A double submit yields one operation. Simulate a dropped
response after commit and recover the same operation. No unguarded route calls
the provider commit directly. Verify invalid requests leave the ledger unchanged.

**Invariants:** I1, I2, I4, I8.
**Skills:** `secure-by-construction`, `falsifiable-testing`.

## M06 — Payment procedure controller and recovery

**Create:** `app/flows/procedure-machine.ts`, payment controller and thin
`app/(flow)/[procedure]/page.tsx` integration.

**Depends on:** M01–M05.

**Tasks:** wire choosing/entering/reviewing/confirming/submitting/result and the
restore/reconcile/cancel/error transitions. Only a user confirmation control
initiates `commitProcedure()`; route entry, effects, restoration and suggestions
cannot do so. Editing reviewed details invalidates confirmation. Keep field-local
state separate from procedure state, and prevent stale/double-tab submissions.

**Exit evidence:** state tests reject illegal transitions. A browser journey
selects a bill, edits it, goes back, reloads, reviews and submits exactly once.
Loading a route and replaying a persisted `submitting` draft perform lookup,
never payment. Timeout is unresolved, not success or definitive failure. Removing
the confirmation guard must fail a test that observes the operation ledger.

**Invariants:** I1–I5, I7–I9.
**Skills:** `secure-by-construction`, `frontend-component-boundaries`,
`non-overwhelming-ux`, `falsifiable-testing`.

## M07 — Home, favorites and return-to-task experience

**Create:** `app/page.tsx`, `app/components/home/`, task catalog view and resume card.

**Depends on:** M02, M03, M06.

**Tasks:** implement “¿Qué necesitás hacer?”, the available payment task,
favorites, microphone/help entry and a clear resume action. Icons always have
text. Show roadmap items only as explicitly unavailable content. Favorite a task,
not a financial account. The home exception permits multiple task cards; each
procedure step still has one primary action.

**Exit evidence:** the payment card starts the working flow; a saved favorite
persists across reload; resume restores the correct draft. All available cards
have working destinations. Keyboard/screen-reader navigation and 200% zoom work;
no unlabeled bottom-navigation icons or apparent working appointment buttons.

**Invariants:** I3, I5–I7, I9.
**Skills:** `frontend-component-boundaries`, `non-overwhelming-ux`,
`frontend-accessibility-by-construction`.

## M08 — Spoken help, microphone and bounded commands

**Create:** `app/speech/`, speech controls and approved-copy/result bindings.

**Depends on:** M01, M02, M06; connect the home microphone in M07.

**Tasks:** feature-detect input/output separately. Implement explicit listen/help,
pause, repeat, slower, stop and mute actions. Support the documented command set
on validated browsers; stop capture on navigation/backgrounding. Keep transcripts
ephemeral. Unknown commands ask for a choice; no command maps to payment commit.
Explain the actual browser/vendor processing route before recognition starts.
Avoid overlapping screen-reader and synthesized announcements.

**Exit evidence:** adapter/intent tests plus a browser test with speech missing,
permission denied and recognition error all preserve the complete touch journey.
Verify all allowed and unrecognized phrases cannot trigger an operation. Speak a
pending result then cancel it; stale “paid” speech must not continue. Manual checks
on physical Android Chrome and iOS Safari record input/output separately, es-AR
voice quality, user-activation behavior and vendor processing information.

At least one named physical mobile-browser configuration must pass both supported
voice paths for the voice milestone. Emulator/adapter mocks do not establish real
recognition quality. If a target fails, record unsupported capability and resolve
ADR-004; do not quietly mark voice complete or require voice to use the app.

**Invariants:** I1, I4–I7, I10.
**Skills:** `secure-by-construction`, `non-overwhelming-ux`,
`frontend-accessibility-by-construction`, `falsifiable-testing`.

## M09 — Result, cancellation and receipt experience

**Create:** result/recovery/receipt components and controller bindings.

**Depends on:** M05, M06; share copy and speech events with M08.

**Tasks:** show succeeded/pending/failed exclusively from provider responses;
render transport uncertainty as unresolved. Re-query on restore. Cancellation
changes server state before UI acknowledges it. Display a simulated receipt with
operation reference, payee and amount only after verified success. Cancelled
receipts/results have explicit corrected status; no stale success announcement.

**Exit evidence:** browser scenarios cover success, pending, failure, lost response,
cancel success/replay/unavailable and reload after cancellation. Verify against
subsequent API/ledger lookup. MSW may inject client network failures; real mock
provider integration tests still establish actual state changes. An HTTP error
must not unlock a “pay again” path while the original attempt is unresolved.

**Invariants:** I1, I2, I4, I7, I10.
**Skills:** `secure-by-construction`, `non-overwhelming-ux`, `falsifiable-testing`.

## M10 — L1 delivery evidence and repeatable runtime

**Create:** combined e2e scenarios, a manual accessibility/speech checklist,
sanitized evidence summary and tested startup/deployment documentation.

**Depends on:** M00–M09. Tests/checks introduced by earlier modules remain required.

**Tasks:** review the accumulated product against I1–I10 and the threat model;
then run the integrated suite against the actual assembled app. Configure HTTPS
and persistent disk for a deployed demo. Verify database migrations and restart
without deleting retained operations. Capture exact commands, versions, counts,
known failures/skips and supported browsers. Save cloud startup instructions when
setting up the running application, rather than relying on a surviving process.

**Exit evidence:** an independent person can follow the instructions to run the
complete journey. Unit/integration/e2e checks, production build and automated axe
checks complete; manual keyboard, screen reader, zoom and voice evidence are
recorded separately. No live money/credentials, no audio/transcript logging, and
no skipped required device check disguised as a pass.

Observe an older adult or representative user trying the task with synthetic
data and consent; record where help was needed without collecting financial
details. Technical checks do not establish comprehension or confidence.

**Skills:** `destination-driven-construction`, `secure-by-construction`,
`falsifiable-testing`, `git-discipline` and the frontend accessibility skills.

## Acceptance map and review cadence

| Product rule | Primary modules | Required evidence |
| --- | --- | --- |
| I1 — person decides | M05, M06, M08 | No commit from route entry, restore, suggestion or voice; explicit confirmation tested |
| I2 — confirmation and cancellation | M04, M05, M09 | Server-bound review; persisted cancellation and capability checks |
| I3 — resume progress | M03, M06, M07 | Reload/back/close restore data; errors and stale-tab conflicts are visible |
| I4 — honest results | M04–M06, M09 | Provider authority, restart/reconciliation, spoken/visible agreement |
| I5 — clear action and language | M01, M02, M06, M07 | Enumerated step schema, copy review and home exception |
| I6 — accessibility | M02 and every rendered module | axe plus manual keyboard, screen reader, target-size and zoom checks |
| I7 — help and safe exits | M01, M02, M06–M09 | Step enumeration and recoverable failure journeys |
| I8 — simulation only | M00, M04, M05, M10 | Factory/env guard and no live SDK/credentials |
| I9 — depth before breadth | L1 gate | One fully evidenced payment before another procedure begins |
| I10 — optional bounded voice | M08, M09 | Real-device speech evidence; no-voice journey; no voice commit or stored recordings |

Review each added module adversarially for its own contracts and preservation of
existing invariants. Run relevant local checks when their claim requires it,
including red-first/negative-control evidence for consequential behavior. Do not
repeat every unrelated suite mechanically after each module. At the L1 horizon,
perform integrated adversarial review followed by the full relevant verification.
This cadence does not defer tests required to justify an individual module.

Before starting a module, load its named skills from `.commandcode/skills/`;
the labels above are pointers, not substitutes for reading them. The governing
design skills and their links are listed in the architecture document.

## Immediate next action

Start M00 and the M01 contracts, resolve the SQLite/runtime gate, then establish
M02–M05 before wiring the first complete payment. Voice capability research can
start early; it must not change payment authority or delay the non-voice path.

No app commands are claimed as tested here. This plan creates documentation only.
Commit/push requires a new explicit instruction for those actions under AGENTS.md
R4; the previous documentation push was not standing authorization.
