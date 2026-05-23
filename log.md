# Log

*Append-only chronological record. Format: `## [YYYY-MM-DD] operation | title`*

*Tip: `grep "^## \[" log.md | tail -5` prints the last 5 entries.*

---

## [2026-05-22] edit | Level 4 editorial enrichment — 5 designer profiles (alli-amanda batch)
Enriched 5 staging profiles in Level 4 Designer Image Enrichment Mode: Alliconnerillustration (Alli Conner), Amandagracedesign (Mandy Corcoran), amanda_dilworth (Amanda Dilworth), althea___studio (Althea Studio / Juana Ferreira + Constanza Macris), Allisonblackillustration (Allison Black). All standard editorial body sections written from frontmatter, website_about_clean, Instagram bio, and selected image metadata. All 5 files promoted level_4 → level_5, enrichment_status: enriched. Index updated with 5 new _level5 staging entries.

## [2026-05-22] edit | Level 5 promotion — alisonmporter
alisonmporter (Alison Porter) promoted level_4 → level_5. Image review now complete (image_reviewed: true, 8 selected_patterns, 4 selected_placements). enrichment_status updated to enriched. Index entry moved from _level4 staging to _level5 staging.

## [2026-05-22] edit | Level 4 editorial enrichment — 10 designer profiles (alex-ali batch)
Enriched 10 staging profiles in Level 4 Designer Image Enrichment Mode: alexandrabordallo, alishadestudio, alisonmporter, aliciahayesart, alicepurlstudio, aliceemilytextiles, ali.wynne.pattern, alexfoxley, alexandrakfarmer, alexandragalibert. All standard editorial body sections (Overview, Style and Aesthetic, Techniques and Tools, Markets and Clients, Portfolio and Presence, Career Path, Pattern Focus, Connections) written from frontmatter, website_about_clean, Instagram bio, and selected image metadata. 9 files promoted level_4 → level_5 (enrichment_status: enriched). alisonmporter held at level_4 — image_reviewed: false, enrichment_status: needs_image_table_review. Index and log updated.

## [2026-05-22] edit | Enriched abey_print_studio.md → Level 5
Level 4 editorial enrichment for Nisha Abey / Abey Print Studio. Updated Style and Aesthetic and Pattern Focus to reference selected portfolio images. Expanded Connections to include Review Australia collaboration and pattern type links. Promoted level_4 → level_5, enrichment_status: enriched.

## [2026-04-27] create | Wiki initialized
Set up vault structure: `raw/`, `raw/assets/`, `wiki/sources/`, `wiki/entities/`, `wiki/concepts/`, `wiki/queries/`. Created `CLAUDE.md` schema, `index.md`, `log.md`, `wiki/overview.md`.

## [2026-04-27] ingest | LLM Wiki Idea File
Ingested founding source (`raw/llm-wiki-idea.md`). Created: 1 source page, 4 concept pages (LLM Wiki, RAG, Memex, Knowledge Compilation), 3 entity pages (Vannevar Bush, Obsidian, qmd). Updated index.md and overview.md. Key takeaway: the pattern frames the LLM as a disciplined wiki maintainer, not a chatbot — the schema (CLAUDE.md) is the key differentiator.

## [2026-04-27] restructure | Renamed wiki/patterns → wiki/types; added Wikipedia convention to CLAUDE.md
Renamed folder to match website section "Types." Added Wikipedia convention to schema: Wikipedia articles create type/company pages directly, no separate source page. Flagged ~15 irrelevant Wikipedia articles to skip. Added 4 Wikipedia type pages from first batch: Paisley, Houndstooth, Islamic Geometric Patterns, Adinkra Symbols. ~50 Wikipedia articles remain to process.

## [2026-04-27] restructure | Full domain restructure for patterndesigners.com
Redesigned wiki folder structure to match website architecture. New folders: designers/, companies/, products/, patterns/, markets/, trends/, interviews/, meta/. Removed generic concepts/ and entities/. Moved all existing pages to correct new locations. Rewrote CLAUDE.md with full SPD domain, page formats for all 7 entity types, and website-section mapping. Created Surface Pattern Design core concept page. Created 6 market sector stubs (Fashion and Apparel, Home and Interior, Stationery and Paper Goods, Wallpaper and Wall Coverings, Gift and Novelty, Surface Pattern Licensing). Updated index.md and overview.md.

