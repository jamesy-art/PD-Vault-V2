# Jobs → Companies Discovery Alignment (A2-R12)

**Date:** 2026-08-07  
**Status:** Audit only — **no code changes**  
**Verdict:** ✅ **PASS** (both workflows documented; recommendation stated)

---

## Executive finding

Jobs have **two different unknown-employer discovery channels**. They share the same *editorial intent* (record an employer that is not yet a curated catalogue Company) but they create **different operational objects** today:

| Channel | Object created | Where it lives |
|---------|----------------|----------------|
| **Platform Jobs (approval)** | `companies` row (`source=job_post`, `is_active=true`) | Laravel DB → visible in `/admin/companies` |
| **Vault Jobs (Generate A2-R11)** | Company Draft Markdown | `wiki/companies/_drafts/{slug}.md` |

They are **not currently the same system object**. Drift is already possible. They **should be aligned conceptually** under one Company discovery lifecycle, without making Vault Generate create live curated Companies.

---

## Flow A — Platform Jobs (corrected trace)

User language often says “Admin Job Form.” Code shows a sharper split:

### A1 — Filament Admin Job create/edit (`JobResource`)

```text
Admin Job Form (Filament JobResource)
        ↓
Select company_id from existing Company::pluck
        ↓
No unknown-company create
```

| Piece | Value |
|-------|--------|
| UI | `backend-laravel/app/Filament/Admin/Resources/JobResource.php` |
| Company field | Required `company_id` select over **existing** companies |
| Create-on-type | **None** (no `createOption` / pending token) |

**Conclusion:** Direct Admin Job CRUD does **not** create Companies for unknown employers.

### A2 — Job Post submission approval (the real create path)

```text
Public / Admin job-post Submission
        ↓
Filament SubmissionResource → Approve
  (or FormSubmissionsController paths that call JobApprovalService)
        ↓
JobApprovalService::approve()
        ↓
JobApprovalService::resolveCompany()
        ↓
CompanyResolutionService::resolveForJobPost($name, $companyId)
        ↓
id → name → createCompany(..., CompanyCreationPolicy::JobPost)
        ↓
companies table row
```

| Piece | Value |
|-------|--------|
| Controller / UI | `SubmissionResource/Pages/ViewSubmission.php` (Approve); also `FormSubmissionsController` holds `JobApprovalService` |
| Service | `App\Services\JobApprovalService` |
| Method | `resolveCompany()` → `CompanyResolutionService::resolveForJobPost()` |
| Create | `CompanyResolutionService::createCompany($name, CompanyCreationPolicy::JobPost)` |
| Model | `App\Models\Company` |

### What gets created (JobPost policy)

From `CompanyCreationPolicy::JobPost` + `createCompany()` + `Company::creating`:

| Field | Value |
|-------|--------|
| `name` | Normalized display name (trim / collapse whitespace; casing preserved) |
| `slug` | Auto-generated unique slug from name if not supplied (`Company::generateUniqueSlug`) |
| `source` | `job_post` |
| `is_active` | `true` |
| Overview / markets / gallery / SEO | **Not** invented — empty / null defaults |
| Approval flag | No separate `approved` column; “curation” is `source === 'curated'` |
| Publication (public catalogue) | **Not published** — `scopePublic()` requires `is_active` **and** `source=curated` |
| Searchable in Admin | **Yes** — `/admin/companies` lists all sources |
| Appears on frontend company directory | **No** until promoted to curated |
| Usable as Job FK | **Yes** immediately — Job approval can attach `company_id` |

Enum comment (authoritative): JobPost = *“active stub, not public catalogue.”*

Admin promotion: Filament `CompanyResource` action **Promote to Curated** sets `source = curated` (does not invent editorial content).

### Related create policies (same service, different entry)

