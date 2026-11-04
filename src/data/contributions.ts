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
export const CONTRIBUTIONS: Contribution[] = [];
