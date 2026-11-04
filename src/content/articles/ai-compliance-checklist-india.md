---
title: "AI Compliance Checklist for Product Teams in India"
description: "A practical AI compliance checklist for Indian product teams: what DPDP, RBI FREE-AI, SEBI's coming AI/ML rules and the IT Rules mean at each stage of building."
tldr: "India has no single AI Act, so compliance is a set of controls you design in: a purpose and consent map under DPDP, a named owner and model inventory for RBI's FREE-AI, human-in-the-loop and a kill switch ahead of SEBI's AI/ML guidelines, and labels on synthetic media under the IT Rules. Build twelve controls across five stages and keep evidence for each."
pubDate: 2026-11-04
updatedDate: 2026-11-04
tags: ["Regulation", "Compliance", "Playbook"]
readingMinutes: 8
faq:
  - q: "Does India have an AI Act?"
    a: "No. As of 4 November 2026 India regulates AI through existing law and sector regulators. MeitY's India AI Governance Guidelines (November 2025) are principles-based, and binding obligations come from the DPDP Act and Rules, the IT Rules and sector regulators such as RBI and SEBI."
  - q: "What is the first AI compliance step for a product team in India?"
    a: "Map every piece of personal data the AI feature touches, including prompts, logs, embeddings and fine-tuning sets, against the purpose you collected it for. The DPDP Act requires consent for a stated purpose, and most later controls depend on this map."
  - q: "When do DPDP consent managers start?"
    a: "Registration of consent managers under Rule 4 of the DPDP Rules, 2025 is scheduled to start on 13 November 2026, and the remaining obligations, including notices, security safeguards and breach reporting, apply from 13 May 2027."
  - q: "Has SEBI issued its AI/ML guidelines?"
    a: "Not as of 4 November 2026, as far as I can find. SEBI consulted in June 2025, and in August 2026 its chairman said the guidelines would require human oversight, kill switches and data controls, with regulated entities accountable for vendor tools too. Check sebi.gov.in for the final circular."
  - q: "What are the penalties under the DPDP Act?"
    a: "Penalties go up to ₹250 crore per instance for the most serious failures, such as not taking reasonable security safeguards to prevent a personal data breach."
sources:
  - href: "https://www.sansalegal.com/post/dpdp-act-2023-and-rules-2025-phased-implementation-timeline-and-business-compliance-deadlines"
    label: "DPDP Act 2023 and Rules 2025 — phased implementation timeline and penalties"
  - href: "https://www.medianama.com/2025/11/223-explained-obligations-role-requirements-consent-managers-dpdp-rules-2025/"
    label: "MediaNama — Consent managers under the DPDP Rules 2025 explained (Nov 2025)"
  - href: "https://rbidocs.rbi.org.in/rdocs/PublicationReport/Pdfs/FREEAIR130820250A24FF2D4578453F824C72ED9F5D5851.PDF"
    label: "RBI — FREE-AI Committee Report (13 Aug 2025)"
  - href: "https://www.sebi.gov.in/reports-and-statistics/reports/jun-2025/consultation-paper-on-guidelines-for-responsible-usage-of-ai-ml-in-indian-securities-markets_94687.html"
    label: "SEBI — Consultation paper on responsible usage of AI/ML (June 2025)"
  - href: "https://www.moneylife.in/article/ai-in-markets-sebi-to-mandate-human-oversight-kill-switches-and-data-controls-says-pandey/81406.html"
    label: "Moneylife — SEBI to mandate human oversight, kill switches and data controls (Aug 2026)"
  - href: "https://www.khaitanco.com/thought-leadership/MeitY-notifies-the-IT-Amendment-Rules-2026"
    label: "Khaitan & Co — MeitY notifies the IT Amendment Rules 2026 (synthetic content)"
  - href: "https://www.lexology.com/library/detail.aspx?g=ffc0c58c-3727-4472-9914-5fa6a33ffffd"
    label: "Lexology — MeitY India AI Governance Guidelines analysis (Nov 2025)"
---

## What does AI compliance mean for a product team in India?

**It means designing a small set of controls into the product from the first sprint, because India regulates AI through existing law and sector regulators rather than one AI Act.** MeitY's [India AI Governance Guidelines](https://www.lexology.com/library/detail.aspx?g=ffc0c58c-3727-4472-9914-5fa6a33ffffd) of November 2025 chose a principles-based approach. The binding obligations come from four places:

