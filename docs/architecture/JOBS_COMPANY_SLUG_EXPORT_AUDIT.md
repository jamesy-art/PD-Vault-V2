# Jobs Company Slug Export Audit (A8-R3)

**Date:** 2026-08-07  
**Status:** Audit complete — **fixed in A8-R4** (`JOBS_EXPORT_COMPANY_MAPPING.md`)  
**Package examined (pre-fix):** `exports/packages/pkg-7f604cb01b3ee8ae/jobs.csv` (14 rows)  
**Verdict:** ✅ **PASS** (root cause identified; remediated by A8-R4)

---

## Executive finding

`company_identity.canonical_slug` **is present on every generated and Ready Job** in this package (14/14).

`JobsMapping` **does not read it**.

It exports only:

```js
company_slug: str(company.slug)  // relationships.company.slug
```

(`scripts/lib/export/mappings/JobsMapping.js` — `mapRow`, **line 123**)

When Entity Resolution leaves `relationships.company: null` (8 of 14 Ready jobs — typically A2-R9 `resolver_method: new_slug`), CSV `company_slug` is blank even though `company_identity.canonical_slug` (and usually `company_assets.slug`) already holds the correct value (e.g. `home-bargains`).

**Exact loss point:** JobsMapping export mapping — not Generate, not Ready promotion, not the importer.

| Stage | `company_identity.canonical_slug` | Exported `company_slug` |
|-------|:---------------------------------:|:-----------------------:|
| Generate (staging) | Present (14/14) | — |
| Ready | Present (14/14) — **not lost in promote** | — |
| JobsMapping → CSV | Ignored | Filled only if `relationships.company.slug` (6/14) |
| Import | — | Fail-closed when blank / unknown (correct) |

---

## CSV vs Ready matrix (pkg-7f604cb01b3ee8ae)

| Company | `company_identity.canonical_slug` | A2-R9 method | `relationships.company.slug` | CSV `company_slug` | Match |
|---------|-----------------------------------|--------------|------------------------------|--------------------|-------|
| Burberry | `burberry` | exact (reused) | `burberry` | `burberry` | ✅ |
| Gap | `gap` | normalized (reused) | `gap` | `gap` | ✅ |
| Gap (Women's) | `gap` | normalized (reused) | `gap` | `gap` | ✅ |
| New Look | `new-look` | exact (reused) | `new-look` | `new-look` | ✅ |
| Nike | `nike` | normalized (reused) | `nike` | `nike` | ✅ |
| Vera Bradley | `vera-bradley` | exact (reused) | `vera-bradley` | `vera-bradley` | ✅ |
| Boll | `boll` | **new_slug** | *null* | **blank** | ❌ CI→BLANK |
| Culp, Inc. | `culp-inc` | **new_slug** | *null* | **blank** | ❌ CI→BLANK |
| Home Bargains | `home-bargains` | **new_slug** | *null* | **blank** | ❌ CI→BLANK |
| ILIV | `iliv` | **new_slug** | *null* | **blank** | ❌ CI→BLANK |
| Lands' End | `lands-end` | **new_slug** | *null* | **blank** | ❌ CI→BLANK |
| QVC Group | `qvc-group` | **new_slug** | *null* | **blank** | ❌ CI→BLANK |
| Ulster Weavers | `ulster-weavers` | **new_slug** | *null* | **blank** | ❌ CI→BLANK |
| Whistlefish | `whistlefish` | **new_slug** | *null* | **blank** | ❌ CI→BLANK |

**Summary:** 6 CSV filled · 8 CSV blank · 8 mismatches are all **CI present → export blank**.

Import outcome (14 exported → 6 imported) matches the 6 non-blank `company_slug` rows. Importer fail-closed lookup is correct and out of scope beyond confirmation.

---

## Final answers

| Question | Answer |
|----------|--------|
| Does every generated Job contain `company_identity.canonical_slug`? | **Yes** (14/14 staging in this set) |
| Does every Ready Job contain it? | **Yes** (14/14) — promotion does not drop it |
| Does JobsMapping read it? | **No** |
| What is exported instead? | `relationships.company.slug` only (`rel.company` in `mapRow`) |
| Why are some `company_slug` values blank? | ER left `relationships.company` null; mapper has no fallback to `company_identity.canonical_slug` |
| Bug class? | **Mapping / exporter bug** (wrong source field). Contributing upstream: ER only binds existing catalogue companies; A2-R9 still writes provisional slugs |
| Single canonical source for export `company_slug`? | **`company_identity.canonical_slug`** (A2-R9). JobsMapping should export that as `company_slug` for every Job (with optional defensive fallback to `relationships.company.slug` / `company_assets.slug`) |

---

## Related

- Trace: [`JOBS_COMPANY_SLUG_TRACE.md`](./JOBS_COMPANY_SLUG_TRACE.md)  
- Mapping detail: [`JOBS_EXPORT_COMPANY_MAPPING.md`](./JOBS_EXPORT_COMPANY_MAPPING.md)  
- Contract (current): [`JOBS_CSV_CONTRACT.md`](./JOBS_CSV_CONTRACT.md) § company_slug ← `relationships.company.slug`
