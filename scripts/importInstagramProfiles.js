import fs from "fs-extra"
import path from "path"
import matter from "gray-matter"

const INSTAGRAM_JSON = "raw/featured_designers_insta_profiles.json"
const DESIGNERS_DIR = "wiki/designers/_staging"
const ASSETS_DIR = "wiki/assets/designers"

// TEST MODE
// Set to 5 to test first five.
// Set to null to run all.
const TEST_LIMIT = null

// Bigger profile images may still be small-ish JPGs.
// Keep this low enough to allow real avatars through.
const PROFILE_MIN_BYTES = 2 * 1024

// Optional debug: logs each attempted image URL size.
// Set true while testing, false for full run.
const DEBUG_VARIANTS = true

function cleanUsername(value = "") {
  return String(value || "").replace(/^@/, "").trim()
}

function safeString(value = "") {
  return String(value || "").replace(/\r/g, "").trim()
}

function imageExtFromUrl(url = "") {
  const lower = url.toLowerCase()
  if (lower.includes(".png")) return "png"
  if (lower.includes(".jpeg")) return "jpeg"
  return "jpg"
}

function profileUrlVariants(url = "") {
  const variants = new Set()

  if (!url) return []

  variants.add(url)

  try {
    const original = new URL(url)

    // Best first attempt:
    // remove Instagram's forced thumbnail resize param.
    const noResize = new URL(original.toString())
    noResize.searchParams.delete("stp")
    variants.add(noResize.toString())

    // Try common larger stp variants.
    const size320 = new URL(original.toString())
    size320.searchParams.set("stp", "dst-jpg_e0_s320x320_tt6")
    variants.add(size320.toString())

    const size640 = new URL(original.toString())
    size640.searchParams.set("stp", "dst-jpg_e0_s640x640_tt6")
    variants.add(size640.toString())

    const size1080 = new URL(original.toString())
    size1080.searchParams.set("stp", "dst-jpg_e0_s1080x1080_tt6")
    variants.add(size1080.toString())

    // Try same no-resize URL on generic Instagram CDN host.
    const genericCdn = new URL(noResize.toString())
    genericCdn.hostname = "scontent.cdninstagram.com"
    variants.add(genericCdn.toString())

    // Try same no-resize URL on your regional host pattern.
    // This may not work for everyone, but can help with Trinidad/local CDN variants.
    const regionalCdn = new URL(noResize.toString())
    regionalCdn.hostname = "instagram.fpos1-2.fna.fbcdn.net"
    variants.add(regionalCdn.toString())
  } catch {
    // keep original only
  }

  return [...variants]
}

async function fetchImageBuffer(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      Accept:
        "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      Referer: "https://www.instagram.com/",
    },
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }

  return Buffer.from(await res.arrayBuffer())
}

async function downloadBestProfileImage(username, url, outPath) {
  let bestBuffer = null
  let bestUrl = ""
  const attempts = []

  for (const variant of profileUrlVariants(url)) {
    try {
      const buffer = await fetchImageBuffer(variant)
      const kb = Math.round(buffer.length / 1024)

      attempts.push({
        kb,
        url: variant,
      })

      if (DEBUG_VARIANTS) {
        console.log(`   🔎 ${username}: ${kb}kb`)
      }

      if (!bestBuffer || buffer.length > bestBuffer.length) {
        bestBuffer = buffer
        bestUrl = variant
      }
    } catch (err) {
      if (DEBUG_VARIANTS) {
        console.log(`   ⚠️ ${username}: ${err.message}`)
      }
    }
  }

  if (!bestBuffer) {
    throw new Error("No image downloaded")
  }

  if (bestBuffer.length < PROFILE_MIN_BYTES) {
    throw new Error(
      `Image too small: ${Math.round(bestBuffer.length / 1024)}kb`
    )
  }

  await fs.outputFile(outPath, bestBuffer)

  return {
    bytes: bestBuffer.length,
    sourceUrl: bestUrl,
    attempts,
  }
}

function updateTags(existingTags = []) {
  const tags = Array.isArray(existingTags) ? existingTags : []
  return [...new Set([...tags, "has_instagram_profile"])]
}

