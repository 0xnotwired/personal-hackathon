# Hackathon strategy and team execution

Status: proposed working strategy, not an official rubric. Date: 2026-10-21.

[Product](PRODUCT.md) · [Module plan](ACTION_PLAN.md) · [Pitch](DEMO_AND_PITCH.md) · [Book basis](BOOK_REFERENCE.md)

## The strategy

Make a usable product whose contribution the jury can recognize in one complete
journey: a person understands what is happening, personally decides, and can
recover without losing work or paying twice. Present the contribution through
observed behavior and working software, not package count or unsupported AI claims.

The user explicitly wants a complete usable simulator. It performs its own
practice journeys, voice, persistent state, receipts and recovery; it needs no
real-payment integration. Sketches and recordings do not replace the functioning
application. Practice mode stays explicit.

Book B01–B11 inform this strategy. They do not guarantee a win. The user reports
no published judging criteria and a **3–5-minute pitch**. Prepare both lengths;
confirm the exact slot and submission requirements with the organizer when able.

## Known information and open event constraints

| Item | Current information | Action / responsible role |
| --- | --- | --- |
| Theme | “Autonomía digital”, as recorded in AGENTS.md | Product owner retains the exact official challenge text if obtained |
| Pitch | User says 3–5 minutes | Presenter keeps both scripts ready and confirms exact time |
| Judging | User says no published criteria | Use internal review dimensions below; do not invent official weights |
| Deadline / remaining time | Not supplied | Delivery lead fills actual start, submission time and checkpoints before estimating hours |
| Team | User and a teammate's design contribution are known; complete roster unknown | Assign responsibilities by consent; do not invent people's availability or skills |
| Pre-existing code / reuse / AI rules | Not supplied | Compliance owner verifies what must be disclosed or was required to be built during the event |
| Required submission artifacts | Not supplied | Verify repo visibility, licenses, video, deployment, slide format, links and permitted demo modes |

Do independent product/technical work while these are unresolved. An unknown
reuse rule is a release/submission risk; a book recommendation does not resolve it.

## Internal review dimensions — no invented judge score

| Dimension | Specific question | Evidence to put within reach | Current state |
| --- | --- | --- | --- |
| Challenge relevance | Does the person complete the declared procedure with understanding and control? | Product job story + task observations + complete journey | Planned, untested |
| Insight quality | Which observation changed a design decision? | Sanitized observation → change → retest | No fieldwork yet |
| Distinction | What does this add beyond a tutorial, big buttons, or voice search? | Review, interrupted-task recovery, honest unresolved state and independent transfer | Proposed combination |
| Working implementation | Does it perform and persist what we show, including failure paths? | Reproducible build, actual ledger/provider responses and automated checks | No app code yet |
| Usability/accessibility | Can the supported person/device complete it without mandatory voice or takeover? | Device matrix, manual checks, user tasks, axe results | Pending |
| Viability | Who can use/distribute the practice product sustainably? | Learning context, simple hosting/maintenance costs and actual next-step evidence | Hypotheses only |
| Communication | Can a mixed audience explain the contribution after 3 minutes? | Timed rehearsal and a skeptic's questions | Draft scripts only |

Review these as **missing / planned / observed / blocked**, with evidence links.
Do not assign pretend judge points or infer a probability of winning.

## Workstreams and ownership

These are responsibilities to assign, not assumptions about who holds them.
One person may cover several roles; critical handoffs still need a second check.

| Responsibility | Output owned | Key handoff |
| --- | --- | --- |
| Product/research | Segment, task wording, observations, product decisions | Turns a finding into a concrete UI/flow change |
| UX/accessibility | Teammate's visual direction, copy, focus/keyboard and device checks | Supplies approved visual/spoken step content to engineering |
| Application/domain | State machine, forms, persistence, speech integration | Demonstrates complete behavior against server contracts |
| Simulation/runtime | Internal API, session isolation, durable simulated ledger, deployment/restore | Publishes deterministic scenario status/cancellation behavior |
| Evidence/release | Claims ledger, check outcomes, artifact checklist and support readiness | Approves which statements the presenter can make |
| Presenter/demo operator | Two timed pitches, script and fallback setup | Uses only released claims from the evidence owner |

For a small team, combine product/UX/presentation and engineering/runtime where
appropriate. Keep verification shared; do not have the presenter discover a
missing operation in front of the jury. These human roles do not authorize agent
delegation, messages to outsiders, spending or financial transactions.

## Work in coherent checkpoints

