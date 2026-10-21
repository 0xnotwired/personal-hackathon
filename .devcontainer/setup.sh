#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
node -e 'if (Number(process.versions.node.split(".")[0]) !== 24) { console.error("Node 24.x is required. Rebuild the configured dev container."); process.exit(1); }'
# Use a writable package cache, preserving existing proxy and TLS trust settings.
if curl --silent --output /dev/null --max-time 2 http://127.0.0.1:3000; then
  printf 'Port 3000 is in use. Stop your app server before running setup. No process was stopped.\n' >&2
  exit 1
fi
export npm_config_cache="${TMPDIR:-/tmp}/autonomia-npm"
if ! command -v chromium >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y --no-install-recommends chromium
fi
export CHROMIUM_PATH="$(command -v chromium)"
npm ci
CI=1 npm run verify
printf '\nSetup complete. Run npm run dev and open the forwarded port 3000. Read AGENTS.md before editing.\n'
