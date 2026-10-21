# Implementation status — continuation for future coding agents

Observed date: 2026-10-21. Baseline before construction:
`c2c3d988a01b740654fb76454c459e711ac0ec03`. Implementation is the source tree
accompanying this record on **ai-1**, created at the user's request after work on
devin. The current task authorizes committing/pushing this batch to ai-1, not
standing permission for future Git actions. Devin AI is not required.

[Root contract](../AGENTS.md) · [Runbook](RUNBOOK.md) · [Mobile UI](DESIGN_SYSTEM.md) ·
[Companion contract](COMPANION_CONTRACT.md) · [Reuse analysis](REUSE_ANALYSIS.md)

## What exists

A runnable Next.js mobile simulator with Personal-inspired blue/cyan styling,
labeled bottom navigation and standalone manifest/icons. One complete synthetic
utility-bill procedure supports luz/gas/agua, drafts, favorites, contextual help,
explicit review/confirmation, durable operations, receipt download/history,
pending/rejected examples, verified cancellation and lost-response reconciliation.

Ímpetu-adapted next-action help does not assume a medical condition. Gambit and
Wolf and Cronos adaptations support optional local pressure-message help with
quoted evidence, bounded es-AR rules, inconclusive no-match and unsent reply drafts.
No live payment/provider/Google/LLM integration is present or required.

## Module state and evidence

| Module | State | Implemented mechanism / limits |
| --- | --- | --- |
| M00 runtime | VERIFIED IN SCOPE | Exact manifest/lock, Node 24, Next build and actual production-server browser requests |
| M01 domain/copy | VERIFIED IN SCOPE | Synthetic catalogue, Zod contracts, per-step copy and typed XState events; human comprehension pending |
| M02 accessible UI | VERIFIED IN SCOPE | Native/React Aria semantics, focus, 44px controls, axe and keyboard on core steps; not a WCAG certification |
| M03 persistence | VERIFIED IN SCOPE | Dexie drafts/favorites/preferences, reload, field/back preservation, visible storage denial, corrupted-record recovery barrier |
| M04 mock engine | VERIFIED IN SCOPE | Real SQLite transactions, uniqueness, pending/failed/cancelled states; separate writer-process/replay check |
| M05 API/session | VERIFIED IN SCOPE | Strict 4KiB JSON, same-origin mutation, anonymous HttpOnly ownership, review binding and replay/conflict tests |
| M06 flow | VERIFIED IN SCOPE | Explicit confirmation, input-carryover prevention, stale-response guards, back/leave/restore |
| M07 home | VERIFIED IN SCOPE | Working task/favorite/resume/history, future procedures unavailable, mobile nav |
| M08 speech | IMPLEMENTED; DEVICE UNVERIFIED | Browser adapter, bounded commands, output controls, denial/unsupported fallback tested with stubs; physical es-AR speech NOT RUN |
| M09 result/recovery | VERIFIED IN SCOPE | Server-verified status, labeled receipt, cancellation uncertainty, lost commit response, repeat; restored review refreshes server-owned amount |
| M10 integrated delivery | IN PROGRESS | Technical checks pass within recorded scope; device/user/manual acceptance and public deployment remain open |
| Companion/safety adaptation | VERIFIED IN SCOPE | Attribution/commit pins, seven domain cases plus browser checks; not a fraud accuracy benchmark |

## Executed commands and observed scope

Working directory: repository root. Runtime: Node 24.19.0, npm 11.9.0,
Next 16.4.2, React 19.3.1; exact remaining versions are in package-lock.json.
Chromium uses the machine's `/usr/bin/chromium`, headless, one worker.

- `npm_config_cache=/tmp/autonomia-npm npm ci`: frozen-lock installation path.
- `npm run typecheck`: Next route type generation plus TypeScript.
- `npm run dev`: started and served the actual Personal practice UI and operation-list API.
- `npm test`: **21 passed**, zero failed/skipped in the final source suite.
- `npm run build`: production compilation/type check/static generation.
- `npm run test:e2e`: **23 passed**, zero failed/skipped in the final browser suite.
- `npm run format:check`: authored app/test/config formatting; generated Next types excluded.
- `npm run verify`: combines the checks above against the built production server.

The final run's exact outcome must be read before reusing these counts; they are
not a promise that future edits pass. Test artifacts are generated/ignored in
`test-results/`. No screenshot, speaker quality or target-user observation is
inferred from test counts. The e2e server is started and stopped by Playwright;
retained files/dependencies do not imply a process survives a new cloud task.

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
- Completed touch journeys run with microphone denial, both speech APIs absent
  and IndexedDB unavailable. Stubbed output controls and forbidden voice confirmation
  are exercised separately; no real microphone/audio quality result is implied.
- Axe runs on the main home/service/bill/review/success states and the safety dialog;
  a full journey is driven with Tab/Enter at 390px. Programmatic 200% text enlargement
  and reflow on home/bill were checked; full manual zoom on every state is still open.
- Manifest/theme/icon responses and labeled mobile navigation were exercised.
  Static home/result/safety screenshots were visually inspected. Physical PWA
  installation and device safe-area behavior have not been observed.

### Failure/fix and negative-control record

Early runs failed because the engine did not exist, then exposed an SQL parameter
count error, an internal-origin comparison rejecting browser requests, a missing
repeat transition and invalid receipt definition-list nesting. Dedicated checks
also reproduced old responses navigating away from home. These were corrected;
tests were not disabled to hide failures.

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
| U01–U04 | Labeled controls, example/correction, server review and immutable amount | First-use discovery and correct account/period understanding |
| U05–U09 | Repeated taps, held Enter, replay, forbidden voice confirmation, mic denial | Physical mobile keyboards/recognition and user interpretation |
| U10–U12 | Smaller-step help, output control stubs, reload/field recovery, lost-response lookup | Reading/hearing comprehension; physical Back/tab close |
| U13–U17 | Exit/cancel distinction, cancellation response loss, deterministic pending engine, storage failure, session/conflicting review tests | Participant understanding and broader browser multi-tab/storage behavior |
| U18–U20 | Keyboard/axe, limited text enlargement, no live credential fields, contextual help and safe pause | Real screen reader/full zoom, motor access, unassisted stopping/asking for help |

## Next concrete work

1. Run physical Android/iOS speech/permission and home-screen install checks;
   record actual devices/versions, fallback and failures without claiming offline speech.
2. Complete manual screen-reader/full zoom/focus/target checks on every state,
   including pending/failed/cancel dialogs; fix reproduced problems.
3. Observe the intended low-literacy group without a walkthrough, then a second
   synthetic bill under VALIDATION.md. Keep assisted/stopped attempts visible.
4. Deploy one Node instance with a persistent local ledger, test a real server
   restart and HTTPS cookie/origin behavior on that host, then rehearse 3–5 minutes.

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
