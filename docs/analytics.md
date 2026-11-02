# Analytics and business intelligence for ainpm.in

Everything here is free and cookieless. Decision record: [ADR-0002](adr/0002-cookieless-bi-stack.md).

| Layer | Tool | Answers |
|---|---|---|
| Visit counts (existing) | GoatCounter `ainpmdotin` | How many visits, which pages, referrers, countries, devices |
| Behaviour | PostHog Cloud (free: 1M events/month, 5k replays/month) | Funnels, CTA clicks, scroll depth, time on page, heatmaps, masked replays, Core Web Vitals |
| Search | Google Search Console, Bing Webmaster Tools | Queries, impressions, clicks, position, indexing; Bing feeds ChatGPT and Copilot |
| Real-user speed | Chrome UX Report (Looker Studio connector) | Field LCP, INP, CLS for ainpm.in |
| Bookings | Google Calendar (ianpinto@ainpm.in) | Consultations actually booked |
| One view | Looker Studio report fed by a Google Sheet | All of the above, by day |

## 1. PostHog (one-time, about 10 minutes)

1. Sign up at posthog.com, choose **US** or **EU** Cloud, create project **ainpm.in**.
2. Copy the **Project API key** (`phc_…`, public by design) into `src/data/site.ts` → `posthog.key`, and set `posthog.host` to `https://us.i.posthog.com` or `https://eu.i.posthog.com`. Commit and push.
3. Project settings:
   - **Authorized URLs / domains**: `https://ainpm.in` (heatmap toolbar and replay).
   - **Discard client IP data**: on.
   - **Session replay**: on. **Heatmaps**: on. **Web vitals autocapture**: on. **Autocapture**: on.
4. Create these insights and pin them to a dashboard named *ainpm.in business*:
   - **Booking funnel** (Funnel, 7-day window): `$pageview` → `$pageview` where `$pathname = /consult/` → `cta_click` where `cta` contains `book` → `calendar_loaded`.
   - **CTA clicks** (Trends, breakdown `cta`): `cta_click`.
   - **Outbound interest** (Trends, breakdown `host`): `outbound_click` — demo, GitHub, npm, DOI.
   - **Content depth** (Trends): `article_read` by `article`; `$pageleave` average `$prev_pageview_max_scroll_percentage` by path.
   - **FAQ demand** (Trends, breakdown `question`): `faq_open`.
   - **Web vitals** (Web analytics → Web vitals tab), p75 by path.
   - **Heatmaps**: Toolbar → Heatmap on `/`, `/work/`, `/skills/`, `/consult/`.
5. Exclude yourself: open `https://ainpm.in/?notrack=1` once in each browser you use. This also stops GoatCounter (`skipgc`).

Events sent by the site (`src/components/Analytics.astro`):

| Event | When | Properties |
|---|---|---|
| `$pageview`, `$pageleave` | Automatic | path, scroll depth, duration (query strings removed) |
| `$autocapture`, heatmap data | Automatic | element selectors only; all text masked |
| `$web_vitals` | Automatic | LCP, INP, CLS, FCP |
| `cta_click` | Any element with `data-goatcounter-click` | `cta`, `label` |
| `outbound_click` | Link to another site | `host`, `url` |
| `email_click` | `mailto:` link | `page` |
| `calendar_loaded` | "Show available times" on /consult/ | `page` |
| `demo_loaded` | SEBI RAG demo embed loaded | `product` |
| `faq_open` | Any FAQ opened | `question` |
| `article_read` | 75% of an article scrolled | `article` |
| `skills_filter` | Skills matrix filter used | `kind`, `shown` |

Privacy: `persistence: 'memory'` (no cookies, no storage), Do Not Track and Global Privacy Control respected, replays mask all text and inputs and block iframes, `/kite/` and 404 are never tracked. Public notice: `/privacy/`.

## 2. Google Search Console and Bing (one-time)

1. search.google.com/search-console → **Add property** → **Domain** → `ainpm.in`, signed in as ianpinto@ainpm.in.
2. Copy the TXT value (`google-site-verification=…`).
3. domainindia → DNS management for ainpm.in → **Add record**: Type **TXT**, Host **@**, Value = the copied string, TTL 3600. Keep the existing A/AAAA/CNAME records.
4. Back in Search Console → **Verify** (DNS can take minutes to a few hours).
5. **Sitemaps** → submit `https://ainpm.in/sitemap-index.xml`.
6. bing.com/webmasters → **Import from Google Search Console** (no second verification).

## 3. Data sheet (one-time, about 15 minutes)

1. As ianpinto@ainpm.in, create a Google Sheet **ainpm.in analytics**.
2. Extensions → **Apps Script**. Replace the files with `analytics/apps-script/Code.gs` and `appsscript.json` (Project Settings → show manifest).
3. Project Settings → **Script properties**:
   - `GOATCOUNTER_TOKEN`: ainpmdotin.goatcounter.com → Settings → API → new token with **Read statistics** only.
   - `POSTHOG_API_KEY`: PostHog → Account settings → Personal API keys → scope **query:read** only.
   - `POSTHOG_PROJECT_ID`: the number in your PostHog project URL.
   - `POSTHOG_HOST`: `https://us.posthog.com` or `https://eu.posthog.com`.
4. Run `setup`, then `backfill` (30 days), then `installDailyTrigger`. Approve the permissions (sheet, external requests, read-only calendar).

Tabs: `daily`, `pages`, `referrers`, `events`, `funnel`, `web_vitals`, `engagement`. Bookings are counted from calendar events whose description contains "Booked by", created that day.

## 4. Looker Studio report

lookerstudio.google.com → **Blank report**. Add data sources:

1. **Search Console** → `ainpm.in` (Domain property) → *URL Impression*.
2. **Google Sheets** → *ainpm.in analytics* → each tab as its own source (set `date` as Date type YYYYMMDD).
3. **Chrome UX Report** → origin `https://ainpm.in` (shows data once the site has enough Chrome traffic).

Pages and charts:

| Page | Charts |
|---|---|
| **Overview** | Scorecards: visits (`daily.gc_visits`), page views, bookings, search clicks, avg position. Time series: visits vs search clicks (two charts, not one dual-axis). Date-range control. |
| **Acquisition** | Table: `referrers` by visits. Table: Search Console queries (clicks, impressions, CTR, position). Bar: top landing pages. |
| **Content** | Table: `pages` by visits. Table: `engagement` avg scroll and seconds by path. Bar: `events` where event = `article_read`. |
| **Conversion** | Funnel (bar chart sorted by `step_order`): `funnel` summed over the date range. Table: `events` where event = `cta_click`, by detail. Scorecard: bookings. |
| **Experience** | Table: `web_vitals` p75 by path with conditional colours (LCP ≤ 2500 ms, INP ≤ 200 ms, CLS ≤ 0.1 good). CrUX origin trend. |

Share the report with view access only.

## 5. Review rhythm

Weekly: funnel, CTA clicks, top queries, any page with p75 LCP > 2.5 s. Monthly: content depth and FAQ demand → new articles and FAQ answers. Quarterly: retire metrics nobody acted on.
