// Headline numbers per project, used by the scorecard infographics.
// Every value comes from a dated public source; keep `asOf` and `source` current.

export type Metric =
  | { kind: 'rate'; label: string; value: number; floor?: number; weak?: boolean; display?: string }
  | { kind: 'ratio'; label: string; num: number; den: number; weak?: boolean }
  | { kind: 'stat'; label: string; value: string };

export interface Scorecard {
  title: string;
  asOf: string;
  note?: string;
  source: { label: string; href: string };
  metrics: Metric[];
}

export const SCORECARDS: Record<string, Scorecard> = {
  'sebi-rag': {
    title: 'Quality on 260 adjudicated questions',
    asOf: 'Full evaluation 15 Aug 2026 · gate floors derived 2 Sep 2026',
    note: 'Tick = release floor. Every metric clears its floor; citation precision is the known weak spot.',
    source: { label: 'Evaluation log', href: 'https://github.com/opnsrcntrbtr/sebi-circular-rag/blob/main/docs/status.md' },
    metrics: [
      { kind: 'rate', label: 'Abstention accuracy', value: 0.981, floor: 0.9373 },
      { kind: 'rate', label: 'Recall@10', value: 0.943, floor: 0.8397 },
      { kind: 'rate', label: 'Context recall', value: 0.916, floor: 0.8192 },
      { kind: 'rate', label: 'Citation recall', value: 0.881, floor: 0.7347 },
      { kind: 'rate', label: 'nDCG@10', value: 0.697, floor: 0.5934 },
      { kind: 'rate', label: 'Citation precision', value: 0.194, floor: 0.1466, weak: true },
    ],
  },
  trustvault: {
    title: 'Engineering evidence',
    asOf: 'Project status report, 6 Jul 2026',
    note: 'Self-reported by the project; no independent audit yet.',
    source: { label: 'Project status', href: 'https://github.com/opnsrcntrbtr/TrustVault-PWA/blob/main/docs/status/PROJECT_STATUS.md' },
    metrics: [
      { kind: 'ratio', label: 'Automated tests passing', num: 4139, den: 4142 },
      { kind: 'stat', label: 'Lighthouse PWA score', value: '100' },
      { kind: 'stat', label: 'Encryption on device', value: 'AES-256' },
      { kind: 'stat', label: 'scrypt cost for key wrap', value: 'N=2¹⁷' },
    ],
  },
  'webauthn-prf-zktv': {
    title: 'Library at a glance',
    asOf: 'npm v0.2.0, 5 Jul 2026 · compatibility per README',
    source: { label: 'README', href: 'https://github.com/opnsrcntrbtr/webauthn-prf-zktv' },
    metrics: [
      { kind: 'ratio', label: 'Platforms with WebAuthn PRF', num: 5, den: 6 },
      { kind: 'stat', label: 'Version on npm', value: 'v0.2.0' },
      { kind: 'stat', label: 'Runtime dependency', value: '1' },
      { kind: 'stat', label: 'Wrap schemes', value: '2' },
    ],
  },
  'lecture-lens': {
    title: 'Quality, limits and costs',
    asOf: 'Prototype full eval run, 14 Oct 2026 · project documentation, Oct 2026',
    note: 'Tick = the 3 Oct baseline, before the judge scored the answer body only; same generator and prompt versions. Eval run summaries are in the private prototype; the harness and statistics are public. Transcript completeness is from one measured live class.',
    source: { label: 'Evaluation guide', href: 'https://opnsrcntrbtr.github.io/lecture-lens/guides/evaluation' },
    metrics: [
      { kind: 'rate', label: 'Answers faithful (43 of 43)', value: 1.0, floor: 0.86 },
      { kind: 'rate', label: 'Answers relevant (41 of 43)', value: 0.953, floor: 0.721 },
      { kind: 'rate', label: 'Flashcard quality (10 of 15)', value: 0.667, weak: true },
      { kind: 'rate', label: 'Words captured (one class)', value: 0.75, weak: true, display: '~75%' },
      { kind: 'stat', label: 'Bytes uploaded', value: '0' },
      { kind: 'stat', label: 'Build time, 90-min class', value: '~10 min' },
    ],
  },
  codesearchnet: {
    title: 'Retrieval on 1,000 test queries (1 gold + 999 distractors)',
    asOf: 'Project report, Aug 2026 · official CodeSearchNet Python test split',
    note: 'Tick = baseline (BM25 or zero-shot). Queries are author-written docstrings, which likely overstates real-world search quality.',
    source: { label: 'REPORT.md', href: 'https://github.com/opnsrcntrbtr/codesearchnet-find-and-explain/blob/main/REPORT.md' },
    metrics: [
      { kind: 'rate', label: 'MRR, fine-tuned (BM25 0.527)', value: 0.8151, floor: 0.5272 },
      { kind: 'rate', label: 'Recall@1', value: 0.725, floor: 0.407 },
      { kind: 'rate', label: 'Recall@10', value: 0.961, floor: 0.747 },
      { kind: 'rate', label: 'Summary BERTScore F1 (zero-shot 0.747)', value: 0.8463, floor: 0.7473 },
    ],
  },
};
