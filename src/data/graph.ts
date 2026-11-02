// Derives the skill → project links and the evidence matrix from src/data/skills.ts,
// so the infographics can never drift from the skills matrix.
import { SKILLS, type EvidenceKind } from './skills';

export const KINDS: EvidenceKind[] = ['Live demo', 'Open code', 'Package', 'Eval results', 'Publication', 'Credential', 'Case study'];

export const TARGETS = [
  { id: 'sebi-rag', label: 'SEBI Circular RAG', href: '/sebi-rag/', group: 'project' },
  { id: 'trustvault', label: 'TrustVault', href: '/work/trustvault/', group: 'project' },
  { id: 'webauthn-prf-zktv', label: 'webauthn-prf-zktv', href: '/work/webauthn-prf-zktv/', group: 'project' },
  { id: 'lecture-lens', label: 'Lecture Lens', href: '/work/lecture-lens/', group: 'project' },
  { id: 'writing', label: 'Articles & guides', href: '/articles/', group: 'other' },
  { id: 'credentials', label: 'Credentials', href: '/skills/#credentials', group: 'other' },
] as const;
export type TargetId = (typeof TARGETS)[number]['id'];

const PROJECT_IDS: TargetId[] = ['sebi-rag', 'trustvault', 'webauthn-prf-zktv', 'lecture-lens'];

export function targetsFor(href: string): TargetId[] {
  const h = href.toLowerCase();
  if (h === '/work/') return PROJECT_IDS;
  if (h.includes('sebi')) return ['sebi-rag'];
  if (h.includes('trustvault')) return ['trustvault'];
  if (h.includes('zktv') || h.includes('figshare') || h.includes('10.6084')) return ['webauthn-prf-zktv'];
  if (h.includes('lecture-lens')) return ['lecture-lens'];
  if (h.includes('#credentials') || h === '/about/') return ['credentials'];
  if (h.startsWith('/articles') || h.startsWith('/glossary') || h.includes('#playbook') || h.includes('#radar')) return ['writing'];
  return [];
}

/** skillId → set of targets it links to */
export const LINKS: { skill: string; target: TargetId }[] = (() => {
  const out: { skill: string; target: TargetId }[] = [];
  for (const s of SKILLS) {
    const seen = new Set<TargetId>();
    for (const e of s.evidence) for (const t of targetsFor(e.href)) seen.add(t);
    for (const t of seen) out.push({ skill: s.id, target: t });
  }
  return out;
})();

/** Evidence count per skill per kind */
export const MATRIX = SKILLS.map((s) => ({
  id: s.id,
  name: s.name,
  counts: KINDS.map((k) => s.evidence.filter((e) => e.kind === k).length),
  total: s.evidence.length,
}));
export const KIND_TOTALS = KINDS.map((_, i) => MATRIX.reduce((n, r) => n + r.counts[i], 0));
