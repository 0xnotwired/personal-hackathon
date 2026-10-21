# Development and demonstration runbook

Runtime: Node 24.x (24.19.0 tested), npm 11.9.0. One Next.js Node process and a
persistent writable local disk; no financial/provider/cloud credentials needed.
Work in this checkout; do not generate a replacement app or extra worktree.

## Install and run

From the repository root:

```bash
npm ci
npm run dev
```

For the tested production-server path:

```bash
npm run build
npm run start
```

The default port is 3000. `PORT=3001 npm run start` selects another port.
`npm run dev` binds 0.0.0.0 for the cloud machine; do not infer a public deployment
from an open port. Use the environment's supported preview capability if offered.

In this managed machine the default npm home cache is not writable. Retain the
session proxy and CA trust; use `npm_config_cache=/tmp/autonomia-npm npm ci`.
Do not disable TLS checks. The lockfile and exact direct versions are intentional.
No bank, Mercado Pago, Gmail, Gemini or Qwen setup belongs in this workflow.

## Checks

```bash
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run format:check
```

The e2e configuration uses `/usr/bin/chromium` when available. Set
`CHROMIUM_PATH=/path/to/chromium` for another installed Chromium. On a machine
without one, use the matching Playwright Chromium install and point
CHROMIUM_PATH at its executable. E2e starts the built server if needed; rebuild
after source edits, and never reuse a stale already-running production server.
Generated traces/screenshots are under ignored `test-results/` and reports under
ignored `playwright-report/`. Formatting is not a substitute for behavioral tests.

## Practice data and demo

| Service | Approved | Pending | Rejected |
| --- | --- | --- | --- |
| Luz | `100200300` | `100200301` | `100200302` |
| Gas | `200300300` | `200300301` | `200300302` |
| Agua | `300400300` | `300400301` | `300400302` |

Amounts, holder and period come from the server catalogue; no real bill can be
looked up. “Usar este número de ejemplo” fills the approved example. Expand
“Probar otros resultados” for the other authored scenarios. A pending example
settles to approved when consulted after 60 seconds unless cancellation already
committed. This deterministic teaching scenario is disclosed in the interface.
A completed simulated payment cannot be cancelled after approval; the UI says so
through the returned state and offers another practice, not a fictitious refund.

Show the blue/cyan mobile interface at 390×844. Begin, choose a service, fill an
example, ask “¿Qué hago?” → “Mostrarme el próximo paso”, review, reload, open
“Me están apurando para pagar”, inspect an authored example and quoted evidence,
close, then explicitly confirm. Save the practice receipt. No safety signal,
voice command, review entry or reload confirms a payment.

Use a fresh private browser context for a clean demo, not another person's saved
browser state. “Volver a practicar” creates a new draft. It does not erase prior
confirmed records. A new practice never means cancellation of a previous one.

## Persistence and restart

The default ledger is `.data/practice.sqlite` plus its SQLite WAL/SHM files.
`LEDGER_PATH=/absolute/persistent/path/practice.sqlite` selects an isolated ledger.
Keep that directory across server restarts. Use a local persistent volume, one
application deployment and Node runtime; ephemeral/serverless filesystems or a
shared network filesystem do not satisfy this setup. `node:sqlite` is built into
Node 24 and still has an experimental API status.

Do not reset by deleting another session's database. For an isolated demo, stop
the process you started and restart with a fresh, explicitly test-owned LEDGER_PATH
and a fresh private browser context. Existing ledgers remain preserved.

The browser stores synthetic draft, favorite and voice preferences in IndexedDB.
Payment status remains server-owned. Deleting cookies loses access to that
anonymous session; clearing IndexedDB loses its draft. Neither action cancels an
operation. A malformed draft is preserved until the user chooses a new practice.
An unavailable store is visibly disclosed. History returns up to 50 recent owned
operations. No message-help input or voice transcript is persisted.

## Deployment and mobile installation

Serve HTTPS, preserve the original Host and Origin at the trusted reverse proxy,
and use persistent local storage. Mutation requests reject cross-origin calls;
cookies are HttpOnly, SameSite Strict and Secure when the request uses HTTPS.
Do not strip or rewrite original request scheme/Host into an unrelated internal
origin. Browser speech and clipboard require a compatible secure context.

The mobile web application includes a standalone manifest, themed icons,
viewport safe-area support and fixed labeled bottom navigation. It can be offered
through the browser's home-screen installation UI on supporting devices. Physical
installation has NOT been tested. There is no app-store/native binary, service
worker, offline-payment mode or guaranteed offline speech. The complete touch and
keyboard journey works independently of speech, but result verification requires
the application server.

## Manual gates still open

Physical Android/iOS speech output/input, permission dialogs and installing to
the home screen; a real screen reader and full browser 200% zoom; low-literacy
unassisted first use/second-bill transfer; public deployment on persistent storage;
recorded 3–5-minute rehearsal on the presentation device. No passing unit/browser
count substitutes for any of these observations.
