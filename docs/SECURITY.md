# Security and safety posture — Autonomía Digital

Status: implemented controls, threat model and residual risks observed on 2026-10-21
in `final` at commit `18a4bda` (pushed to `origin/final`). A later documentation
sync may be uncommitted in the working tree.
This is a practice simulator: it cannot move money and never asks for financial
credentials. Root product rules remain in [AGENTS.md](../AGENTS.md); evidence
scope remains in [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) and
[EVIDENCE_LEDGER.md](EVIDENCE_LEDGER.md).

## Threat model for the intended person

The valuable asset is not a bank account. It is the person's decision, trust and
privacy while practising. The realistic adversary is social, not a remote
privileged attacker.

- **Attacker can:** send scam messages, call and pressure the person, watch the
  screen, share or take over the device, send a link that imitates the app, or
  “help” with good or bad intent.
- **Attacker cannot:** reach real money through this app, obtain bank credentials
  from it, or authenticate as a privileged account because no accounts exist.
- **Out of scope:** real payments, bank login, OTP, card data, provider
  settlement, account recovery and staffed support.

## Trust boundaries and authorization

| Actor | Resource | Action | Expected |
| --- | --- | --- | --- |
| Anonymous browser with its cookie | Its own draft and operations | Read list, review, commit, cancel pending, clear | Allowed |
| Another browser/session | Operation by id | Read | 404; never another owner's row |
| No session | Commit a review | POST | 401 |
| Foreign origin | Any mutation | POST | 400 |
| Any actor | Bank credentials, card, OTP | Any | Not implemented; no such fields exist |

Routes: `GET /`, `/manifest.webmanifest`, icons, `GET /api/operations`,
`POST /api/reviews`, `POST /api/operations`, `GET /api/operations/[id]`,
`POST /api/operations/[id]/cancel`, `POST /api/session`.

Inputs: nine-digit synthetic bill code, UUID identifiers, JSON bodies bounded to
4 KiB, and optional message text bounded to 2000 characters and analysed only in
the browser. There are no uploads, accounts, webhooks, external integrations or
LLM calls.

## Implemented controls

- **Simulation only:** no payment SDK, financial credential, bank login or
  outbound payment call. Practice labels are visible in the banner, review,
  results and downloaded receipt.
- **One commit boundary:** the ledger is the authority; commit is idempotent,
  session-scoped and uses parameterized SQLite statements. Route entry, restore
  and voice cannot commit.
- **Session:** anonymous `HttpOnly`, `SameSite=strict` cookie, seven-day expiry,
  `Secure` when `x-forwarded-proto` or the request is HTTPS. `POST /api/session`
  deletes the session's rows and expires the cookie.
- **Same-origin mutations:** the Origin host must match the request Host;
  http/https are both accepted so TLS termination works. Foreign origins still
  return 400.
- **Bounds:** 4 KiB mutation body, 50 listed operations, 100 reviews and 50
  operations per session, seven-day retention, and 30 mutations per minute per
  session or client key.
- **Browser hardening (production):** CSP with `frame-ancestors 'none'`,
  `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`,
  `connect-src 'self'`; HSTS; Cross-Origin-Resource-Policy; `nosniff`;
  `Referrer-Policy: same-origin`; `X-Frame-Options: DENY`;
  `Permissions-Policy: microphone=(self)`.
- **Privacy:** message text is not transmitted, persisted or logged; attachments
  and credentials are never requested. `Borrar mis datos de práctica` clears the
  local draft, favourites, preferences, cached history and the server session.
- **Voice:** results and help use approved copy and server status; recognition
  never commits; capture stops on step change, hidden page and pagehide.
- **Dependencies:** exact lockfile; `npm audit --omit=dev --audit-level=high`
  reported zero vulnerabilities on this run.

## Assume-breach model

- **Position: holder of an anonymous session cookie** (shared device or script
  running in the origin). Reaches that session's synthetic practice rows only:
  can read, cancel pending, or delete them. Cannot reach another session's rows,
  real money or credentials. Choke point: every query is scoped by `session`.
- **Position: compromised dependency in the origin.** Reaches IndexedDB drafts
  and, after a user gesture, the microphone or clipboard. CSP restricts external
  script origins but permits inline scripts for Next.js; supply-chain risk is
  residual, not eliminated.
- **Position: unauthenticated public visitor.** Can create sessions and rows
  within rate and retention bounds; rotating cookies or IPs can still consume
  capacity. Deployment needs edge rate limiting and disk monitoring.

## Resource review

| Path | Untrusted number | Bound |
| --- | --- | --- |
| Mutation body | bytes | 4096 |
| Message help | characters | 2000, client only |
| Operation list | rows | 50 |
| Reviews per session | rows | 100 |
| Operations per session | rows | 50 |
| Stored operations/reviews | age | 7 days |
| Mutations | per minute | 30 per session or client key |

Not reviewed: multi-instance rate limiting (the limiter is in-process), proxy
DDoS capacity, database disk quota, and backup/restore.

## Residual risks and unverified checks

- **No public deployment:** HTTPS, HSTS behaviour, secure cookies behind the real
  proxy, restart durability and origin handling on that host are NOT RUN.
- **CSP uses `'unsafe-inline'`** for Next.js compatibility; it is not a nonce-based
  strict policy.
- **Rate limiting is per process** and can be bypassed by rotating sessions or
  spoofable forwarded addresses; edge limits are still required.
- **No external penetration test.** The technical checks above are not a security
  certification.
- **Human comprehension is NOT RUN:** whether the security copy is understood by
  the intended low-literacy audience remains unverified, as do physical device,
  screen-reader and full-zoom checks.

## Deliberate exclusions

No login, bank credentials, OTP, card data, real payments, LLM message
interpretation, fraud probability, automatic reply sending, automatic payment or
background listening. A future request to add any of these is a new product and
security decision, not an extension of this simulator.
