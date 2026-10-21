# AGENTS.md — Operating manual: Autonomía Digital

This repo builds the hackathon entry for the **autonomía digital** challenge: a
mobile-first digital companion that helps an older adult complete everyday digital
procedures in a complete practice environment, with written and spoken guidance. Start with one simulated
utility bill payment end to end; medical appointments, transport, shopping, and bank
procedures are later extensions, not implemented features.

**There is no application code yet.** This file is written *before* the code exists.
The invariants below are design constraints derived from the challenge's stated
pressures, not post-incident lessons. Where a mechanism is named, it is the thing to
build; until it exists the invariant is **convention**, and this file says which kind
each one is. Do not cite an incident here that did not happen.

The product copy is **Spanish (es-AR)**. This file, the skills, and code stay in
English unless a skill or the UI itself requires otherwise.

---

## Hierarchy (which file wins on conflict)

1. **`.commandcode/taste/taste.md`** wins on **communication style** (currently: reply in
   Spanish). It overrides this file on style.
2. **`.commandcode/skills/*/SKILL.md`** wins on **methodology**. If a skill and this file
   disagree about *how* to do a task, the skill is the source of truth — this file governs
   *when* to reach for a skill and what the product must guarantee, not the skill's method.
3. **`AGENTS.md` (this file)** governs **product invariants and repo rules**.

If a `CLAUDE.md` is ever added, it inherits rule 3's scope, and this file wins on conflict
unless `CLAUDE.md` explicitly says otherwise.

---

## The product in one paragraph

A person who did not grow up with technology opens one link on their phone and sees
"¿Qué necesitás hacer?", a few large task cards, favorites, and visible help. They can
choose a task by touch or supported voice input, then follow one clear step at a time in
plain Spanish, without a required account or technical jargon in the demo. The app can
read instructions aloud; the person can ask "¿qué hago?",
go back, and resume saved progress. Nothing consequential happens until they explicitly
confirm in words they understand. The intended outcome is **understanding and control
while practicing a procedure, with mistakes made recoverable**. Simulation is the agreed
finished-product scope: no real money, bank connection, utility integration or settlement.

Target user: older adults with low digital literacy and a rational fear of making an
irreversible error, possibly with reduced vision, hearing, or motor precision. Barriers in
scope are the challenge's own: habits, language, trust, and the feeling that "this wasn't
built for me."

The baseline interaction must support **very low digital literacy**: do not assume
knowledge of icons, links, sessions, microphone permissions or pending transactions.
Concrete labels/examples, safe repeated-input handling and unassisted first-use
observation are required. Use [adversarial usability scenarios](docs/RED_TEAM_USABILITY.md)
with `red-team-auditing` and `non-overwhelming-ux`; design hypotheses are not confirmed
failures. User confusion never authorizes payment, credential sharing or auth bypass.

### Agreed experience and usable-product destination

This direction combines the teammate's paper sketches and the user's approval in the
design discussion. It is an agreed target, not evidence of implemented behavior.

- **Home:** large cards with icons AND text, favorites for frequent tasks, a visible
  "¿Qué hago?" entry, and a microphone button. Payment, medical appointments, transport,
  and shopping are the product roadmap. The first demo exposes only the working payment
  journey; any roadmap items shown must be clearly unavailable, not clickable dead ends.
  Bottom navigation, if included, also needs text labels; messages and calls are not
  committed features merely because their icons appear in a sketch. An offered support
  channel is included only if someone actually provides it; contextual self-help and safe
  exits are required, while a staffed call center is not a release prerequisite.
- **First complete journey:** home → choose service → enter bill details → review payee
  and amount → explicit confirmation → verified simulated result and receipt. Include
  backward navigation, persisted drafts, contextual help, and the mock cancellation path.
- **Voice:** the app speaks as well as listens. First delivery includes user-controlled
  reading of instructions and contextual help, plus a small explicit command set such as
  "repetí", "más despacio", "no entiendo", and "quiero pagar la luz" on supported browsers.
  Free-form AI conversation is later work. Touch and keyboard remain complete alternatives.
- **External apps:** all supported practice flows finish inside this application using
  internal simulated services. No external payment app, bank login or service-provider
  connection is required. Links must not imply we performed a real-world transaction.

