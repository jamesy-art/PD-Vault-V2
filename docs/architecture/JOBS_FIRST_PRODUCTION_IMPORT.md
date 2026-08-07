# Jobs — First Production Import

**Date:** 2026-08-07  
**Actor:** `validation:first-production`  
**Scope:** First live Ready → Export → Import → Publication → API → Frontend  
**Constraint:** Validation only — no pipeline redesign.

---

## 1. Sample selection

| Preference | Used? | Reason |
|------------|:-----:|--------|
| Nike | **Yes** | Staging quality + Laravel Company `nike` (id 182) |
| Burberry | **Yes** | Staging quality + Laravel Company `burberry` (id 55) |
| Home Bargains | No | Laravel Company **MISSING** — import would fail closed |
| Whistlefish | No | Company **MISSING** |
| ILIV | No | Company **MISSING** |

**Jobs imported:** 2 real editorial packages (not fixtures).

| Ready ID | Title | Company slug |
|----------|-------|--------------|
| `ready-clip-9451cacca5d382b8` | Lead Designer, Tennis Apparel Color Design | `nike` |
| `ready-clip-490d229cfe0e2db0` | Designer, Textiles and Graphics \| Burberry | `burberry` |

---

## 2. Phase 1 — Ready

### Path taken

```
wiki/jobs/_staging/<slug>/
  → Entity Resolution
  → Quality Checker (pass_with_warnings)
  → editorial_status: approved
  → Ready promote
  → content/jobs/ready/<ready_id>/
```

| Check | Nike | Burberry |
|-------|------|----------|
| Ready Markdown | ✓ | ✓ |
| YAML valid | ✓ | ✓ |
| `relationships.company.slug` | `nike` | `burberry` |
| Asset refs (`logo` / profile) | ✓ Vault-relative | ✓ |
| Taxonomies present | employment `unknown`, experience Director | Full-time, workplace onsite |
| Quality | 90 pass_with_warnings | 95 pass_with_warnings |
| Resolution | company + markets; skills needs_review | company + skills/software/location |

**Note:** Ready packages wrote to `content/jobs/ready/` (current `ReadyWriter`). `vaultPaths.js` documents permanent `wiki/jobs/_ready/` — path drift recorded as P2 ops debt, not blocking this import.

---

## 3. Phase 2 — Export

```bash
node scripts/export/export.js \
  --mode selection \
  --ready-ids ready-clip-9451cacca5d382b8,ready-clip-490d229cfe0e2db0 \
  --type jobs
```

| Artifact | Result |
|----------|--------|
| Package | `exports/packages/pkg-64af29096d1ce0d2` |
| `jobs.csv` | 50 columns, 2 data rows |
| `manifest.json` | ✓ |
| `export_report.*` | OK |
| Job binaries in package | None (correct) |
| Company assets in package | None (correct — Company SoT) |

Export preview: can export **yes**, 0 errors.

---

## 4. Phase 3 — Import

```bash
php artisan import:package \
  "/Users/jamesbrown/Documents/PD Vault V2/exports/packages/pkg-64af29096d1ce0d2" \
  --actor=validation:first-production
```

| | Dry-run | Live |
|--|---------|------|
| Session | `ef8734d2-…` | `2d266efd-2a2a-46e6-aa10-ba1c51b2f86d` |
| Result | dry_run / creates=2 | **success** / rows=2 |
| Importer | `JobsImporter` (Import Engine) | same |
| Admin CSV | **Not used** | |

Warnings (Nike row only):

- `employment_type not in production taxonomy: unknown`
- `workplace_type not recognised: unknown`

---

## 5. Phase 4 — Database

| Job ID | Slug (truncated) | company_id | lifecycle (post-import) |
|--------|-----------------|------------|-------------------------|
| 8 | `designer-textiles-and-graphics-burberry-…` | 55 burberry | imported / hidden / closed |
| 9 | `lead-designer-tennis-apparel-color-design-…` | 182 nike | imported / hidden / closed |

| Field | Burberry (8) | Nike (9) |
|-------|--------------|----------|
| `company_name` | Burberry | Nike, *(catalogue label)* |
| `employment_type` / `job_type` | Full-time / full-time | unknown / null |
| `workplace_type` / `is_remote` | onsite / false | null / false |
| `experience_level` | null | Director |
| `skill_refs` / `tags` | Textile Design | Pattern Design, Colour, … |
| `software_refs` | Illustrator, Photoshop | [] |
| `market_refs` | fashion | fashion |
| types pivot | empty | empty |
| `apply_url` | Burberry contactrh URL | Nike Workday URL |
| `description` length | 131 (thin LinkedIn card) | 3288 (Overview prose) |

---

## 6. Phase 5 — Publication

```php
PublicationFacade::publish('jobs', $id, 'validation:first-production');
```

| Job | Session | Result |
|-----|---------|--------|
| 8 Burberry | `aaf9fe24-…` | published |
| 9 Nike | `81f2e22b-…` | published |

Post-publish both: `lifecycle=published`, `visibility=public`, `status=open`, `is_active=true`.

**Delivery intents (both):** ISR detail + list, facets cache, `search:jobs` / reindex, sitemap, notification prepare. Related content present on API (`related_jobs`).

---

## 7. Phase 6 — API

HTTP `200` for:

- `/api/v1/jobs/designer-textiles-and-graphics-burberry-ready-clip-490d229cfe0e2db0`
- `/api/v1/jobs/lead-designer-tennis-apparel-color-design-ready-clip-9451cacca5d382b8`

| Concern | Result |
|---------|--------|
| Company identity (`slug` + nested company) | ✓ burberry / nike |
| Company logo URL (ImageKit profile) | ✓ |
| Taxonomies (where set) | ✓ Burberry full-time/onsite; Nike Director + markets |
| Skills / software / markets | ✓ as imported (see round-trip doc for losses vs Ready FM) |
| Apply URL | ✓ |

---

## 8. Phase 7 — Frontend

HTTP `200` for both public pages under `/design-jobs/{slug}`.

Spot-check (HTML):

| Signal | Burberry | Nike |
|--------|----------|------|
| Title / company name | ✓ | ✓ |
| Company logo ImageKit | burberry-logo.webp | nike-logo.png |
| Location | London | Beaverton |
| Employment | Full-time | *(none — unknown)* |
| Experience | — | Director |
| Essential skill Textile Design | ✓ | Pattern Design tags present via API path |
| Apply | ✓ | ✓ |

Software / markets / types: not rendered as dedicated FE sections (known FE gap).

---

## 9. Commands reference (reproduce)

```bash
# Vault
node scripts/resolution/resolve.js --canonical-dir wiki/jobs/_staging/<slug>
node scripts/quality/check.js --canonical-dir wiki/jobs/_staging/<slug>
# set editorial_status approved, then:
node scripts/ready/promote.js --canonical-dir wiki/jobs/_staging/<slug> --actor …
node scripts/export/export.js --mode selection --ready-ids … --type jobs

# Laravel
php artisan import:package <vault>/exports/packages/pkg-… --actor=…
# then PublicationFacade publish
```

---

## 10. Bottom line

The **first live production import succeeded** for Nike + Burberry: Ready → package → Import Engine → DB → Publication → API 200 → Frontend 200 with Company logos attached via Company FK.

Expansion to Home Bargains / Whistlefish / ILIV is blocked only by missing Laravel Companies — not by CSV/import architecture.
