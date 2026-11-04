import type { APIRoute } from 'astro';
import { SKILLS, CREDENTIALS } from '../data/skills';
import { PROJECTS, activityCheckedOn } from '../data/projects';
import { SCORECARDS } from '../data/metrics';
import { CONTRIBUTIONS, contributionsCheckedOn } from '../data/contributions';

// Machine-readable proof-of-skill portfolio for recruiters' tools and AI assistants.
export const GET: APIRoute = () => {
  const site = 'https://ainpm.in';
  const abs = (h: string) => (h.startsWith('/') ? site + h : h);
  const body = {
    person: { name: 'Ian Pinto', url: site + '/about/', github: 'https://github.com/opnsrcntrbtr', huggingface: 'https://huggingface.co/opnsrcntrbtrian', credly: 'https://www.credly.com/users/ian-pinto/badges' },
    generated: new Date().toISOString().slice(0, 10),
    method: 'Skills are written in employer language, aligned to O*NET work activities and NACE competencies, and linked to public evidence. Credentials link to the issuer\'s verification page; self-uploaded records are labelled.',
    skills: SKILLS.map((s) => ({ id: s.id, name: s.name, claim: s.claim, proof: s.proof, onet: s.onet, nace: s.nace, evidence: s.evidence.map((e) => ({ ...e, href: abs(e.href) })) })),
    credentials: CREDENTIALS.map((c) => ({ ...c })),
    projects: PROJECTS.map((p) => ({ name: p.name, url: abs(p.href), summary: p.summary, status: p.status, skills: p.skills ?? [], lastActivity: p.lastActivity, activityCheckedOn, links: p.links, results: SCORECARDS[p.slug] ?? null })),
    contributions: { checkedOn: contributionsCheckedOn, items: CONTRIBUTIONS },
  };
  return new Response(JSON.stringify(body, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
