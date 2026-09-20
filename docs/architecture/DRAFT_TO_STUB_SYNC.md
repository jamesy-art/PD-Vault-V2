# Draft → Stub Sync (A2-R13)

**Date:** 2026-08-07  
**Status:** Implemented  
**Command:** `php artisan companies:sync-draft-stubs --vault=/path/to/PD\ Vault\ V2`

---

## Goal

When a Company Draft exists under `wiki/companies/_drafts/`, ensure a matching **operational Company stub** exists in Laravel so Jobs Import can resolve:

```php
Company::query()->where('slug', $slug)->first();
```

Jobs remain fail-closed for truly unknown slugs. Editors no longer must manually create Companies before Jobs Import for Vault-discovered employers.

---

## Target flow

```text
Vault Draft (_drafts/)
        ↓
companies:sync-draft-stubs
        ↓
Laravel operational stub (source=imported, is_active=false)
        ↓
Jobs Import resolves slug
        ↓
Editor enriches → _staging → _ready
        ↓
Companies CSV import
        ↓
Same row promoted to curated (same id)
```

---

## Implementation

| Piece | Path |
|-------|------|
| Service | `backend-laravel/app/Services/CompanyDraftStubSyncService.php` |
| Artisan | `backend-laravel/app/Console/Commands/SyncCompanyDraftStubsCommand.php` |
| Tests | `backend-laravel/tests/Feature/CompanyDraftStubSyncTest.php` |

Uses existing `CompanyCreationPolicy::ImportedPlaceholder` (`source=imported`, `is_active=false`). Does **not** modify A2-R9/R10/R11, JobsMapping, JobsImporter, Companies CSV export, or frontend publication.

---

## Sync rules

1. Read `wiki/companies/_drafts/*.md`.
2. Only process `editorial_status: draft`.
3. Identity key = normalised `slug`.
4. Create stub if missing (name, slug, source, is_active only).
5. If stub exists: update name when changed; preserve id; do not overwrite editorial HTML/description.
6. If `source=curated` already: **skip** (never demote).
7. Platform stubs (`job_post` / `designer_apply`): leave source as-is; do not force inactive when those policies require active non-public stubs.
8. Soft-deleted matching slug: restore when updating.

### Idempotency

Re-running sync:

- creates **0** duplicates
- reports `unchanged` when already aligned
- preserves Company IDs

---

## Validation (2026-08-07)

Draft cohort synced:

`boll`, `culp-inc`, `home-bargains`, `iliv`, `lands-end`, `qvc-group`, `ulster-weavers`, `whistlefish`

| Check | Result |
|-------|--------|
| Stub create | 8 created, `source=imported`, `is_active=0` |
| Public scope | 0 of 8 public |
| Re-sync | 8 unchanged |
| Jobs package `pkg-ac9afd5f69d320bd` | OK — creates 8 + no_change 6 = **14 rows**, **0 errors**, **0 company_slug skips** |

---

## Distinction reminder

| | Vault Draft | Operational Stub | Curated Company |
|--|-------------|------------------|-----------------|
| Store | Markdown | Laravel row | Laravel row (+ Vault `_ready`) |
| Purpose | Editorial queue | Jobs FK / Admin ops | Public catalogue |
| SoT | Vault | Projection of Vault draft | Vault `_ready` → CSV |

See [`COMPANY_OPERATIONAL_STUBS.md`](./COMPANY_OPERATIONAL_STUBS.md).
