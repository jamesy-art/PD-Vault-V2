# Jobs Editorial Production Review

**Date:** 2026-08-07  
**Scope:** Raw Markdown → Cleaner → Field Extraction → Editorial Identity → Company Canonical Identity → Asset Resolution → Quality → Canonical → Ready  
**Out of scope:** Export, Import, Publication, Operations  
**Mode:** Review only — no architecture redesign

---

## Executive summary

The Jobs editorial generate path is **deterministic, maintainable, and usable as a daily editor workflow**. Capture → generate → review staging Canonicals is production-grade for the core sources (LinkedIn, Indeed, FashionUnited, Print & Pattern).

Full **Entity Resolution (A4)** and **Quality (A5)** are **separate CLIs**, not stages inside `generate.js`. Ready (`promote.js`) correctly gates on Quality + Resolution + approval. That separation is intentional Track architecture — not a hidden failure — but A2-R8/R9 docs currently overstate what generate runs.

**A7-R1:** Ready now lives at `wiki/jobs/_ready/<editorial-slug>/` (Vault editorial model). Export reads that path. `content/jobs/ready/` is deprecated (migrate via `scripts/ready/migrate-to-wiki-ready.js`). Immutable `ready_id` remains metadata only.

**Verdict:** PASS WITH MINOR ACTIONS (see certification).

---

## 1. Editorial workflow

### What an editor does today

1. Drop Raw into `raw/_jobs/` (clipper Markdown, `*-pp.md`, or Print & Pattern batch).
2. Run `node scripts/markdown/generate.js --raw-dir raw/_jobs`.
3. Review `wiki/jobs/_staging/<editorial-slug>/` (Markdown + generator / cleaner reports).
4. Optionally drop logos in `wiki/assets/logos/` and re-run generate.
5. Separately: Entity Resolution → Quality → Ready promote (`wiki/jobs/_ready/`) when publishing.

### Assessment

| Criterion | Rating | Notes |
|-----------|--------|-------|
| Simplicity | Strong | One generate command for Canonical staging |
| Repeatability | Strong | Deterministic hashes; corpus 100% on asserted fields |
| Consistency | Good | Cleaner dispatch is explicit; PP path documented |
| Maintenance burden | Moderate | Six cleaners; PP batch optional OCR path |
| Manual work | Acceptable | Aliases on Company Markdown; inbox logos; catalogue gaps for some PP brands |

**Daily processing:** Yes — an editor can process tens of jobs/day without architectural friction. Bottlenecks are catalogue completeness and logo authenticity, not generator UX.

---

## 2. Canonical quality

Reviewed staging packages (14 on disk, Aug 2026), including Nike (FashionUnited), Home Bargains / ILIV (Print & Pattern), Burberry (LinkedIn), Boll (Indeed).

### Strengths

- Titles generally human (C1.4) — e.g. Nike “Lead Designer, Tennis Apparel Color Design”
- Summaries present on many PP / FU jobs (`Company is hiring a …`)
- `## Company` logo preview when assets resolve
- YAML includes provenance, identity, assets, field provenance
- Editorial `company` preserved (e.g. `Nike Inc.`) while `company_assets.slug: nike`

### Weak areas (editorial, not architecture)

| Issue | Example |
|-------|---------|
| Empty summary | Burberry LinkedIn sample |
| Company still in title | `Designer, Textiles and Graphics \| Burberry` |
| Raw Indeed headings | Boll retains `## Full job description` |
| Thin section sets | Some jobs: Overview + Sources only |
| Catalogue name leak | Nike report shows `Canonical Company: Nike,` (trailing comma in `_ready/nike.md`) |
| Placeholder logos | Home Bargains / ILIV / Whistlefish / Ulster Weavers share identical webp bytes |

**Production quality:** Good enough for staging review and Ready promotion after human skim; not yet “hands-off publish” without Quality + editor check.

---

## 3. Source cleaners

