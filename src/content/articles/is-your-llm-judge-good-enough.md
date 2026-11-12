---
title: "Is Your LLM Judge Good Enough? Builder's Notes"
description: "Builder's notes from Lecture Lens: four times the LLM judge, not the model, was wrong, why 80% agreement hid a weak judge, and a checklist before a judge gates a release."
tldr: "In Lecture Lens, the biggest quality jumps came from fixing the judge, not the model. Scoring only the answer body raised answer relevancy from 31 to 41 of 43 cases with the same generator and prompts. Counting errored judge calls as failures made one run look like a collapse. A judge that scored 100% on its first benchmark only proved the benchmark was easy. And two judge prompts that both agreed with hand labels 80% of the time had very different Cohen's kappa (0.44 vs 0.29), so the simpler prompt stayed. Measure the judge before you let it gate anything."
pubDate: 2026-11-12
updatedDate: 2026-11-12
tags: ["Builder's notes", "Evaluation", "Local AI"]
readingMinutes: 7
faq:
  - q: "What is an LLM judge?"
    a: "An LLM judge is a language model that scores another model's output against criteria such as faithfulness to sources or relevance to the question. It makes evaluation cheap enough to run on every prompt or model change, but its scores are only as trustworthy as its agreement with careful human labels."
  - q: "Why is percentage agreement not enough to validate a judge?"
    a: "Agreement counts matches but ignores how many would match by chance. If most labels are 'pass', a judge that says 'pass' to everything agrees often and is useless. Cohen's kappa corrects for chance: in Lecture Lens two judge prompts both agreed 80% of the time, but kappa was 0.44 for one and 0.29 for the other."
  - q: "How many test cases do you need?"
    a: "More than most teams use. With 6 cases, 5 passing is anywhere from 44% to 97% at 95% confidence (Wilson interval). Small suites catch collapses, not small changes. Report intervals with every pass rate, and compare runs case by case with McNemar's test."
  - q: "Should the judge be a different model from the generator?"
    a: "Yes. Lecture Lens swaps in a different local model as judge for every run and swaps the generator back afterwards, because a model grading its own output tends to agree with itself."
sources:
  - href: "https://opnsrcntrbtr.github.io/lecture-lens/guides/evaluation"
    label: "Lecture Lens evaluation guide: suites, judge swap, Wilson intervals, McNemar"
  - href: "https://opnsrcntrbtr.github.io/lecture-lens/project/research-basis"
    label: "Lecture Lens research basis: references behind each evaluation method"
  - href: "https://github.com/opnsrcntrbtr/lecture-lens"
    label: "Lecture Lens repository (judge benchmark and statistics tests)"
  - href: "https://arxiv.org/abs/2306.05685"
    label: "Zheng et al. (2023), Judging LLM-as-a-judge with MT-Bench and Chatbot Arena, arXiv:2306.05685"
  - href: "https://doi.org/10.1177/001316446002000104"
    label: "Cohen (1960), A coefficient of agreement for nominal scales"
  - href: "https://github.com/confident-ai/deepeval"
    label: "DeepEval, the open-source evaluation framework used for the metrics"
---

## Why measure the judge at all?

**Because an LLM judge is a model too, and it fails in its own ways.** In [Lecture Lens](/work/lecture-lens/), every change to a prompt or model is scored by a local evaluation: a generator writes answers, notes and flashcards, then a *different* local model scores them with [DeepEval](https://github.com/confident-ai/deepeval) metrics such as faithfulness and answer relevancy. Between late September and early November 2026 the prototype ran more than 20 evaluation suites. Four of the most important findings were about the judge, not the product.

## 1. The judge marked down what it could not see

The first full baseline on 3 October passed only **31 of 43** questions on answer relevancy and **37 of 43** on faithfulness. Reading the failures showed the judge penalising each answer's "Sources used" list, which wasn't in the context it was given.

The fix was one line of harness code: score the answer body only. On 14 October, with the **same generator and the same prompt versions**, relevancy was **41 of 43** and faithfulness **43 of 43**.

| Metric (43 questions) | 3 Oct | 14 Oct | 95% interval, 14 Oct |
| --- | --- | --- | --- |
| Answer relevancy | 31 (72%) | 41 (95%) | 85–99% |
| Faithfulness | 37 (86%) | 43 (100%) | 92–100% |
| Correctness | 39 (91%) | 39 (91%) | 78–96% |

Correctness did not move, which is the tell: the answers didn't get better, the measurement did. **Lesson: read failures before changing the model.**

## 2. Errored calls counted as failures

On 10 October a run reported almost every notes and card case as failing. In fact the judge had errored, on all 15 notes cases and on 13 to 14 of 15 card cases, because another client was using the model server mid-run. An error was being recorded as a fail.

The harness now counts errored metrics separately and refuses to swap models while another client is using the server. **Lesson: "the judge couldn't score it" is a different result from "it failed".**

## 3. A perfect benchmark score meant the benchmark was easy

The judge benchmark is a set of claim-and-context pairs with known labels: is the claim supported or not? On 3 October the local 27-billion-parameter judge scored **100% accuracy** on it. A small dedicated classifier scored **76%** (AUROC 0.86, calibration error 0.08), about 66 times faster (43 ms against 2.9 s per pair).

The tempting reading was "the big judge is perfect". The honest one: the pairs were too easy, with no derived claims and no partial support. That is now the project's first riskiest assumption, and harder pairs come before the judge is allowed to block a release.

## 4. Agreement hid a weak judge prompt

A blind holdout of hand-labelled cases compared two judge prompts. Both agreed with my labels **80%** of the time. The difference showed up in Cohen's kappa, which corrects agreement for chance:

> kappa = (observed agreement − chance agreement) / (1 − chance agreement)

The simpler prompt had kappa **0.44**; the revised one **0.29**. With both at 80% agreement, those kappas imply chance agreement of about 64% and 72%. In other words, the revised prompt's agreement came more from leaning towards the common label. The simpler prompt stayed.

## How sure is any of this?

Not very, and the reports say so. Every pass rate carries a 95% Wilson interval: on the six-case smoke suite, 5 of 6 passing means "somewhere between 44% and 97%". Runs are compared case by case with McNemar's exact test on the cases that flipped. A p-value above 0.05 on a handful of cases usually means "too small to tell", not "no change". The statistics functions are unit-tested against published worked examples.

## A checklist before your judge gates a release

1. **Use a different model as judge** from the one that generated the output.
2. **Give the judge exactly what you want judged.** If it can't see part of the output's context, strip that part or provide the context.
3. **Separate errors from failures** in every report.
4. **Benchmark the judge on hard cases**: derived claims, partial support and near-misses, not just obvious ones.
5. **Report kappa and intervals**, not accuracy or agreement alone.
6. **Hand-label a blind holdout** and re-check agreement when the judge model or prompt changes.
7. **Let the judge inform before it blocks.** Promote it to a gate only when kappa on the holdout is good enough for the cost of a wrong block.

The same discipline underpins the [SEBI Circular RAG](/sebi-rag/) gates and the [evals-first PRD](/articles/evals-are-the-new-prd/). The code for the harness, the judge benchmark and the statistics tests is in the [Lecture Lens repository](https://github.com/opnsrcntrbtr/lecture-lens).