## [2026-04-27] ingest | Fabric and Textile Pattern Encyclopedia
Ingested exhaustive fabric pattern reference (Misty Haddock, Ivy and Pearl Boutique, 2018). Created: 1 source page, 7 concept pages (Fabric Pattern Classification, Checkered and Plaid Patterns, Stripe Patterns, Ethnic and Cultural Patterns, Animal Prints, Floral and Botanical Patterns, Pattern Layout Types), 2 entity pages (Misty Haddock, Ivy and Pearl Boutique). Updated index.md and overview.md. Key takeaway: the two-tier taxonomy (Geometric/Organic → Realistic/Stylized) is the key organizing principle; pattern layout types are a separate axis from pattern content — an underappreciated distinction in fabric design.

## [2026-04-27] ingest | Four terminology sources (batch)
Ingested four sources in a single session: Patterns in Graphic Design (Pixartprinting), Artlandia Glossary of Pattern Design (~130 terms), Surface Pattern Design Reference Guide (patternanddesign.com), Names of Common Fabric Patterns (TM Interiors). Created: 4 source pages; 28 new type pages (Pattern Design Terminology, Wallpaper Groups, Historical Eras in Pattern Design, Production Techniques, Arabesque, Batik, Chevron and Herringbone, Damask, Ditzy, Greek Key Pattern, Herati, Ikat, Indienne, Kilim, Liberty Style, Millefleurs, Moire, Moroccan Lattice, Ogee, Ombre, Optical Art, Polka Dot, Quatrefoil, Scale and Clamshell, Toile de Jouy, Trailing Patterns, Trellis and Lattice, Zellij); 1 designer page (William Morris); 7 company stubs (Designers Guild, Ian Mankin, Liberty and Co, Osborne and Little, Pierre Frey, Sanderson, Schumacher, Zoffany). Updated index.md. Key takeaway: Artlandia is now the wiki's authoritative terminology source; the 17 wallpaper groups and multi-axis pattern classification model are its most distinctive contributions; the UK interior fabric company list from TM Interiors seeds a significant new set of company pages.

## [2026-04-28] ingest | Wikipedia batch — Part 1 (sessions 1–2)
Processed ~40 of 63 relevant Wikipedia articles. Created 20 new type pages: Acheik, Adinkra Symbols, Animal Prints (enriched), Celtic Maze, Dotted Swiss, Gingham, Guilloché, Gul, Harlequin Print, Hedebo Embroidery, Ise Katagami, Lishui, Okir, Overlapping Circles Grid, Parzenica, Sunbonnet Sue, Sussi, Tartan (major), Traditional Patterns of Korea, Truchet Tile. Created 5 company pages: Burberry, Grenfell (stub), Harris Tweed, Robert Noble, Tartan Weaving Mill. Enriched 6 existing pages: Moire (Line Moiré section), Wallpaper Groups (Kaleidoscope + Escher), Tartan (Vestiarium Scoticum + Kirkin' o' the Tartan), Chevron and Herringbone (source), William Morris (Strawberry Thief detail; status → active), Robert Noble (status → active; "oldest UK business" detail). Confirmed 20+ existing pages already comprehensive (Houndstooth, Paisley, Ikat, Islamic Geometric Patterns, Stripe Patterns, Kilim motifs, Greek Key Pattern, Okir, Parzenica, Truchet Tile, Traditional Patterns of Korea, Ise Katagami, Lishui, Sunbonnet Sue, Overlapping Circles Grid). Updated index.md.

## [2026-04-28] ingest | Wikipedia batch — Part 2 (session 3, current)
Verified remaining pages from batch: Robert Noble (stub → active), all other pending checks confirmed comprehensive. Articles assessed but not yet processed into pages: African textiles, Animal print, Toile, Kilim motifs, Key pattern, Moiré pattern, Ben Day process, Halftone, Screentone, End-on-end, List of military camouflage patterns, Pattern.md, Patterns in nature, Symmetries of Culture, Talim, Sussi (already done), remaining Wikipedia articles in raw/.

