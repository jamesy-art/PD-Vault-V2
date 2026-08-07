# Jobs Export Commands

**Date:** 2026-08-07  
**Audit only** — commands verified from `scripts/export/*.js` `--help` and `scripts/export/README.md`.  
Do not invent flags.

Working directory: PD Vault V2 root.

---

## 1. Permanent production export

### Export all Ready Jobs

```bash
node scripts/export/export.js --mode all --type jobs
```

Default when flags omitted: `--mode all`, `--type jobs` (see CLI help).

### Export changed since last successful package

```bash
node scripts/export/export.js --mode changed --type jobs
```

### Export by type (Jobs)

```bash
node scripts/export/export.js --mode type --type jobs
```

### Export a selection (used in first production validation)

```bash
node scripts/export/export.js \
  --mode selection \
  --ready-ids ready-clip-9451cacca5d382b8,ready-clip-490d229cfe0e2db0 \
  --type jobs
```

### Export a single Ready Job

```bash
node scripts/export/export.js --mode single --ready-id ready-clip-490d229cfe0e2db0 --type jobs
```

### Preview only (no package)

```bash
node scripts/export/preview.js --mode all --type jobs
# or
node scripts/export/export.js --mode all --type jobs --preview
```

---

## 2. Supporting CLIs

### List Ready Jobs

```bash
node scripts/export/list.js
node scripts/export/list.js --type jobs
node scripts/export/list.js --search nike
```

### Export history / registry

```bash
node scripts/export/list.js --history
```

### Smoke test

```bash
node scripts/export/smoke-test.js
```

---

## 3. Shared flags (export / preview)

| Flag | Purpose |
|------|---------|
| `--mode all\|changed\|type\|selection\|single` | Selection mode |
| `--type <jobs[,…]>` | Content type(s) |
| `--ready-id <id>` | Single mode |
| `--ready-ids <id,id>` | Selection mode |
| `--search <query>` | Filter Ready titles/ids |
| `--vault <path>` | Alternate vault root |
| `--preview` | `export.js` only — preview, no package |
| `--help` / `-h` | Help |

---

## 4. Laravel consume (not Vault export)

After a package exists under `exports/packages/pkg-…/`:

```bash
php artisan import:package /absolute/path/to/PD\ Vault\ V2/exports/packages/pkg-64af29096d1ce0d2
php artisan import:package … --dry-run
php artisan import:package … --actor=editor:name
php artisan import:package --rollback=<session_id>
```

Run from `patterndesignerscom/backend-laravel`.

**Upload** Vault `jobs.csv` at Filament `/admin/jobs` (same contract as package import via `JobsImporter`).

Alternatively import the full package directory:

```bash
php artisan import:package /absolute/path/to/PD\ Vault\ V2/exports/packages/pkg-…
```

---

## 5. Recommended editor workflow

1. Ensure Jobs are Ready under `content/jobs/ready/`.
2. Preview:

```bash
node scripts/export/preview.js --mode all --type jobs
```

3. Export:

```bash
node scripts/export/export.js --mode all --type jobs
```

4. Note package path from console (`Path: exports/packages/pkg-…`).
5. Import:

```bash
php artisan import:package <that-path> --actor=<you>
```

6. Publish in Laravel (Publication / Filament) — separate from Export.

---

## 6. Output locations

| Artifact | Path |
|----------|------|
| Package | `exports/packages/<package_id>/` |
| `jobs.csv` | `exports/packages/<package_id>/jobs.csv` |
| Manifest | `exports/packages/<package_id>/manifest.json` |
| Reports (in package) | `export_report.json` / `.md` |
| Report copies | `exports/reports/<package_id>.{json,md}` |
| Registry | `exports/history/registry.json` |
| History log | `exports/history/export-history.jsonl` |
