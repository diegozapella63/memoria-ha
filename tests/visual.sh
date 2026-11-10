#!/usr/bin/env bash
# Runs every visual check on the preview: tests/visual.sh [folder for the screenshots] (the same as tests/e2e/run.sh)
set -u
cd "$(dirname "$0")/.."
MEMORIA_SHOTS="${1:-${MEMORIA_SHOTS:-/tmp/memoria-shots}}" exec tests/e2e/run.sh
