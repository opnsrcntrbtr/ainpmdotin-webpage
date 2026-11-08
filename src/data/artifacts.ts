// Product artifacts behind each case study: the PM work, not just the code.
// Every entry summarises the project's own public documents and links to them.
// Metrics trees are Ian's framing of metrics the project already measures.

export interface Src { label: string; href: string }
export interface ArtifactSet {
  slug: string;
  name: string;
  caseStudy: string;
  updated: string; // ISO date the summary was checked against its sources
  brief: { problem: string; users: string; job: string; constraints: string[]; nonGoals: string[]; source: Src };
  evalSpec: { summary: string; dataset: string[]; metrics: { name: string; value?: string; floor?: string; note?: string }[]; rule: string; source: Src };
  metricsTree: { northStar: string; why: string; drivers: { name: string; metric: string }[]; guardrails: { name: string; metric: string }[] };
  decisions: { id: string; date: string; title: string; decision: string; why: string; status: 'Adopted' | 'Accepted' | 'Rejected' | 'Declined' | 'Amended'; source: Src }[];
  launch: { status: string; shipped: string[]; limits: string[]; next: string[]; source: Src };
}

const SEBI = 'https://github.com/opnsrcntrbtr/sebi-circular-rag/blob/main/docs';

export const ARTIFACTS: Record<string, ArtifactSet> = {
  'sebi-rag': {
    slug: 'sebi-rag',
    name: 'SEBI Circular RAG',
    caseStudy: '/sebi-rag/',
    updated: '2026-11-08',
    brief: {
      problem: 'SEBI amends circulars and folds them into master circulars. An answer built on a superseded circular can look right and still be non-compliant, and generic chatbots invent circular numbers.',
      users: 'Compliance officers and product managers at mutual fund AMCs, brokers, depositories, RTAs and fintechs; RegTech builders; Indian legal-NLP researchers.',
      job: 'Find the circular that governs this, show the exact text, say whether it still applies, and make nothing up.',
      constraints: [
        'Local-first on Apple silicon; official SEBI publications are the only authority',
        'When evidence is insufficient, answer "I don’t know based on the available evidence"',
        'One pinned benchmark runtime, model versions and seeds, so results are reproducible',
        'Optimise only validated stages, and only for a measurable benefit (default bar: 10%)',
      ],
      nonGoals: [
        'Legal advice or unsupported legal conclusions',
        'API-only proprietary models that would send SEBI queries to a third party',
        'Targeting the Apple Neural Engine (declined in ADR-003)',
      ],
      source: { label: 'project_context.md §1, §8, §9', href: `${SEBI}/project_context.md` },
    },
    evalSpec: {
      summary: 'A 260-question adjudicated golden set, stratified by failure type, with six release floors. A change that drops any metric below its floor does not ship.',
      dataset: [
        'golden_v7: 260 adjudicated questions; 41 should be declined; 15 ask for the rule as of a date',
        'Strata: 40 title lookups, 60 paraphrases, 30 numeric or table, 40 supersession lineage, 20 multi-hop, 20 repealed basis, 40 hard negatives, 10 far negatives',
        'Adjudicated with a local 35B model, with agreement checks and escalations',
      ],
      metrics: [
        { name: 'Abstention accuracy', value: '0.981', floor: '0.937' },
        { name: 'Recall@10', value: '0.943', floor: '0.840' },
        { name: 'Context recall', value: '0.916', floor: '0.819' },
        { name: 'Citation recall', value: '0.881', floor: '0.735' },
        { name: 'nDCG@10', value: '0.697', floor: '0.593' },
        { name: 'Citation precision', value: '0.194', floor: '0.147', note: 'Known weak spot' },
      ],
      rule: 'Floors belong to the stack, not the corpus: changing the generator, embedder, corpus size, chunker version or citation margin invalidates them, and they must be re-derived before comparing anything.',
      source: { label: 'project_context.md §7.4 and the evaluation log', href: `${SEBI}/status.md` },
    },
    metricsTree: {
      northStar: 'Questions answered correctly with a checkable citation, or honestly declined',
      why: 'In regulation a confident wrong answer costs more than no answer, so "honestly declined" counts as success.',
      drivers: [
        { name: 'Find the right circular', metric: 'Recall@10 0.943 · nDCG@10 0.697' },
        { name: 'Use the right passage', metric: 'Context recall 0.916' },
        { name: 'Cite what was used', metric: 'Citation recall 0.881' },
      ],
      guardrails: [
        { name: 'Decline when evidence is missing', metric: 'Abstention accuracy 0.981' },
        { name: 'Don’t over-cite', metric: 'Citation precision 0.194 (weak)' },
        { name: 'Never cite a forbidden source', metric: 'must_not_cite violation rate' },
      ],
    },
    decisions: [
      { id: 'D1', date: '2026-07-02', title: 'Hybrid retrieval is mandatory', decision: 'Dense (FAISS) plus sparse (BM25) retrieval fused with RRF; a new dense store only on 10% or better evidence.', why: 'The retrieval stage is fixed architecture; the model inside it is replaceable only on measured evidence.', status: 'Amended', source: { label: 'ADR-001', href: `${SEBI}/adr-001-architecture-review-2026-07.md` } },
      { id: 'ADR-002', date: '2026-07-02', title: 'Certainty bands, not probabilities', decision: 'Every answer carries high, medium or low certainty and a reason when it declines; a labelled low-confidence draft only on explicit opt-in.', why: 'Raw model scores are not certainty (a hard negative scored 0.985), and 56 golden items were too few to fit a calibrator.', status: 'Accepted', source: { label: 'ADR-002', href: `${SEBI}/adr-002-certainty-and-advisory.md` } },
      { id: 'ADR-003', date: '2026-07-22', title: 'Apple Neural Engine declined', decision: 'Keep generation on MLX and embeddings and reranking on MPS/MLX.', why: 'The Neural Engine trades speed for energy efficiency and needs a Core ML conversion; a plugged-in server pipeline needs throughput, where MLX on the GPU wins.', status: 'Declined', source: { label: 'ADR-003', href: `${SEBI}/adr-003-ane-declined.md` } },
      { id: 'D2', date: '2026-08-20', title: 'Proprietary API embedder rejected', decision: 'Voyage models rejected as candidates, regardless of benchmark strength.', why: 'API-only service conflicts with local-first and would send SEBI queries to a third party.', status: 'Rejected', source: { label: 'project_context.md §8', href: `${SEBI}/project_context.md` } },
      { id: 'ADR-004', date: '2026-08-24', title: 'New reranker adopted below the 10% bar', decision: 'jina-reranker-v3 adopted by explicit owner override: recall@10 +2.42% and nDCG@10 +6.76% on SEBI data, no regression.', why: 'A consistent, non-regressive gain; the 10% bar was self-imposed, and the override and its reasoning are recorded.', status: 'Adopted', source: { label: 'ADR-004', href: `${SEBI}/adr-004-reranker-candidate-reassessment-2026-08.md` } },
    ],
    launch: {
      status: 'Live demo on Hugging Face; open code and dataset',
      shipped: [
        'Index of 1,490 circulars and 83,752 chunks (15 Sep 2026)',
        'Answers with numbered citations, supersession status and successor circulars',
        'Certainty block and decline reason on every response',
        'Open dataset of SEBI circulars on Hugging Face (CC BY 4.0)',
      ],
      limits: [
        'Citation precision 0.194: answers cite more passages than they need',
        'The armed gate file has no stack fingerprint, so drift is flagged as "unverifiable" until floors are re-derived',
        'English circulars only',
      ],
      next: [
        'Add a stack fingerprint to the gate and re-derive floors on the current chunker',
        'Improve citation precision without losing citation recall',
      ],
      source: { label: 'Evaluation log (status.md)', href: `${SEBI}/status.md` },
    },
  },
};
