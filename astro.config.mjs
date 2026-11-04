import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// Real "last modified" dates for the sitemap, so crawlers can trust them.
// Articles: read from frontmatter. Other pages: set here when their content changes.
const lastmod = {
  '/': '2026-11-03',
  '/guide/': '2026-11-03',
  '/learn/': '2026-11-04',
  '/mentorship/': '2026-11-04',
  '/work/codesearchnet/': '2026-11-05',
  '/work/': '2026-11-05',
  '/skills/': '2026-11-05',
  '/sebi-rag/': '2026-11-05',
  '/about/': '2026-11-05',
  '/work/trustvault/': '2026-11-05',
  '/work/webauthn-prf-zktv/': '2026-11-05',
  '/work/lecture-lens/': '2026-11-05',
  '/consult/': '2026-10-28',
  '/privacy/': '2026-11-02',
  '/glossary/': '2026-10-29',
  '/articles/': '2026-10-02',
};
const dir = './src/content/articles';
for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const m = readFileSync(`${dir}/${f}`, 'utf8').match(/^updatedDate:\s*(\S+)/m);
  if (m) lastmod[`/articles/${f.replace(/\.md$/, '')}/`] = m[1];
}

// https://astro.build/config
export default defineConfig({
  site: 'https://ainpm.in',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // Utility pages that must not be indexed
      filter: (page) => !page.includes('/kite/') && !page.includes('/404'),
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (lastmod[path]) item.lastmod = new Date(lastmod[path]).toISOString();
        return item;
      },
    }),
  ],
});
