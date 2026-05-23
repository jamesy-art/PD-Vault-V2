import fs from "fs-extra"
import path from "path"

const INPUT_FILES = [
  "raw/featuredlist_posts_p1.json",
  "raw/featuredlist_posts_p2.json",
]

const OUTPUT_DIR = "output/instagram-posts"
const OUTPUT_ALL = `${OUTPUT_DIR}/scored-instagram-posts.json`
const OUTPUT_DOWNLOAD = `${OUTPUT_DIR}/download-candidates.json`
const OUTPUT_REVIEW = `${OUTPUT_DIR}/manual-review-candidates.json`
const OUTPUT_SKIP = `${OUTPUT_DIR}/skip-trash.json`
const OUTPUT_SUMMARY = `${OUTPUT_DIR}/score-summary.json`

const MIN_DOWNLOAD_SCORE = 60
const MIN_REVIEW_SCORE = 40

function arr(value) {
  return Array.isArray(value) ? value : []
}

function text(value = "") {
  return String(value || "").toLowerCase()
}

function includesAny(haystack, terms) {
  const h = text(haystack)
  return terms.some((term) => h.includes(term.toLowerCase()))
}

function hashtagText(post) {
  return arr(post.hashtags).join(" ").toLowerCase()
}

function combinedText(post) {
  return `${text(post.caption)} ${hashtagText(post)}`
}

function username(post) {
  return post["user.username"] || post.username || ""
}

function fullName(post) {
  return post["user.full_name"] || post.full_name || ""
}

const STRONG_PATTERN_TERMS = [
  "surface pattern",
  "surfacepatterndesign",
  "surfacepatterndesigner",
  "surface designer",
  "pattern designer",
  "pattern design",
  "patterndesign",
  "repeat pattern",
  "repeatpattern",
  "seamless pattern",
  "seamlesspattern",
  "textile design",
  "textiledesign",
  "textile designer",
  "print design",
  "printdesigner",
  "print designer",
  "fabric design",
  "fabricdesigner",
  "wallpaper designer",
  "wallpaperdesigner",
  "art licensing",
  "artlicensing",
]

const MEDIUM_PATTERN_TERMS = [
  "pattern",
  "patterns",
  "print",
  "prints",
  "fabric",
  "wallpaper",
  "textile",
  "surface",
  "collection",
  "colorway",
  "colourway",
  "repeat",
  "motif",
  "tile",
  "swatch",
  "seamless",
  "licensing",
  "licensed",
]

const MOTIF_TERMS = {
  Floral: ["floral", "flower", "flowers", "florals", "bloom", "botanical"],
  Botanical: ["botanical", "leaf", "leaves", "foliage", "plant", "plants"],
  Animal: ["animal", "bird", "birds", "cat", "dog", "tiger", "leopard", "zebra"],
  Geometric: ["geometric", "geo", "geometry", "abstract shapes"],
  Abstract: ["abstract", "abstracted"],
  Tropical: ["tropical", "palm", "jungle"],
  Paisley: ["paisley"],
  Character: ["character", "characters"],
  Typography: ["typography", "lettering", "hand lettering"],
  Food: ["food", "fruit", "fruits", "strawberry", "orange", "lemon"],
  Stars: ["star", "stars", "celestial"],
  Waves: ["wave", "waves"],
  Texture: ["texture", "textures"],
  Check: ["check", "checks", "checker", "checkerboard"],
  Stripes: ["stripe", "stripes"],
  Dots: ["dot", "dots", "polka"],
}

const STYLE_TERMS = {
  Vintage: ["vintage", "retro", "nostalgia", "storybook", "old tapestry"],
  Modern: ["modern", "contemporary", "minimal", "bold"],
  Traditional: ["traditional", "heritage", "classic"],
  Historical: ["historical", "victorian", "arts and crafts", "william morris"],
  Artistic: ["illustration", "illustrated", "hand drawn", "hand-drawn", "painted"],
}

