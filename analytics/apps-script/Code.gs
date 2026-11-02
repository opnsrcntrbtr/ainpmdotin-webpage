/**
 * AINPM.in analytics → Google Sheets, for the Looker Studio report.
 *
 * Runs in Google Apps Script under ianpinto@ainpm.in (so it can read the booking calendar).
 * Once a day it appends yesterday's numbers from GoatCounter, PostHog and Google Calendar
 * appointment bookings to this spreadsheet. Looker Studio blends these tabs with the native
 * Search Console and Chrome UX Report connectors.
 *
 * Setup (see docs/analytics.md):
 *   Project Settings → Script properties:
 *     GOATCOUNTER_TOKEN   GoatCounter API token with "Read statistics" only
 *     POSTHOG_API_KEY     PostHog personal API key with scope query:read only
 *     POSTHOG_PROJECT_ID  PostHog project id (number in the project URL)
 *     POSTHOG_HOST        https://us.posthog.com or https://eu.posthog.com
 *   Then run setup() once, backfill(30) once, and installDailyTrigger() once.
 */

const GC_BASE = 'https://ainpmdotin.goatcounter.com/api/v0';
const TZ = 'Asia/Kolkata';

const TABS = {
  daily: ['date', 'gc_visits', 'gc_events', 'ph_pageviews', 'ph_page_sessions', 'bookings'],
  pages: ['date', 'path', 'title', 'gc_visits'],
  referrers: ['date', 'referrer', 'gc_visits'],
  events: ['date', 'event', 'detail', 'count'],
  funnel: ['date', 'step_order', 'step', 'count'],
  web_vitals: ['date', 'path', 'lcp_p75_ms', 'inp_p75_ms', 'cls_p75', 'samples'],
  engagement: ['date', 'path', 'pageviews', 'avg_scroll_pct', 'avg_seconds'],
};

function props_() {
  return PropertiesService.getScriptProperties().getProperties();
}

function setup() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(TABS).forEach(function (name) {
    const sh = ss.getSheetByName(name) || ss.insertSheet(name);
    if (sh.getLastRow() === 0) sh.appendRow(TABS[name]);
    sh.getRange('A:A').setNumberFormat('@'); // keep dates as text so re-runs replace the same day
    sh.setFrozenRows(1);
  });
}

function installDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'runDaily') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('runDaily').timeBased().atHour(6).everyDays(1).inTimezone(TZ).create();
}

function runDaily() {
  const y = new Date(Date.now() - 24 * 3600 * 1000);
  collectDay_(Utilities.formatDate(y, TZ, 'yyyy-MM-dd'));
}

function backfill(days) {
  days = days || 30;
  for (let i = days; i >= 1; i--) {
    const d = new Date(Date.now() - i * 24 * 3600 * 1000);
    collectDay_(Utilities.formatDate(d, TZ, 'yyyy-MM-dd'));
    Utilities.sleep(1200); // stay well inside GoatCounter and PostHog rate limits
  }
}

function collectDay_(day) {
  const ss = SpreadsheetApp.getActive();
  Object.keys(TABS).forEach(function (t) { deleteDay_(ss.getSheetByName(t), day); });

  const gc = goatcounter_(day);
  const ph = posthog_(day);
  const bookings = bookings_(day);

  append_(ss, 'daily', [[day, gc.visits, gc.events, ph.pageviews, ph.sessions, bookings]]);
  append_(ss, 'pages', gc.pages.map(function (p) { return [day, p.path, p.title, p.count]; }));
  append_(ss, 'referrers', gc.refs.map(function (r) { return [day, r.name || '(unknown)', r.count]; }));
  append_(ss, 'events', ph.events.map(function (e) { return [day].concat(e); }));
  append_(ss, 'funnel', [
    [day, 1, 'Visited any page', ph.pageviews],
    [day, 2, 'Viewed /consult/', ph.consultViews],
    [day, 3, 'Clicked a booking CTA', ph.bookClicks],
    [day, 4, 'Opened the calendar', ph.calendarOpens],
    [day, 5, 'Booked (Google Calendar)', bookings],
  ]);
  append_(ss, 'web_vitals', ph.vitals.map(function (v) { return [day].concat(v); }));
  append_(ss, 'engagement', ph.engagement.map(function (v) { return [day].concat(v); }));
}

