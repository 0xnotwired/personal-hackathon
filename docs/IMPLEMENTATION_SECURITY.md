# Simulator trust boundaries

Before implementation (2026-10-21): the browser, bill code, draft identifier,
review identifier, repeated requests and interrupted connections are untrusted.
The server owns synthetic bill amounts, review bindings and the operation ledger.
No client, voice command or restored draft can assert a verified payment result.

Use an anonymous, random HttpOnly SameSite cookie. Mutations require the request's
same-origin Origin header; the deployment proxy must preserve Host and Origin.
Parse JSON within 4 KiB and validate strict schemas. Review and commit bind the
session, draft, stable attempt key and immutable synthetic bill. A database unique
constraint permits one operation per session/draft, including across tabs.
Commit and cancellation are atomic transactions. A lost response is uncertainty:
look up the same draft; never create a replacement attempt automatically.

SQLite via Node 24's built-in `node:sqlite` replaces proposed better-sqlite3:
no native package compilation, one runtime, equivalent durable transactions.
Use a persistent local disk with one Node deployment. SQLite is experimental in
Node 24; do not deploy this ledger to ephemeral/serverless storage or shared NFS.
Database failures return an unavailable response, never simulated success.

Browser IndexedDB stores only synthetic practice drafts, favorites and speech
preferences. Failure is visible. Browser speech may send audio/text to its vendor;
there is no offline or local-processing promise. No audio/transcript storage.
No live financial adapters, login data or payment credentials are supported.

Remaining checks: session fixation/cross-session requests, conflicting replay,
parallel confirmation, persistence after reopen, cancellation timeout, untrusted
JSON, loss of commit response, storage denial and input carry-over. Test evidence
belongs in IMPLEMENTATION_STATUS.md, not in this pre-construction threat model.
