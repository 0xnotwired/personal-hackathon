# Continue in GitHub Codespaces

1. Select branch **ai-1** on GitHub, then Code → Codespaces → Create codespace.
   Direct link: https://codespaces.new/0xnotwired/personal-hackathon?ref=ai-1
2. The checked-in dev container supplies Node 24 and runs `.devcontainer/setup.sh`:
   installs Chromium if missing, installs the exact npm lockfile and runs the
   type/domain/build/browser/format checks. It needs no app/provider secrets.
3. Run `npm run dev` in the terminal. Open forwarded port **3000**; keep the
   Codespaces port private. The app is a mobile practice simulator, not a live bank.
4. Ask the AI: “Leé AGENTS.md, su sección Codespaces, las skills relevantes y
   docs/IMPLEMENTATION_STATUS.md. Verificá el estado real y continuá donde quedamos,
   sin regenerar la app ni agregar proveedores reales.”

Stop any running app server before rerunning setup; the script requires port 3000 free for the production browser checks. It never stops another process.

If creation was interrupted or the checkout predates this container config, use
**Codespaces: Rebuild Container**, then rerun `bash .devcontainer/setup.sh` if
needed. An AI extension still needs the user's own account/access; the app itself
needs no Gemini, Qwen, OpenAI or financial API key.

Current source: mobile Personal-inspired blue/cyan UI, complete synthetic utility
bill flow, durable SQLite, drafts/favorites, optional voice, smaller-step help,
and attributed Ímpetu/Gambit/Wolf adaptations. The first implementation passed
21 domain/persistence tests and 23 Chromium tests. Do not inherit those counts
as proof after new changes: run `npm run verify`.

Next work is physical-phone speech/permissions/install, manual screen-reader/full
zoom, unassisted older-adult observations and deployment/rehearsal. Without devices
or participants, continue reproducible fixes and report the exact unrun gate;
do not manufacture evidence or add unrelated procedures.

Keep the same Codespace and `.data/practice.sqlite` to retain the local ledger.
Stopping a Codespace ends processes: restart `npm run dev`. Deleting the Codespace
can delete its local data; commit/push authorized source work before deleting it.
Do not clear another session's database or cookies to reset a demo.

The image is pinned to the Microsoft registry's inspected multi-architecture
manifest digest. Setup commands and checks were executed in the current managed
Node 24 environment. Creating/attaching a real GitHub Codespace has NOT been tested
from this session; do not claim that remote lifecycle already ran.

The registry manifest/digest was verified over HTTPS. A full local Docker image
pull in this managed environment was denied with `Forbidden` while downloading
layers; this does not establish whether GitHub Codespaces can pull it. No TLS,
checksum or network restriction was bypassed. The real Codespaces lifecycle remains
unverified; the checked-in setup script can still be run on the current Node 24
machine with its installed Chromium.
