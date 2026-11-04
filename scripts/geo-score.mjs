// Local GEO (AI-answer visibility) proxy score for the Ralph loop.
// It cannot measure what AI assistants actually say (Ripplix does that);
// it measures the on-site levers that research and the Ripplix report tie to citation:
// topic coverage, answer structure, evidence density, schema, freshness, crawlability.
// Usage: node scripts/geo-score.mjs [--json]
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';
const pages = [];
async function walk(dir) {
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    if ((await stat(p)).isDirectory()) await walk(p);
    else if (name === 'index.html') pages.push(p);
  }
}
await walk(DIST);

const strip = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim();
const docs = [];
for (const f of pages) {
  const url = '/' + f.slice(DIST.length + 1).replace(/index\.html$/, '');
  if (url.startsWith('/kite/')) continue;
  const html = await readFile(f, 'utf8');
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? html;
  const text = strip(main);
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join(' ');
  const h2 = [...main.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => strip(m[1]));
  docs.push({
    url, html, main, text, ld, h2,
    title: strip(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''),
    words: text.split(' ').length,
  });
}

// Ripplix tracked topics (report 3 Nov 2026) -> query vocabulary.
const TOPICS = {
  'AI PM Courses': /\b(course|curriculum|learning path|syllabus|module)s?\b/i,
  'AI Product Strategy': /\bAI product strategy\b/i,
  'AI Regulation Compliance': /\b(DPDP|SEBI|RBI)\b.*\b(compliance|regulation)\b|\bcompliance-by-design\b/i,
  'Course Pricing': /\b(free|₹|INR|price|pricing|fee)s?\b.*\b(course|learning path|programme|program)\b|\b(course|learning path)\b.*\b(free|price|fee)\b/i,
  'Learning Resources': /\b(learning resources?|reading list|templates?|field guide)\b/i,
  'PM Career Switch': /\b(career switch|move into|transition into|switch(ing)? (in)?to)\b.*\b(AI )?(PM|product)/i,
  'PM Mentorship': /\bmentor(ship|ing)\b/i,
};

const has = (re, s) => re.test(s);
const result = { topics: {}, categories: {}, pages: {} };

// 1. Topic coverage (30): a topic counts fully when a page targets it in title/H1/H2
// and the text covers it; half when only mentioned in body text.
let topicPts = 0;
for (const [t, re] of Object.entries(TOPICS)) {
  const head = docs.filter((d) => has(re, d.title + ' ' + d.h2.join(' ') + ' ' + (d.main.match(/<h1[\s\S]*?<\/h1>/)?.[0] ?? '')));
  const body = docs.filter((d) => has(re, d.text));
  const s = head.length ? 1 : body.length ? 0.5 : 0;
  result.topics[t] = { score: s, headPages: head.map((d) => d.url).slice(0, 5) };
  topicPts += s;
}
result.categories.topicCoverage = +(30 * topicPts / Object.keys(TOPICS).length).toFixed(1);

// Per-page signals on content pages (exclude utility pages).
const content = docs.filter((d) => !['/privacy/', '/404/', '/articles/', '/glossary/'].includes(d.url) && d.words > 150);
const avg = (fn) => content.reduce((a, d) => a + fn(d), 0) / content.length;

// 2. Answer structure (20): question-style H2s, FAQ schema, lists/tables, a direct answer paragraph.
result.categories.answerStructure = +(20 * avg((d) => {
  const q = d.h2.length ? d.h2.filter((h) => /\?$/.test(h)).length / d.h2.length : 0;
  const faq = /"FAQPage"/.test(d.ld) ? 1 : 0;
  const lists = /<(ul|ol|table)[\s>]/.test(d.main) ? 1 : 0;
  const answer = /class="(answer|lede)"/.test(d.main) || /class="tldr/.test(d.main) ? 1 : 0;
  return 0.35 * Math.min(1, q / 0.5) + 0.25 * faq + 0.2 * lists + 0.2 * answer;
})).toFixed(1);

// 3. Evidence density (20): statistics and outbound citations (GEO, Aggarwal et al. KDD 2024).
result.categories.evidence = +(20 * avg((d) => {
  const stats = (d.text.match(/\b\d[\d,.]*\s?(%|per cent|₹|rupees|crore|lakh|weeks?|hours?|minutes?|days?)|₹\s?\d/g) ?? []).length;
  const cites = new Set([...d.main.matchAll(/href="(https?:\/\/(?!ainpm\.in)[^"]+)"/g)].map((m) => m[1])).size;
  return 0.5 * Math.min(1, stats / 6) + 0.5 * Math.min(1, cites / 4);
})).toFixed(1);

// 4. Depth (10): long-form pages for the questions people ask.
result.categories.depth = +(10 * avg((d) => Math.min(1, d.words / 1200))).toFixed(1);

// 5. Schema & entity (10): specific types beyond the base graph.
const typesWanted = ['FAQPage', 'HowTo', 'Course', 'Service', 'Person', 'BreadcrumbList', 'TechArticle|Article|BlogPosting'];
const allLd = docs.map((d) => d.ld).join(' ');
const typeHits = typesWanted.filter((t) => new RegExp(`"@type":\\s*"(${t})"`).test(allLd));
result.categories.schema = +(10 * typeHits.length / typesWanted.length).toFixed(1);
result.schemaTypes = typeHits;

// 6. Freshness & crawlability (10).
const robots = await readFile(join(DIST, 'robots.txt'), 'utf8');
const llms = await readFile(join(DIST, 'llms.txt'), 'utf8');
const bots = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'OAI-SearchBot'];
const botsOk = bots.filter((b) => new RegExp(`User-agent: ${b}\\s+Allow: /`).test(robots)).length / bots.length;
const inLlms = content.filter((d) => llms.includes('https://ainpm.in' + d.url)).length / content.length;
const dated = content.filter((d) => /"dateModified"/.test(d.ld) || /datetime="20\d\d/.test(d.main)).length / content.length;
result.categories.freshCrawl = +(10 * (0.4 * botsOk + 0.3 * inLlms + 0.3 * dated)).toFixed(1);

result.total = +Object.values(result.categories).reduce((a, b) => a + b, 0).toFixed(1);
result.contentPages = content.length;
for (const d of content) result.pages[d.url] = { words: d.words, questionH2: d.h2.filter((h) => /\?$/.test(h)).length + '/' + d.h2.length, faq: /"FAQPage"/.test(d.ld) };

if (process.argv.includes('--json')) console.log(JSON.stringify(result));
else {
  console.log(`GEO proxy score: ${result.total}/100 over ${content.length} content pages`);
  for (const [k, v] of Object.entries(result.categories)) console.log(`  ${k}: ${v}`);
  for (const [t, v] of Object.entries(result.topics)) console.log(`  topic ${t}: ${v.score}`);
}
