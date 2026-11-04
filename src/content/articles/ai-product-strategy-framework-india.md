---
title: "AI Product Strategy Framework for Indian Teams"
description: "An AI product strategy framework for Indian teams: six questions on user job, AI advantage, data, cost per task in rupees, trust and regulation, and kill criteria."
tldr: "Most AI pilots stall: MIT NANDA's 2025 study found 95% of organisations saw no measurable return on generative AI, and McKinsey's 2026 survey found only 6% of companies attribute 5% or more of EBIT to AI. A good AI product strategy answers six questions before building: which user job, why AI beats today's workflow, what data or rails give you an edge, what each task costs in rupees, what trust and regulation require, and what result would make you stop."
pubDate: 2026-11-04
updatedDate: 2026-11-04
tags: ["Strategy", "AI products", "India"]
readingMinutes: 8
faq:
  - q: "What is an AI product strategy?"
    a: "An AI product strategy is a short, testable plan for where AI creates value in your product, how you will prove it, what it costs per task and what risks you will control. It differs from a normal product strategy because quality is probabilistic, costs scale with use and regulators increasingly expect trust controls from day one."
  - q: "Why do most AI pilots fail to reach production?"
    a: "MIT NANDA's 2025 GenAI Divide study, based on 300+ public AI initiatives, 52 interviews and 153 leader surveys, found 95% of organisations saw no measurable return. It linked the gap mainly to systems that do not learn from feedback or fit real workflows. Unclear success metrics and unmodelled cost are other common causes."
  - q: "How do you decide whether a feature should use AI?"
    a: "Write down today's workflow and its baseline (time, cost, error rate). Use AI only if a small evaluation shows it beats that baseline by a clear margin at an acceptable cost per task and risk. If a rule, a search box or a better form solves the job, ship that instead."
  - q: "What makes AI product strategy different in India?"
    a: "Three things: digital public infrastructure such as UPI, Aadhaar, DigiLocker and Account Aggregator gives AI products identity, consent and payment rails; users expect voice, vernacular and low-bandwidth experiences; and DPDP, RBI FREE-AI and SEBI expectations make consent, audit trails and human oversight strategy questions, not late compliance tasks."
  - q: "What are good kill criteria for an AI product?"
    a: "Decide before launch: for example, stop if the golden-set pass rate stays below the agreed floor after two iterations, if cost per successful task exceeds the value of the task, or if users override the AI in more than a set share of cases. Kill criteria keep pilots from drifting."
sources:
  - href: "https://virtualizationreview.com/articles/2025/08/19/mit-report-finds-most-ai-business-investments-fail-reveals-genai-divide"
    label: "MIT NANDA — The GenAI Divide (2025), summary by Virtualization Review"
  - href: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai"
    label: "McKinsey — The state of AI (survey of 1,719 respondents, fieldwork May–June 2026)"
  - href: "https://telanganatoday.com/ai-skills-feature-in-15-4-per-cent-of-tech-job-descriptions-naukri-report"
    label: "Naukri World AI Day Report 2026 via PTI"
  - href: "https://rbidocs.rbi.org.in/rdocs/PublicationReport/Pdfs/FREEAIR130820250A24FF2D4578453F824C72ED9F5D5851.PDF"
    label: "RBI — FREE-AI Committee Report (August 2025)"
  - href: "https://pair.withgoogle.com/guidebook/"
    label: "Google PAIR — People + AI Guidebook"
---

## Why do so many AI products stall after the pilot?

**Because most teams start with a model, not a measurable job.** MIT NANDA's 2025 *GenAI Divide* study ([summary](https://virtualizationreview.com/articles/2025/08/19/mit-report-finds-most-ai-business-investments-fail-reveals-genai-divide)), drawing on more than 300 public AI initiatives, 52 interviews and 153 senior-leader surveys, found that **95% of organisations saw no measurable return** on generative AI, and only **5% of integrated pilots** were extracting significant value. McKinsey's latest [State of AI survey](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai) (1,719 respondents, fieldwork May–June 2026) found that only **44%** of companies are scaling AI across the enterprise and just **6%** attribute 5% or more of EBIT to it.

