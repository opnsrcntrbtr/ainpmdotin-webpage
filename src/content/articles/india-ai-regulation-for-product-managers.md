---
title: "India AI Regulation for Product Managers (2026 Guide)"
description: "A product manager's guide to India's AI rules in 2026: DPDP deadlines, RBI FREE-AI, SEBI AI/ML guidelines, MeitY guidance and AI-content labelling, with a checklist."
tldr: "India has no single AI Act. Product teams answer to MeitY's principles-based AI Governance Guidelines, the DPDP Act and Rules (consent managers from 13 November 2026, full compliance by 13 May 2027), IT Rules that require labelling of AI-generated content, RBI's FREE-AI framework for regulated finance, and SEBI's AI/ML guidelines, which were still pending on 2 October 2026."
pubDate: 2026-10-02
updatedDate: 2026-10-02
tags: ["Regulation", "India", "BFSI"]
readingMinutes: 8
faq:
  - q: "Does India have an AI law?"
    a: "No. As of October 2026 India has no standalone AI Act. It relies on MeitY's principles-based India AI Governance Guidelines, existing laws such as the IT Act and the Digital Personal Data Protection Act, and sector regulators including RBI and SEBI."
  - q: "When do the DPDP Rules apply?"
    a: "The DPDP Rules were notified on 14 November 2025 and apply in phases. The Data Protection Board provisions took effect first, the consent manager framework starts on 13 November 2026, and the remaining obligations, including consent, notices, security safeguards and breach reporting, apply from 13 May 2027."
  - q: "What is RBI's FREE-AI framework?"
    a: "FREE-AI is the Reserve Bank of India's Framework for Responsible and Ethical Enablement of AI, published in August 2025. It sets seven guiding principles, or sutras, for AI in regulated financial services: trust, people first, innovation over restraint, fairness and equity, accountability, understandable by design, and safety, resilience and sustainability."
  - q: "Has SEBI issued AI/ML guidelines?"
    a: "Not yet, as of 2 October 2026. SEBI published a consultation paper in June 2025, and in August 2026 its chairman said final guidelines would be issued shortly and would require human-in-the-loop controls, kill-switches and data governance."
  - q: "Do AI-generated images and audio need labels in India?"
    a: "Yes. Amendments to the IT Rules in force from 20 February 2026 require synthetically generated content to carry prominent labels, and audio to carry a prefixed disclosure. Takedown windows were cut to three hours, and to two hours for non-consensual intimate imagery."
sources:
  - href: "https://www.sansalegal.com/post/dpdp-act-2023-and-rules-2025-phased-implementation-timeline-and-business-compliance-deadlines"
    label: "DPDP Act and Rules 2025 — phased implementation timeline"
  - href: "https://en.wikipedia.org/wiki/Digital_Personal_Data_Protection_Rules,_2025"
    label: "Digital Personal Data Protection Rules, 2025"
  - href: "https://rbidocs.rbi.org.in/rdocs/PublicationReport/Pdfs/FREEAIR130820250A24FF2D4578453F824C72ED9F5D5851.PDF"
    label: "RBI FREE-AI Committee Report (August 2025)"
  - href: "https://www.khaitanco.com/thought-leadership/MeitY-notifies-the-IT-Amendment-Rules-2026"
    label: "MeitY IT Amendment Rules 2026 — synthetic content"
  - href: "https://www.sebi.gov.in/reports-and-statistics/reports/jun-2025/consultation-paper-on-guidelines-for-responsible-usage-of-ai-ml-in-indian-securities-markets_94687.html"
    label: "SEBI consultation paper on responsible usage of AI/ML (June 2025)"
  - href: "https://www.indiasnews.net/news/279251495/sebi-to-soon-issue-aiml-guidelines-for-capital-markets-mandate-human-oversight-kill-switch-controls-chairman-pandey"
    label: "SEBI chairman on forthcoming AI/ML guidelines (August 2026)"
  - href: "https://www.lexology.com/library/detail.aspx?g=ffc0c58c-3727-4472-9914-5fa6a33ffffd"
    label: "MeitY AI Governance Guidelines — analysis"
---

> This guide is for orientation. It is not legal advice. Check the primary sources and your counsel before relying on any date or duty.

