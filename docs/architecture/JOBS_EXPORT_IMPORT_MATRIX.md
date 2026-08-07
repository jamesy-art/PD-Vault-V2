# Jobs Export ↔ Import Matrix

**Date:** 2026-08-07  
**Pipeline:** Ready → CSV → `JobsImporter` → DB → API → Frontend  
**Companion:** `JOBS_CSV_CONTRACT.md` · `JOBS_CSV_EXPORT_REVIEW.md`

Legend:

| Symbol | Meaning |
|--------|---------|
| ✓ | Present / survives |
| ◐ | Partial / transformed |
| — | Absent by design or unused |
| ✗ | Loss / gap |

---

## 1. Editorial field coverage

| Editorial field | Ready | CSV | Import | DB | API | Frontend | Verdict |
|-----------------|:-----:|:---:|:------:|:--:|:---:|:--------:|---------|
| `title` | ✓ | ✓ | ✓ | ✓ | ✓ | List + Detail | ✓ |
| `summary` | ✓ | ✓ | ◐ → description fallback | via desc | via desc | via Description | ◐ |
| `short_title` | ✓ | ✓ | ✗ | — | — | — | ✗ unused |
| `company` (label) | ✓ | ✓ | ✓ `company_name` | ✓ | ✓ | Cards + Header | ✓ |
| Canonical company slug | ✓ rel | ✓ `company_slug` | ✓ lookup | `company_id` | `company.slug` | Links + logo nest | ✓ |
| CSV `company_id` | ✓ rel id | ✓ | ✗ ignored | — | — | — | ◐ transport-only |
| `location` | ✓ | ✓ | ✓ | ✓ | ✓ | Details | ✓ |
| `city` | ✓ | ✓ | ◐ into label/ref | `location_ref` | `location_ref` | — (label only) | ◐ |
| `state` | ✓ FM | ✗ | ✗ | — | — | — | ✗ |
| `country` | ✓ | ✓ | ◐ | ref + location | facets | Filter / label | ◐ |
| `country_slug` / `city_slug` | ✓ ER | ✓ | ✓ | `location_ref` | ✓ | — | ✓ stored |
| `workplace_type` | ✓ | ✓ | ✓ | ✓ | ✓ | Mapped; Remote via `is_remote` | ◐ FE |
| `remote` / `is_remote` | ✓ | ✓ | ✓ | ✓ | ✓ | “Remote Friendly” | ✓ |
| `employment_type` | ✓ | ✓ | ✓ + → `job_type` | both | both | Details uses `job_type` | ✓ |
| `experience_level` | ✓ | ✓ | ✓ | ✓ | ✓ | Details | ✓ |
| `salary` | ✓ | ✓ | ✓ `salary_raw` | ✓ | as `salary` | — (FE uses pay_*) | ◐ |
| `pay_min` / `pay_max` | ✓ | ✓ | ✓ | ✓ | ✓ | Salary string | ✓ |
| `pay_currency` / `pay_type` | ✓ | ✓ | ✓ | ✓ | ✓ | Salary + SEO | ✓ |
| `benefits` narrative | ✓ section | ✓ | ◐ compose + bullets | desc + JSON | `benefits` JSON | Benefits card | ✓ |
| `benefits_tags` | ✓ | ✓ | ✓ | `benefits` | ✓ | ✓ | ✓ |
| `skills` | ✓ | ✓ | ✓ refs + `tags` | both | `skills` + `tags` | Essential Skills ← `tags` | ✓ |
| `software` | ✓ | ✓ | ✓ refs | ✓ | ✓ | ✗ unused | ◐ |
| `markets` | ✓ | ✓ | ✓ refs | ✓ | ✓ | ✗ unused | ◐ |
| `types` | ✓ | ✓ slugs | ✓ pivot | pivot | `types[]` | ✗ unused | ◐ |
| `job_links` / social / website | ✓ | ✓ | ✓ | ✓ | ✓ | Online / social | ✓ |
| `emails` | ✓ | ✓ | ✗ | — | — | — | ✗ |
| Contacts (non-email) | via links | via `job_links` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `apply_url` | ✓ | ✓ | ✓ | ✓ | ✓ | Apply | ✓ |
| `closing_date` | ✓ | ✓ | ✓ `expires_at` | ✓ | ✓ | Closing + SEO | ✓ |
| `source` / `source_url` | ✓ | ✓ | ◐ link; source forced | link / vault | — / hidden | — | ◐ |
| `aggregator` | ✓ FM | ✗ | ✗ | — | — | — | ✗ capture |
| Overview / Responsibilities / Requirements / How to Apply / Notes | ✓ | ✓ | ✓ compose | `description` | ✓ | Description | ✓ |
| Benefits section body | ✓ | ✓ | ✓ compose | `description` | via desc | — (tags shown) | ✓ |
| Sources section | ✓ | ✓ | ✗ not composed | — | — | — | ◐ audit-only |
| About the Role | ✓ template | ✗ | ✗ | — | — | — | ✗ |
| About the Company | ✓ template | ✗ | ✗ | — | — | — | ✗ |
| Location section body | ✓ template | ✗ | ✗ | — | — | — | ✗ |
| Software section body | ✓ template | ✗ | ✗ (FM software only) | — | — | — | ✗ |
| Company section (logo embed) | ✓ | ✗ | ✗ | — | via Company | Logo from Company | ✓ by design |
| `company_assets` / logo paths | ✓ | ✗ | ✗ | Company media | Company nest | Logo | ✓ by design |
| `company_identity` | ✓ | ✗ | ✗ | — | — | — | ✓ via slug |
| `editorial_hash` / `ready_id` / `ready_version` | ✓ | ✓ | ✓ | ✓ | hidden | — | ✓ ops |
| `job_tier` | — | ✗ | ✗ | optional | ✓ | List badge | — platform |
| `timezone` | — | ✗ | ✗ | optional | ✓ | Details | — platform |

