import type { APIRoute } from 'astro';
import { SKILLS, SFIA_LEVELS } from '../../data/skills';

// Self-asserted, unsigned skills record in the shape of an Open Badges 3.0 AchievementCredential.
export const GET: APIRoute = () => {
  const site = 'https://ainpm.in';
  const body = {
    '@context': ['https://www.w3.org/ns/credentials/v2', 'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json'],
    type: ['VerifiableCredential', 'OpenBadgeCredential'],
    id: site + '/skills/passport.json',
    name: 'Skills passport: Ian Pinto',
    description: 'Self-asserted and unsigned. Skills mapped to O*NET, NACE, ESCO and SFIA 9 with self-assessed levels and public evidence. Not a verified credential; see https://ainpm.in/skills/#credentials for issuer-verified credentials.',
    issuer: { id: site + '/about/', type: ['Profile'], name: 'Ian Pinto (self-asserted)', url: site + '/about/' },
    validFrom: '2026-11-08T00:00:00Z',
    credentialSubject: {
      type: ['AchievementSubject'],
      name: 'Ian Pinto',
      achievement: SKILLS.map((s) => ({
        id: `${site}/skills/passport/#${s.id}`,
        type: ['Achievement'],
        name: s.name,
        description: s.claim,
        criteria: { narrative: s.proof },
        alignment: [
          ...(s.esco ?? []).map((e) => ({ type: ['Alignment'], targetName: e.label, targetUrl: e.uri, targetFramework: 'ESCO', targetType: 'ceasn:Competency' })),
          ...(s.sfia ?? []).map((x) => ({ type: ['Alignment'], targetName: `${x.name} (level ${x.level}: ${SFIA_LEVELS[x.level]}, self-assessed)`, targetCode: x.code, targetFramework: 'SFIA 9', targetUrl: 'https://sfia-online.org/en/sfia-9/all-skills-a-z', targetDescription: x.why, targetType: 'ceasn:Competency' })),
          ...s.onet.map((o) => ({ type: ['Alignment'], targetName: o, targetFramework: 'O*NET Generalized Work Activities', targetUrl: 'https://www.onetonline.org/find/descriptor/browse/4.A', targetType: 'ceasn:Competency' })),
        ],
        evidence: s.evidence.map((e) => ({ type: ['Evidence'], name: e.label, id: e.href.startsWith('/') ? site + e.href : e.href, genre: e.kind })),
      })),
    },
  };
  return new Response(JSON.stringify(body, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
