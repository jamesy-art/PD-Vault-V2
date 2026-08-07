# Jobs Editorial Readiness

**Date:** 2026-08-07  
**Companion:** `JOBS_EDITORIAL_PRODUCTION_REVIEW.md`, `JOBS_EDITORIAL_TECHNICAL_DEBT.md`, `JOBS_EDITORIAL_CERTIFICATION.md`

---

## Readiness by stage

| Stage | Ready for daily editorial use? | Ready as permanent production path? | Notes |
|-------|--------------------------------|-------------------------------------|-------|
| Capture / Raw | Yes | Yes | Clipper, paste, PP batch |
| Cleaner | Yes | Yes* | *Add employer_careers corpus |
| Field extraction | Yes | Yes* | *Pay / closing_date thin |
| Editorial identity | Yes | Yes | C1.4 |
| Entity Resolution | N/A in generate | Yes as separate CLI | Promote-path |
| Company Canonical Identity | Yes | Yes* | *Catalogue completeness |
| Asset Resolution | Yes | Yes* | *Naming convergence + real logos |
| Quality | Separate CLI | Yes | Gate for Ready |
| Canonical staging | Yes | Yes | `wiki/jobs/_staging` |
| Ready | Separate CLI | Yes | After Quality + ER + approval |

\* = minor operational actions, not redesign.

---

## Editor checklist (production day)

1. Place Raw under `raw/_jobs/` (or PP dated batch).
2. Optional: drop company logo into `wiki/assets/logos/` named for company.
3. `node scripts/markdown/generate.js --raw-dir raw/_jobs`
4. Open staging package — check title, company, summary, `## Company` preview, generator report identity + assets.
5. If identity says “New Company required” but brand is known: add/fix Company Markdown under `_ready` (name, slug, aliases) and regenerate.
6. When publishing: Resolution → Quality → Ready promote (existing Track CLIs).

---

## Go / no-go for permanent editorial pipeline

| Question | Answer |
|----------|--------|
| Can we stop ad-hoc Markdown rewriting? | **Yes** — generate is the path |
| Can we rely on corpus for cleaner regressions? | **Yes** for LI / Indeed / FU / PP |
| Can Asset Resolution find Nike without `nike-inc`? | **Yes** — A2-R9 |
| Are all staging logos trustworthy? | **Not yet** — replace placeholder packages |
| Is generate alone “Ready”? | **No** — Ready remains a gated promote |

**Permanent editorial generation workflow:** Yes.  
**Permanent end-to-end publish without human/Quality gate:** No (by design).
