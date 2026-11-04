// Proof-of-skill matrix: each skill is described in employer language
// (O*NET Generalized Work Activities and NACE Career Readiness Competencies)
// and tied to public evidence anyone can check.
// Framework labels are my own alignment for orientation; they are not an
// endorsement or certification by O*NET, NACE or any framework owner.

export type EvidenceKind = 'Live demo' | 'Open code' | 'Eval results' | 'Publication' | 'Package' | 'Credential' | 'Case study' | 'Contribution';

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
      { label: 'CodeSearchNet retrieval report: baselines, ablation, significance tests', href: 'https://github.com/opnsrcntrbtr/codesearchnet-find-and-explain/blob/main/REPORT.md', kind: 'Eval results' },
      { label: 'Merged fix with 5 regression tests (graphify #576)', href: 'https://github.com/Graphify-Labs/graphify/pull/576', kind: 'Contribution' },
      { label: 'Databricks Generative AI Fundamentals', href: 'https://www.credential.net/46362a83-a223-47bb-a783-1c522b65a1fd', kind: 'Credential' },
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
      { label: 'CodeSearchNet Find & Explain live demo', href: 'https://huggingface.co/spaces/opnsrcntrbtrian/csne-find-and-explain', kind: 'Live demo' },
      { label: 'Fine-tuned retrieval model (MiniLM)', href: 'https://huggingface.co/opnsrcntrbtrian/csne-minilm-retrieval-full-1ep', kind: 'Open code' },
      { label: 'Google Cloud BigQuery skill badges', href: 'https://www.credly.com/users/ian-pinto/badges', kind: 'Credential' },
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
      { label: 'SEBI RAG live demo with supersession-aware citations', href: 'https://huggingface.co/spaces/opnsrcntrbtrian/sebi-circular-rag-demo', kind: 'Live demo' },
      { label: 'SEBI RAG evaluation gate (abstention accuracy 0.981)', href: 'https://github.com/opnsrcntrbtr/sebi-circular-rag/blob/main/docs/status.md', kind: 'Eval results' },
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
      { label: 'password-suite on npm', href: 'https://www.npmjs.com/package/password-suite', kind: 'Package' },
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
      { label: 'Lecture Lens repository', href: 'https://github.com/opnsrcntrbtr/lecture-lens', kind: 'Open code' },
      { label: 'MLX AutoResearch agent (local MLX experiment loop)', href: 'https://github.com/opnsrcntrbtr/mlx-autoresearch-agent', kind: 'Open code' },
      { label: 'Free learning path, module 3: models and cost per task', href: '/learn/#m3', kind: 'Publication' },
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
      { label: 'ISB Product Management certificate', href: 'https://www.credential.net/cc9d4612-76c4-47b7-8c95-d6b81ebe53fe', kind: 'Credential' },
      { label: 'AI product strategy framework for Indian teams', href: '/articles/ai-product-strategy-framework-india/', kind: 'Publication' },
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
      { label: 'All credentials, with verification links', href: '#credentials', kind: 'Credential' },
      { label: 'About Ian Pinto', href: '/about/', kind: 'Case study' },
      { label: 'PMP on Credly (valid to Aug 2027)', href: 'https://www.credly.com/badges/af25e5e0-fabb-42a7-8083-4e4f1b9d9d51/public_url', kind: 'Credential' },
      { label: 'Merged feature in openselfservice (#365)', href: 'https://github.com/o2sdev/openselfservice/pull/365', kind: 'Contribution' },
      { label: 'express-swagger-auto on npm', href: 'https://www.npmjs.com/package/express-swagger-auto', kind: 'Package' },
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
      { label: 'CodeSearchNet case study: limits stated up front', href: '/work/codesearchnet/', kind: 'Case study' },
      { label: 'graphify #576: a fix explained for beginners and experts', href: 'https://github.com/Graphify-Labs/graphify/pull/576', kind: 'Contribution' },
    ],
  },
];

export interface Credential {
  name: string;
  issuer?: string;
  category: 'degree' | 'certification' | 'certificate' | 'badge';
  /** Public verification page (Credly, Accredible, issuer). Leave empty until available. */
  verifyUrl?: string;
  /** 'issuer': issued and hosted by the issuer's platform. 'self-uploaded': a record Ian uploaded himself. */
  verification?: 'issuer' | 'self-uploaded';
  platform?: 'Credly' | 'Accredible';
  issued?: string; // ISO date, from the verification page
  expires?: string; // ISO date, from the verification page
  note?: string;
  skills: string[]; // Skill ids this credential supports
}

