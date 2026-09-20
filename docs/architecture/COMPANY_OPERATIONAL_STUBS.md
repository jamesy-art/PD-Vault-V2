# Company Operational Stubs

**Date:** 2026-08-07  
**Status:** Active (A2-R13)  
**Related:** [`DRAFT_TO_STUB_SYNC.md`](./DRAFT_TO_STUB_SYNC.md), [`COMPANY_DRAFT_DISCOVERY.md`](./COMPANY_DRAFT_DISCOVERY.md)

---

## Three Company objects

| Object | Where | Role |
|--------|-------|------|
| **Vault Company Draft** | `wiki/companies/_drafts/{slug}.md` | Editorial discovery placeholder (A2-R11) |
| **Operational Company Stub** | Laravel `companies` row, non-curated | Projection so Jobs can resolve `slug` |
| **Curated Company** | Laravel `source=curated` (+ Vault `_ready` SoT) | Public catalogue company |

The Vault remains the **editorial** source of truth. Laravel operational stubs are a **projection of Vault discovery**, not a parallel editorial store.

---

## Operational stub contract

Created/updated only by draft→stub sync (or equivalent CRS `ImportedPlaceholder` create):

| Field | Value |
|-------|--------|
| `name` | From Vault draft `company` |
| `slug` | From Vault draft `slug` / `company_identity.canonical_slug` |
| `source` | `imported` |
| `is_active` | `false` |
| timestamps | Standard Eloquent |

**Never populated by sync:** overview, history, gallery, markets, products, SEO, editorial HTML.

---

## Visibility

| Surface | Stub allowed? |
|---------|---------------|
| `/admin/companies` | **Yes** |
| Jobs Import `Company::where('slug')` | **Yes** |
| Company relationships / Job FK | **Yes** |
| Public Companies API (`Company::public()`) | **No** |
| Search | **No** (`Company::public()`) |
| Sitemap / featured | **No** (public scope) |

Public visibility continues to require `source = curated` **and** existing publication rules (`is_active` + curated).

---

## Promotion

When Vault `_ready` is exported and Companies CSV is imported:

```text
same slug → update existing stub row
source: imported → curated
same company id
no duplicate
```

`CompanyCsvImporter` already upserts by slug. Sync does not change that path.

---

## Ownership

| Concern | Owner |
|---------|--------|
| Discovery queue | Vault `_drafts` |
| Operational FK projection | Laravel stub (`imported`) |
| Curated public content | Vault `_ready` → Companies CSV |

Do not invent curated Companies from Jobs Generate. Do not treat stubs as enriched catalogue pages.
