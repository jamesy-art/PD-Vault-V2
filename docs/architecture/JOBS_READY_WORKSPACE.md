# Jobs Ready Workspace

**Date:** 2026-08-07  
**A7-R1 / A7-R2** — Ready under `wiki/jobs/_ready/` + editor modes + link rewrite  
**Companion:** `JOBS_READY_PIPELINE.md` · `JOBS_EXPORT_PIPELINE.md`

---

## 1. Final answers

| Question | Answer |
|----------|--------|
| Source of truth **before** export | **Ready packages** under `wiki/jobs/_ready/` — not staging |
| Where Ready docs are stored | `wiki/jobs/_ready/<editorial-slug>/` |
| Folder names | Human-readable **editorial slugs** (never opaque `ready_id`) |
| Where `ready_id` lives | Metadata only — `ready.json` + Markdown front matter |
| Export reads | `wiki/jobs/_ready/` via `ReadyWriter.readyRootFor` → `vaultPaths.readyRootFor` |
| Relative links in Ready | Rewritten for Ready location (Staging untouched) |
| Should editors hand-edit Ready? | **Do not.** Re-promote from Canonical staging |

---

## 2. Editorial model

```
Raw → Staging → Ready → Export
```

| Path | Role | Export? |
|------|------|---------|
| `wiki/jobs/_staging/` | Editable Canonical | No |
| `wiki/jobs/_ready/` | Ready snapshots | **Yes — only source** |

---

## 3. Ready package layout

```
wiki/jobs/_ready/<editorial-slug>/
  <editorial-slug>.md      ← snapshot + rewritten relative links
  ready.json               ← ready_id, editorial_hash, link_rewrite stats
  promotion-report.json
  promotion-report.md
  promotion-history.jsonl
```

---

## 4. Promotion CLI (A7-R2)

Mirrors Export modes:

```bash
node scripts/ready/promote.js --mode all
node scripts/ready/promote.js --mode single --slug <editorial-slug>
node scripts/ready/promote.js --mode selection --slugs slug1,slug2
node scripts/ready/promote.js --mode changed
```

| Mode | Behaviour |
|------|-----------|
| `all` | Every package under `_staging/` |
| `single` | One slug |
| `selection` | Explicit slug list |
| `changed` | Staging `editorial_hash` ≠ Ready (or no Ready yet) |

### Legacy (still supported)

```bash
node scripts/ready/promote.js --canonical-dir wiki/jobs/_staging/<slug>
node scripts/ready/promote.js --canonical-id can-…
```

---

## 5. Link rewrite (Ready only)

On promote, ReadyWriter:

1. Loads staging Markdown  
2. Rewrites relative asset / markdown / path-style links for `wiki/jobs/_ready/<slug>/`  
3. Writes Ready Markdown  

Staging is never modified. Obsidian image previews and relative asset paths work in both `_staging` and `_ready`.

Bare wikilinks (`[[Burberry]]`) are left as Obsidian name links.

---

## 6. Export discovery

```
ExportWorkspace → readyCatalog → wiki/jobs/_ready/<slug>/<slug>.md
ready_id from ready.json / FM
```

---

## 7. Editor guidance

1. Raw → `generate.js` (includes Resolve + Quality) → `_staging`  
2. Review Markdown if needed  
3. `approve.js --mode changed --actor editor:…`  
4. `promote.js --mode changed` (or `all` / `single`)  
5. Export from `_ready`  
6. Do not hand-edit Ready — re-promote after Canonical changes  
