# Jobs CSV Contract

**Date:** 2026-08-07  
**A8-R2** — Single canonical Jobs CSV for Admin + Package  
**Scope:** Vault Ready → `jobs.csv` → Laravel `JobsImporter` (Admin or Package entry)  
**Authoritative code:** `scripts/lib/export/mappings/JobsMapping.js` · `JobsImporter.php`  
**Parent contract:** PatternDesigners `docs/architecture/JOBS_FIELD_CONTRACT.md`

---

## 1. Purpose

This document freezes the **production CSV transport contract** for Jobs.

- Ready Markdown is the editorial source of truth.
- CSV is a **deterministic transport** only — not a second editorial model.
- **`JobsMapping` → `jobs.csv` is the only Jobs import contract.**
- Two entry points share the same apply logic (`JobsImporter` via `ImportEngine`):
  1. **Package:** `php artisan import:package <package-dir>`
  2. **Admin:** `/admin/jobs` upload of the same `jobs.csv` (`JobsVaultCsvImportGateway`)
- Legacy Admin-only column sets (`description`, `status`, `is_active`, `published_at`, …) are **retired**.
- Legacy `JobsCsvImportService` remains out of contract.

---

## 2. Package shape

```
exports/packages/<package_id>/
  jobs.csv
  manifest.json
  export_report.json
  export_report.md
```

| Rule | Detail |
|------|--------|
| Filename | `jobs.csv` exactly |
| Encoding | UTF-8, LF newlines |
| Header row | Required; column order fixed by `JobsMapping.headers()` |
| Row identity | One Ready Job → one CSV row |
| Required cells | `title`, `canonical_id`, `ready_id` non-empty |
| List delimiter | `\|` (pipe); importer also accepts `,` / `;` |
| Links encoding | `key=url\|key=url` (`website`, `instagram`, `linkedin`, `twitter`, `facebook`) |
| Escaping | RFC4180-ish: quote cells containing `,` `"` or newline; `"` → `""` |

CLI:

```bash
node scripts/export/export.js --mode all --type jobs
node scripts/export/preview.js --mode all --type jobs
node scripts/export/smoke-test.js
```

Laravel:

```bash
# Package (sessions + full folder)
php artisan import:package <path-to-package>

# Admin — upload the same jobs.csv at /admin/jobs (Import CSV)
# (or POST /admin/jobs/import)
```

---

## 3. Column contract (50 columns)

Order is part of the contract.

| # | CSV column | Ready / Canonical source | Import (`JobsImporter`) | DB / side-effect | Notes |
|---|------------|--------------------------|-------------------------|------------------|-------|
| 1 | `canonical_id` | FM `canonical_id` | identity / validation | — (not a jobs column) | Required |
| 2 | `ready_id` | Ready package id | `ready_id`, `external_id` | `ready_id` | Required; upsert key |
| 3 | `capture_id` | FM `capture_id` | ignored | — | Capture provenance |
| 4 | `slug` | FM `slug` | `JobSlugService` | `slug` | Platform-reserved; may be empty |
| 5 | `title` | FM `title` | `title` | `title` | Required |
| 6 | `short_title` | FM `short_title` | ignored | — | Candidate; not persisted |
| 7 | `summary` | FM `summary` | fallback → `description` | via compose | Used only if section cols empty |
| 8 | `company` | FM `company` / rel label | `company_name` | `company_name` | Display label |
| 9 | `company_id` | `relationships.company.id` | **ignored** | — | Identity is via slug |
| 10 | `company_slug` | `relationships.company.slug` | Company lookup | `company_id` FK | **Required for apply** |
| 11 | `location` | FM `location` | `location` | `location` | Free-text label |
| 12 | `city` | FM / rel | → label / ref | `location_ref` | |
| 13 | `country` | FM / rel | → label / ref | `location_ref` | |
| 14 | `country_slug` | rel | `location_ref.country_slug` | JSON | |
| 15 | `city_slug` | rel | `location_ref.city_slug` | JSON | |
| 16 | `employment_type` | FM | `employment_type` + normalised `job_type` | both columns | Production taxonomy |
| 17 | `workplace_type` | FM | normalised | `workplace_type` | `remote` \| `hybrid` \| `onsite` |
| 18 | `remote` | FM | → `is_remote` / workplace | `is_remote` | |
| 19 | `experience_level` | FM | `experience_level` | `experience_level` | |
| 20 | `salary` | FM | `salary_raw` | `salary_raw` | Narrative |
| 21 | `pay_min` | FM | `pay_min` | `pay_min` | |
| 22 | `pay_max` | FM | `pay_max` | `pay_max` | |
| 23 | `pay_currency` | FM | uppercased | `pay_currency` | |
| 24 | `pay_type` | FM | lowercased | `pay_type` | |
| 25 | `apply_url` | FM | `apply_url` | `apply_url` | Fallback: `source_url`, then placeholder |
| 26 | `source_url` | FM | `external_link`; apply fallback | `external_link` | |
| 27 | `source` | FM | ignored (forced `vault_export`) | `source` | Session source wins |
| 28 | `capture_method` | FM | ignored | — | Capture provenance |
| 29 | `captured_at` | FM | ignored | — | Capture provenance |
| 30 | `closing_date` | FM | parsed → `expires_at` | `expires_at` | |
| 31 | `published_date` | FM | ignored on create | — | Operational publish separate |
| 32 | `emails` | FM | **ignored** | — | Exported; not imported |
| 33 | `skills` | rel labels / FM | `skill_refs` + mirrored `tags` | JSON | Pipe list |
| 34 | `software` | rel / FM | `software_refs` | JSON | |
| 35 | `types` | rel **slugs** / FM | `type_job` pivot | pivot | Missing type → warn |
| 36 | `markets` | rel **slugs** / FM | `market_refs` | JSON | |
| 37 | `benefits` | body `## Benefits` | narrative in `description` + bullets → tags | `description` / `benefits` | |
| 38 | `benefits_tags` | FM benefits / bullets | `benefits` JSON | `benefits` | Prefer over parsing section |
| 39 | `job_links` | FM object | parsed JSON object | `job_links` | Allowed keys only |
| 40 | `overview` | body `## Overview` | compose → `description` | `description` | |
| 41 | `responsibilities` | body | compose | `description` | |
| 42 | `requirements` | body | compose | `description` | |
| 43 | `how_to_apply` | body | compose | `description` | |
| 44 | `notes` | body | compose | `description` | |
| 45 | `sources` | body | **not** in compose | — | Editorial audit only |
| 46 | `schema_version` | FM | ignored | — | Package/meta |
| 47 | `content_version` | FM | ignored | — | |
| 48 | `editorial_hash` | FM | `editorial_hash` | `editorial_hash` | Change detection |
| 49 | `ready_version` | FM | `ready_version` | `ready_version` | |
| 50 | `ready_at` | FM | ignored | — | Timestamp |