| Checkpoint | Required outputs | Decision |
| --- | --- | --- |
| C0 — shared target | Product definition, unknown event facts, named owners and visible risk list | Everyone can state the same usable outcome and simulation boundary |
| C1 — assumptions examined | E01/E05/E06 observations, simulation-state checks, revised copy | Resolve the highest-risk user/device/scenario assumption before adding breadth |
| C2 — complete integrated behavior | Working bill journey, authority/persistence/recovery, usable home/help/voice | Integrate modules; do not confuse individual screens with a release |
| C3 — evidence and operations | Relevant test runs, user-study findings, help/runtime/restore and simulation evidence | Decide whether the complete practice release is ready |
| C4 — submission freeze | Tested build reference, verified links/notices, honest demo recording and timed scripts | No discretionary new features; change only a blocker with targeted verification |

The release requires functioning simulation and usability evidence, with no external-provider gate. Submission
freeze is not permission to omit an unmet invariant. If time runs out before the
product is usable, disclose the unfinished capability; do not change its label.

Because the deadline is unknown, do not promise a 24/48/72-hour implementation.
Once known, allocate real capacity by role and dependencies. Reserve an explicit
final rehearsal/submission buffer, proposed initially as **20% of the remaining
work window**, then revise using actual estimates. This is a team planning
assumption, not a book rule or a reason to weaken completion criteria.

## Decision and integration rhythm

At each shared checkpoint, answer: what now works, what evidence supports that,
what is blocked, and what decision is next? Maintain a short current task list
with one owner and observable acceptance per item. Minimize concurrent unfinished
work. Review each module's authority, persistence and accessibility implications
as built; run relevant local checks and integrated verification at the delivery
horizon. Preserve the technical module IDs in ACTION_PLAN.md for traceability.

For a disagreement, write rival options and the cheapest observation that would
distinguish them. Prefer a user/scenario/device check over an aesthetic debate.
Record the losing option's strongest argument and the revisit trigger.

## Mentor/reviewer questions

Bring a specific artifact and the decision it should inform:

1. “En este recorrido, ¿qué paso impide que una persona mayor siga sola? Tenemos
   estas observaciones; ¿qué explicación alternativa estamos ignorando?”
2. “¿La práctica guarda y resuelve una operación dentro del simulador, o solo
   cambia de pantalla? ¿Se entiende que no mueve dinero?”
3. “¿Cómo resuelve hoy esta tarea el público que conocemos? ¿Con qué alternativa
   concreta debemos comparar nuestro recorrido?”
4. “¿Quién respondería cuando el estado queda pendiente? ¿Qué necesitaría una
   organización para sostener ese soporte?”
5. “Después de esta demo, ¿qué entendiste que funciona hoy y qué quedó ambiguo?”

No mentor opinion becomes user validation, a signed agreement or proof of
simulation correctness. Log what was learned and what still needs checking. No
mentor outreach has been performed by the agent.

## Risk register and response order

| Risk | Early signal | Response / owner role |
| --- | --- | --- |
| Scope drifts toward live finance | New bank-login, payment webhook or provider-agreement tasks appear | Remove them; the agreed product is a complete simulator |
| Guidance feels patronizing or confusing | User cannot explain review/status or dislikes tone | UX/research changes copy/pacing and retests; keep user control |
| Voice fails in the room or on target phones | Recognition errors or no usable voice | Engineering tests early; presenter has a disclosed recording/text path; product voice gate remains explicit |
| More features crowd out a complete task | Many screens, no reconciled result/recovery | Delivery lead finishes the declared procedure before new tasks |
| Evidence is missing or overclaimed | Placeholder counts or unsupported “validated” statements | Evidence owner removes the claim or supplies the actual observation |
| Reuse conflicts with event rules | Unconfirmed build-window/OSS/AI conditions | Compliance owner verifies and discloses provenance; no concealment |
| Presentation fails technically | Unrehearsed handoff, network/audio dependency | Demo operator rehearses live/video/stills paths and tested reset |
| Exhaustion causes destructive changes | Large unreviewed diff near submission | Pair-review blockers, rotate/rest where possible, freeze optional changes |

## Continuation after the event

Regardless of award, retain the same usable-product destination. Immediately
review what users and reviewers found, improve unclear practice steps and verify
retained progress and supported devices. Add complete simulated procedures after
the earlier one works. Explore community practice sessions through normal
authorization; no financial-provider partnership is a product prerequisite.
No promises of learning outcomes or launch dates are made here.
