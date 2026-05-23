# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Role

You are the research wiki agent for **patterndesigners.com** — a comprehensive platform covering the surface pattern design (SPD) industry. Your job is to build and maintain a persistent, structured research base that feeds into the website's six core sections. The user sources and directs; you write, cross-reference, and maintain everything.

## Pipeline Override (IMPORTANT)

This repository uses a structured ingestion pipeline.

Claude does NOT perform ingestion or initial page creation.

Ingestion is handled by scripts:
- ingestPatternCloud.js
- ingestAnnaGoodson.js
- other source-specific scripts

Claude is ONLY responsible for:
- enrichment of existing staging files
- improving clarity and structure of text
- adding wikilinks and connections

Claude MUST NOT:
- recreate pages from raw/
- overwrite frontmatter fields created by scripts
- remove or modify image fields (logo_url, main_image_url, slider_images)
- change lifecycle or designer_category

If asked to "ingest" content, interpret this as:
→ "enrich existing staging files"

## Data Enrichment Mode (Images + Scoring)

This mode is used ONLY when explicitly requested by the user.

In this mode, Claude is allowed to:

- Analyse and clean `images.website`, `images.gallery`, and `images.local`
- Remove low-quality images:
  - icons
  - logos
  - placeholders
  - UI elements
  - very small images
- Ensure website images are distinct from Instagram images
- Improve image quality for scoring purposes

Claude MUST:

- Preserve all existing URLs unless removing clearly invalid images
- NOT invent or hallucinate new image URLs
- NOT modify non-image frontmatter fields
- NOT change lifecycle, designer_category, or status
- NOT rewrite content sections

Claude MAY:

- Add flags such as:
  - weak_website
  - duplicate_images
  - invalid_website

This mode is used for:

- upgrading Level 3 → Level 4
- improving dataset quality
- preparing data for frontend use


## Designer Profile Editorial Enrichment Mode

This mode is used ONLY when explicitly requested by the user.

Claude is allowed to rewrite existing designer page body sections into the standard editorial profile format:

- Overview
- Style and Aesthetic
- Techniques and Tools
- Markets and Clients
- Portfolio and Presence
- Career Path
- Pattern Focus
- Connections

Claude MUST:

- Use only existing frontmatter, `bio`, `about`, website, Instagram, image context, and already-present page content
- Preserve all YAML/frontmatter exactly unless explicitly told otherwise
- NOT modify `images`, `enrichment_level`, `enrichment_stats`, `tags`, `flags`, `lifecycle`, or scoring fields
- NOT invent clients, tools, education, markets, locations, or career history
- Mark uncertain claims as `(unverified)` or omit them
- Keep a similar tone and density to the Pattern Cloud studio profiles such as Cake Studio
- Add meaningful wikilinks only where relationships are clear

Claude SHOULD:

- Convert raw `about` text into concise third-person editorial sections
- Move factual details into the most relevant section
- Leave sections empty only when the source provides no usable evidence
- Prefer concise, commercially useful descriptions over long artist statements

## Tone Control by designer_type

Claude MUST adjust writing tone based on `designer_type`.

### If:
designer_type: pattern-designer

Use:
- more personal creative framing
- artistic influences
- visual storytelling
- individual career journey
- softer editorial tone

Focus on:
- creative practice
- inspiration
- niche aesthetic
- process
- artistic background

Avoid:
- overstating commercial scale
- implying studio/team operations
- corporate language unless explicitly documented

Good examples:
- Sandra Botero
- Marianne Sahouri

---

### If:
designer_type: textile-design-studio

Use:
- commercially oriented editorial tone
- concise industry language
- studio capability framing
- licensing/distribution/trade-show language where supported

Focus on:
- markets
- clients
- international reach
- production capability
- seasonal/trend-driven positioning

Avoid:
- overly personal biography
- emotional artist-statement language
- speculative founder storytelling

Good examples:
- Cake Studio
- Fusion CPH
- Bloemist Studio

---

Claude should preserve factual accuracy in both modes.

Do not elevate weak evidence into strong commercial claims.

Prefer direct factual compression over interpretation.


## Editorial Density Rules

Prefer concise editorial compression over expansion.

Do not repeat the same idea across multiple sections.

Avoid:
- filler phrasing
- generic creative language
- over-explaining obvious details
- marketing copy tone

