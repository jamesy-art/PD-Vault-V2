import fs from "fs-extra"
import path from "path"
import matter from "gray-matter"

const DESIGNERS_DIR = "wiki/designers/_staging"

const MANUAL_FIELDS = {
  manual_about_raw: "",
  manual_reviewed: false,
  manual_quality: "",
  manual_review_note: "",
}

async function run() {
  console.log("Adding manual review fields to designer MDs...\n")

  if (!(await fs.pathExists(DESIGNERS_DIR))) {
    console.error(`❌ Missing folder: ${DESIGNERS_DIR}`)
    process.exit(1)
  }

  const files = (await fs.readdir(DESIGNERS_DIR)).filter((file) =>
    file.endsWith(".md")
  )

  let updated = 0
  let skipped = 0

  for (const file of files) {
    const mdPath = path.join(DESIGNERS_DIR, file)
    const raw = await fs.readFile(mdPath, "utf8")
    const parsed = matter(raw)

    const existing = parsed.data || {}

    let changed = false
    const nextData = { ...existing }

    for (const [key, defaultValue] of Object.entries(MANUAL_FIELDS)) {
      if (!(key in nextData)) {
        nextData[key] = defaultValue
        changed = true
      }
    }

    if (!changed) {
      skipped++
      continue
    }

    const nextMd = matter.stringify(parsed.content, nextData)
    await fs.writeFile(mdPath, nextMd)

    updated++
    console.log(`✅ Added fields: ${file}`)
  }

  console.log("\nDone.")
  console.log(`Updated: ${updated}`)
  console.log(`Already had fields: ${skipped}`)
}

run()