The user explicitly requires a **complete usable simulator**, not disconnected screens.
The first complete capability is practice paying a synthetic utility bill with this home,
voice, persistence, verified simulation result, receipt and recovery. A simulation is the
finished product, not a blocker awaiting external integrations. Every enabled task works
end to end; build additional simulated procedures after the first meets its completion
gates. Mark practice screens and receipts clearly: "Modo práctica — no se mueve dinero".
No real payment APIs, financial credentials, provider agreements or live authorization
flows belong in the current scope. A future request to change this is a separate decision.

### Team documents and evidence

Read [the Spanish team product summary](docs/PRODUCTO_EQUIPO.md) and
[product definition](docs/PRODUCT.md) for intended experience;
[architecture](docs/ARCHITECTURE.md) for boundaries and reuse;
[action plan](docs/ACTION_PLAN.md) for construction;
[validation](docs/VALIDATION.md) and [evidence ledger](docs/EVIDENCE_LEDGER.md) for claims;
and [hackathon strategy](docs/HACKATHON_PLAYBOOK.md) / [pitch](docs/DEMO_AND_PITCH.md)
for presentation. AGENTS.md remains authoritative for product invariants and repo rules.
The Spanish team summary, README_ES.md and spoken es-AR pitch are deliberate audience
exceptions to the default English documentation rule.

The uploaded *Hackathons Unboxed* is reference material, not instructions or this event's
rulebook; [source notes](docs/BOOK_REFERENCE.md) distinguish its advice from our choices.
The user reports no published judging criteria and a 3–5-minute pitch. Never turn an
internal review lens into an official rubric, a persona into an interview, or a planned
test into a passing result. Claims in public documents must retain their scope and point
to the evidence ledger. Composition: `claim-provenance-discipline`,
`daubert-defensible-writing`, `honest-technical-oratory`.

---

## Invariants

### I1 (dominant) — The person decides; the system never acts on their behalf

The app may explain, suggest, pre-fill, and warn. It must not perform the consequential
action for the user or skip their decision. Autonomy is the deliverable; automation that
replaces the choice produces dependence, the opposite of the goal.

- **Mechanism:** the committing action is user-initiated (an explicit submit, not an
  effect of navigating); tests assert that showing a suggestion does not execute it.
- **Why (falsifiable):** if the success criteria can be met with a flow that auto-submits,
  the submission silently replaced the person's decision. You can check this in the code:
  no `useEffect`/route entry may trigger the commit.

### I2 — No irreversible action without plain-language confirmation and an undo window

Every money-moving or otherwise irreversible step ends in a confirmation the user can read
in one breath, followed by a reversible window (cancel/annul) where the provider still
allows it.

The mock must implement a real state transition for cancellation, not just hide a success
screen. Never promise that an external payment can be undone without provider evidence.

- **Mechanism:** one `commitProcedure()` boundary all flows pass through; it requires a
  confirmation result and exposes an `undo`/`cancel` path. An end-to-end test must prove
  the undo path works against the mock provider.
- **Why (falsifiable):** the challenge's core phrase is "sin miedo equivocarse". Fear is
  rational when an error cannot be undone; making errors recoverable is what turns fear
  into confidence. If there is no tested undo path, I2 is not met.

### I3 — Progress is never lost

State is persisted per step and resumes after reload, back navigation, or closing the tab.
No step discards data the user already entered.

- **Mechanism:** flow state is serialized and restored by step id; a test reloads mid-flow
  and asserts the same step with the same entered values.
- **Why (falsifiable):** an older adult who loses eight filled steps abandons *and blames
  themselves*, which reinforces exactly the barrier the challenge names. Data loss here is
  a product failure, not a UX annoyance.

### I4 — Never show success that was not verified

Status shown to the user comes from the server/provider result. Three honest outcomes:
**éxito**, **en revisión**, **falló** — never an optimistic "listo" before confirmation.

- **Mechanism:** result UI renders from the server action / provider response, not from
  client-side optimism; the mock provider returns an explicit status. Composition:
  `honest-degradation` skill.
