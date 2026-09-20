# Company Draft Lifecycle

**Date:** 2026-08-07  
**Status:** Audit / architecture vocabulary (A2-R12) — **no code changes**

---

## Purpose

Define one consistent lifecycle for **Company discovery → curated public catalogue**, covering:

- Vault Company Draft Markdown (`wiki/companies/_drafts/`)
- Laravel non-curated Company stubs (`source` ≠ `curated`)
- Vault `_staging` / `_ready` → Companies CSV → Laravel curated

This document does **not** implement sync or importers. It names stages so Admin Jobs and Vault Jobs stop sounding like two unrelated products.

---

## Lifecycle stages

```text
1. Discovered
2. Enriched (editorial)
3. Staging
4. Ready
5. Imported (operational DB)
6. Curated (public catalogue)
```

### 1 — Discovered

Employer seen from Jobs (or related intake) but not yet a catalogue Company.

| Representation | Location | Notes |
|----------------|----------|-------|
| Vault Company Draft | `wiki/companies/_drafts/{slug}.md` | A2-R11; editorial queue |
| Laravel operational stub | `companies` row with `source` in `job_post`, `designer_apply`, `imported`, `csv` | Admin-visible; not public |

Same **stage**, different **stores**. Prefer creating only one store per channel, then sync later if needed.

### 2 — Enriched (editorial)

Editor adds overview, markets, links, imagery intent, etc.

- Vault: edit the draft Markdown (or move early to `_staging` and enrich there).  
- Laravel-only stubs: Filament edit — **does not** automatically update Vault.

### 3 — Staging

Vault: move/copy into `wiki/companies/_staging/`.  
Still not exportable. Still not public.

### 4 — Ready

Vault: `wiki/companies/_ready/{slug}.md`.  
Only this cohort is consumed by Phase 4 `companyCsvExport`.

### 5 — Imported (operational DB)

Companies CSV → `CompanyCsvImporter` upsert by slug.  
Row exists for Jobs FK resolution (`JobsImporter` fail-closed on missing slug).

Public visibility still gated.

### 6 — Curated (public)

Laravel: `source = curated` **and** `is_active = true` (`Company::scopePublic()`).  

Paths into curated:

- Vault CSV import with curated discipline (normal catalogue path), or  
- Admin **Promote to Curated** on an existing stub (operational shortcut; does not invent Vault Markdown).

---

## What “draft” means (disambiguation)

| Term | Meaning |
|------|---------|
| **Company Draft Markdown** | Vault file under `_drafts/` — editorial placeholder |
| **Operational stub / platform draft** | Laravel Company with non-curated `source` |
| **Job draft** | Unrelated — Jobs have their own lifecycle (`imported` / publication) |
| **publication_status: draft** (Markdown schema docs) | Catalogue publication intent in company Markdown schemas — not the A2-R11 folder |

A2-R11 `editorial_status: draft` = Vault discovery stage only.

---

## Channel rules

### Vault Jobs Generate

```text
Unknown A2-R9 slug → Discovered (Vault _drafts only)
Job Generate never creates Laravel Companies
Job Import remains fail-closed until Imported stage exists in DB
```

### Platform Job Post approval

```text
Unknown name → Discovered (Laravel stub, source=job_post, is_active=true)
Job can attach company_id immediately
Not public until Curated
```

### Filament Admin Job form

Does not create discovery objects — requires existing `company_id`.

---

## Ownership

| Concern | Owner |
|---------|--------|
| Discovery from Vault Jobs | Vault `_drafts` |
| Discovery from platform job posts | Laravel stub (`job_post`) |
| Editorial enrichment for catalogue | Vault Markdown |
| Public company pages | Laravel curated + active (fed by Vault CSV) |
| Jobs Import FK | Laravel `companies.slug` must exist (any source) |

**Ultimate ownership of new Company discovery for research / Vault Jobs:** Vault.  
**Ultimate ownership of curated public copy:** Vault `_ready` → CSV.  
**Operational exceptions:** Platform submissions may create stubs first; those should eventually gain a Vault page or be marked curated-only with eyes open about drift.

---

## Allowed transitions (target model)

```text
Vault _drafts ──enrich──► _staging ──approve──► _ready ──CSV──► Laravel (curated path)
     │                                              │
     │ optional future sync (non-curated stub)      │
     └──────────────────────────► Laravel imported/csv stub ──promote──► curated
```

```text
Laravel job_post stub ──Promote to Curated──► curated
                     └── ideally backfill Vault Markdown (manual today)
```

Forbidden (preserve Vault-first):

- Generate writing curated Laravel Companies  
- Exporting `_drafts` as if they were `_ready`  
- Treating Admin Promote as a substitute for Vault research without recording the decision

---

## Alignment with Admin Jobs stubs

Operational result editors care about for Jobs Import:

> A `companies.slug` exists so Jobs can attach.

Admin Job Post approval already produces that.  
Vault drafts do **not**.  

Lifecycle alignment therefore has two layers:

1. **Editorial** — Vault drafts → ready → curated (content quality).  
2. **Operational** — slug present in Laravel (Jobs FK).  

Both layers should eventually meet at the same slug. Until a sync exists, editors must promote Vault drafts through Ready/CSV (or manually create/promote Laravel companies) to clear Jobs Import failures.

---

## Related

- [`JOBS_COMPANY_DISCOVERY_ALIGNMENT.md`](./JOBS_COMPANY_DISCOVERY_ALIGNMENT.md)  
- [`ADMIN_VS_VAULT_COMPANY_DISCOVERY.md`](./ADMIN_VS_VAULT_COMPANY_DISCOVERY.md)  
- [`COMPANY_DRAFT_DISCOVERY.md`](./COMPANY_DRAFT_DISCOVERY.md)
