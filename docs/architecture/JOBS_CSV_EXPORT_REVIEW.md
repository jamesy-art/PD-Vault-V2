# Jobs CSV Export Production Review

**Date:** 2026-08-07  
**Role:** Production boundary audit (Ready → CSV → Import → DB → API → Frontend)  
**Constraint:** Do not redesign Editorial Pipeline, Ready, Jobs Field Contract, Publication, Search, or Related Content.

---

## Verdict preview

**PASS WITH MINOR ACTIONS — 81 / 100**

The Vault → CSV → `JobsImporter` boundary is the correct permanent transport. Core editorial fields, taxonomies, company slug identity, and description composition are production-aligned. Remaining issues are genuine field gaps, FE surface incompleteness, and lack of a live Ready round-trip sample — not architectural redesign needs.

Full scorecard: `JOBS_EXPORT_CERTIFICATION.md`.

---

## 1. Boundary under review

```
Ready Markdown
  → CSV Export (JobsMapping)
  → Export Package (jobs.csv + manifest)
  → Laravel Import Engine (JobsImporter)
  → jobs table + refs / pivots
  → JobResource / JobListResource
  → Frontend list + detail
```

Out of scope: Markdown Generator, Source Cleaners, Company Resolution redesign, Asset Resolution redesign, Publication, Search, Related Content.

---

## 2. CSV contract audit

**Authoritative exporter:** `PD Vault V2/scripts/lib/export/mappings/JobsMapping.js` (50 columns).  
**Authoritative importer:** `patterndesignerscom/.../Importers/JobsImporter.php`.  
**Frozen column list:** `JOBS_CSV_CONTRACT.md`.

Findings:

| Check | Result |
|-------|--------|
| Column order stable | Yes |
| Required columns match (`title`, `canonical_id`, `ready_id`) | Yes |
| List encoding (`\|`) | Yes; importer accepts `\|`, `,`, `;` |
| Job links encoding | Yes; importer allows website/instagram/linkedin/twitter/facebook |
| RFC4180 escaping (`csv.js`) | Yes — commas, quotes, multiline |
| Unicode / UTF-8 | Yes |
| Idempotent packages | Yes (checksum / package_id) |
| Export smoke | **PASS** |

**Mismatch risk:** Admin `JobCsvImporter` expects a different schema. Production ops must use `php artisan import:package` only for Vault packages.

---

## 3. Field coverage

See full matrix: `JOBS_EXPORT_IMPORT_MATRIX.md`.

### Survives end-to-end (core)

title, company label, company_slug → company_id, location (+ city/country/slugs into ref), employment → job_type, workplace/remote, experience, salary_raw + pay_*, benefits tags, skills (refs + tags mirror), software refs, market refs, types pivot, job_links, apply_url, closing_date → expires_at, composed description sections, ready_id / editorial_hash.

### Exported but not imported

| Column | Severity |
|--------|----------|
| `emails` | P1 |
| `short_title` | P2 |
| `sources` (body) | P2 (acceptable audit-only) |
| `company_id` (CSV) | P2 (slug is canonical bridge) |
| `capture_*`, `published_date`, FM `source` | P2 / by design |

### In Ready / template but not in CSV

| Field / section | Severity |
|-----------------|----------|
| `state` | P1 |
| `aggregator` | P2 (capture candidate) |
| `department`, `hybrid` | P2 (candidates) |
| Body: About the Role, About the Company, Location, Software prose | P1 if prose used |
| `company_assets` / identity blobs | By design — slug + Company assets |

---

## 4. Asset fields

**Correct architecture:** Jobs CSV does **not** carry logo/profile/gallery binaries or paths.

Company logos survive via:

1. Vault Company assets (`wiki/assets/companies/<slug>/profile/`)
2. Separate Company sync / import into Laravel Company media
3. Job API nested `company.logo_*`
4. Frontend cards / header

No binary duplication on the Jobs CSV path. Asset references remain Company-owned.

**Launch dependency:** Companies (with logos) must exist in Laravel **before** Jobs import, because `JobsImporter` fails closed on unknown `company_slug` and never attaches logos itself.

---

## 5. Company identity

| Step | Mechanism | Status |
|------|-----------|--------|
| Editorial name | FM `company` | Preserved as display |
| Canonical slug | ER / A2-R9 → `relationships.company.slug` | Must be populated before Ready |
| CSV | `company_slug` + `company` | Exported |
| Import | Lookup only; no invent | Fail closed if missing |
| DB | `company_id` FK + `company_name` | Set |
| API / FE | Nested company | Logo + name + links |

**Risk:** If Ready packages ship with empty `company_slug`, rows skip/fail. This is correct behaviour, not a silent corruption — but it is a **production gate** on Entity Resolution + Company catalogue sync.

CSV `company_id` (Vault id) is not consumed by Laravel — intentional; operational IDs differ.

---

## 6. Taxonomies

| Domain | Consistency |
|--------|-------------|
| Employment | Vault → CSV `employment_type` → Laravel normalises to `job_type` slug + keeps raw. FE reads `job_type`. Aligned with production aliases. |
| Workplace | `remote` / `hybrid` / `onsite` + remote aliases. FE emphasises `is_remote`. |
| Experience | Same string set through stack. |
| Benefits / skills / software | Labels preserved; skills mirrored to `tags` for FE Essential Skills. |
| Markets / types | Slug-based; missing types warn and skip. |

