import { analyse, summarise } from './visibility-probe.mjs';
import assert from 'node:assert/strict';
const content = [
  { type: 'server_tool_use', id: 's1', name: 'web_search', input: { query: 'ai pm course india' } },
  { type: 'web_search_tool_result', tool_use_id: 's1', content: [
    { type: 'web_search_result', url: 'https://hellopm.co/ai', title: 'HelloPM' },
    { type: 'web_search_result', url: 'https://www.ainpm.in/learn/', title: 'Learn' } ] },
  { type: 'text', text: 'Options include HelloPM cohorts. ' },
  { type: 'text', text: 'AINPM.in has a free path.', citations: [{ type: 'web_search_result_location', url: 'https://ainpm.in/learn/', title: 'Learn', cited_text: 'free' }] },
];
const a = analyse(content);
assert.equal(a.brands['ainpm.in'].mentioned, true);
assert.equal(a.brands['ainpm.in'].cited, true);
assert.equal(a.brands['ainpm.in'].position, 2);
assert.equal(a.brands['HelloPM'].position, 1);
assert.equal(a.brands['HelloPM'].cited, false);
assert.equal(a.brands['HelloPM'].retrieved, true);
assert.equal(a.brands['Product Space'].mentioned, false);
// error-shaped search result (object, not list) must not crash
const e = analyse([{ type: 'web_search_tool_result', content: { type: 'web_search_tool_result_error', error_code: 'max_uses_exceeded' } }, { type: 'text', text: 'none' }]);
assert.equal(e.brands['ainpm.in'].mentioned, false);
const s = summarise([{ topic: 'T', stage: 'learn', ...a }, { topic: 'T', stage: 'consider', ...e }]);
assert.equal(s.mentionRate, 50); assert.equal(s.citationRate, 50); assert.equal(s.shareOfVoice, 50); assert.equal(s.funnel.learn, 100); assert.equal(s.avgPosition, 2);
console.log('probe parser tests passed', JSON.stringify(s));
