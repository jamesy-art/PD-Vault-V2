# Jobs Import Lookup Trace

**Date:** 2026-08-07  
**Updated:** A8-R8 — Soft-deleted matches plan as Update  
**Status:** Authoritative lookup + plan notes for Vault Jobs CSV

End-to-end identity lookup for Vault Jobs CSV → Import Engine.

---

## Path

```text
jobs.csv
    ↓
JobsVaultCsvImportGateway   (Admin upload → stage package)
  or
import:package              (CLI package path)
    ↓
ImportEngine::import
    ↓
ImportPlanner → JobsImporter::plan(rows)
    ↓
findExisting(ready_id, slug, source)   [withTrashed]
    ↓
mapPayload
    ↓
if existing null → CREATE
if existing.trashed() → UPDATE          ← A8-R8
if isIdentical → NO_CHANGE              ← active only
else → UPDATE
    ↓
ImportEngine apply loop
    ↓
JobsImporter::apply  (skipped for no_change / skip)
```

Gateway (`JobsVaultCsvImportGateway`) only stages CSV + delegates. It does **not** classify Create/Update/No Change.

---

## Identity keys on the Job model

| Field | Role in import |
|-------|----------------|
| `ready_id` | **Primary** lookup key (`findExisting`) |
| `external_id` + `source` | Secondary (same ready_id value under vault source) |
| `slug` | Tertiary fallback |
| `canonical_id` | Required in CSV validation; **not** used in `findExisting` |
| `editorial_hash` | Compared in `isIdentical` only — not a find key |
| `id` | Preserved across soft-delete + restore Update |

Plan `identityKey` for reporting = `ready_id` (else `canonical_id`) — display/session only.

---

## findExisting (authoritative)

File: `backend-laravel/app/Services/ImportEngine/Importers/JobsImporter.php`

```text
ready_id ≠ ''
    → Job::withTrashed()->where('ready_id', ready_id)->first()
    → else Job::withTrashed()->where(source, external_id=ready_id)->first()
else / miss
    → Job::withTrashed()->where('slug', slug)->first()
```

Every branch uses **`withTrashed()`**. Soft-deleted Jobs still resolve identity so re-import can restore the **same row** (A8-R8) instead of creating a duplicate.

---

## Soft-delete + re-import (A8-R8)

| Step | Behaviour |
|------|-----------|
| Lookup | Finds trashed Job by `ready_id` |
| Plan | **UPDATE** (never NO_CHANGE while trashed) |
| Apply | Existing Update path: `withTrashed()->findOrFail` → `restore()` → fill/save |
| Identity | Same `id`, `ready_id`, `canonical_id` / hash fields preserved as filled |

Editors never need to know SoftDeletes exist: delete in Admin, re-import CSV, Jobs reappear.

---

## Apply vs plan

| Action | `apply()` behaviour |
|--------|---------------------|
| create | `new Job` |
| update | `Job::withTrashed()->findOrFail` → **restore if trashed** → fill/save |
| no_change | **Not applied** (active identical only) |

---

## Nike example (post A8-R8)

| Stage | Result |
|-------|--------|
| Soft-deleted row | Still found by `ready_id` |
| Plan | UPDATE |
| After import | Active again, same id |

---

## Related

- [`JOBS_IMPORT_DECISION_TREE.md`](./JOBS_IMPORT_DECISION_TREE.md)  
- [`JOBS_FALSE_NO_CHANGE_AUDIT.md`](./JOBS_FALSE_NO_CHANGE_AUDIT.md)
