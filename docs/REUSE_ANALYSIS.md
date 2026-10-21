# Reuse analysis — Ímpetu, Gambit, Wolf and Cronos

Inspected 2026-10-21. User requested copying, analyzing and incorporating useful
parts. Read-only source clones are outside the product checkout under
`/workspace/reference-repos/`. They are not runtime services or nested submodules.
The product vendors only the useful adaptations and license notices.

## Sources and scope of observation

| Source | Pinned commit | Inspected behavior | Incorporated |
| --- | --- | --- | --- |
| [Ímpetu](https://github.com/annatchijova/impetu) | `2e90c8f4ccd96f056a7d054e16545d61177e3bf6` | `agent/prompts.py`, `outcome.py`, red-team tests and manifest: calm next move, draft-first action, unknown outcome | `app/lib/companion.ts`, smaller-step help, companion contract; recovery reinforces the same unknown-outcome principle |
| [Gambit](https://github.com/annatchijova/gambit) | `265ff9d7bd172d242e25afc623ce564807af3e65` | `lexical.ts`, `scope.ts`, `cialdini.ts`, `think_schema.ts`, think agent: quote evidence, limited language scope, draft-only choices and consequences | Adapted `verbatim.ts`, authored reply choices and displayed consequences; no-match is inconclusive |
| [Wolf and Cronos](https://github.com/annatchijova/wolf-and-cronos) | `74ed33977d015b9024277b164857642d906a2919` | CORVUS verdict engine and influence rules: corroboration gate and separation of analysis from narration | Narrow TypeScript gate over distinct es-AR cue families, independent of payment authority |

All three sources declare Apache-2.0. Full source license texts are retained in
`third_party/licenses/`; NOTICE names copyright holders, exact files, commits and
modifications. Adapted files carry prominent provenance/change comments. No
upstream NOTICE file was found in inspected trees. The imported projects' brands,
deployment screenshots and asserted benchmarks do not become our evidence.

## What copying means here

The concrete source adaptation is Gambit's `verbatim` matcher, isolated from its
Fraction/scoring dependencies. During a direct run against the pinned original,
`verbatim('Pasame tu código', /código/)` returned `código`; supplying `/código/i`
threw `Invalid flags supplied to RegExp constructor 'ii'`. Our adapted function
removes an existing `i` before adding it and is exercised by case-insensitive
Spanish rules. This is an observed helper compatibility issue, not a claim of an
exploitable vulnerability in Gambit's own callers (which author unflagged regexes).

Ímpetu's communication rules and CORVUS's distinct-signal gate are adapted into
our own bounded TypeScript modules. We do not claim to run the full upstream
agent or all six CORVUS detectors. Our authored cue families are not independent
psychological measurements, and no confidence percentage is shown.

## Deliberate exclusions

- Ímpetu's Google ADK, Gemini, Gmail, Calendar, Firestore, Scheduler, proactive
  nudges and energy history are unnecessary for our synthetic-bill product.
- Gambit's English-only fleet cannot silently label Spanish input CLEAN.
  Its negotiation postures are simplified to two optional, unranked reply drafts.
- CORVUS's scoring/profiling, CRONOS hashes, Qwen narrator and Python services are
  not copied wholesale. A hash would prove neither a message's truth nor our
  classifier's accuracy. We make no forensic or fraud-detection certification.
- No source prompt, README instruction or upstream AGENTS.md overrides our own
  scope or authorizes tools, communications, deployment or payment.

## Resulting product behavior

At home or before confirming a bill, the person may open message help. It runs
locally, accepts at most 2000 characters, quotes evidence and names limitations.
Two distinct cue families support stronger caution; repeats of the same urgency
do not. A credential request alone still yields “No compartas claves ni códigos”.
No match remains unverified, including foreign language and ordinary deadlines.
A real deadline, an authoritative role or an urgent request is not proof of fraud.

Replies are authored examples, editable/copyable, never sent. Input is cleared
when the dialog closes and is not transmitted or stored. Speech reads the
approved summary only; browser speech vendor processing remains disclosed.
The person can pause the current draft; confirmed payments keep their separate
server lifecycle. Safety help cannot import or invoke a payment commit.

## Evidence and hackathon contribution

Source-reading claims above are CODE FACT, not upstream runtime validation.
We executed only the isolated original Gambit matcher, not the upstream cloud
apps, original Python suites or deployments. Our adapted domain and Chromium
checks are recorded in IMPLEMENTATION_STATUS.md. Seven safety-domain cases
cover pinned examples, simple false-positive counterexamples, repeated-family
counting, prompt-like input, credential boundaries and input limits. This is
regression coverage, not a real-message accuracy benchmark.

The useful demonstration is visible: resume a bill after reload, ask for a
smaller step, inspect pressure evidence and choose whether to continue. It adds
understanding and agency to the teammate's simple home. It does not establish
that we will win or that target users can already complete it independently.
