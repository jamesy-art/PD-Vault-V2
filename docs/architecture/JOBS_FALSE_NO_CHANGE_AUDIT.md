# Jobs False No-Change Import Audit (A8-R7)

**Date:** 2026-08-07  
**Status:** Audit only — **no code changes**  
**Verdict:** ✅ **PASS** (root cause identified)  
**Fix:** A8-R8 — trashed matches plan as UPDATE (see [`JOBS_IMPORT_DECISION_TREE.md`](./JOBS_IMPORT_DECISION_TREE.md))

---

## Executive finding

The Jobs table is **not empty**. Admin “delete” (and Eloquent `delete()`) **soft-deletes** Jobs (`deleted_at` set). `Job::count()` returns **0**, but `jobs` still holds the rows.

`JobsImporter::findExisting()` looks up with `Job::withTrashed()`, finds those soft-deleted rows by `ready_id`, then `isIdentical()` compares content (including `editorial_hash`) and returns true → plan action **`no_change`**.

`ImportEngine` **skips apply** for `no_change`, so soft-deleted Jobs are **never restored**. Admin still sees an empty list while Import reports **No Change: 14**.

This is **not** driven by Import Session / a separate Import Registry table. It is **JobsImporter + SoftDeletes** behaviour.

---

## Expected vs actual

| | Expected | Actual |
|--|----------|--------|
| After delete | Zero job identity | Soft-deleted rows remain |
| Re-import | Creates: 14 | Creates: 0, Updates: 0, No Change: 14 |
| Admin list | Jobs reappear | Still empty (still trashed) |

---

## Step 1 — Database (before / as of audit)

Local SQLite (`backend-laravel/database/database.sqlite`):

| Query | Result |
|-------|--------|
| `Job::count()` (default scope) | **0** |
| `Job::withTrashed()->count()` | **21** |
| `select count(*) from jobs` | **21** |
| `where deleted_at is null` | **0** |
| `where deleted_at is not null` | **21** |

Rows are **present and soft-deleted**, not hard-deleted, not “archived-only” as a separate table. `lifecycle` / `status` remain on the soft-deleted row.

`Job` model uses `Illuminate\Database\Eloquent\SoftDeletes` (`app/Models/Job.php`).

---

## Step 2 — Existing lookup (exact)

**Class:** `App\Services\ImportEngine\Importers\JobsImporter`  
**Method:** `findExisting(string $readyId, string $slug, string $source): ?Job`  
**Lines:** ~483–500

```php
private function findExisting(string $readyId, string $slug, string $source): ?Job
{
    if ($readyId !== '') {
        $byReady = Job::withTrashed()->where('ready_id', $readyId)->first();
        if ($byReady) {
            return $byReady;
        }
        $byExternal = Job::withTrashed()
            ->where('source', $source)
            ->where('external_id', $readyId)
            ->first();
        if ($byExternal) {
            return $byExternal;
        }
    }

    return Job::withTrashed()->where('slug', $slug)->first();
}
```

**Lookup keys (in order):**

1. `ready_id` (with trashed)
2. `source` + `external_id` (= ready_id) (with trashed)
3. `slug` (with trashed)

**Not used for existence:** Import Session, Import Registry table (none), `canonical_id` alone, plan hashes before lookup.

Called from `plan()` ~L115.

---

## Step 3 — Create / Update / No Change decision

**Class:** `JobsImporter`  
**Method:** `plan()`  
**Lines:** ~106–166

| Condition | Action | Constant |
|-----------|--------|----------|
| `mapPayload` returns null | Skip | `ACTION_SKIP` |
| `$existing === null` | Create | `ACTION_CREATE` |
| `$existing !== null` && `isIdentical($existing, $payload)` | **No Change** | `ACTION_NO_CHANGE` |
| else | Update | `ACTION_UPDATE` |

**Identical check:** `isIdentical()` ~L505–541 compares:

