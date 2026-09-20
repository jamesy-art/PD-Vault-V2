# Company Import Coverage (A8-R5)

**Date:** 2026-08-07  
**Status:** Audit only  
**Companies export:** Phase 4 — `exports/companies-csv/` (2026-08-04)

---

## Pipeline coverage

| Stage | Count | Evidence |
|-------|------:|----------|
| Vault `wiki/companies/_ready/` | **266** | Directory listing / Phase 4 G1 |
| Vault `wiki/companies/_staging/` | **266** | Mirror cohort (export reads `_ready` only) |
| `companies.csv` unique profile slugs | **266** | `companies-summary.json` `unique_slugs` |
| `companies.csv` total rows | **659** | 266 profile + 393 gallery continuation |
| Laravel `companies` table | **273** | `Company::count()` |

Phase 4 gates G1–G12: **PASS** — every `_ready` company exported (`companies-validation-report.md`).

---

## Explaining count differences

### Ready (266) vs CSV (266 unique)

**Aligned.** Companies CSV is a pure transform of `_ready` Markdown (+ image package). No Ready company was omitted by export validation.

### CSV (266) vs Laravel (273)

Laravel has **7 additional** slugs not in the current Companies CSV:

```
target
urban-outfitters
ripcurl
willow-and-loom-home
threadline-studio
paper-grove-stationery
northshore-textiles
```

These are **extra** operational companies (manual / prior import / other path) — not evidence that Ready companies failed to import.

Name search in Laravel for Home Bargains, Whistlefish, Ulster Weavers, ILIV, Boll, Culp, Lands' End, QVC: **empty**. The eight Job failure slugs are not among the 273 under any nearby name.

---

## What the Companies pipeline does **not** do

| Expectation | Reality |
|-------------|---------|
| Export every Job `company_identity.canonical_slug` | ❌ Only `_ready` Company Markdown |
| Create Company pages from Jobs A2-R9 `new_slug` | ❌ A2-R9 does not create catalogue rows |
| Import provisional Job asset folders as Companies | ❌ Assets ≠ Company Ready |

From `scripts/lib/companyCsvExport/README.md`:

> Pure transform from canonical `_ready` Markdown + Phase 3.75 image package  
> Refuse to write unless Company count = `_ready` (= 266)

---

## Jobs dependency vs Companies coverage

Jobs package `pkg-ac9afd5f69d320bd` emits **13 unique** `company_slug` values:

| In Companies Ready/CSV/Laravel | Provisional Job-only slug |
|--------------------------------|---------------------------|
| burberry, gap, nike, new-look, vera-bradley (5) | boll, culp-inc, home-bargains, iliv, lands-end, qvc-group, ulster-weavers, whistlefish (8) |

Import success for a Job requires the slug to exist in Laravel **before** Jobs import. The Companies pipeline successfully covers the Ready cohort; it does not cover provisional Job employers.

---

## Conclusion

Companies import coverage for the **Ready catalogue** is intact (266 → CSV → Laravel + 7 extras).

Jobs failures for the eight slugs are a **data population / catalogue gap**, not a Companies CSV gate failure and not a Jobs importer defect.
