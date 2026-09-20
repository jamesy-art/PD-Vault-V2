# A3-R3 — Deterministic Job Extraction Quality

**Date:** 2026-08-07  
**Scope:** Generate only (`scripts/markdown/generate.js`). No Ready / Export / Import / CSV / frontend contract changes.

## Improvements

| Area | Change |
|------|--------|
| Employer headings | Promote `**Bold:**` / ALL-CAPS perk labels to `##` without renaming |
| Overview meta | Full location + `On-site • Full-time` + engagement; YAML `country` for compact cards |
| Benefits | Broader headings (`What's in it for you`, etc.) + vocab (Cycle2Work, Birthday leave, …) |
| Job Highlights (A3-R4) | `benefits` YAML = tiered highlights (benefits → employment → creative), max 12 |
| Skills / software | Stronger patterns; Illustrator only with tool context (not job-title-only) |
| Apply | `mailto:` first email when no apply URL |
| Website | Infer `https://{email-domain}` into `job_links.website` when missing |

Structured `benefits` / `skills` / `software` / `emails` remain **enrichments**. `job_sections` bodies are never stripped for extraction.

## Validation (Generate)

| Job | Benefits | Skills | Software | Apply | Website | Overview |
|-----|----------|--------|----------|-------|---------|----------|
| New Look | 21 | 15 | Adobe + Pantone/Coloro | Dayforce URL | newlook.com | title + full location + On-site • Full-time + engagement |
| Whistlefish | — (none in source) | 2 | (no title false-positive) | `mailto:…` | whistlefish.com | title + REDRUTH, UK + On-site |
| ILIV | — (none in source) | 8 | AVA + Adobe | `mailto:…` | iliv.co.uk | title + Preston, UK + Full-time |
| Culp | — (none in source) | 9 | EAT CAD + Adobe | Indeed URL | — (no email) | title + Stokesdale, NC, US |

YAML `country` stays populated for compact cards. Employer headings/bullets preserved (e.g. New Look `Whats In It For You`).

## Key files

- `scripts/lib/markdown/editorialVocabularies.js`
- `scripts/lib/markdown/fieldExtractor.js`
- `scripts/lib/markdown/jobSections.js`
- `scripts/lib/markdown/normaliser.js`