| Policy | `source` | `is_active` | Typical entry |
|--------|----------|-------------|---------------|
| `JobPost` | `job_post` | `true` | Job post approval |
| `DesignerApply` | `designer_apply` | `true` | Filament affiliation/clients pending create (`CompanySearchOptions`) |
| `ImportedPlaceholder` | `imported` | `false` | Legacy Job CSV placeholder helper (still on CRS) |
| `Csv` | `csv` | `false` (new minimal rows) | `CompanyCsvImporter` defaults |
| `Curated` | `curated` | `true` | Explicit curated create |

---

## Flow B — Vault Jobs (A2-R11)

```text
Raw Job
        ↓
Generate
        ↓
A2-R9 Company Canonical Identity
        ↓
Unknown (resolver_method: new_slug)
        ↓
A2-R11 → wiki/companies/_drafts/{slug}.md
        ↓
Job Generate continues (no Laravel Company)
        ↓
Jobs Export → Jobs Import fail-closed until Company exists in DB
```

| Piece | Value |
|-------|--------|
| Writer | `scripts/lib/markdown/companyDraftDiscovery.js` |
| Path | `wiki/companies/_drafts/{canonical-slug}.md` |
| Creates Laravel row? | **No** |
| Creates Vault `_ready`? | **No** |
| Exportable via Companies CSV? | **No** — export reads `_ready` only |

Draft FM (known facts only): `company`, `slug`, `editorial_status: draft`, `draft_reason`, `company_identity`, `source.discovered_from: jobs`, `first_seen`, `source_urls`, `discovered_jobs`.

---

## Same editorial concept?

**Intent: yes. Object: no.**

Both mean: “this employer was discovered from Jobs work and is not yet a curated catalogue Company.”

| | Laravel `job_post` row | Vault `_drafts` Markdown |
|--|------------------------|---------------------------|
| Purpose | Operational stub so a Job can attach `company_id` now | Editorial placeholder so editors can enrich before catalogue export |
| Source of truth for public catalogue | No — curated Markdown → CSV → Laravel curated is Vault-first | Yes candidate for future catalogue content |
| Unblocks Jobs Import Engine | Yes (slug exists in DB) | No (JobsImporter fail-closed) |
| Visible in Admin companies | Yes | No |
| Frontend directory | No until curated | N/A |

**Recommendation vocabulary:** call Laravel non-curated rows **operational stubs** (or **platform drafts**), and Vault files **Company Draft Markdown**. Do not treat them as interchangeable without an explicit sync rule.

---

## Can they drift?

**Yes.**

Examples:

1. Vault draft `home-bargains` exists; no Laravel row → Vault Jobs import fails; Admin may still create `job_post` Home Bargains later with a different slug/name casing.
2. Laravel `job_post` row exists from approval; Vault never gets a draft → catalogue enrichment never starts; Jobs Import may succeed while Vault `_ready` still missing.
3. Both exist with same slug but different names / enrichment → Admin promote-to-curated vs Vault CSV import can fight (CSV importer may force `source→curated` when `is_active=true`).

---

## Import pipeline: could `_drafts` become Laravel stubs?

**Architecturally possible in Laravel; not supported by current Vault export.**

| Capability | Status |
|------------|--------|
| `CompanyResolutionService::createCompany(..., JobPost\|ImportedPlaceholder\|Csv)` | Exists |
| `CompanyCsvImporter` upsert by slug; can persist `source` / `is_active` | Exists |
| Non-public stub (`source≠curated` or `is_active=false`) | Supported |
| Vault `companyCsvExport` reads `_drafts/` | **No** — `_ready` only |
| Jobs Generate creating DB rows | **Must not** (Vault-first boundary; A2-R11 explicit) |

A future alignment option (audit only — **not implementing**): export or sync Vault drafts into Laravel as **non-curated** stubs (`source=imported` or `csv`, `is_active=false`) so Jobs Import can resolve slugs, while curated public pages still require Vault `_ready` → CSV with curated discipline.

That would match Admin Jobs’ *operational* result (row exists, not public) without matching JobPost’s `is_active=true` defaults exactly — prefer inactive/imported for Vault-origin stubs to avoid accidental public promotion.

