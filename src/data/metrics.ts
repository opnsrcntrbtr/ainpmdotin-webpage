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
    title: 'Measured limits and costs',
    asOf: 'Project documentation, Oct 2026',
    note: 'Transcript completeness is from one measured live class, against the meeting app’s own transcript.',
    source: { label: 'Docs', href: 'https://opnsrcntrbtr.github.io/lecture-lens/' },
    metrics: [
      { kind: 'rate', label: 'Words captured (one class)', value: 0.75, weak: true, display: '~75%' },
      { kind: 'stat', label: 'Bytes uploaded', value: '0' },
      { kind: 'stat', label: 'Build time, 90-min class', value: '~10 min' },
      { kind: 'stat', label: 'Smoke-eval cases', value: '6' },
    ],
  },
};
