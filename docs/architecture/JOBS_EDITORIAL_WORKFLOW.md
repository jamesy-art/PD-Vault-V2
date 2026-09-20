# Jobs Editorial Workflow

**Date:** 2026-08-07  
**A3-R1** — Generate automates deterministic stages  
**A3-R2** — Canonical Job Description Sections (employer headings preserved)  
**A8-R2** — Vault `jobs.csv` is the single Admin + Package import contract

---

## Principle

Editors interact only with stages that need judgement.  
Machine stages run automatically inside Generate.

```
Generate → Review → Approve → Promote → Export → Import → Publish
```

---

## Canonical Job Markdown (A3-R2)

The Job Markdown is the **permanent editorial source of truth**.

Generate produces ordered `job_sections` that preserve the employer’s own headings, paragraphs, and bullets — for example New Look’s “What's In It For You” or Nike’s “WHO YOU'LL WORK WITH” — rather than forcing every employer into a fixed template vocabulary.

Structured fields (`skills`, `benefits`, `software`, markets, types, experience, employment, workplace) are **enrichments extracted alongside** the editorial body. Extraction never removes content from those sections.

```
Raw Job
  ↓
Canonical Job Sections
  ├── Full Job Description (Overview + employer sections)
  ├── Skills / Benefits / Software / …
  └── Employment / Workplace / Experience
  ↓
Export → Import → Frontend
```

Frontend **Full Job Description** renders the complete editorial document. Sidebar cards (Details, Benefits, Skills, Online) continue to use structured fields.

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

1. Markdown generation (cleaners, fields, **canonical job_sections**, company identity, enrichment, assets)  
2. **Entity Resolution** (existing A4) → `resolution-report.json`  
3. **Quality** (existing A5) → `quality-report.json` + `quality-status.json`  
4. Leaves `editorial_status: canonical`

## What Generate does not do

- Approve  
- Promote to Ready  
- Export / Import / Publish  
- Rename employer headings into a fixed template  

---

## Debug / maintenance

```bash
node scripts/resolution/resolve.js --mode single --slug <slug>
node scripts/quality/check.js --mode single --slug <slug>
```

---

See `JOBS_GENERATE_TO_PROMOTE_WORKFLOW.md` for the full artifact contract.  
See PatternDesigners `JOBS_IMPORT_ARCHITECTURE.md` and Vault `JOBS_CSV_CONTRACT.md` for import.