The pattern behind both studies is the same: unclear success metrics, systems that do not learn from feedback, and costs nobody modelled. A strategy fixes this by forcing six answers before anyone writes a prompt.

## What are the six questions of an AI product strategy?

| # | Question | Evidence you need | Common failure |
| --- | --- | --- | --- |
| 1 | Which user job, and what is today's baseline? | Time, cost and error rate of the current workflow | Starting from "we need a chatbot" |
| 2 | Why is AI clearly better here? | A 30-item evaluation against the baseline | No baseline, so no way to prove value |
| 3 | What data or rails give us an edge? | Proprietary data, workflow position, DPI integrations | Same model and data as every competitor |
| 4 | What does each task cost in rupees? | Cost per successful task at expected volume | Margins disappear at scale |
| 5 | What do trust and regulation require? | Consent map, audit trail, human approval points | Compliance bolted on before launch |
| 6 | What result would make us stop? | Written kill criteria and a review date | Pilots that never end |

## 1. Which user job, and what is today's baseline?

Name one job a specific user does, and measure how it is done today. "A mutual fund compliance analyst finds the latest SEBI circular on a topic in 20 minutes" (an illustrative figure: measure your own) is a strategy input. "Use AI for compliance" is not. The baseline is what your AI must beat.

## 2. Why is AI clearly better for this job?

Run a small evaluation before committing: **30 real cases**, graded by failure type, comparing the AI answer with today's process. If AI is not clearly better on quality, speed or cost, ship the simpler fix. See [Evals are the new PRD](/articles/evals-are-the-new-prd/) for how to write the test set.

## 3. What data or rails give you an edge?

Models are available to everyone, so the edge comes from elsewhere:

- **Proprietary data:** documents, labelled outcomes and feedback only you hold.
- **Workflow position:** being where the decision is made, not in a separate tab.
- **India's public rails:** UPI, Aadhaar, DigiLocker and Account Aggregator give AI agents identity, consent and payment to act on. The [field guide](/guide/#india) covers the landscape.

## 4. What does each task cost in rupees?

Every AI task has an inference bill. Estimate **cost per successful task** (not per call) at the volume you expect, including retries, retrieval and human review. Compare it with the value of the task. Model choice, context size and caching are strategy decisions because they move this number.

## 5. What do trust and regulation require?

In India, trust is a strategy question. The DPDP Act and Rules make consent and purpose limits product requirements, RBI's FREE-AI framework expects board-approved AI policies and human oversight in regulated entities, and SEBI has signalled AI/ML guidelines with human oversight and kill-switch controls. Decide early where the AI must cite sources, when it must refuse, and where a human approves. My [SEBI Circular RAG case study](/sebi-rag/) shows one way: cited answers and an abstention gate measured at **0.981** accuracy. The [regulation article](/articles/india-ai-regulation-for-product-managers/) lists the dates.

## 6. What result would make you stop?

Write kill criteria before launch, with a review date. For example: stop if the golden-set pass rate stays below the floor after two iterations, if cost per successful task exceeds the task's value, or if users override the AI in more than **30%** of cases. Kill criteria are what separate a strategy from a hope.

## How do you turn the six answers into a roadmap?

Treat each answer as a bet with a metric. Plan in **four- to six-week learning loops**: build the smallest version that tests the riskiest answer, measure it against the evaluation and cost targets, then decide to scale, change or stop. Re-run your evaluations whenever the model underneath changes.

## Where can you practise this?

Module 3 and module 4 of the [free learning path](/learn/) walk through cost per task and trust design with exercises. If you want help applying the framework to a real product, an [AI product strategy consultation](/consult/#ai-product-strategy) is a 30-minute start.
