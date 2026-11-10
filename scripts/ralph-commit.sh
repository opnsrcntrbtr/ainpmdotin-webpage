#!/usr/bin/env bash
# Usage: scripts/ralph-commit.sh <iter.json> "<commit message>"
# Commits the change, records the trace with the commit hash, marks the backlog item done, commits the trace.
set -euo pipefail
ITER="$1"; MSG="$2"; DIR="${RALPH_DIR:-ops/ralph}"
AUTH=(-c user.name="Ian Pinto" -c user.email="7788571+opnsrcntrbtr@users.noreply.github.com")
# RALPH_SESSION_URL lets a cloud session credit its own session; the Mac task keeps the default.
SESSION_URL="${RALPH_SESSION_URL:-https://claude.ai/code/session_01EL9ZTjLUb8TziysyUb65st}"
TRAILER=$'\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: '"$SESSION_URL"
git add -A -- . ":!$DIR/traces.jsonl" ":!$DIR/score-before.json" ":!$DIR/iter.json"
git "${AUTH[@]}" commit -qm "$MSG$TRAILER"
SHA=$(git rev-parse --short HEAD)
python3 - "$ITER" "$SHA" "$DIR" <<'PY'
import json,sys
it=json.load(open(sys.argv[1])); it['commit']=sys.argv[2]; json.dump(it,open(sys.argv[1],'w'))
b=json.load(open(sys.argv[3]+'/backlog.json'))
for x in b:
    if x['id']==it['backlogId']: x['status']='done'; x['commit']=sys.argv[2]; x['doneOn']=__import__('datetime').date.today().isoformat()
open(sys.argv[3]+'/backlog.json','w').write(json.dumps(b,indent=2,ensure_ascii=False)+'\n')
PY
node scripts/ralph-trace.mjs "$ITER" ${RALPH_TRACE_FLAGS:-}
git add "$DIR"
git "${AUTH[@]}" commit -qm "ralph: trace iteration $(python3 -c "import json;print(json.load(open('$ITER'))['iteration'])") ($SHA)$TRAILER"
git log --oneline -2
