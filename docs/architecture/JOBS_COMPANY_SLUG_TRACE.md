# Jobs Company Slug Trace (A8-R3)

**Date:** 2026-08-07  
**Status:** Audit only  
**Example:** Home Bargains → expected `company_slug=home-bargains`

---

## Pipeline

```
Raw Job
    ↓
Generate (MarkdownGenerator.generate)
    ↓
Company Canonical Identity — A2-R9
    resolveCompanyCanonicalIdentity()
    → fields.company_identity.canonical_slug
    → fields.company_assets.slug
    ↓
Company Editorial Enrichment — A2-R10
    (may set company display name; preserves identity)
    ↓
Canonical Markdown (staging)
    FM: company_identity.canonical_slug ✓
    FM: company_assets.slug ✓
    FM: relationships.company  (still unset / null until ER)
    ↓
Entity Resolution — A4 (postGeneratePipeline)
    CompanyResolver → only on Matched existing catalogue company
    → relationships.company = { id, slug, label, … }
    OR relationships.company = null  (Needs Review / NotFound / new_slug cases)
    ↓
Ready promotion
    Copies Markdown — company_identity retained ✓
    ↓
JobsMapping.mapRow
    company_slug ← relationships.company.slug ONLY
    ✗ does not read company_identity.canonical_slug
    ✗ does not read company_assets.slug
    ↓
jobs.csv
    company_slug blank when relationships.company is null
    ↓
JobsImporter
    resolveOrCreateImportedPlaceholder — reuse existing or create hidden imported stub
    blank/invalid slug fail closed
```

---

## Stage-by-stage (Home Bargains)

| Stage | Location | `home-bargains` present? |
|-------|----------|--------------------------|
| A2-R9 | `companyCanonicalIdentity.js` L41–50, L56–59 | Writes `company_identity.canonical_slug` + `company_assets.slug` (even for `new_slug`) |
| Generate stamp | `MarkdownGenerator.js` ~L169–206 | Copies identity into fields → FM via `yamlGenerator` |
| Staging MD | `wiki/jobs/_staging/…/….md` | `company_identity.canonical_slug: home-bargains` ✓ |
| Entity Resolution | `EntityResolutionEngine.js` L128–131; `CompanyResolver.js` L75–89 | **No Matched entity** → `relationships.company: null` |
| Ready MD | `wiki/jobs/_ready/home-bargains-creative-designer/….md` L22–24, L332 | CI slug ✓ · `relationships.company: null` |
| JobsMapping | `JobsMapping.js` L91–92, **L123** | `company = rel.company \|\| {}` → `company.slug` → `''` |
| CSV | `pkg-7f604cb01b3ee8ae/jobs.csv` | `company_slug` blank for Creative Designer / Home Bargains |

**Loss line:** `JobsMapping.js` **123** — `company_slug: str(company.slug)` with `company` from relationships only.

---

## Contrasting success path (Nike)

| Stage | Value |
|-------|--------|
| A2-R9 | `canonical_slug: nike`, `existing_reused: true` |
| ER | Matched → `relationships.company.slug: nike` |
| JobsMapping L123 | Exports `nike` |
| CSV | `company_slug=nike` → import can resolve |

Same mapper; different ER outcome. The slug already existed on Nike *and* Home Bargains under `company_identity`; only Nike also had `relationships.company`.

---

## Where the value is *not* lost

- Not lost in A2-R10 enrichment  
- Not lost in Ready promotion (staging CI count = ready CI count = 14)  
- Not lost because FM omits `company_identity` (it is present)  
- Not lost in the importer (blank input → fail closed by design)

---

## Dual writers of “company slug” today

| Writer | Field | When filled |
|--------|-------|-------------|
| A2-R9 | `company_identity.canonical_slug` | Always when editorial company name exists (existing **or** provisional `new_slug`) |
| A2-R9 | `company_assets.slug` | Same slug for asset folder identity |
| A4 CompanyResolver | `relationships.company.slug` | **Only** when catalogue match + auto-bind confidence |
| JobsMapping | CSV `company_slug` | **Only** from relationships |

A2-R9 and A4 share `CompanyResolutionService`, but A2-R9’s `resolveCanonicalIdentity` (L164+) emits provisional slugs; A4’s resolver does not write relationships for NotFound / Needs Review.