- **Why (falsifiable):** a plausible-looking wrong "pagado" is worse than an honest error,
  because the user stops worrying and does not retry. Check: no client component asserts
  success before the server result resolves.

### I5 — One primary action per procedure step, plain language, no dark patterns

Each step has exactly one primary action in plain es-AR Spanish, with no hidden defaults,
no pre-checked opt-ins, no urgency timers that discard work, and no jargon ("token",
"sesión", "CVU" without an explanation).

The home is a task chooser and may offer several task cards. This exception does not
permit competing primary actions inside a procedure step; help/back/voice controls remain
available as secondary actions.

Leaving a draft, stopping speech and requesting payment cancellation must have distinct
events, labels and truthful consequences. Leaving after submit does not annul payment.
A new review control requires fresh deliberate activation; previous taps, held keys and
implicit form submissions cannot become financial confirmation.

- **Mechanism:** step definitions declare a single primary action (enforced by the step
  schema type + a test); a copy review checklist per screen. Composition: `non-overwhelming-ux`.
- **Why (falsifiable):** cognitive load and distrust are two of the four barriers the
  challenge names. A step with two equal buttons is a measurable violation, not a taste call.

### I6 — Accessibility by construction (WCAG 2.2 AA)

Touch targets ≥ 44×44 px, body-text contrast ≥ 4.5:1, text usable at 200% zoom without loss
of function, full keyboard operation, screen-reader labels, and no meaning conveyed by color
alone.

- **Mechanism:** automated `axe` checks on every step plus a manual keyboard pass; the build
  fails on new violations once the suite exists. Composition: `frontend-accessibility-by-construction`.
- **Why (falsifiable):** generational barriers include vision and motor precision. These are
  checkable numbers, not a preference; a failing axe rule is the evidence.

### I7 — Help and a safe exit on every screen; zero dead ends

Every screen offers "¿Qué hago?" help and a safe way back/cancel. A failed step offers retry
and an alternate path — it never terminates the flow.

- **Mechanism:** the step schema requires a help target and a back/cancel target; a test
  enumerates all steps and asserts both exist.
- **Why (falsifiable):** "todo el proceso de una vez" fails the instant one step has no exit.
  Enumerating steps and checking for dead ends is mechanical, not subjective.

### I8 — The finished product simulates procedures and cannot move real money

The internal provider adapter is the simulation engine, not an external integration.
Do not implement a live payment adapter, financial-login flow, payment webhook or live
credential binding. Deployment does not change practice mode into financial operation.

- **Mechanism:** a simulation-only provider factory, synthetic service/bill data, no
  payment SDK or outbound financial call, and explicit practice labels. Composition:
  `irreversible-action-gate`, `secret-lifecycle-discipline`.
- **Why (falsifiable):** a hackathon demo that moves real money is an irreversible action on a
  stranger's account, outside the user's chosen scope. Verify that the finished build has
  no live financial adapter/credential requirement and that practice receipts are labeled.

### I9 — Depth before breadth

One simulated procedure works end to end before a second procedure is started.
Completion requires working software, persistence, accessible guidance and recovery.
A half-finished second flow does not make the first usable.

- **Mechanism:** the Definition of Done requires end-to-end and comprehension evidence for
  a complete simulated flow before a new flow is added. Its usable release requires no
  real-provider integration. Public presentation always identifies the simulation.
- **Why (falsifiable):** the challenge is "todo el proceso de una vez"; a flow that stops
  before confirmation is not that process. The e2e test is the evidence.

### I10 — Voice accompanies the person; it never becomes a prerequisite or payment authority

Written instructions and spoken guidance share the same approved step content. Spoken
results must come from the same provider status as the visible result (I4). Voice may
select a task or explain a step; recognition or an AI response must never directly call
`commitProcedure()`. The product uses an explicit accessible confirmation control for payment.

- **Mechanism to build:** a speech adapter with idle/listening/speaking/error states;
  user-started "Escuchar ayuda" plus pause, repeat, speed, and mute controls. Request
  microphone access only after activation; show when listening and provide stop/cancel.
  Do not listen in the background. Unsupported speech, permission denial, or recognition
  errors must leave the complete written/touch/keyboard flow available. Test these cases,
  verify that voice commands cannot commit a payment, and manually check es-AR speech on
  the selected mobile browsers. Do not store audio/transcripts in drafts, favorites, or
  logs. Before choosing a speech service, document whether audio/text leaves the device;
  do not assume a browser speech API works offline or processes locally.
