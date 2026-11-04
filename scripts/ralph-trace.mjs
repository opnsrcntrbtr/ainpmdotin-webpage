// Append one Ralph-loop iteration trace and mirror it to PostHog.
// Usage: node scripts/ralph-trace.mjs ops/ralph/iter.json
// iter.json: { iteration, backlogId, goal, ripplixGap, topics[], changes[], evidence[], checks{}, commit }
// Score before/after are taken from ops/ralph/score-before.json and a fresh geo-score run.
import { readFile, appendFile, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { POSTHOG } from './ralph-config.mjs';

const iter = JSON.parse(await readFile(process.argv[2], 'utf8'));
const before = JSON.parse(await readFile('ops/ralph/score-before.json', 'utf8'));
const after = JSON.parse(execSync('node scripts/geo-score.mjs --json').toString());
const trace = {
  ts: new Date().toISOString(),
  ...iter,
  score: { before: before.total, after: after.total, delta: +(after.total - before.total).toFixed(1) },
  categories: { before: before.categories, after: after.categories },
  topics: Object.fromEntries(Object.entries(after.topics).map(([k, v]) => [k, { before: before.topics[k]?.score ?? 0, after: v.score }])),
};
await appendFile('ops/ralph/traces.jsonl', JSON.stringify(trace) + '\n');
await writeFile('ops/ralph/score-before.json', JSON.stringify(after, null, 1));

if (!process.argv.includes('--no-posthog')) {
  const res = await fetch(POSTHOG.host + '/i/v0/e/', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      api_key: POSTHOG.key,
      event: 'ralph_iteration',
      distinct_id: 'ralph-loop',
      properties: {
        $process_person_profile: false,
        iteration: trace.iteration, backlog_id: trace.backlogId, goal: trace.goal,
        ripplix_gap: trace.ripplixGap, score_before: trace.score.before,
        score_after: trace.score.after, score_delta: trace.score.delta,
        checks_passed: Object.values(trace.checks ?? {}).every(Boolean), commit: trace.commit ?? null,
      },
    }),
  }).catch((e) => ({ ok: false, status: e.message }));
  console.log('PostHog:', res.ok ? 'sent' : 'failed ' + res.status);
}
console.log(`Trace #${trace.iteration}: ${trace.score.before} -> ${trace.score.after} (${trace.score.delta >= 0 ? '+' : ''}${trace.score.delta})`);
