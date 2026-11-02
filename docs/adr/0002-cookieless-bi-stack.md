# ADR-0002: Cookieless business-intelligence stack alongside GoatCounter

**Status:** Accepted
**Date:** 2026-11-02
**Deciders:** Ian Pinto

## Context

GoatCounter counts visits well but cannot show search queries, conversion funnels, engagement, heatmaps, session replays or real-user page speed. The site now has a paid consultation funnel (`/consult/` → Google Calendar). Constraints: free, no cookies or consent banner, static hosting, one maintainer, India's DPDP Act.

## Decision

Keep GoatCounter for public counts. Add PostHog Cloud (free tier) in cookieless mode for behaviour, heatmaps, masked replays and Core Web Vitals; Google Search Console and Bing Webmaster Tools for search; and a Looker Studio report fed by a Google Sheet that an Apps Script fills daily from GoatCounter, PostHog and Google Calendar bookings.

## Options considered

| Option | Verdict |
|---|---|
| **PostHog Cloud, cookieless** (chosen) | 1M events and 5k replays a month free; funnels, paths, heatmaps, replay, web vitals; `persistence: memory` avoids cookies. Trade-off: no cross-page journeys or returning-visitor counts. |
| Umami Cloud | Free 100k events, cookieless, funnels; no heatmaps or replay. |
| Microsoft Clarity | Free heatmaps and replay, but uses cookies, so needs a consent banner. |
| Google Analytics 4 | Free and Looker-native, but cookies and consent, and heavy for a small site. |
| Cloudflare Web Analytics | Free and cookieless, but overlaps GoatCounter and has no events or funnels. |

## Consequences

- Funnel steps are counted per page view, not per person, because nothing links page views together.
- Replays are short (one page each) and show layout only; that is the price of cookieless replay.
- Bookings are measured from the calendar, so the last funnel step is accurate even though the Google booking form cannot be tracked.
- Looker Studio data refreshes daily, not live; PostHog dashboards are live.
- Secrets (GoatCounter token, PostHog personal key) live only in Apps Script properties, never in the repo.
