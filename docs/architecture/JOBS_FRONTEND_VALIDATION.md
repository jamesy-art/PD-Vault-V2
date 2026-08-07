# Jobs — Frontend Validation

**Date:** 2026-08-07  
**Pages:**

| Job | URL | HTTP |
|-----|-----|------|
| Burberry | `http://127.0.0.1:3000/design-jobs/designer-textiles-and-graphics-burberry-ready-clip-490d229cfe0e2db0` | 200 |
| Nike | `http://127.0.0.1:3000/design-jobs/lead-designer-tennis-apparel-color-design-ready-clip-9451cacca5d382b8` | 200 |

API companions (both 200): `/api/v1/jobs/{same-slug}`.

Compared against Ready Markdown packages under `content/jobs/ready/`.

---

## 1. Checklist vs Ready

### Burberry

| Ready expectation | Frontend | Notes |
|-------------------|----------|-------|
| title | ✓ | Present repeatedly in HTML |
| summary | — | Empty in Ready |
| company | ✓ Burberry | |
| company logo | ✓ | `…/companies/burberry/profile/burberry-logo.webp` |
| location | ✓ London | |
| employment | ✓ Full-time | From `job_type` |
| workplace | ◐ On-site | Shown via onsite / is_remote path |
| experience | — | Empty in Ready |
| salary | — | Empty |
| benefits | — | Empty |
| skills | ✓ Textile Design | Essential Skills ← `tags` |
| software | ✗ not dedicated | API has Illustrator/Photoshop; FE does not list software |
| markets | ✗ not dedicated | API `fashion`; FE no markets block |
| types | — | Empty |
| apply URL | ✓ Apply | contactrh URL on API |
| closing date | ◐ | Publication default expiry, not Ready closing |

### Nike

| Ready expectation | Frontend | Notes |
|-------------------|----------|-------|
| title | ✓ Lead Designer… | |
| summary | ◐ | Summary not separate; Overview prose in description |
| company | ✓ Nike | Display name catalogue “Nike,” |
| company logo | ✓ | `…/nike/profile/nike-logo.png` |
| location | ✓ Beaverton | |
| employment | ✗ | Ready `unknown` → no Full-time chip |
| workplace | ✗ | Ready `unknown` → no workplace row |
| experience | ✓ Director | |
| salary / benefits | — | Empty |
| skills | ✓ | Pattern Design etc. via tags |
| software | — | Empty in Ready |
| markets / types | ✗ / — | fashion on API only |
| apply URL | ✓ | Workday |
| long Overview | ✓ | Description body length preserved |

---

## 2. Visual / structural notes

- List-related chips from Related Content appear on detail (cross-mentions of the other imported job) — expected Publication / related behaviour.  
- Slugs include `ready-clip-…` suffix from slug service — functional, not editorial-pretty (**P2**).  
- No Job-package logo embeds required; Company logo path is production ImageKit — matches asset architecture.

---

## 3. Fidelity score (frontend only)

| Job | Fidelity | Comment |
|-----|----------|---------|
| Burberry | **Strong** | Identity, logo, location, employment, apply, one skill |
| Nike | **Strong with taxonomy gap** | Prose + logo + experience; employment/workplace blank |

**Frontend layer:** does not invent fields; gaps are either empty Ready data, known FE non-binding of software/markets/types, or upstream `unknown` taxonomies.

---

## 4. Actions affecting FE perception

| Pri | Action |
|-----|--------|
| P1 | Fix Nike employment/workplace before promote so FE chips appear |
| P1 | Prefer exporting unresolved FM skills so Graphic Design / Illustration reach tags |
| P2 | Bind API `software` / `markets` / `types` on detail |
| P2 | Cleaner public slugs (less ready-id suffix noise) |