const CATEGORY_TERMS = {
  "Home Decor": ["wallpaper", "home decor", "interiors", "interior", "quilt", "bedding"],
  Womenswear: ["womenswear", "dress", "fashion", "apparel"],
  Menswear: ["menswear"],
  Kidswear: ["kidswear", "children", "childrenswear", "baby"],
  Stationery: ["stationery", "calendar", "card", "cards", "bookmark", "planner"],
}

const POSITIVE_TERMS = [
  ...STRONG_PATTERN_TERMS,
  ...MEDIUM_PATTERN_TERMS,
  "floral",
  "botanical",
  "wallpaper",
  "fabric",
  "colorway",
  "colourway",
  "collection",
  "licensing",
  "home decor",
  "interiors",
  "print",
  "repeat",
  "seamless",
]

const HARD_TRASH_TERMS = [
  "fanart",
  "fan art",
  "sailormoon",
  "sailor moon",
  "anime",
  "manga",
  "kawaii",
  "dtiys",
  "draw this in your style",
  "selfie",
  "my face",
  "birthday",
  "holiday photo",
  "vacation",
]

const SOFT_TRASH_TERMS = [
  "giveaway",
  "sale",
  "discount",
  "shop update",
  "limited edition",
  "free shipping",
  "grab yours",
  "launching",
  "launch",
  "available now",
  "link in bio",
  "subscribe",
  "newsletter",
  "behind the scenes",
  "process video",
  "paint with me",
  "draw with me",
  "reel",
  "reels",
  "tutorial",
  "class",
  "course",
  "workshop",
  "calendar",
]

const PROCESS_TERMS = [
  "process",
  "sketch",
  "sketching",
  "paint with me",
  "draw with me",
  "tutorial",
  "procreate",
  "timelapse",
]

const PRODUCT_TERMS = [
  "mockup",
  "product",
  "products",
  "calendar",
  "bookmark",
  "card",
  "cards",
  "mug",
  "bag",
  "packaging",
  "shop",
  "for sale",
]

function findMatches(post, terms) {
  const body = combinedText(post)
  return terms.filter((term) => body.includes(term.toLowerCase()))
}

function mapTaxonomies(post, map) {
  const body = combinedText(post)
  return Object.entries(map)
    .filter(([, terms]) => terms.some((term) => body.includes(term.toLowerCase())))
    .map(([label]) => label)
}

function scorePost(post) {
  let score = 0
  const positive = []
  const negative = []

  const body = combinedText(post)
  const type = post.type || ""

  if (type === "Image") {
    score += 20
    positive.push("type:image")
  } else if (type === "Video") {
    score -= 25
    negative.push("type:video")
  } else {
    score -= 5
    negative.push("type:unknown")
  }

  if (post.image) {
    score += 10
    positive.push("has:image_url")
  } else {
    score -= 40
    negative.push("missing:image_url")
  }

  const strongMatches = findMatches(post, STRONG_PATTERN_TERMS)
  if (strongMatches.length) {
    score += Math.min(35, strongMatches.length * 12)
    positive.push(...strongMatches.map((m) => `strong:${m}`))
  }

  const mediumMatches = findMatches(post, MEDIUM_PATTERN_TERMS)
  if (mediumMatches.length) {
    score += Math.min(25, mediumMatches.length * 4)
    positive.push(...mediumMatches.slice(0, 6).map((m) => `medium:${m}`))
  }

  const motifMatches = mapTaxonomies(post, MOTIF_TERMS)
  if (motifMatches.length) {
    score += Math.min(15, motifMatches.length * 4)
    positive.push(...motifMatches.map((m) => `motif:${m}`))
  }

  if ((post.like_count || 0) >= 100) {
    score += 10
    positive.push("likes:100_plus")
  } else if ((post.like_count || 0) >= 50) {
    score += 6
    positive.push("likes:50_plus")
  } else if ((post.like_count || 0) >= 20) {
    score += 3
    positive.push("likes:20_plus")
  }

  if ((post.comment_count || 0) >= 10) {
    score += 5
    positive.push("comments:10_plus")
  } else if ((post.comment_count || 0) >= 3) {
    score += 2
    positive.push("comments:3_plus")
  }

  const hardTrash = findMatches(post, HARD_TRASH_TERMS)
  if (hardTrash.length) {
    score -= Math.min(60, hardTrash.length * 20)
    negative.push(...hardTrash.map((m) => `hard_trash:${m}`))
  }

  const softTrash = findMatches(post, SOFT_TRASH_TERMS)
  if (softTrash.length) {
    score -= Math.min(35, softTrash.length * 8)
    negative.push(...softTrash.slice(0, 6).map((m) => `soft_trash:${m}`))
  }

  const processMatches = findMatches(post, PROCESS_TERMS)
  if (processMatches.length) {
    score -= Math.min(20, processMatches.length * 6)
    negative.push(...processMatches.map((m) => `process:${m}`))
  }

  if (!includesAny(body, POSITIVE_TERMS)) {
    score -= 15
    negative.push("not_surface_pattern_specific")
  }

  score = Math.max(0, Math.min(100, score))

  return {
    score,
    positive,
    negative,
  }
}

