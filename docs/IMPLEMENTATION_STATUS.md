# Implementation status — continuation for future coding agents

Observed date: 2026-10-21. Baseline before construction:
`c2c3d988a01b740654fb76454c459e711ac0ec03`. Implementation is the source tree
accompanying this record on **ai-1**, created at the user's request after work on
devin. The current continuation task does not authorize commit, push or merge;
the changes described below live in the working tree. Devin AI is not required.

[Root contract](../AGENTS.md) · [Runbook](RUNBOOK.md) · [Mobile UI](DESIGN_SYSTEM.md) ·
[Security](SECURITY.md) · [Companion contract](COMPANION_CONTRACT.md) ·
[Reuse analysis](REUSE_ANALYSIS.md)

## What exists

A runnable Next.js mobile simulator with Personal-inspired blue/cyan styling,
labeled bottom navigation and standalone manifest/icons. One complete synthetic
utility-bill procedure supports luz/gas/agua, drafts, favorites, contextual help,
explicit review/confirmation, durable operations, receipt download/history,
pending/rejected examples, verified cancellation and lost-response reconciliation.
Drafts keep a local revision; a stale tab warns instead of silently replacing a
newer saved draft and offers an explicit keep-or-reload choice. Optional speech
aborts microphone capture when the page becomes hidden. The header identifies the
product as Autonomía Digital instead of the Personal wordmark; Personal remains
only as a design-inspiration note, not as a brand or partnership claim.
Security hardening for the intended audience adds an anti-impersonation notice,
explicit local/server data deletion, bounded ledger growth and a production
CSP/header set; the threat model and residual risks are in
[SECURITY.md](SECURITY.md).

Ímpetu-adapted next-action help does not assume a medical condition. Gambit and
Wolf and Cronos adaptations support optional local pressure-message help with
quoted evidence, bounded es-AR rules, inconclusive no-match and unsent reply drafts.
No live payment/provider/Google/LLM integration is present or required.

## Module state and evidence

| Module | State | Implemented mechanism / limits |
| --- | --- | --- |
| M00 runtime | VERIFIED IN SCOPE | Exact manifest/lock, Node 24, Next build and actual production-server browser requests |
| M01 domain/copy | VERIFIED IN SCOPE | Synthetic catalogue, Zod contracts, per-step copy and typed XState events; human comprehension pending |
| M02 accessible UI | VERIFIED IN SCOPE | Native/React Aria semantics, focus, 44px controls, axe and keyboard on core steps, reduced-motion animations; not a WCAG certification |
| M03 persistence | VERIFIED IN SCOPE | Dexie drafts/favorites/preferences, reload, field/back preservation, visible storage denial, corrupted-record recovery barrier, revisioned cross-tab conflict with keep/reload choice, explicit clear-data control |
| M04 mock engine | VERIFIED IN SCOPE | Real SQLite transactions, uniqueness, pending/failed/cancelled states; separate writer-process/replay check |
| M05 API/session | VERIFIED IN SCOPE | Strict 4KiB JSON, same-origin mutation, anonymous HttpOnly ownership, review binding and replay/conflict tests; origin compares host so same-host TLS termination is accepted; seven-day Secure cookie, 30/min limiter, per-session caps and seven-day retention |
| M06 flow | VERIFIED IN SCOPE | Explicit confirmation, input-carryover prevention, stale-response guards, back/leave/restore |
| M07 home | VERIFIED IN SCOPE | Working task/favorite/resume/history, future procedures clearly unavailable, mobile nav; one task card plus a single "Ayuda y opciones" entry |
| M08 speech | IMPLEMENTED; DEVICE UNVERIFIED | Browser adapter, bounded commands, output controls, denial/unsupported fallback tested with stubs; capture aborts on visibilitychange/pagehide; three visible controls plus a reading-options disclosure; physical es-AR speech NOT RUN |
| M09 result/recovery | VERIFIED IN SCOPE | Server-verified status, labeled receipt, cancellation uncertainty, lost commit response, repeat; restored review refreshes server-owned amount |
| M10 integrated delivery | IN PROGRESS | Technical checks pass within recorded scope; device/user/manual acceptance and public deployment remain open |
| Companion/safety adaptation | VERIFIED IN SCOPE | Attribution/commit pins, seven domain cases plus browser checks; not a fraud accuracy benchmark |

## Executed commands and observed scope

Working directory: repository root. Runtime for this continuation: Node 24.21.0,
npm 11.19.0, Next 16.4.2, React 19.3.1; exact remaining versions are in
package-lock.json. Chromium uses the machine's `/usr/bin/chromium`, headless,
one worker.

- `npm_config_cache=/tmp/autonomia-npm npm ci`: frozen-lock installation path.
- `npm run typecheck`: Next route type generation plus TypeScript.
- `npm run dev`: started and served the actual Autonomía Digital practice UI and operation-list API.
- `npm test`: **26 passed**, zero failed/skipped in the final source suite.
- `npm run build`: production compilation/type check/static generation.
- `npm run test:e2e`: **29 passed**, zero failed/skipped in the final browser suite.
- `npm run format:check`: authored app/test/config formatting; generated Next types excluded.
- `npm run verify`: combines the checks above against the built production server.

