---
title: "Evals Are the New PRD: A Guide for Product Managers"
description: "How product managers write AI evaluations instead of static PRDs: build a golden set, choose metrics, set quality gates, with real numbers from a live RAG product."
tldr: "For AI products, the evaluation set is the product spec. A PM should own a golden set of real questions grouped by how the product can fail, pick a handful of metrics that map to user harm, set floors that block releases, and review the test labels as carefully as code. In SEBI Circular RAG, fixing mislabelled test rows moved abstention accuracy from 0.849 to 0.973 — more than any model change."
pubDate: 2026-10-02
updatedDate: 2026-10-02
tags: ["Evals", "Playbook", "RAG"]
readingMinutes: 8
faq:
  - q: "What is an AI evaluation (eval)?"
    a: "An AI evaluation is a repeatable test that scores a model or AI product against a fixed set of examples with known good answers. It reports quality as rates, such as recall or accuracy, so that changes to prompts, models or data can be compared objectively."
  - q: "Why are evals replacing the PRD for AI products?"
    a: "A PRD describes deterministic behaviour, but AI output varies and changes when the model changes. An evaluation set states the expected behaviour as concrete examples and measures how often the product meets it, which makes it a spec that can be run."
  - q: "How many examples does a golden set need?"
    a: "Start with about 50 real examples to get a useful signal, and grow to a few hundred grouped by failure type. SEBI Circular RAG uses 260 adjudicated queries across eight groups. Small sets cannot detect small improvements: with roughly 216 scored queries, differences under about four percentage points are not reliable."
  - q: "Which metrics should a PM track for a RAG product?"
    a: "Track retrieval recall (was the right source found), context recall (did the model receive the evidence), citation recall and precision (are the right sources cited), abstention accuracy (does it refuse when it should), plus latency and cost per answer."
  - q: "What is a quality gate?"
    a: "A quality gate is a minimum score, or floor, for each metric that a release must clear. If a change drops any metric below its floor, it does not ship. Floors should be re-derived when the corpus, model or test set changes."
sources:
  - href: "https://github.com/opnsrcntrbtr/sebi-circular-rag/blob/main/docs/status.md"
    label: "SEBI Circular RAG — project status and evaluation log"
  - href: "https://github.com/opnsrcntrbtr/sebi-circular-rag"
    label: "sebi-circular-rag repository"
  - href: "https://huggingface.co/datasets/opnsrcntrbtrian/sebi-circulars"
    label: "SEBI Circulars dataset on Hugging Face"
---

## What does "evals are the new PRD" mean?

**It means that for an AI product, the most useful specification is a test set you can run, not a document you can read.** A product requirements document says "answers should be accurate and cite sources". An evaluation set contains 260 real questions, the circulars each answer must cite, and the cases where the product must refuse.

The difference matters because AI output is probabilistic. The same question can produce different answers, and a model upgrade can silently change behaviour across the whole product. A written requirement cannot detect that. A test set can, every time it runs. The PM still decides what "good" means, but expresses it as examples and thresholds. Engineering, design and compliance then argue about specific rows instead of adjectives.

## How do I build a golden set?

**Collect real user questions, group them by the ways your product can fail, write down the expected behaviour for each, and have a second reviewer check the labels.**

For SEBI Circular RAG, the set is grouped by eight failure types rather than by topic:

| Group | Questions | What it tests |
|---|---|---|
| Title lookups | 40 | Can it find a circular by name? |
| Paraphrased body text | 60 | Does it work when users don't use SEBI's wording? |
| Numbers and tables | 30 | Can it retrieve limits, dates and thresholds? |
| Lineage and supersession | 40 | Does it know which circular replaced which? |
| Multi-hop | 20 | Can it combine two circulars? |
| Repealed legal basis | 20 | Does it flag circulars resting on repealed regulations? |
| Hard negatives | 40 | Does it refuse near-miss topics such as RBI or GST? |
| Far negatives | 10 | Does it refuse unrelated questions? |

Grouping by failure type tells you where the product is weak, which a single average hides.

## Which metrics should a product manager choose?

**Choose the few metrics that map directly to user harm, and make sure at least one measures when the product should say nothing.** For a retrieval-augmented product, six cover most of the risk.

| Metric | SEBI RAG result | What it tells you |
|---|---|---|
| Recall@10 | 0.943 | The right circular is in the top ten |
| Context recall | 0.916 | The evidence reached the model |
| nDCG@10 | 0.697 | How high the right circular ranks |
| Citation recall | 0.881 | Answers cite what they should |
| Citation precision | 0.194 | How many citations are extra |
| Abstention accuracy | 0.981 | It refuses, or answers, correctly |

These are from the full evaluation on 15 August 2026, run when the corpus held 728 circulars. Publishing the weak number matters as much as the strong ones: citation precision of 0.194 is the product's known gap and the first roadmap item.

## How do quality gates work?

**A quality gate is a floor for each metric that a change must clear before it ships.** In SEBI Circular RAG, six floors are derived from the measured baseline and its variance, stored in a file, and checked on every evaluation run.

Gates make trade-offs explicit. When I raised the number of retrieved passages from five to ten, citation recall rose from 0.772 to 0.888 and citation precision fell from 0.177 to 0.119. Both sides of that trade were visible before the decision, and the floors were re-derived afterwards. Gates also need maintenance: when the corpus doubled to 1,490 circulars, the pipeline was re-run on 15 September 2026 and still cleared every floor. A gate that is never re-derived becomes a number nobody trusts.

## Why is label quality the biggest lever?

**Because a wrong label teaches you the wrong lesson, and it is cheaper to fix than a model.** In this project, abstention accuracy sat at 0.849 and looked like a model problem. Reviewing the failures showed that 19 of 53 "should refuse" rows were mislabelled: the corpus did contain relevant circulars. After relabelling, the same pipeline scored 0.973.

The practical rules that came out of this:

- Review test labels with the same care as a code review.
- Record who labelled each row: human, model, or inherited.
- Never tune the product against rows nobody has checked.
- Treat a surprising score as a question about the test before a question about the model.

## How do I say no to plausible ideas?

**Run each idea as an experiment against the same golden set, decide the pass criteria in advance, and reject anything that does not clear them.** Four reasonable-sounding improvements were rejected this way:

- **HyDE retrieval:** recall@10 moved by −2.3 points (not significant) at 41 times the latency.
- **SPLADE sparse retrieval:** improved nDCG by 0.029 on the main set, then failed a pre-registered check on held-out questions.
- **A newer reranker (Qwen3-Reranker-0.6B):** lower AUROC (0.799 against 0.812), worse precision, twice the latency.
- **Fine-tuning the embedding model on SEBI text:** no significant gain on any arm.

A rejected experiment with a clear reason is a product decision, and it belongs in the roadmap narrative. See the [SEBI Circular RAG case study](/sebi-rag/) for the full decision table, and [What is AI-native product management?](/articles/what-is-ai-native-product-management/) for the wider context.

## What should I do this week?

**Write 50 examples for one feature and score your current product against them.**

1. Pull 50 real questions from support tickets, search logs or user interviews.
2. For each, write the expected answer or the source it must cite.
3. Add at least ten cases where the correct behaviour is to refuse.
4. Run them, score by hand, and record the rates.
5. Agree one floor per metric with engineering.
6. Re-run on every prompt, model or data change.