`title`, `description`, `company_id`, `location`, `employment_type`, `job_type`, `workplace_type`, `experience_level`, `apply_url`, `is_remote`, `salary_raw`, **`editorial_hash`**, **`ready_id`**, plus sorted `type_ids`.

Hash is **not** checked before existence. Existence first → then field/hash equality.

---

## Step 4 — Import Registry / Session

| Store | Role in No Change? |
|-------|--------------------|
| `import_sessions` | Session bookkeeping only — **does not** decide No Change |
| `import_row_snapshots` | Written on create/update apply — **not** consulted in `plan()` |
| Separate `import_registry` table | **Does not exist** |

Soft-deleted **Job rows** retain `ready_id` / `editorial_hash`. That surviving **model identity** is what causes No Change — not the import session history.

---

## Step 5 — Hash comparison

`editorial_hash` is one of the `isIdentical` keys.  
It is compared **only after** `findExisting` returns a row (including trashed).

If hashes match (and other compared fields match), action = No Change even when `deleted_at` is set.

---

## Step 6 — Deletion vs identity

Soft delete **does not remove**:

- `ready_id`, `slug`, `editorial_hash`, `canonical_id` (column), company FK, etc.
- the `jobs` row itself

Soft delete **does**:

- hide the row from default Eloquent queries / typical Admin lists
- leave identity available to `withTrashed()` lookups

`apply()` for **Update** would restore trashed jobs (`JobsImporter` ~L190–192), but **No Change never calls apply** (`ImportEngine` ~L131–132).

---

## Nike trace

| Stage | Result |
|-------|--------|
| jobs table (default) | 0 rows visible |
| jobs table (raw / withTrashed) | id=9 present, `deleted_at=2026-08-07 18:45:31` |
| CSV | `ready_id=ready-clip-9451cacca5d382b8`, `editorial_hash=561d436c5bfd4bb7…`, `company_slug=nike` |
| lookup | `Job::withTrashed()->where('ready_id', …)->first()` → **FOUND id=9** |
| existing row found? | **Yes** (trashed) |
| registry entry | N/A — no registry; session snapshots unrelated |
| `isIdentical` | **true** (fields + editorial_hash match) |
| decision | **`no_change`** |
| why Create skipped | `$existing !== null` because soft-deleted row still matches `ready_id` |
| apply | **Skipped** — row stays soft-deleted |

---

## Final answers

1. **Does the jobs table contain zero rows?**  
   **No.** Zero *active* rows; **21 soft-deleted** rows remain (audit DB).

2. **Are Jobs soft deleted?**  
   **Yes.** `SoftDeletes` on `Job`; `deleted_at` populated.

3. **What object causes No Change?**  
   The **soft-deleted `Job` Eloquent model** found by `ready_id`, then judged identical by `isIdentical()`.

4. **Lookup using database / registry / hashes / other?**  
   **Database** (`jobs` via `withTrashed`). Hashes only for identical-vs-update **after** find. Not registry.

5. **Why No Change instead of Create?**  
   Soft-deleted job still “exists” to the importer; content matches CSV → No Change; apply skipped → never restored.

6. **Bug class?**  
   **Primary: JobsImporter decision/lookup** (`findExisting` includes trashed + No Change does not restore).  
   **Contributing: deletion workflow** — soft delete leaves import identity when operators expect a clean slate for re-import.  
   **Not** Gateway / ImportEngine registry logic. ImportEngine correctly executes the plan JobsImporter builds.

**Component requiring correction (future, not this audit):** `JobsImporter::plan` / `findExisting` (and/or Admin delete → `forceDelete` for re-import hygiene). Soft-deleted matches should Create, or Update+restore, never silent No Change that leaves rows trashed.

---

## Related

- [`JOBS_IMPORT_LOOKUP_TRACE.md`](./JOBS_IMPORT_LOOKUP_TRACE.md)  
- [`JOBS_IMPORT_DECISION_TREE.md`](./JOBS_IMPORT_DECISION_TREE.md)
