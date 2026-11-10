// Dated milestones for the evolution timeline. Credentials and contributions are read
// from their own data files, so dates never drift; the rest are checked against
// repository creation dates, release dates and decision records.
import { CREDENTIALS } from './skills';
import { CONTRIBUTIONS } from './contributions';

export type Kind = 'Credential' | 'Project' | 'Release' | 'Research' | 'Contribution' | 'Decision';
export interface Milestone { date: string; kind: Kind; title: string; href?: string; note?: string }

const GH = 'https://github.com/opnsrcntrbtr';
const MANUAL: Milestone[] = [
  { date: '2023-10-02', kind: 'Project', title: 'First generative AI proof of concept on the ChatGPT API', href: `${GH}/chatgpt-couple-portmanteau-nodejs-react` },
  { date: '2025-09-13', kind: 'Project', title: 'GenAI Tasker Lite: offline Android app with on-device semantic search', href: `${GH}/genAI-edge-tasker-lite` },
  { date: '2025-10-22', kind: 'Project', title: 'TrustVault PWA started: zero-knowledge password manager', href: '/work/trustvault/' },
  { date: '2025-11-27', kind: 'Project', title: 'SEBI regulatory knowledge-base agent (LangGraph), first step towards SEBI Circular RAG', href: `${GH}/sebi-regulatory-knowledge-base-ai-agent` },
  { date: '2026-03-05', kind: 'Project', title: 'Local SEBI circulars RAG with hybrid retrieval (earlier version)', href: `${GH}/sebi_circular_rag` },
  { date: '2026-06-21', kind: 'Release', title: 'TrustVault feature-complete: passkey unlock, breach checks, on-device AI', href: '/work/artifacts/trustvault/' },
  { date: '2026-07-03', kind: 'Project', title: 'SEBI Circular RAG started: local-first, validity-aware regulatory assistant', href: '/sebi-rag/' },
  { date: '2026-07-05', kind: 'Release', title: 'webauthn-prf-zktv v0.2.0 published on npm', href: 'https://www.npmjs.com/package/webauthn-prf-zktv' },
  { date: '2026-07-06', kind: 'Research', title: 'Preprint: WebAuthn PRF-based vault key wrapping (DOI)', href: 'https://doi.org/10.6084/m9.figshare.32915411.v1' },
  { date: '2026-08-10', kind: 'Research', title: 'CodeSearchNet fine-tuning report: MRR 0.815 vs BM25 0.527', href: '/work/codesearchnet/' },
  { date: '2026-08-15', kind: 'Release', title: 'SEBI RAG full evaluation on 260 adjudicated questions: abstention accuracy 0.981', href: '/work/artifacts/sebi-rag/#eval' },
  { date: '2026-08-24', kind: 'Decision', title: 'SEBI RAG adopts a new reranker below its own 10% bar, with the override documented', href: '/work/artifacts/sebi-rag/#decisions' },
  { date: '2026-09-16', kind: 'Release', title: 'SEBI RAG live demo over 1,490 circulars', href: 'https://huggingface.co/spaces/opnsrcntrbtrian/sebi-circular-rag-demo' },
  { date: '2026-09-23', kind: 'Project', title: 'AINPM.in launched', href: '/about/' },
  { date: '2026-09-29', kind: 'Project', title: 'Screenpipe Study: private lecture-capture prototype on a local Mac', href: '/work/lecture-lens/origin/' },
  { date: '2026-10-04', kind: 'Release', title: 'Lecture Lens released as open source', href: '/work/lecture-lens/' },
  { date: '2026-11-05', kind: 'Release', title: 'Lecture Lens Studio: the model runs inside Chrome', href: '/work/lecture-lens/#studio' },
];

export const TIMELINE: Milestone[] = [
  ...MANUAL,
  ...CREDENTIALS.filter((c) => c.issued && c.verification === 'issuer').map((c) => ({ date: c.issued!, kind: 'Credential' as Kind, title: `${c.name}, ${c.issuer}`, href: c.verifyUrl, note: 'Verifiable' })),
  ...CONTRIBUTIONS.filter((c) => c.kind === 'merged-pr').map((c) => ({ date: c.date, kind: 'Contribution' as Kind, title: `Merged pull request to ${c.project}: ${c.title}`, href: c.href })),
  { date: '2025-11-22', kind: 'Release' as Kind, title: `First of ${CONTRIBUTIONS.filter((c) => c.kind === 'package').length} small open-source packages published (npm and PyPI)`, href: '/work/#open-source' },
].sort((a, b) => (a.date < b.date ? 1 : -1));
