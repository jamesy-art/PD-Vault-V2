const fs = require("fs");
const path = require("path");

const inputFile = "./csv/designers_1_cleaned.csv";

const mdOutputDir = path.join("wiki", "designers", "_staging");
const assetsOutputDir = path.join("wiki", "assets", "designers");

function cleanCell(value = "") {
  return String(value).trim().replace(/^"|"$/g, "");
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function toYamlKey(header) {
  return cleanCell(header)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function yamlEscape(value = "") {
  const str = cleanCell(value);
  if (!str) return `""`;
  return `"${str.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function getInstagramHandle(instagram = "") {
  return cleanCell(instagram)
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/^instagram\.com\//i, "")
    .replace(/^instagr\.am\//i, "")
    .split("?")[0]
    .replace(/\/$/g, "")
    .replace(/^@/, "")
    .trim();
}

function safeFileName(value = "") {
  return cleanCell(value)
    .replace(/^@/, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

if (!fs.existsSync(inputFile)) {
  console.error(`❌ Could not find ${inputFile}`);
  console.error("Run normalizeDesignersCsv.js first.");
  process.exit(1);
}

const csv = fs.readFileSync(inputFile, "utf8").trim();
const lines = csv.split(/\r?\n/);

const headers = parseCsvLine(lines[0]).map(cleanCell);
const normalizedHeaders = headers.map((h) => h.toLowerCase().trim());

const instagramIndex = normalizedHeaders.findIndex((h) =>
  ["instagram", "insta", "instagram_url"].includes(h)
);

const websiteIndex = normalizedHeaders.findIndex((h) =>
  ["website", "website_url", "site"].includes(h)
);

const levelIndex = normalizedHeaders.findIndex((h) =>
  ["level", "designer_level"].includes(h)
);

if (instagramIndex === -1) {
  console.error("❌ Could not find Instagram column.");
  process.exit(1);
}

fs.mkdirSync(mdOutputDir, { recursive: true });
fs.mkdirSync(assetsOutputDir, { recursive: true });

let created = 0;
let skipped = 0;

for (let i = 1; i < lines.length; i++) {
  const row = parseCsvLine(lines[i]);

  const instagram = cleanCell(row[instagramIndex]);
  const website = websiteIndex >= 0 ? cleanCell(row[websiteIndex]) : "";
  const level = levelIndex >= 0 ? cleanCell(row[levelIndex]) : "";

  const handle = getInstagramHandle(instagram);
  const fileName = safeFileName(handle);

  if (!fileName) {
    skipped++;
    continue;
  }

  const assetFolder = `wiki/assets/designers/${fileName}`;
  const designerAssetsDir = path.join(assetsOutputDir, fileName);

  fs.mkdirSync(path.join(designerAssetsDir, "profile"), { recursive: true });
  fs.mkdirSync(path.join(designerAssetsDir, "instagram"), { recursive: true });
  fs.mkdirSync(path.join(designerAssetsDir, "website"), { recursive: true });

  const mdPath = path.join(mdOutputDir, `${fileName}.md`);

  const yamlLines = [];
  yamlLines.push("---");

  headers.forEach((header, index) => {
    const key = toYamlKey(header);
    const value = cleanCell(row[index] || "");
    yamlLines.push(`${key}: ${yamlEscape(value)}`);
  });

  yamlLines.push(`instagram_handle: ${yamlEscape(handle)}`);
  yamlLines.push(`bio: ""`);
  yamlLines.push(`asset_folder: ${yamlEscape(assetFolder)}`);

  yamlLines.push("tags:");
  yamlLines.push("  - pattern_designer");

  if (level) {
    yamlLines.push(`  - ${level}`);
  }

  yamlLines.push("---");

  const markdown = `${yamlLines.join("\n")}

# ${handle}

## Profile Image

## Instagram Images

## Website Images


## Overview

## Style and Aesthetic

## Techniques and Tools

## Markets and Clients

## Portfolio and Presence

## Career Path

## Pattern Focus

## Connections
`;

  fs.writeFileSync(mdPath, markdown);
  created++;
}

console.log(`✅ Created ${created} MD files in: ${mdOutputDir}`);
console.log(`✅ Created asset folders in: ${assetsOutputDir}`);

if (skipped) {
  console.log(`⚠️ Skipped ${skipped} rows with no Instagram handle.`);
}