## [2026-04-28] ingest | The Pattern Cloud studio directory batch (8 studios)
Ingested all new files from raw/The Pattern Cloud/. Created 8 studio pages: Bay & Brown (est. 2005, hand-painted, stub), Bloemist Studio (2014, pattern + forecasting, 5 fashion weeks, carbon-neutral), Cake Studio (womenswear/lifestyle, UK, global retail), Estúdio Icertain (2012, Brazil, siblings Caio + Isabela, CSM-trained, Première Vision Paris since 2018, organises ESTAMPAR), FAWCETT + CO (global agents, trade shows, stub), Fairbairn and Co Design (womenswear floral, licensing model), Fusion CPH (Copenhagen, Scandinavia leading, 20 years, copyright-transfer model, hand-drawn to Photoshop), Gather No Moss (35+ years, 4 markets: kids/men/women/home). Skipped separate source pages for thin listings — raw file paths recorded in studio page frontmatter. Updated index.md.

## [2026-04-28] ingest | Anona Studio | The Pattern Cloud
Ingested studio directory listing from The Pattern Cloud. Created: 1 source page (wiki/sources/Anona Studio - The Pattern Cloud.md), 1 studio page (wiki/studios/Anona Studio.md). Founded 2011, principals Sarah Leaman and Renée Shortell, hand-painted artwork, apparel and home markets. Updated index.md.

## [2026-04-28] ingest | Liz Casella | The Pattern Cloud
Ingested studio directory listing from The Pattern Cloud. Created: 1 source page (wiki/sources/Liz Casella - The Pattern Cloud.md), 1 studio page (wiki/studios/Liz Casella.md). Created new wiki/studios/ folder — new entity type for the wiki, separate from wiki/companies/. Key facts: LA/NY print studio, 18 years experience, hand-drawn techniques (watercolour, gouache, pencil, pen), fashion and home markets, global retail clients. Added Studios section to index.md. Note: two further Pattern Cloud files in raw/ (Textile Design Agent Directory, Textile Design Studios) not yet ingested — likely contain multiple studio listings.

## [2026-04-28] edit | wiki/meta/taxonomy.md — motif and structure amendments
Amended taxonomy based on wiki coverage review. motif: renamed "Stripes" → "Stripe" (singular, for consistency with structure field); added "Spiral" (covers Whorl, Celtic Maze, Guilloché); added "Medallion" (covers Gul, Herati, carpet medallion compositions); flagged "Damask" and "Tie-dye" as consumer-useful but taxonomically impure (technique/pattern-type level). structure: added "Brick" (alongside Half-drop; both are standard SPD repeat types); added "Trellis" (for trellis/lattice framework-based repeats); added "Radial" (for radiating/medallion/mandala compositions); clarified Mirror vs Symmetrical distinction in inline notes (Mirror = bilateral reflection; Symmetrical = any formal symmetry including rotational). CLAUDE.md not updated — taxonomy values are not enumerated there. Frontend codebase (/shared-ui/taxonomies.js) will need syncing before new values are usable in UI or AI classifier.