| Cleaner | Status | Notes |
|---------|--------|-------|
| LinkedIn | Production | Chrome strip, redirect decode; Easy Apply → often no ATS URL |
| Indeed | Production | Sponsored strip; section normalisation incomplete on some clips |
| FashionUnited | Production | Strong FU coverage; employment sometimes sparse |
| Print & Pattern | Production | `-pp.md` + batch OCR path; 26 corpus fixtures |
| Employer Careers | Present | Registered; **0 corpus fixtures** |
| Generic | Fallback | Registered; **0 corpus fixtures** |

**Determinism:** Yes — rule-based, no AI in cleaners.  
**Maintainability:** Good — registry + per-cleaner docs.  
**Extensibility:** Good — new cleaner = register + fixtures.

---

## 4. Field extraction

Corpus (`tests/source-corpus/reports/overall.md`): **52 fixtures, 100% asserted accuracy** (533 PASS / 0 FAIL).

### Strong (asserted)

title, company, location/city/country, employment_type, workplace_type, skills, software, apply_url, emails, source, aggregator

### Weak / sparsely asserted

| Field | Observation |
|-------|-------------|
| `closing_date` | Not asserted (0 PASS) |
| `remote` | Not asserted |
| `pay_*` | Mostly UNEXPECTED / unasserted |
| `summary` | Only 5 asserted PASS; 41 UNEXPECTED (generated but not expected) |
| `job_links` | 52 UNEXPECTED — always emitted shape |
| `benefits` | Thin assertion coverage |

Extraction is reliable where fixtures lock expectations. Pay and closing dates remain the thinnest production surfaces.

---

## 5. Company identity

A2-R9 correctly separates editorial name from canonical slug and feeds A2-R8.

**Confirmed working:** Nike Inc. → `nike`; legal-suffix stripping; alias support on Company Markdown; duplicate slug avoidance when catalogue exists.

**Gaps:**

- Brands with assets but **no** `_ready`/`_staging` company page report `new_slug` / “New Company required” (Home Bargains, ILIV, Whistlefish, Ulster Weavers in current vault).
- Aliases must be maintained on Company pages (correct design; operational discipline required).

---

## 6. Asset Resolution

**Working:** inbox → `<slug>-logo.*`; existing attach; job-relative paths; Obsidian `## Company` preview; missing assets non-blocking; no Job-local binary copies.

**Gaps:** mixed permanent naming (`logo.webp` vs `<slug>-logo.webp` vs `profile/<slug>-logo.*`); placeholder logo packages; profile-heavy estate (≈310 profile-only of ≈317 companies).

---

## 7. Company assets estate

```
wiki/assets/companies/  (~317 dirs)
  logo/     ~7 packages (mixed naming)
  profile/  ~313
  gallery/  common
```

Scalable folder model. Consistency still converging post A2-R8.1/R8.2. Not a redesign issue — operational normalisation over time.

---

## 8. Corpus

| Cleaner | Fixtures |
|---------|---------:|
| print_and_pattern | 26 |
| fashionunited | 10 |
| linkedin | 10 |
| indeed | 6 |
| employer_careers / generic / ATS | 0 |

Regression protection is strong for the four active editorial sources. Missing employer_careers + generic fixtures is the main coverage hole.

---

## 9. Editorial reports

`generator-report.md` now includes cleaner, fields, sections, **Company Canonical Identity**, and **Asset Resolution** (logo status, production/preview, markdown preview). Enough for daily triage.

**Optional (P2):** surface “catalogue missing” vs “assets missing” more explicitly when `new_company_required` and logo still attached from disk.

---

## 10. Scalability

| Volume | Assessment |
|--------|------------|
| 50 | Comfortable |
| 500 | Comfortable (sequential generate; seconds per job) |
| 5,000 | Feasible without redesign; may want batch reporting / parallel generate later (P2) |

No architectural ceiling at editorial volumes.

---

## 11–12. Debt and architecture

See `JOBS_EDITORIAL_TECHNICAL_DEBT.md` and certification. Separation of concerns is clear: generate owns staging Canonicals; ER / Quality / Ready are promote-path stages. Ready workspace is `wiki/jobs/_ready/` (A7-R1). Determinism preserved. Coupling between A2-R9 and A2-R8 is correct (slug handoff).
