#!/usr/bin/env bash
# Runs every visual check on the preview: tests/visual.sh [folder for the screenshots]
# The preview is served over http on a free port (MEMORIA_PREVIEW_URL): opened as a file (file://), the newer Chromium
# does not always keep what the page saved (localStorage) across a reload, and the "kept on this device" checks fail.
set -u
cd "$(dirname "$0")/.."
out="${1:-${MEMORIA_SHOTS:-/tmp/memoria-shots}}"
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
fail=0
for t in tests/*_check.py; do
  echo "== $t"
  python3 "$t" "$out" || fail=1
done
exit $fail
