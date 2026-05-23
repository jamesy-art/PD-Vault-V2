import fs from "fs-extra"
import path from "path"

const INPUT = "output/instagram-posts/priority-download-queue.json"
const ASSETS_DIR = "wiki/assets/designers"

// TEST MODE
// Set to 20 to test first 20 images.
// Set to null to run all.
const TEST_LIMIT = null

const CONCURRENCY = 2
const MIN_BYTES = 100 * 1024
const MAX_RETRIES = 2
const DELAY_MIN_MS = 800
const DELAY_MAX_MS = 4500

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomDelay() {
  return DELAY_MIN_MS + Math.floor(Math.random() * (DELAY_MAX_MS - DELAY_MIN_MS))
}

function safeUsername(value = "") {
  return String(value || "")
    .replace(/^@/, "")
    .trim()
}

function fileExtFromUrl(url = "") {
  const clean = url.split("?")[0].toLowerCase()

  if (clean.endsWith(".png")) return "png"
  if (clean.endsWith(".jpeg")) return "jpeg"
  return "jpg"
}

function safeFilename(item, index) {
  const ext = fileExtFromUrl(item.image_url)
  const score = item.score || 0
  const pk = item.pk || `post-${index}`

  return `${String(index + 1).padStart(3, "0")}-score-${score}-${pk}.${ext}`
}

async function fetchImageBuffer(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      Referer: "https://www.instagram.com/",
    },
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }

  return Buffer.from(await res.arrayBuffer())
}

async function downloadWithRetries(item, outPath) {
  let lastError = null

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      await sleep(randomDelay())

      const buffer = await fetchImageBuffer(item.image_url)

      if (buffer.length < MIN_BYTES) {
        throw new Error(`too small ${Math.round(buffer.length / 1024)}kb`)
      }

      await fs.outputFile(outPath, buffer)

      return {
        ok: true,
        bytes: buffer.length,
        attempts: attempt,
      }
    } catch (err) {
      lastError = err
      await sleep(1000 * attempt)
    }
  }

  return {
    ok: false,
    error: lastError?.message || "unknown error",
  }
}

async function worker(queue, results, workerId) {
  while (queue.length) {
    const job = queue.shift()
    const { item, index } = job

    const username = safeUsername(item.username)

    if (!username || !item.image_url) {
      results.skipped.push({
        username,
        post_url: item.post_url,
        reason: "missing username or image_url",
      })
      continue
    }

    const dir = path.join(ASSETS_DIR, username, "instagram", "candidates")
    const filename = safeFilename(item, index)
    const outPath = path.join(dir, filename)

    if (await fs.pathExists(outPath)) {
      results.skipped.push({
        username,
        post_url: item.post_url,
        reason: "already exists",
        file: outPath,
      })

      console.log(`⏭️  [${workerId}] ${username} already exists`)
      continue
    }

    const result = await downloadWithRetries(item, outPath)

    if (result.ok) {
      results.downloaded.push({
        username,
        post_url: item.post_url,
        score: item.score,
        quality_band: item.quality_band,
        classification: item.classification?.primary,
        file: outPath,
        bytes: result.bytes,
      })

      console.log(
        `✅ [${workerId}] ${username} ${Math.round(result.bytes / 1024)}kb score:${item.score}`
      )
    } else {
      results.failed.push({
        username,
        post_url: item.post_url,
        image_url: item.image_url,
        score: item.score,
        error: result.error,
      })

      console.log(`❌ [${workerId}] ${username} ${result.error}`)
    }
  }
}

async function run() {
  console.log("Downloading priority Instagram image candidates...\n")

  if (!(await fs.pathExists(INPUT))) {
    console.error(`❌ Missing input: ${INPUT}`)
    process.exit(1)
  }

  const allItems = await fs.readJson(INPUT)
  const items = TEST_LIMIT ? allItems.slice(0, TEST_LIMIT) : allItems

  console.log(
    TEST_LIMIT
      ? `🧪 TEST MODE: first ${TEST_LIMIT} of ${allItems.length} images`
      : `🚀 FULL RUN: ${allItems.length} images`
  )

  console.log(`Concurrency: ${CONCURRENCY}`)
  console.log(`Minimum size: ${Math.round(MIN_BYTES / 1024)}kb\n`)

  const queue = items.map((item, index) => ({ item, index }))

  const results = {
    input_total: allItems.length,
    attempted: items.length,
    downloaded: [],
    skipped: [],
    failed: [],
  }

  const workers = Array.from({ length: CONCURRENCY }, (_, i) =>
    worker(queue, results, i + 1)
  )

  await Promise.all(workers)

  await fs.outputJson("output/instagram-posts/download-priority-results.json", results, {
    spaces: 2,
  })

  console.log("\nDone.")
  console.log(`Attempted: ${results.attempted}`)
  console.log(`Downloaded: ${results.downloaded.length}`)
  console.log(`Skipped: ${results.skipped.length}`)
  console.log(`Failed: ${results.failed.length}`)
  console.log("")
  console.log("Saved:")
  console.log("output/instagram-posts/download-priority-results.json")
}

run()