| Source | Applies to | Status on 4 Nov 2026 |
|---|---|---|
| [DPDP Act and Rules](https://www.sansalegal.com/post/dpdp-act-2023-and-rules-2025-phased-implementation-timeline-and-business-compliance-deadlines) | Anyone processing personal data in India | Consent managers from 13 Nov 2026; remaining duties from 13 May 2027 |
| [RBI FREE-AI framework](https://rbidocs.rbi.org.in/rdocs/PublicationReport/Pdfs/FREEAIR130820250A24FF2D4578453F824C72ED9F5D5851.PDF) | Banks, NBFCs and other RBI-regulated entities | Published 13 Aug 2025: 7 sutras, 26 recommendations |
| [SEBI AI/ML guidelines](https://www.moneylife.in/article/ai-in-markets-sebi-to-mandate-human-oversight-kill-switches-and-data-controls-says-pandey/81406.html) | Brokers, AMCs and other market intermediaries | Announced Aug 2026; no final circular found |
| [IT Rules amendment](https://www.khaitanco.com/thought-leadership/MeitY-notifies-the-IT-Amendment-Rules-2026) | Products that generate or host synthetic media | In force from 20 Feb 2026 |

This is general information for product teams, not legal advice. Use it to ask your legal and compliance colleagues better questions, earlier.

## What should the checklist cover at each stage?

**Twelve controls across five stages cover what Indian regulators currently expect.** Each control names the evidence to keep, because "we thought about it" is not evidence.

### Discovery

1. **Purpose and data map.** List every piece of personal data the feature touches: prompts, logs, embeddings, fine-tuning sets and outputs. Write the purpose next to each. *Evidence:* a one-page data map. *Why:* DPDP consent is tied to a stated purpose.
2. **Risk tier.** Decide whether the feature affects money, rights or access to services. Higher tiers get stricter controls below. *Evidence:* a tier and a one-line reason. *Why:* RBI's FREE-AI and SEBI's planned framework are both risk-based.

### Design

3. **Consent and notice flow.** Design itemised notices and a consent flow that can interoperate with registered consent managers. *Evidence:* the notice text and flow screens. *Why:* consent manager registration starts on [13 Nov 2026](https://www.medianama.com/2025/11/223-explained-obligations-role-requirements-consent-managers-dpdp-rules-2025/).
4. **Human approval points.** Mark where a person must approve before the AI acts, especially where money moves. *Evidence:* the approval points drawn on the user journey. *Why:* SEBI's chairman said in August 2026 that its guidelines will require humans in the loop.
5. **Explanations users can understand.** Decide what the user sees about why the AI decided something: citations, reasons or a route to a person. *Evidence:* screens and copy. *Why:* "understandable by design" is one of FREE-AI's seven sutras.

### Build

6. **Data minimisation in model inputs.** Keep personal data out of prompts and indexes unless the feature needs it, and log what was sent. *Evidence:* the input filter and a sample log. *Why:* DPDP security safeguards; penalties reach [₹250 crore per instance](https://www.sansalegal.com/post/dpdp-act-2023-and-rules-2025-phased-implementation-timeline-and-business-compliance-deadlines).
7. **Deletion that reaches the index.** Make sure a deletion request removes data from vector stores, caches and evaluation sets, not only the main database. *Evidence:* a deletion test. *Why:* DPDP user rights.
8. **Evaluation with a refusal gate.** Build a golden set that includes questions the AI must refuse, and block releases below the floor. *Evidence:* the evaluation log. My [SEBI Circular RAG](/sebi-rag/) blocks releases on abstention accuracy, which measured 98.1% on 260 queries (15 Aug 2026).

### Launch

9. **Kill switch.** One control that turns the AI feature off and falls back to a safe path, tested before launch. *Evidence:* a runbook and a dated test. *Why:* SEBI has said its guidelines will mandate kill switches.
10. **Synthetic media labels.** Label AI-generated images, video and audio, and set up a takedown path that meets the [3-hour window](https://www.khaitanco.com/thought-leadership/MeitY-notifies-the-IT-Amendment-Rules-2026) (2 hours for non-consensual intimate imagery). *Evidence:* label screenshots and the takedown runbook. *Why:* IT Rules amendment, in force since 20 Feb 2026.

### Run

11. **Model inventory and owner.** Keep a list of every model in production, its version, its vendor and a named owner. Include bought tools. *Evidence:* the inventory. *Why:* FREE-AI recommends an AI inventory, and SEBI has said regulated entities stay accountable for vendor tools.
12. **Breach and incident response.** Know who notifies the Data Protection Board and affected users, and how fast. Re-run evaluations whenever the model changes. *Evidence:* the incident runbook and a re-evaluation log.

## How do the controls map to each rule?

| Control | DPDP | RBI | SEBI* | IT Rules |
|---|---|---|---|---|
| Purpose and data map | ✓ | ✓ | ✓ | |
| Consent and notice flow | ✓ | | | |
| Human approval points | | ✓ | ✓ | |
| Explanations | | ✓ | ✓ | |
| Data minimisation, deletion | ✓ | ✓ | ✓ | |
| Evaluation with refusal gate | | ✓ | ✓ | |
| Kill switch | | ✓ | ✓ | |
| Synthetic media labels | | | | ✓ |
| Model inventory and owner | | ✓ | ✓ | |
| Breach and incident response | ✓ | ✓ | ✓ | ✓ |

RBI means the FREE-AI framework. *SEBI marks requirements its chairman has announced; the final circular is pending.

## Which controls should a team build first?

**Start with the data map, the kill switch and the evaluation gate.** They are cheap, they unblock everything else, and they are useful even if a rule changes. The data map feeds consent, deletion and breach response. The kill switch and evaluation gate are what SEBI's coming guidelines and RBI's framework both point to, and they protect users whatever the regulation says.

Then pick by sector. A lending or payments product should do the FREE-AI items next. A broker or AMC product should prepare human approval points and the inventory before SEBI's final circular arrives. A consumer app that generates media must have labels and takedown in place now.

## What is still uncertain?

**Two things: the exact SEBI requirements and how DPDP consent managers will work in practice.** SEBI [consulted in June 2025](https://www.sebi.gov.in/reports-and-statistics/reports/jun-2025/consultation-paper-on-guidelines-for-responsible-usage-of-ai-ml-in-indian-securities-markets_94687.html) and announced the direction in August 2026, but I found no final circular as of 4 November 2026. Commentary on consent managers also differs on how ready registration will be on 13 November 2026. Build the low-regret controls now, and check the regulator's own site before relying on any summary, including this one.

For the wider picture of each rule, see [India AI regulation for product managers](/articles/india-ai-regulation-for-product-managers/) and the [regulation radar](/guide/#radar).