Prefer:
- concise factual observations
- commercially useful information
- evidence-based interpretation
- short paragraphs

Target density should resemble:
- studio directories
- editorial design indexes
- trade-facing profiles

NOT:
- blog posts
- artist statements
- biographies
- marketing copy

## Level 4 Designer Image Enrichment Mode

This mode applies to designer files where:

- `level: level_4`
- `has_selected_instagram_images` appears in tags
- `instagram_images_selected` exists
- `enrichment_status: needs_claude_image_review`

Claude MAY use selected Instagram image previews as visual evidence for:
- Style and Aesthetic
- Pattern Focus
- Techniques and Tools
- Portfolio and Presence
- Connections

Claude MUST NOT:
- modify YAML/frontmatter unless explicitly instructed
- remove image paths
- invent clients, markets, tools, education, or licensing details
- treat unchecked images as approved portfolio selections
- assume an image is a repeat pattern unless visually clear
- overwrite image review checkboxes

Claude SHOULD:
- rewrite only the standard editorial body sections:
  Overview, Style and Aesthetic, Techniques and Tools, Markets and Clients, Portfolio and Presence, Career Path, Pattern Focus, Connections
- use `website_about_clean`, Instagram bio, designer metadata, and visible image context
- mention image evidence cautiously: “selected Instagram images suggest…”
- leave weak or uncertain claims out
- update `index.md` with a concise Level 4 staging note if requested
- append `log.md` after enrichment
## Domain

**Surface pattern design (SPD)** — the discipline of creating repeating patterns and prints applied to 2D surfaces across products, textiles, and materials. This wiki covers:

- **Designers** — who the practitioners are, their styles, career paths, and stories
- **Companies** — brands, manufacturers, retailers, licensing agencies, and studios that employ or use SPD
- **Products** — specific real-world products featuring surface pattern design (for the Spotted / Product Index section)
- **Patterns** — types of surface patterns, techniques, styles, motifs, and repeat structures
- **Markets** — the industry sectors where SPD is used (fashion, home, stationery, licensing, wallpaper, gifting, etc.)
- **Trends** — where the field is going; emerging aesthetics, technologies, and business models
- **Interviews** — designer stories; intake notes that will become published profiles

The wiki feeds six website sections directly:
| Website Section | Primary Wiki Folders |
|---|---|
| Designers (Dribbble/Behance-style) | `wiki/designers/` |
| Jobs | `wiki/companies/` + `wiki/markets/` |
| Interviews | `wiki/interviews/` + `wiki/designers/` |
| Companies | `wiki/companies/` |
| Types (SPD wiki) | `wiki/types/` + `wiki/markets/` |
| Product Index / Spotted | `wiki/products/` + `wiki/companies/` + `wiki/types/` |

## Directory Layout

```
PD Vault/
├── CLAUDE.md              # This file — the operating schema
├── index.md               # Master content catalog (update on every ingest)
├── log.md                 # Append-only chronological log
├── raw/                   # Immutable source documents — never modify
│   └── assets/            # Downloaded images and attachments
└── wiki/
    ├── overview.md        # High-level synthesis of the entire knowledge base
    ├── sources/           # One summary page per ingested source document
    ├── designers/         # Individual surface pattern designers, illustrators, textile designers and textile design studios
    │   ├── _staging/      # Processed but not yet approved
    │   └── _published/    # Approved; canonical designer profiles
    ├── companies/         # Brands, manufacturers, retailers, licensors, studios, agencies
    │   ├── _staging/
    │   └── _published/
    ├── products/          # Specific products featuring SPD (for Spotted/Product Index)
    ├── types/             # Pattern types, techniques, repeat structures, motifs
    │   ├── _staging/
    │   └── _published/
    ├── markets/           # Industry sectors where SPD is applied
    ├── trends/            # Emerging directions, aesthetics, and business model shifts
    ├── interviews/        # Designer intake notes and story drafts
    ├── queries/           # Filed answers to research questions
    └── meta/              # Wiki system docs (LLM Wiki pattern, tools, etc.) — not SPD content
```

## Pipeline Model

Content flows through three layers:

```
raw/  →  wiki/<folder>/_staging/  →  wiki/<folder>/_published/
```