## Does India have an AI law in 2026?

**No. India regulates AI through principles-based guidelines, existing laws and sector regulators rather than a single AI Act.** For a product manager, that means your duties depend on your domain and the data you touch.

The Ministry of Electronics and IT (MeitY) published the India AI Governance Guidelines in November 2025. They take a "techno-legal" approach: rely on existing law, add targeted rules where harm appears, and let sector regulators lead. Around that sit four things a product team must track: the Digital Personal Data Protection (DPDP) Act and Rules, the IT Rules on AI-generated content, RBI's FREE-AI framework for regulated finance, and SEBI's forthcoming AI/ML guidelines for securities markets. A fintech product can fall under all of them at once.

## What are the key dates?

**The two dates that matter most are 13 November 2026, when DPDP consent managers go live, and 13 May 2027, when full DPDP compliance applies.**

| Date | What happens | Who is affected |
|---|---|---|
| Aug 2025 | RBI publishes FREE-AI framework | Banks, NBFCs, regulated fintech |
| Nov 2025 | MeitY India AI Governance Guidelines | All AI products |
| 14 Nov 2025 | DPDP Rules notified; Data Protection Board provisions active | Anyone processing personal data |
| 20 Feb 2026 | IT Rules amendment on synthetic content in force | Platforms and generative AI products |
| Aug 2026 | SEBI says final AI/ML guidelines are coming shortly | Brokers, AMCs, market intermediaries |
| 13 Nov 2026 | DPDP consent manager framework starts | Consumer products using consent |
| 13 May 2027 | Remaining DPDP obligations apply | Anyone processing personal data |

## What does the DPDP Act require from an AI product?

**It requires valid consent for a stated purpose, clear notices, security safeguards, breach reporting and respect for user rights, with penalties of up to ₹250 crore per instance.**

For AI products the practical questions are specific. What personal data goes into prompts, logs, embeddings and fine-tuning sets? Can you delete it on request, including from a vector index? Is the purpose you collected it for the purpose you are using it for? From 13 November 2026, registered consent managers let people manage consent across services, so consent flows should be built to interoperate. Significant Data Fiduciaries face extra duties. The safest design is to keep personal data out of model inputs unless the feature needs it, and to log what was sent.

## What do RBI and SEBI expect in financial services?

**Both expect accountable humans, explainable outcomes and the ability to stop a model, and RBI has already published its framework.**

RBI's FREE-AI report of August 2025 sets seven principles: trust, people first, innovation over restraint, fairness and equity, accountability, understandable by design, and safety, resilience and sustainability. In product terms: name an owner for each model, keep an inventory, explain decisions that affect customers, and test for bias.

SEBI consulted on responsible AI/ML use in June 2025. In August 2026 its chairman said final guidelines would follow shortly and would require human-in-the-loop controls, kill-switches and data governance. As of 2 October 2026 they had not been issued. Building those three controls now is low-regret. My [SEBI Circular RAG case study](/sebi-rag/) shows one way to design for this: citations on every claim, supersession checks and an abstention gate.

## What are the rules for AI-generated content?

**AI-generated images, video and audio must be clearly labelled, and unlawful content must come down within hours.** The IT Rules amendment in force from 20 February 2026 requires visible labels on synthetic visuals and a spoken disclosure at the start of synthetic audio.

General takedown time fell from 36 hours to three. For non-consensual intimate imagery, including deepfakes, it is two hours. Large social platforms must ask users to declare synthetic content and use technical measures to verify it. If your product generates or hosts media, labelling and a fast takedown path are launch requirements, not later hardening.

## What should a product manager do now?

**Map your data, name owners and build the controls regulators have already signalled.**

1. List every place personal data enters prompts, logs, vector stores and training sets.
2. Check each use against the purpose users consented to.
3. Design consent flows that can work with consent managers before 13 November 2026.
4. Add human approval wherever money or legal rights move.
5. Build a kill-switch and test it.
6. Label AI-generated media and document your takedown process.
7. Keep an evaluation set with refusal cases, as described in [Evals are the new PRD](/articles/evals-are-the-new-prd/).
8. Assign one owner for AI governance across DPDP, RBI, SEBI and MeitY duties.
