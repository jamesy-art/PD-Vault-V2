# Jobs Editorial Workflow

**Date:** 2026-08-07  
**A3-R1** — Generate automates deterministic stages  
**A8-R2** — Vault `jobs.csv` is the single Admin + Package import contract

---

## Principle

Editors interact only with stages that need judgement.  
Machine stages run automatically inside Generate.

```
Generate → Review → Approve → Promote → Export → Import → Publish
```

---

## Stages

| Step | Who | Command |
|------|-----|---------|
| Generate (+ Resolve + Quality) | Machine | `node scripts/markdown/generate.js --raw-dir raw/_jobs` |
| Review | Editor | Read `wiki/jobs/_staging/<slug>/` |
| Approve | Editor | `node scripts/editorial/approve.js --mode changed --actor editor:…` |
| Promote | Editor / ops | `node scripts/ready/promote.js --mode changed` |
| Export | Editor / ops | `node scripts/export/export.js --mode changed` |
| Import | Editor / ops | Upload `jobs.csv` at `/admin/jobs` **or** `php artisan import:package <pkg>` |
| Publish | Editor / ops | Laravel Publication (separate) |

Import (Admin or Package) uses the same `JobsMapping` CSV and `JobsImporter` semantics. Imported jobs stay hidden until Publication.

---

## What Generate does

1. Markdown generation (cleaners, fields, company identity, enrichment, assets)  
2. **Entity Resolution** (existing A4) → `resolution-report.json`  
3. **Quality** (existing A5) → `quality-report.json` + `quality-status.json`  
4. Leaves `editorial_status: canonical`

## What Generate does not do

- Approve  
- Promote to Ready  
- Export / Import / Publish  

---

## Debug / maintenance

```bash
node scripts/resolution/resolve.js --mode single --slug <slug>
node scripts/quality/check.js --mode single --slug <slug>
```

---

See `JOBS_GENERATE_TO_PROMOTE_WORKFLOW.md` for the full artifact contract.  
See PatternDesigners `JOBS_IMPORT_ARCHITECTURE.md` and Vault `JOBS_CSV_CONTRACT.md` for import.
