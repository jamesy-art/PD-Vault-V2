import fs from "fs-extra"
import path from "path"
import matter from "gray-matter"

const CLEANED_JSON = "output/level2-website-cleaned-results.json"
const DESIGNERS_DIR = "wiki/designers/_staging"

function cleanArray(arr = []) {
  return [...new Set(arr.filter(Boolean).map((v) => String(v).trim()))]
}

function safeString(value = "") {
  return String(value || "").replace(/\r/g, "").trim()
}

function determineLevel(existingLevel, item) {
  const current = existingLevel || "level_0"

  // preserve already higher levels
  if (["level_4", "level_5"].includes(current)) {
    return current
  }

  // promote good cleaned profiles
  if (
    item.usable_for_claude === true &&
    (item.scrape_quality_score || 0) >= 60
  ) {
    return "level_3"
  }

  return current
}

function updateTags(existingTags = [], newLevel = "") {
  const tags = cleanArray(existingTags)

  // remove old level tags
  const filtered = tags.filter(
    (tag) => !/^level_\d+$/.test(String(tag))
  )

  if (newLevel) {
    filtered.push(newLevel)
  }

  return cleanArray(filtered)
}

async function run() {
  console.log("Injecting cleaned scrape data into MD files...\n")

  if (!(await fs.pathExists(CLEANED_JSON))) {
    console.error(`❌ Missing: ${CLEANED_JSON}`)
    process.exit(1)
  }

  const cleanedData = await fs.readJson(CLEANED_JSON)

  // TEST FIRST FIVE
  // const testData = cleanedData.slice(0, 5)

  let updated = 0
  let skipped = 0

  // CHANGE testData BACK TO cleanedData LATER
  for (const item of cleanedData) {
    const mdPath = path.join(DESIGNERS_DIR, `${item.slug}.md`)

    if (!(await fs.pathExists(mdPath))) {
      console.log(`⚠️ Missing MD: ${item.slug}`)
      skipped++
      continue
    }

    const mdContent = await fs.readFile(mdPath, "utf8")
    const parsed = matter(mdContent)

    const existing = parsed.data || {}

    const newLevel = determineLevel(existing.level, item)

    const updatedYaml = {
      ...existing,

      // LEVEL SYSTEM
      level: newLevel,

      tags: updateTags(existing.tags || [], newLevel),

      // CLEANED WEBSITE DATA
      website_title: safeString(item.website_title),

      website_meta_description: safeString(
        item.website_meta_description
      ),

      website_about_raw: safeString(item.website_about_raw),

      website_about_clean: safeString(
        item.website_about_clean
      ),

      website_project_text: safeString(
        item.website_project_text
      ),

      website_social_text: safeString(
        item.website_social_text
      ),

      scrape_quality: safeString(item.scrape_quality),

      scrape_quality_score:
        item.scrape_quality_score || 0,

      usable_for_claude: Boolean(
        item.usable_for_claude
      ),

      // TAXONOMY DATA
      designer_type: cleanArray(
        item.designer_type
      ),

      experience: safeString(item.experience),

      open_to: cleanArray(item.open_to),

      pricing: cleanArray(item.pricing),

      categories: cleanArray(item.categories),

      skills: cleanArray(item.skills),

      // PIPELINE STATUS
      source_status: "scraped",

      enrichment_status:
        item.usable_for_claude === true
          ? "needs_claude"
          : "needs_manual_review",
    }

    const newFrontmatter = matter.stringify(
      parsed.content,
      updatedYaml
    )

    await fs.writeFile(mdPath, newFrontmatter)

    updated++

    console.log(
      `✅ ${item.slug} → ${newLevel} → ${item.scrape_quality} (${item.scrape_quality_score})`
    )
  }

  console.log(`\nDone.`)
  console.log(`Updated: ${updated}`)
  console.log(`Skipped: ${skipped}`)
}

run()