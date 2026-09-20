# Jobs Missing Company Audit (A8-R5)

**Date:** 2026-08-07  
**Status:** Audit only — **no code changes**  
**Jobs package:** `exports/packages/pkg-ac9afd5f69d320bd/jobs.csv`  
**Companies CSV:** `exports/companies-csv/companies.csv` (generated 2026-08-04, Phase 4)  
**Verdict:** ✅ **PASS** (root cause identified per company)

---

## Executive finding

Jobs import fails for eight `company_slug` values because **those companies do not exist in the operational Laravel `companies` table**.

They are also **absent from Vault `wiki/companies/_ready/`** and **absent from `companies.csv`**.

They were **never Companies-pipeline entities**. Jobs Generate (A2-R9) assigned **provisional** `company_identity.canonical_slug` values (`resolver_method: new_slug`, `existing_reused: false`) so Jobs export could emit a slug. That slug has nowhere to resolve in Laravel.

```
Company Markdown          ← MISSING for the 8 failures
        ↓
Company Ready             ← MISSING
        ↓
Companies CSV             ← MISSING
        ↓
Laravel Company Import    ← never ran for these slugs
        ↓
companies table           ← NOT FOUND
        ↓
Jobs Import
        ↓
Company::where('slug', …) ← fail-closed (correct)
```

**Jobs importer is behaving correctly.** No Jobs architectural change is required.

---

## Missing companies (Laravel NOT FOUND)

| company_slug | Job (Ready) | Editorial `company` | A2-R9 |
|--------------|-------------|---------------------|-------|
| `boll` | boll-designer-home-textiles | Boll | `new_slug`, not reused |
| `culp-inc` | culp-inc-textile-designer | Culp, Inc. | `new_slug`, not reused |
| `home-bargains` | home-bargains-creative-designer | Home Bargains | `new_slug`, not reused |
| `iliv` | iliv-textiles-designer | ILIV | `new_slug`, not reused |
| `lands-end` | lands-end-cad-designer-hybrid-ny-or-wi | Lands' End | `new_slug`, not reused |
| `qvc-group` | qvc-group-apparel-print-designer-west-chester-pa | QVC Group | `new_slug`, not reused |
| `ulster-weavers` | ulster-weavers-textile-homeware-designer | Ulster Weavers | `new_slug`, not reused |
| `whistlefish` | whistlefish-middleweight-illustrator | Whistlefish | `new_slug`, not reused |

No additional Job `company_slug` failures beyond this set in the current 14-row package (5 resolve: Burberry, Gap×2, Nike, New Look, Vera Bradley).

---

## Trace per company

| company_slug | Vault `_ready` MD | Vault fuzzy name/alias | `companies.csv` | Laravel `companies.slug` | Import history |
|--------------|:-----------------:|:----------------------:|:---------------:|:------------------------:|----------------|
| boll | ❌ | ❌ no match | ❌ | ❌ NOT FOUND | **never imported** — never a Ready Company |
| culp-inc | ❌ | ❌ | ❌ | ❌ | never imported |
| home-bargains | ❌ | ❌ | ❌ | ❌ (unrelated fuzzy only) | never imported |
| iliv | ❌ | ❌ | ❌ | ❌ | never imported |
| lands-end | ❌ | ❌ | ❌ | ❌ | never imported |
| qvc-group | ❌ | ❌ | ❌ | ❌ | never imported |
| ulster-weavers | ❌ | ❌ | ❌ | ❌ | never imported |
| whistlefish | ❌ | ❌ | ❌ | ❌ | never imported |

**Not:** filtered CSV rows, validation failures, archived rows, duplicates, or Laravel renames. Evidence shows the companies were never in the Companies export cohort.

### Asset folders (not Company Markdown)

Some provisional slugs have `wiki/assets/companies/{slug}/` from Jobs asset wiring (`company_assets.exists: true` for home-bargains, iliv, ulster-weavers, whistlefish). Asset folders are **not** Company Ready documents and are **not** exported by Phase 4 Company CSV (inputs: `_ready` Markdown only).

---

## Working controls (same Jobs package)

| company_slug | Vault `_ready` | CSV | Laravel |
|--------------|:--------------:|:---:|:-------:|
| burberry | ✅ | ✅ | FOUND id=55 |
| gap | ✅ | ✅ | FOUND id=110 |
| nike | ✅ | ✅ | FOUND id=182 |
| new-look | ✅ | ✅ | FOUND id=180 |
| vera-bradley | ✅ | ✅ | FOUND id=255 |

---

## Jobs lookup confirmation

`JobsImporter::mapPayload` (`backend-laravel/.../JobsImporter.php` ~L242–248):

```php
$companySlug = trim((string) ($row['company_slug'] ?? ''));
$company = Company::query()->where('slug', Str::slug($companySlug))->first();
if ($company === null) {
    return null; // fail closed
}
```

Uses operational `companies.slug`. Correct for fail-closed Jobs import. **No Jobs pipeline bug.**

---

## Final answers

| Question | Answer |
|----------|--------|
| Which companies are missing from Laravel? | The eight provisional Job slugs above |
| Were they exported? | **No** — not in `companies.csv` |
| Were they imported? | **No** — never present to import |
| Why not? | Never created as Vault Company Markdown / never in `_ready` Companies cohort |
| Are Jobs failures entirely explained by missing Companies? | **Yes** |
| Is the Jobs importer correct? | **Yes** |
| Does anything in the Jobs pipeline need changing? | **No** for this failure class. Remediation is Companies population (create/promote/export/import those employers), not Jobs mapping |

---

## Related

- [`COMPANY_IMPORT_COVERAGE.md`](./COMPANY_IMPORT_COVERAGE.md)  
- [`COMPANY_SLUG_COMPARISON.md`](./COMPANY_SLUG_COMPARISON.md)  
- A8-R4: [`JOBS_EXPORT_COMPANY_MAPPING.md`](./JOBS_EXPORT_COMPANY_MAPPING.md)
