# ADR-0001: Move ainpm.in to Astro on GitHub Pages, with GoatCounter visit counters

**Status:** Accepted
**Date:** 2026-10-02
**Deciders:** Ian Pinto (owner, sole maintainer)

## Context

ainpm.in was three hand-written HTML files served by GitHub Pages from the `main` branch. That was fast to launch but had gaps for search and AI visibility:

- No `robots.txt`, `sitemap.xml`, `llms.txt`, social share image or 404 page.
- Head tags, navigation, footer and JSON-LD were copied by hand into every page, so they drifted.
- No place for articles, a glossary or an author page — the content that search and answer engines cite.
- No visit data, and no way to show page or site view counts.

Constraints: static hosting on GitHub Pages with the existing custom domain; one maintainer; no server to run; no cookies or consent banner (DPDP); the `/kite/redirect/` utility page must keep working unchanged.

## Decision

1. Build the site with **Astro** (static output), deployed by **GitHub Actions** to GitHub Pages.
2. Write articles as **Markdown content collections** with typed frontmatter (title, description, short answer, dates, FAQ, sources).
3. Put all SEO/AEO/GEO plumbing in **one layout** (`src/layouts/Base.astro`): canonical, Open Graph, JSON-LD graph, last-updated date.
4. Generate `sitemap`, `rss.xml`, `llms.txt`, `llms-full.txt` and share images **at build time**.
5. Use **GoatCounter** for cookieless analytics, and its public counter API for the footer line "This page: N views · Site: N views".
6. Fail the build on basic SEO regressions via `scripts/check.mjs`.

## Options Considered

### Option A: Astro (chosen)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low–medium: one build step, components instead of copy-paste |
| Cost | Free (GitHub Pages + Actions) |
| Scalability | Hundreds of pages build in seconds |
| Team familiarity | HTML/CSS carries over directly |

**Pros:** Ships plain HTML with no framework JavaScript; content collections validate frontmatter; official sitemap and RSS packages; existing CSS reused as-is.
**Cons:** Adds Node tooling and a CI build; major versions move quickly.

### Option B: Next.js static export
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium–high |
| Cost | Free |
| Scalability | Good |
| Team familiarity | Requires React |

**Pros:** Strong metadata API; large ecosystem.
**Cons:** Ships a React runtime for a content site; image optimisation and several features need a server that GitHub Pages lacks.

### Option C: Keep hand-written HTML, add files manually
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low now, high per page later |
| Cost | Free |
| Scalability | Poor: every new page repeats head, nav, footer and schema |
| Team familiarity | Highest |

**Pros:** No build.
**Cons:** Drift between pages; sitemap, RSS and llms.txt maintained by hand; a content hub is impractical.

### Counter backend
| Option | Verdict |
|---|---|
| **GoatCounter** (chosen) | Free, cookieless, no personal data, public JSON counter per path and site total. Needs one setting switched on. |
| Cloudflare Worker + KV | Full control, but a second platform to deploy and secure for one maintainer. |
| Free counter APIs with no account | Fastest, but hobby services with no reliability promise. |

## Trade-off Analysis

Astro gives almost all the benefit of a framework (shared layout, generated SEO files, typed content) while the output stays plain HTML, which is what crawlers and AI bots read most reliably. Next.js would add client JavaScript without adding anything this site needs. Staying on raw HTML would make the content hub a copy-paste job.

GoatCounter trades control for simplicity. Counts depend on a third party and are undercounted when visitors block trackers, which is acceptable for an unobtrusive indicator.

## Consequences

- Easier: adding an article is one Markdown file; sitemap, RSS, llms files, schema and navigation update on build.
- Easier: SEO rules are enforced in CI, so a page without a description or with a broken internal link fails the build.
- Harder: changes need a build (about a minute in Actions) instead of an instant file edit.
- Changed: GitHub Pages source must be "GitHub Actions", not "Deploy from a branch".
- Privacy: the counter sends the path only, never the query string, and does not run on `/kite/redirect/` or the 404 page.
- Revisit: self-host fonts if Core Web Vitals show font loading as the bottleneck; move analytics if GoatCounter limits are reached.

## Action Items

1. [x] Scaffold Astro project, migrate home, case study and Kite callback page.
2. [x] Add articles, glossary, author page, FAQ blocks and JSON-LD.
3. [x] Add robots.txt (AI crawlers allowed), sitemap, RSS, llms.txt, share images, 404.
4. [x] Add GoatCounter script and footer counters.
5. [ ] Switch Pages source to GitHub Actions and merge.
6. [ ] In GoatCounter settings, enable "Allow adding visitor counts on your website".
7. [ ] Verify the site in Google Search Console and Bing Webmaster Tools; submit `sitemap-index.xml`.
8. [ ] Refresh dated content quarterly (next: January 2027).
