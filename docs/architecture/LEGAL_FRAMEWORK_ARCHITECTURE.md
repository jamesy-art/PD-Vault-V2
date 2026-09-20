# PatternDesigners — Legal Framework Architecture

**Status:** Phase 1 — Architecture review only. No legal pages drafted.
**Prepared:** 2026-08-10
**Scope:** Research synthesis of reference legal documents + recommended legal site architecture for patterndesigners.com launch and near-term roadmap.

---

## Reference Documents Reviewed

All 12 files in `raw/_terms/`:

| Document | Company | Type |
|---|---|---|
| Terms.md | DesignJobsBoard | Job board T&C (minimal) |
| Terms of Service.md | Dribbble | Marketplace/community ToS (comprehensive) |
| Terms of Service.md / Terms of Service 1.md | Patterned | Platform ToS (pattern-licensing marketplace) |
| Legal Notice.md | ProSettings (Wloka Digital GmbH) | Impressum/legal notice (EU disclosure) |
| Privacy Policy 1.md | Patterned | Privacy policy |
| Privacy policy.md | Dribbble | Privacy policy (multi-entity, sub-processor table) |
| Privacy Policy and Affiliate Disclosure.md | ProSettings | Combined privacy + affiliate + CCPA notice |
| Cookie Policy 1.md | Patterned | Cookie policy |
| Cookie policy.md | Dribbble | Cookie policy (cookie inventory table) |
| General Licensing Agreement.md | Patterned | Design licensing terms (artist/buyer neutral) |
| Buyer Licensing Agreement.md | Patterned | Buyer-side licensing terms |
| Seller Licensing Agreement.md | Patterned | Seller-side licensing terms |

These are treated strictly as **research material**. No wording is reused below; all analysis is original synthesis for PatternDesigners.

---

# 1. Executive Summary

**Recommendation: Launch with Terms of Service, Privacy Policy, and Cookie Policy as the three standalone documents, with three additional short supplementary documents merged inline into the Terms rather than published separately: Job Posting Terms, Designer Submission Terms, and Affiliate Disclosure.**

Do not launch with a large family of standalone legal pages. PatternDesigners at launch is fundamentally a **content and directory platform with one paid transactional surface** (the job board) and light user-generated content (claimed profiles, saved lists). That is a materially smaller legal surface than Dribbble (an escrowed marketplace with binding inter-user contracts) or Patterned (a licensing marketplace transferring IP rights between named parties). The competitor references confirm this pattern: Dribbble and Patterned both need marketplace-grade legal infrastructure because money and IP change hands *between users* through the platform. DesignJobsBoard and ProSettings — the two products structurally closest to PatternDesigners at launch (job board / content-and-affiliate site) — get by with a minimal Terms page and a combined Privacy/Affiliate/Cookie notice.

The reasoning for three core documents plus embedded sub-sections rather than one document or eight:

