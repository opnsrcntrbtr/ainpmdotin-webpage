// Proof-of-skill matrix: each skill is described in employer language
// (O*NET Generalized Work Activities and NACE Career Readiness Competencies)
// and tied to public evidence anyone can check.
// Framework labels are my own alignment for orientation; they are not an
// endorsement or certification by O*NET, NACE or any framework owner.

export type EvidenceKind = 'Live demo' | 'Open code' | 'Eval results' | 'Publication' | 'Package' | 'Credential' | 'Case study';

export interface Evidence {
  label: string;
  href: string;
  kind: EvidenceKind;
}

export interface Skill {
  id: string;
  name: string;
  /** One sentence, in plain employer language: what I can do. */
  claim: string;
  /** The most important number or fact that backs the claim. */
  proof: string;
  onet: string[];
  nace: string;
  evidence: Evidence[];
}

export const NACE_COMPETENCIES = [
  'Career & Self-Development',
  'Communication',
  'Critical Thinking',
  'Equity & Inclusion',
  'Leadership',
  'Professionalism',
  'Teamwork',
  'Technology',
] as const;

const GH = 'https://github.com/opnsrcntrbtr';

export const SKILLS: Skill[] = [
  {
    id: 'ai-evaluation',
    name: 'AI evaluation design',
    claim: 'Turn a product requirement into a graded test set with metric floors that block a release.',
    proof: '260-query adjudicated golden set; abstention accuracy 0.981 and recall@10 0.943 on SEBI Circular RAG.',
    onet: ['Evaluating Information to Determine Compliance with Standards', 'Analyzing Data or Information'],
    nace: 'Critical Thinking',
    evidence: [
      { label: 'SEBI RAG evaluation log', href: `${GH}/sebi-circular-rag/blob/main/docs/status.md`, kind: 'Eval results' },
      { label: 'Evals are the new PRD', href: '/articles/evals-are-the-new-prd/', kind: 'Publication' },
      { label: 'Lecture Lens local eval harness', href: '/work/lecture-lens/', kind: 'Case study' },
    ],
  },
  {
    id: 'rag-product',
    name: 'Retrieval (RAG) product design',
    claim: 'Design retrieval products that cite sources, track which documents are still in force and refuse when evidence is missing.',
    proof: '1,490 SEBI circulars indexed with supersession-aware citations and as-of-date answers.',
    onet: ['Getting Information', 'Processing Information'],
    nace: 'Technology',
    evidence: [
      { label: 'Live demo on Hugging Face', href: 'https://huggingface.co/spaces/opnsrcntrbtrian/sebi-circular-rag-demo', kind: 'Live demo' },
      { label: 'sebi-circular-rag repository', href: `${GH}/sebi-circular-rag`, kind: 'Open code' },
      { label: 'SEBI circulars dataset (CC-BY-4.0)', href: 'https://huggingface.co/datasets/opnsrcntrbtrian/sebi-circulars', kind: 'Open code' },
      { label: 'PM case study', href: '/sebi-rag/', kind: 'Case study' },
    ],
  },
  {
    id: 'trust-compliance',
    name: 'Trust and compliance by design (India)',
    claim: 'Translate DPDP, RBI FREE-AI, SEBI and MeitY obligations into product controls in the first sprint.',
    proof: 'Regulation radar with dated obligations; abstention and citation controls shipped in a regulated-domain product.',
    onet: ['Evaluating Information to Determine Compliance with Standards', 'Monitoring Processes, Materials, or Surroundings'],
    nace: 'Professionalism',
    evidence: [
      { label: 'India AI regulation for PMs', href: '/articles/india-ai-regulation-for-product-managers/', kind: 'Publication' },
      { label: 'Regulation radar', href: '/guide/#radar', kind: 'Publication' },
      { label: 'SEBI RAG trust principles', href: '/sebi-rag/', kind: 'Case study' },
    ],
  },
  {
    id: 'privacy-security',
    name: 'Privacy and security architecture',
    claim: 'Specify zero-knowledge storage and passkey-based key handling, with a written threat model.',
    proof: 'Published npm library, a DOI-registered preprint and a PWA with 4,139 passing tests (6 Jul 2026).',
    onet: ['Working with Computers', 'Thinking Creatively'],
    nace: 'Technology',
    evidence: [
      { label: 'webauthn-prf-zktv on npm', href: 'https://www.npmjs.com/package/webauthn-prf-zktv', kind: 'Package' },
      { label: 'Preprint (DOI)', href: 'https://doi.org/10.6084/m9.figshare.32915411.v1', kind: 'Publication' },
      { label: 'TrustVault repository', href: `${GH}/TrustVault-PWA`, kind: 'Open code' },
      { label: 'TrustVault case study', href: '/work/trustvault/', kind: 'Case study' },
    ],
  },
  {
    id: 'local-ai',
    name: 'On-device and local AI',
    claim: 'Ship AI features that run on the user’s device so personal data never leaves it.',
    proof: 'Lecture Lens runs transcription, notes and flashcards entirely on a Mac; TrustVault explains password risk with on-device models.',
    onet: ['Working with Computers', 'Updating and Using Relevant Knowledge'],
    nace: 'Technology',
    evidence: [
      { label: 'Lecture Lens docs', href: 'https://opnsrcntrbtr.github.io/lecture-lens/', kind: 'Open code' },
      { label: 'Lecture Lens case study', href: '/work/lecture-lens/', kind: 'Case study' },
    ],
  },
  {
    id: 'product-strategy',
    name: 'AI product strategy and MVP scoping',
    claim: 'Frame the user job, pick the smallest product that proves value and decide what not to build.',
    proof: 'Four open-source products taken from idea to a public demo, package or staging app.',
    onet: ['Developing Objectives and Strategies', 'Making Decisions and Solving Problems'],
    nace: 'Leadership',
    evidence: [
      { label: 'Portfolio', href: '/work/', kind: 'Case study' },
      { label: 'Eight-step playbook', href: '/guide/#playbook', kind: 'Publication' },
      { label: 'What is AI-native PM?', href: '/articles/what-is-ai-native-product-management/', kind: 'Publication' },
    ],
  },
  {
    id: 'program-delivery',
    name: 'Technical program delivery',
    claim: 'Run cross-team delivery of cloud-native platforms with clear scope, risk and release control.',
    proof: 'Day-to-day work on mutual fund AMC products and platforms, backed by PMP and CSM certifications.',
    onet: ['Coordinating the Work and Activities of Others', 'Scheduling Work and Activities'],
    nace: 'Teamwork',
    evidence: [
      { label: 'Credentials', href: '#credentials', kind: 'Credential' },
      { label: 'About Ian Pinto', href: '/about/', kind: 'Case study' },
    ],
  },
  {
    id: 'communicating-quality',
    name: 'Communicating AI quality honestly',
    claim: 'Explain what an AI product does well and badly, in numbers, to non-specialists.',
    proof: 'Case studies publish weak metrics too, such as citation precision 0.194, alongside rejected experiments.',
    onet: ['Communicating with People Outside the Organization', 'Interpreting the Meaning of Information for Others'],
    nace: 'Communication',
    evidence: [
      { label: 'Articles', href: '/articles/', kind: 'Publication' },
      { label: 'Glossary', href: '/glossary/', kind: 'Publication' },
      { label: 'SEBI RAG results, including weak ones', href: '/sebi-rag/', kind: 'Eval results' },
    ],
  },
];

