# Admin vs Vault Company Discovery

**Date:** 2026-08-07  
**Status:** Audit only (A2-R12) — **no code changes**

Side-by-side reference for the two Jobs unknown-Company flows.

---

## Corrected Flow A (Platform)

```text
Job-post Submission (not Filament JobResource create)
        ↓
Approve (SubmissionResource / JobApprovalService)
        ↓
CompanyResolutionService::resolveForJobPost
        ↓
createCompany(..., JobPost)
        ↓
companies row (source=job_post, is_active=true)
        ↓
Visible in /admin/companies
        ↓
Not on frontend until Promote to Curated
```

**Filament Job form** (`JobResource`): selects existing companies only — **no** unknown create.

---

## Flow B (Vault)

```text
Raw Job → Generate → A2-R9 new_slug
        ↓
A2-R11 wiki/companies/_drafts/{slug}.md
        ↓
Editor enrich → _staging → _ready → Companies CSV → Laravel
        ↓
Future Jobs resolve (exact / alias)
```

Jobs Import Engine (`JobsImporter`) **never** creates Companies; fail-closed on missing slug.

---

## Trace table (Platform create)

| Step | Location |
|------|----------|
| Approve UI | `Filament/.../SubmissionResource/Pages/ViewSubmission.php` |
| Service | `App\Services\JobApprovalService::approve` → `resolveCompany` |
| CRS method | `CompanyResolutionService::resolveForJobPost` |
| Create | `createCompany($name, CompanyCreationPolicy::JobPost)` |
| Model | `App\Models\Company` |
| Public gate | `scopePublic()` → `is_active && source === 'curated'` |
| Promote | `CompanyResource` action `promoteToCurated` / `markAsCurated()` |

---

## Trace table (Vault draft)

| Step | Location |
|------|----------|
| Identity | A2-R9 `companyCanonicalIdentity.js` (unchanged by A2-R11) |
| Draft | `companyDraftDiscovery.js` → `_drafts/{slug}.md` |
| Report | Generator Report → Company Draft |
| Export | Not in `companyCsvExport` ( `_ready` only) |
| Laravel | No row until Companies import of Ready |

---

## Field / state comparison

| Concern | Platform JobPost stub | Vault `_drafts` Markdown |
|---------|----------------------|---------------------------|
| slug | Auto from name | A2-R9 `canonical_slug` |
| name / company | Normalized display name | Editorial company string |
| status / source | `source=job_post` | `editorial_status: draft`, `draft_reason: discovered_from_job` |
| is_active | `true` | N/A |
| visibility Admin | Yes | Browse Vault only |
| visibility frontend | No until curated | No |
| searchable Admin | Yes | N/A |
| discovered_jobs / capture | Not structured on Company | `discovered_jobs`, `first_seen`, `source_urls` |
| overview / markets / gallery | Empty | Must not invent |
| Job FK usable | Immediate | Only after Laravel import |

---

## Information overlap

| In both (conceptually) | Vault only | Laravel only |
|------------------------|------------|--------------|
| Employer display name | `discovered_jobs`, capture_id, source URLs, draft body notes | Numeric `id`, `is_active`, Spatie media, engagements, Filament audit trail |
| Intended slug | Full editorial Markdown path later | `user_id`, likes, profile_views, soft deletes |

---

## Same entity?

| Question | Answer |
|----------|--------|
| Same editorial concept? | **Yes** — discovered non-curated employer |
| Same system entity today? | **No** |
| Safe to have both? | Only with explicit sync / ownership rules; otherwise **drift** |
| Source of truth for catalogue content? | **Vault Markdown** |
| Source of truth for Job FK right now? | **Laravel `companies.slug`** |

---

## Behaviour matrix

| Behaviour | Admin / Platform Jobs | Vault Jobs |
|-----------|----------------------|------------|
| Creates draft Markdown | No | **Yes** |
| Creates live **public** Company | No | No |
| Creates operational Company row | **Yes** | No |
| Visible in Admin companies | **Yes** | No |
| Visible on frontend | No (until curated) | No |
| Source of truth | Laravel stub (ops); Vault for curated catalogue | Vault Markdown |
| Editable | Filament | Markdown |
| Curated workflow | Promote to Curated | `_drafts` → staging → ready → CSV |

---

## Import support for drafts → stubs

| Question | Answer |
|----------|--------|
| Does Laravel already support non-public Company creates? | **Yes** (`JobPost`, `ImportedPlaceholder`, `Csv`, etc.) |
| Could Companies import create stubs matching Admin operational behaviour? | **Yes in principle** (CSV with `source≠curated` / inactive) |
| Does Vault export `_drafts` today? | **No** |
| Should Jobs Generate call CRS create? | **No** — breaks Vault-first boundary |

---

## Recommendation

Align **lifecycle language and end goals**; do not collapse create implementations.

1. Treat Vault `_drafts` as the discovery queue for Vault Jobs.  
2. Treat Laravel `job_post` (and siblings) as operational stubs for platform intake.  
3. Keep curated public Companies on the Vault `_ready` → CSV path.  
4. Future work (separate): draft→non-curated stub sync to unblock Jobs Import without publishing incomplete Companies.

Full narrative: [`JOBS_COMPANY_DISCOVERY_ALIGNMENT.md`](./JOBS_COMPANY_DISCOVERY_ALIGNMENT.md)  
Lifecycle map: [`COMPANY_DRAFT_LIFECYCLE.md`](./COMPANY_DRAFT_LIFECYCLE.md)