- **One document is insufficient.** Cookie consent has its own legal basis and disclosure requirements (ePrivacy Directive / UK PECR / CCPA opt-out signals) distinct from privacy processing generally, and cookie banners need a linkable target. It cannot be safely folded into a general Privacy Policy without weakening the consent mechanism.
- **Eight+ documents at launch is premature.** PatternDesigners does not yet have inter-user monetary transactions with escrow (like Dribbble Projects) or IP-transferring licensing transactions between named parties (like Patterned's Buyer/Seller/General agreements). Building three-way licensing agreements now, before the marketplace/licensing module exists, would be speculative drafting against a product that doesn't exist yet — a violation of the "don't build for hypothetical future requirements" principle applied to legal architecture, not just code.
- **Clauses that *are* launch-relevant but don't yet justify their own page** (job posting rules, designer submission/claiming rules, affiliate disclosure) are better handled as **named, anchor-linkable sections inside the Terms of Service** at launch. This keeps the footer clean (Terms | Privacy | Cookies) while still giving each topic a stable, citable location. They graduate to standalone pages later, when volume or regulatory requirements (e.g., FTC affiliate disclosure enforcement, paid job-posting disputes) justify the split — mirroring how Patterned only has a dedicated Buyer/Seller agreement architecture because it has a live two-sided marketplace with money and IP flowing between named individuals.

---

# 2. Legal Site Architecture

## 2.1 Core Documents (published, standalone)

### Terms of Service ⭐⭐⭐⭐⭐ Required at launch
**Purpose:** Governs the contractual relationship between PatternDesigners and every user (visitor, designer, company, job poster, Pro subscriber). Covers eligibility, accounts, acceptable use, IP ownership of the platform vs. user-submitted content, AI-generated content, disclaimers, liability limits, termination, governing law.
**Launch status:** Standalone, required. Everything else below is either merged into it or linked from it.

### Privacy Policy ⭐⭐⭐⭐⭐ Required at launch
**Purpose:** Discloses what personal data is collected (accounts, saved designers, analytics, newsletter signups, job applications if any), legal bases, third-party processors (Stripe, hosting, analytics, email), and jurisdiction-specific rights (GDPR/UK, CCPA/state laws).
**Launch status:** Standalone, required — cannot be merged; privacy disclosure is a distinct statutory obligation from general contract terms in essentially every applicable jurisdiction (GDPR Art. 13/14, CCPA, etc.).

### Cookie Policy ⭐⭐⭐⭐⭐ Required at launch
**Purpose:** Cookie/tracker inventory and consent mechanism disclosure, referenced by the cookie consent banner.
**Launch status:** Standalone, required if any non-essential cookies/analytics are used (Google Analytics, ad pixels, etc.), which the roadmap (analytics, affiliate tracking, Pro upsells) implies. Can start short (Dribbble/Patterned-style narrative policy) rather than a full cookie-inventory table; expand the table as more trackers are added.

## 2.2 Sections merged into Terms at launch (not standalone pages)

| Section | Why it's a Terms subsection, not standalone, at launch |
|---|---|
| **Job Posting Terms** ⭐⭐⭐⭐ | There is real money (paid job board) and real dispute risk (inaccurate listings, no-refund policy — see DesignJobsBoard precedent) here, so it needs clear, citable terms now. But volume is low enough at launch that a dedicated page is overhead; a well-labeled `## Job Postings` section with its own anchor is sufficient and can be linked directly from the posting flow. |
| **Designer/Company Submission & Claiming Terms** ⭐⭐⭐⭐ | Profile claiming, ownership disputes, and accuracy obligations are a genuine launch risk (unlike a generic marketplace, PatternDesigners populates profiles *before* the subject has agreed to anything, via aggregation). Needs explicit terms at launch but is naturally a subsection of the general "User Content" / "Accounts" logic already in the ToS. |
| **Affiliate Disclosure** ⭐⭐⭐⭐ | FTC (and equivalent) disclosure rules apply from day one if affiliate links go live (they're in the launch module list). ProSettings' pattern — a short disclosure merged with Privacy — is the right model at this scale. A one-paragraph disclosure inside the Terms (or Privacy Policy) satisfies the obligation; it does not need its own URL until affiliate revenue becomes a primary business line. |

## 2.3 Future / conditional documents

| Document | Trigger for going standalone | Rating |
|---|---|---|
| **Community Guidelines** | When reviews, comments, or open community interaction (not just directory browsing) ship. Dribbble separates this because its community actively posts and disputes content; PatternDesigners doesn't yet have that surface. | ⭐⭐⭐ Future |
| **Refund Policy** | When Pro memberships or paid job posts have varied/complex refund logic beyond "no refunds" (DesignJobsBoard's simple approach is adequate at launch). Split out once pricing tiers or promotional refund exceptions multiply. | ⭐⭐⭐ Future |
| **Designer/Buyer Licensing Agreements** (general, buyer-side, seller-side) | Only when a pattern licensing/marketplace module ships. This is the single biggest structural item Patterned's references reveal that PatternDesigners doesn't need yet — but must design for early, since retrofitting IP-transfer terms onto an existing user base is painful. See §6. | ⭐⭐⭐ Future (design now, publish at feature launch) |
| **AI Content & Editorial Disclosure** | Could stay inside Terms indefinitely, but if AI-generated descriptions/FAQs/Prompt Library become a user-facing controversy point (as they are for Patterned, which explicitly *bans* AI-submitted content — the inverse of PatternDesigners' own use of AI editorially), a standalone explainer builds trust. | ⭐⭐⭐ Future, ⭐⭐⭐⭐ if user complaints arise |
| **Data Processing Agreement (DPA) template** | When PatternDesigners has B2B customers (e.g., companies posting jobs, Pro studio accounts) who require a DPA for their own compliance. Not user-facing; provided on request. | ⭐⭐⭐ Future |
| **Marketplace/Digital Downloads Terms** | When the "Marketplace / digital downloads" future feature ships — distinct from pattern *licensing* (IP rights) because it concerns file delivery, payment, and buyer/seller marketplace mechanics generally. | ⭐⭐⭐ Future |
| **Legal Notice / Impressum** | Only if/when PatternDesigners has an EU legal entity or serves EU B2B customers who expect a formal Impressum (German/Austrian legal requirement). Not needed for a US-entity consumer-facing site. | ⭐⭐ Future, jurisdiction-dependent |

---

# 3. Clause Matrix

Legend: ✅ Covered ➖ Partial ❌ Missing (in the reference document). Last column is the recommendation for PatternDesigners.

| Clause | Patterned | Dribbble | DesignJobsBoard | ProSettings | PatternDesigners |
|---|---|---|---|---|---|
| Eligibility / age requirement | ➖ (implied via licensing agreements, 18+) | ✅ (13+, entity binding) | ❌ | ❌ | ✅ Include — 16+ or 18+ for account creation; entity-binding clause for company accounts |
| Account responsibility / security | ✅ | ✅ | ❌ | ❌ | ✅ Include — standard account security clause |
| Services license grant | ✅ (implied) | ✅ (explicit revocable license) | ❌ | ❌ | ✅ Include — simple revocable license to use the site |
| User-generated content ownership | ✅ (creator retains) | ✅ (creator retains, broad license out) | ➖ (job post license only) | ❌ | ✅ Include — designer/company retains ownership of submitted content; PatternDesigners gets a license to display/promote it |
| Platform content ownership (editorial, AI-generated) | ➖ | ✅ | ➖ | ❌ | ✅ Include, expanded — needs PatternDesigners-specific AI-generated content clause (see §4) |
| Prohibited uses / scraping ban | ➖ | ✅ (extensive) | ❌ | ❌ | ✅ Include — important given directory data is a scraping target |
| Marketplace escrow / payment intermediary | N/A (licensing, not escrow) | ✅ (extensive Projects/Escrow terms) | ❌ | ❌ | ❌ Not needed at launch — no escrowed inter-user transactions exist yet |
| IP licensing between users (buyer/seller/general) | ✅ (three full agreements) | ➖ (Final Deliverables IP assignment only) | ❌ | ❌ | ❌ Not needed at launch; design template now for future pattern-licensing module (§6) |
| Non-circumvention / anti-poaching | ❌ | ✅ (12-month clause) | ❌ | ❌ | ➖ Consider a light version once paid hiring/job-board volume is meaningful — protects the job board's commercial value from being disintermediated |
| Job posting accuracy / employer compliance | ❌ | ✅ (equal-opportunity, accuracy reps) | ✅ (basic accuracy clause) | ❌ | ✅ Include — job board is a launch module; needs accuracy, legality, and no-discrimination reps from posters |
| Job posting refund policy | ❌ | N/A | ✅ (no refunds) | ❌ | ✅ Include — adopt clear no-refund-on-cancellation stance, matching DesignJobsBoard |
| Content distribution to partners/social (job listings) | ❌ | ➖ | ✅ (explicit) | ❌ | ✅ Include — PatternDesigners likely syndicates jobs/listings; needs explicit consent clause |
| Subscriptions / auto-renewal / billing | ✅ | ✅ (detailed) | ➖ (payment via Stripe only) | ❌ | ✅ Include — Pro memberships are a launch module |
| DMCA / copyright takedown procedure | ❌ | ✅ (full DMCA notice procedure) | ❌ | ❌ | ✅ Include — directory aggregates third-party images/content; DMCA safe-harbor procedure is important risk mitigation |
| AI-generated content policy (platform-authored) | ❌ | ❌ | ❌ | ❌ | ✅ Include, PatternDesigners-specific — no competitor addresses *platform*-generated AI content because none of them do editorial AI generation the way PatternDesigners does (§4) |
| AI-generated content policy (user-submitted, banned) | ✅ (Patterned bans AI art from users) | ❌ | ❌ | ❌ | ➖ Consider — PatternDesigners doesn't sell user-submitted pattern files (yet), so this is lower priority than for Patterned, but relevant if a licensing/marketplace module ships later |
| Profile claiming / verification | ❌ | ➖ (account types only) | ❌ | ❌ | ✅ Include, PatternDesigners-specific — core to the "claim your profile" launch module (§4) |
| Disclaimer of warranties | ✅ | ✅ | ❌ | ➖ (accuracy disclaimer only) | ✅ Include — standard "as is" language |
| Limitation of liability | ✅ (capped at $1 / 1 month fees) | ✅ (capped at $100 / 6 months fees) | ❌ | ❌ | ✅ Include — cap at greater of a nominal amount or fees paid in preceding period |
| Indemnification | ✅ | ✅ (extensive) | ❌ | ❌ | ✅ Include — mutual-ish but user-to-platform focused given low transaction volume |
| Arbitration / class action waiver | ❌ | ✅ (extensive, Canada + US variants) | ❌ | ❌ | ➖ Consider for US users once Pro/paid volume grows; premature complexity at launch given small scale — flag for counsel review, not a v1 blocker |
| Governing law / venue | ✅ (Texas) | ✅ (BC / NY split) | ❌ | ❌ | ✅ Include — pick single state/country now to avoid the dual-jurisdiction complexity Dribbble carries |
| Termination rights | ✅ | ✅ | ❌ | ❌ | ✅ Include — standard mutual termination clause |
| Changes to terms | ✅ | ✅ | ❌ | ❌ | ✅ Include — standard "continued use = acceptance" clause |
| Privacy — data categories collected | ✅ (detailed) | ✅ (very detailed, table format) | ❌ | ➖ (log files, comments only) | ✅ Include — table format for clarity, sized to actual data collected (don't copy Dribbble's marketplace-scale table) |
| Privacy — legal bases (GDPR) | ✅ | ✅ (extensive, per-purpose table) | ❌ | ❌ | ✅ Include — simplified version; full per-purpose table is overkill until EU traffic is material, but the six legal-basis framework should be present |
| Privacy — state-by-state US rights (CCPA/CPA/CDPA/etc.) | ✅ (very thorough, 8 states) | ✅ (CCPA-focused) | ❌ | ✅ (CCPA-only, detailed) | ✅ Include — CCPA baseline is non-negotiable if any CA users exist (guaranteed); expand to multi-state only once legal budget allows |
| Privacy — sub-processor / third-party disclosure table | ➖ (narrative only) | ✅ (detailed table) | ❌ | ➖ (named: Stripe, GA, AWS) | ✅ Include — even a short table (Stripe, hosting, analytics, email) builds trust and is good practice regardless of size |
| Privacy — children's privacy | ✅ (under 18) | ➖ (implied via 13+ eligibility) | ❌ | ❌ | ✅ Include — simple "not directed at children under 13/16" clause |
| Privacy — data breach notification | ✅ | ➖ (implied) | ❌ | ❌ | ✅ Include — brief good-faith notification commitment |
| Privacy — Do Not Track / GPC signals | ✅ | ➖ | ❌ | ❌ | ✅ Include — increasingly expected, cheap to include |
| Sensitive personal information handling | ✅ | ✅ | ❌ | ❌ | ➖ Include briefly — PatternDesigners doesn't collect health/financial data directly, but should state this explicitly rather than stay silent |
| Cookie categories (necessary/functional/analytics) | ✅ (narrative) | ✅ (detailed table + purposes) | ❌ | ➖ (basic) | ✅ Include — start with Patterned's narrative style; escalate to a table once more trackers are added |
| Cookie consent mechanism / opt-out | ➖ (browser settings only) | ➖ (browser settings + some vendor links) | ❌ | ➖ (mentions CMP for EU) | ✅ Include — needs an actual consent banner (CMP) for EU/UK visitors given global directory traffic is likely |
| Affiliate disclosure | ➖ (mentioned in Terms + Privacy) | ❌ | ❌ | ✅ (explicit FTC-style disclosure) | ✅ Include — FTC-compliant disclosure is a launch module requirement (equipment affiliate links) |
| Third-party links disclaimer | ✅ | ✅ | ❌ | ➖ | ✅ Include — standard clause, low effort, meaningful risk reduction for an aggregation-heavy directory |
| Legal notice / Impressum | N/A | N/A | ❌ | ✅ (full German Impressum) | ❌ Not needed unless EU entity/B2B requirement arises |
| Product sample / editorial independence disclosure | ❌ | ❌ | ❌ | ✅ | ➖ Consider a short note if PatternDesigners ever accepts free product/software for review (equipment affiliate module implies this is plausible) |

---

# 4. PatternDesigners-Specific Clauses

None of the four reference sets fully anticipate PatternDesigners' actual shape: a **directory-and-editorial platform that ingests and enriches third-party data about people and companies who have not necessarily agreed to anything**, layered with AI-authored content and a thin marketplace (jobs, memberships). The competitors are either pure marketplaces (money/IP between named consenting parties) or pure content-affiliate sites (no directory of real people). PatternDesigners is a hybrid, and that hybrid creates obligations none of them fully model.

**AI-generated editorial content, descriptions, and FAQs**
PatternDesigners generates descriptions and FAQs about real designers and companies using AI, often before those subjects have created an account. This is the inverse of Patterned's model (which *bans* AI content from users) and unaddressed by any reference document, because none of them generate AI content *about* third parties for public display. Needs: a clause disclosing that some profile content is AI-assisted/AI-generated from public sources, a correction/dispute mechanism for subjects who find the AI-generated content inaccurate, and a boundary on what AI content is allowed to claim (no fabricated quotes, credentials, or client relationships).

**Designer/company profile claiming**
Profiles are created *for* people via aggregation/ingestion before they exist as users. This raises questions no marketplace ToS answers: what happens when the real designer disputes an unclaimed profile's content, how ownership transfers upon claim, what happens to pre-claim AI-generated content once a real person takes over editorial control, and what recourse exists for removal requests from people who never opted in to being listed. This is closer to a "right of reply" / data-subject-style clause than a standard UGC clause.

**Company profile ownership vs. designer profile ownership**
Two different claiming flows with different verification bars (an individual claiming their own designer profile vs. a company representative claiming a company page) need distinct authority representations — who can bind a company to claim its profile, and what happens on internal disputes over a single company account.

**Verification badges / Studio badges**
These are trust signals PatternDesigners itself issues. Needs a clause on what a badge does and doesn't represent (not a guarantee of quality/legitimacy, revocable, criteria may change), to avoid the badge being read as an endorsement PatternDesigners is liable for.

**Public profile URLs and SEO landing pages**
Because directory pages rank in search and are often the *only* representation many designers have online (especially unclaimed profiles), removal/deindexing requests need an explicit path, distinct from account deletion (there may be no account to delete).

**Imported/aggregated editorial content and source attribution**
Content sourced from Pattern Cloud, Anna Goodson, and other ingestion pipelines is republished and enriched. Needs a clause covering: no claim of exclusivity over aggregated facts, good-faith sourcing, and a takedown/correction path distinct from DMCA (since much of this is factual/biographical content, not copyrighted creative work).

**Affiliate equipment recommendations**
Launch module. FTC-style "may earn a commission" disclosure at the point of the link (not just buried in a policy page) is the standard the ProSettings reference actually models well — the practice, not the legal page structure, is worth adopting.

**Job aggregation and third-party job data**
If jobs are aggregated from other boards/company sites (not just directly posted), PatternDesigners needs to disclose that some listings are sourced externally and may go stale, with a clause limiting liability for outdated/inaccurate third-party listings — distinct from the accuracy warranty required of a poster who submits directly.

**Pattern image ownership (future)**
Not needed at launch (no user-uploaded pattern files for licensing yet), but flagged now because retrofitting this is the single hardest legal migration PatternDesigners will face if it adds licensing later. See §6.

**Community moderation standards**
Currently thin (no reviews/comments at launch), but the badge, claim-dispute, and AI-content-correction systems above are all quasi-moderation decisions. Worth a single "PatternDesigners has final discretion over what appears on the platform" clause now (Patterned's model), even before formal Community Guidelines exist, so moderation actions aren't unsupported by any document.

---

# 5. Launch Recommendation

**Footer:** `Terms | Privacy | Cookies`

**Structure:**

```
/legal/terms          → Terms of Service
                          ├── §Accounts
                          ├── §User Content & Profile Claiming
                          ├── §AI-Generated Content
                          ├── §Job Postings          (anchor-linkable, cited from job-post flow)
                          ├── §Affiliate Links        (short disclosure + link to Privacy for detail)
                          ├── §Prohibited Uses
                          ├── §Intellectual Property
                          ├── §Disclaimers & Liability
                          ├── §Termination
                          └── §Governing Law
/legal/privacy         → Privacy Policy
                          ├── §Data We Collect
                          ├── §How We Use It
                          ├── §Third Parties / Sub-processors
                          ├── §Your Rights (CCPA baseline + GDPR-lite)
                          ├── §Children's Privacy
                          └── §Contact
/legal/cookies         → Cookie Policy (linked from consent banner + Privacy)
```

This matches the "simplest production-ready structure" brief: three links in the footer, everything else reachable by anchor from inside Terms or by inline disclosure at the point of relevance (job-post form, affiliate link, AI-content byline). It avoids the footer clutter of Dribbble's model (Terms + Pricing/Payment Terms + Community Guidelines + Privacy as separately-linked, separately-incorporated documents) while still giving each launch-relevant topic (jobs, claiming, AI, affiliate) a stable, citable home — which DesignJobsBoard and ProSettings, at comparable scale, do not bother to do, and which will cause problems for PatternDesigners specifically because of the AI-content and profile-claiming exposure unique to this platform.

---

# 6. Future Expansion

Split out from Terms into standalone documents **in this order**, each gated on its triggering feature shipping (not on a calendar date):

1. **Designer Reviews / Company Reviews → Community Guidelines.** The moment two-way public commentary ships, moderation standards need their own document — this is the point where PatternDesigners starts to resemble Dribbble's UGC risk profile.
2. **Pattern Licensing / Digital Downloads / Marketplace → General + Buyer + Seller Licensing Agreements.** This is the biggest future lift and should be *designed* well before it's needed: decide now (not at ship time) whether PatternDesigners will run an escrow model (Dribbble-style, platform holds funds) or a direct-license model (Patterned-style, platform merely facilitates and is not a party to the license). Patterned's three-document split (General terms all parties agree to + separate Buyer-specific + Seller-specific obligations) is the stronger pattern to imitate over Dribbble's embedded-in-ToS approach, because it keeps liability and IP-transfer language isolated from the general platform ToS and easier to amend independently as licensing terms evolve.
3. **AI Prompt Library / Creative Toolkit → AI Tools Terms.** Once users are *generating* content with PatternDesigners' own AI tools (not just consuming AI-generated editorial), a distinct terms page is needed covering output ownership, usage restrictions, and rate/quota terms — structurally different from the "AI-Generated Content" disclosure clause in §4, which concerns AI content PatternDesigners publishes *about* designers, not content users generate for themselves.
4. **Affiliate Disclosure → standalone page.** Once affiliate revenue becomes a visible, primary business line (not just an equipment-links sidebar), split it out both for FTC clarity and because it will accumulate its own detail (multiple affiliate programs, differing disclosure requirements per program).
5. **Refund Policy → standalone page.** Once Pro membership tiers, job-posting packages, or promotional pricing multiply beyond a single flat "no refunds" rule.
6. **Job Posting Terms → standalone page.** Once job board volume/revenue justifies dedicated terms with its own versioning cadence separate from the general ToS (this will likely be the first of the "merged" sections to graduate, given jobs are already a paid launch module).
7. **Additional creative websites on the same platform → shared vs. per-site legal docs.** Decide whether Terms/Privacy are single documents covering all PatternDesigners-family sites (Dribbble-style, one Group-level policy covering multiple sub-brands) or per-site documents. Given the roadmap explicitly anticipates "additional creative websites sharing the same platform," resolve this in the *account and data model* before it's resolved in legal drafting — the legal document should describe the actual data-sharing architecture, not the other way around.
8. **Legal Notice / Impressum, DPA template → add only if triggered by an EU entity, EU B2B customers requiring a DPA, or a funding/M&A event requiring formal corporate legal disclosures.**

---

## Summary Table: What to Build at Launch

| Priority | Item | Form |
|---|---|---|
| ⭐⭐⭐⭐⭐ | Terms of Service | Standalone page, with Job Postings / Claiming / AI-Content / Affiliate as named subsections |
| ⭐⭐⭐⭐⭐ | Privacy Policy | Standalone page |
| ⭐⭐⭐⭐⭐ | Cookie Policy | Standalone page, linked from consent banner |
| ⭐⭐⭐⭐ | Job Posting terms | Subsection of ToS, anchor-linked from posting flow |
| ⭐⭐⭐⭐ | Profile claiming / submission terms | Subsection of ToS |
| ⭐⭐⭐⭐ | Affiliate disclosure | Subsection of ToS or Privacy, plus inline "may earn a commission" tags at point of link |
| ⭐⭐⭐ | Everything in §6 | Design later, gated on the triggering feature shipping |