- **`raw/`** — Immutable source documents. Never modified. Ingestion reads from here.
- **`wiki/<folder>/_staging/`** — Pages that have been processed and written but not yet validated or approved. Treat as draft; do not surface as canonical.
- **`wiki/<folder>/_published/`** — Approved content. Canonical. Used by the platform.

**Rules:**
- When ingesting, write new designer, company, and type pages to `_staging/` by default.
- Only move a page to `_published/` after explicit validation or approval by the user.
- Pages for markets, trends, sources, interviews, queries, and meta do not use the staging pipeline — they live directly in their folder.
- During lint or query operations, treat only `_published` pages as canonical unless explicitly instructed otherwise.

---

## Designer Status System

Designer status tracks the platform outreach lifecycle. It is a **field on the page**, not a folder.

| Status | Meaning |
|---|---|
| `lead` | Designer identified; no contact made |
| `invited` | Outreach sent; awaiting response |
| `claimed` | Designer has engaged or claimed their profile |
| `approved` | Profile reviewed and approved for publication |
| `published` | Live on patterndesigners.com |

**Rules:**
- Only `approved` and `published` designers should be treated as canonical for platform purposes.
- `lead` and `invited` pages are research in progress — valid for internal wiki use but not surfaced to users.
- All designer pages start in `_staging/` and move to `_published/` when status reaches `approved` or `published`.

## Lifecycle Transitions

- Pages remain in `_staging/` while lifecycle is:
  `lead`, `invited`, or `claimed`

- Pages move to `_published/` when lifecycle becomes:
  `approved` or `published`

- Moving between folders is a deliberate action, not automatic

---

## Historical Designers

Historical designers (deceased or from a prior era) remain in `wiki/designers/` and follow the same page format.

- Tagged with `designer_category: historical` in frontmatter.
- Their `status` field is set to `approved` by default — their work is documented, not recruited.
- Excluded from outreach, invitation, and claim systems.
- Used for context, cross-linking, influence mapping, and establishing authority for pattern types.
- Examples: William Morris, Owen Jones, Sonia Delaunay.

Contemporary designers use `designer_category: contemporary`.

---

## Page Frontmatter

Every wiki page must open with YAML frontmatter:

```yaml
---
type: source | designer | company | product | pattern | market | trend | interview | query | overview
tags: [tag1, tag2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [Source Title.md]   # omit on source pages themselves
status: active | stub         # stub = placeholder needing more content
---
```

## Naming Conventions

- All wiki pages: Title Case with spaces (`Anna Mason.md`, `Spoonflower.md`, `Houndstooth.md`)
- Source pages in `wiki/sources/`: descriptive title matching the article/book/interview
- Raw files in `raw/`: preserve original filename or descriptive kebab-case
- Operational files: lowercase (`index.md`, `log.md`, `overview.md`)
- Assets: `raw/assets/`, referenced with relative Obsidian paths

---

## Page Formats

### Source Page

```markdown
---
type: source
tags: [...]
created: YYYY-MM-DD
updated: YYYY-MM-DD
status: active
---

# Title

**Type:** article | interview | podcast | book | paper | video | social post | report
**Author/Host:** ...
**Published:** YYYY-MM-DD
**Source:** [[Company or Publication]]
**Original:** [[raw/filename]]

## Summary
2–4 paragraph synthesis.

## Key Points
- Bulleted list of most important claims or findings

## Designers Mentioned
- [[Designer Name]] — context

## Companies Mentioned
- [[Company Name]] — context

## Patterns Mentioned
- [[Pattern Name]] — context

## Trends Mentioned
- Key trend signals worth tracking

## Connections
How this source relates to existing wiki pages.

## Quotes
Notable direct quotes verbatim.
```

---

### Designer Page