function qualityBand(score) {
  if (score >= 85) return "excellent_candidate"
  if (score >= 70) return "good_candidate"
  if (score >= 60) return "usable_candidate"
  if (score >= 40) return "manual_review"
  return "trash_or_low_value"
}

function primaryClassification(post, scoreData) {
  const body = combinedText(post)

  if (scoreData.negative.some((s) => s.startsWith("hard_trash"))) return "trash"
  if (post.type === "Video" && scoreData.score < 70) return "process_or_video"
  if (includesAny(body, PRODUCT_TERMS)) return "product_mockup"
  if (includesAny(body, PROCESS_TERMS)) return "process"
  if (includesAny(body, ["wallpaper", "fabric", "repeat", "seamless", "pattern", "print"])) return "pattern"
  if (scoreData.score >= 60) return "placement"

  return "review"
}

function downloadDecision(score, primary) {
  if (score >= 75 && ["pattern", "placement", "product_mockup"].includes(primary)) {
    return { should_download: true, priority: "high" }
  }

  if (score >= MIN_DOWNLOAD_SCORE && ["pattern", "placement", "product_mockup"].includes(primary)) {
    return { should_download: true, priority: "normal" }
  }

  if (score >= MIN_REVIEW_SCORE) {
    return { should_download: false, priority: "review" }
  }

  return { should_download: false, priority: "skip" }
}

function scoreRecord(post) {
  const scoreData = scorePost(post)
  const primary = primaryClassification(post, scoreData)
  const motifs = mapTaxonomies(post, MOTIF_TERMS)
  const styles = mapTaxonomies(post, STYLE_TERMS)
  const categories = mapTaxonomies(post, CATEGORY_TERMS)
  const decision = downloadDecision(scoreData.score, primary)
  const user = username(post)

  return {
    pk: post.pk,
    username: user,
    full_name: fullName(post),
    post_url: post.post_url,
    image_url: post.image,
    type: post.type,
    date: post.date,
    caption: post.caption || "",
    hashtags: arr(post.hashtags),
    mentions: arr(post.mentions),

    metrics: {
      likes: post.like_count ?? null,
      comments: post.comment_count ?? null,
      views: post.view_count ?? null,
      video_duration: post.video_duration ?? null,
    },

    score: scoreData.score,
    quality_band: qualityBand(scoreData.score),

    classification: {
      primary,
      secondary: [...new Set([...motifs, ...styles, ...categories])],
      trash: primary === "trash" || scoreData.score < 40,
      needs_manual_review: scoreData.score >= 40 && scoreData.score < 60,
    },

    taxonomy_suggestions: {
      motifs,
      structures: includesAny(combinedText(post), ["repeat", "seamless", "pattern"])
        ? ["Repeat Pattern"]
        : [],
      styles,
      categories,
    },

    signals: {
      positive: scoreData.positive,
      negative: scoreData.negative,
    },

    download: {
      ...decision,
      target_folder: decision.should_download
        ? `wiki/assets/designers/${user}/instagram/candidates/`
        : null,
    },
  }
}