---

## 4. Explicit non-columns (by design)

These Ready / Canonical fields are **not** Jobs CSV columns:

| Field | Reason |
|-------|--------|
| `company_assets`, `logo`, `profile`, `gallery`, `asset_resolution` | Company asset SoT — references live on Company; no binary in Jobs CSV |
| `company_identity` | Editorial identity metadata; identity transport is `company_slug` |
| `state` | Present in JobTemplate; not mapped (gap — see review) |
| `aggregator`, `department`, `hybrid` | Capture candidates; not production Jobs columns |
| Body `## Company`, `## About the Role`, `## Software`, `## Location`, `## About the Company` | Not extracted into CSV columns (gap for prose sections) |
| Operational: lifecycle, visibility, likes, import session | Laravel-owned; never exported |

---

## 5. Taxonomy values (must match production)

| Domain | CSV column | Allowed / expected | Laravel behaviour |
|--------|------------|--------------------|-------------------|
| Employment | `employment_type` | Prefer slug: `full-time`, `part-time`, `contract`, `freelance`, `internship` | Writes raw + normalised `job_type` slug; unknown → warning |
| Workplace | `workplace_type` | `remote`, `hybrid`, `onsite` | Normaliser + `remote` aliases |
| Experience | `experience_level` | `Junior`, `Mid-Weight`, `Senior`, `Director`, `Any` | Stored as string |
| Benefits | `benefits_tags` | Free-text tags (pipe) | JSON array |
| Skills / software | labels | Free-text labels | refs JSON; skills mirrored to `tags` |
| Markets / types | **slugs** | Must exist in Laravel Types where applicable | Types missing → warn; skip link |

Sources of truth: `config/taxonomies.php` (job_types), `JobTaxonomies`, Vault `jobTaxonomies.js` — do not invent parallel vocabularies.

---

## 6. Company identity rule

```
Ready relationships.company.slug  →  CSV company_slug  →  Company::where(slug)  →  jobs.company_id
```

- Importer **does not create** companies.
- Missing / unknown `company_slug` → validation error or map failure (fail closed).
- CSV `company_id` is informational only (Vault ER id); Laravel ignores it.
- Logos / profile / gallery are **Company** assets resolved at API via nested `company`, not Job CSV.

---

## 7. Description composition rule

Importer builds `description` as:

```
overview
+ responsibilities
+ requirements
+ benefits (section text)
+ how_to_apply
+ notes
```

joined with blank lines. If all empty → `summary`. If still empty → `title`.

`sources` body section is **not** included (intentional — editorial audit trail).

---

## 8. Create defaults (operational)

New rows from Vault import:

| Field | Value |
|-------|-------|
| `lifecycle` | `imported` |
| `visibility` | `hidden` |
| `status` | `closed` |
| `is_active` | `false` |
| `published_at` | `null` |
| `source` | `vault_export` (config) |

Publication remains a separate Laravel / Filament step.

---

## 9. Compatibility note (A8-R2)

Admin `/admin/jobs` and `php artisan import:package` both consume this **same** `JobsMapping` CSV via `JobsImporter`.

- Upload `exports/packages/<pkg>/jobs.csv` in Admin, or import the full package directory via CLI.
- Do not invent a second Admin column set.
- Legacy `JobsCsvImportService` remains out of contract.

---

## 10. Versioning

| Item | Value |
|------|-------|
| Export mapping | `JobsMapping` in PD Vault V2 |
| Import | `App\Services\ImportEngine\Importers\JobsImporter` |
| Admin gateway | `JobsVaultCsvImportGateway` |
| Schema alignment | A2-R7 Jobs Field Contract alignment |
| This contract | 2026-08-07 · A8-R2 unified Admin + Package |
