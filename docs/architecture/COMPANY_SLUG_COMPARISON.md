# CompanySlug Comparison (A8-R5)

**Date:** 2026-08-07  
**Jobs CSV:** `exports/packages/pkg-ac9afd5f69d320bd/jobs.csv`  
**Companies CSV:** `exports/companies-csv/companies.csv`

---

## Legend

| Status | Meaning |
|--------|---------|
| OK | Vault Ready + CSV + Laravel agree |
| MISSING | Absent at this stage |
| PROVISIONAL | Job A2-R9 `new_slug` only — not a catalogue Company |

---

## Job company_slug matrix

| Company (editorial) | Vault slug (`_ready`) | Companies CSV slug | Laravel slug | Status |
|---------------------|----------------------|--------------------|--------------|--------|
| Burberry | burberry | burberry | burberry (id 55) | ✅ OK |
| Gap | gap | gap | gap (id 110) | ✅ OK |
| Nike | nike | nike | nike (id 182) | ✅ OK |
| New Look | new-look | new-look | new-look (id 180) | ✅ OK |
| Vera Bradley | vera-bradley | vera-bradley | vera-bradley (id 255) | ✅ OK |
| Boll | — | — | — | ❌ MISSING · PROVISIONAL (`boll`) |
| Culp, Inc. | — | — | — | ❌ MISSING · PROVISIONAL (`culp-inc`) |
| Home Bargains | — | — | — | ❌ MISSING · PROVISIONAL (`home-bargains`) |
| ILIV | — | — | — | ❌ MISSING · PROVISIONAL (`iliv`) |
| Lands' End | — | — | — | ❌ MISSING · PROVISIONAL (`lands-end`) |
| QVC Group | — | — | — | ❌ MISSING · PROVISIONAL (`qvc-group`) |
| Ulster Weavers | — | — | — | ❌ MISSING · PROVISIONAL (`ulster-weavers`) |
| Whistlefish | — | — | — | ❌ MISSING · PROVISIONAL (`whistlefish`) |

No **mismatched** or **renamed** slugs found (Vault vs CSV vs Laravel) for the working five.

No **duplicates** of the eight missing slugs under alternate names in Vault or Laravel (fuzzy search empty).

---

## Highlights

### Missing (block Jobs import)

```
boll
culp-inc
home-bargains
iliv
lands-end
qvc-group
ulster-weavers
whistlefish
```

Jobs CSV correctly exports these via A8-R4 from `company_identity.canonical_slug`.  
Laravel correctly refuses them (fail closed).

### Not renamed / not duplicate

Evidence does not support “slug mismatch after import” or “duplicate company under another slug” for these eight. They were never catalogue companies.

---

## Jobs lookup

Operational check: `Company::where('slug', Str::slug($companySlug))` — correct. Failures are data absence, not lookup bugs.
