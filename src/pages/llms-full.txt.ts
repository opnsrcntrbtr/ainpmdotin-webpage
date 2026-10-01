import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { GLOSSARY } from '../data/glossary';

export const GET: APIRoute = async () => {
  const articles = (await getCollection('articles')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  const parts = [
    '# AINPM.in — full text for AI systems',
    '',
    'Author: Ian Pinto (https://ainpm.in/about/). Last updated: 2026-10-02. Summary: https://ainpm.in/llms.txt',
    '',
    ...articles.flatMap((a) => [
      '---',
      '',
      `# ${a.data.title}`,
      '',
      `URL: https://ainpm.in/articles/${a.id}/`,
      `Published: ${a.data.pubDate.toISOString().slice(0, 10)} · Updated: ${a.data.updatedDate.toISOString().slice(0, 10)} · Author: Ian Pinto`,
      '',
      `Short answer: ${a.data.tldr}`,
      '',
      (a.body ?? '').trim(),
      '',
      '## FAQ',
      '',
      ...a.data.faq.flatMap((f) => [`Q: ${f.q}`, `A: ${f.a}`, '']),
    ]),
    '---',
    '',
    '# Glossary',
    '',
    'URL: https://ainpm.in/glossary/',
    '',
    ...GLOSSARY.map((t) => `- **${t.term}**: ${t.def}`),
    '',
  ];
  return new Response(parts.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
