# Jobs Editorial Technical Debt

**Date:** 2026-08-07  
**Rule:** Only debt observed in code, staging, corpus, or docs — no invented work.

---

## P0 — Launch blockers (before calling the pipeline “permanent production”)

| ID | Item | Evidence | Action |
|----|------|----------|--------|
| P0-1 | Placeholder logos shared across companies | `home-bargains`, `iliv`, `whistlefish`, `ulster-weavers` `*-logo.webp` identical SHA | Replace with real brand logos via inbox; regenerate |
| P0-2 | Company catalogue missing for active PP brands | Assets exist; no `_ready`/`_staging` company MD → jobs report `new_slug` | Add Company Markdown (name, slug, aliases) for those brands |
| P0-3 | Pipeline docs claim ER + Quality inside generate | `A2-R8-ASSET-RESOLUTION.md`, `A2-R9-…md` vs `MarkdownGenerator.js` | Correct docs to match actual generate + separate CLIs |

These do not break generate, but they **do** break trust in identity/assets for production editorial sign-off.

---

## P1 — Important improvements

| ID | Item | Evidence | Action |
|----|------|----------|--------|
| P1-1 | `employer_careers` / `generic` corpus empty | `tests/source-corpus/{employer,generic,…}` 0 fixtures | Add 3–5 fixtures each |
| P1-2 | Indeed body retains raw headings | Boll staging: `## Full job description` | Tighten Indeed section mapping (cleaner-only) |
| P1-3 | Empty / weak summaries on some LinkedIn jobs | Burberry sample `summary: ''` | Strengthen summary rules where company+title known |
| P1-4 | Company left in some titles | Burberry title still contains `\| Burberry` | C1.4 polish edge case |
| P1-5 | Catalogue data quality (`Nike,`) | `_ready/nike.md` name trailing comma leaks to reports | Fix company frontmatter |
| P1-6 | Mixed logo naming in estate | `logo.webp` vs `<slug>-logo.webp` vs profile logos | Prefer slug-named on next inbox process; no bulk redesign |
| P1-7 | Pay / closing_date weakly covered | Corpus overall.md | Assert fixtures where sources provide data |

---

## P2 — Nice-to-have

| ID | Item | Notes |
|----|------|-------|
| P2-1 | Parallel / batch generate reporting for 5k jobs | Not required now |
| P2-2 | Report line distinguishing “no catalogue” vs “no assets” | UX only |
| P2-3 | ATS-specific cleaners (Greenhouse / Lever / Workday) | Folders exist; no fixtures — only if volume appears |
| P2-4 | Auto-migrate generic `logo.webp` → `<slug>-logo.*` | Cosmetic; A2-R8.2 deliberately avoided |

---

## Explicitly not debt

- Entity Resolution / Quality / Ready as separate CLIs — Track design.
- Aliases living on Company Markdown — correct.
- Missing assets never failing generate — correct.
- 168 corpus UNEXPECTED fields — informational shape emission, not FAIL.
