---
aggregator: null
apply_url: ''
asset_resolution:
  gallery: missing
  logo: attached_existing
  profile: attached_existing
attachments: []
benefits: []
canonical_id: can-clip-f87d6446741a951e
capture_id: cap-clip-f87d6446741a951e
capture_method: print_and_pattern
capture_quality: null
captured_at: '1970-01-01T00:00:00.000Z'
city: Liverpool
closing_date: ''
company: Home Bargains
company_assets:
  exists: true
  slug: home-bargains
company_editorial: {}
company_identity:
  canonical_name: ''
  canonical_slug: home-bargains
  editorial: Home Bargains
  existing_reused: false
  resolver_method: new_slug
confidence: null
content_hash: b1e9417baf5de05581682f1359f04fc97bf538efc7c9fe4f6d3e5585723aa05b
content_version: '1'
country: United Kingdom
department: ''
doc_kind: job
editorial_quality: null
editorial_slug: home-bargains-creative-designer
editorial_status: approved
emails:
  - matthew.dunbavin@tjmorris.co.uk
employment_type: unknown
experience_level: Senior
extensions:
  resolution_review:
    engine_version: 1.0.0
    items:
      - candidate: Home Bargains
        detail: Not found in company catalogue
        resolver: company
        source_location: yaml.company
        suggestions:
          - label: Home Bargains
            reason: unknown_company
      - candidate: Adobe Creative Suite
        detail: 'Unknown: Adobe Creative Suite'
        resolver: software
        source_location: yaml.software
        suggestions:
          - label: Adobe Creative Suite
            reason: unknown_entity
      - candidate: Licensing
        detail: 'Unknown: Licensing'
        resolver: skills
        source_location: yaml.skills
        suggestions:
          - label: Licensing
            reason: unknown_entity
      - candidate: Packaging
        detail: 'Unknown: Packaging'
        resolver: skills
        source_location: yaml.skills
        suggestions:
          - label: Packaging
            reason: unknown_entity
      - candidate: Brand Guidelines
        detail: 'Unknown: Brand Guidelines'
        resolver: skills
        source_location: yaml.skills
        suggestions:
          - label: Brand Guidelines
            reason: unknown_entity
      - candidate: Pattern Design
        detail: 'Unknown: Pattern Design'
        resolver: skills
        source_location: yaml.skills
        suggestions:
          - label: Pattern Design
            reason: unknown_entity
      - candidate: Product Development
        detail: 'Unknown: Product Development'
        resolver: skills
        source_location: yaml.skills
        suggestions:
          - label: Product Development
            reason: unknown_entity
      - candidate: Liverpool
        detail: 'Unknown: Liverpool'
        resolver: location
        source_location: yaml.city
        suggestions:
          - label: Liverpool
            reason: unknown_entity
      - candidate: Liverpool, United Kingdom
        detail: 'Unknown: Liverpool, United Kingdom'
        resolver: location
        source_location: yaml.location
        suggestions:
          - label: Liverpool, United Kingdom
            reason: unknown_entity
field_provenance:
  _editorial_identity:
    source: deterministic
  asset_resolution:
    source: deterministic
  city:
    source: deterministic
  company:
    source: deterministic
  company_assets:
    source: deterministic
  company_editorial:
    source: deterministic
  company_identity:
    source: deterministic
  country:
    source: deterministic
  editorial_slug:
    source: deterministic
  emails:
    source: deterministic
  employment_type:
    source: deterministic
  experience_level:
    source: deterministic
  gallery:
    source: deterministic
  job_links:
    source: deterministic
  location:
    source: deterministic
  logo:
    source: deterministic
  profile:
    source: deterministic
  short_title:
    source: deterministic
  skills:
    source: deterministic
  software:
    source: deterministic
  source:
    source: deterministic
  summary:
    source: deterministic
  title:
    source: deterministic
  workplace_type:
    source: deterministic
gallery:
  count: 0
  exists: false
history:
  - actor: system
    at: '1970-01-01T00:00:00.000Z'
    detail: adapter=print_and_pattern
    event: first_captured
  - actor: system
    at: '1970-01-01T00:00:00.000Z'
    detail: normaliser_version=1.2.0;template=job
    event: normalised
  - actor: system
    at: '1970-01-01T00:00:00.000Z'
    detail: company:Home Bargains — Not found in company catalogue
    event: resolution_needs_review
  - actor: system
    at: '1970-01-01T00:00:00.000Z'
    detail: 'location:Liverpool — Unknown: Liverpool'
    event: resolution_needs_review
  - actor: system
    at: '1970-01-01T00:00:00.000Z'
    detail: 'location:Liverpool, United Kingdom — Unknown: Liverpool, United Kingdom'
    event: resolution_needs_review
  - actor: system
    at: '1970-01-01T00:00:00.000Z'
    detail: 'skills:Brand Guidelines — Unknown: Brand Guidelines'
    event: resolution_needs_review
  - actor: system
    at: '1970-01-01T00:00:00.000Z'
    detail: 'skills:Licensing — Unknown: Licensing'
    event: resolution_needs_review
  - actor: system
    at: '1970-01-01T00:00:00.000Z'
    detail: 'skills:Packaging — Unknown: Packaging'
    event: resolution_needs_review
  - actor: system
    at: '1970-01-01T00:00:00.000Z'
    detail: 'skills:Pattern Design — Unknown: Pattern Design'
    event: resolution_needs_review
  - actor: system
    at: '1970-01-01T00:00:00.000Z'
    detail: 'skills:Product Development — Unknown: Product Development'
    event: resolution_needs_review
  - actor: system
    at: '1970-01-01T00:00:00.000Z'
    detail: 'software:Adobe Creative Suite — Unknown: Adobe Creative Suite'
    event: resolution_needs_review
  - actor: system
    at: '1970-01-01T00:00:00.000Z'
    detail: country=gb;city=null
    event: resolved_geography
  - actor: system
    at: '1970-01-01T00:00:00.000Z'
    detail: count=1
    event: resolved_markets
  - actor: system
    at: '1970-01-01T00:00:00.000Z'
    detail: count=2
    event: resolved_skills
  - actor: editor:debug
    at: '2026-08-07T16:20:00.000Z'
    detail: editorial_status=approved
    event: editor_approved
