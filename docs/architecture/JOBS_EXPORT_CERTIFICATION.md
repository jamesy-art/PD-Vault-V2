# Jobs CSV Export Certification

**Date:** 2026-08-07  
**Auditor role:** Senior Systems Architect — Export / Import boundary  
**Subject:** Vault Ready → CSV → Laravel Import → DB → API → Frontend

---

## Overall readiness

# **81 / 100**

| Area | Score | Weight |
|------|------:|-------:|
| CSV contract completeness | 88 | High |
| Core editorial field survival | 90 | High |
| Company identity bridge | 84 | High |
| Asset reference model | 92 | Medium |
| Taxonomy consistency | 88 | High |
| Importer correctness | 85 | High |
| CSV encoding / safety | 92 | Medium |
| API exposure | 88 | Medium |
| Frontend rendering parity | 74 | High |
| Empirical round-trip evidence | 58 | High |
| Ops clarity (single importer path) | 70 | Medium |

---

## Verdict

# **PASS WITH MINOR ACTIONS**

The Jobs CSV Export boundary is certified as the **permanent production transport** from editorial Ready to Laravel — for the core field set, taxonomies, company slug identity, and Company-owned assets.

It is **not** “APPROVED FOR PRODUCTION” as a no-touch claim until:

1. Companies exist in Laravel for every exported `company_slug`, and  
2. At least one real Ready → package → import → FE round-trip is executed and checked.

It is **not** “NOT READY”: export mapping, Import Engine, smoke tests, and A2-R7 alignment demonstrate a coherent, fail-closed pipeline.

It is **not** a clean **PASS**: genuine P1 losses (`emails`, `state`, unused body sections) and empty Ready corpus prevent a perfect score.

---

## Success criteria checklist

| Criterion | Result |
|-----------|--------|
| Every Ready field exports correctly | **Partial** — core yes; state / aggregator / some body sections no |
| CSV contract matches Laravel `JobsImporter` | **Met** for production Vault path |
| Import preserves canonical data | **Met** for mapped columns; emails etc. lost |
| Taxonomies remain consistent | **Met** (with normalisers + warnings) |
| Company identity survives import | **Met** when `company_slug` present + Company exists |
| Asset references remain valid | **Met** (Company SoT; no Job CSV binaries) |
| API exposes expected data | **Met** |
| Frontend renders expected data | **Partial** — core yes; markets/software/types unused |
| No hidden data loss | **Partial** — losses documented, not silent on company_slug |

---

## Certification statement

PatternDesigners may treat:

```
Ready → Export Package (jobs.csv) → import:package (JobsImporter) → Publication
```

as the **canonical Jobs delivery path** from Vault to platform.

Minor actions below must clear before claiming full production certification without caveats. Do **not** redesign the Editorial Pipeline, Ready, Field Contract, Asset Resolution, or Publication to “fix” these issues — prefer small mapping / importer / ops checklist fixes.

---

## Minor actions required

### Before claiming “APPROVED FOR PRODUCTION”

1. Sync Laravel Companies for all Ready job `company_slug`s (logos via Company assets).  
2. Populate Ready → run export → import one package → publish → FE compare vs Ready.  
3. Decide emails: import mapping **or** remove from “supported export” messaging.  
4. Decide state + About-the-Role-class body sections: map into CSV/description **or** enforce Generator section discipline.  
5. Replace empty `apply_url` placeholder with validation failure.  
6. Ops runbook: Vault packages use Import Engine only.

### Optional (P2)

- FE consume API `markets` / `software` / `types`  
- Refresh stale §4 “Missing” cells in platform Field Contract  
- Drop or persist `short_title`

---

## Score rationale (brief)

**Strengths:** 50-column contract is coded and shared; description composition preserves editorial sections; pay/benefits/skills/workplace/employment round-trip through importer; company assets correctly excluded from Jobs CSV; fail-closed company lookup; export smoke PASS.

**Deductions:** Empty Ready corpus (−12 empirical); FE unused taxonomies (−6); emails/state/body gaps (−6); dual importer ops risk (−4); apply_url placeholder (−2).

---

## Sign-off

| Item | Value |
|------|-------|
| Boundary | CSV Export / Import |
| Status | **PASS WITH MINOR ACTIONS** |
| Score | **81 / 100** |
| Next phase | Operations (Ready population, Company sync, first production package) |
| Docs | `JOBS_CSV_EXPORT_REVIEW.md` · `JOBS_CSV_CONTRACT.md` · `JOBS_EXPORT_IMPORT_MATRIX.md` |
