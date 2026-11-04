#!/usr/bin/env bash
# Portfolio-track wrapper around ralph-commit.sh.
export RALPH_DIR=ops/ralph-portfolio RALPH_TRACK=portfolio
export RALPH_SCORE='node --experimental-strip-types --no-warnings scripts/portfolio-score.mjs --json'
exec "$(dirname "$0")/ralph-commit.sh" "$@"
