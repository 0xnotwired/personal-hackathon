# Autonomía Digital — proposed architecture

Status: **proposed, not implemented**. Date: 2026-10-21.

[Module action plan](ACTION_PLAN.md) · [Product contract](../AGENTS.md) ·
[Product definition](PRODUCT.md) · [Spanish team summary](PRODUCTO_EQUIPO.md)

## Product and observable behavior

Help an older adult complete everyday digital procedures independently, using
clear es-AR text, optional spoken guidance, and recoverable steps. The teammate's
sketches supply the home: large labeled task cards, favorites, visible help, and
a microphone. A task opens a guided journey rather than merely redirecting to
an unfamiliar application.

Complete product journey, using the internal simulation engine:

> “¿Qué necesitás hacer?” → “Pagar una factura” → choose service → enter bill
> details → review payee and amount → personally confirm → simulated provider
> result → receipt, with a genuine simulated cancellation path.

The person can ask “¿Qué hago?”, listen to instructions, repeat or slow them,
go back, and resume a saved draft. Every feature remains operable without voice.
The usable-product destination is a complete practice application. Its simulated
bill flow is the product, not a temporary stand-in for a required live integration.
Other simulated procedures follow after the first meets AGENTS.md I1–I10.
Always display “Modo práctica — no se mueve dinero” and label practice receipts.
No payment API, bank login, provider agreement or financial credential is needed.

This is a design document. The repository currently contains product instructions
and vendored skills, not an application, package manifest, or executable tests.
Dependency versions and browser behavior must be verified during implementation.

## Authority and trust boundaries

Threat model before module layout:

- A caller can edit browser state, local storage, transcripts, URLs, and HTTP
  requests; replay a confirmation; double-click; race another tab; and lose a
  response after the server has committed. Treat all these inputs as untrusted.
- The server owns simulated bill amounts, operation status, authorization,
  idempotency, and cancellation. A client machine, receipt cache, or voice output
  cannot establish that a payment happened.
- The initial deployment assumes a controlled demo server and synthetic bills.
  Host compromise, real financial authorization, and external payment settlement
  are outside that delivery. Demo session isolation still applies from day one.

The same simulation-only model applies to development and the finished deployed
product. Anonymous sessions isolate practice records; they grant no financial
account authority. The internal MockProvider is application code, not a third-party
service. No live payment/authentication/callback layer is planned.

| Crossing | Checkpoint | Failure behavior |
| --- | --- | --- |
| UI/voice → flow | Typed event allowlist and current-state guard | Explain unsupported action; keep the current step |
| IndexedDB → flow | Versioned draft parser and migration | Preserve the original record; offer explicit recovery |
| Browser → server | Bounded schema parsing, same-origin mutation checks, anonymous session ownership | Reject without changing an operation |
| Confirmation → operation | Bind confirmation to server quote, draft revision, session, and idempotency key | Stale/changed details require a new review |
| Server → provider/store | Narrow provider interface and atomic state transitions | Return known status or an unresolved transport error; never infer success |
| Speech adapter → browser/vendor speech service | Capability detection, explicit activation, disclosed processing route | Stop listening/speaking; retain all written controls |

An anonymous opaque session cookie isolates demo users without an account. Use
HttpOnly, SameSite, and Secure on HTTPS deployments; do not use a client-supplied
session ID as identity. Every operation lookup and cancellation checks ownership.
A confirmation token binds the reviewed synthetic bill to its practice session.
It authorizes only a state change in the simulation, never a bank transaction.

## System shape

Use a **modular Next.js application**, TypeScript, App Router, and a Node server.
The same deployment serves pages and the small procedure API. No separate Python
service, agent framework, queue, vector database, or microservice fleet is needed.

```mermaid
flowchart TB
  person[Person: touch, keyboard, optional voice]
  subgraph browser[Browser - untrusted inputs]
    ui[Home and accessible procedure UI]
    flow[XState procedure actor]
    speech[Speech adapter and command allowlist]
    drafts[Dexie: drafts, favorites, preferences]
    ui <--> flow
    speech -->|Allowed non-commit events| flow
    flow -->|Approved copy and verified result| speech
    flow <--> drafts
  end
  subgraph server[Next.js Node server - operation authority]
    api[Validated route handlers and session checks]
    service[Review, commitProcedure, status, cancel]
    provider[MockProvider]
    ledger[SQLite operation ledger]
    api --> service
    service --> provider
    provider <--> ledger
  end
  person <--> ui
  person <--> speech
  flow -->|Review and explicit confirmation requests| api
  api -->|Authoritative operation snapshots| flow
```

