# Jobs Export Pipeline

**Date:** 2026-08-07  
**A7-R1** — Export reads Ready from `wiki/jobs/_ready/`

---

## 1. Permanent pipeline

```
Ready Markdown
  wiki/jobs/_ready/<editorial-slug>/<editorial-slug>.md
        ↓
Export CLI / ExportWorkspace
  select Ready docs (mode + type + filters)
        ↓
Validate (exportValidator)
  required columns / Ready integrity — fail closed
        ↓
Map (JobsMapping.mapRow)
  one Ready doc → one CSV row object
        ↓
CSV (csvGenerator + encodeCsv)
  jobs.csv bytes + checksum
        ↓
Package (packageBuilder.writeExportPackage)
  exports/packages/pkg-<id>/
    jobs.csv
    manifest.json
    export_report.json
    export_report.md
        ↓
History / reports mirrors
  exports/history/registry.json
  exports/history/export-history.jsonl
  exports/reports/pkg-<id>.{json,md}
        ↓
Laravel Import Engine
  php artisan import:package <absolute-or-relative-package-dir>
        ↓
JobsImporter
  jobs.csv → jobs table + company_id + refs
        ↓
Publication (separate)
  PublicationFacade — not part of Export
```

---

## 2. Stage detail

### 2.1 Ready input

- Only Ready packages under `wiki/jobs/_ready/`
- Loaded by `readyCatalog.listReadyDocuments`
- Root: `ReadyWriter.readyRootFor` → `vaultPaths.readyRootFor` → `wiki/jobs/_ready/`
- Markdown: `<slug>/<slug>.md` (legacy `ready.md` accepted during migration)
- `ready_id` from `ready.json` / front matter — **not** the folder name
- Ready is **never** written by Export

### 2.2 Selection modes

| Mode | Selects |
|------|---------|
| `all` | All Ready for requested content types |
| `changed` | Editorial hash ≠ last successful registry hashes |
| `type` | Same as type-scoped Ready list (`--type jobs`) |
| `selection` | Explicit `--ready-ids a,b` (also accepts editorial slug) |
| `single` | Explicit `--ready-id` (also accepts editorial slug) |

Optional `--search` filters title / ready_id / editorial_slug / canonical_id before mode filter.

### 2.3 Validate

- Mapping `requiredColumns()` for jobs: `title`, `canonical_id`, `ready_id`
- Failures → no package; failed report under `exports/reports/failed-*`

### 2.4 Map → CSV → Package → Import

Unchanged from prior Export certification. Package format, Import Engine, and Publication are out of scope for A7-R1.

---

## 3. What did not change (A7-R1)

| Surface | Status |
|---------|--------|
| Export package layout | Unchanged |
| CSV columns / Jobs Field Contract | Unchanged |
| Import Engine | Unchanged |
| Publication | Unchanged |
| `ready_id` as upsert key | Unchanged (still metadata identity) |

Only the **Ready discovery path** and **editor-facing folder naming** moved to Vault `_ready`.
