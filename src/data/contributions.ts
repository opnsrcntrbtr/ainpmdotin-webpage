// Open-source work beyond Ian's own products: merged pull requests to other projects
// and published packages. Only merged PRs are listed. Counts carry an "as of" date.

export interface Contribution {
  kind: 'merged-pr' | 'package';
  title: string;
  project: string;
  href: string;
  date: string; // merged or first published, ISO
  summary: string;
  stat?: string; // e.g. download count, with its date
  skills: string[];
}

export const contributionsCheckedOn = '2026-11-05';
const W = 'npm downloads, 5 Oct to 3 Nov 2026';
export const CONTRIBUTIONS: Contribution[] = [
  { kind: 'merged-pr', title: 'Fix #563: prevent rationale-node leakage and preserve calls direction', project: 'Graphify-Labs/graphify', href: 'https://github.com/Graphify-Labs/graphify/pull/576', date: '2026-05-02', summary: 'Fixed two bugs that inflated node importance and flipped call directions in a code knowledge-graph tool used with AI coding assistants. Phantom edges in the repro fell from 7 to 0, with 5 new regression tests (441 to 446 passing).', skills: ['ai-evaluation', 'communicating-quality'] },
  { kind: 'merged-pr', title: 'Add inline variant to the Filters component', project: 'o2sdev/openselfservice', href: 'https://github.com/o2sdev/openselfservice/pull/365', date: '2025-12-10', summary: 'Added an inline layout option to a customer-portal UI component, backward compatible with the drawer layout and documented with Storybook stories.', skills: ['program-delivery'] },
  { kind: 'package', title: 'express-swagger-auto', project: 'npm', href: 'https://www.npmjs.com/package/express-swagger-auto', date: '2025-11-22', summary: 'Generates OpenAPI 3.x specs and Swagger UI from Express APIs via decorators, JSDoc and runtime capture. v0.3.2.', stat: `45 ${W}`, skills: ['program-delivery'] },
  { kind: 'package', title: 'chroncraft', project: 'npm', href: 'https://www.npmjs.com/package/chroncraft', date: '2025-11-27', summary: 'Lightweight, tree-shakeable date and time library with time-zone handling. v0.3.0.', stat: `20 ${W}`, skills: ['program-delivery'] },
  { kind: 'package', title: 'express-middleware-chain', project: 'npm', href: 'https://www.npmjs.com/package/express-middleware-chain', date: '2025-12-07', summary: 'Fluent, typed middleware composition for Express with validation, rate limiting and caching. v0.1.0.', stat: `16 ${W}`, skills: ['program-delivery'] },
  { kind: 'package', title: 'password-suite', project: 'npm', href: 'https://www.npmjs.com/package/password-suite', date: '2025-11-27', summary: 'Cryptographically secure password and passphrase generation with strength analysis, on the Web Crypto API. v2.0.1.', stat: `14 ${W}`, skills: ['privacy-security'] },
  { kind: 'package', title: 'express-type-safe-routes', project: 'npm', href: 'https://www.npmjs.com/package/express-type-safe-routes', date: '2025-12-07', summary: 'Type-safe Express routes with Zod inference for params, query, body and responses. v0.1.0.', stat: `8 ${W}`, skills: ['program-delivery'] },
  { kind: 'package', title: 'express-env-validator', project: 'npm', href: 'https://www.npmjs.com/package/express-env-validator', date: '2025-12-08', summary: 'Fail-fast, typed environment configuration checks for Express apps. v0.1.0.', stat: `7 ${W}`, skills: ['privacy-security'] },
  { kind: 'package', title: 'pandera-unified-validator', project: 'PyPI', href: 'https://pypi.org/project/pandera-unified-validator/', date: '2025-11-28', summary: 'Unifies Pydantic record validation with Pandera DataFrame checks across pandas and Polars. v0.1.0.', stat: '11 PyPI downloads in the month to 5 Nov 2026', skills: ['ai-evaluation'] },
];