## [2026-04-28] ingest | Wikipedia batch — Part 3 (session 3, completed)
Completed ingestion of all 19 unprocessed Wikipedia articles. Created 6 new type pages: Ben Day Dots (1879 technique; comic art; Lichtenstein), Halftone (variable dot reprographic; CMYK; 1869 first printed photo), Camouflage (military pattern families; fashion adoption history), Quincunx (five-point geometric arrangement; half-drop repeat basis; Angkor Wat; Cosmatesque), Talim (Kashmiri weaving notation; kani shawls; GI-protected; digitisation effort), Whorl (spiral/concentric natural form; botanical/mollusc/fingerprint/hair/spindle subtypes). Enriched 4 existing pages: Moire (added Etymology section tracing moire → mohair → Arabic mukhayyar; added Shape Moiré subtype alongside Line Moiré; added Wikipedia: Moiré pattern to sources), Chevron and Herringbone (added Wikipedia: Herringbone (cloth) and Wikipedia: Zigzag to sources), Production Techniques (added end-on-end/fil-à-fil plain weave variant under Key weave structures), Wallpaper Groups (added Washburn & Crowe's Symmetries of Culture, 1988/Dover 2020, to sources and Related Mathematical Facts). Updated index.md with all 6 new pages. Skipped (CLAUDE.md skip list or irrelevant): Fano plane, Pappus configuration, Orchard-planting problem, Ellipsis, Domino Tiles, Hierarchy, Knurling, Tetractys, Therefore sign, Speckle (interference), Widmanstätten pattern, Geomantic figures, Five dots tattoo. Skipped (no SPD content): Patterns in nature (ecology/biology focus), Pattern (general mathematics), African textiles (duplicate of existing Ethnic and Cultural content).

## [2026-04-29] restructure | Pipeline + status system + types alignment
Introduced pipeline model: raw/ → wiki/_staging/ → wiki/_published/ for designers, companies, and types. Added _staging/ and _published/ subfolders to directory layout for those three content areas. New designer status system with lifecycle fields: lead → invited → claimed → approved → published (field on page, not folder). Added designer_category field: contemporary | historical — historical designers remain in wiki/designers/, are auto-approved, and are excluded from outreach/claim systems. Renamed wiki/patterns/ → wiki/types/ consistently across CLAUDE.md and index.md (folder, ingest workflow, index format section, and website-section mapping table). Updated index.md: added _published canonical-data note, cleaned raw/ paths in Sources and Companies sections to proper wiki/ paths, labelled William Morris as historical in Designers section. Shifted system from static wiki model to pipeline-driven architecture with explicit staging and approval gates.

## [2026-04-29] restructure | ingestion moved to scripts

- ingestion responsibility moved from Claude to source-specific scripts
- Claude role reduced to enrichment and linking only
- pipeline clarified: raw → ingest → staging → normalize → qwen → validate → Claude

## [2026-04-29] edit | enrichment batch | The Pattern Cloud Studio and Agent Directories

Enriched 62 staging files in wiki/designers/_staging/ — all files originally produced by ingestPatternCloud.js and marked "Requires enrichment". Transformed raw scraper output (duplicate headings, ## Details / ## Images / ## Links / ## Notes sections, inline image tags) into clean structured wiki profiles following the target designer page format.

Each file now has: factual Overview (1–2 paragraphs), Style and Aesthetic (where evidence existed), Techniques and Tools (where documented), Markets and Clients (with wikilinked market pages), Portfolio and Presence (verified links only), Career Path (where founding details were present), and Connections (3–6 meaningful [[wikilinks]] per file). All YAML frontmatter fields preserved exactly as written by the pipeline scripts.

Files enriched include: A3 Design Solutions, ALXNDR, And So On, Anona Studio (pre-existing), Barbara d'Avila, Cake Studio (pre-existing), Fairbairn & Co, Fawcett + Co, Found, Fusion CPH, Fusion Prints Agency, Gather No Moss, GM Print Design, Go Design Studio, Guava Print Studio, Harmony Print Studio, Heather Raney, HER Studio, Jack Jones Design, Karolina York, KATE x KASEY, Kelly Lahl, LAND, LD Print Studio, Le Studio Copenhagen, Liz Casella (pre-existing), Loook Studio, Ludico Estampas, Made in Brighton, Malene Volf Munch, Marta Caldas, Mary Jones Design, MIKSA Design Studio, Nechines Print Design Studio, Niki Park Designs, Nomad Studio, Owens and Kim, Paola Pagano, Paradox, Parchment & Pixel, Peach Coral Studio, Paul Vogel, Periscope Art, Petite Fleur Studio, Phyllis Orzalli, Plinto Studio, Popcreate, Print Patisserie, Prints of Orange, Rhi Fowler Print Design, Saltbox Print, Sam Morray, Sandra Jacobs, Sarah Biggs, Sarah Sander, See Creatures, Soge Studio, Spiral Print Studio, Studio Fennec, Studio Marimari, Studio Noir, Studio Olive, Tara Lilly, The Colorfield, The Print Queen, The Scoop In Design, Twenty Studio Lab, Verena Wacker Textildesign, Whiston & Wright, and Laura Mack Designs.

Created 2 new source pages: wiki/sources/The Pattern Cloud Studio Directory.md and wiki/sources/The Pattern Cloud Agent Directory.md. Updated index.md Sources section.

## [2026-05-12] edit | editorial enrichment batch | wiki/designers/_staging/_ic/ (batches 1–12)

Editorially enriched all 118 designer staging files in `wiki/designers/_staging/_ic/` — independent-practice designers sourced from Instagram. Work carried out across multiple sessions in 12 batches of ~10 files each.

Each file was rewritten from frontmatter fields (`bio`, `about`, website/Instagram URLs, image filenames) into the standard 8-section editorial profile format: Overview, Style and Aesthetic, Techniques and Tools, Markets and Clients, Portfolio and Presence, Career Path, Pattern Focus, Connections. All YAML frontmatter preserved exactly as written by the pipeline scripts, including corrupted values.

Key editorial decisions applied consistently:
- `designer_type: pattern-designer` → personal/artistic tone; `textile-design-studio` → commercial/industry tone
- Contact form boilerplate in `about` field discarded; bio used as sole source where relevant
- Non-English `about` text translated for editorial use without modifying frontmatter
- Image filenames used as supplementary evidence when bio/about were sparse
- Wikilinks added only to established taxonomy (countries, markets, platforms, named companies); Canada not in taxonomy — no `[[Canada]]` links used; market links in plain noun form without "Market" suffix
- Corrupted frontmatter preserved verbatim (`designer_type: 'Yes'`, `country: "Graduate Design Student (last 2 years)"` on two files)
- 3 files skipped as already enriched: `printhestitch.md` (Marianne Sahouri), `sandrabcreative.md` (Sandra Botero), `thepatternlane.md` (Savvy Tagra)

## [2026-05-12] edit | re-enrichment | kemijolaosodesign.md

Re-enriched Kemi Jolaoso's profile after the pipeline corrected a previously null `about` field with real content. Original minimal sections ("no tools documented", "background not documented") replaced with full editorial profile drawn from about text: childhood in Ibadan Nigeria, Boston College graduate, Bloomingdale's executive management training programme (exited as assistant buyer), Parsons School of Design graphic design degree, in-house and freelance design work for Christmas Tree Shops Inc., Bed Bath and Beyond, TJX, Newell Brands, and Decowraps. Tropical/West African colour-led aesthetic and Florida-based practice documented. Licensing connections added.

## [2026-05-12] edit | re-enrichment | karakellerdesigns.md

Re-enriched Kara Keller's profile. Prior sections were underwritten despite a detailed Q&A interview in the `about` field. Updated sections now reflect: single-parent motivation for launching an independent practice, gouache and watercolour hand-painting with digitisation workflow, active licensing pipeline (4 pieces in discussion at time of interview), nature-led subject matter with preference for small detail, and confirmed markets (home décor, gifting, stationery).
## [2026-05-22] edit | Level 4 enrichment → Level 5 promotion | 9 designer profiles

Editorially enriched 9 designer staging files in `wiki/designers/_staging/` using Level 4 Designer Image Enrichment Mode. Sources used: `website_about_clean`, Instagram bio/metadata, `selected_patterns`, `selected_placements`, image checkbox review. All 8 standard body sections rewritten: Overview, Style and Aesthetic, Techniques and Tools, Markets and Clients, Portfolio and Presence, Career Path, Pattern Focus, Connections. All YAML frontmatter and image review tables preserved exactly. All 9 files promoted from level_4 to level_5 (`enrichment_status: enriched`).

Files enriched and promoted:
- `_marcelopez_` (Marce Lopez) — Colombian/Madrid illustrator and SPD; botanical, poetic; clients La Casita de Wendy, Noc Noc Estudio
- `_marsuarez_` (Marcela Suarez Villa) — Barcelona/Colombian; textile illustrator; BAU Barcelona; clients Pineapples, Arkitect
- `_pippa.and.i_` (Kathleen Atkinson) — Canada; Pippa & I studio; wallpaper SPD; Decor Imprime, Wimzy Walls, Printed Decor
- `_vivdesign` (Vivian Hasenclever) — Norwegian-born, Luxembourg; whimsical animals, tropical botanical; Spoonflower; Uppercase + Origin Magazine features
- `05_anukriti` (Anukriti Didwania) — India; NIFT textile designer; floral prints, natural dyes; SUI, Nainsi Agarwal, Margarit
- `12amtoday` (Iulia Bors) — France/Romania; 12 AM Today studio; 10+ years SPD; textiles, wallpapers, video-mappings; Autour du Louvre Lens
- `50s_vintage_dame` (Sue Cadzow) — Sydney; 20+ years; retro/vintage SPD; The Illustration Room; published books and tarot deck
- `120binc` (Robin Chakraborty) — Mumbai; illustrator/designer; Coca-Cola, Hershey's, Levi's; SPD emerging alongside brand work
- `a_day_outside_` (Sara Pizzinelli) — Italy; graphic designer/illustrator; atmospheric landscape illustration; visual arts and fashion clients

Updated index.md with new Featured Designers — _level5 staging section.

## [2026-05-22] edit | Level 4 enrichment → Level 5 promotion | 10 designer profiles

Editorially enriched 10 designer staging files in `wiki/designers/_staging/` using Level 4 Designer Image Enrichment Mode. Sources used: `website_about_clean`, Instagram bio/metadata, `selected_patterns`, `selected_placements`, checked image review table entries only, existing body sections. All 8 standard body sections rewritten: Overview, Style and Aesthetic, Techniques and Tools, Markets and Clients, Portfolio and Presence, Career Path, Pattern Focus, Connections. All YAML frontmatter and image review tables preserved exactly.

8 files promoted to level_5 (`enrichment_status: enriched`):
- `alexanderadiels` (Alexander Adiels) — Sweden; illustrator/pattern designer; licensing: Robin Sprong, Fabric Bank, Cissi & Selma, Wall of Art
- `alchemiqa` (Solange Yepez) — Toronto Canada; Ryerson + RISD trained; Lead Textile Designer at Andrea Iyamah; clients: Knixwear, Gluckstein Home, JQLYN & Co
- `alarcon_studio` (Carmen Alarcón) — Spain; fashion, food, lifestyle illustration/pattern; bow motifs, gingham, tropical
- `ainamsnape_print_patterns` (Aina M Snape) — Mallorca Spain; Fine Arts + LCI Barcelona; 10+ years textile; womenswear/menswear/childrenswear
- `adelinejuliebee` (Adeline-Julie Bee) — Belgium Ardennes; watercolourist; natural inks from foraged ingredients; Spoonflower; licensing-ready; also teaches
- `abigailbryanart` (Abigail Bryan) — Cheshire UK; Theatre Design background; hand-drawn → Illustrator; Wildflower Home Interiors + Spoonflower, Yiume, Loomwell
- `aamorimmaria` (Maria Amorim) — Brazil; graphic design 2017; swimwear/womenswear/childrenswear/home; clients: PatBo, Maurices, Rio de Sol, Tori Richard, Mohala
- `a_trace_of_design` (Tracey Johnson) — Nelson Bay NSW Australia; former commercial graphic designer; 828+ Spoonflower designs; nature/vintage/travel; linocut

1 file enriched, stays level_4 (insufficient selected patterns for level_5):
- `a.d.r.i.valenzuela` (Adri Valenzuela) — Córdoba Spain; illustrator for Disimusa hand-painted fan workshop; Fine Arts trained; only 2 selected patterns

1 file enriched from text sources only, stays level_4 (image review not yet complete):
- `abey_print_studio` (Nisha Abey) — Brisbane/Byron Bay Australia; 15+ years fashion/homewares; hand-painted media + Procreate; client OLI & KUBO; `enrichment_status` remains `needs_image_table_review`

Updated index.md with new entries in Featured Designers — _level5 staging and _level4 staging sections.

## [2026-05-21] edit | Level 4 enrichment | _lulukins_.md

Editorially enriched Lee-Anne Schmidt (@_lulukins_) from level_4 staging file. Sources: `website_about_clean`, Instagram bio/metadata, image checkbox review (21 selected images, 7 marked Pattern, 4 marked Placement). Rewrote all 8 standard body sections: Overview, Style and Aesthetic, Techniques and Tools, Markets and Clients, Portfolio and Presence, Career Path, Pattern Focus, Connections. YAML frontmatter preserved exactly. Image table and checkboxes untouched. Added entry to index.md under new Featured Designers — _level4 staging section.