/* ---------------- GoatCounter ---------------- */
function gcGet_(path, params) {
  const token = props_().GOATCOUNTER_TOKEN;
  if (!token) return null;
  const qs = Object.keys(params).map(function (k) { return k + '=' + encodeURIComponent(params[k]); }).join('&');
  const res = UrlFetchApp.fetch(GC_BASE + path + '?' + qs, {
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) { console.warn('GoatCounter ' + path + ' ' + res.getResponseCode()); return null; }
  return JSON.parse(res.getContentText());
}

function goatcounter_(day) {
  const range = { start: day + 'T00:00:00Z', end: day + 'T23:59:59Z' };
  const total = gcGet_('/stats/total', range) || {};
  const hits = gcGet_('/stats/hits', Object.assign({ limit: 100 }, range)) || {};
  const refs = gcGet_('/stats/toprefs', Object.assign({ limit: 50 }, range)) || {};
  const pages = (hits.hits || []).filter(function (h) { return !h.event; });
  return {
    visits: total.total || 0,
    events: total.total_events || 0,
    pages: pages.map(function (h) { return { path: h.path, title: h.title || '', count: h.count || 0 }; }),
    refs: (refs.stats || []).map(function (r) { return { name: r.name, count: r.count || 0 }; }),
  };
}

/* ---------------- PostHog (HogQL) ---------------- */
function hogql_(sql) {
  const p = props_();
  if (!p.POSTHOG_API_KEY || !p.POSTHOG_PROJECT_ID) return [];
  const host = p.POSTHOG_HOST || 'https://us.posthog.com';
  const res = UrlFetchApp.fetch(host + '/api/projects/' + p.POSTHOG_PROJECT_ID + '/query/', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + p.POSTHOG_API_KEY },
    payload: JSON.stringify({ query: { kind: 'HogQLQuery', query: sql } }),
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) { console.warn('PostHog ' + res.getResponseCode() + ' ' + res.getContentText().slice(0, 300)); return []; }
  return JSON.parse(res.getContentText()).results || [];
}

function posthog_(day) {
  const w = "toDate(timestamp, 'Asia/Kolkata') = toDate('" + day + "')";
  const base = hogql_(
    "SELECT countIf(event = '$pageview'), uniqIf($session_id, event = '$pageview'), " +
    "countIf(event = '$pageview' AND properties.$pathname = '/consult/'), " +
    "countIf(event = 'cta_click' AND properties.cta LIKE '%book%'), " +
    "countIf(event = 'calendar_loaded') FROM events WHERE " + w
  )[0] || [0, 0, 0, 0, 0];

  const events = hogql_(
    "SELECT event, coalesce(toString(properties.cta), toString(properties.host), toString(properties.kind), toString(properties.product), toString(properties.article), '') AS detail, count() " +
    "FROM events WHERE " + w + " AND event IN ('cta_click','calendar_loaded','demo_loaded','faq_open','outbound_click','email_click','article_read','skills_filter') " +
    "GROUP BY event, detail ORDER BY count() DESC LIMIT 200"
  );

  const vitals = hogql_(
    "SELECT properties.$pathname AS path, " +
    "round(quantile(0.75)(toFloat(properties.$web_vitals_LCP_value))), " +
    "round(quantile(0.75)(toFloat(properties.$web_vitals_INP_value))), " +
    "round(quantile(0.75)(toFloat(properties.$web_vitals_CLS_value)), 3), count() " +
    "FROM events WHERE " + w + " AND event = '$web_vitals' GROUP BY path ORDER BY count() DESC LIMIT 50"
  );

  const engagement = hogql_(
    "SELECT properties.$prev_pageview_pathname AS path, count(), " +
    "round(avg(toFloat(properties.$prev_pageview_max_scroll_percentage)) * 100), " +
    "round(avg(toFloat(properties.$prev_pageview_duration))) " +
    "FROM events WHERE " + w + " AND event = '$pageleave' GROUP BY path ORDER BY count() DESC LIMIT 50"
  );

  return {
    pageviews: base[0] || 0, sessions: base[1] || 0, consultViews: base[2] || 0,
    bookClicks: base[3] || 0, calendarOpens: base[4] || 0,
    events: events, vitals: vitals, engagement: engagement,
  };
}

/* ---------------- Google Calendar bookings ---------------- */
function bookings_(day) {
  // Appointment-schedule bookings are calendar events whose description contains "Booked by".
  const start = new Date(day + 'T00:00:00+05:30');
  const end = new Date(start.getTime() + 24 * 3600 * 1000);
  // Count bookings *made* that day: scan the next 120 days of events created on that day.
  const events = CalendarApp.getDefaultCalendar().getEvents(start, new Date(start.getTime() + 120 * 24 * 3600 * 1000));
  return events.filter(function (e) {
    const created = e.getDateCreated();
    return created >= start && created < end && /Booked by/i.test(e.getDescription() || '');
  }).length;
}

/* ---------------- helpers ---------------- */
function append_(ss, tab, rows) {
  if (!rows || !rows.length) return;
  const sh = ss.getSheetByName(tab);
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

function deleteDay_(sh, day) {
  if (!sh || sh.getLastRow() < 2) return;
  const vals = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues();
  for (let i = vals.length - 1; i >= 0; i--) if (vals[i][0] === day) sh.deleteRow(i + 2);
}