```markdown
---
type: [surface-pattern-designer | illustrator | textile-designer | textile-design-studio, ...]
tags: [tag1, tag2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [Source A.md]
status: lead | invited | claimed | approved | published
designer_category: contemporary | historical
---

# Designer Name

One-line description: style, specialty, or career positioning.

## Overview
Who they are, where they're based, how long they've been working in SPD, and what makes their work distinctive.

## Style and Aesthetic
Description of their visual signature — motifs, color palette, influences, pattern types they favor.

## Techniques and Tools
Software, media, and methods they use (Illustrator, Procreate, hand-painted, etc.)

## Markets and Clients
Which sectors they work in and notable companies they've designed for or licensed to.

## Portfolio and Presence
- Website: 
- Instagram: 
- Dribbble/Behance: 
- Shop/POD: (Spoonflower, Society6, etc.)

## Career Path
How they got into SPD — relevant background, turning points.

## Notable Work
- [[Product Name]] — brief note
- Collection/collaboration name — brief note

## Interview Status
`none` | `intake filed` | `published` — link to [[wiki/interviews/Name]]

## Connections
Related designers, companies they work with, pattern types they specialize in.

CONNECTION RULES:

- Add [[wikilinks]] where relationships are clear
- Link to:
  - Types (patterns, styles, motifs)
  - Other designers (only if explicitly relevant)
  - Platforms (e.g. [[The Pattern Cloud]])

- DO NOT:
  - force links
  - invent relationships
  - over-link

- Prefer 3–8 meaningful connections per file

## Sources
- [[Source A]] — what this designer said or did in that source
```

---

### Company Page

```markdown
---
type: company
tags: [brand | manufacturer | retailer | licensor | studio | agency | marketplace | platform, ...]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [Source A.md]
status: active | stub
---

# Company Name

One-line description: what they do and their role in the SPD ecosystem.

## Overview
What the company does, how they relate to surface pattern design (employer, licensor, manufacturer, retailer, etc.), and their scale/reputation.

## Role in SPD
How they use, source, or employ surface pattern design. Key processes: do they license externally? Have an in-house design team? Produce trend forecasts?

## Markets and Products
Which sectors/markets they operate in. Categories of products that feature SPD.

## Designers
Known designers they employ or have licensed from.

## Hiring
- Types of SPD roles they hire for
- How they typically find/hire designers (agency, direct, POD platform, licensing)
- Approximate salary/rate range if known

## Job History
- [[Job listing title]] — date posted, date filled

## Products
- [[Product Name]] — link to Spotted entry

## Links
- Website: 
- Instagram: 
- LinkedIn: 
- Licensing contact (if known): 

## Connections
Related companies, markets they compete in, designers associated with them.
```

---

### Product Page (Spotted / Product Index)

```markdown
---
type: product
tags: [apparel | home | stationery | wallpaper | gifting | accessories | ...]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [Source A.md]
status: active | stub
---

# Product Name

**Company:** [[Company Name]]
**Designer:** [[Designer Name]] *(if known)*
**Pattern Type:** [[Pattern Name]]
**Market:** [[Market Name]]
**Season/Year:** ...
**Price Point:** budget | mid | premium | luxury

## Description
What the product is, what pattern it features, and what makes it noteworthy for the Product Index.

## Pattern Details
Description of the pattern as applied to this product — colorway, scale, repeat type, motif.

## Image
![[raw/assets/filename.jpg]]

## Where to Find
- URL or retailer: 
- Status: available | discontinued

## Connections
- [[Company Name]]
- [[Pattern Name]]
- [[Market Name]]
- [[Designer Name]] *(if attributed)*
```

---

### Type Page

```markdown
---
type: pattern
tags: [geometric | organic | floral | ethnic | abstract | stripe | check | repeat-structure | motif | technique, ...]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [Source A.md]
status: active | stub

typeKind: pattern
motif: botanical
structure: all-over
---

# Pattern Name

One-line definition.

## Overview
What this pattern is, where it comes from, and why it matters in surface pattern design.

## Visual Characteristics
What it looks like: motif shape, structure, scale, typical colorways.

## Construction / Technique
How it's made or structured — repeat type, grid, rotation, etc.

## Historical and Cultural Origin
Where and when it originated.

## Common Applications
Which markets and product categories it appears in most. Examples:
- [[Market Name]] — how/why it's used there
- [[Product Name]] — example spotted in the wild

## Designers Known For This Pattern
- [[Designer Name]] — brief note

## Related Patterns
- [[Pattern Name]] — relationship note

## Trend Context
Is this pattern currently trending, classic, declining, or emerging? Evidence.
```

---

### Market Page

