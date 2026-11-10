---
title: "More Data or More Epochs? Fine-Tuning Code Search"
description: "Builder's notes from fine-tuning a small code-search model: 7.9x more data added only 0.022 MRR, why baselines and significance tests came first, and what I'd do next."
tldr: "Fine-tuning a small MiniLM encoder on CodeSearchNet lifted mean reciprocal rank from 0.687 (untuned) and 0.527 (BM25) to 0.794 with 50,000 pairs. Training on all 393,427 pairs added just 0.022 more: statistically real (p < 0.001) but small. Most of the gain came early, so the next experiment is more epochs and more realistic queries, not more data."
pubDate: 2026-11-08
updatedDate: 2026-11-08
tags: ["Builder's notes", "Evals", "Retrieval"]
readingMinutes: 6
faq:
  - q: "How much did fine-tuning improve code search?"
    a: "On 1,000 CodeSearchNet Python test queries, each ranked against 999 distractors, mean reciprocal rank rose from 0.527 with BM25 and 0.687 with the untuned encoder to 0.815 after fine-tuning on the full corpus. Recall@10 reached 0.961."
  - q: "Did more training data help?"
    a: "A little. Going from 50,000 to 393,427 training pairs (7.9 times more) added 0.022 MRR. A paired bootstrap gave a 95% interval of 0.012 to 0.032 and a paired t-test p < 0.001, so the gain is real but small."
  - q: "What would you do differently?"
    a: "Test with real developer queries sooner. The evaluation uses docstrings written by the code's own author as queries, which likely overstates real-world quality, and that matters more than the last few points of MRR."
sources:
  - href: "https://github.com/opnsrcntrbtr/codesearchnet-find-and-explain/blob/main/REPORT.md"
    label: "CodeSearchNet Find & Explain — project report (data, methods, ablation, significance tests)"
  - href: "https://huggingface.co/spaces/opnsrcntrbtrian/csne-find-and-explain"
    label: "Live demo on Hugging Face Spaces"
  - href: "https://huggingface.co/opnsrcntrbtrian/csne-minilm-retrieval-full-1ep"
    label: "Fine-tuned retrieval model (full corpus, 1 epoch)"
  - href: "https://arxiv.org/abs/2107.03374"
    label: "Chen et al. (2021), arXiv:2107.03374, cited in the report for the CodeSearchNet data"
---

## What did I build, and what happened?

**I fine-tuned a small sentence-transformer (all-MiniLM-L6-v2) to find Python functions from plain-English descriptions, then measured it against two baselines.** On 1,000 test queries from the official CodeSearchNet split, each ranked against its gold function plus 999 distractors:

| Run | MRR | Recall@1 | Recall@10 |
| --- | --- | --- | --- |
| BM25 (keyword search) | 0.527 | 0.407 | 0.747 |
| MiniLM, untuned | 0.687 | 0.567 | 0.898 |
| MiniLM, fine-tuned on 50,000 pairs | 0.794 | 0.701 | 0.945 |
| MiniLM, fine-tuned on 393,427 pairs | 0.815 | 0.725 | 0.961 |

The full write-up, code and models are public: see the [case study](/work/codesearchnet/) and its [product artifacts](/work/artifacts/codesearchnet/).

## Why did baselines come before fine-tuning?

Without a baseline, "MRR 0.815" means nothing. BM25 tells you how far plain keyword search gets; the untuned encoder tells you how much the model already knows. Fine-tuning earned **+0.128 MRR over the untuned model** and **+0.288 over BM25**. Those deltas are the result, not the headline number.

## Was 7.9 times more data worth it?

Barely. Going from 50,000 to 393,427 pairs added **0.022 MRR**. I didn't want to report noise as progress, so the report runs a paired bootstrap (10,000 resamples) and a paired t-test:

- 95% interval for the MRR gain: **0.012 to 0.032**
- t-test: **p < 0.001**

So the gain is real, and it is small. The model learned most of what it needed from the first 50,000 diverse examples. That changed the next experiment: **more epochs on the same data**, not a bigger corpus.

## What did the evaluation hide?

Two things, both written into the report rather than left out:

1. **Queries are too easy.** They are docstrings written by the same author as the code. Real developers phrase things differently, so real-world quality is probably lower.
2. **The search space matters.** With 99 distractors MRR is 0.882; with 4,999 it falls to 0.755. Recall@10 stays above 0.92, so the right answer is usually still on the first screen.

## Which choices kept the numbers honest?

- **Repository-separated splits**, so functions from one repo never sit on both sides.
- **Docstrings stripped from the code side**, otherwise the task becomes keyword matching.
- **Exact search, not approximate**, so index error can't blur the metrics.
- **A missed gold counts as zero**, never dropped.

## What did it cost?

Very little. The encoder is small enough to fine-tune on a **free Colab T4 GPU**, and the report estimates a 3-epoch run on the full corpus at **about 4.5 hours** on that hardware. The summariser (flan-t5-base, 250M parameters) also runs locally. The expensive part wasn't compute; it was preparing clean, repository-separated data and an evaluation I could trust.

## How would I run this experiment again?

1. **Write the evaluation first**: test split, distractor count, metrics, and how a miss is scored.
2. **Measure two baselines**: keyword search and the untuned model.
3. **Fine-tune on a small slice** (here 50,000 pairs) and measure.
4. **Scale only if the slice leaves a clear gap**, then test the difference for significance.
5. **Stress the result**: grow the search space and note where quality drops.
6. **Write down the biases** in the test set before anyone else finds them.

## What's the product lesson?

For a small model, **the first slice of data buys most of the quality, and evaluation realism is worth more than the last few points.** Before scaling data or compute, I would now spend that effort on a small set of real user queries. I teach the same habit in module 2 of the [free learning path](/learn/#m2).
