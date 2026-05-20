import fs from "fs-extra"
import path from "path"
import matter from "gray-matter"

const DESIGNERS_DIR = "wiki/designers/_staging"
const TARGET_QUALITY = "weak"
const SUMMARY_FILE = "output/manual-weak-rescore-summary.json"

function cleanText(text = "") {
  return String(text || "").replace(/\s+/g, " ").trim()
}

function cleanArray(arr = []) {
  return [...new Set(arr.filter(Boolean).map((v) => String(v).trim()))]
}

function hasAny(text = "", terms = []) {
  const lower = text.toLowerCase()
  return terms.some((term) => lower.includes(term.toLowerCase()))
}

function qualityLabel(score) {
  if (score >= 85) return "excellent"
  if (score >= 70) return "good"
  if (score >= 50) return "usable"
  if (score >= 25) return "weak"
  return "bad"
}

function determineLevel(existingLevel, score) {
  if (["level_4", "level_5"].includes(existingLevel)) return existingLevel
  if (score >= 60) return "level_3"
  return existingLevel || "level_2"
}

function updateTags(existingTags = [], newLevel = "") {
  const tags = cleanArray(existingTags)
  const filtered = tags.filter((tag) => !/^level_\d+$/.test(String(tag)))
  if (newLevel) filtered.push(newLevel)
  return cleanArray(filtered)
}

function scoreManualText(text = "") {
  const clean = cleanText(text)
  const chars = clean.length
  let score = 0

  if (chars > 150) score += 15
  if (chars > 400) score += 20
  if (chars > 900) score += 20
  if (chars > 1500) score += 10

  if (
    hasAny(clean, [
      "surface pattern",
      "pattern designer",
      "print designer",
      "textile designer",
      "illustrator",
      "illustration",
      "artist",
      "studio",
      "designer",
    ])
  ) {
    score += 15
  }

  if (
    hasAny(clean, [
      "based in",
      "originally from",
      "lives in",
      "located in",
      "freelance",
      "founder",
      "creative director",
    ])
  ) {
    score += 10
  }

  if (
    hasAny(clean, [
      "clients",
      "brands",
      "collaborations",
      "licensing",
      "license",
      "commissions",
      "portfolio",
      "represented",
      "available for",
      "work together",
    ])
  ) {
    score += 15
  }

  if (
    hasAny(clean, [
      "inspired by",
      "my work",
      "her work",
      "his work",
      "our work",
      "process",
      "hand-drawn",
      "hand drawn",
      "watercolor",
      "watercolour",
      "gouache",
      "adobe illustrator",
      "photoshop",
      "procreate",
      "vector",
      "repeat",
      "seamless",
    ])
  ) {
    score += 15
  }

  if (
    hasAny(clean, [
      "cookie policy",
      "privacy policy",
      "terms of use",
      "captcha",
      "viewport",
      "grid-template",
      "powered by",
      "subscribe",
      "newsletter",
      "skip to content",
      "open menu",
      "close menu",
    ])
  ) {
    score -= 30
  }

  if (chars < 100) score -= 30

  return Math.max(0, Math.min(100, score))
}

async function run() {
  console.log(`Rescoring manually updated ${TARGET_QUALITY} designer MDs...\n`)

  const files = (await fs.readdir(DESIGNERS_DIR)).filter((file) =>
    file.endsWith(".md")
  )

  let checked = 0
  let skipped = 0
  let updated = 0

  const upgraded = {
    excellent: [],
    good: [],
    usable: [],
    weak: [],
    bad: [],
  }

  for (const file of files) {
    const mdPath = path.join(DESIGNERS_DIR, file)
    const raw = await fs.readFile(mdPath, "utf8")
    const parsed = matter(raw)
    const data = parsed.data || {}

    if (data.scrape_quality !== TARGET_QUALITY) {
      skipped++
      continue
    }

    checked++

    const manual = cleanText(data.manual_about_raw || "")

    if (!manual) {
      console.log(`⚠️ No manual_about_raw: ${file}`)
      skipped++
      continue
    }

    const oldQuality = data.scrape_quality
    const oldScore = data.scrape_quality_score || 0
    const newScore = scoreManualText(manual)
    const newQuality = qualityLabel(newScore)
    const newLevel = determineLevel(data.level, newScore)

    const nextData = {
      ...data,

      website_about_clean: manual,

      manual_reviewed: true,
      manual_quality: newQuality,
      manual_review_note:
        data.manual_review_note || "Manual about text reviewed and rescored.",

      scrape_quality: newQuality,
      scrape_quality_score: newScore,
      usable_for_claude: newScore >= 50,

      level: newLevel,
      tags: updateTags(data.tags || [], newLevel),

      enrichment_status:
        newScore >= 60 ? "needs_claude" : "needs_manual_review",
    }

    const nextMd = matter.stringify(parsed.content, nextData)
    await fs.writeFile(mdPath, nextMd)

    updated++

    upgraded[newQuality].push({
      file,
      oldQuality,
      oldScore,
      newQuality,
      newScore,
      level: newLevel,
    })

    console.log(
      `✅ ${file}: ${oldQuality} (${oldScore}) → ${newQuality} (${newScore}) → ${newLevel}`
    )
  }

  console.log("\nSummary")
  console.log("-------")
  console.log(`Checked weak files: ${checked}`)
  console.log(`Updated with manual text: ${updated}`)
  console.log(`Skipped: ${skipped}`)

  console.log("\nNew grades")
  console.log(`Excellent: ${upgraded.excellent.length}`)
  console.log(`Good: ${upgraded.good.length}`)
  console.log(`Usable: ${upgraded.usable.length}`)
  console.log(`Weak: ${upgraded.weak.length}`)
  console.log(`Bad: ${upgraded.bad.length}`)

  await fs.outputJson(SUMMARY_FILE, upgraded, { spaces: 2 })

  console.log("\nSaved summary:")
  console.log(SUMMARY_FILE)
}

run()