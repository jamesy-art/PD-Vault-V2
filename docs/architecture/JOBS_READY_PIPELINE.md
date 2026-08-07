# Jobs Ready Pipeline

**Date:** 2026-08-07  
**A7-R1 / A7-R2 / A3-R1** — Ready under `_ready/`; Generate orchestrates Resolve + Quality

---

## 1. Full directory trace (one Job)

```
raw/_jobs/…                          ← immutable capture
        ↓
node scripts/markdown/generate.js
  Markdown + Entity Resolution + Quality
        ↓
wiki/jobs/_staging/<editorial-slug>/
  <slug>.md                          ← editorial_status: canonical
  resolution-report.json
  quality-report.json / quality-status.json
        ↓
Editor Review (optional)
        ↓
node scripts/editorial/approve.js --mode changed --actor editor:…
  editorial_status: approved
        ↓
node scripts/ready/promote.js --mode changed
  Load staging → rewrite relative links → write Ready
        ↓
wiki/jobs/_ready/<editorial-slug>/
        ↓
node scripts/export/export.js
        ↓
exports/packages/ → import → publish
```

---

## 2. Promote modes

| Mode | CLI | Selects |
|------|-----|---------|
| `all` | `--mode all` | Every `_staging` package |
| `single` | `--mode single --slug …` | One editorial slug |
| `selection` | `--mode selection --slugs a,b` | Explicit list |
| `changed` | `--mode changed` | Hash differs vs Ready / missing Ready |
| legacy | `--canonical-dir` / `--canonical-id` | One target (still supported) |

---

## 3. Stages vs CLIs

| Stage | Directory | CLI |
|-------|-----------|-----|
| Raw | `raw/_jobs/` | capture |
| Generate (+ Resolve + Quality) | `wiki/jobs/_staging/` | `scripts/markdown/generate.js` |
| Approve | staging FM | `scripts/editorial/approve.js` |
| Ready promote | `wiki/jobs/_ready/` | `scripts/ready/promote.js` |
| Export | `exports/packages/` | `scripts/export/export.js` |

Standalone `resolve.js` / `check.js` remain for debug and targeted reprocess.

---

## 4. Permanent editor workflow

```
Raw → generate (includes resolve + quality)
  → review → approve
  → promote → export → import → publish
```