function profileImageQuality(bytes = 0) {
  const kb = bytes / 1024

  if (kb >= 50) return "large"
  if (kb >= 20) return "medium"
  return "thumbnail"
}

async function run() {
  console.log("Importing Instagram profile data...\n")

  if (!(await fs.pathExists(INSTAGRAM_JSON))) {
    console.error(`❌ Missing ${INSTAGRAM_JSON}`)
    process.exit(1)
  }

  const profiles = await fs.readJson(INSTAGRAM_JSON)
  const items = TEST_LIMIT ? profiles.slice(0, TEST_LIMIT) : profiles

  console.log(
    TEST_LIMIT
      ? `🧪 TEST MODE: processing first ${TEST_LIMIT} profiles\n`
      : `🚀 FULL RUN: processing ${profiles.length} profiles\n`
  )

  let updated = 0
  let downloaded = 0
  let missingMd = 0
  let failedDownloads = 0

  for (const profile of items) {
    const username = cleanUsername(profile.username)

    if (!username) continue

    const mdPath = path.join(DESIGNERS_DIR, `${username}.md`)

    if (!(await fs.pathExists(mdPath))) {
      console.log(`⚠️ Missing MD: ${username}`)
      missingMd++
      continue
    }

    const raw = await fs.readFile(mdPath, "utf8")
    const parsed = matter(raw)
    const data = parsed.data || {}

    const profileDir = path.join(ASSETS_DIR, username, "profile")
    await fs.ensureDir(profileDir)

    let localProfileImage = data.instagram_profile_image_local || ""
    let bestProfilePicUrl = data.instagram_profile_pic_best_url || ""
    let profileImageBytes = data.instagram_profile_image_bytes || 0
    let profileImageQualityValue =
      data.instagram_profile_image_quality || ""

    if (profile.profilePicUrl) {
      const ext = imageExtFromUrl(profile.profilePicUrl)
      const outPath = path.join(profileDir, `instagram-profile.${ext}`)

      try {
        const result = await downloadBestProfileImage(
          username,
          profile.profilePicUrl,
          outPath
        )

        localProfileImage = path
          .relative(path.dirname(mdPath), outPath)
          .replaceAll(path.sep, "/")
          .replace(/ /g, "%20")

        bestProfilePicUrl = result.sourceUrl
        profileImageBytes = result.bytes
        profileImageQualityValue = profileImageQuality(result.bytes)

        downloaded++

        console.log(
          `✅ Downloaded: ${username} (${Math.round(
            result.bytes / 1024
          )}kb, ${profileImageQualityValue})`
        )
      } catch (err) {
        failedDownloads++
        console.log(`❌ Failed image: ${username} — ${err.message}`)
      }
    }

    const nextData = {
      ...data,

      instagram_full_name: safeString(profile.fullName),
      instagram_biography: safeString(profile.biography),
      instagram_posts_count: profile.postsCount ?? null,
      instagram_followers_count: profile.followersCount ?? null,
      instagram_follows_count: profile.followsCount ?? null,
      instagram_private: Boolean(profile.private),
      instagram_verified: Boolean(profile.verified),
      instagram_business_account: Boolean(profile.isBusinessAccount),

      instagram_profile_pic_url: safeString(profile.profilePicUrl),
      instagram_profile_pic_best_url: safeString(bestProfilePicUrl),
      instagram_profile_image_local: localProfileImage,
      instagram_profile_image_bytes: profileImageBytes,
      instagram_profile_image_quality: profileImageQualityValue,
      instagram_profile_imported: true,

      tags: updateTags(data.tags || []),
    }

    const nextMd = matter.stringify(parsed.content, nextData)
    await fs.writeFile(mdPath, nextMd)

    updated++
    console.log(`📝 Updated MD: ${username}`)
  }

  console.log("\nDone.")
  console.log(`Updated MDs: ${updated}`)
  console.log(`Downloaded profile images: ${downloaded}`)
  console.log(`Missing MDs: ${missingMd}`)
  console.log(`Failed downloads: ${failedDownloads}`)
}

run()