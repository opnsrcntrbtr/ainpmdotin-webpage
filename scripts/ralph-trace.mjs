// Append one Ralph-loop iteration trace and mirror it to PostHog.
// Usage: node scripts/ralph-trace.mjs ops/ralph/iter.json
// iter.json: { iteration, backlogId, goal, ripplixGap, topics[], changes[], evidence[], checks{}, commit }
// Score before/after are taken from $RALPH_DIR/score-before.json and a fresh run of $RALPH_SCORE.
// Defaults: RALPH_DIR=ops/ralph, RALPH_SCORE='node scripts/geo-score.mjs --json', RALPH_TRACK=visibility.
import { readFile, appendFile, writeFile, rm } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { POSTHOG } from './ralph-config.mjs';

const DIR = process.env.RALPH_DIR || 'ops/ralph';
const SCORE = process.env.RALPH_SCORE || 'node scripts/geo-score.mjs --json';
const TRACK = process.env.RALPH_TRACK || 'visibility';
const iter = JSON.parse(await readFile(process.argv[2], 'utf8'));
const before = JSON.parse(await readFile(DIR + '/score-before.json', 'utf8'));
const after = JSON.parse(execSync(SCORE).toString());
// source: where the iteration ran ('mac' scheduled task or 'cloud' session). Env wins over iter.json.
const source = process.env.RALPH_SOURCE || iter.source || 'mac';
const trace = {
  ts: new Date().toISOString(),
  track: TRACK,
  ...iter,
  source,
  scorerVersion: { before: before.scorerVersion ?? 1, after: after.scorerVersion ?? 1 },
  score: { before: before.total, after: after.total, delta: +(after.total - before.total).toFixed(1) },
  categories: { before: before.categories, after: after.categories },
  ...(after.topics ? { topics: Object.fromEntries(Object.entries(after.topics).map(([k, v]) => [k, { before: before.topics?.[k]?.score ?? 0, after: v.score }])) } : {}),
};
await appendFile(DIR + '/traces.jsonl', JSON.stringify(trace) + '\n');
await writeFile(DIR + '/score-before.json', JSON.stringify(after, null, 1));

// PostHog: send this event plus any queued ones. Events that cannot be sent (for example from a
// cloud session whose network policy blocks eu.i.posthog.com) are queued in the repo and flushed
// by the next run that can reach PostHog, so the dashboard never loses an iteration.
const QUEUE = 'ops/ralph/posthog-queue.jsonl';
const event = {
  api_key: POSTHOG.key,
  event: 'ralph_iteration',
  distinct_id: 'ralph-loop',
  timestamp: trace.ts,
  properties: {
    $process_person_profile: false,
    iteration: trace.iteration, backlog_id: trace.backlogId, goal: trace.goal,
    ripplix_gap: trace.ripplixGap, score_before: trace.score.before,
    score_after: trace.score.after, score_delta: trace.score.delta,
    scorer_version: trace.scorerVersion.after, rebaseline: !!trace.rebaseline, source,
    checks_passed: Object.values(trace.checks ?? {}).every(Boolean), commit: trace.commit ?? null,
  },
};
if (process.argv.includes('--no-posthog')) {
  await appendFile(QUEUE, JSON.stringify(event) + '\n');
  console.log('PostHog: skipped, queued for the next run');
} else {
  const queued = (await readFile(QUEUE, 'utf8').catch(() => '')).split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const batch = [...queued, event];
  const res = await fetch(POSTHOG.host + '/batch/', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ api_key: POSTHOG.key, batch: batch.map(({ api_key, ...e }) => e) }),
  }).catch((e) => ({ ok: false, status: e.message }));
  if (res.ok) {
    await rm(QUEUE, { force: true });
    console.log(`PostHog: sent ${batch.length} event(s)`);
  } else {
    await appendFile(QUEUE, JSON.stringify(event) + '\n');
    console.log(`PostHog: failed (${res.status}); queued ${batch.length} event(s) in ${QUEUE}`);
  }
}
console.log(`Trace #${trace.iteration}: ${trace.score.before} -> ${trace.score.after} (${trace.score.delta >= 0 ? '+' : ''}${trace.score.delta})`);