- **Why (falsifiable):** reading difficulties can make spoken help useful, while hearing
  difficulties, browser support, or microphone refusal can make it unusable. Completing
  the same journey with speech disabled is the fallback check; a recognized phrase that
  moves money without explicit confirmation violates I1 even if recognition was correct.

---

## Repo rules: skills, taste, git

### R1 — Every task loads its governing skill before acting

Before a non-trivial task, identify the skill(s) in `.commandcode/skills/` that govern it and
read the relevant `SKILL.md`. The library is vendored here to be **applied**, always.

- **Mechanism:** none mechanical — Command Code loads only name+description at startup and
  reads the body on invocation. This is **enforced by review**. Checkable proxy: the output
  names the skill(s) followed.
- **Asymmetric failure:** skipping a governing skill is *silent* (the work still looks fine);
  loading an irrelevant one is *visible* and cheap. Bias toward loading.
- Common anchors: debugging → `diagnosing-bugs`; security review → `red-team-auditing`;
  unfamiliar code → `software-archaeology`; any multi-step change → `falsifiable-testing`,
  `git-discipline`; this file → `writing-agents-md`.

### R2 — Skills are upstream content; edit only to fix

Do not rewrite a skill's methodology to taste. Edit only to fix a concrete defect and keep it
spec-valid: `name` must equal the directory name (the loader **skips** mismatches), and
`description` must be non-empty. New skills are created with `/skill-builder`.

### R3 — Never write to `.commandcode/taste/**` by hand

Taste files are managed by the learning system. Record a preference with the `taste` tool.

### R4 — Git actions are per-action, never per-session

`git commit` and `git push` run only after the user explicitly authorizes **that specific
action**. "Work on the repo" is not commit permission. Solo repo on `main`: direct commits are
allowed only when explicitly requested; branch only once something works and is being extended
experimentally. Composition: `git-discipline`, `working-on-main`, `irreversible-action-gate`.

### R5 — Reply to the user in Spanish

Per `taste.md`. Product UI copy is es-AR; docs, skills, and code stay English.

### R6 — Throwaway artifacts are gitignored at creation

Any fixture, seed dump, scratch config, or example data goes into `.gitignore` in the same
action that creates it.

---

## Architecture (target — build toward this)

```
app/                         Next.js App Router (mobile-first, TypeScript)
├── (flow)/[procedure]/      one route group per procedure (pago-servicio first)
├── flows/                   procedure definitions + step state machines (domain)
├── components/              home cards, favorites, accessible UI and help controls
├── lib/                     validation, formatting, es-AR copy, state persistence
├── speech/                  speech output/input adapters; no payment authority
└── providers/               integration adapters — MockProvider is the default
tests/                       e2e flow tests + a11y (axe) checks
```

Rules of construction:

- **Procedure logic lives in `flows/`, not in components.** A flow is data + a state machine
  so I5/I7 can be checked by enumerating step definitions rather than reading JSX.
- **Commits go through one boundary** (`commitProcedure()`), so I2/I4 have a single place to
  enforce and audit.
- **Persistence is a first-class step concern** (I3), decided in the flow model, not bolted on.
- **Providers are interfaces.** No component imports a concrete payment SDK.
- **Drafts and favorites are local application data.** Save only the minimum needed to
  resume; never persist credentials, card details, or voice recordings. A saved draft is
  not a payment result. Handle storage failures visibly; resuming must not resubmit a
  payment, and uncertain results require reconciliation before retrying a charge.
- **Speech is an adapter, not the flow engine.** Spoken guidance consumes approved copy
  and verified state; it does not invent instructions, amounts, payees, or results.

### Reuse plan — selected direction, not installed dependencies

Repository documentation, examples, and licenses were inspected during planning. These
projects have not been installed, executed, or integration-tested here. Choose pinned
versions and verify React/Next.js/browser compatibility during implementation; preserve
applicable license and attribution notices when reusing code.

