#!/usr/bin/env bash
# The visual checks on the preview (Python + Playwright): tests/e2e/run.sh            all of them
#                                                         tests/e2e/run.sh arquivar mais   only these (tests/<name>_check.py)
# The screenshots go to $MEMORIA_SHOTS (default /tmp/memoria-shots). The preview is served over http on a free port
# (MEMORIA_PREVIEW_URL): opened as a file (file://), the newer Chromium does not always keep what the page saved
# (localStorage) across a reload, and the "kept on this device" checks fail. Build the preview first (npm run build).
set -u
cd "$(dirname "$0")/../.."
out="${MEMORIA_SHOTS:-/tmp/memoria-shots}"
mkdir -p "$out"
port=$(python3 -c 'import socket; s = socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1])')
python3 -m http.server "$port" --bind 127.0.0.1 --directory "$PWD/preview" >/dev/null 2>&1 &
srv=$!
trap 'kill $srv 2>/dev/null' EXIT
for _ in $(seq 50); do
  python3 -c "import socket; socket.create_connection(('127.0.0.1', $port), 0.2).close()" 2>/dev/null && break
  sleep 0.1
done
export MEMORIA_PREVIEW_URL="http://127.0.0.1:$port/memoria-preview.html"
if [ $# -gt 0 ]; then checks=(); for n in "$@"; do checks+=("tests/${n%_check}_check.py"); done; else checks=(tests/*_check.py); fi
fail=0
for t in "${checks[@]}"; do
  echo "== $t"
  python3 "$t" "$out" || fail=1
done
exit $fail
