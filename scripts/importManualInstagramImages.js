import fs from "fs-extra"
import path from "path"
import matter from "gray-matter"

const DOWNLOADS_DIR = "/Users/jamesbrown/DESIGNERS"
const DESIGNERS_DIR = "./wiki/designers/_staging"
const ASSETS_DIR = "./wiki/assets/designers"

const TEST_MODE = false
const TEST_USERNAME = null
const MOVE_FILES = true

function isImage(file) {
  return /\.(jpg|jpeg|png|webp)$/i.test(file)
}

function mdSafePath(fromMdFile, assetFile) {
  return path
    .relative(path.dirname(fromMdFile), assetFile)
    .replaceAll(path.sep, "/")
    .replace(/ /g, "%20")
}

async function getBestProfileImage(mdPath, username) {
  const profileDir = path.join(ASSETS_DIR, username, "profile")
  if (!(await fs.pathExists(profileDir))) return null

  const files = (await fs.readdir(profileDir)).filter(isImage)
  if (!files.length) return null

  const ranked = []

  for (const file of files) {
    const fullPath = path.join(profileDir, file)
    const stat = await fs.stat(fullPath)

    ranked.push({
      file,
      fullPath,
      bytes: stat.size,
    })
  }

  ranked.sort((a, b) => b.bytes - a.bytes)

  const best = ranked[0]

  return {
    file: best.file,
    bytes: best.bytes,
    localPath: mdSafePath(mdPath, best.fullPath),
    quality:
      best.bytes >= 100000
        ? "large"
        : best.bytes >= 30000
          ? "medium"
          : "thumbnail",
  }
}

function extractUsername(filename) {
  const clean = filename.replace(/\.(jpg|jpeg|png|webp)$/i, "")

  const imageyeMatch = clean.match(/^(.+?)_imageye/)
  if (imageyeMatch) return imageyeMatch[1]

  const doubleUnderscoreMatch = clean.match(/^(.+?)__\d+/)
  if (doubleUnderscoreMatch) return doubleUnderscoreMatch[1]

  const singleUnderscoreMatch = clean.match(/^(.+?)_\d{9,}/)
  if (singleUnderscoreMatch) return singleUnderscoreMatch[1]

  return null
}

function buildImageReviewTable(images) {
  if (!images.length) return ""

  const rows = images
    .map((src, index) => {
      const number = String(index + 1).padStart(2, "0")
      return `| ${number}<br>![pd-review\\|180](${src})<br><!-- image:${src} --> | [ ] | [ ] | [ ] |`
    })
    .join("\n")

  return `| Image | Pattern | Placement | Trash |
|---|---:|---:|---:|
${rows}`
}

function buildProfileImage(profileImage) {
  if (!profileImage) return ""
  return `![pd-profile|160](${profileImage})`
}

async function run() {
  const files = (await fs.readdir(DOWNLOADS_DIR)).filter(isImage)

  console.log(`Images found in downloads folder: ${files.length}`)

  const grouped = {}

  for (const file of files) {
    const username = extractUsername(file)

    console.log(`${file} → ${username}`)

    if (!username) continue
    if (TEST_MODE && TEST_USERNAME && username !== TEST_USERNAME) continue

    if (!grouped[username]) grouped[username] = []
    grouped[username].push(file)
  }

  const usernames = Object.keys(grouped)

  console.log(`\nDesigners found: ${usernames.length}\n`)

  for (const username of usernames) {
    const mdPath = path.join(DESIGNERS_DIR, `${username}.md`)

    if (!(await fs.pathExists(mdPath))) {
      console.log(`❌ Missing MD: ${username}`)
      continue
    }

    const raw = await fs.readFile(mdPath, "utf8")
    const parsed = matter(raw)
    const data = parsed.data || {}

    const instagramDir = path.join(ASSETS_DIR, username, "instagram")
    await fs.ensureDir(instagramDir)

    const importedImages = []

    for (const file of grouped[username]) {
      const source = path.join(DOWNLOADS_DIR, file)
      const target = path.join(instagramDir, file)

      if (MOVE_FILES) {
        await fs.move(source, target, { overwrite: true })
      } else {
        await fs.copy(source, target, { overwrite: true })
      }

      importedImages.push(mdSafePath(mdPath, target))
      console.log(`✅ ${username}: ${file}`)
    }

    const bestProfile = await getBestProfileImage(mdPath, username)

    if (bestProfile) {
      data.profile_image = bestProfile.localPath
      data.profile_image_local = bestProfile.localPath
      data.instagram_profile_image_local = bestProfile.localPath
      data.instagram_profile_image_bytes = bestProfile.bytes
      data.instagram_profile_image_quality = bestProfile.quality
      data.profile_images = [bestProfile.localPath]

      data.images = {
        ...(data.images || {}),
        profile: [bestProfile.localPath],
      }

      data.enrichment_stats = {
        ...(data.enrichment_stats || {}),
        profile_total: 1,
        profile_valid: 1,
      }

      data.profile_image_synced = true

      console.log(
        `🖼️ Profile updated: ${username} → ${bestProfile.file} (${Math.round(bestProfile.bytes / 1024)}kb)`
      )
    }

    data.level = "level_4"
    data.instagram_images_selected = importedImages
    data.instagram_image_count = importedImages.length
    data.image_reviewed = false
    data.enrichment_status = "needs_image_table_review"

    if (!Array.isArray(data.tags)) data.tags = []

    data.tags = [
      ...new Set([
        ...data.tags.filter((tag) => tag !== "level_3"),
        "level_4",
        "has_selected_instagram_images",
        "needs_image_table_review",
      ]),
    ]

    const profileImage =
      data.profile_image ||
      data.profile_image_local ||
      data.instagram_profile_image_local ||
      null

    const newContent = `
# ${username}

## Profile Image

${buildProfileImage(profileImage)}

## Instagram Images

${buildImageReviewTable(importedImages)}

## Website Images

## Overview

## Style and Aesthetic

## Techniques and Tools

## Markets and Clients

## Portfolio and Presence

## Career Path

## Pattern Focus

## Connections
`.trim()

    await fs.writeFile(mdPath, matter.stringify(newContent, data))

    console.log(`📝 Updated MD: ${username}\n`)
  }

  console.log("\nDone.")
}

run()