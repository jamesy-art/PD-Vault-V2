# Jobs Export Company Mapping

**Date:** 2026-08-07  
**Status:** ✅ **A8-R4 implemented** — canonical company slug export  
**Mapper:** `scripts/lib/export/mappings/JobsMapping.js`  
**Prior audit:** A8-R3 (`JOBS_COMPANY_SLUG_EXPORT_AUDIT.md`)

---

## Canonical rule

```yaml
company_identity:
  canonical_slug: home-bargains
```

is the **single canonical editorial identity** exported as:

```csv
company_slug
```

`relationships.company` remains relationship metadata only. It must **not** determine the exported identity.

---

## Export priority (A8-R4)

| Priority | Source | Role |
|----------|--------|------|
| 1 | `company_identity.canonical_slug` | **Canonical** (A2-R9) |
| 2 | `relationships.company.slug` | Defensive fallback |
| 3 | `company_assets.slug` | Defensive fallback |
| 4 | blank | No identity available |

Implemented by `resolveCompanySlugForExport(fm)` in `JobsMapping.js`.

---

## Current mapping

| CSV column | Source |
|------------|--------|
| `company` | `fm.company` \|\| `relationships.company.label` |
| `company_id` | `relationships.company.id` (informational; importer ignores) |
| `company_slug` | **`company_identity.canonical_slug`** (then fallbacks above) |

---

## Contract path

```
company_identity.canonical_slug  →  CSV company_slug  →  JobsImporter resolveOrCreateImportedPlaceholder  →  jobs.company_id
```

CSV column names unchanged. JobsImporter creates hidden imported companies when the slug is absent.

---

## Export report

Successful jobs exports include:

```
Company Slug Export

14 / 14 exported

Source

14 company_identity
0 relationships
0 company_assets
0 blank
```

---

## Importer

Reads CSV `company_slug`. Existing company → reuse. Missing company → hidden imported placeholder, then attach the job. Blank/invalid slug still fails closed.