---

## 2. Asset path (Company — not Jobs CSV)

```
Vault wiki/assets/companies/<slug>/profile/…
        ↓ (Company Markdown / Company import — separate track)
Laravel Company + logo media
        ↓
JobResource.company.logo_*
        ↓
Frontend Job cards / detail header
```

| Check | Result |
|-------|--------|
| Jobs CSV carries binaries | No |
| Jobs CSV carries logo paths | No |
| Profile / gallery remain Company references | Yes |
| Job detail logo source | Nested Company API | Yes |

---

## 3. Company identity path

```
Editorial company name (FM company)
  → A2-R9 company_identity + relationships.company.slug
  → Ready snapshot
  → CSV company_slug (+ company label)
  → JobsImporter Company::where('slug', Str::slug(…))
  → jobs.company_id
  → API company { id, name, slug, logo_* }
  → Frontend
```

| Failure mode | Import behaviour |
|--------------|------------------|
| Empty `company_slug` | Map fails / skip; validate warns |
| Slug not in Laravel | Validation **error** (fail closed) |
| Label-only match | Not supported — slug required |

---

## 4. Taxonomy round-trip

| Taxonomy | Vault | CSV | Laravel | API | FE |
|----------|-------|-----|---------|-----|-----|
| Employment | `employment_type` | same | `employment_type` + `job_type` slug | both | `job_type` display |
| Workplace | `workplace_type` + `remote` | same | normalised + `is_remote` | both | remote boolean primary |
| Experience | `experience_level` | same | same | same | Details |
| Benefits | tags + section | both cols | JSON tags | `benefits` | Benefits card |
| Skills | labels | pipe | refs + tags | both | `tags` |
| Software | labels | pipe | refs | `software` | not rendered |
| Markets | slugs | pipe | refs | `markets` | not rendered |
| Types | slugs | pipe | pivot | `types[]` | not rendered |

---

## 5. API → Frontend consumption (Vault-imported job)

| API field | List card | Detail |
|-----------|-----------|--------|
| `title`, `slug` | ✓ | ✓ |
| `company.name` / `logo_*` | ✓ | ✓ |
| `location`, `is_remote` | location | ✓ |
| `job_type` / employment | type badge | employment display |
| `job_tier` | badge (if set) | — |
| `experience_level` | — | ✓ |
| `pay_*` | — | ✓ salary |
| `benefits` | — | ✓ |
| `tags` | — | Essential Skills |
| `job_links` | — | Online / social |
| `apply_url`, `expires_at` | — | ✓ |
| `description` | — | ✓ |
| `skills` / `software` / `markets` / `types` | — | not bound |
| `salary` (`salary_raw`) | — | not bound (pay_* used) |
| `workplace_type` | — | not shown as own row |

---

## 6. Information-loss summary

### Acceptable (by design)

- Company asset binaries / paths not in Jobs CSV
- `company_identity` blob not exported (slug is the bridge)
- Capture-only: `capture_id`, `capture_method`, `captured_at` not imported
- `sources` section not in public description
- Operational publish fields forced hidden/closed on create
- `job_tier` / `timezone` platform-owned

### Genuine loss / gaps

1. `emails` exported → not imported  
2. `state` never exported  
3. Body sections About the Role / About the Company / Location / Software prose not exported  
4. `short_title` exported → not persisted  
5. `aggregator` never exported  
6. FE does not surface markets / software / types (API has them)  
7. `salary_raw` not used by FE when `pay_*` empty  

---

## 7. Round-trip evidence status

| Evidence | Status |
|----------|--------|
| Export smoke (`scripts/export/smoke-test.js`) | **PASS** |
| Import Engine foundation tests | Present (`ImportEngineFoundationTest`) |
| Live `content/jobs/ready/` corpus | **Empty** (no production Ready package on disk) |
| Live `exports/packages/*/jobs.csv` | **None** at audit time |
| Full Ready → FE visual compare | **Not executed** (blocked on Ready population) |

Code-path certification is possible; empirical production round-trip remains a **launch gate**.