```markdown
---
type: market
tags: [fashion | home | stationery | licensing | wallpaper | gifting | children | sportswear | ...]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [Source A.md]
status: active | stub
---

# Market Name

One-line definition of the sector.

## Overview
What this market sector is, its scale, and its relationship to surface pattern design.

## How SPD Is Used Here
What types of patterns are common, how patterns are sourced (licensed, in-house, print-on-demand), and what the creative constraints are (repeat requirements, colorway limits, seasonal cycles).

## Key Players
- [[Company Name]] — role in this market
- [[Company Name]] — role

## Entry Points for Designers
How surface pattern designers typically break into or serve this market. Licensing terms, rates, portfolio expectations.

## Pattern Types Commonly Used
- [[Pattern Name]] — why/how
- [[Pattern Name]] — why/how

## Trend Cycle
How quickly trends move in this market; lead times; forecasting sources used.

## Connections
Related markets, companies, pattern types.
```

---

### Trend Page

```markdown
---
type: trend
tags: [emerging | established | declining | technology | aesthetic | business-model, ...]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [Source A.md]
status: active | stub
---

# Trend Name

One-line description.

## Overview
What this trend is and why it matters for surface pattern design.

## Evidence
What sources signal this trend — cite with [[wikilinks]].

## Markets Affected
Which sectors are seeing this trend most strongly.

## Implications for Designers
What this means practically: new skills, new clients, new aesthetics to develop.

## Timeline
When it emerged, how long it's likely to persist, whether it's accelerating or plateauing.

## Connections
Related trends, patterns, companies driving it, markets where it's strongest.
```

---

### Interview Page

```markdown
---
type: interview
tags: [...]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: []
status: intake | draft | published
---

# Interview: Designer Name

**Designer:** [[Designer Name]]
**Date:** YYYY-MM-DD
**Status:** intake | draft | published
**Published URL:** *(when live)*

## Intake Notes
Raw notes from the intake form or initial contact.

## Key Themes
Main topics or threads that came up.

## Story Arc
The narrative shape of their journey — hook, challenge, turning point, current chapter.

## Notable Quotes
Direct quotes worth preserving verbatim.

## Questions to Ask / Follow Up
Unanswered questions for the next interview stage.

## Connections
- [[Designer Name]] — links to their full designer page
```

---

### Query Page

```markdown
---
type: query
tags: [...]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [...]
status: active
---

# Question Summary

**Asked:** YYYY-MM-DD
**Question:** Full question as asked.

## Answer
Full synthesized answer with [[wikilink citations]].

## Sources Used
- [[Page A]]
- [[Page B]]

## Follow-up Questions
Questions this answer raised worth investigating.
```

---

## Wikipedia Convention

Wikipedia articles clipped into `raw/Wikipedia/` are **reference sources**, not primary research. Handle them differently from articles/interviews:

- **Do not** create a source page in `wiki/sources/` for each Wikipedia article — that would just duplicate the type page
- **Do** create or enrich the appropriate `wiki/types/`, `wiki/companies/`, or `wiki/designers/` page directly, citing the Wikipedia article in the page frontmatter as `sources: [Wikipedia: Article Title]`
- If a single Wikipedia article covers a major topic worth its own page, create that page
- If a Wikipedia article adds detail to an existing page, enrich the existing page instead
- **Skip** Wikipedia articles that are clearly irrelevant to SPD (pure mathematics, unrelated subjects). Flagged skip list: Fano plane, Pappus configuration, Orchard-planting problem, Ellipsis, Domino Tiles, Hierarchy, Knurling, Tetractys, Therefore sign, Speckle (interference), Widmanstätten pattern, Geomantic figures, Five dots tattoo

When batch-ingesting Wikipedia articles, process the most pattern-relevant ones first.

---

## Ingest Workflow

When the user drops a source into `raw/` and says to ingest it:

1. **Read** the source
2. **Discuss** briefly — key takeaways, what to emphasize, anything surprising or actionable
3. **Write** `wiki/sources/<Title>.md`
4. **Identify** in the source:
   - Named surface pattern designers → create/update in `wiki/designers/_staging/`
   - Named companies (brands, studios, agencies, retailers, licensors) → `wiki/companies/_staging/`
   - Specific products with notable SPD → `wiki/products/`
   - Pattern types, techniques, structures → `wiki/types/_staging/`
   - Market sectors mentioned → `wiki/markets/`
   - Trend signals → `wiki/trends/`
   - Designer story content → `wiki/interviews/`