The final run's exact outcome must be read before reusing these counts; they are
not a promise that future edits pass. Test artifacts are generated/ignored in
`test-results/`. No screenshot, speaker quality or target-user observation is
inferred from test counts. The e2e server is started and stopped by Playwright;
retained files/dependencies do not imply a process survives a new cloud task.

### Continuation verification (2026-10-21, working tree on ai-1)

- `npm run verify` completed: typecheck, 26 unit tests, production build, 29
  browser tests and format check.
- Red-first U17 check: two pages in one browser context; while the second page
  saved a newer bill code, the first page navigated back and forward. Before the
  fix the first page overwrote the newer value with no warning and the new test
  failed. After the revisioned write, the stale page showed the conflict, the
  newer record survived, and the explicit "Conservar mi versión" action replaced
  it. The same test now passes.
- U03 check: a pasted formatted code with spaces is normalized to nine digits;
  leading zeros survive. The first run exposed `maxLength` truncating the raw
  string before normalization; removing it made the check pass.
- HTTP boundary: a review request with `Origin: https://localhost:3000` returns
  200, while a foreign origin still returns 400.
- Speech stub: `visibilitychange` to hidden aborts recognition and returns the
  control to idle. Physical microphone behavior is not inferred from this.
- The header now renders the product icon and "Autonomía Digital"; a 390 px
  screenshot was inspected and `scrollWidth` remained 390. This is not a
  physical-device or screen-reader check.
- Security checks: the browser suite asserts no credential/card fields and no
  cross-origin HTTP requests across the full practice, the production security
  headers, a `Secure`/`HttpOnly`/`SameSite` cookie under a forwarded https
  scheme, and that deleting practice data removes both local and server records.
- `npm audit --omit=dev --audit-level=high`: zero reported vulnerabilities.
- UX simplification per [ROADMAP_UX_IA.md](ROADMAP_UX_IA.md): the red-first
  button-budget check first failed on home with seven visible actions, and now
  walks home, service, bill, review-at-risk, waiting and result asserting at
  most two visible actions outside the persistent flow bar. The home shows one
  task card plus "Ayuda y opciones" (favourites, message help, history and data
  deletion) while the voice panel moved into the fixed "Voz" navigation entry;
  the review starts with the server-owned amount as the dominant element; the
  example bill points to the number once with a pulse that respects
  `prefers-reduced-motion`; the help dialog highlights the primary control. The
  voice modal shows three actions and keeps repeat, speed and mute inside
  "Opciones de lectura". All previous flow, safety, security, voice and axe
  checks stay green.

### Representative technical observations

- Review reload preserves step and code and fetches current server-owned details;
  modified local display amount cannot replace the synthetic amount shown on restore.
- Repeated input/held Enter cannot bypass review; deliberate keyboard activation
  can complete it. Concurrent replay returns one operation; competing valid
  reviews cannot both commit for the same session/draft.
- A response dropped after a real commit reconciles to that operation, not a
  second one. A dropped response before commit allows deliberate same-review retry.
- Pending is distinct from success. Leaving does not cancel. A dropped cancellation
  response remains unconfirmed until a server lookup verifies cancellation.
- Opening a prior receipt preserves the current unfinished draft. Corrupt local
  data remains preserved until a new practice is explicitly chosen.
- A stale tab no longer overwrites a newer saved draft; the conflict is visible
  and the choice to keep the local version is explicit.
- Recognition is aborted when the page becomes hidden or is unloaded; step
  changes already stopped playback and capture.
- A same-host `https` Origin is accepted at the HTTP boundary, keeping mutation
  requests usable behind TLS termination; a foreign Origin still returns 400.
- Completed touch journeys run with microphone denial, both speech APIs absent
  and IndexedDB unavailable. Stubbed output controls and forbidden voice confirmation
  are exercised separately; no real microphone/audio quality result is implied.
- Axe runs on the main home/service/bill/review/success states and the safety dialog;
  a full journey is driven with Tab/Enter at 390px. Programmatic 200% text enlargement
  and reflow on home/bill were checked; full manual zoom on every state is still open.
- Manifest/theme/icon responses and labeled mobile navigation were exercised.
  Static home/result/safety screenshots were visually inspected. Physical PWA
  installation and device safe-area behavior have not been observed.
- No password/card/OTP field appears on any practice screen, and the walked flow
  makes no cross-origin HTTP request.
- Production responses carry CSP, HSTS, CORP and the existing headers; the session
  cookie is `HttpOnly`, `SameSite=strict` and `Secure` under a forwarded https
  scheme. The cookie lasts seven days.
- Clearing practice data removes the IndexedDB record and the session's ledger rows.

### Failure/fix and negative-control record

Early runs failed because the engine did not exist, then exposed an SQL parameter
count error, an internal-origin comparison rejecting browser requests, a missing
repeat transition and invalid receipt definition-list nesting. Dedicated checks
also reproduced old responses navigating away from home. These were corrected;
tests were not disabled to hide failures.

