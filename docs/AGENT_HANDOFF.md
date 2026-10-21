# Implementation handoff — Devin AI, Codex and other coding agents

Status: continuation handoff for the implemented simulator. Read IMPLEMENTATION_STATUS.md before choosing work; Devin AI is not required.
Date: 2026-10-21. [Root rules](../AGENTS.md) remain authoritative.

[Copyable assignment](DEVIN_PROMPT.md) · [Current status](IMPLEMENTATION_STATUS.md) ·
[Module specifications](ACTION_PLAN.md) · [Architecture and reuse links](ARCHITECTURE.md)

## Current continuation — read before the original construction sequence

For GitHub Codespaces installation and continuation, first use [CODESPACES.md](CODESPACES.md) and the Codespaces section of AGENTS.md.

The delivery branch is **`final`** at commit **`18a4bda`** (pushed to
`origin/final`); `ai-1` remains the prior implementation branch. There is
application code now. Do not regenerate it or repeat M00 from scratch. Read
RUNBOOK.md, DESIGN_SYSTEM.md, COMPANION_CONTRACT.md, SECURITY.md and
REUSE_ANALYSIS.md alongside the root invariants (now I1–I12).

The working software includes the simulated utility-bill journey, durable ledger,
drafts/favorites, optional speech and local evidence-based message help. The
current home shows one active task card plus a single "Ayuda y opciones" entry;
procedure screens keep at most two visible actions outside the fixed flow bar,
and a browser budget check enforces that limit. Security hardening adds the
anti-impersonation notice, explicit local/server data deletion, bounded ledger
growth with rate limiting/retention, and production CSP/HSTS/CORP headers. Design
is Personal-inspired blue/cyan, phone-width, with labeled bottom navigation and
standalone install metadata. Ímpetu supplies calm next-move guidance; Gambit and
Wolf and Cronos supply bounded evidence/corroboration adaptations with notices.
No upstream instructions, LLM service or autonomous Google tools are imported.

Next work is the outstanding device/user/manual evidence and any reproduced
fixes, not another plan or provider integration. Run existing technical checks
before changing behavior; retain the guard against old responses replacing a
newer draft, review revalidation and distinct cancel/exit/speech events.

## Mission and boundaries

When assigned implementation, deliver a complete, runnable mobile-first practice
simulator for people with very low digital literacy. Start with the complete
synthetic utility-bill journey, then expand to other complete simulated procedures
only after its applicable gates. Home, favorites, contextual help, optional speech,
persistent progress, confirmation, results, practice receipts, cancellation and
repeat practice must work against real application state.

Simulation is the finished scope. Do not build bank connections, live payments,
provider onboarding, payment webhooks, financial login, secret requirements or
real settlement. Do not add an LLM/agent service just to implement spoken help;
the proposed initial voice approach uses browser adapters and approved copy.

All user-facing copy is es-AR. Keep “Modo práctica — no se mueve dinero” visible;
label receipts as practice. Respond to the user in Spanish; code and technical
documentation stay English, with the audience exceptions listed in AGENTS.md.

## Read once, then consult the governing source

1. `AGENTS.md`, the current task and `.commandcode/taste/taste.md`.
2. `docs/PRODUCTO_EQUIPO.md` and `docs/PRODUCT.md`: experience, intended person and
   the simulation boundary. The photos themselves are not required to start.
3. `docs/ARCHITECTURE.md`: client/server split, durable state, ADR-006 and reuse.
   ADR-005 is explicitly superseded; M11–M14 are no longer active work.
4. `docs/ACTION_PLAN.md` and `docs/IMPLEMENTATION_STATUS.md`: M00–M10 dependencies,
   tasks, acceptance and what has actually been done.
5. `docs/RED_TEAM_USABILITY.md`, `docs/VALIDATION.md` and `docs/EVIDENCE_LEDGER.md`:
   U01–U20, first-use/transfer protocol and limits on claims.
6. Consult `docs/HACKATHON_PLAYBOOK.md` / `docs/DEMO_AND_PITCH.md` for final delivery,
   and `docs/BOOK_REFERENCE.md` for methodology provenance. Do not require the PDF.

Inspect current files before acting. Planning-time statements that no code exists
must be revised when source and executable evidence change; never delete a real
implementation just because an old document describes an empty repository.

## Skills are executable working methods

Open each applicable `SKILL.md` under `.commandcode/skills/` before its phase.
Use ordinary file reads if your tool does not discover that path. Never rename,
shorten or rewrite upstream skills merely to make another agent's loader happy;
R2 governs concrete loader-defect fixes. No need to read all 92 for every task.

| Phase | Skill directories to read | Required application |
| --- | --- | --- |
| Start/resume | `git-discipline`, `destination-driven-construction` | Verify branch/work, preserve it, and implement coherent usable behavior |
| New code/contracts | `secure-by-construction`, `falsifiable-testing` | Define boundaries, failure behavior and checks that detect violations |
| Unfamiliar existing code | `software-archaeology` | Understand behavior/callers before changing it; preserve unrelated work |
| Domain/architecture choice | `decision-record-discipline` | Record alternatives, assumption, reversibility and revisit trigger |
| UI and home | `frontend-component-boundaries`, `frontend-accessibility-by-construction`, `non-overwhelming-ux` | Cohesive fields, semantics/focus, concrete copy and safe exits |
| Results/recovery | `honest-degradation`, `falsifiable-testing` | Distinguish failed, pending, unknown and verified simulated success |
| Failure diagnosis | `diagnosing-bugs` | Reproduce, test a diagnosis, fix and rerun; no unchanged retry loops |
| Module/integrated review | `red-team-auditing`, `invariant-hunting` | Challenge I1–I10 and U01–U20; label unexecuted hypotheses honestly |
| Status/pitch/docs | `claim-provenance-discipline`, `daubert-defensible-writing` | Keep facts, assumptions and measured outcomes distinct |
| AGENTS/presentation changes | `writing-agents-md`, `honest-technical-oratory`, `readme-architecture` as applicable | Maintain root contract; present observable contribution and scoped evidence |

