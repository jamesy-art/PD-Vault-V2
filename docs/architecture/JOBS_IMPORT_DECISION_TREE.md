# Jobs Import Decision Tree

**Date:** 2026-08-07  
**Updated:** A8-R8 — Soft-deleted Jobs plan as Update  
**Owner of decisions:** `JobsImporter::plan()`  
**Executor:** `ImportEngine` (does not re-decide Create vs No Change)

---

## Decision tree (current)

```text
For each jobs.csv row
        │
        ▼
mapPayload(row, …, existing?)
        │
        ├─ null (e.g. company_slug missing in DB)
        │     → SKIP (unable_to_map_row)
        │
        ▼
findExisting(ready_id, slug, vault_source)
  [always withTrashed]
        │
        ├─ null
        │     → CREATE
        │
        ▼
existing Job found
        │
        ├─ trashed?
        │     → UPDATE
        │         → apply: withTrashed find → restore() → fill/save
        │         (restoring is always a change — never NO_CHANGE)
        │
        ▼
isIdentical(existing, payload)?   [active rows only reach here]
        │
        ├─ true
        │     → NO_CHANGE
        │         → ImportEngine: skip apply
        │
        └─ false
              → UPDATE
                  → apply: fill/save
```

---

## A8-R8 rule

Soft-deleted Jobs are treated as **Update**, not No Change.

Re-import after Admin delete restores the same identity (`ready_id` / row id) via the existing Update `apply()` path. Editors do not need to know SoftDeletes exist.

`NO_CHANGE` is returned **only** for **active** Jobs whose compared fields match.

---

## isIdentical comparisons

String (null → `''`) equality on:

- `title`, `description`, `company_id`, `location`
- `employment_type`, `job_type`, `workplace_type`, `experience_level`
- `apply_url`, `salary_raw`, `editorial_hash`, `ready_id`

Boolean: `is_remote`  
Plus sorted `type_ids`.

Any mismatch → Update. All match **and active** → No Change.

---

## Delete → re-import workflow

```text
Operator soft-deletes Jobs
        ↓
Re-upload same jobs.csv
        ↓
findExisting → trashed row by ready_id
        ↓
plan: UPDATE (trashed short-circuit)
        ↓
apply: restore + fill + save
        ↓
Jobs visible again (same ids)
```

Second identical import while active → **No Change: N**.

---

## Report counters

| Plan action | Report bucket |
|-------------|---------------|
| `create` | Creates |
| `update` | Updates |
| `no_change` | No Change |
| `skip` | Skipped |

Validation (package `pkg-ac9afd5f69d320bd`): soft-delete 14 → import → **Updates: 14**; immediate re-import → **No Change: 14**.

---

## Related

- [`JOBS_IMPORT_LOOKUP_TRACE.md`](./JOBS_IMPORT_LOOKUP_TRACE.md)  
- [`JOBS_FALSE_NO_CHANGE_AUDIT.md`](./JOBS_FALSE_NO_CHANGE_AUDIT.md) (A8-R7 root cause)
