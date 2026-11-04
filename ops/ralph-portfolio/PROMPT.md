# Ralph loop, portfolio track: proof of skill on ainpm.in

One iteration = the single highest-priority open item in `ops/ralph-portfolio/backlog.json`,
proved by checks, traced, published. The next iteration starts fresh from this file, the backlog
and the last lines of `traces.jsonl`.

## Goal

Make Ian Pinto's portfolio on ainpm.in easy for an employer or client to **verify**.
The rubric follows Accredible's State of Credentialing research:

| Accredible finding | What the portfolio does |
| --- | --- |
| 84% of HR leaders have suspected or found exaggerated qualifications; 53% verify claims frequently (2025) | Every credential links to its issuer's verification page; self-uploaded records are labelled as such |
| Employers value relevant experience (76%), applied skills in real-world context (58%), test results (51%), recent skill use (47%) (2025) | Each project shows live code or demo, dated test results and last activity |
| 79% of learners say issuers could communicate credential value better; 44% want clearer skill descriptions (2026) | Each credential and project names the skills it proves, in employer language mapped to O*NET/NACE |
| Only 13% of issuers know learner outcomes (2026) | Ian states outcomes himself: what each credential or project led to, with evidence |

## Rules

- Never invent a credential, date, metric, star count, download count or outcome. Every value comes
  from a page you opened this iteration (issuer page, GitHub, npm, Hugging Face) and carries an "as of" date.
- Self-uploaded Accredible records (`USER-UPLOADED`) are labelled "self-uploaded record", never "verified".
- Unmerged pull requests are not listed as contributions.
- Day-job work stays out unless Ian supplies an approved, anonymised write-up.

## One iteration

1. Pick the open item with the highest `priority`.
2. `npm run build && node --experimental-strip-types --no-warnings scripts/portfolio-score.mjs --json > ops/ralph-portfolio/score-before.json` (skip if the last trace's after is current).
3. Make the smallest complete change. Data lives in `src/data/` (skills.ts, projects.ts, metrics.ts, contributions.ts); pages read from it.
4. Back-pressure, all must pass: `npm run build`, `npm run check`, portfolio score and `node scripts/geo-score.mjs` must not drop,
   `python3 scripts/overflow-check.py <changed paths>` at 390px.
5. Write `ops/ralph-portfolio/iter.json`, then `scripts/ralph-portfolio.sh ops/ralph-portfolio/iter.json "<message>"`.
6. Publish through the Mac bundle route (see the Claude project notes). On failure: revert, mark `blocked`, trace.
