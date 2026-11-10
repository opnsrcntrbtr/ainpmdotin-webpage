---
title: "Keeping Private Course Material Out of a Public Repo"
description: "Builder's notes from Lecture Lens: a six-layer content guard with hashed blocked terms, a disabled push URL and CI re-checks, plus the limits I document openly."
tldr: "Lecture Lens is a public repository about a private activity: attending online classes. Its content guard keeps course material, names, recordings, secrets and personal data out with six layers: .gitignore, three git hooks, a publish script as the only push route, and CI. Blocked names are stored only as SHA-256 hashes. It prevents accidents, not intent, and the docs say so."
pubDate: 2026-11-08
updatedDate: 2026-11-08
tags: ["Builder's notes", "Privacy", "Local AI"]
readingMinutes: 5
faq:
  - q: "How do you stop private names from reaching a public repository?"
    a: "Lecture Lens scans every commit, commit message and push for blocked terms stored as SHA-256 hashes, forbidden file types, secrets and personal data. A plain git push is disabled; the only supported route is a publish script that runs the same checks, and CI scans again after every push."
  - q: "Why store blocked terms as hashes?"
    a: "So the repository never spells out the names it must not contain. Hashes keep names out of the text and out of search, but they are not secret: anyone can test a guess against the list."
  - q: "What can a content guard not do?"
    a: "It prevents accidents, not intent. Hooks can be skipped and a push URL typed by hand; CI detects that afterwards, but a public push cannot be recalled. It cannot recognise paraphrase, and it is not legal advice."
sources:
  - href: "https://opnsrcntrbtr.github.io/lecture-lens/project/content-guard"
    label: "Lecture Lens — content guard documentation"
  - href: "https://github.com/opnsrcntrbtr/lecture-lens"
    label: "Lecture Lens repository"
  - href: "https://opnsrcntrbtr.github.io/lecture-lens/decisions/ADR-004-drm-video-black-screen"
    label: "ADR-004 — pause capture on protected video, keep audio"
---

## What's the problem?

**Lecture Lens is a public repository about a private activity.** It turns online classes into transcripts, notes and flashcards on your own Mac. The code is open, but course material, the names of institutions, platforms and people, captured lectures, credentials and personal data must never reach it. One careless commit would publish them for good.

## How do the six layers work?

| Layer | When it runs | What it does |
| --- | --- | --- |
| `.gitignore` | Always | Keeps capture output, decks, recordings, `.env` and eval results out |
| pre-commit hook | Every commit | Scans staged files |
| commit-msg hook | Every commit | Scans the message |
| pre-push hook | Every push | Scans every commit the remote lacks, and the whole tree |
| Publish script | The only supported push | Same checks, then pushes; a plain `git push` fails because its URL is disabled |
| CI | After every push or pull request | Scans the tree and pushed commits again |

The full design is in the [content guard docs](https://opnsrcntrbtr.github.io/lecture-lens/project/content-guard).

## What does it look for?

1. **Blocked terms**, stored only as SHA-256 hashes. Text is lower-cased, split into words, and every run of one to six words is hashed and compared.
2. **A private plaintext list** on your own machine, ignored by git.
3. **Forbidden paths and file types**: lecture output, notes, decks, recordings, databases, `.env`.
4. **Secrets**: private keys, token formats, credential assignments.
5. **Personal data**: home-directory paths and real e-mail addresses.
6. **Files over 1 MB.**

When it stops a commit, it shows the file, line and text, and suggests a generic replacement such as "the institute" or `learn.example.edu`.

## What are its limits?

I wrote these into the docs, because a guard that oversells itself is worse than none:

- **It prevents accidents, not intent.** Hooks can be skipped; CI catches that afterwards, but a public push can't be recalled.
- **Hashes are not secrecy.** Anyone can test a guess against the list.
- **It can't recognise paraphrase.** Judgement is still yours.
- **It isn't legal advice.** It implements a cautious policy: name nothing, quote nothing.

## How does this fit the product's privacy rules?

The guard is one of three privacy decisions in the [product artifacts](/work/artifacts/lecture-lens/): nothing is uploaded, protected video is never recorded ([ADR-004](https://opnsrcntrbtr.github.io/lecture-lens/decisions/ADR-004-drm-video-black-screen)), and the public repo can't leak the private context it was built in.

## What's the product lesson?

**Privacy has to be a property of the workflow, not a promise.** If the only way to publish runs the checks, you don't rely on remembering them. And stating the limits plainly is what makes the rest believable. The [TrustVault case study](/work/trustvault/) applies the same idea to encryption.
