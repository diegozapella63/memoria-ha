#!/usr/bin/env bash
# The server tests (node:test, nothing to install): tests/run.sh
# With the coverage of the server (lines, branches and functions of memoria/rootfs/app): tests/run.sh --cobertura
set -u
cd "$(dirname "$0")/.."
export TZ=America/Sao_Paulo
if [ "${1:-}" = "--cobertura" ]; then
  exec node --test --experimental-test-coverage --test-coverage-exclude='tests/**' 'tests/*.test.mjs'
fi
exec node --test 'tests/*.test.mjs'