Continuation reproductions:

- A two-page check reproduced a stale tab silently replacing a newer saved draft.
  The fix is a revisioned Dexie write (compare-and-swap) plus explicit keep/reload
  actions. The test was red before the change and green after it.
- The U03 check reproduced a real input defect: `maxLength=9` truncated spaces
  before normalization, leaving a short code. Removing the redundant attribute
  fixed it; the handler still strips non-digits and slices to nine digits.
- `sameOrigin` compared scheme and host, so a same-host `https` Origin was
  rejected. It now compares the URL host and accepts http/https; the foreign
  origin rejection still passes.
- The first security header check expected `SameSite=Strict`, while the serialized
  attribute is lowercase `SameSite=strict`. The assertion was corrected; this was
  a test-expectation defect, not a cookie behavior change.

Negative control: temporarily removed session filtering from the actual ledger
lookup. The unchanged session-isolation test failed (returned another owner's
operation instead of undefined). The exact source was restored and the suite
rerun. This mutation was never committed; the production build used the restored source.
The original Gambit matcher was also run in isolation; its duplicate `i` flag
failure with an already-insensitive regex is corrected in our adaptation, not
reported as a demonstrated exploit of Gambit's authored callers.

## U01–U20 technical mapping versus people

| Scenarios | Current technical coverage | Still unobserved |
| --- | --- | --- |
| U01–U04 | Labeled controls, example/correction, spaces/leading-zero normalization, server review and immutable amount | First-use discovery and correct account/period understanding; synthetic examples share account and period per service |
| U05–U09 | Repeated taps, held Enter, replay, forbidden voice confirmation, mic denial | Physical mobile keyboards/recognition and user interpretation |
| U10–U12 | Smaller-step help, output control stubs, reload/field recovery, lost-response lookup | Reading/hearing comprehension; physical Back/tab close |
| U13–U17 | Exit/cancel distinction, cancellation response loss, deterministic pending engine, storage failure, session/conflicting review tests, stale-tab draft conflict | Participant understanding and broader browser multi-tab/storage behavior |
| U18–U20 | Keyboard/axe, limited text enlargement, no live credential fields, contextual help and safe pause | Real screen reader/full zoom, motor access, unassisted stopping/asking for help |

## Next concrete work

1. Run physical Android/iOS speech/permission and home-screen install checks;
   record actual devices/versions, fallback and failures without claiming offline speech.
2. Complete manual screen-reader/full zoom/focus/target checks on every state,
   including pending/failed/cancel dialogs; fix reproduced problems.
3. Observe the intended low-literacy group without a walkthrough, then a second
   synthetic bill under VALIDATION.md. Keep assisted/stopped attempts visible.
4. Deploy one Node instance with a persistent local ledger, test a real server
   restart and HTTPS cookie/origin behavior on that host, apply edge rate
   limiting and verify HSTS/CSP there, then rehearse 3–5 minutes.

Do not add another procedure before the first's applicable gates. Do not replace
these remaining observations with new architecture, a generative agent, fake
participant data or live provider onboarding. Apply the repository skills to the
actual next task and preserve all unrelated work.

## Skills applied in this implementation

`git-discipline`, `destination-driven-construction`, `secure-by-construction`,
`falsifiable-testing`, `frontend-component-boundaries`,
`frontend-accessibility-by-construction`, `non-overwhelming-ux`,
`honest-degradation`, `red-team-auditing`, `software-archaeology`,
`dependency-provenance`, `writing-agents-md`, `decision-record-discipline` and
claim/provenance discipline. The upstream skill/taste files remain untouched.
The 2026-10-21 continuation additionally applied `git-discipline`,
`destination-driven-construction`, `software-archaeology`, `secure-by-construction`,
`red-team-auditing`, `invariant-hunting`, `honest-degradation`,
`non-overwhelming-ux`, `frontend-accessibility-by-construction`,
`assume-breach-modeling`, `attack-surface-triage`,
`authorization-surface-mapping`, `resource-exhaustion-review` and
`writing-agents-md`.

## Reusable cloud setup

The environment configuration draft now stores the tested install script
(Node 24 check, frozen-lock npm ci, typecheck, domain tests, build) and startup
instructions for the existing checkout. Saving did not publish the environment;
review/save and publish in environment settings are still needed to activate that
draft for later tasks. Fresh-task restoration has NOT been independently tested.
No network allowlist or secret binding was changed.

## Codespaces continuation added

`.devcontainer/devcontainer.json` pins Microsoft's Node 24 image by inspected
manifest digest, runs `.devcontainer/setup.sh` on creation and forwards private
port 3000 by default. The setup installs missing Chromium, uses npm ci and runs
verify with a fresh production test server (port 3000 must be free). Copilot's
instruction file points back to AGENTS.md and repository skills. No AI/provider
secret is embedded. Read CODESPACES.md for starting/resuming and the explicit
unverified remote lifecycle. A local Docker pull was denied at layer download;
no container-build or actual GitHub Codespaces launch is claimed.