| Project | Intended role | License / boundary |
| ------- | ------------- | ------------------ |
| [React Aria](https://github.com/adobe/react-spectrum) | Accessible UI primitives, styled for the teammate's design | Apache-2.0; use React Aria, not Adobe's full product styling |
| [XState](https://github.com/statelyai/xstate) | Explicit procedure states, retries, and cancellation transitions | MIT; does not itself make provider actions reversible |
| [React Hook Form](https://github.com/react-hook-form/react-hook-form) + [Zod](https://github.com/colinhacks/zod) | Candidate forms and validation within our own step UI | MIT; choose the form approach before adding overlapping engines |
| [Dexie](https://github.com/dexie/Dexie.js) | Local draft and favorite persistence using IndexedDB | Apache-2.0; storage can fail or be cleared |
| [MSW](https://github.com/mswjs/msw) | Simulated HTTP responses and failure scenarios when an HTTP boundary exists | MIT; not a payment integration or a replacement for the domain provider |
| [Playwright](https://github.com/microsoft/playwright) + [axe-core](https://github.com/dequelabs/axe-core) | Complete journey and automated accessibility checks | Apache-2.0 / MPL-2.0; manual accessibility and speech checks still required |
| [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) | Reference for clear task, review, error, and confirmation patterns | MIT code; documentation has separate Open Government Licence terms |
| [Docassemble](https://github.com/jhpyle/docassemble) + [Assembly Line](https://github.com/SuffolkLITLab/docassemble-AssemblyLine) | Reference for guided procedures, contextual explanations, and document delivery | MIT; do not add their Python platform to the Next.js application by default |
| [AI Senior Assistant](https://github.com/mateo252/AI-Senior-Assistant) | Reference for voice assistance adapted to older adults | Apache-2.0; Windows/Python/Ollama app, not a drop-in web speech module |
| [SurveyJS Form Library](https://github.com/surveyjs/survey-library) | Alternative JSON-driven step/form renderer if a prototype demonstrates a better fit | MIT for Form Library only; do not assume other SurveyJS products share that license |

Start with our accessible step UI and XState; choose React Hook Form/Zod if needed.
SurveyJS is an alternative to that form approach, not another required layer. Evaluate
it only against the same one-primary-action, contextual-help, recovery, and accessibility
criteria. Keep a single owner for procedure transitions. No new dependency is justified
merely because its repository appears in this table.

---

## Numeric values that are decisions, not defaults

Do not "clean up" these during unrelated work:

| Value | What it is | Why it is fixed |
| ----- | ---------- | --------------- |
| `44` | Minimum touch target, px | WCAG 2.2 AA / platform guidance; I6 |
| `4.5:1` | Minimum body-text contrast | WCAG 2.2 AA; I6 |
| `200%` | Text zoom that must not break the layout | WCAG reflow requirement; I6 |
| `1` | Primary actions per procedure step | I5 — home task selection is the explicit exception |
| `3` | Honest result states (éxito / en revisión / falló) | I4 — no binary false confidence |
| `92` | Vendored skills in `.commandcode/skills/` | The full library as copied; a different count means skills were added or lost |
| `1024` / `64` | Max skill `description` / `name` length (chars) | Agent Skills standard; `name` must also match its directory |
| `13` | Skills currently over the `1024` description cap | Real count, not a target — see Known gaps |

---

## Repo map

```
personal-hackathon/
├── AGENTS.md                  # this file — product invariants + repo rules
├── LICENSE                    # Apache-2.0
├── README.md / README_ES.md    # human-facing product entry points
├── docs/                      # product, architecture, plan, validation and pitch
├── .commandcode/
│   ├── skills/                # 92 vendored Agent Skills (methodology — R1)
│   └── taste/taste.md         # learned prefs — READ-ONLY to the agent (R3)
└── (app/, tests/ — not created yet; scaffold next)
```

---

## Known gaps (honest state)

- **No application code exists yet.** No `package.json`, no build, no tests. Do not claim
  "tests pass" or "the build is green" until the scaffold exists and the command was run.
- **13 skills exceed the 1024-char `description` cap:** `client-side-trust-boundary`,
  `cloud-control-plane-reasoning`, `container-trust-boundary`, `credential-material-triage`,
  `data-leakage-hunting`, `data-provenance-mapping`, `dual-use-behavior-adjudication`,
  `known-defect-disposition`, `root-of-trust-reasoning`, `threat-attribution-restraint`,
  `untrusted-sample-handling`, `working-on-main`, `zero-trust-as-a-claim`. Property of the
  upstream files, not a local edit. **Revisit trigger:** if `cmd skills list --debug` reports
  them as skipped, truncate each `description` to ≤1024 (R2) — but confirm the loader rejects
  them before rewriting.
- **The invariants I1–I10 have no mechanisms yet** (no code). Each says which mechanism to
  build; until then they are convention, and this file does not pretend otherwise.
- **Home, favorites, speech, persistence, provider adapters, and all listed integrations
  remain unimplemented.** Speech engine choice and mobile-browser behavior are unverified;
  do not claim voice, offline support, or end-to-end payment works from this plan alone.
- **Skills #91 `terminal-first` and #92 `working-on-main`** encode the original author's
  personal preferences, not general methodology. Treat them as operating style.

---

## Definition of Done

Every item traces to an invariant above.

- [ ] One procedure runs end to end against the mock: start → confirm → result, with a working
      undo/cancel path (I1, I2, I9).
- [ ] The complete practice journey persists real application state, verifies simulated
      results/cancellation and labels its receipts. No external provider gate is imposed (I1–I4, I7–I9).
- [ ] Home offers labeled task cards, favorites, and help; every available task leads to a
      working flow, with roadmap items clearly unavailable (I5, I7, I9).
- [ ] Reloading mid-flow resumes the same step with entered data intact (I3).
- [ ] Every displayed status comes from the server/provider result, never optimistic (I4).
- [ ] Each step has exactly one primary action, plain es-AR copy, a help target, and a safe
      exit (I5, I7).
- [ ] First-use checks include very low digital familiarity without a walkthrough. Repeated
      input cannot bypass review; exit, speech stop and financial cancellation remain distinct
      in state, visible copy and spoken explanation (I1, I2, I5, I7, I10).
- [ ] `axe` passes and keyboard + 200% zoom were checked on every step (I6).
- [ ] No payment SDK, live financial credentials, bank login or external bill-payment call;
      practice mode remains explicit in development, deployment and receipts (I8).
- [ ] The app reads approved instructions/help aloud on supported browsers; listen, pause,
      repeat, speed, and mute controls were checked. The documented command set works, and
      permission denial or unavailable speech leaves a complete non-voice journey (I10).
- [ ] Voice cannot commit a payment, spoken results match provider status, listening is
      explicit and stoppable, and audio/transcripts are not persisted or logged (I1, I4, I10).
- [ ] The governing skill(s) were named and followed (R1).
- [ ] No skill edited except a defect fix; no taste file written by hand (R2, R3).
- [ ] No `git commit`/`git push` without explicit per-action authorization (R4).
- [ ] Throwaway artifacts were added to `.gitignore` at creation (R6).
- [ ] The reply to the user is in Spanish (R5).
- [ ] Behavioral/impact claims trace to scoped evidence; safe simulation is labeled and
      cannot be presented as real settlement or observed user autonomy (I1, I4, I9, team evidence rule).
- [ ] Skill-integrity commands below still pass.

---

## Verified commands

Run against this working copy (not recalled):

```bash
# R2 — count of skills; expect 92
ls .commandcode/skills | wc -l

# R2 — every skill's `name` must equal its directory name; no output = pass
for d in .commandcode/skills/*/; do
  b=$(basename "$d"); n=$(grep -m1 '^name:' "$d/SKILL.md" | sed 's/^name:[[:space:]]*//')
  [ "$b" != "$n" ] && echo "MISMATCH: $b vs $n"
done

# Known gaps — descriptions over the 1024 cap / load failures
cmd skills list --debug
```

A green run proves the count is intact and every `name` matches its directory. It does **not**
prove the skills load — only `cmd skills list --debug` shows load failures.

**App commands do not exist yet.** Once the Next.js scaffold is created, add the *actual*
`dev` / `test` / `lint` / `build` commands here after running them — do not write remembered
ones.