No parallel Vault-only taxonomy invented on the export path. Admin CSV Title-Case `job_type` path remains a **separate** stack (documented debt, not Vault export failure).

---

## 7. Round trip

| Layer | Evidence |
|-------|----------|
| Ready → CSV | Mapping code + export smoke PASS |
| CSV → DB | `JobsImporter` + `ImportEngineFoundationTest` |
| DB → API | `JobResource` / `JobListResource` |
| API → FE | `JobsSingle.js` / list mapper |

**Gap:** `content/jobs/ready/` is empty; no package on disk. Certification is **code-path + smoke**, not a live production sample compare. Treat first populated Ready export → import → FE screenshot as an ops checklist item.

### Semantic transforms (not loss)

- Section columns → single `description`
- `employment_type` → also `job_type` slug
- skills → `skill_refs` **and** `tags`
- benefits section bullets → `benefits` JSON
- New imports start hidden/closed (Publication owns go-live)

### Real semantic loss

- emails, state, unused body sections, short_title, aggregator (see matrix)

---

## 8. CSV quality

| Topic | Assessment |
|-------|------------|
| Formatting | Stable header order; trailing newline |
| Escaping | Quote when `,` `"` or `\n`; doubled quotes |
| Arrays | Pipe-joined strings (not JSON arrays in cells) |
| JSON | Only via structured columns after import (`job_links`, refs) |
| Delimiters | Comma columns; pipe lists — avoid unescaped pipes inside labels |
| Unicode | UTF-8 string path |
| Multiline descriptions | Supported via quoted cells + LF normalisation |
| Production safety | Fail-closed validation on required fields and company_slug existence |

**Caution:** Benefit / skill labels containing `|` will split incorrectly. Prefer labels without pipe characters (Quality / editorial hygiene).

---

## 9. Importer audit (`JobsImporter`)

| Area | Finding |
|------|---------|
| Mappings | Aligned with A2-R7 / Field Contract for core editorial set |
| Defaults | New rows imported + hidden + closed — correct |
| Null handling | Empty strings → null for pay/experience/links where appropriate |
| Taxonomy conversion | Employment + workplace normalisers with warnings |
| Company resolution | Slug lookup only; no create |
| Asset references | None on Job row — Company nested at read time |
| Upsert key | `ready_id` (then external_id, then slug) |
| Identity compare | Subset of fields — pay/benefits/tags changes may force update via other keys / always update path when hash differs |
| apply_url empty | Falls back to `source_url`, then `https://example.invalid/apply` — **P1** placeholder risk |
| Dual stacks | Admin / legacy importers still present — ops confusion **P1** |

---

## 10. Prioritised issues

### P0 — Launch blockers

1. **Company catalogue must be synced in Laravel before Jobs import** — unknown `company_slug` fails the package. Not a CSV redesign; ops prerequisite.  
2. **Ready population + one full package round-trip** — empty Ready means production export cannot be empirically certified. Run: promote → export → `import:package` → publish sample → FE check.

### P1 — Important

1. **`emails` exported but not imported** — either map into a safe store / `job_links` convention or stop exporting as “supported”.  
2. **`state` not exported** — US/multi-region jobs lose state if present only in FM.  
3. **Body sections About the Role / About the Company / Location / Software** not in CSV — prose only in those headings is dropped. Prefer Generator writing into Overview / Requirements / etc., or extend mapping (small mapping change, not pipeline redesign).  
4. **`apply_url` placeholder** `example.invalid` — prefer fail validation when apply + source_url empty.  
5. **Document / train ops:** Vault packages → Import Engine only (not Admin CSV).

### P2 — Nice-to-have

1. FE bind `markets` / `software` / `types` (API already exposes).  
2. Persist or drop `short_title`.  
3. Refresh stale “Missing” rows in platform `JOBS_FIELD_CONTRACT.md` §4 (A2-R7 already implemented).  
4. Use `salary_raw` on FE when `pay_*` absent.  
5. Export `aggregator` only if analytics need it.

---

## 11. What not to do

- Do not invent a second Jobs CSV schema for Vault.  
- Do not put Company binaries into `jobs.csv`.  
- Do not auto-create Companies inside `JobsImporter`.  
- Do not merge Admin CSV and Vault CSV contracts.  
- Do not move Publication into Export.

---

## 12. Deliverables in this phase

| Doc | Path |
|-----|------|
| This review | `docs/architecture/JOBS_CSV_EXPORT_REVIEW.md` |
| Contract | `docs/architecture/JOBS_CSV_CONTRACT.md` |
| Matrix | `docs/architecture/JOBS_EXPORT_IMPORT_MATRIX.md` |
| Certification | `docs/architecture/JOBS_EXPORT_CERTIFICATION.md` |

Platform companions (unchanged):  
`patterndesignerscom/docs/architecture/JOBS_FIELD_CONTRACT.md`,  
`CSV_EXPORT_ARCHITECTURE.md`,  
`LARAVEL_IMPORT_ARCHITECTURE.md`.
