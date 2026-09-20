# Jobs Generate → Promote Workflow

**Date:** 2026-08-07  
**A3-R1** — Generate orchestrates Resolution + Quality automatically  
**A3-R2** — Canonical Job Description Sections (employer headings preserved)  
**Scope:** Canonical editorial path from Raw to Ready Promotion

---

## Permanent pipeline

```
raw/_jobs
    ↓
node scripts/markdown/generate.js
        ├── Markdown Generation
        │     └── job_sections (employer headings preserved)
        ├── Entity Resolution      ← existing A4 engine
        ├── Quality Checker        ← existing A5 engine
        └── wiki/jobs/_staging/<slug>/
              <slug>.md            ← canonical editorial source of truth
              resolution-report.json
              quality-report.json
              quality-status.json
                ↓
Editor Review (optional)
                ↓
node scripts/editorial/approve.js --mode changed --actor editor:…
                ↓
node scripts/ready/promote.js --mode changed
                ↓
wiki/jobs/_ready/<slug>/
                ↓
node scripts/export/export.js --mode changed|all
```

---

## A3-R2 — Canonical editorial document

Generate writes:

| Artifact | Role |
|----------|------|
| Body `##` sections | Employer wording preserved exactly (order, titles, paragraphs, bullets) |
| FM `job_sections[]` | `{ title, body }` ordered mirror of the Full Job Description |
| FM `skills` / `benefits` / `software` / … | Structured enrichments extracted **from** the description — not replacements |

Overview is always first (intro capture: title, location, workplace, employment — company name excluded).  
JobsMapping exports the full editorial into CSV `overview` (with headings) so Import/Frontend lose no prose. Named columns remain for back-compat.

---

## Daily editor workflow

```bash
node scripts/markdown/generate.js --raw-dir raw/_jobs
# Review generated Markdown if required
node scripts/editorial/approve.js --mode changed --actor editor:you
node scripts/ready/promote.js --mode changed
node scripts/export/export.js --mode changed
```

Generate does **not** approve, promote, or export.  
`editorial_status` stays `canonical` until Approve.

---

## Artifact contract (Promotion unchanged)

| Artifact | Written by | Location |
|----------|------------|----------|
| `resolution-report.json` | A4 via Generate (or standalone CLI) | `wiki/jobs/_staging/<slug>/` |
| `quality-report.json` | A5 via Generate (or standalone CLI) | same |
| `quality-status.json` | A5 via Generate | same |
| `editorial_status: approved` | Approve CLI only | FM on `<slug>.md` |

Promotion continues to require those three gates. No Promotion logic changes.

---

## Standalone CLIs (debug / reprocess)

```bash
node scripts/resolution/resolve.js --mode all|changed|single --slug …
node scripts/quality/check.js --mode all|changed|single --slug …
```

Still fully functional. Generate calls the same engines.

---

## Failure behaviour

| Stage | Behaviour |
|-------|-----------|
| Resolution fails | Report written; Quality skipped for that package; Generate continues batch |
| Quality fails | Reports written; package stays staging for review; Generate continues batch |
| One package fails | Remaining packages still process |

---

## Related

- `JOBS_EDITORIAL_WORKFLOW.md`
- `JOBS_READY_PIPELINE.md`
- `PROMOTION_VALIDATION_AUDIT.md`
- `JOBS_CSV_CONTRACT.md`
