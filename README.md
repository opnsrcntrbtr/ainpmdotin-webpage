# ainpm.in

Source for **[ainpm.in](https://ainpm.in)** — AI-native product management, built from India. By [Ian Pinto](https://ainpm.in/about/).

Static site built with [Astro](https://astro.build) and deployed to GitHub Pages by GitHub Actions on every push to `main`.

## Run locally

Requires Node 22.12 or newer.

```bash
npm install
npm run dev      # local preview at http://localhost:4321
npm run build    # generates share images, then builds to dist/
npm run check    # SEO checks on the built site (also runs in CI)
```

## Where things live

| Path | What it is |
|---|---|
| `src/pages/index.astro` | Home page |
| `src/pages/sebi-rag/index.astro` | SEBI Circular RAG case study |
| `src/content/articles/*.md` | Articles. Add a Markdown file to publish a new one |
| `src/data/glossary.ts` | Glossary terms |
| `src/data/site.ts` | Site name, author details, navigation, search-console verification codes |
| `src/layouts/Base.astro` | Shared head tags, JSON-LD, navigation, footer, visit counter |
| `public/assets/site.css` | All styles |
| `public/robots.txt` | Crawler rules (search engines and AI assistants allowed) |
| `public/kite/redirect/` | Kite Connect callback page (not indexed, not counted) |
| `scripts/og.mjs` | Generates social share images at build time |
| `scripts/check.mjs` | Fails the build on missing titles, descriptions, broken links and similar |
| `docs/adr/` | Architecture decisions |

Generated on build: `sitemap-index.xml`, `rss.xml`, `llms.txt`, `llms-full.txt`, `og/*.png`.

## Adding an article

Create `src/content/articles/my-slug.md` with this frontmatter, then write the body with question-style `##` headings and lead each section with the answer:

```yaml
---
title: "Under 60 characters"
description: "110–170 characters."
tldr: "The short answer, 40–60 words."
pubDate: 2026-10-02
updatedDate: 2026-10-02
tags: ["Topic"]
readingMinutes: 6
faq:
  - q: "Question?"
    a: "Answer."
sources:
  - href: "https://example.com"
    label: "Source name"
---
```

## Visit counters

[GoatCounter](https://www.goatcounter.com) (no cookies) records page views. The footer line reads counts from GoatCounter's public counter API; it stays hidden unless "Allow adding visitor counts on your website" is enabled in the GoatCounter settings.

Content last reviewed: 2 October 2026. General information only; not legal advice.
