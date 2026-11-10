// Portfolio proof score for the portfolio Ralph track.
// Rubric follows Accredible's State of Credentialing research (2025, 2026):
// employers value relevant experience (76%), applied skills in a real-world
// context (58%), test or assessment results (51%), recent skill use (47%) and
// verification (53% verify frequently; 84% have suspected exaggeration).
// Usage: node --experimental-strip-types scripts/portfolio-score.mjs [--json]
import { SKILLS, CREDENTIALS } from '../src/data/skills.ts';
import { PROJECTS } from '../src/data/projects.ts';
import { SCORECARDS } from '../src/data/metrics.ts';

let CONTRIBUTIONS = [];
let ARTIFACTS = {};
try { ({ ARTIFACTS } = await import('../src/data/artifacts.ts')); } catch { /* not yet created */ }
import { readdirSync, readFileSync } from 'node:fs';
try { ({ CONTRIBUTIONS } = await import('../src/data/contributions.ts')); } catch { /* not yet created */ }

const today = new Date();
const days = (d) => (today - new Date(d)) / 864e5;
const cap = (x) => Math.max(0, Math.min(1, x));
const r = {};

// 1. Verified credentials (20): issuer-verified link = 1, self-uploaded record = 0.4, none = 0; dated = bonus.
r.verifiedCredentials = 20 * cap(CREDENTIALS.reduce((a, c) => a + (c.verifyUrl ? (c.verification === 'self-uploaded' ? 0.4 : 0.85) : 0) + (c.issued ? 0.15 : 0), 0) / CREDENTIALS.length);

// 2. Skills to evidence (20): each skill needs >= 4 evidence links of >= 3 kinds incl. one applied kind.
const applied = new Set(['Live demo', 'Open code', 'Package', 'Case study', 'Contribution']);
r.skillsEvidence = 20 * SKILLS.reduce((a, s) => {
  const kinds = new Set(s.evidence.map((e) => e.kind));
  return a + (cap(s.evidence.length / 4) * 0.4 + cap(kinds.size / 3) * 0.4 + ([...kinds].some((k) => applied.has(k)) ? 0.2 : 0));
}, 0) / SKILLS.length;

// 3. Applied, real-world projects (20): target 6 projects, each with code/demo links and a skills mapping.
const projOk = PROJECTS.filter((p) => p.links.length >= 2);
r.appliedProjects = 20 * (0.6 * cap(projOk.length / 6) + 0.4 * cap(PROJECTS.filter((p) => p.skills?.length).length / Math.max(PROJECTS.length, 1)));

// 4. Test and assessment results (15): projects with a dated, sourced scorecard.
r.testResults = 15 * cap(PROJECTS.filter((p) => SCORECARDS[p.slug]?.asOf && SCORECARDS[p.slug]?.source).length / Math.max(PROJECTS.length, 1));

// 5. Recent skill use (10): projects active in the last 180 days.
r.recency = 10 * cap(PROJECTS.filter((p) => p.lastActivity && days(p.lastActivity) <= 180).length / Math.max(PROJECTS.length, 1));

// 6. Contributions to others' projects (10): merged PRs with links, target 2+, plus published packages.
const merged = CONTRIBUTIONS.filter((c) => c.kind === 'merged-pr');
const pkgs = CONTRIBUTIONS.filter((c) => c.kind === 'package');
r.contributions = 10 * (0.6 * cap(merged.length / 2) + 0.4 * cap(pkgs.length / 4));

// 7. Clear skill descriptions (5): employer-language claim + framework mapping + headline proof.
r.skillClarity = 5 * SKILLS.filter((s) => s.claim && s.proof && s.onet?.length && s.nace).length / SKILLS.length;

// --- Rubric v2 (8 Nov 2026): product artifacts, framework mapping, builder's notes ---
// 8. PM artifacts (15): each project has a brief, eval spec, metrics tree, decision log and launch notes, each with a source.
const parts = ['brief', 'evalSpec', 'metricsTree', 'decisions', 'launch'];
r.pmArtifacts = 15 * PROJECTS.reduce((a, p) => { const x = ARTIFACTS[p.slug]; return a + (x ? parts.filter((k) => x[k] && (k !== 'decisions' || x[k].length >= 3)).length / parts.length : 0); }, 0) / Math.max(PROJECTS.length, 1);
// 9. Framework mapping (10): each skill mapped to ESCO and SFIA (code + level) with a level justification.
r.frameworkMapping = 10 * SKILLS.filter((s) => s.esco?.length && s.sfia?.length && s.sfia.every((x) => x.level && x.why)).length / SKILLS.length;
// 10. Builder's notes (5): articles tagged "Builder's notes" that link to public evidence; target 3.
const notes = readdirSync('src/content/articles').filter((f) => f.endsWith('.md')).map((f) => readFileSync('src/content/articles/' + f, 'utf8')).filter((t) => /tags:.*Builder's notes/.test(t) && /https:\/\/(github\.com|huggingface\.co)/.test(t));
r.builderNotes = 5 * cap(notes.length / 3);

for (const k in r) r[k] = +r[k].toFixed(1);
// v2 raw maximum is 130; report on a 0-100 scale.
const total = +(Object.values(r).reduce((a, b) => a + b, 0) * 100 / 130).toFixed(1);
const out = { total, rubric: 'v2', categories: r, counts: { credentials: CREDENTIALS.length, verified: CREDENTIALS.filter((c) => c.verifyUrl).length, projects: PROJECTS.length, skills: SKILLS.length, mergedPRs: merged.length, packages: pkgs.length } };
if (process.argv.includes('--json')) console.log(JSON.stringify(out));
else { console.log(`Portfolio proof score: ${total}/100`); for (const [k, v] of Object.entries(r)) console.log(`  ${k}: ${v}`); console.log('  counts:', JSON.stringify(out.counts)); }
