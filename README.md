[English](README.md) · [Español](README_ES.md) · [Team product brief](docs/PRODUCTO_EQUIPO.md)

# Autonomía Digital

**Understand each step. Make your own decision.**

A mobile web practice companion for older adults with very low digital familiarity.
Personal-inspired blue/cyan UI, plain es-AR guidance, one step at a time and
optional user-controlled voice. **Practice only: no money moves.**

The implemented journey covers a synthetic light/gas/water bill: choose, enter
an example, review server-owned details, explicitly confirm, inspect the verified
simulation result and save a labeled receipt. It includes saved drafts, favorites,
back/reload recovery, owned history, pending/rejected examples and verified
cancellation of pending operations. Other procedures are visibly future work.
The interface keeps one active task card plus a single "Ayuda y opciones" entry,
and each procedure screen shows at most two visible actions outside the fixed flow
bar. Practice data can be deleted locally and from the server session; no
credential or card field exists.

Optional message help quotes pressure cues, keeps no-match inconclusive and
provides reply drafts without sending them. It incorporates attributed adaptations
from [Ímpetu](https://github.com/annatchijova/impetu),
[Gambit](https://github.com/annatchijova/gambit) and
[Wolf and Cronos](https://github.com/annatchijova/wolf-and-cronos).
See [source analysis and limits](docs/REUSE_ANALYSIS.md) and [NOTICE](NOTICE).
No external LLM, bank, payment provider or Google account is needed.

## Run

Node 24.x and npm. From the repository root:

```bash
npm ci
npm run dev
```

Production path: `npm run build`, then `npm run start`.
Checks: `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e`,
`npm run format:check`. [Runbook](docs/RUNBOOK.md) covers Chromium, managed-cloud
npm cache, sample bills, persistent SQLite storage and safe demo setup.

## Evidence and limits

[Implementation status](docs/IMPLEMENTATION_STATUS.md) records the exact executed
checks and open gates. Browser automation is not participant research or physical
speech validation. Real-device voice, screen reader/full manual zoom, home-screen
installation, unassisted target-user use and public deployment remain pending.
The manifest supports a standalone mobile-web experience; no native binary,
app-store release, offline payment or official Personal partnership is claimed.

## Continue the project

Read [AGENTS.md](AGENTS.md) and the [agent handoff](docs/AGENT_HANDOFF.md) before
changes. Delivery branch: **`final`** (commit `18a4bda`, pushed); `ai-1` is the
prior implementation branch. Devin AI is not required. Existing code is in
`app/`, checks in `tests/`, product/architecture/research in `docs/`, methodology
in `.commandcode/`. Do not replace the app with another scaffold.

- [Product and team overview in Spanish](docs/PRODUCTO_EQUIPO.md)
- [Mobile UI design](docs/DESIGN_SYSTEM.md) and [companion contract](docs/COMPANION_CONTRACT.md)
- [Architecture and repository links](docs/ARCHITECTURE.md), [module plan](docs/ACTION_PLAN.md)
- [Validation](docs/VALIDATION.md), [usability red team](docs/RED_TEAM_USABILITY.md), [claim ledger](docs/EVIDENCE_LEDGER.md)
- [Hackathon strategy](docs/HACKATHON_PLAYBOOK.md), [3/5-minute pitch](docs/DEMO_AND_PITCH.md), [book reference](docs/BOOK_REFERENCE.md)

Repository license: [Apache-2.0](LICENSE). Adapted source licenses and notices are
retained in `third_party/licenses/` and NOTICE; installed dependencies retain their
own licenses. The reference book is not distributed here.

[Continuar en GitHub Codespaces con la IA](docs/CODESPACES.md) · [Crear Codespace en final](https://codespaces.new/0xnotwired/personal-hackathon?ref=final)