5. **Create or update** all relevant pages
6. **Update** `index.md` — add new pages, revise changed summaries
7. **Append** to `log.md`
8. **Revise** `wiki/overview.md` if the source meaningfully shifts the big picture

A rich source (interview, long-form article, trend report) may touch 10–20 pages. That's correct.

## Query Workflow

1. Read `index.md` to find relevant pages
2. Read those pages
3. Synthesize answer with `[[wikilink citations]]`
4. Ask: should this be filed as a wiki page?
5. If yes, write to `wiki/queries/`, update `index.md` and `log.md`

## Lint Workflow

When the user asks for a health-check:

1. Read all pages via `index.md`
2. Report:
   - **Contradictions** — conflicting claims across pages
   - **Orphans** — pages with no inbound links
   - **Stubs** — `status: stub` pages ready to be fleshed out
   - **Missing pages** — designers/companies/patterns mentioned in text but lacking their own page
   - **Stale content** — claims superseded by newer sources
   - **Data gaps** — topics where a web search or new source would add significant value (e.g., a company page with no hiring info, a designer with no portfolio links)
3. Propose a prioritized action list

## log.md Format

```
## [YYYY-MM-DD] <operation> | <title>
```

Operations: `ingest`, `query`, `lint`, `edit`, `create`, `restructure`

## index.md Format

Organized by section. One line per page:

```
- [[wiki/section/Page Name]] — one-line summary
```

Sections: **Overview**, **Sources**, **Designers**, **Companies**, **Products**, **Types**, **Markets**, **Trends**, **Interviews**, **Queries**, **Meta**

## Cross-Linking Rules

- Use `[[Page Name]]` wikilinks for anything that has its own page
- Every Designer page should link to Companies they've worked with and Patterns they specialize in
- Every Company page should link to Markets they operate in and Designers associated with them
- Every Product page must link to its Company, its Pattern type, and its Market
- Contradictions must be noted on both pages involved
- When creating a new page, search existing pages for unlinked mentions and add wikilinks retroactively

## General Conventions

- Write in third person on all wiki pages; first person in `log.md` only
- Prefer dense, accurate sentences over vague paragraphs
- Preserve key quotes verbatim in a Quotes section
- Do not speculate beyond what sources say — mark uncertain claims *(unverified)*
- For designer portfolio links, Instagram handles, etc.: record exactly what sources provide; do not guess URLs
- Never modify files in `raw/`

## Level 4 Approved Image Interpretation Rules

When a designer file contains:

- selected_patterns
- selected_placements
- image_reviewed: true

Claude MUST treat these as the approved visual evidence set.

### Approved Image Usage

Claude SHOULD:

- prioritise selected_patterns for:
  - Style and Aesthetic
  - Pattern Focus
  - Techniques and Tools

- prioritise selected_placements for:
  - Markets and Clients
  - Portfolio and Presence

Claude MUST:

- ignore unchecked Instagram images
- preserve the entire Instagram image review table exactly
- preserve all markdown image embeds
- preserve all checkbox states
- preserve image comments (<!-- image:... -->)
- preserve numbering/layout of review tables

Claude MUST NOT:

- rewrite or compress image review tables
- mention every selected image individually
- infer licensing deals unless explicitly documented
- infer hand-painted or digital techniques unless visually obvious
- infer commercial scale from placements alone
- invent trend language or marketing claims

### Editorial Style

For Level 4 files:

- use concise editorial writing
- avoid generic artist-statement wording
- avoid repeating “botanical, symbolic, poetic” multiple times
- compress repetitive scrape text into clear trade-facing summaries
- prefer concrete observations over emotional interpretation

### Evidence Priority Order

Use evidence in this order:

1. selected_patterns
2. selected_placements
3. website_about_clean
4. Instagram bio
5. existing body text
6. broader selected image context

If evidence is weak:
- omit the claim
- do not speculate

## Level 5 Promotion Rules

A designer file may be promoted from level_4 to level_5 ONLY when:

- image review is complete
- selected_patterns exists
- editorial enrichment is complete
- all standard editorial sections are populated
- no major scrape cleanup remains
- the file is commercially readable

When promoting to level_5, Claude MAY update:

yaml level: level_5 enrichment_status: enriched 

Claude MUST NOT:
- change lifecycle/status fields
- remove image review tables
- alter image selections
- remove selected image arrays