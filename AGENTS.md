# AGENTS.md — Operating manual: Autonomía Digital

This repo builds the hackathon entry for the **autonomía digital** challenge: a
mobile-first web app that helps an older adult complete a real everyday digital
procedure — starting with a utility bill payment, then bank procedures — end to end,
alone, and without fear of making a mistake.

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

A person who did not grow up with technology opens one link on their phone. They are not
asked to "navigate a dashboard", create an account from memory, or decode jargon. They see
one clear task at a time in plain Spanish, they can ask "¿qué hago?" at any moment, they
can always go back, and nothing irreversible happens until they confirm in words they
understand. When they finish, they paid their bill themselves. That is the product: not a
usability polish layer, but **agency over a real procedure, with mistakes made recoverable**.

Target user: older adults with low digital literacy and a rational fear of making an
irreversible error, possibly with reduced vision, hearing, or motor precision. Barriers in
scope are the challenge's own: habits, language, trust, and the feeling that "this wasn't
built for me."

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

### I5 — One primary action per screen, plain language, no dark patterns

Each step has exactly one primary action in plain es-AR Spanish, with no hidden defaults,
no pre-checked opt-ins, no urgency timers that discard work, and no jargon ("token",
"sesión", "CVU" without an explanation).

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

### I8 — No real money and no live credentials in the prototype

Integrations sit behind a provider adapter whose default is a mock. Live payment credentials
are never committed and are refused unless explicitly enabled for a non-demo environment.

- **Mechanism:** a single provider interface with `MockProvider` as the default; an env guard
  that refuses live keys when `DEMO=true`; no keys in the repo. Composition:
  `irreversible-action-gate`, `secret-lifecycle-discipline`.
- **Why (falsifiable):** a hackathon demo that moves real money is an irreversible action on a
  stranger's account. The guard is checkable: grep for live key variables and assert none are
  read at startup in demo mode.

### I9 — Depth before breadth

One procedure works end to end (against the mock) before a second procedure is started. A
half-finished second flow demos nothing the challenge asks for.

- **Mechanism:** the Definition of Done requires a passing end-to-end test for a *complete*
  flow before a new flow is added.
- **Why (falsifiable):** the challenge is "todo el proceso de una vez"; a flow that stops
  before confirmation is not that process. The e2e test is the evidence.

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
├── components/              accessible UI primitives (large targets, plain copy)
├── lib/                     validation, formatting, es-AR copy, state persistence
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

---

## Numeric values that are decisions, not defaults

Do not "clean up" these during unrelated work:

| Value | What it is | Why it is fixed |
| ----- | ---------- | --------------- |
| `44` | Minimum touch target, px | WCAG 2.2 AA / platform guidance; I6 |
| `4.5:1` | Minimum body-text contrast | WCAG 2.2 AA; I6 |
| `200%` | Text zoom that must not break the layout | WCAG reflow requirement; I6 |
| `1` | Primary actions per screen | I5 — a second equal action is a violation |
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
- **The invariants I1–I9 have no mechanisms yet** (no code). Each says which mechanism to
  build; until then they are convention, and this file does not pretend otherwise.
- **Skills #91 `terminal-first` and #92 `working-on-main`** encode the original author's
  personal preferences, not general methodology. Treat them as operating style.

---

## Definition of Done

Every item traces to an invariant above.

- [ ] One procedure runs end to end against the mock: start → confirm → result, with a working
      undo/cancel path (I1, I2, I9).
- [ ] Reloading mid-flow resumes the same step with entered data intact (I3).
- [ ] Every displayed status comes from the server/provider result, never optimistic (I4).
- [ ] Each step has exactly one primary action, plain es-AR copy, a help target, and a safe
      exit (I5, I7).
- [ ] `axe` passes and keyboard + 200% zoom were checked on every step (I6).
- [ ] No live payment credentials; `MockProvider` is the default and demo mode refuses live
      keys (I8).
- [ ] The governing skill(s) were named and followed (R1).
- [ ] No skill edited except a defect fix; no taste file written by hand (R2, R3).
- [ ] No `git commit`/`git push` without explicit per-action authorization (R4).
- [ ] Throwaway artifacts were added to `.gitignore` at creation (R6).
- [ ] The reply to the user is in Spanish (R5).
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