// Checked against each verification page on 5 Nov 2026. Credly profile: https://www.credly.com/users/ian-pinto/badges
const CREDLY = 'https://www.credly.com/users/ian-pinto/badges';
export const CREDENTIALS: Credential[] = [
  { name: 'Project Management Professional (PMP)', issuer: 'Project Management Institute', category: 'certification', verifyUrl: 'https://www.credly.com/badges/af25e5e0-fabb-42a7-8083-4e4f1b9d9d51/public_url', verification: 'issuer', platform: 'Credly', issued: '2015-08-21', expires: '2027-08-21', skills: ['program-delivery', 'communicating-quality'] },
  { name: 'Generative AI Overview for Project Managers', issuer: 'Project Management Institute', category: 'badge', verifyUrl: CREDLY, verification: 'issuer', platform: 'Credly', issued: '2023-09-28', skills: ['program-delivery', 'product-strategy'] },
  { name: 'Product Management (Online Executive Certificate Programme)', issuer: 'Indian School of Business (ISB) Executive Education', category: 'certificate', verifyUrl: 'https://www.credential.net/cc9d4612-76c4-47b7-8c95-d6b81ebe53fe', verification: 'issuer', platform: 'Accredible', issued: '2022-04-01', note: 'Programme 29 Nov 2021 to 14 Mar 2022, delivered with Emeritus', skills: ['product-strategy'] },
  { name: 'Academy Accreditation: Generative AI Fundamentals', issuer: 'Databricks Academy', category: 'badge', verifyUrl: 'https://www.credential.net/46362a83-a223-47bb-a783-1c522b65a1fd', verification: 'issuer', platform: 'Accredible', issued: '2023-09-30', skills: ['rag-product', 'ai-evaluation'] },
  { name: 'Build a Data Warehouse with BigQuery (skill badge)', issuer: 'Google Cloud', category: 'badge', verifyUrl: CREDLY, verification: 'issuer', platform: 'Credly', issued: '2024-11-19', skills: ['rag-product'] },
  { name: 'Streaming Analytics into BigQuery (skill badge)', issuer: 'Google Cloud', category: 'badge', verifyUrl: CREDLY, verification: 'issuer', platform: 'Credly', issued: '2024-12-01', skills: ['rag-product'] },
  { name: 'Data Science programme, Course 1', issuer: 'upGrad', category: 'certificate', verifyUrl: 'https://www.credential.net/e9075bc5-d4fb-4546-8933-d0247e45e1b6', verification: 'issuer', platform: 'Accredible', issued: '2020-08-18', note: 'Issued as "DS C18 Course 1 LOA"', skills: ['ai-evaluation'] },
  { name: 'AI Product Management', issuer: 'IIT Kharagpur with upGrad', category: 'certificate', skills: ['product-strategy', 'ai-evaluation'] },
  { name: 'Certified ScrumMaster (CSM)', issuer: 'Scrum Alliance', category: 'certification', skills: ['program-delivery'] },
  { name: 'AWS Cloud Practitioner Essentials', issuer: 'Amazon Web Services', category: 'certificate', verifyUrl: 'https://www.credential.net/93e91ee4-acb1-4b14-b7ac-a452b086712c?username=ianpinto', verification: 'self-uploaded', platform: 'Accredible', note: 'Course completion, ID E-N0539V', skills: ['privacy-security'] },
  { name: 'MBA, Information Technology and Systems Management', issuer: 'NMIMS Global Access School for Continuing Education', category: 'degree', verifyUrl: 'https://www.credential.net/1d9b1ed0-221a-402e-80d2-42848a14d003?username=ianpinto', verification: 'self-uploaded', platform: 'Accredible', note: 'Semester transcripts uploaded by Ian', skills: ['product-strategy'] },
  { name: 'BE (Information Technology)', category: 'degree', skills: ['privacy-security'] },
];

export const credentialSchema = CREDENTIALS.map((c) => ({
  '@type': 'EducationalOccupationalCredential',
  name: c.issuer ? `${c.name} — ${c.issuer}` : c.name,
  credentialCategory: c.category,
  ...(c.issuer ? { recognizedBy: { '@type': 'Organization', name: c.issuer } } : {}),
  ...(c.verifyUrl ? { url: c.verifyUrl } : {}),
  ...(c.issued ? { dateCreated: c.issued } : {}),
  ...(c.expires ? { expires: c.expires } : {}),
}));
