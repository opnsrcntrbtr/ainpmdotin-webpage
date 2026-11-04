// AI visibility probe for the Ralph loop (backlog R10).
// Asks the neutral questions in ops/ralph/probe-questions.json to Claude with live web search,
// then records, per answer, whether ainpm.in and each competitor is mentioned in the text, cited
// as a source, and in what order brands first appear. This is ground truth for ONE assistant
// (Claude with web search); Ripplix covers ChatGPT, Gemini and Google AI Mode.
//
// Usage (on the Mac, needs an Anthropic credential: ANTHROPIC_API_KEY or `ant auth login`):
//   node scripts/visibility-probe.mjs --dry-run      # list questions and the cost estimate, no API calls
//   node scripts/visibility-probe.mjs --limit 3      # try three questions first
//   node scripts/visibility-probe.mjs                # full run; appends a summary to ops/ralph/external.jsonl
//
// Cost: each question uses up to MAX_SEARCHES web searches ($10 per 1,000) plus tokens on
// claude-opus-5-5 ($4 / $20 per million input / output). A full 27-question run is roughly US$3-5;
// --dry-run prints the estimate. Results: ops/ralph/probe/<date>.json (detail) + external.jsonl (summary).
import Anthropic from '@anthropic-ai/sdk';
import { readFile, writeFile, appendFile, mkdir } from 'node:fs/promises';

const MODEL = 'claude-opus-5-5';
const MAX_SEARCHES = 3;
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n, d) => { const i = args.indexOf(n); return i > -1 ? args[i + 1] : d; };

const spec = JSON.parse(await readFile('ops/ralph/probe-questions.json', 'utf8'));
const questions = spec.questions.slice(0, Number(opt('--limit', spec.questions.length)));
const BRANDS = Object.entries(spec.brands);

// ---------- pure analysis (exported for tests) ----------
const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };
const matchesDomain = (url, domains) => domains.some((d) => { const h = hostOf(url); return h === d || h.endsWith('.' + d); });

export function analyse(content, brands = BRANDS) {
  const text = content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  const lower = text.toLowerCase();
  // Sources the answer actually cites inline.
  const cited = content.filter((b) => b.type === 'text').flatMap((b) => b.citations ?? [])
    .filter((c) => c.type === 'web_search_result_location').map((c) => c.url);
  // Everything the searches returned, cited or not.
  const retrieved = content.filter((b) => b.type === 'web_search_tool_result' && Array.isArray(b.content))
    .flatMap((b) => b.content).filter((r) => r.type === 'web_search_result').map((r) => r.url);
  const result = {};
  for (const [brand, { names, domains }] of brands) {
    const idx = [...names, ...domains].map((n) => lower.indexOf(n.toLowerCase())).filter((i) => i > -1);
    result[brand] = {
      mentioned: idx.length > 0,
      firstAt: idx.length ? Math.min(...idx) : null,
      cited: cited.some((u) => matchesDomain(u, domains)),
      retrieved: retrieved.some((u) => matchesDomain(u, domains)),
    };
  }
  const order = Object.entries(result).filter(([, r]) => r.mentioned).sort((a, b) => a[1].firstAt - b[1].firstAt).map(([b]) => b);
  for (const [b, r] of Object.entries(result)) r.position = r.mentioned ? order.indexOf(b) + 1 : null;
  return { brands: result, citedUrls: [...new Set(cited)], retrievedCount: retrieved.length, answerChars: text.length };
}

