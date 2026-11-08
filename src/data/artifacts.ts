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
const CSN = 'https://github.com/opnsrcntrbtr/codesearchnet-find-and-explain/blob/main';
const LL = 'https://opnsrcntrbtr.github.io/lecture-lens';

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
  codesearchnet: {
    slug: 'codesearchnet',
    name: 'CodeSearchNet Find & Explain',
    caseStudy: '/work/codesearchnet/',
    updated: '2026-11-08',
    brief: {
      problem: 'Keyword search fails when a developer describes intent and the code uses different words; docstrings and code share little vocabulary.',
      users: 'Developers searching unfamiliar Python codebases.',
      job: 'Describe what a function does, see the best matches, and understand each one without reading its body.',
      constraints: [
        'Small enough to fine-tune on a free Colab T4 GPU',
        'Official CodeSearchNet splits, already separated by repository, so test code never leaks into training',
        'Exact search, not approximate, so index error cannot confound the metrics',
        'Both summariser backends get the identical prompt, so they are comparable',
      ],
      nonGoals: ['Languages other than Python', 'Approximate-nearest-neighbour indexing at this corpus size', 'Real developer query logs (none were available)'],
      source: { label: 'REPORT.md §1, §3, §4', href: `${CSN}/REPORT.md` },
    },
    evalSpec: {
      summary: 'Each of 1,000 test queries is ranked against its gold function plus 999 distractors; lexical and zero-shot baselines set the bar, and gains must survive significance tests.',
      dataset: [
        'Official CodeSearchNet Python test split; 393,427 training pairs after filtering and de-duplication',
        'A gold function never ranked counts as a miss (0), not dropped',
        'Summaries scored on 50 test examples with BLEU and BERTScore',
      ],
      metrics: [
        { name: 'MRR', value: '0.815', floor: '0.527 (BM25)' },
        { name: 'Recall@1', value: '0.725', floor: '0.407 (BM25)' },
        { name: 'Recall@10', value: '0.961', floor: '0.747 (BM25)' },
        { name: 'nDCG@10', value: '0.850', floor: '0.574 (BM25)' },
        { name: 'Summary BERTScore F1', value: '0.846', floor: '0.747 (zero-shot)' },
      ],
      rule: 'A claimed gain needs a paired bootstrap (10,000 resamples) and a paired t-test; the 50K-to-393K data gain of +0.022 MRR passed both (p < 0.001), so it is reported as real but small.',
      source: { label: 'REPORT.md §4.3, §5', href: `${CSN}/REPORT.md` },
    },
    metricsTree: {
      northStar: 'The right function appears in the first results and is understood without reading it',
      why: 'Search only helps if the answer is near the top and the developer can judge it quickly.',
      drivers: [
        { name: 'Right function near the top', metric: 'Recall@10 0.961 · MRR 0.815' },
        { name: 'Explanation matches meaning', metric: 'BERTScore F1 0.846' },
      ],
      guardrails: [
        { name: 'Holds up in a bigger search space', metric: 'MRR 0.755 at 4,999 distractors (0.882 at 99)' },
        { name: 'No empty explanations', metric: '1 of 50 empty, replaced with a documented sentinel' },
        { name: 'Realistic queries', metric: 'Docstring queries flagged as likely optimistic' },
      ],
    },
    decisions: [
      { id: 'Data', date: '2026-08-10', title: 'Join two datasets on the GitHub permalink', decision: 'Use CodeSearchNet plus a dataset with curated one-line summaries; 100% join rate on a 20,000-row sample.', why: 'The simpler alternative lacked repository and language metadata, so Python filtering and repo-disjoint splits were impossible.', status: 'Adopted', source: { label: 'REPORT.md §3.1', href: `${CSN}/REPORT.md` } },
      { id: 'Prep', date: '2026-08-10', title: 'Strip docstrings from the code side', decision: 'Remove docstrings from code and truncate query docstrings at the first structured section.', why: 'Leaving them in makes retrieval trivially lexical.', status: 'Adopted', source: { label: 'REPORT.md §3.3', href: `${CSN}/REPORT.md` } },
      { id: 'Index', date: '2026-08-10', title: 'Exact search instead of approximate', decision: 'Brute-force search over normalised embeddings.', why: 'Approximation error would confound the metrics at this corpus size.', status: 'Adopted', source: { label: 'REPORT.md §4.1', href: `${CSN}/REPORT.md` } },
      { id: 'Model', date: '2026-08-10', title: 'Smaller summariser rejected', decision: 'flan-t5-small (80M) dropped for flan-t5-base (250M).', why: 'It could not follow the prompt and degenerated into repeated unknown tokens.', status: 'Rejected', source: { label: 'REPORT.md §4.2', href: `${CSN}/REPORT.md` } },
      { id: 'Next', date: '2026-08-10', title: 'More epochs before more data', decision: 'The next experiment is a 3-epoch run, not a larger corpus.', why: '7.9 times more data added only 0.022 MRR.', status: 'Accepted', source: { label: 'REPORT.md §5.3', href: `${CSN}/REPORT.md` } },
    ],
    launch: {
      status: 'Live demo on Hugging Face Spaces; models and code public',
      shipped: ['Gradio demo with retrieval-only and find-and-explain modes', 'Two public retrieval models (50K and full corpus)', 'Full report with ablation, pool-size sensitivity and error analysis'],
      limits: ['Docstring-as-query bias likely overstates real-world quality', 'Python only; one epoch for every model', 'Summaries scored on 50 examples'],
      next: ['3-epoch fine-tune on the full corpus', 'Evaluation on real developer queries', 'Other languages and an approximate index for larger corpora'],
      source: { label: 'REPORT.md §7, §8', href: `${CSN}/REPORT.md` },
    },
  },
  'lecture-lens': {
    slug: 'lecture-lens',
    name: 'Lecture Lens',
    caseStudy: '/work/lecture-lens/',
    updated: '2026-11-08',
    brief: {
      problem: 'Working professionals in part-time online courses attend recorded lectures and live classes with little time to re-watch either, and cloud note-takers upload course material.',
      users: 'A working professional in a part-time online course, on an Apple silicon Mac.',
      job: 'When I attend a class, I want it captured and turned into material I can trust and will remember, without watching the tooling.',
      constraints: [
        'Everything runs on the Mac; nothing is uploaded',
        'Copy-protected video is never recorded; audio is kept',
        'One user, no Apple Developer certificate',
        'Evaluation must never disrupt a live class',
      ],
      nonGoals: ['Recording everything and filtering later', 'Longer notes and weekly digests', 'Hosted evaluation dashboards'],
      source: { label: 'Roadmap and ADR-002', href: `${LL}/project/roadmap` },
    },
    evalSpec: {
      summary: 'Every prompt or model change can be measured locally, with a judge model that differs from the generator and is itself benchmarked.',
      dataset: [
        'Smoke: 6 fixed cases (2 questions, 2 notes, 2 card sets), about 12 minutes',
        'Full: all cases, scored with DeepEval faithfulness, answer relevancy and G-Eval criteria, over an hour',
        'Judge benchmark on labelled claim and context pairs; synthetic slides with exact answers',
      ],
      metrics: [
        { name: 'Words captured, one measured class', value: '~75%', note: 'Weak spot' },
        { name: 'Bytes uploaded', value: '0' },
        { name: 'Build time for a 90-minute class', value: '~10 min' },
        { name: 'Smoke-eval cases', value: '6' },
      ],
      rule: 'Check what a failure is before fixing the model: the first full baseline failed mostly because the judge penalised a source list it could not see, so only the answer body is scored now.',
      source: { label: 'Evaluation guide', href: `${LL}/guides/evaluation` },
    },
    metricsTree: {
      northStar: 'Classes captured and turned into notes and cards the learner trusts and reviews',
      why: 'Capture that misses the class, or notes the learner cannot trust, make the rest useless.',
      drivers: [
        { name: 'Capture completeness', metric: 'Words captured ~75% in one measured class' },
        { name: 'Notes stay faithful', metric: 'DeepEval faithfulness and answer relevancy' },
        { name: 'Cards get reviewed', metric: 'Flashcard review log (planned)' },
      ],
      guardrails: [
        { name: 'Privacy', metric: '0 bytes uploaded' },
        { name: 'Respect protected video', metric: 'Screen capture pauses on DRM players' },
        { name: 'Don’t break a live class', metric: 'Evaluations refuse to run during capture' },
      ],
    },
    decisions: [
      { id: 'ADR-002', date: '2026-09-29', title: 'Native SwiftUI app launches the toolkit', decision: 'A menu-bar app starts capture itself and calls the tools through a JSON contract.', why: 'macOS grants screen recording to the app that launches capture; terminal launches produced 0 frames.', status: 'Accepted', source: { label: 'ADR-002', href: `${LL}/decisions/ADR-002-native-app-integration` } },
      { id: 'ADR-004', date: '2026-09-30', title: 'Pause screen capture on protected video, keep audio', decision: 'Pause capture on listed DRM player pages and build sessions from page markers and the transcript.', why: 'Protected video went black while capture ran; the protection is respected and the transcript is what matters.', status: 'Accepted', source: { label: 'ADR-004', href: `${LL}/decisions/ADR-004-drm-video-black-screen` } },
      { id: 'ADR-005', date: '2026-11-04', title: 'Confirm repeated slides with structural similarity', decision: 'Keep the cheap hash test, then confirm a repeat only if at most 5 of 36 grid cells changed.', why: 'Slides from one template look alike to the hash, so the old test missed most of them (recall 0.17 to 0.58 on synthetic decks); counting changed cells reached recall 1.00. Accepted on synthetic evidence, to confirm on a real build.', status: 'Accepted', source: { label: 'ADR-005', href: `${LL}/decisions/ADR-005-keyframe-ssim` } },
      { id: 'ADR-006', date: '2026-11-05', title: 'Run the language model inside Chrome', decision: 'Add a browser provider: Gemini Nano first, a WebGPU model as fallback; the local model server stays the default.', why: 'The local server costs 20 to 40 GB of weights and a capable Mac; the browser needs neither.', status: 'Accepted', source: { label: 'ADR-006', href: `${LL}/decisions/ADR-006-in-browser-llm` } },
    ],
    launch: {
      status: 'Early, open source; Lecture Lens Studio in MVP',
      shipped: ['SwiftUI menu-bar app over a zsh and Python toolkit', 'Local evaluation harness with a benchmarked judge', 'Three-layer content guard for a public repo', 'Studio MVP: notes, cards and answers inside Chrome'],
      limits: ['macOS on Apple silicon only', 'About a quarter of spoken words missing in one measured class', 'A full evaluation takes over an hour', 'Depends on screenpipe, which it does not control'],
      next: ['Capture guard that alerts within 60 seconds when nothing is saved', 'Cancellable evaluations that show the change against the last run', 'Eval checks drawn from real failures'],
      source: { label: 'Roadmap', href: `${LL}/project/roadmap` },
    },
  },
};
