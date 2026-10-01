// Post-build SEO checks. Fails the build if a page breaks a basic rule.
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';
const SKIP = ['kite/'];
const errors = [];
const pages = [];

async function walk(dir) {
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    if ((await stat(p)).isDirectory()) await walk(p);
    else if (name.endsWith('.html')) pages.push(p);
  }
}
const exists = async (p) => stat(p).then(() => true, () => false);

await walk(DIST);
const titles = new Map();
for (const file of pages) {
  const rel = file.slice(DIST.length + 1);
  if (SKIP.some((s) => rel.startsWith(s))) continue;
  const html = await readFile(file, 'utf8');
  const fail = (m) => errors.push(`${rel}: ${m}`);
  const is404 = rel === '404.html';

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const t = title.replace(/&amp;/g, '&').replace(/&#39;/g, "'");
  if (t.length < 25 || t.length > 65) fail(`title length ${t.length} (want 25-65): ${t}`);
  if (desc.length < 110 || desc.length > 170) fail(`description length ${desc.length} (want 110-170)`);
  if (titles.has(t)) fail(`duplicate title with ${titles.get(t)}`);
  titles.set(t, rel);
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) fail(`expected exactly one <h1>, found ${h1}`);
  if (!/<link rel="canonical" href="https:\/\/ainpm\.in\//.test(html)) fail('missing canonical');
  if (!is404 && !/property="og:image"/.test(html)) fail('missing og:image');
  if (!/<html lang="en-IN">/.test(html)) fail('missing lang');

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { fail('invalid JSON-LD: ' + e.message); }
  }
  for (const m of html.matchAll(/<img\s[^>]*>/g)) {
    if (!/\salt="[^"]+"/.test(m[0])) fail('image without alt text');
  }
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = m[1];
    if (href.startsWith('//')) continue;
    const target = href.endsWith('/') ? join(DIST, href, 'index.html') : join(DIST, href);
    if (!(await exists(target))) fail(`broken internal link ${href}`);
  }
}

for (const f of ['robots.txt', 'llms.txt', 'llms-full.txt', 'sitemap-index.xml', 'rss.xml', 'CNAME', 'og/default.png', '404.html']) {
  if (!(await exists(join(DIST, f)))) errors.push(`missing ${f}`);
}

if (errors.length) {
  console.error(`SEO check failed (${errors.length}):\n- ` + errors.join('\n- '));
  process.exit(1);
}
console.log(`SEO check passed for ${titles.size} pages.`);
