import fs from "fs-extra"
import path from "path"
import matter from "gray-matter"

const designersDir = "wiki/designers/_staging"
const outputFile = "output/level2-websites.json"

async function run() {
  const files = await fs.readdir(designersDir)

  const results = []

  for (const file of files) {
    if (!file.endsWith(".md")) continue

    const fullPath = path.join(designersDir, file)

    const raw = await fs.readFile(fullPath, "utf8")
    const { data } = matter(raw)

    if (
      data.level === "level_2" &&
      data.website &&
      !data.website.includes("behance") &&
      !data.website.includes("linktr.ee")
    ) {
      results.push({
        name: data.name || "",
        slug: data.slug || "",
        website: data.website || "",
        instagram: data.instagram || "",
        md_file: fullPath,
      })
    }
  }

  await fs.outputJson(outputFile, results, { spaces: 2 })

  console.log(`✅ Extracted ${results.length} level_2 websites`)
  console.log(`✅ Saved → ${outputFile}`)
}

run()