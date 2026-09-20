# Company Draft Discovery (A2-R11)

## Purpose

Jobs Generate may encounter employers that do not yet exist as catalogue Companies. Those Jobs must **not** create live Companies. They continue to fail closed at Laravel import until a real Company exists.

Editors still need a durable place to track unknown employers. **A2-R11** creates a single **Company Draft** Markdown placeholder when A2-R9 resolves `resolver_method: new_slug`.

Drafts are editorial convenience only. They are not `_staging`, not `_ready`, not CSV rows, and not Laravel Companies.

## Pipeline

```text
Raw Job
    ↓
Generate
    ↓
Company Canonical Identity (A2-R9)

Existing Company (exact / alias / normalized / reused)
    ↓
Continue normally — no draft

Unknown Company (new_slug)
    ↓
Create or update Company Draft (A2-R11)
    ↓
Continue generating Job (A2-R10 / A2-R8 / Canonical write)
```

Job generation never stops because of draft discovery.

## Draft location

```text
wiki/companies/_drafts/{canonical-slug}.md
```

Examples:

```text
wiki/companies/_drafts/home-bargains.md
wiki/companies/_drafts/iliv.md
wiki/companies/_drafts/whistlefish.md
```

One file per slug. Not folders.

## Draft content

Populate only known discovery facts:

| Field | Meaning |
|---|---|
| `company` | Editorial employer name from the Job |
| `slug` / `company_identity.canonical_slug` | Provisional slug from A2-R9 |
| `editorial_status: draft` | Not staging / ready |
| `draft_reason: discovered_from_job` | Provenance |
| `source.discovered_from: jobs` | Source system |
| `first_seen` | First capture + job slug |
| `source_urls` | Job source URL(s) |
| `discovered_jobs` | Job editorial slugs that referenced this employer |

Do **not** invent overview, history, products, markets, gallery, SEO, or marketing copy. Editors own enrichment.

## Idempotency

If `wiki/companies/_drafts/{slug}.md` already exists:

- Do **not** overwrite the file wholesale
- Append only new entries to `discovered_jobs` (and optionally `source_urls`)
- Preserve editor body and other frontmatter changes

Never create duplicate drafts for the same slug.

## When drafts are skipped

No draft when A2-R9 reports:

- `resolver_method: exact`
- `resolver_method: alias`
- `resolver_method: normalized`
- `existing_company_reused: true`

Defensive skip also applies if a catalogue file already exists under `wiki/companies/_ready/` or `_staging/` for that slug.

## Generator report

Each Job Generate report includes a **Company Draft** block:

```text
Company Draft

Created
```

or

```text
Company Draft

Existing draft updated
```

or

```text
Company Draft

Existing Company reused
```

## Editor workflow

```text
Jobs Generate
        ↓
Unknown Company
        ↓
Company Draft created (_drafts/)
        ↓
Editor enriches draft
        ↓
Move into companies/_staging
        ↓
Approve → _ready
        ↓
Companies CSV → Laravel
        ↓
Future Jobs resolve automatically (exact / alias)
```

## Boundaries (do not change)

A2-R11 does **not** modify:

- A2-R9 Company Canonical Identity
- A2-R10 Company Editorial Enrichment
- Company Ready / Companies CSV
- Jobs Export / Jobs Import
- Laravel Company creation
- Publication

Live Companies continue to follow the normal Company editorial workflow. Jobs only discover drafts.

## Implementation

| Piece | Path |
|---|---|
| Draft writer | `scripts/lib/markdown/companyDraftDiscovery.js` |
| Generate hook | `MarkdownGenerator.js` (after A2-R9, before A2-R10) |
| Report | `GeneratorReport.js` → Company Draft section |

## Validation

After Generate for the current Jobs corpus, expect drafts such as:

```text
wiki/companies/_drafts/
  boll.md
  culp-inc.md
  home-bargains.md
  iliv.md
  lands-end.md
  qvc-group.md
  ulster-weavers.md
  whistlefish.md
```

Re-running Generate must create **0** duplicate drafts and only append newly discovered jobs where appropriate.
