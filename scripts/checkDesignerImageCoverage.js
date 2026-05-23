import fs from "fs-extra"

const INPUT = "output/instagram-posts/download-candidates.json"
const OUTPUT = "output/instagram-posts/designer-image-coverage.json"

async function run() {
  const items = await fs.readJson(INPUT)

  const byDesigner = {}

  for (const item of items) {
    const username = item.username
    if (!username) continue

    if (!byDesigner[username]) {
      byDesigner[username] = {
        username,
        total_download_candidates: 0,
        excellent_candidate: 0,
        good_candidate: 0,
        usable_candidate: 0,
        pattern: 0,
        placement: 0,
        product_mockup: 0,
      }
    }

    byDesigner[username].total_download_candidates++

    if (item.quality_band) {
      byDesigner[username][item.quality_band] =
        (byDesigner[username][item.quality_band] || 0) + 1
    }

    const primary = item.classification?.primary
    if (primary && byDesigner[username][primary] !== undefined) {
      byDesigner[username][primary]++
    }
  }

  const designers = Object.values(byDesigner).sort(
    (a, b) => b.total_download_candidates - a.total_download_candidates
  )

  const summary = {
    total_designers_with_download_candidates: designers.length,
    designers_with_1_plus: designers.filter(d => d.total_download_candidates >= 1).length,
    designers_with_4_plus: designers.filter(d => d.total_download_candidates >= 4).length,
    designers_with_8_plus: designers.filter(d => d.total_download_candidates >= 8).length,
    designers_with_12_plus: designers.filter(d => d.total_download_candidates >= 12).length,
    designers_with_16_plus: designers.filter(d => d.total_download_candidates >= 16).length,
    designers_with_24_plus: designers.filter(d => d.total_download_candidates >= 24).length,

    designers_with_8_plus_pattern_only: designers.filter(d => d.pattern >= 8).length,
    designers_with_16_plus_pattern_only: designers.filter(d => d.pattern >= 16).length,

    top_50_designers: designers.slice(0, 50),
    designers,
  }

  await fs.writeJson(OUTPUT, summary, { spaces: 2 })

  console.log("Designer image coverage")
  console.log("-----------------------")
  console.log(`Designers with candidates: ${summary.total_designers_with_download_candidates}`)
  console.log(`8+ candidates: ${summary.designers_with_8_plus}`)
  console.log(`16+ candidates: ${summary.designers_with_16_plus}`)
  console.log(`8+ pattern-only: ${summary.designers_with_8_plus_pattern_only}`)
  console.log(`16+ pattern-only: ${summary.designers_with_16_plus_pattern_only}`)
  console.log("")
  console.log(`Saved: ${OUTPUT}`)
}

run()