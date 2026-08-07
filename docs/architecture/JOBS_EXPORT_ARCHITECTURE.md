# Jobs Export Architecture

**Date:** 2026-08-07  
**Scope:** Audit only — Ready → CSV → Export Package → Laravel Import  
**Status:** Canonical Track A8 Export Workspace  
**Constraint:** No redesign in this document.

---

## 1. Verdict (short)

| Question | Answer |
|----------|--------|
| Permanent export command | `node scripts/export/export.js --mode all --type jobs` (and mode variants below) |
| What generates `jobs.csv` | `JobsMapping` → `csvGenerator` → `encodeCsv` inside `writeExportPackage` |
| What generates packages | `scripts/lib/export/packageBuilder.js` (`writeExportPackage`) |
| Editor production workflow | Promote Ready → preview → `export.js` → hand package dir to `php artisan import:package` |
| Obsolete Jobs exporters? | **No second Jobs package exporter** in Vault. Admin `JobCsvImporter` is a parallel Laravel path — not Vault export. |

---

## 2. Canonical stack

```
Track A8 — Export Workspace
  CLI:     scripts/export/export.js | preview.js | list.js | smoke-test.js
  Engine:  scripts/lib/export/ExportWorkspace (index.js)
  Mapping: scripts/lib/export/mappings/JobsMapping.js
  CSV:     scripts/lib/export/csvGenerator.js + csv.js
  Package: scripts/lib/export/packageBuilder.js
  Catalog: scripts/lib/export/readyCatalog.js
           → ReadyWriter.readyRootFor → content/jobs/ready/
```

There is **no** class named `JobsExporter`. The Jobs row mapper is `JobsMapping` (extends `ExportMapping`).

---

## 3. End-to-end ownership

| Stage | Owner | Location |
|-------|-------|----------|
| Ready snapshot | Ready Promotion (A7) | `content/jobs/ready/<ready_id>/ready.md` |
| Ready discovery | Export `readyCatalog` | reads Ready root only |
| Validation | `exportValidator.js` | fail-closed before package |
| Row mapping | `JobsMapping.mapRow` | FM + body sections → 50 columns |
| CSV bytes | `encodeCsv` / `generateCsvFiles` | UTF-8, RFC4180-ish |
| Package write | `writeExportPackage` | `exports/packages/pkg-…/` |
| Manifest / history | `manifest.js` / `packageRegistry.js` | package + `exports/history/` |
| Export reports | `ExportReport` + packageBuilder | in-package + `exports/reports/` |
| Asset packaging | **None** for Jobs | Company assets stay on Company SoT |
| Laravel import | Import Engine | `php artisan import:package <dir>` → `JobsImporter` |
| Publication | Laravel Publication | after import — out of Export |

Vault Export **never** modifies Ready and **never** runs Laravel import.

---

## 4. Ready root (runtime vs docs)

| Path | Role |
|------|------|
| `content/jobs/ready/` | **Runtime SoT for export** (`ReadyWriter.readyRootFor`) |
| `wiki/jobs/_ready/` | Documented in `vaultPaths.js` as permanent — **not used by export today**; folder absent |
| `wiki/jobs/_staging/` | Canonical editorial workspace — **not** exported directly |

Export only sees packages that have been **promoted to Ready** under `content/jobs/ready/`.

---

## 5. Package contract (Laravel handoff)

Directory argument to Import Engine must contain:

| File | Purpose |
|------|---------|
| `jobs.csv` | Row transport (filename fixed by `JobsImporter::csvFilename()`) |
| `manifest.json` | Package identity, file checksums, document list |
| `export_report.json` | Optional but written by Vault |
| `export_report.md` | Human report |

**No** logos, gallery binaries, or Company Markdown inside the Jobs package.

Live example from production validation:

```
exports/packages/pkg-64af29096d1ce0d2/
  jobs.csv
  manifest.json
  export_report.json
  export_report.md
```

Scope: `selection`, 2 jobs, 50 CSV columns.

---

## 6. CSV writer (technical)

| Concern | Implementation |
|---------|----------------|
| Mapping source | `JobsMapping.headers()` + `mapRow(doc)` |
| Writer | `generateCsvFiles` → `encodeCsv` → `fs.writeFile(..., 'utf8')` |
| Delimiter | `,` |
| Escaping | Quote if cell contains `"` `,` or newline; `"` → `""` |
| Arrays | Pipe-joined strings (`\|`) in cells — not JSON arrays |
| Multiline | Allowed inside quoted cells; `\r\n`/`\r` normalised to `\n` |
| UTF-8 | Yes |
| Column order | Fixed `headers()` order |
| Row order | Sorted by `canonical_id|ready_id` |
| Checksum | SHA-256 of CSV UTF-8 bytes |
| Package id | `pkg-` + first 16 hex of identity hash |

---

## 7. JobsMapping ownership

```
Ready Markdown (FM + body)
  → JobsMapping.mapRow
  → jobs.csv row
  → JobsImporter.mapPayload
  → jobs table / refs
```

Contract companions (not redesigns):

- `docs/architecture/JOBS_CSV_CONTRACT.md`
- Platform `JOBS_FIELD_CONTRACT.md`
- Laravel `JobsImporter.php`

---

## 8. Multiple exporters — categorisation

| Implementation | Category | Notes |
|----------------|----------|-------|
| Track A8 `scripts/export/*` + `scripts/lib/export/*` + `JobsMapping` | **Canonical** | Only Jobs Ready → package path |
| `SimpleTypeMapping` (news, interviews, …) | **Experimental stubs** | Registered; not production Jobs |
| Laravel `import:package` / `JobsImporter` | **Canonical consumer** | Not an exporter |
| Laravel Filament Admin Jobs Import | **Same contract** | Uploads Vault `jobs.csv` via `JobsVaultCsvImportGateway` → `JobsImporter` |
| Legacy `JobsCsvImportService` | Out of contract | Do not use for Vault packages |
| `scripts/lib/companyCsvExport/*`, `typeCsvExport/*` | **Canonical other domains** | Not Jobs packages |
| `wiki/jobs/ready-clip-*` loose dirs | **Stray / unused by export** | Export catalog ignores them |

**No dead second Jobs CSV package writer** found in Vault.

---

## 9. Related docs

| Doc | Topic |
|-----|-------|
| `JOBS_EXPORT_PIPELINE.md` | Stage-by-stage trace |
| `JOBS_EXPORT_COMMANDS.md` | Real CLI only |
| `JOBS_EXPORT_INVENTORY.md` | File inventory |
| `JOBS_CSV_CONTRACT.md` | Column contract |
| `scripts/export/README.md` | Track A8 operator README |
