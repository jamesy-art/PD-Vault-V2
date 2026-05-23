import fs from "fs-extra"
import path from "path"
import matter from "gray-matter"

const DESIGNERS_DIR = "wiki/designers/_staging"
const SCORED_POSTS = "output/instagram-posts/download-candidates.json"
const OUTPUT = "output/instagram-posts/priority-download-queue.json"
const SUMMARY = "output/instagram-posts/priority-download-summary.json"

const ALLOWED_QUALITIES = ["excellent", "good", "usable"]
const MAX_IMAGES_PER_DESIGNER = 12

async function getPriorityDesigners() {
  const files = (await fs.readdir(DESIGNERS_DIR)).filter(f => f.endsWith(".md"))

  const designers = {}

  for (const file of files) {
    const full = path.join(DESIGNERS_DIR, file)
    const raw = await fs.readFile(full, "utf8")
    const parsed = matter(raw)
    const data = parsed.data || {}

    const slug = data.slug || path.basename(file, ".md")

    const hasGoodAbout =
      data.level === "level_3" &&
      data.usable_for_claude === true &&
      ALLOWED_QUALITIES.includes(data.scrape_quality)

    const hasProfileImage =
      Boolean(data.profile_image) ||
      Boolean(data.profile_image_local) ||
      Boolean(data.instagram_profile_image_local)

    if (!hasGoodAbout || !hasProfileImage) continue

    designers[slug] = {
      slug,
      name: data.name || "",
      scrape_quality: data.scrape_quality,
      scrape_quality_score: data.scrape_quality_score || 0,
      profile_image: data.profile_image || data.profile_image_local || "",
    }
  }

  return designers
}

async function run() {
  const priorityDesigners = await getPriorityDesigners()
  const posts = await fs.readJson(SCORED_POSTS)

  const grouped = {}

  for (const post of posts) {
    if (!priorityDesigners[post.username]) continue

    if (!grouped[post.username]) {
      grouped[post.username] = []
    }

    grouped[post.username].push(post)
  }

  const queue = []

  for (const [username, designerPosts] of Object.entries(grouped)) {
    const sorted = designerPosts
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return (b.metrics?.likes || 0) - (a.metrics?.likes || 0)
      })
      .slice(0, MAX_IMAGES_PER_DESIGNER)

    queue.push(...sorted)
  }

  const summary = {
    priority_designers_found: Object.keys(priorityDesigners).length,
    priority_designers_with_download_posts: Object.keys(grouped).length,
    total_download_images: queue.length,
    max_images_per_designer: MAX_IMAGES_PER_DESIGNER,
    by_scrape_quality: {
      excellent: 0,
      good: 0,
      usable: 0,
    },
    designers_with_8_plus_images: 0,
    designers_with_12_plus_images: 0,
    designers: {},
  }

  for (const username of Object.keys(priorityDesigners)) {
    const count = grouped[username]?.length || 0
    const cappedCount = Math.min(count, MAX_IMAGES_PER_DESIGNER)
    const quality = priorityDesigners[username].scrape_quality

    summary.by_scrape_quality[quality]++

    summary.designers[username] = {
      ...priorityDesigners[username],
      available_download_candidates: count,
      queued_downloads: cappedCount,
    }

    if (cappedCount >= 8) summary.designers_with_8_plus_images++
    if (cappedCount >= 12) summary.designers_with_12_plus_images++
  }

  await fs.outputJson(OUTPUT, queue, { spaces: 2 })
  await fs.outputJson(SUMMARY, summary, { spaces: 2 })

  console.log("Priority download queue built.")
  console.log(`Priority designers: ${summary.priority_designers_found}`)
  console.log(`Designers with posts: ${summary.priority_designers_with_download_posts}`)
  console.log(`Queued images: ${summary.total_download_images}`)
  console.log(`8+ images: ${summary.designers_with_8_plus_images}`)
  console.log(`12+ images: ${summary.designers_with_12_plus_images}`)
  console.log("")
  console.log(`Saved: ${OUTPUT}`)
  console.log(`Saved: ${SUMMARY}`)
}

run()