hybrid: ''
job_links: {}
last_reviewed: '2026-08-07T16:20:00.000Z'
location: Liverpool, United Kingdom
logo:
  exists: true
  preview: ../../../assets/companies/home-bargains/profile/home-bargains-logo-preview.webp
  production: ../../../assets/companies/home-bargains/profile/home-bargains-logo.webp
markets: []
normalisation:
  ai: false
  generator_version: 1.2.0
  ruleset_version: 1.2.0
pay_currency: ''
pay_max: ''
pay_min: ''
pay_type: ''
profile:
  exists: true
provenance:
  adapter: print_and_pattern
  adapter_version: null
  capture_extra:
    description: null
    source_image: null
    source_path: /Users/jamesbrown/Documents/PD Vault V2/raw/_jobs/creative-designer-home-bargains-pp.md
    tags: []
  capture_ids:
    - cap-clip-f87d6446741a951e
  capture_timestamp: '1970-01-01T00:00:00.000Z'
  content_hash: e791eb45c067a9c400973f56f358291cec7f1edb4d878179f54ae339d6c4a079
  discovered_item_refs: []
  original_publication: null
  original_title: creative-designer-home-bargains-pp
  original_url: null
  raw_paths:
    - raw/_jobs/creative-designer-home-bargains-pp.md
  source_kinds:
    - print_and_pattern
published_date: ''
relationships:
  city: null
  collection: null
  company: null
  country:
    id: ct-gb
    label: United Kingdom
    resolution:
      confidence: 100
      matched_on: exact
      resolved_at: '1970-01-01T00:00:00.000Z'
      resolved_by: deterministic
      resolver_name: location
      resolver_version: 1.0.0
      source_location: yaml.country
    slug: gb
  designer: null
  interview: null
  markets:
    - id: mk-licensing
      label: Licensing
      resolution:
        confidence: 95
        matched_on: slug
        resolved_at: '1970-01-01T00:00:00.000Z'
        resolved_by: deterministic
        resolver_name: markets
        resolver_version: 1.0.0
        source_location: body.mention
      slug: licensing
  skills:
    - id: sk-print-design
      label: Print Design
      resolution:
        confidence: 95
        matched_on: slug
        resolved_at: '1970-01-01T00:00:00.000Z'
        resolved_by: deterministic
        resolver_name: skills
        resolver_version: 1.0.0
        source_location: yaml.skills
      slug: print-design
    - id: sk-trend-research
      label: Trend Research
      resolution:
        confidence: 95
        matched_on: alias
        resolved_at: '1970-01-01T00:00:00.000Z'
        resolved_by: deterministic
        resolver_name: skills
        resolver_version: 1.0.0
        source_location: yaml.skills
      slug: trend-research
  software: []
  types: []
remote: ''
review:
  approved_at: '2026-08-07T16:20:00.000Z'
  editor: editor:debug
  status: approved
review_notes: ''
salary: ''
schema_version: 1.0.0
short_title: Creative Designer
skills:
  - Trend Forecasting
  - Licensing
  - Packaging
  - Brand Guidelines
  - Pattern Design
  - Print Design
  - Product Development
slug: ''
software:
  - Adobe Creative Suite
source: print_and_pattern
source_url: ''
state: ''
summary: >-
  Home Bargains is hiring a Creative Designer. Come and join our team of designers here at Home Bargains in our head
  office in Liverpool. - A passionate and creative designer with experience developing product designs, print and
  pattern and artwork ready files.
title: Creative Designer
types: []
versions:
  capture_version: ''
  content_version: '1'
  editorial_version: 1.0.0
  normaliser_version: 1.2.0
  ruleset_version: 1.2.0
  schema_version: 1.0.0
  template: job
  template_version: 1.0.0
workplace_type: onsite
---

# Creative Designer

## Company

![Home Bargains logo](../../../assets/companies/home-bargains/profile/home-bargains-logo-preview.webp)

## Overview

We're Hiring!

A Creative Designer (Maternity Cover)

Come and join our team of designers here at Home Bargains

in our head office in Liverpool.

Your skills & experience should include:
- A passionate and creative designer with experience developing product designs, print and pattern and artwork ready files.
- Experience trend forecasting, working with licensing brands and keeping to branding guidelines.
- Ideally 5+ years industry experience.
- Fully competent with Adobe Creative Suite.
- Excellent communication skills.
- Able to multi task, build and develop product ranges.
- Can work well with a team and in a studio environment.
- Packaging experience desirable.

This role is in-house 5 days a week in our Liverpool head office.

Salary is competitive based on experience and skill set.

To apply for this exciting role, please send your CV and portfolio to: Matthew.Dunbavin@tjmorris.co.uk

home bargains

TOP BRANDS - BOTTOM PRICES