State which skills you applied in the handoff/status. Reading a skill name is not
applying its method. Do not invent a universal test order where a skill gives a
contextual rule; retain local verification and the integrated cadence in the plan.

## Execution sequence

Use ACTION_PLAN.md for full contracts; the table below is the implementation order,
not a second competing product specification.

| Step | Work to execute | Concrete exit |
| --- | --- | --- |
| A — M00 | Inspect tools, scaffold safely, pin compatible Node/Next/React and npm lockfile; set up meaningful checks | Frozen install, real app response, build and relevant check; exact commands recorded |
| B — M01/M02 | Domain/step/event schemas, synthetic catalog, es-AR visible/spoken copy and accessible UI | Illegal step/state rejected; fields/help/focus/keyboard/zoom behavior checked |
| C — M03/M04/M05 | Draft/favorite storage, durable internal simulation engine, session-isolated API, confirmation boundary | Restore/migration errors handled; owned operations persist; replay/races create one result |
| D — M06/M07/M09 | Wire full payment, home/favorites, review, result, receipt, cancel/recover/repeat | Actual browser journey completes and stored status agrees after reload/cancellation |
| E — M08 | User-activated speech output/input, bounded commands, controls and no-voice fallback | Approved content speaks; denial/errors remain usable; voice never confirms payment |
| F — M10 | Integrate and review, execute relevant suite, document startup/reset and current evidence | Working complete simulator and accurate limitations; no future-provider gate |

Speech capability investigation begins early alongside A/B; do not discover at
handoff that a required target/browser has never been examined. Data persistence,
session isolation, accessibility and errors belong in their first relevant module,
not a later hardening phase.

## Technical working rules

- Use the existing checkout on `final` for this assignment; inspect and preserve
  local changes. Do not merge to `main`, force-push, rewrite history, or assume a
  new agent session owns someone else's files. Follow R4 for commits/pushes.
- Preserve AGENTS.md, skills and learned preferences when scaffolding. If a tool
  generates its own delimited rules, handle them according to `writing-agents-md`.
  Do not overwrite the checkout with an unrelated template.
- Prefer the proposed React Aria + XState + Zod architecture, Dexie drafts and a
  durable internal operation ledger. Install only necessary packages; SurveyJS
  is an alternative, not an additional required form engine. Verify native SQLite
  compatibility; if it fails, diagnose or record a justified adapter decision.
- No browser state, form validation or spoken sentence can establish success.
  The internal simulation ledger determines the operation result; atomic changes
  and stable attempt keys handle duplicate input, lost responses and restart.
- Keep `leaveDraft`, `stopSpeech` and financial-simulation cancellation separate.
  A tap/held key from one screen cannot confirm the next. Form-field Enter is not
  financial confirmation; deliberately focused accessible confirmation still works.
- Never request microphone permission to read instructions aloud. Input is opt-in,
  visible and stoppable. Do not persist raw audio/transcripts or invent speech
  amounts, payees or results. Record the actual browser processing route.
- Synthetic catalog definitions, migration source and authored tests belong in
  source. DB instances, screenshots, logs, traces, recordings and generated test
  reports are ignored at creation. Do not put the source book or credentials in Git.
- Do not send messages, spend money, recruit participants or publish/deploy merely
  because a written plan mentions those actions. Execute only within the actual
  assignment's authorization and available tools; prepare reviewable artifacts.

## Evidence that must survive handoff

Run the actual application, not just a linter. Verify a representative full flow,
reload/back/close restoration, cancellation followed by status lookup, identical
request replay, wrong-session lookup and lost-response recovery. Relevant tests
must observe resulting state, not only the mocked response that the test arranged.

Run axe and local keyboard/zoom/focus checks on the rendered steps. A browser
emulator or stubbed speech adapter does not establish physical-device speech or
screen-reader usability. Follow `falsifiable-testing` for relevant red-first or
negative-control evidence; do not weaken assertions to hide a failure.

Execute the applicable U01–U20 scenarios, recording actual build, scenario,
expected/observed result and pass/fail/not-run. Their human-observation variants remain unexecuted. Technical scenario coverage is mapped in IMPLEMENTATION_STATUS.md; do not count it as participant evidence. In particular, test very low-literacy first use without
coaching, wrong bill/period, repeated input, microphone denial, uncertain status,
exit vs cancellation, and repeat practice. Automated runs cannot invent human
comprehension; follow VALIDATION.md for consented target-user observation.

If a physical device, participant, permission or capability is unavailable, mark
that specific check NOT RUN/BLOCKED, finish all independent code/verification,
and report what remains required. Do not call the overall release validated or
stop after installing dependencies. Unknown event timing does not block coding.

## Required delivery

1. Implemented runnable source and pinned dependencies, with relevant tests and
   authored synthetic data; no live-provider code or financial credentials.
2. Exact tested install/start/build/check/reset commands and working directories
   in the appropriate README/AGENTS section, preserving data safety.
3. Updated IMPLEMENTATION_STATUS.md and EVIDENCE_LEDGER.md with actual observations,
   open checks and the next concrete unfinished task.
4. Sanitized screenshots/recording or a clear manual demo recipe when requested
   and supported, plus the current actual supported-device matrix.
5. A final Spanish handoff: what works, changes made, commands/outcomes, failures,
   manual-not-run checks, remaining blockers and actual Git branch/commit state.

Do not replace these deliverables with another architecture proposal, empty test
run, unconnected screen collection, or an invented “all verified” statement.