---

## Behaviour comparison

| Behaviour | Admin / Platform Jobs (A2) | Vault Jobs (A2-R11) |
|-----------|----------------------------|---------------------|
| Creates draft (editorial Markdown) | No | **Yes** (`_drafts/`) |
| Creates Company DB row | **Yes** (`source=job_post`) | No |
| Creates live **public** Company | **No** (not curated) | No |
| Visible in `/admin/companies` | **Yes** | No |
| Visible on frontend directory | No until Promote to Curated | No |
| Source of truth | Laravel row for ops; curated catalogue still Vault-first for CSV cohort | Vault Markdown |
| Editable | Filament CompanyResource | Markdown in Vault |
| Curated workflow | Promote to Curated in Admin | `_drafts` → `_staging` → `_ready` → Companies CSV → Laravel |
| Unblocks Vault Jobs Import | Yes (if slug matches) | No until Company in DB via Companies path |

---

## Final answers

1. **Does Admin / Job approval create draft or live Companies?**  
   Creates **operational Company rows** (`source=job_post`, `is_active=true`). They are **not** public catalogue Companies. They are stubs until `source` becomes `curated`.

2. **What fields are populated?**  
   Primarily `name`, auto `slug`, `source=job_post`, `is_active=true`. No invented editorial sections.

3. **Are they immediately published?**  
   **No** for the public companies directory. Jobs attached to them can still go live via job approval.

4. **Does Vault draft represent the same editorial concept?**  
   **Same discovery intent; different object.** Vault draft is editorial; Laravel stub is operational.

5. **Can the two systems drift?**  
   **Yes** — independently created, no sync.

6. **Which system should own new Company discovery?**  
   - **Vault Jobs / research capture:** Vault owns discovery → `_drafts` (already).  
   - **Platform-native job posts:** Laravel may create operational stubs at approval time (already).  
   - **Curated public catalogue:** Vault `_ready` → Companies CSV remains source of truth.

7. **Would aligning them reduce editorial work without compromising Vault-first?**  
   **Yes, if alignment means:** one lifecycle language + optional sync of Vault drafts → Laravel **non-curated** stubs to unblock Jobs Import — **without** auto-promoting to curated or skipping Vault enrichment.  
   **No, if alignment means:** Vault Generate calling `createCompany(JobPost)` and skipping Markdown — that would compromise Vault-first.

---

## Recommendation (no implementation)

Adopt a **single conceptual lifecycle**:

```text
Discovered → Enriched → Ready → Imported → Curated (public)
```

Map today’s objects:

| Stage | Vault | Laravel |
|-------|-------|---------|
| Discovered | `_drafts/` | `source=job_post\|designer_apply\|imported\|csv` (non-curated) |
| Enriched / Ready | `_staging` / `_ready` | (prefer import from Vault) |
| Curated public | CSV `source=curated` + active | `source=curated` + `is_active` |

**Do not** merge create paths blindly. Prefer:

1. Keep A2-R11 drafts as the Vault discovery queue.  
2. Keep JobPost stubs for platform submissions.  
3. Later (separate ticket): optional draft→stub sync or draft-aware Companies export for **non-public** rows so Vault Jobs Import stops failing closed on known discoveries.  
4. Never treat `_drafts` as `_ready`.

---

## Related

- [`ADMIN_VS_VAULT_COMPANY_DISCOVERY.md`](./ADMIN_VS_VAULT_COMPANY_DISCOVERY.md)  
- [`COMPANY_DRAFT_LIFECYCLE.md`](./COMPANY_DRAFT_LIFECYCLE.md)  
- [`COMPANY_DRAFT_DISCOVERY.md`](./COMPANY_DRAFT_DISCOVERY.md)  
- [`JOBS_MISSING_COMPANY_AUDIT.md`](./JOBS_MISSING_COMPANY_AUDIT.md)
