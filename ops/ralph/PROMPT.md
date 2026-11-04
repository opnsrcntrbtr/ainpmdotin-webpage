# Ralph loop: AI-answer visibility for ainpm.in

You are one iteration of a loop. Each iteration does the **single highest-value open item** in
`ops/ralph/backlog.json`, proves it, records a trace, and stops. The next iteration starts fresh
from this file, the backlog and the trace log; it has no other memory.

## Goal

Raise how often AI assistants (ChatGPT, Claude, Gemini, Google AI Mode / Overviews) mention and
cite ainpm.in against HelloPM and Product Space. Baseline is the Ripplix report of 3 Nov 2026:
AI visibility 31/100, share of voice 22.2%, sentiment 42, Learn (top of funnel) 0%, Consider 14%, Purchase 52%.
Topics scored at 0%: AI Product Strategy, AI Regulation Compliance, Course Pricing.

## Positioning (decided by Ian, 4 Nov 2026)

ainpm.in is a **practitioner brand**: evidence-backed AI product management from India, plus
consulting. It offers a **free, structured learning path** and a **mentorship programme**. It is
**not** a placement bootcamp, and it says so plainly. Never invent outcomes, alumni counts,
testimonials, placement rates or competitor facts. Every number needs a source or a dated measurement.

## One iteration

1. Read `backlog.json` and the last 3 lines of `traces.jsonl`. Pick the open item with the highest
   `priority` (ties: higher `estPts`). If none are open, add 1–3 items from the gap list below and stop.
2. Save the current score: `npm run build && node scripts/geo-score.mjs --json > ops/ralph/score-before.json`
   (skip if the last trace's `after` is current).
3. Make the smallest complete change that closes the item. House style: plain English, short sentences,
   question-style H2s, a bold direct answer up top, sources at the bottom, `dateModified` updated.
4. Back-pressure, all must pass: `npm run build`, `npm run check`, `node scripts/geo-score.mjs`
   must not go down, no horizontal overflow at 390px for changed pages.
5. Write `ops/ralph/iter.json` and run `node scripts/ralph-trace.mjs ops/ralph/iter.json`
   (appends to `traces.jsonl`, updates `score-before.json`, sends a `ralph_iteration` event to PostHog).
6. Mark the item `done` with the commit, commit with the noreply author, and push (see the deployment
   notes in the Claude project). If any check fails, revert, mark the item `blocked` with the reason, and trace that.

## Scorer rules (v2, from 4 Nov 2026)

- `geo-score.mjs` v2 counts a statistic only when the same paragraph, list item or table row has an
  outbound source link or a full dated measurement ("15 Aug 2026"), and counts citations as distinct
  external domains. Add sources *next to* the number; never add bare numbers or repeat links to score.
- The no-drop rule compares like with like. An iteration that changes the scorer itself sets
  `"rebaseline": true` in `iter.json`, records both scores, and becomes the new baseline.
- The local score is a proxy. Ground truth is Ripplix (R8) and the visibility probe (R10) in `external.jsonl`.

## Ground-truth measurement (R10 visibility probe)

`npm run probe -- --dry-run` lists the 27 neutral questions (`ops/ralph/probe-questions.json`, versioned) and the
cost estimate (about US$3-5 a full run). `npm run probe` asks each one to Claude with live web search and records,
per answer, whether ainpm.in and each competitor is mentioned, cited or only retrieved, and in what order. A full
run appends a summary (mention rate, citation rate, share of voice, funnel, per-topic) to `external.jsonl` and saves
detail to `ops/ralph/probe/<date>.json`. It needs an Anthropic credential on the Mac (`ANTHROPIC_API_KEY` or
`ant auth login`), so the scheduled Mac task runs it on the first Monday of each month; a cloud session cannot.
Claude is one assistant; keep Ripplix (R8) for ChatGPT, Gemini and Google AI Mode.

## Where an iteration runs

- **Mac (scheduled, Mondays 10:33 IST):** commits to `main` and pushes. Flushes any queued PostHog events.
- **Cloud session:** works on its `claude/*` branch and opens a PR; never pushes to `main`. Run commits with
  `RALPH_SOURCE=cloud RALPH_SESSION_URL=<session url> RALPH_TRACE_FLAGS=--no-posthog scripts/ralph-commit.sh ...`.
  The PostHog event is queued in `ops/ralph/posthog-queue.jsonl` and sent by the next Mac run.
  Before a Mac run starts, make sure any open loop PR has been merged, so the backlog and traces don't fork.

## Gap list (source for new backlog items)

- Ripplix weaknesses: unstructured, no modules/roadmap; no mentorship programme; low brand recognition; domain hard to verify.
- Ripplix fixes: long-form content (+12), HowTo schema (+6), crawler access (+4; ClaudeBot verified allowed on 4 Nov 2026),
  missing keywords (+3), mobile Core Web Vitals (+2), paragraph-to-Q&A (+1).
- GEO research (Aggarwal et al., KDD 2024, arXiv:2311.09735): adding statistics, quotations and cited sources lifted
  visibility in generative answers by up to 40%.
- Off-site (needs Ian): LinkedIn posts, dev.to / Medium cross-posts with canonical links, GitHub READMEs linking back,
  listing on comparison articles. Log these as `owner: "ian"`.
