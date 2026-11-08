#!/usr/bin/env bash
# Runs every visual check on the preview: tests/visual.sh [folder for the screenshots]
set -u
cd "$(dirname "$0")/.."
out="${1:-${MEMORIA_SHOTS:-/tmp/memoria-shots}}"
mkdir -p "$out"
fail=0
for t in tests/*_check.py; do
  echo "== $t"
  python3 "$t" "$out" || fail=1
done
exit $fail