async function readInputFiles() {
  const all = []

  for (const file of INPUT_FILES) {
    if (!(await fs.pathExists(file))) {
      console.warn(`⚠️ Missing input: ${file}`)
      continue
    }

    const json = await fs.readJson(file)

    if (Array.isArray(json)) {
      all.push(...json)
    } else if (Array.isArray(json.data)) {
      all.push(...json.data)
    } else {
      console.warn(`⚠️ Unknown JSON shape: ${file}`)
    }
  }

  return all
}

function dedupePosts(posts) {
  const seen = new Set()
  const out = []

  for (const post of posts) {
    const key = post.pk || post.post_url || `${username(post)}-${post.image}`
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }

  return out
}

function buildSummary(scored) {
  const summary = {
    total: scored.length,
    excellent_candidate: 0,
    good_candidate: 0,
    usable_candidate: 0,
    manual_review: 0,
    trash_or_low_value: 0,
    should_download: 0,
    by_primary_classification: {},
    by_username: {},
  }

  for (const item of scored) {
    summary[item.quality_band]++

    if (item.download.should_download) summary.should_download++

    summary.by_primary_classification[item.classification.primary] =
      (summary.by_primary_classification[item.classification.primary] || 0) + 1

    if (!summary.by_username[item.username]) {
      summary.by_username[item.username] = {
        total: 0,
        should_download: 0,
        excellent_candidate: 0,
        good_candidate: 0,
        usable_candidate: 0,
        manual_review: 0,
        trash_or_low_value: 0,
      }
    }

    summary.by_username[item.username].total++
    summary.by_username[item.username][item.quality_band]++

    if (item.download.should_download) {
      summary.by_username[item.username].should_download++
    }
  }

  return summary
}

async function run() {
  console.log("Scoring Instagram posts...\n")

  const raw = await readInputFiles()
  const posts = dedupePosts(raw)

  console.log(`Loaded: ${raw.length}`)
  console.log(`After dedupe: ${posts.length}`)

  const scored = posts
    .map(scoreRecord)
    .sort((a, b) => b.score - a.score)

  const downloadCandidates = scored.filter((item) => item.download.should_download)
  const manualReview = scored.filter((item) => item.download.priority === "review")
  const skipTrash = scored.filter((item) => item.download.priority === "skip")

  const summary = buildSummary(scored)

  await fs.ensureDir(OUTPUT_DIR)

  await fs.writeJson(OUTPUT_ALL, scored, { spaces: 2 })
  await fs.writeJson(OUTPUT_DOWNLOAD, downloadCandidates, { spaces: 2 })
  await fs.writeJson(OUTPUT_REVIEW, manualReview, { spaces: 2 })
  await fs.writeJson(OUTPUT_SKIP, skipTrash, { spaces: 2 })
  await fs.writeJson(OUTPUT_SUMMARY, summary, { spaces: 2 })

  console.log("\nDone.")
  console.log(`Scored: ${scored.length}`)
  console.log(`Download candidates: ${downloadCandidates.length}`)
  console.log(`Manual review: ${manualReview.length}`)
  console.log(`Skip/trash: ${skipTrash.length}`)

  console.log("\nSaved:")
  console.log(OUTPUT_ALL)
  console.log(OUTPUT_DOWNLOAD)
  console.log(OUTPUT_REVIEW)
  console.log(OUTPUT_SKIP)
  console.log(OUTPUT_SUMMARY)
}

run()