export interface Credential {
  name: string;
  issuer?: string;
  category: 'degree' | 'certification' | 'certificate';
  /** Public verification link (Accredible, Credly, Open Badges 3.0, issuer page). Leave empty until available. */
  verifyUrl?: string;
  skills: string[]; // Skill ids this credential supports
}

export const CREDENTIALS: Credential[] = [
  { name: 'MBA', category: 'degree', skills: ['product-strategy'] },
  { name: 'BE (Information Technology)', category: 'degree', skills: ['privacy-security'] },
  { name: 'Project Management Professional (PMP)', issuer: 'Project Management Institute', category: 'certification', skills: ['program-delivery'] },
  { name: 'Certified ScrumMaster (CSM)', issuer: 'Scrum Alliance', category: 'certification', skills: ['program-delivery'] },
  { name: 'AI Product Management', issuer: 'IIT Kharagpur with upGrad', category: 'certificate', skills: ['product-strategy', 'ai-evaluation'] },
  { name: 'AI Product Management', issuer: 'Indian School of Business (ISB)', category: 'certificate', skills: ['product-strategy'] },
  { name: 'Certified AI and cloud-native engineering', category: 'certificate', skills: ['rag-product', 'local-ai'] },
];

export const credentialSchema = CREDENTIALS.map((c) => ({
  '@type': 'EducationalOccupationalCredential',
  name: c.issuer ? `${c.name} — ${c.issuer}` : c.name,
  credentialCategory: c.category,
  ...(c.issuer ? { recognizedBy: { '@type': 'Organization', name: c.issuer } } : {}),
  ...(c.verifyUrl ? { url: c.verifyUrl } : {}),
}));