Server Components handle the static shell and initial catalog. Client Components
own the active procedure actor, form interactions, IndexedDB, and speech. Access
browser APIs after hydration; mark provider, ledger, and configuration modules as
server-only. XState owns procedure transitions; form libraries own field editing
and errors, not a second copy of the procedure lifecycle.

## Repositories to combine

Consume focused packages through the package manager; do not merge upstream Git
histories or copy entire repositories. Pin compatible versions and commit the
lockfile when implementing. Preserve required notices when adapting source.

| Repository | Role in this proposal | Reuse mode / license noted during research |
| --- | --- | --- |
| [Next.js](https://github.com/vercel/next.js) | Routing, React rendering, Node API | Framework; exact version chosen and tested in M00 |
| [React Aria](https://github.com/adobe/react-spectrum) | Accessible fields, dialogs, buttons, focus behavior | `react-aria-components`; Apache-2.0 |
| [XState](https://github.com/statelyai/xstate) | Procedure states, guarded events, recovery | `xstate` and React binding; MIT |
| [Zod](https://github.com/colinhacks/zod) | Shared parsed contracts at browser/server/storage boundaries | Package; MIT |
| [React Hook Form](https://github.com/react-hook-form/react-hook-form) | Field validation and editing, if native controlled fields become cumbersome | Optional package; MIT |
| [Dexie](https://github.com/dexie/Dexie.js) | IndexedDB draft, favorite, and preference repository | Package; Apache-2.0 |
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | Durable local simulated-operation ledger | Newly proposed adapter dependency; verify release, license, and native build compatibility in M00 |
| [MSW](https://github.com/mswjs/msw) | Client HTTP timeout/error scenarios | Development/test dependency only; MIT |
| [Playwright](https://github.com/microsoft/playwright) | Browser journeys and restart/recovery checks | Test dependency; Apache-2.0 |
| [axe-core](https://github.com/dequelabs/axe-core) | Automated accessibility checks, via a Playwright integration | Test dependency; MPL-2.0 |

The durable ledger dependency is new to this proposal: Dexie alone cannot make a
server-side operation survive a process restart or enforce cross-tab idempotency.
SQLite is a proposed implementation behind a narrow repository interface, not an
assertion that native modules already work in this environment.

### References and alternatives

| Repository | What to borrow | What stays outside the initial application |
| --- | --- | --- |
| [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) | Clear questions, error summaries, review and confirmation patterns | UK branding and its entire UI stack; code MIT, documentation separately licensed |
| [Docassemble](https://github.com/jhpyle/docassemble) | Guided interviews, contextual definitions and help | Python/YAML runtime; MIT |
| [Assembly Line](https://github.com/SuffolkLITLab/docassemble-AssemblyLine) | Mobile-friendly procedural questions, review and document delivery | Court-specific content and infrastructure; MIT |
| [AI Senior Assistant](https://github.com/mateo252/AI-Senior-Assistant) | Voice-help interaction ideas for older adults | Windows application, screenshots, Ollama, and browser extension; Apache-2.0 |
| [SurveyJS Form Library](https://github.com/surveyjs/survey-library) | Alternative JSON-driven form renderer | Add only if it wins an evaluated comparison; MIT applies to Form Library, not all SurveyJS products |

These references are design inputs, not claims that the original apps already
satisfy our product requirements. Research inspected documentation/examples and
licenses; integration, dependency security, maintenance, and accessibility are
not yet verified. Do not add SurveyJS alongside another full form engine by default.

## Proposed module layout

Paths below are to create, not files that already exist. Non-route folders inside
`app/` have no `page.tsx`; they organize modules without creating public routes.

```text
app/
├── layout.tsx                         # language, page landmarks, global styles
├── page.tsx                           # home route
├── (flow)/[procedure]/page.tsx         # thin route into the procedure controller
├── api/
│   ├── reviews/route.ts               # validate a simulated bill and issue review
│   └── operations/                    # commit, owned lookup, cancellation routes
├── flows/
│   ├── contracts.ts                   # step/event/result schemas and types
│   ├── registry.ts                    # only implemented procedure definitions
│   ├── procedure-machine.ts          # XState lifecycle and guards
│   └── pago-servicio/                 # bill-specific schema, steps, copy bindings
├── components/
│   ├── ui/                            # cohesive accessible primitives
│   ├── home/                          # task cards, favorites, resume card
│   └── procedure/                     # shell, fields, review, result, receipt
├── lib/
│   ├── copy/es-AR/                    # shared visible/spoken instructions and help
│   ├── money.ts                       # integer minor units and display formatting
│   ├── persistence/                   # Dexie schemas, migrations, storage status
│   └── server/                        # session, boundary parsing, procedure service
├── speech/                            # output/input adapters, capability and intent map
└── providers/
    ├── contracts.ts                   # provider interface, serializable safe results
    ├── mock/                          # deterministic provider, ledger and migrations
    └── server-factory.ts              # fail-closed provider selection
tests/
├── unit/                              # transitions, schemas, money, command allowlist
├── integration/                       # provider ledger, session isolation, recovery
└── e2e/                               # complete journeys, axe and fault scenarios
docs/                                  # this proposal, module plan, later evidence
```

Component boundaries follow behavior and cohesion: `BillField` keeps label,
input, hint, and error together; `HelpPanel` owns its open/focus behavior;
`SpeechControls` owns speech controls. Do not split each HTML element into a file
or place financial rules inside page components.

## Domain contracts and state ownership

| Model | Minimum fields | Authority |
| --- | --- | --- |
| `ProcedureDefinition` | Stable ID, version, steps, primary action, help and back/cancel targets | Domain code; schema-checked |
| `Draft` | Schema version, draft ID, procedure version, step ID, entered values, operation reference/key if any | IndexedDB, parsed on read; not payment evidence |
| `Review` | Server quote ID, payee, synthetic bill ID, ARS amount in integer centavos, draft revision, confirmation binding | Server; client-edited values never set the payable amount |
| `Operation` | ID, owner session, draft/attempt ID, request fingerprint, idempotency key, revision, provider status, cancellation capability | Server ledger |
| `Favorite` | Implemented procedure ID and ordering preference | Local device; no bill/account/card credentials |
| `SpeechPreferences` | Enabled/muted state and chosen rate/voice preference | Local device; no recording or transcript |

Planned step states:

`choosingService → enteringBill → reviewing → confirming → submitting → result`

Recovery adds `restoring`, `reconciling`, and `recoverableError`; cancellation adds
`cancelling` and `cancelled`. Back navigation changes a draft, never an already
committed operation. Editing reviewed data invalidates its confirmation binding.

The [low-literacy review](RED_TEAM_USABILITY.md) requires separate typed events
for leaving a draft, stopping speech and requesting financial cancellation.
Leaving the UI cannot mutate an operation; submitting a cancellation request
cannot render `cancelled` without provider confirmation. Persist/reconcile the
original operation when either the payment or cancellation response is lost.
Each state binds visible/spoken copy, the primary action and a truthful safe
exit explanation. Do not reuse a generic “Cancelar” action across these meanings.

The controller must reject carried-over pointer gestures and held-key repetition
from previous steps as financial confirmation. An implicit form-field submit is
not confirmation. Normal deliberate keyboard activation of the focused review
control remains supported. Test UI intent and server idempotency separately:
one correctly deduplicated operation could still have been unintended.

The three provider outcomes remain `succeeded`, `pending`, and `failed` (I4).
Transport uncertainty is not a fourth invented provider outcome: show “No pudimos
confirmar el estado” and reconcile. `cancelled` describes a verified lifecycle
transition with its own label; it must not remain visually or audibly “pagado”.

### Narrow server API

| Proposed endpoint | Contract |
| --- | --- |
| `POST /api/reviews` | Parse draft/bill identifiers; resolve a synthetic catalog bill; return a server quote and confirmation binding |
| `POST /api/operations` | Call the sole `commitProcedure()` boundary with reviewed binding and stable idempotency key |
| `GET /api/operations/:id` | Return only the owning session's current authoritative result |
| `POST /api/operations/:id/cancel` | Verify ownership/capability/revision; transition atomically and return the current result |
| `GET /api/operations?draftId=...` | Reconcile the owning session's draft after a lost response, even when the client lacks an operation ID |

Route handlers parse and authorize; the procedure service orchestrates; the
provider changes operation state. There is no generic proxy endpoint accepting a
client-selected URL. All mutation requests receive same-origin/CSRF protection;
an opaque operation ID is never sufficient authorization.

### Idempotency, recovery, and cancellation

1. Persist a draft/attempt ID and idempotency key **before** sending a confirmation.
   If this write fails, explain the storage problem and block commit; do not
   silently replace a durable attempt with an untracked request.
2. The ledger enforces unique ownership/draft-attempt and idempotency constraints.
   Repeated identical requests return the same operation; a reused key with
   different details is rejected. Another key cannot bypass the active-attempt
   constraint for the same reviewed bill/draft. A new attempt after a known
   failure requires an explicit retry and another valid confirmation.
3. Validate and commit the simulated operation in a single SQLite transaction.
   Do not separately write “paid” and an idempotency receipt. No real outbound
   payment call takes place in this transaction.
4. A timeout, refresh, or app restart triggers lookup/reconciliation, never an
   automatic new payment. Pending results remain pending until the provider says
   otherwise. A lost session cannot take ownership by presenting a draft ID.
5. The initial mock advertises cancellation for its pending and simulated-paid
   operations until cancelled; no artificial countdown is needed. Cancellation
   changes the persisted operation exactly once. An injected non-cancellable
   scenario must explain the capability limit honestly.

All payment/status/cancellation operations are local simulation logic with durable
state, so no external financial transaction or distributed outbox is necessary.
“Consultar resultado” checks that existing simulated operation. Cancellation
changes the stored simulated operation; it never claims to annul a real bill.

## Voice and accessible interaction

Start with a `SpeechOutput` adapter around browser speech synthesis and a
`SpeechInput` adapter around feature-detected browser speech recognition. Both
remain candidates until tested on physical target devices. No Python assistant,
LLM, or paid speech account is necessary for the proposed first implementation.

Only user activation starts output or microphone capture. Display listening,
speaking, paused, unavailable, and error states; offer stop, repeat, slower, and
mute. Stop recording on navigation, cancellation, and backgrounding. Browser
recognition may involve a vendor service: disclose the actual supported route
and do not promise offline/private processing without verification.

An allowlisted intent map supports “quiero pagar la luz”, “repetí”, “más despacio”,
and “no entiendo”. Unknown/ambiguous speech asks for a simple selection; it does
not guess amounts, advance a consequential action, or invoke `commitProcedure()`.
Visible/spoken help reads the same copy record. Amounts and receipts are formatted
from validated values; result announcements use the latest provider revision.
Stop stale utterances when a result changes, especially on cancellation.

Use native semantics and React Aria as needed. Keep help in a consistent position,
focus the step heading after navigation, associate errors with fields, and avoid
competing screen-reader/live-region and synthesized-speech announcements. The
project's 44×44 px target is intentionally stricter than WCAG 2.2 AA's general
24×24 px minimum; retain it. Verify 4.5:1 body contrast, keyboard operation, screen
reader behavior, and usable 200% zoom. Automated axe results alone do not prove AA.

## Runtime, persistence, and diagnostics

Proposed baseline: pinned compatible Next.js/React/Node 24 LTS releases, npm with
a committed lockfile, one Node server, and a persistent SQLite file. Verify the
native adapter build first. Browser drafts and server ledger both need migrations.
Ignore generated DB files, logs, recordings, and test outputs at creation; retain
only intentionally authored synthetic catalog definitions and migration source.

Use a writable data directory outside public assets and tracked source. The demo
needs no payment credentials. The simulation-only provider factory has no live
adapter and imports no payment SDK. Simulation scenarios are deterministic
server-owned test fixtures, not arbitrary payment-status overrides in public UI.

A local cloud-development run can use its retained filesystem; a deployed demo
needs HTTPS, a persistent disk, and server-controlled session-secret configuration.
Generate secrets securely at deployment, never in these docs. Ephemeral/serverless
filesystems or multiple independently writing replicas invalidate this deployment
choice; switch the ledger adapter to a shared transactional store before using them.

Keep structured diagnostics to event type, correlation ID, and safe error code.
Do not log bill/customer identifiers, session/confirmation secrets, raw requests,
audio, or transcripts. Disable financial mutation offline, retain the draft, and
provide an explicit reconciliation/retry path after connectivity returns. A full
offline PWA is not assumed; clearing browser data cannot be promised recoverable.

## Complete simulator deployment and scope

The user clarified that **complete and usable means a fully functioning simulated
experience**, without real-provider connections. Keep the existing modular UI,
flow controller, persistence and internal server ledger; remove live financial
onboarding, provider contracts, bank authentication, settlement and webhook work.

The simulator must actually process its own state: lookup a synthetic bill,
review it, confirm once, persist the simulated result, resume after interruption,
return a labeled practice receipt and perform a verified simulated cancellation.
A decorative success screen without these behaviors is not complete.

Keep a small deterministic catalog for success, pending, rejection, interrupted
response and cancellation. A learner can repeat a practice with a new attempt
without deleting the earlier record. Starting another practice is not a reset
of an unresolved attempt; first resolve or explicitly explain its simulated state.
Scenarios are authored code/test data, not arbitrary client claims of success.

Deployment needs the normal app runtime, retained application data, HTTPS when
publicly hosted, usable help and a concise startup/reset procedure. No provider
secrets, financial KYC, merchant agreement, live settlement or staffed call center
is a prerequisite. Include a human contact only if one is actually available;
otherwise contextual help, clear retry/exit and repeatable practice are the
supported assistance. User-study observations remain separate from runtime logs.

### ADR-005 — Historical real-payment release requirement

**Status: superseded by ADR-006; not an implementation instruction.** The previous
plan inferred real bill-payment execution from “usable product”. It required a
provider integration, financial authority and settlement, with a replaceable
adapter and provider-capability checks. Its strongest argument was a real-world
outcome if that had been the goal. The assumption that real payment was required
was incorrect; the user explicitly clarified simulation is sufficient. No such
adapter, agreement or financial flow has been implemented. Preserve this record
so the rejected interpretation is not silently reintroduced.

### ADR-006 — Deliver a complete simulation-only practice product

Status: **accepted scope**, user clarification on 2026-10-21. Architecture/package
choices remain proposed until implemented and verified.

- **Decision / forces:** real UI, voice controls, durable drafts/operations,
  realistic simulated outcomes, recovery and labeled practice receipts. Simulate
  services internally; no external payment, bank or utility connection.
- **Alternatives:** real-provider integration adds unauthorized scope, access and
  dependencies; its best argument is real settlement, which is not this goal.
  Static screen mockups are simpler but cannot support usable repeatable practice.
- **Assumption:** practicing complete procedures is the product's intended use.
  User comprehension in the simulator still needs actual validation.
- **Reversibility / cost:** two-way before deployment; keep scenario/state formats
  versioned so content can evolve without losing progress. Any live integration
  would be a separate scope decision, not an automatic later milestone.
- **Revisit trigger:** an explicit future user request changes the product goal;
  no external-provider gate should be added merely to present the simulator.

## Proposed decision records

All records below are **proposed** on 2026-10-21. AGENTS.md remains authoritative
for product rules. Accepted implementation decisions should retain these IDs and
be linked from the corresponding modules; supersede a decision rather than erase it.

### ADR-001 — Keep one modular Next.js deployment

- **Decision / forces:** one TypeScript application; small product surface, existing
  Next.js direction, no existing backend to preserve.
- **Alternatives:** separate frontend/Python Docassemble backend adds deployment
  and contract boundaries; its best argument is an existing interview engine.
  Microservices add operations without independent scaling needs; their best
  argument is team/service isolation.
- **Assumption:** one application team and a single coherent procedure product.
- **Reversibility / cost:** two-way at module boundaries, increasingly costly once
  HTTP contracts spread. Keep domain/provider contracts independent of routes.
- **Revisit trigger:** a required integration needs an independent runtime or
  independently deployed/scaled ownership emerges.

### ADR-002 — Separate device drafts from authoritative operations

- **Decision / forces:** Dexie for drafts/favorites, SQLite behind a server ledger
  interface for simulated payments; refresh and process-restart recovery matter.
- **Alternatives:** client-only results cannot establish server truth; their best
  argument is simplicity. In-memory server state loses committed results on
  restart; its best argument is zero infrastructure. Managed PostgreSQL is valid
  but adds setup; its best argument is durable multi-instance operation.
- **Assumption:** a single Node deployment with persistent disk is available.
- **Reversibility / cost:** one-way-ish after data exists; migrate ledger and
  preserve idempotency/ownership constraints behind the same interface.
- **Revisit trigger:** adapter installation fails on the selected runtime, storage
  is ephemeral, or more than one independently writing instance is required.

### ADR-003 — Use our step UI and one procedure machine

- **Decision / forces:** React Aria + XState + Zod; add React Hook Form only when
  justified. Match the teammate's design and keep one transition authority.
- **Alternative:** SurveyJS offers JSON-driven forms quickly; its best argument
  is mature branching/rendering. It remains an alternative because control over
  step/help/speech behavior and transaction boundaries still needs validation.
- **Assumption:** one payment procedure does not justify a form-builder platform.
- **Reversibility / cost:** two-way initially; more expensive after step rendering
  spreads. Keep definitions separate from JSX.
- **Revisit trigger:** a representative SurveyJS integration meets the same
  accessibility/voice/recovery contract with demonstrably less custom code.

### ADR-004 — Use bounded voice commands and approved spoken copy

- **Decision / forces:** optional browser speech adapters; no free-form AI controls
  payment decisions. es-AR behavior and mobile support remain uncertain.
- **Alternatives:** cloud speech offers more consistent recognition but adds a
  data-processing/vendor decision; that consistency is its best argument. The
  desktop assistant has useful interaction ideas but a mismatched runtime.
- **Assumption:** at least one explicitly supported mobile-browser configuration
  can provide acceptable speech input/output and a complete touch fallback.
- **Reversibility / cost:** two-way through adapters; changing where audio goes
  requires renewed privacy disclosure and validation.
- **Revisit trigger:** physical-device checks fail, es-AR voices are unusable, or
  the selected recognition service's data-processing route cannot be explained.

## Validation and unresolved evidence

The [action plan](ACTION_PLAN.md) maps modules to evidence. Essential experiments
include replay/race/restart tests against the real mock ledger; recovery after a
lost response; cancellation verified by subsequent lookup; and a complete journey
with speech unavailable. Use negative controls that bypass confirmation, delete
idempotency enforcement, or fabricate success to show relevant tests fail.

No application build, test suite, speech device check, or dependency integration
has run for this proposal. Node/package compatibility, speech support and data
processing, hosting persistence, and usability with older adults are open gates,
not established capabilities. Implementation should record actual commands and
outcomes as they become available. No external-provider gate is required for
this simulation-only release. Software checks cannot replace [user comprehension
and transfer between simulated bills](VALIDATION.md); successful practice is not
evidence of an actual payment or independent real-world banking.

## Repository skills applied

- [secure-by-construction](../.commandcode/skills/secure-by-construction/SKILL.md): authority and threat boundaries before layout; typed contracts and fail-closed mutations.
- [decision-record-discipline](../.commandcode/skills/decision-record-discipline/SKILL.md): alternatives, assumptions, reversibility, and observable revisit triggers.
- [frontend-component-boundaries](../.commandcode/skills/frontend-component-boundaries/SKILL.md): cohesive fields/help/speech behavior rather than ceremonial file splitting.
- [frontend-accessibility-by-construction](../.commandcode/skills/frontend-accessibility-by-construction/SKILL.md): semantics, focus, keyboard behavior and manual verification.
- [non-overwhelming-ux](../.commandcode/skills/non-overwhelming-ux/SKILL.md): consistent help, recoverable steps, controlled speech and no artificial urgency.
- [destination-driven-construction](../.commandcode/skills/destination-driven-construction/SKILL.md): coherent product deliveries with persistence and authority boundaries from the start.
- [falsifiable-testing](../.commandcode/skills/falsifiable-testing/SKILL.md): acceptance evidence that detects violated invariants.
- [git-discipline](../.commandcode/skills/git-discipline/SKILL.md): inspect actual state and retain a restore point; this proposal does not authorize commits or pushes.
