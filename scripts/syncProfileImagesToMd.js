import fs from "fs-extra"
import path from "path"
import matter from "gray-matter"

const DESIGNERS_DIR = "./wiki/designers/_staging"
const ASSETS_DIR = "./wiki/assets/designers"

// TEST MODE
// Set to 5 to test first five.
// Set to null to run all.
const TEST_LIMIT = null

// Easy disable for the MD body preview
const ENABLE_PROFILE_PREVIEW = true

function isImage(file) {
  return /\.(jpg|jpeg|png)$/i.test(file)
}

function mdSafePath(fromMdFile, assetFile) {
  const fromDir = path.dirname(fromMdFile)

  return path
    .relative(fromDir, assetFile)
    .replaceAll(path.sep, "/")
    .replace(/ /g, "%20")
}

async function getProfileImages(fullMdPath, slug) {
  const dir = path.join(ASSETS_DIR, slug, "profile")

  if (!(await fs.pathExists(dir))) return []

  const files = (await fs.readdir(dir)).filter(isImage).sort()

  return files.map((file) => {
    const assetFile = path.join(dir, file)
    return mdSafePath(fullMdPath, assetFile)
  })
}

function updateTags(existingTags = [], hasProfileImage = false) {
  const tags = Array.isArray(existingTags) ? existingTags : []
  const filtered = tags.filter((tag) => tag !== "has_profile_image")

  if (hasProfileImage) filtered.push("has_profile_image")

  return [...new Set(filtered)]
}

function buildProfileSection(profileImages = []) {
  if (!ENABLE_PROFILE_PREVIEW) return ""

  if (!profileImages.length) {
    return `## Profile Image

_No profile image found._`
  }

  const first = profileImages[0]

  return `## Profile Image

<img class="pd-profile-image pd-profile-image-md" src="${first}" loading="lazy" alt="Profile image">

${profileImages.length > 1 ? profileImages.map((src) => `- ${src}`).join("\n") : ""}`.trim()
}

function replaceOrInsertProfileSection(content = "", profileSection = "") {
  if (!ENABLE_PROFILE_PREVIEW) return content

  const sectionRegex =
    /## Profile Image[\s\S]*?(?=\n## |\n# |$)/m

  if (sectionRegex.test(content)) {
    return content.replace(sectionRegex, profileSection)
  }

  return `${profileSection}

${content}`.trim()
}

async function run() {
  console.log("Syncing profile images into designer MDs...\n")

  if (!(await fs.pathExists(DESIGNERS_DIR))) {
    console.error(`❌ Missing folder: ${DESIGNERS_DIR}`)
    process.exit(1)
  }

  const allFiles = (await fs.readdir(DESIGNERS_DIR))
    .filter((file) => file.endsWith(".md"))
    .sort()

  const files = TEST_LIMIT ? allFiles.slice(0, TEST_LIMIT) : allFiles

  console.log(
    TEST_LIMIT
      ? `🧪 TEST MODE: first ${TEST_LIMIT} MDs\n`
      : `🚀 FULL RUN: ${files.length} MDs\n`
  )

  let updated = 0
  let noProfile = 0

  for (const file of files) {
    const fullMdPath = path.join(DESIGNERS_DIR, file)
    const raw = await fs.readFile(fullMdPath, "utf8")

    let parsed

    try {
      parsed = matter(raw)
    } catch {
      console.log(`❌ YAML error: ${file}`)
      continue
    }

    const data = parsed.data || {}
    const slug = data.slug || path.basename(file, ".md")

    const profileImages = await getProfileImages(fullMdPath, slug)
    const profileImage = profileImages[0] || ""

    if (!profileImage) noProfile++

    const nextData = {
      ...data,

      profile_image: profileImage,
      profile_images: profileImages,
      profile_image_local: profileImage,

      images: {
        ...(data.images || {}),
        profile: profileImages.length ? profileImages : null,
      },

      enrichment_stats: {
        ...(data.enrichment_stats || {}),
        profile_total: profileImages.length,
        profile_valid: profileImages.length,
      },

      profile_image_synced: true,

      tags: updateTags(data.tags || [], Boolean(profileImage)),
    }

    const profileSection = buildProfileSection(profileImages)
    const nextContent = replaceOrInsertProfileSection(
      parsed.content,
      profileSection
    )

    await fs.writeFile(fullMdPath, matter.stringify(nextContent, nextData))

    updated++

    console.log(
      profileImage
        ? `✅ ${slug} → profile image added`
        : `⚠️ ${slug} → no profile image`
    )
  }

  console.log("\nDone.")
  console.log(`Updated: ${updated}`)
  console.log(`No profile image: ${noProfile}`)
}

run()