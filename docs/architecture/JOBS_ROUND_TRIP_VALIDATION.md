# Jobs — Round Trip Validation

**Date:** 2026-08-07  
**Samples:** Burberry Ready `ready-clip-490d229cfe0e2db0` · Nike Ready `ready-clip-9451cacca5d382b8`  
**Package:** `pkg-64af29096d1ce0d2` · Import session `2d266efd-2a2a-46e6-aa10-ba1c51b2f86d`

Compare: **Ready Markdown → CSV → DB → API** (Frontend detail in `JOBS_FRONTEND_VALIDATION.md`).

---

## 1. Verdict on editorial survival

**Core editorial intent survived** for both jobs: title, company slug identity, location label, apply URL, primary skills (resolved set), markets (`fashion`), Nike overview prose, Burberry employment Full-time.

**Partial / documented loss** where Ready FM / unresolved ER / missing CSV columns diverge from what Import/API store.

---

## 2. Field-by-field matrix (live)

Legend: ✓ survived · ◐ transformed · ✗ lost · — n/a / empty in Ready

### Burberry

| Field | Ready | CSV | DB / API | Survival |
|-------|-------|-----|----------|----------|
| title | Designer, Textiles and Graphics \| Burberry | ✓ | ✓ | ✓ |
| company label | Burberry | Burberry | Burberry | ✓ |
| company_slug | burberry | burberry | company_id 55 / slug burberry | ✓ |
| logo | Vault path | — | ImageKit Company logo | ✓ via Company |
| location | London, England, UK | ✓ | ✓ | ✓ |
| city / country | London / UK | ✓ | location_ref city+country | ✓ |
| state | England | ✗ no column | — | ✗ |
| employment | Full-time | Full-time | employment + job_type full-time | ✓ |
| workplace | onsite | onsite | onsite | ✓ |
| experience | empty | empty | null | — |
| skills (FM) | Textile Design, Graphic Design, Illustration | Textile Design only* | Textile Design | ◐ |
| software (FM) | Adobe PS/AI + Creative Suite | Illustrator\|Photoshop* | same | ◐ |
| markets (FM) | [] | fashion (from rel) | fashion | ✓ enrichment |
| types | [] | empty | [] | — |
| apply_url | contactrh | ✓ | ✓ | ✓ |
| overview body | thin LinkedIn card | 129 chars | description 131 | ✓ (source-thin) |
| About the Role | section present | ✗ not exported | — | ✗ |
| emails | [] | — | — | — |
| salary / pay_* | empty | empty | null | — |
| closing_date | empty | empty | expires_at set by **Publication** (+30d) | ◐ ops |

\* Export prefers `relationships.*` when non-empty; unresolved ER items stay in FM only → dropped from CSV.

### Nike

| Field | Ready | CSV | DB / API | Survival |
|-------|-------|-----|----------|----------|
| title | Lead Designer, Tennis Apparel Color Design | ✓ | ✓ | ✓ |
| company | Nike Inc. | Nike Inc. | company_name **Nike,** | ◐ catalogue |
| company_slug | nike | nike | company_id 182 | ✓ |
| logo | Vault profile paths | — | ImageKit nike-logo.png | ✓ |
| location | Beaverton, OR, US | ✓ | ✓ | ✓ |
| state | OR | ✗ | in location string only | ◐ |
| employment | unknown | unknown | unknown / job_type null | ◐ warn |
| workplace | unknown | unknown | null | ◐ warn |
| experience | Director | Director | Director | ✓ |
| skills | 5 labels (FM) | all 5 (rel empty → FM) | tags + skill_refs | ✓ |
| software | [] | empty | [] | — |
| markets | [] | fashion | fashion | ✓ enrichment |
| overview | long prose | 3288 chars | description | ✓ |
| apply_url | Workday | ✓ | ✓ | ✓ |
| salary / benefits | empty | empty | empty | — |

---

## 3. Semantic transforms (acceptable)

| Transform | Notes |
|-----------|-------|
| Section columns → `description` | Overview (etc.) composed on import |
| `employment_type` → also `job_type` slug | Burberry Full-time → full-time |
| skills → `skill_refs` + `tags` | FE Essential Skills uses tags |
| markets from ER body mention | fashion added even when FM markets [] |
| New import hidden → Publication public | Correct operational gate |
| Empty closing → Publication default expiry | Platform behaviour |

---

## 4. Genuine information loss

| Loss | Cause | Pri |
|------|-------|-----|
| Unresolved skills/software omitted when relationships non-empty | JobsMapping prefers rel labels/slugs | **P1** |
| `state` never in CSV | Contract gap | **P1** |
| Body sections About the Role / About the Company / Location / Software | Not in JobsMapping section extract | **P1** |
| Editorial company “Nike Inc.” → API “Nike,” | ER/catalogue `canonical_name` | **P2** |
| `employment_type` / `workplace_type` = `unknown` | Extraction gap on Nike | **P1** editorial |
| Software / markets / types unused on FE | FE binding | **P2** |
| PP brands not in this import | Laravel Company missing | **P0** ops for those brands |

---

## 5. Did editorial intent survive?

| Job | Intent | Survived? |
|-----|--------|-----------|
| Burberry | Luxury brand textile/graphics role, London, full-time, apply link, Burberry identity + logo | **Yes** — description remains thin (source LinkedIn card); Graphic Design / Illustration skills dropped |
| Nike | Lead color/tennis apparel design, Beaverton, Director, long role prose, Nike apply, Nike logo | **Yes** — employment/workplace unknown weakens taxonomy display |

**Overall:** Editorial journey is proven end-to-end. Remaining losses are prioritised below — not architecture redesigns.

---

## 6. Actions

### P0

1. Create/sync Laravel Companies for Home Bargains, Whistlefish, ILIV (and other PP brands) before importing those Ready jobs.

### P1

1. Export fallback: when exporting skills/software, union FM labels with relationship labels (or export unresolved FM when needs_review).  
2. Map `state` into CSV + location_ref (or append into location consistently).  
3. Export About the Role (and optionally About the Company) into description columns.  
4. Block or rewrite Ready with `employment_type` / `workplace_type` = `unknown` before promote (Quality / editorial gate).

### P2

1. Fix Nike catalogue display name (`Nike,` → Nike).  
2. FE render software / markets / types.  
3. Align Ready root to `wiki/jobs/_ready/` per vaultPaths.
