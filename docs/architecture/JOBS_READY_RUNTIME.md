# Jobs Ready Runtime

**Date:** 2026-08-07  
**Superseded by A7-R1** — see `JOBS_READY_WORKSPACE.md`

---

## Canonical Ready workspace (current)

```
wiki/jobs/_ready/<editorial-slug>/
  <editorial-slug>.md
  ready.json                 ← ready_id, editorial_hash, …
  promotion-report.*
  promotion-history.jsonl
```

| Module | Path |
|--------|------|
| `vaultPaths.readyRootFor` | `wiki/jobs/_ready/` |
| `ReadyWriter.readyRootFor` | same (delegates to vaultPaths) |
| Export `readyCatalog` | same |

`ready_id` is **metadata only** — never the folder name.

---

## Legacy (deprecated)

```
content/jobs/ready/<ready_id>/ready.md
```

Migration:

```bash
node scripts/ready/migrate-to-wiki-ready.js
```

`vaultPaths.legacyReadyRootFor` remains for that migration only.

---

## Discovery (current)

1. `readyRootFor(vault, 'jobs')` → `wiki/jobs/_ready`  
2. Enumerate editorial-slug directories  
3. Resolve `<slug>.md` (or legacy `ready.md`)  
4. Read `ready_id` from `ready.json` / front matter  
