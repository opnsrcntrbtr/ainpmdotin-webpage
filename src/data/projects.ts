export interface Project {
  slug: string;
  href: string;
  name: string;
  tagline: string;
  summary: string;
  kind: string;
  status: string;
  tags: string[];
  links: { label: string; href: string }[];
  /** Skill ids from src/data/skills.ts that this project proves. */
  skills?: string[];
  /** Last public activity (repo update or release), ISO date, checked on activityCheckedOn. */
  lastActivity?: string;
}

export const activityCheckedOn = '2026-11-05';

export const PROJECTS: Project[] = [
  {
    slug: 'sebi-rag',
    href: '/sebi-rag/',
    name: 'SEBI Circular RAG',
    tagline: 'Cited answers over 1,490 SEBI circulars, or an honest abstention.',
    summary: 'Open-source retrieval-augmented assistant for Indian securities regulation with supersession-aware citations, as-of-date answers and a 260-query evaluation gate.',
    kind: 'AI · RegTech',
    status: 'Live demo',
    tags: ['RAG', 'Evals', 'SEBI'],
    skills: ['ai-evaluation', 'rag-product', 'trust-compliance', 'communicating-quality'],
    lastActivity: '2026-09-16',
    links: [
      { label: 'Live demo', href: 'https://huggingface.co/spaces/opnsrcntrbtrian/sebi-circular-rag-demo' },
      { label: 'GitHub', href: 'https://github.com/opnsrcntrbtr/sebi-circular-rag' },
    ],
  },
  {
    slug: 'trustvault',
    href: '/work/trustvault/',
    name: 'TrustVault PWA',
    tagline: 'A zero-knowledge, offline-first password manager with passkey unlock and on-device AI.',
    summary: 'React 19 progressive web app that encrypts every credential on the device, unlocks with WebAuthn PRF biometrics, and explains password risk with local AI models.',
    kind: 'Security · PWA',
    status: 'Staging',
    tags: ['Zero-knowledge', 'WebAuthn PRF', 'On-device AI'],
    skills: ['privacy-security', 'local-ai', 'program-delivery'],
    lastActivity: '2026-08-02',
    links: [
      { label: 'Staging app', href: 'https://trust-vault-pwa.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/opnsrcntrbtr/TrustVault-PWA' },
    ],
  },
  {
    slug: 'webauthn-prf-zktv',
    href: '/work/webauthn-prf-zktv/',
    name: 'webauthn-prf-zktv + preprint',
    tagline: 'Passkey-derived vault key wrapping as an npm library and a research preprint.',
    summary: 'MIT-licensed TypeScript library that wraps a vault key under a WebAuthn PRF output or a scrypt password, with a threat model, interop vectors and a CC BY 4.0 preprint.',
    kind: 'Security · Research',
    status: 'npm v0.2.0',
    tags: ['Library', 'Cryptography', 'Preprint'],
    skills: ['privacy-security', 'communicating-quality'],
    lastActivity: '2026-07-07',
    links: [
      { label: 'npm', href: 'https://www.npmjs.com/package/webauthn-prf-zktv' },
      { label: 'Preprint (DOI)', href: 'https://doi.org/10.6084/m9.figshare.32915411.v1' },
      { label: 'GitHub', href: 'https://github.com/opnsrcntrbtr/webauthn-prf-zktv' },
    ],
  },
  {
    slug: 'lecture-lens',
    href: '/work/lecture-lens/',
    name: 'Lecture Lens',
    tagline: 'Online lectures into transcripts, slide-linked notes and flashcards, entirely on your Mac.',
    summary: 'Native macOS app, local-model toolkit and an in-browser Studio for working professionals in online courses, with a local evaluation harness and nothing uploaded.',
    kind: 'Local AI · macOS',
    status: 'Early, open source',
    tags: ['Local AI', 'SwiftUI', 'Evals'],
    skills: ['local-ai', 'ai-evaluation', 'product-strategy'],
    lastActivity: '2026-11-06',
    links: [
      { label: 'Docs', href: 'https://opnsrcntrbtr.github.io/lecture-lens/' },
      { label: 'GitHub', href: 'https://github.com/opnsrcntrbtr/lecture-lens' },
    ],
  },
  {
    slug: 'codesearchnet',
    href: '/work/codesearchnet/',
    name: 'CodeSearchNet Find & Explain',
    tagline: 'Search Python code in plain English, then get a one-line explanation of each function.',
    summary: 'Fine-tuned MiniLM retrieval (MRR 0.815 vs BM25 0.527) and a fine-tuned flan-t5 summariser, evaluated on the official CodeSearchNet test split with significance tests.',
    kind: 'AI · Retrieval',
    status: 'Live demo',
    tags: ['Fine-tuning', 'Retrieval', 'Evals'],
    skills: ['ai-evaluation', 'rag-product', 'communicating-quality'],
    lastActivity: '2026-08-13',
    links: [
      { label: 'Live demo', href: 'https://huggingface.co/spaces/opnsrcntrbtrian/csne-find-and-explain' },
      { label: 'GitHub', href: 'https://github.com/opnsrcntrbtr/codesearchnet-find-and-explain' },
      { label: 'Model', href: 'https://huggingface.co/opnsrcntrbtrian/csne-minilm-retrieval-full-1ep' },
    ],
  },
];

/** Experiments: public, early, and labelled honestly. No results are claimed unless published. */
export interface Lab { name: string; href: string; started: string; lastActivity: string; what: string; status: string; skills: string[]; }
export const LABS: Lab[] = [
  { name: 'MLX AutoResearch agent', href: 'https://github.com/opnsrcntrbtr/mlx-autoresearch-agent', started: '2026-08-04', lastActivity: '2026-08-05', what: 'A local agent (Qwen on MLX) edits one training script, trains for 5 minutes on an Apple silicon Mac, and keeps the change only if validation loss improves.', status: 'Harness and loop spec published; no results yet', skills: ['local-ai', 'ai-evaluation'] },
  { name: 'SEBI regulatory knowledge-base agent', href: 'https://github.com/opnsrcntrbtr/sebi-regulatory-knowledge-base-ai-agent', started: '2025-11-27', lastActivity: '2025-11-28', what: 'An agentic RAG toolkit over SEBI regulations in LangChain.js and LangGraph; an early step before SEBI Circular RAG.', status: 'Prototype, superseded', skills: ['rag-product', 'trust-compliance'] },
  { name: 'UPI offline payment PWA (NFC)', href: 'https://github.com/opnsrcntrbtr/UPI-Offline-Payment-PWA-NFC-Based', started: '2025-11-15', lastActivity: '2025-11-28', what: 'Design for offline UPI payments by NFC tap with QR fallback, enforcing UPI Lite limits (Rs 1,000 per payment, Rs 5,000 balance).', status: 'Scaffolding only; payment flows not built', skills: ['trust-compliance', 'privacy-security'] },
  { name: 'GenAI Tasker Lite (Android)', href: 'https://github.com/opnsrcntrbtr/genAI-edge-tasker-lite', started: '2025-09-13', lastActivity: '2026-05-31', what: 'An offline-first Android 14 task manager with on-device semantic search, plus a phased roadmap to real embeddings.', status: 'Educational scaffold', skills: ['local-ai'] },
];