export function summarise(rows, brands = BRANDS) {
  const pct = (n, d) => (d ? +(100 * n / d).toFixed(1) : 0);
  const me = 'ainpm.in';
  const mentions = Object.fromEntries(brands.map(([b]) => [b, rows.filter((r) => r.brands[b]?.mentioned).length]));
  const totalMentions = Object.values(mentions).reduce((a, b) => a + b, 0);
  const byKey = (key) => {
    const out = {};
    for (const k of new Set(rows.map((r) => r[key]))) {
      const sub = rows.filter((r) => r[key] === k);
      out[k] = pct(sub.filter((r) => r.brands[me].mentioned || r.brands[me].cited).length, sub.length);
    }
    return out;
  };
  const positions = rows.map((r) => r.brands[me].position).filter(Boolean);
  return {
    questions: rows.length,
    mentionRate: pct(mentions[me], rows.length),
    citationRate: pct(rows.filter((r) => r.brands[me].cited).length, rows.length),
    retrievedRate: pct(rows.filter((r) => r.brands[me].retrieved).length, rows.length),
    shareOfVoice: pct(mentions[me], totalMentions),
    avgPosition: positions.length ? +(positions.reduce((a, b) => a + b, 0) / positions.length).toFixed(2) : null,
    competitors: Object.fromEntries(brands.filter(([b]) => b !== me).map(([b]) => [b, { mentionRate: pct(mentions[b], rows.length), sov: pct(mentions[b], totalMentions) }])),
    funnel: byKey('stage'),
    topicVisibility: byKey('topic'),
  };
}

// ---------- run ----------
async function ask(client, q) {
  const messages = [{ role: 'user', content: q }];
  const content = [];
  let usage = { input: 0, output: 0, searches: 0 };
  for (let turn = 0; turn < 4; turn++) {
    const res = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default', // re-run a policy decline on a fallback model instead of losing the answer
      output_config: { effort: 'medium' },
      tools: [{
        type: 'web_search_20260209', name: 'web_search', max_uses: MAX_SEARCHES,
        user_location: { type: 'approximate', country: 'IN', timezone: 'Asia/Kolkata' },
      }],
      messages,
    });
    content.push(...res.content);
    usage.input += res.usage.input_tokens; usage.output += res.usage.output_tokens;
    usage.searches += res.usage.server_tool_use?.web_search_requests ?? 0;
    if (res.stop_reason === 'pause_turn') { messages.push({ role: 'assistant', content: res.content }); continue; }
    return { content, usage, stop: res.stop_reason, servedBy: res.model };
  }
  return { content, usage, stop: 'pause_turn_limit', servedBy: MODEL };
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const estUsd = questions.length * (MAX_SEARCHES * 0.01 + (25000 * 4 + 1500 * 20) / 1e6);
  console.log(`Probe: ${questions.length} questions on ${MODEL}, up to ${MAX_SEARCHES} searches each; est. ≤ US$${estUsd.toFixed(2)}`);
  if (flag('--dry-run')) { for (const q of questions) console.log(`  ${q.id} [${q.topic} · ${q.stage}] ${q.q}`); process.exit(0); }

  const client = new Anthropic();
  const rows = [];
  let cost = 0;
  for (const q of questions) {
    try {
      const r = await ask(client, q.q);
      const a = analyse(r.content);
      cost += r.usage.searches * 0.01 + (r.usage.input * 4 + r.usage.output * 20) / 1e6;
      rows.push({ ...q, ...a, stop: r.stop, servedBy: r.servedBy, usage: r.usage });
      const me = a.brands['ainpm.in'];
      console.log(`${q.id} ${me.cited ? 'CITED' : me.mentioned ? 'mentioned' : me.retrieved ? 'retrieved only' : '—'}  ${q.q}`);
    } catch (e) {
      if (e instanceof Anthropic.AuthenticationError) { console.error('No valid Anthropic credential. Set ANTHROPIC_API_KEY or run `ant auth login`.'); process.exit(1); }
      if (e instanceof Anthropic.RateLimitError) { console.error(`${q.id} rate limited; skipped`); continue; }
      if (e instanceof Anthropic.APIError) { console.error(`${q.id} API error ${e.status}: ${e.message}`); continue; }
      throw e;
    }
  }
  const date = new Date().toISOString().slice(0, 10);
  const summary = { date, source: `claude-probe (${MODEL} + web search, ${rows.length} questions, v${spec.version})`, ...summarise(rows), costUsd: +cost.toFixed(2) };
  await mkdir('ops/ralph/probe', { recursive: true });
  await writeFile(`ops/ralph/probe/${date}.json`, JSON.stringify({ summary, rows }, null, 1));
  if (!flag('--no-log') && rows.length === spec.questions.length) await appendFile('ops/ralph/external.jsonl', JSON.stringify(summary) + '\n');
  console.log(JSON.stringify(summary, null, 2));
  if (rows.length !== spec.questions.length) console.log('Partial run: summary not appended to external.jsonl.');
}
