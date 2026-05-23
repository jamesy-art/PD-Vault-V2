import fs from "fs-extra"
import path from "path"
import matter from "gray-matter"

const DESIGNERS_DIR = "./wiki/designers/_staging"

const TEST_MODE = true
const TEST_USERNAMES = ["amelia_graham_print"]

const WRITE_FILES = true

function splitMarkdownTableRow(row) {
  const placeholder = "___ESCAPED_PIPE___"

  return row
    .replaceAll("\\|", placeholder)
    .split("|")
    .map(cell => cell.replaceAll(placeholder, "|").trim())
}

function parseReviewTable(content) {
  const rows = content
    .split("\n")
    .filter(line => line.trim().startsWith("|"))
    .filter(line => line.includes("<!-- image:"))

  const selectedPatterns = []
  const selectedPlacements = []
  const trashImages = []

  for (const row of rows) {
    const imageMatch = row.match(/<!-- image:(.*?) -->/)
    if (!imageMatch) continue

    const imagePath = imageMatch[1].trim()
    const cells = splitMarkdownTableRow(row)

    // cells[0] = empty
    // cells[1] = image
    // cells[2] = pattern
    // cells[3] = placement
    // cells[4] = trash
    // cells[5] = empty

    const patternChecked = /\[x\]/i.test(cells[2] || "")
    const placementChecked = /\[x\]/i.test(cells[3] || "")
    const trashChecked = /\[x\]/i.test(cells[4] || "")

    if (patternChecked) selectedPatterns.push(imagePath)
    if (placementChecked) selectedPlacements.push(imagePath)
    if (trashChecked) trashImages.push(imagePath)
  }

  return {
    selectedPatterns,
    selectedPlacements,
    trashImages,
  }
}

function updateTags(tags = []) {
  const clean = Array.isArray(tags) ? tags : []

  return [
    ...new Set([
      ...clean.filter(tag => tag !== "needs_image_table_review"),
      "image_reviewed",
      "ready_for_claude",
    ]),
  ]
}

async function run() {
  const files = (await fs.readdir(DESIGNERS_DIR))
    .filter(file => file.endsWith(".md"))

  let updated = 0
  let skipped = 0
  let noSelections = 0

  for (const file of files) {
    const fullPath = path.join(DESIGNERS_DIR, file)
    const raw = await fs.readFile(fullPath, "utf8")
    const parsed = matter(raw)
    const data = parsed.data || {}

    const slug = data.slug || file.replace(".md", "")

    if (data.level !== "level_4") {
      skipped++
      continue
    }

    if (
      TEST_MODE &&
      TEST_USERNAMES.length &&
      !TEST_USERNAMES.includes(slug)
    ) {
      skipped++
      continue
    }

    const {
      selectedPatterns,
      selectedPlacements,
      trashImages,
    } = parseReviewTable(parsed.content)

    const totalSelected =
      selectedPatterns.length +
      selectedPlacements.length +
      trashImages.length

    if (totalSelected === 0) {
      console.log(`⚠️ No selections found: ${slug}`)
      noSelections++
      continue
    }

    data.selected_patterns = selectedPatterns
    data.selected_placements = selectedPlacements
    data.trash_images = trashImages

    data.selected_pattern_count = selectedPatterns.length
    data.selected_placement_count = selectedPlacements.length
    data.trash_image_count = trashImages.length

    data.image_reviewed = true
    data.enrichment_status = "ready_for_claude"
    data.tags = updateTags(data.tags)

    if (WRITE_FILES) {
      await fs.writeFile(
        fullPath,
        matter.stringify(parsed.content, data)
      )
    }

    updated++

    console.log(
      `✅ ${slug}: patterns ${selectedPatterns.length}, placements ${selectedPlacements.length}, trash ${trashImages.length}`
    )
  }

  console.log("\n🚀 DONE")
  console.log(`Updated: ${updated}`)
  console.log(`Skipped: ${skipped}`)
  console.log(`No selections: ${noSelections}`)
}

run()