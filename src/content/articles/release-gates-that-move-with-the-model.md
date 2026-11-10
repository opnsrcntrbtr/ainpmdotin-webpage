---
title: "Release Gates That Move With the Model"
description: "Builder's notes on AI release gates: why quality floors belong to a model stack, how one swap moved citation recall 0.72 to 0.82, and how to record the stack in the gate."
tldr: "In SEBI Circular RAG, six metric floors gate every change. They are not properties of the data: swapping a stub generator for a real model moved citation recall from 0.723 to 0.817 on an unchanged corpus, and doubling the corpus moved every floor. The fix is to treat a floor as a contract with one stack, record that stack in the gate file, and re-derive floors whenever it changes."
pubDate: 2026-11-08
updatedDate: 2026-11-08
tags: ["Builder's notes", "Evals", "RAG"]
readingMinutes: 6
faq:
  - q: "What is a release gate for an AI product?"
    a: "A set of metric floors, measured on a fixed test set, that a change must clear before it ships. In SEBI Circular RAG there are six: abstention accuracy, recall@10, context recall, citation recall, nDCG@10 and citation precision, measured on 260 adjudicated questions."
  - q: "Why do quality floors go stale?"
    a: "Because they depend on the whole stack. Changing the generator, embedder, corpus size, chunker version or citation margin changes what the system can score, so a floor derived under one stack is not a fair bar for another."
  - q: "How do you keep gates honest?"
    a: "Record the stack the floors were derived under inside the gate file, check it before every comparison, and re-derive the floors when it changes. A model measured against floors from a different stack is not a pass or a fail; it is a category error."
sources:
  - href: "https://github.com/opnsrcntrbtr/sebi-circular-rag/blob/main/docs/project_context.md"
    label: "SEBI Circular RAG — project context: golden set, floors and the model-dependence rule (§7.4)"
  - href: "https://github.com/opnsrcntrbtr/sebi-circular-rag/blob/main/docs/status.md"
    label: "SEBI Circular RAG — evaluation log"
  - href: "https://github.com/opnsrcntrbtr/sebi-circular-rag/blob/main/docs/adr-004-reranker-candidate-reassessment-2026-08.md"
    label: "ADR-004 — reranker adopted below the 10% bar by owner override"
  - href: "https://huggingface.co/spaces/opnsrcntrbtrian/sebi-circular-rag-demo"
    label: "SEBI Circular RAG live demo"
---

## What does the gate look like?

**SEBI Circular RAG ships no change that drops any of six metrics below its floor on a 260-question adjudicated golden set.** The set is stratified by failure type: title lookups, paraphrases, numeric tables, supersession lineage, multi-hop, repealed rules, hard negatives and far negatives. 41 questions should be declined.

| Metric | Floor | Latest |
| --- | --- | --- |
| Abstention accuracy | 0.937 | 0.981 |
| Recall@10 | 0.840 | 0.943 |
| Context recall | 0.819 | 0.916 |
| Citation recall | 0.735 | 0.881 |
| nDCG@10 | 0.593 | 0.697 |
| Citation precision | 0.147 | 0.194 |

The full spec is in the [product artifacts](/work/artifacts/sebi-rag/#eval).

## Why aren't floors a property of the data?

I first treated the floors as facts about the corpus. The evaluation log proved me wrong twice:

- **Swapping the generator** from a stub to a real local model moved citation recall from **0.723 to 0.817** and citation precision from **0.190 to 0.158**, on an unchanged corpus.
- **Doubling the corpus** from 730 to 1,490 circulars moved **every** floor.

Three of the six metrics (citation recall, citation precision, abstention accuracy) depend on generation, so they move whenever the generator does.

## What rule came out of it?

Floors belong to a **stack**: embedder, generator, corpus size, chunker version and citation margin. Change any of them and the floors must be re-derived before comparing anything. Measuring a new model against floors from a different stack isn't a pass or a fail. It's a category error.

## How do you know when a gate is stale?

Write the stack into the gate. The current gate file doesn't carry one yet, so the interlock reports **"unverifiable"** even when every floor holds. That is the right behaviour: it refuses to call a comparison valid when it can't prove the stacks match. Adding the fingerprint is the top item in the [launch notes](/work/artifacts/sebi-rag/#launch).

## When is it right to override a bar?

The project also has a default rule: change a stage only for a 10% measured benefit. A new reranker came in at **+2.42% recall@10 and +6.76% nDCG@10**, with no regression on either. I adopted it anyway and wrote down why in [ADR-004](https://github.com/opnsrcntrbtr/sebi-circular-rag/blob/main/docs/adr-004-reranker-candidate-reassessment-2026-08.md): the gain was consistent, and the 10% bar was my own convention, not a law. An override is fine; an undocumented one isn't.

## What's the product lesson?

**A quality bar is a contract with a specific system.** Record what it was measured on, check that before every comparison, and keep a written trail when you choose to bend it. It's the same idea as [evals as the new PRD](/articles/evals-are-the-new-prd/), applied to release day.
