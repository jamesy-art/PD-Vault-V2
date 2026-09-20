# A3-R4 — Deterministic Job Highlights Extraction

**Date:** 2026-08-07  
**Scope:** Generate only. YAML key remains `benefits` (Job Highlights). No Ready / Export / Import / CSV / frontend changes.

## Concept

`benefits:` is the Job Highlights enrichment list shown on the Job sidebar card.

| Tier | When | Examples |
|------|------|----------|
| 1 Employee Benefits | Prefer whenever present | Staff Discount, Pension, Flexible Working, Cycle To Work |
| 2 Employment Highlights | If Tier 1 empty | Permanent, In-house, Maternity Cover, Hospitality |
| 3 Creative Opportunities | With Tier 2 when Tier 1 empty | Trade Shows, Product Development, Textile Collections |

Rules: never invent · never duplicate · max **12** · employer `job_sections` body untouched.

## Validation

| Job | Highlights (sample) |
|-----|---------------------|
| New Look | Staff Discount, Flexible Working, Private Pension, Career Development, Cycle To Work, GP Access… |
| Whistlefish | Maternity Cover, Creative Team, In-house, On-site |
| ILIV | Permanent Position, Full-time, Creative Team, Hospitality, Commercial Interiors, Fast-paced Business… |
| Culp | Trade Shows, Customer Presentations, Product Development, Creative Team, Textile Innovation |

## Key files

- `scripts/lib/markdown/editorialVocabularies.js` — `extractJobHighlightsFromBody`
- `scripts/lib/markdown/fieldExtractor.js` — passes employment/workplace into highlights
