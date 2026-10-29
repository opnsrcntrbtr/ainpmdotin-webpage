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
}

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
    summary: 'Native macOS app and local-model toolkit for working professionals in online courses, with a local evaluation harness and nothing uploaded.',
    kind: 'Local AI · macOS',
    status: 'Early, open source',
    tags: ['Local AI', 'SwiftUI', 'Evals'],
    links: [
      { label: 'Docs', href: 'https://opnsrcntrbtr.github.io/lecture-lens/' },
      { label: 'GitHub', href: 'https://github.com/opnsrcntrbtr/lecture-lens' },
    ],
  },
];
